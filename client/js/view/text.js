define([
  'underscore',
  'backbone',
  'model/doublemod',
  'model/shufflemod',
  'model/latiniummod',
  'text!template/text.html',
  'levels/easy'
], function(_, Backbone, Double, Shuffle, Latinium, template, level){

  var bonusClasses = {
    'double': Double,
    'latinium': Latinium,
    'shuffle': Shuffle
  };

  var TextView = Backbone.View.extend({

    template: template,

    level: level,

    className: 'text-view',

    model: null,

    editable: false,

    currentMod: null,

    opponent: null,

    bonusDice: null,

    stopped: false,

    events: {
      'keyup .input': '_onPlayerInput'
    },

    initialize: function(model, opponent, editable) {
      _.bindAll(this);
      this.model = model;
      this.inhibit = false;
      this.opponent = opponent;
      this.editable = editable;
      this.stopped = false;
      this.bindTo(this.model, 'change:content', this._onContentChanged);
      this.bindTo(this.model, 'change:draft change:end', this._onDraftChanged);
      this.bindTo(this.model, 'change:suite', this._onSuiteChanged);
      this.bindTo(this.model, 'change:score', this._onScoreChanged);
      this.bindTo(this.model, 'change:avatar', this._onAvatarChanged);
      this.render();
    },

    render: function() {
      Backbone.View.prototype.render.apply(this, arguments);
      this.$('.input').toggle(this.editable);
      this.model.set('score', 0);
      this._onContentChanged();
      this._onDraftChanged();
      
      // for chaining purposes
      return this;
    },

    _onPlayerInput: function(event) {   
      if (this.stopped || event.which == 219) {
        return;
      };      
      // 17 is ctrl: trigger bonus
      if (event.which === 17) {
        this.applyMod();        
      } else {
        var key = this.$('.input').val();
        this.$('.input').val('');
        this.model.set('content', this.model.get('content')+key);

        if (this.model.won && this.model.get('player') !== 'god' && (
            key === '.' || event.which === 13)) {
          // player free time !
          this.$('.input').remove();
          this.model.trigger('finished');
        }
      }
    },

    _onContentChanged: function() {
      var content = this.model.get('content');
      if (content == null) {
        return;
      }
      // replace space by non breakable spaces.
      this.$('.text').html(content.replace(/ /g, '&ensp;'));
      // play sound only for us
      if (content && this.editable && gdpjam3.sounds) {
        // try to load one sound from the pool
        for (var i = 1; i <= 3; i++) {
          if (!gdpjam3.sounds['keystroke'+i].playing) {
            gdpjam3.sounds['keystroke'+i].play();
            break;
          }
        }
      }
      // set scrolls
      var height = this.$('.inner-text').height();
      var scrollHeight = this.$('.inner-text')[0].scrollHeight;
      if (scrollHeight > height) {
        this.$('.scrollable').scrollTop(scrollHeight);
      }
    },

    _onDraftChanged: function() {
      var content = this.model.get('draft');
      if (content == null) {
        return;
      }
      var end = this.model.get('end');
      this.$('.draft').html(content.replace(/ /g, '&ensp;')+'<br/>'+(end ? end.replace(/ /g, '&ensp;') : ''));
    },

    _onSuiteChanged: function() {
      var value = this.model.get('suite');

      if (value === 0) {
        // reset bonuses
        this.currentMod = null;
        this.$('.gauge').removeClass('full');
        this.$('.bonus:not(.anim)').attr('class', 'bonus');
        // display error feedback
        var caret = this.$('.input');
        caret.addClass('error');
        _.delay(function() {
          caret.removeClass('error');
        }, 300);
        // error sound
        if (!this.inhibit && this.editable && gdpjam3.sounds.error) {
          gdpjam3.sounds.error.play();
        }
        this.inhibit = false;
        this.$('.input').addClass('error');
      } else {
        // goes from higher level and decrease
        var i = _.size(this.level.bonus);
        for (var name in this.level.bonus) {
          if(this.level.bonus.hasOwnProperty(name)) {   
            //console.log(name, this.level.bonus);         
            var spec = this.level.bonus[name];
            if (value == spec.level) {
              this.$('.gauge.bonus-' + i).addClass('full');
              this.$('.bonus:not(.anim)').attr('class', 'bonus ' + name);
              this.currentMod = new bonusClasses[name](name, spec.proba, spec.score);
              break;
            }

            i--;
          }
        }

        if(this.model.get('player') == 'god' && this.currentMod) {        
          if(this.random(1, this.currentMod.proba) == this.currentMod.proba) {
            this.applyMod();
          }
        }
      }
    },

    _onScoreChanged: function() {
      this.$('.score').html(this.model.get('score'));
    },

    _onAvatarChanged: function() {
      if(this.model.get('avatar')) {
        this.$('.avatar')
          .removeClass('happy')
          .removeClass('mad')
          .addClass(this.model.get('avatar'))
        ;

        _.delay(
          _.bind(function() { 
            this.$('.avatar').removeClass(this.model.get('avatar')); 
            this.model.set('avatar', '');
          }, this), 
          2000
        );  
      }
    },

    applyMod: function() {
      if (this.currentMod) {
        this.model.set('avatar', 'happy');
        this.opponent.set('avatar', 'mad');        

        this.currentMod.trigger(this.opponent, this);
        this.inhibit = true;
        this.model.set('suite', 0);        
        this.currentMod = null;              
        this.model.trigger('triggerMod');
      }
    },

    random: function(min, max) {
      return Math.round(Math.random() * (max - min) + min);
    }

  });

  return TextView;

});