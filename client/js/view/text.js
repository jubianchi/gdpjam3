define([
  'underscore',
  'backbone',
  'soundmanager',
  'model/doublemod',
  'text!template/text.html',
  'i18n!nls/common'
], function(_, Backbone, soundManager, Double, template, i18n){

  var TextView = Backbone.View.extend({

    template: template,

    i18n: i18n,

    className: 'text-view',

    model: null,

    editable: false,

    currentMod: null,

    events: {
      'keyup .input': '_onPlayerInput'
    },

    initialize: function(model, editable) {
      _.bindAll(this);
      this.model = model;
      this.editable = editable;
      this.bindTo(this.model, 'change:content', this._onContentChanged);
      this.bindTo(this.model, 'change:draft', this._onDraftChanged);
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
        // TODO
        this.currentMod = new Double();
        if (this.currentMod) {
          this.currentMod.trigger(this.model);
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
    }

  });

  return TextView;

});