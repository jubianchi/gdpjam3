define([
  'underscore',
  'backbone',
  'text!template/play.html',
  'i18n!nls/fr/common',
  'view/text',
  'model/input'
], function(_, Backbone, template, i18n, TextView, InputModel){

  var PlayView = Backbone.View.extend({

    // Mustache template
    template: template,

    className: 'play-view', 

    // i18n labels, buttons, tips...
    i18n: i18n,

    events: {
      'click': 'focus',
      'click .toggleMusic': '_onToggleMusic'
    },

    // View initialization: immediately displays the poll list
    initialize: function() {
      this.models = [];
      _.bindAll(this);
      this.render();
      this.focus();
      this.bindTo($(window), 'focus load', this.focus);
      gdpjam3.playView = this;
      this.emptyBonus = _.debounce(this.emptyBonus, 1500);
    },

    focus: function() {
      console.log('focus')
      this.$('.player1 .inner-text .input').focus();
    },

    emptyBonus: function() {
      this.$('.bonus-applied').attr('class', 'bonus-applied');
    },

    setBonus: function(player1, bonus) {
      var placeholder = this.$('.bonus-applied')
        .attr('class', 'bonus-applied '+bonus+(player1 ? '-1' : '-2'))
        .css('opacity', 0);
      var anim = this.$('.bonus-applied').clone().appendTo(this.$el);
      anim.transition({
        opacity: 1, 
        scale: 1.7
      }, 150, 'snap', _.bind(function() {
        placeholder.css('opacity', 1);
        anim.remove();
        this.emptyBonus();
      }, this));
    },

    render: function() {
      Backbone.View.prototype.render.apply(this, arguments);
      console.info('render')
      // creates 2 input model and displays them in text views
      this.models[0] = new InputModel({player: gdpjam3.player, content:''});      
      var other = _.without(this.options.players, gdpjam3.player)[0];
      this.models[1] = new InputModel({player: other, content:''});

      this.$('.player1').empty().append(new TextView(this.models[0], this.models[1], true).$el);
      this.$('.player2').empty().append(new TextView(this.models[1], this.models[0], false).$el);

      console.info('current player', gdpjam3.player, 'other is', other);

      var text = i18n.constants.texts[0];

      if (this.options.mode === 'duel') {
        // display other player input
        gdpjam3.socket.on('message', _.bind(function(player, content) {
          console.log('receive from '+player)
          if (player === this.models[1].get('player')) {
            this.models[1].set('content', content);
          }
        }, this));
        // and send current player input
        this.models[0].on('change:content', _.bind(function() {
          var content = this.models[0].get('content');
          if (!content) {
            return;
          }
          console.log('send to ' + this.models[0].get('player'));
          gdpjam3.socket.emit('message', content);
        }, this));
      }

      this.models[0].set('draft', text);
      this.models[1].set('draft', text);

      // start countdown
      this.countdown(3);
      _.defer(this.focus);
    },

    countdown: function(count) {
      if (count === 0) {
        // remove countdown
        $('.countdown,.modal').hide();
        // start race
        if (gdpjam3.sounds.start) {
          gdpjam3.sounds.start.setVolume(50).play();
        }
        this.models[0].start();
        this.models[1].start();
        // Start music
        if(gdpjam3.sounds && gdpjam3.sounds.soundtrack) {
          gdpjam3.sounds.soundtrack.setVolume(10).play();
        }
      } else {
        // Display count
        this.$('.countdown').html(count);
        _.delay(_.bind(function() {
          this.countdown(count-1);
        }, this), 1000);
      }
    },

    _onToggleMusic: function(event) {
      event.preventDefault();
      event.stopImmediatePropagation();
      if(gdpjam3.sounds && gdpjam3.sounds.soundtrack) {
        //gdpjam3.sounds.soundtrack.togglePlay();
      }
    }

  });

  return PlayView;

});