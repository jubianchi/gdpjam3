define([
  'underscore',
  'backbone',
  'text!template/play.html',
  'i18n!nls/fr/common',
  'view/text',
  'model/player'
], function(_, Backbone, template, i18n, TextView, PlayerModel){

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

    // View initialization:
    initialize: function() {
      this.models = [];
      this.views = [];
      _.bindAll(this);
      this.bindTo($(window), 'focus load', this.focus);
      this.emptyBonus = _.debounce(this.emptyBonus, 1500);
    },

    focus: function() {
      this.$('.player1 .inner-text .input > input').focus();
    },

    emptyBonus: function() {
      this.$('.bonus-applied').attr('class', 'bonus-applied');
    },

    setBonus: function(player1, bonus) {
      var placeholder = this.$('.bonus-applied')
        .attr('class', 'bonus-applied '+bonus+(player1 ? '-1' : '-2'));
      var anim = this.$('.bonus-applied').clone().appendTo(this.$el);
      anim.on('transitionend webkitTransitionEnd', _.bind(function() {
        this.$('.anim').remove();
        this.emptyBonus();
      }, this)).addClass('anim');
      _.defer(function() {
        anim.addClass('animated');
      });
    },

    // stops the game: may only stop player (player=true); it's oponent (player=false) or both (no value)
    stop: function(player) {
      if (this.models.length === 2 && this.views.length === 2) {
        // stop player
        if (player === true || player === undefined) {
          this.models[0].stop();
          this.views[0].stopped = true;
        }
        // stop opponent
        if (player === false || player === undefined) {
          this.models[1].stop();
          this.views[1].stopped = true;
        }
      }
      // stop music
      if(gdpjam3.sounds && gdpjam3.sounds.soundtrack) {
        gdpjam3.sounds.soundtrack.fadeOut(5000);
      }
    },

    render: function() {
      Backbone.View.prototype.render.apply(this, arguments);
      // creates 2 input model and displays them in text views
      this.models[0] = new PlayerModel({player: gdpjam3.player, content:''});
      var other = _.without(this.options.players, gdpjam3.player)[0];
      this.models[1] = new PlayerModel({player: other, content:''});

      this.views[0] = new TextView(this.models[0], this.models[1], true);
      this.views[1] = new TextView(this.models[1], this.models[0], false);
      this.$('.player1').empty().append(this.views[0].$el);
      this.$('.player2').empty().append(this.views[1].$el);

      console.info('current player', gdpjam3.player, 'other is', other);

      
      if (this.options.mode === 'duel') {
        // display other player input
        gdpjam3.socket.on('message', _.bind(function(player, content) {
          //console.log('receive from '+player)
          if (player === this.models[1].get('player')) {
            this.models[1].set('content', content);
          }
        }, this));

        gdpjam3.socket.on('trigger', _.bind(function(player) {
          console.log('bonus triggered from ' + player);
          this.views[1].applyMod();
        }, this));

        this.models[0].on('triggerMod', _.bind(function() {
          console.log('send triggered bonus to ' + this.models[1].get('player'));
          gdpjam3.socket.emit('trigger');
        }, this));
        
        // and send current player input
        this.models[0].on('change:content', _.bind(function() {
          var content = this.models[0].get('content');
          if (!content) {
            return;
          }
          //console.log('send to ' + this.models[0].get('player'));
          gdpjam3.socket.emit('message', content);
        }, this));

        
      }

      this.bindTo(this.models[0], 'won', _.bind(function() {
        // stops the opponent
        this.stop(false);
        // player free time !
        this.models[0].on('finished', _.bind(function() {
          if (this.options.mode === 'duel') {
            gdpjam3.socket.emit('finished');
          }
          this.win();
        }, this));
      }, this));
      this.bindTo(this.models[1], 'won', _.bind(function() {
        // stops player
        this.stop(true);
        if (this.options.mode === 'duel') {
          gdpjam3.socket.on('finished', this.loose);
        } else {
          this.models[1].on('finished', this.loose);
        }
      }, this));

      // start countdown
      this.countdown(3);
      if (gdpjam3.sounds && gdpjam3.sounds.soundtrackMenu) {
        gdpjam3.sounds.soundtrackMenu.stop();
      }
      _.delay(_.bind(function() {
        // wait for DOM to be attached to display text and give focus
        var text = i18n.msgs.texts[0];
        this.models[0].set('draft', text);
        this.models[0].set('end', i18n.msgs.ends1[0]);
        this.models[1].set('draft', text);
        this.models[1].set('end', i18n.msgs.ends2[0]);
        this.focus();
      }, this), 300);

      // for chaining purposes
      return this;
    },

    countdown: function(count) {
      if (count === 0) {
        // remove countdown
        $('.countdown,.modal').hide();
        // start race
        if (gdpjam3.sounds.start) {
          gdpjam3.sounds.start.setVolume(20).play();
        }
        if (gdpjam3.sounds.write) {
          gdpjam3.sounds.write.play();
        }
        this.views[0].start();
        this.views[1].start();
        // Start music
        if(gdpjam3.sounds && gdpjam3.sounds.soundtrack) {
          gdpjam3.sounds.soundtrack.setVolume(20).play();
        }
      } else {
        // Display count
        this.$('.countdown').html(count);
        if (gdpjam3.sounds['countdown'+count]) {
          gdpjam3.sounds['countdown'+count].play();
        }
        _.delay(_.bind(function() {
          this.countdown(count-1);
        }, this), 1000);
      }
    },

    win: function() {
      $('.modal, .countdown').show();
      this.$el.addClass('win');
      this.$('.countdown').addClass('win').html('');
    },

    loose: function() {
      $('.modal, .countdown').show();
      this.$el.addClass('lost');
      this.$('.countdown').addClass('lost').html('');
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