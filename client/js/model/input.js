define([
  'backbone'
], function(Backbone){

  // Model for input
  // 'content' is the attribute that contains the input text. Change it to update views
  // 'player' identifies the connected player
  var Input = Backbone.Model.extend({

    position: 0,

    textLength: 0,
    timer: null,

    // player is sent to server
    // local means no messages sent to server
    constructor: function(options) {
      _.bindAll(this);
      Backbone.Model.prototype.constructor.call(this, options);
    },

    checkInput: function(value) {
      var cleanValue = value          
        .replace('&ensp;', ' ')
        .replace(/<br\/>/g, ' ')
        .replace(/\s{2}/g, ' ')
      ;        

      //console.log(value, this.get('draft'));

      if(this.get('draft')) {
        var model = this.get('draft').substring(0, cleanValue ? cleanValue.length : 0);

        if(cleanValue !== model.replace(/(\r|\n|\r\n)/g, ' ')) {
          var word = this.get('content').match(/^\w+|\b\w?$/g) || [];
          value = this.get('content').replace(new RegExp(word[0] + '$', 'g'), '');            
        }

        if(model.match(/(\r|\n|\r\n)/g) && !value.match(/<br\/>/g)) {
          value = value + '<br/>';
          this.position -= 1;
        } 
      }

      this.position = cleanValue.length;
      return value;
    },

    set: function(name, value) {
      if(_.contains(['text', 'draft'], name) && value) {
        this.textLength = value.length;
      }

      if(name == 'content') {
        value = this.checkInput(value);
      }
      
      Backbone.Model.prototype.set.apply(this, [name, value]);

      if(name === 'draft' && this.get('player') == 'god' && this.timer === null) {
        this.typeChar();
      }
    },
 
    typeChar: function() {
      var char = this.get('draft').substring(this.position, (this.position + 1));

      if(char == '\n') {
        char = '<br/>';
      }

      if((error = this.isError(char))) {
        do {
          char = String.fromCharCode(char.charCodeAt(0) + this.random(-5, 5));
        } while(!char.match(/\w/g))              
      }

      this.set('content', this.get('content') + char);          

      //console.log(error, char);

      // god errors
      if(error) {
        var word = this.get('content').match(/\b\w+\b$/g) || [],
            content;

        if(word.length) {
          content = this.get('content').replace(new RegExp(word[0] + '$', 'g'), '');
          this.set('content', content);
        }        
      }

      if(this.position < (this.textLength - 1)) {
        this.timer = setTimeout(this.typeChar, this.getInterval());
      }
    },

    isError: function(char) {
      var min = 0,
          max = 1000,
          error = this.random(min, max);

      return (error > 950 && char.match(new RegExp("\w", "g")));
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