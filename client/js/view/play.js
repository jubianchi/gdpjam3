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

    /*origin.clone().appendTo(view.$el).addClass('anim').transition({
      x: tPos.left-oPos.left,//+origin.width()/2,
      y: tPos.top-oPos.top,//+origin.height()/2,
      duration: 200
    }, _.bind(function() {
      $('.anim').remove();
      // animate bonus apply
      target.attr('class', 'bonus-applied '+this.sound+(view.editable ? '-1' : '-2'));
      target.clone().addClass('anim').appendTo(target.parent()).transition({
        opacity: 0, 
        scale: 1.5
      }, function() {
        $('.anim').remove();
        // empty bonus applied
        _.delay(function() {
          target.transition({
            opacity: 0
          }, function() {
            target.css('opacity', 1);
            target.attr('class', 'bonus-applied');
          });
        }, 2000);
      });
    }, this));*/
    },

    render: function() {
      Backbone.View.prototype.render.apply(this, arguments);
      // creates 2 input model and displays them in text views
      var player1 = new InputModel({player: gdpjam3.player, content:''});      
      var other = _.without(this.options.players, gdpjam3.player)[0];
      var player2 = new InputModel({player: other, content:''});

      this.$('.player1').empty().append(new TextView(player1, player2, true).$el);
      this.$('.player2').empty().append(new TextView(player2, player1, false).$el);

      console.info('current player', gdpjam3.player, 'other is', other);

      var text = i18n.constants.texts[0];

      if (this.options.mode === 'duel') {
        // display other player input
        gdpjam3.socket.on('message', function(player, content) {
          console.log('receive from '+player)
          if (player === player2.get('player')) {
            player2.set('content', content);
          }
        });
        // and send current player input
        player1.on('change:content', function() {
          var content = player1.get('content');
          if (!content) {
            return;
          }
          console.log('send to ' + player1.get('player'));
          gdpjam3.socket.emit('message', content);
        });
      }

      player1.set('draft', text);
      player2.set('draft', text);
      // Start music
      if(gdpjam3.sounds && gdpjam3.sounds.soundtrack) {
        gdpjam3.sounds.soundtrack.setVolume(10).play();
      }
      _.defer(this.focus);
    },

    _onToggleMusic: function(event) {
      event.preventDefault();
      event.stopImmediatePropagation();
      if(gdpjam3.sounds && gdpjam3.sounds.soundtrack) {
        gdpjam3.sounds.soundtrack.togglePlay();
      }
    }

  });

  return PlayView;

});