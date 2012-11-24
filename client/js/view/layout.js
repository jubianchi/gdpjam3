define([
  'underscore',
  'backbone',
  'text!template/layout.html',
  'i18n!nls/common',
  'view/text',
  'model/input'
], function(_, Backbone, template, i18n, TextView, InputModel){

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
      // creates 2 input model and displays them in text views
      var player1 = new InputModel();
      this.$('.player1').empty().append(new TextView(player1, true).$el);
      var player2 = new InputModel();
      this.$('.player2').empty().append(new TextView(player2, false).$el);
    }

  });

});