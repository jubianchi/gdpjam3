define([
  'underscore',
  'backbone',
  'text!template/home.html',
  'i18n!nls/common'
], function(_, Backbone, template, i18n){

  var HomeView = Backbone.View.extend({

    // Mustache template
    template: template,

    className: 'home-view',
    
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
    }

  });

  return HomeView;

});