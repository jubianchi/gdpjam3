define([
  'underscore',
  'backbone',
  'text!template/text.html',
  'i18n!nls/common'
], function(_, Backbone, template, i18n){

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
      this.bindTo(this.model, 'change', this._onContentChanged);
      this.render();
    },

    render: function() {
      Backbone.View.prototype.render.apply(this, arguments);
      this.$('.input').toggle(this.editable);
      this._onContentChanged();
    },

    _onPlayerInput: function(event) {   
      var key = this.$('.input').val();
      this.$('.input').val('');
      this.model.set('content', this.model.get('content')+key);
    },

    _onContentChanged: function() {
      // replace space by non breakable spaces.
      var content = this.model.get('content');
      if (!content) {
        return;
      }
      this.$('.text').html(content.replace(/ /g, '&ensp;'));
    }

  });

  return TextView;

});