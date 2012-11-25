define([
  'underscore',
  'backbone',
  'model/doublemod',
  'model/shufflemod',
  'model/latiniummod',
  'text!template/text.html',
  'i18n!nls/fr/common'
], function(_, Backbone, Double, Shuffle, Latinium, template, i18n){

  var bonusClasses = {
    'double': Double,
    'latinium': Latinium,
    'shuffle': Shuffle
  };

  var TextView = Backbone.View.extend({

    template: template,

    i18n: i18n,

    className: 'text-view',

    model: null,

    editable: false,

    currentMod: null,

    opponent: null,

    bonusDice: null,

    events: {
      'keyup .input': '_onPlayerInput'
    },

    initialize: function(model, opponent, editable) {
      _.bindAll(this);
      this.model = model;
      this.inhibit = false;
      this.opponent = opponent;
      this.editable = editable;
      this.bindTo(this.model, 'change:content', this._onContentChanged);
      this.bindTo(this.model, 'change:draft change:end', this._onDraftChanged);
      this.bindTo(this.model, 'change:suite', this._onSuiteChanged);
      this.bindTo(this.model, 'change:score', this._onScoreChanged);
      this.render();
    },

    render: function() {
      Backbone.View.prototype.render.apply(this, arguments);
      this.$('.input').toggle(this.editable);
      this.model.set('score', 0);
      this._onContentChanged();
      this._onDraftChanged();
    },

    _onPlayerInput: function(event) {   
      // 17 is ctrl: trigger bonus
      if (event.which === 17) {
        this.applyMod();
      } else {
        var key = this.$('.input').val();
        this.$('.input').val('');
        this.model.set('content', this.model.get('content')+key);
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
      this.$('.draft').html(content.replace(/ /g, '&ensp;')+'<br/>'+this.model.get('end'));
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
        for (var i = i18n.constants.bonus.length; i > 0; i--) {
          var spec = i18n.constants.bonus[i-1];
          if (value > spec.level) {
            this.$('.gauge.bonus-'+i).addClass('full');
            this.$('.bonus:not(.anim)').attr('class', 'bonus '+spec.name);
            this.currentMod = new bonusClasses[spec.name](spec.name);
            this.bonusDice = this.random(0, spec.proba)
            break;
          }
        }

        if(this.model.get('player') == 'god') {        
          if(this.bonusDice > spec.proba - 1) {
            if(this.random(0, spec.proba) > (spec.proba * 0.7)) this.applyMod();
          }
        }
      }
    },

    _onScoreChanged: function() {
      this.$('.score').html(this.model.get('score'));
    },

    applyMod: function() {
      if (this.currentMod) {
        this.currentMod.trigger(this.opponent, this);
        this.inhibit = true;
        this.model.set('suite', 0);
        this.currentMod = null;
        this.model.trigger('triggerMod');
      }
    },

    random: function(min, max) {
      return Math.random() * (max - min) + min;
    }

  });

  return TextView;

});