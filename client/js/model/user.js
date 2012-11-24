define([
  'backbone',
], function(Backbone){

  // Model for user
  var User = Backbone.Model.extend({
    urlRoot: '/api/getUser'
  });

  return User;
});