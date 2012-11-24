define([
  'underscore',
  'backbone',
  'soundmanager',
  'model/doublemod',
  'text!template/text.html',
  'i18n!nls/common'
], function(_, Backbone, soundManager, Double, template, i18n){

  var bonusClasses = {
    'double': Double,
    // TODO
    'latinium': Double,
    'shuffle': Double
  };

  var TextView = Backbone.View.extend({

    template: template,

    i18n: i18n,

    className: 'text-view',

    model: null,

    editable: false,

    currentMod: null,

    opponent: null,

    events: {
      'keyup .input': '_onPlayerInput'
    },

    initialize: function(model, opponent, editable) {
      _.bindAll(this);
      this.model = model;
      this.opponent = opponent;
      this.editable = editable;
      this.bindTo(this.model, 'change:content', this._onContentChanged);
      this.bindTo(this.model, 'change:draft', this._onDraftChanged);
      this.bindTo(this.model, 'change:suite', this._onSuiteChanged);
      this.bindTo(this.model, 'change:score', this._onScoreChanged);
      this.render();
    },

    render: function() {
      Backbone.View.prototype.render.apply(this, arguments);
      this.$('.input').toggle(this.editable);
      this._onContentChanged();
      this._onDraftChanged();
    },

    _onPlayerInput: function(event) {   
      // 17 is ctrl: trigger bonus
      if (event.which === 17) {
        if (this.currentMod) {
          this.currentMod.trigger(this.opponent);
          this.model.set('suite', 0);
          this.currentMod = null;
        }
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
      if (this.editable) {
        soundManager.stopAll()
        soundManager.play('keystroke');
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
      this.$('.draft').html(content.replace(/ /g, '&ensp;'));
    },

    _onSuiteChanged: function() {
      var value = this.model.get('suite');

      console.log(value);

      if (value === 0) {
        // reset bonuses
        this.currentMod = null;
        this.$('.gauge').removeClass('full');
        this.$('.bonus').attr('class', 'bonus');
      } else {
        // goes from higher level and decrease
        for (var i = i18n.constants.bonus.length; i > 0; i--) {
          var spec = i18n.constants.bonus[i-1];
          if (value > spec.level) {
            var spec 
            this.$('.gauge.bonus-'+i).addClass('full');
            this.$('.bonus').attr('class', 'bonus '+spec.name);
            this.currentMod = new bonusClasses[spec.name]();
            console.log(this.model.get('player'), 'won new bonus', spec.name)
            break;
          }
        }
      }
    },

    _onScoreChanged: function() {
      this.$('.score').html(this.model.get('score'));
    }

  });

  return TextView;

});