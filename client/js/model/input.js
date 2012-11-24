define([
  'backbone',
], function(Backbone){

  // Model for input
  var Input = Backbone.Model.extend({

    initialize: function() {
      // content is the attriute that contains the input text. Change it to update views
      this.set('content', '');
    }
  });

  return Input;
});