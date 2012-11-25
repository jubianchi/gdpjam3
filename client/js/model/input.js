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

    tmpContent: null,

    started: false,

    won: false,

    // player is sent to server
    // local means no messages sent to server
    constructor: function(options) {
      _.bindAll(this);
      this.won = false;
      this.position = 0;
      this.textLength = 0;
      this.tmpContent = null;
      this.started = false;
      Backbone.Model.prototype.constructor.call(this, options);
    },

    start: function(value) {
      this.started = true;
      if(this.get('player') === 'god' && this.timer === null) {
        this.typeChar();
      }
    },

    stop: function() {
      if(this.get('player') === 'god' && this.timer !== null) {
        clearTimeout(this.timer);
      }
    },

    checkInput: function(value) {
      if (this.won) {
        // no check if won
        this.position++;
        return value;
      }
      if(!value || !this.started) return '';

      this.tmpContent = (this.tmpContent  || this.get('content'));
      var typed = value.length - (this.tmpContent  || '').length;
      this.tmpContent = value;

      var cleanValue = value.replace('&ensp;', ' ');

      if(typed == 0) return value;

      if(this.get('draft')) {
        var model = this.get('draft').substring(0, cleanValue ? cleanValue.length : 0);

        if(i18n.constants.options.spaceopt) {
          if(model[model.length - typed] == ' ' && value[value.length - typed] != ' ') {
            value = value.substring(0, value.length - typed) + ' ' + value.substring(value.length - typed, value.length);
            cleanValue = cleanValue.substring(0, cleanValue.length - typed) + ' ' + cleanValue.substring(cleanValue.length - typed, cleanValue.length);
            model = this.get('draft').substring(0, cleanValue ? cleanValue.length : 0);

            this.position++;
          }
        }

        if(cleanValue !== model) {
          var word = this.get('content').substring(this.get('content').lastIndexOf(' ') + 1);

          value = this.get('content').replace(new RegExp(word + '$', 'g'), '');

          this.set('suite', 0);
          this.set('score', (this.get('score') || 1) - word.length);
          this.position = cleanValue.length - word.length;
        } else {
          this.set('suite', (this.get('suite') || 0) + 1);
          this.set('score', (this.get('score') || 0) + 1);
          this.position = cleanValue.length;
        }
      }

      return value;
    },

    set: function(name, value) {
      if(name === 'draft' && value) {
        this.textLength = value.length;
      }

      // Just for players !
      if(name == 'content' && this.get('player') !== 'god') {
        if (this.get('content') === this.get('draft')) {
          console.info('Player', this.get('player'), 'win !');
          value = this.get('content')+'<br/>';
          this.won = true;
          this.trigger('won');
        } else {
          value = this.checkInput(value);
        }
      }
      
      Backbone.Model.prototype.set.apply(this, [name, value]);
    },
 
    typeChar: function() {
      var txt = this.won ? this.get('end') : this.get('draft');
      var char = txt.substring(this.position, (this.position + 1));

      error = this.isError(char);

      if(error) {
        do {
          char = String.fromCharCode(char.charCodeAt(0) + this.random(-5, 5));
        } while(!char.match(/\w/g))              
      }

      this.set('content', this.checkInput(this.get('content') + char));

      if(this.position < this.textLength) {
        this.timer = setTimeout(this.typeChar, this.getInterval());
      } else {
        if (this.won) {
          // already won
          console.info('Player', this.get('player'), 'has finished !');
          this.trigger('finished');
          return;
        }
        this.trigger('won');
        console.info('Player', this.get('player'), 'win !');
        this.won = true;
        this.set('content', this.get('content')+'<br/>');
        this.textLength = this.get('end').length;
        this.position = 0;
        clearTimeout(this.timer);
        this.timer = setTimeout(this.typeChar, this.getInterval());
      }
    },

    isError: function(char) {
      // TODO if (this.won) {
        return false;
      //}
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