define([
  'backbone',
], function(Backbone){

  // Model for input
  // 'content' is the attribute that contains the input text. Change it to update views
  // 'player' identifies the connected player
  var Input = Backbone.Model.extend({

    // player is sent to server
    // local means no messages sent to server
    constructor: function(options) {
      Backbone.Model.prototype.constructor.call(this, options);
    },

  });

  return Input;
});