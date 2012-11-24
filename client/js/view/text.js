define([
  'underscore',
  'backbone',
  'soundmanager',
  'text!template/text.html',
  'i18n!nls/common'
], function(_, Backbone, soundManager, template, i18n){

  var TextView = Backbone.View.extend({

    template: template,

    i18n: i18n,

    className: 'text-view',

    model: null,

    editable: false,

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
      var key = this.$('.input').val();
      this.$('.input').val('');
      this.model.set('content', this.model.get('content')+key);
    },

    _onContentChanged: function() {
      var content = this.model.get('content');
      if (!content) {
        return;
      }
      // replace space by non breakable spaces.
      this.$('.text').html(content.replace(/ /g, '&ensp;'));
      // play sound only for us
      if (this.editable) {
        soundManager.stopAll()
        soundManager.play('keystroke');
      }
      var scroller = $('.inner-text');
      scroller.scrollTop(scroller.height());
    },

    _onDraftChanged: function() {
      var content = this.model.draft;
      if (!content) {
        return;
      }
      this.$('.draft').html(content.replace(/ /g, '&ensp;'));
    }

  });

  return TextView;

});