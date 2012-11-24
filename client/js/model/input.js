define([
  'backbone',
], function(Backbone){

  // Model for input
  // 'content' is the attribute that contains the input text. Change it to update views
  // 'player' identifies the connected player
  var Input = Backbone.Model.extend({

    player: null,

    // player is sent to server
    constructor: function(player) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
      this.on('change:content', _.bind(this._onContentChanged, this));
    },

    _onContentChanged: function() {
      // Emit to server
      //gdpjam3.socket.emit('message', this.get('player'), this.get('content'));
    }


  });

  return Input;
});