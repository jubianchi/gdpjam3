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

    position: 0,
    textLength: 0,
    text: null,

    events: {
      'keyup .input': '_onPlayerInput'
    },

    initialize: function(model, editable, text) {
        _.bindAll(this);
        this.model = model;
        this.editable = editable;
        this.text = text;
        this.textLength = this.text ? text.length : 0;
        this.bindTo(this.model, 'change', this._onContentChanged);
        this.render();
    },

    render: function() {
      Backbone.View.prototype.render.apply(this, arguments);
      this.$('.input').toggle(this.editable);
      this._onContentChanged();

      if(!this.editable && this.text) {
        this.typeChar();
      }
    },

    typeChar: function() {
      var char = this.text.substring(this.position, (this.position + 1));
          this.position++;

      if(char == '\n') {
        char = '<br/>';
      }

      this.model.set('content', this.model.get('content') + char.replace(/ /g, '&nbsp;'));

      if(this.position < (this.textLength - 1)) {
        setTimeout(this.typeChar, this.getInterval());
      }
    },

    getInterval: function() {
      var multiplier = this.computeSpeed(),
          min = 100 * multiplier,
          max = 350 * multiplier;

      return Math.random() * (max - min) + min;
    },

    computeSpeed: function() {
      var percent = this.position / this.textLength,
          multiplier = 1 - percent;

      return multiplier;
    },

    _onPlayerInput: function(event) { 
      var key = this.$('.input').val();
      this.$('.input').val('');
      this.model.set('content', this.model.get('content')+key);
    },

    _onContentChanged: function() {
      // replace space by non breakable spaces.
      this.$('.text').html(this.model.get('content').replace(/ /g, '&nbsp;'));
    }

  });

  return TextView;

});