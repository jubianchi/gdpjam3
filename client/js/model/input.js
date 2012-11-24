define([
  'backbone',
  'i18n!nls/fr/common'
], function(Backbone, i18n){

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
        .replace(/\s{2}/g, ' ')
      ;

      if(this.get('draft')) {
        var model = this.get('draft').substring(0, cleanValue ? cleanValue.length : 0);

        if(cleanValue !== model.replace(/(\r|\n|\r\n)/g, ' ')) {
          var word = this.get('content').substring(this.get('content').lastIndexOf(' ') + 1);

          value = this.get('content').replace(new RegExp(word + '$', 'g'), '');

          this.set('suite', 0);
          this.position = cleanValue.length - word.length;
        } else {
          this.set('suite', (this.get('suite') || 0) + 1);
          this.position = cleanValue.length;
        }
      }

      return value;
    },

    set: function(name, value) {
      if(name === 'draft' && value) {
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

      error = this.isError(char);

      if(error) {
        do {
          char = String.fromCharCode(char.charCodeAt(0) + this.random(-5, 5));
        } while(!char.match(/\w/g))              
      }

      this.set('content', this.checkInput(this.get('content') + char));

      if(this.position < (this.textLength - 1)) {
        this.timer = setTimeout(this.typeChar, this.getInterval());
      }
    },

    isError: function(char) {
      var min = 0,
          max = i18n.constants.god.error.max,
          error = this.random(min, max);

      return (
        error > i18n.constants.god.error.threshold &&
        char.match(/\w/) == null
      );
    },

    getInterval: function() {
      var multiplier = this.computeSpeed(),
          min = i18n.constants.god.typing.min * multiplier,
          max = i18n.constants.god.typing.max * multiplier;

      return this.random(min, max);
    },    

    computeSpeed: function() {
      var percent = this.position / this.textLength,
          multiplier = i18n.constants.god.typing.speedmulti - percent;

      return multiplier;
    },

    random: function(min, max) {
      return Math.random() * (max - min) + min;
    }

  });

  return Input;
});