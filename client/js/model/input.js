define([
  'backbone'
], function(Backbone){

  // Model for input
  // 'content' is the attribute that contains the input text. Change it to update views
  // 'player' identifies the connected player
  var Input = Backbone.Model.extend({

    position: 0,

    textLength: 0,

    // player is sent to server
    // local means no messages sent to server
    constructor: function(options) {
      _.bindAll(this);
      Backbone.Model.prototype.constructor.call(this, options);
    },

    set: function(name, value) {
      Backbone.Model.prototype.set.apply(this, arguments);
      if(name === 'text' && value) {
        this.textLength = value.length;
        this.typeChar();
      }
    },
 
    typeChar: function() {
      var char = this.get('text').substring(this.position, (this.position + 1));
      this.position++;

      if(char == '\n') {
        char = '<br/>';
      }

      if((error = this.isError(char))) {
        do {
          char = String.fromCharCode(char.charCodeAt(0) + this.random(-5, 5));
        } while(!char.match(/\w/g))              
      }

      this.set('content', this.get('content') + char);          

      if(error) {
        var word = this.get('content').match(/\b\w+$/g) || [],
            content;


        if(word.length) {
          content = this.get('content').replace(new RegExp(word[0] + '$', 'g'), '')

          this.position -= word[0].length;
          this.set('content', content);
        }        
      }

      if(this.position < (this.textLength - 1)) {
        setTimeout(this.typeChar, this.getInterval());
      }
    },

    isError: function(char) {
      var min = 0,
          max = 1000,
          error = this.random(min, max);

      return (error > 950 && char.match(/\w/g));
    },

    getInterval: function() {
      var multiplier = this.computeSpeed(),
          min = 100 * multiplier,
          max = 250 * multiplier;

      return this.random(min, max);
    },    

    computeSpeed: function() {
      var percent = this.position / this.textLength,
          multiplier = 1 - percent;

      return multiplier;
    },

    random: function(min, max) {
      return Math.random() * (max - min) + min;
    }

  });

  return Input;
});