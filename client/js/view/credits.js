define([
  'underscore',
  'backbone',
  'text!template/credits.html',
  'i18n!nls/common'
], function(_, Backbone, template, i18n){
  var CreditsView = Backbone.View.extend({    
    template: template,
    className: 'home-view',
    i18n: i18n,
    events: {
    },
    
    initialize: function() {
      _.bindAll(this);
      this.render();
    },

    render: function() {
      Backbone.View.prototype.render.apply(this, arguments);
    }

  });

  return CreditsView;
});