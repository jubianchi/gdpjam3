define([
  'backbone',
  'levels/easy'
], function(Backbone, level){

  // Model for player input
  // 'content' is the attribute that contains the input text. Change it to update views
  // 'player' identifies the connected player
  var Player = Backbone.Model.extend({

    position: 0,
    textLength: 0,
    timer: null,
    tmpContent: null,
    started: false,
    won: false,
    level: level,

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

      // multi player case: the other player have done an error
      if (this.position > value.length) {
        // simulate an error
        value += '-error-';
      }

      this.tmpContent = (this.tmpContent  || this.get('content'));
      var typed = value.length - (this.tmpContent  || '').length;
      this.tmpContent = value;

      if(typed == 0) return value;

      var model = this.get('draft').substring(0, value ? value.length : 0);

      if(this.level.options.spaceopt) {
        if(model[model.length - typed] === ' ' && value[value.length - typed] !== ' ') {
          value = value.substring(0, value.length - typed) + ' ' + value.substring(value.length - typed);
          model = this.get('draft').substring(0, value ? value.length : 0);
          this.position++;
        }
      }

      if(value !== model) {
        this.set('avatar', 'mad');
        var word = this.get('content').substring(this.get('content').lastIndexOf(' ') + 1);

        word = word.replace('.', '\.').replace('?', '\?');
        value = this.get('content').replace(new RegExp(word + '$', 'g'), '');

        this.set('suite', 0);
        this.set('score', this.get('score') ? this.get('score') - word.length : 0);
        this.position = value.length - (word.length + 1);
      } else {
        this.set('suite', (this.get('suite') || 0) + 1);
        this.set('score', (this.get('score') || 0) + 1);
        this.position = value.length;
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
          // add a new line, and do not forget the space to allow word recognition
          value = this.get('content')+'\n ';
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

      if(error && this.get('draft').substring(this.position, this.position + 1) != ' ') {
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
      if (this.won) {
        return false;
      }
      var min = 0,
          max = this.level.god.error.max,
          error = this.random(min, max);

      return (
        error > this.level.god.error.threshold &&
        char.match(/\w/) == null
      );
    },

    getInterval: function() {
      var min = this.level.god.typing.min,
          max = this.level.god.typing.max;

      return this.random(min, max);
    },    

    random: function(min, max, round) {
      var rand = Math.round(Math.random() * (max - min) + min);;
      if(round == null || round) rand = Math.round(rand);

      return rand;
    }

  });

  return Player;
});