define([
  'underscore',
  'backbone',
  'text!template/layout.html',
  'i18n!nls/common'
], function(_, Backbone, template, i18n){

  return Backbone.View.extend({

    // Mustache template
    template: template,

    // i18n labels, buttons, tips...
    i18n: i18n,

    events: {
    },

    // View initialization: immediately displays the poll list
    initialize: function() {
      _.bindAll(this);
      this.render();
    },

    render: function() {
      Backbone.View.prototype.render.apply(this, arguments);
      this.$('.player1').html('player 1');
      this.$('.player2').html('player 2');
    }

  });

});