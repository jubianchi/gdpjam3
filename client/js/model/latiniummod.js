define([
  'underscore',
  'model/mod'
], function(_, Mod){


  // Latinium modification will insert one or many latin words after current word
  // (number of inserted word as parameter, possible words also)
  //
  // @param name [String] name of associated sound (optionnal)
  // @param options [Object] configuration options
  // @option options proba [Number] probability used by IA to trigger this mode
  // @option options score [Number] added to the player's score that triggers the bonus
  // @option options number [Number] number of words inserted (default to 2)
  // @option options words [Array] list of possible words to insert
  var Latinium = function(name, options) {
    Mod.apply(this, arguments);

    this.name = 'latinium';
    this.words = options.words;
    this.number = options.number || 2;
  };

  var random = function(min, max) { 
    return Math.floor(Math.random()*(max+1-min)+min); 
  }

  _.extend(Latinium.prototype, Mod.prototype, {

    process:function(text, position) {
      // limit cases
      if (position < 0 || position >= text.length) {
        return text
      }
      // ignore current word and look for next word.
      var analysed = text.substring(position); 
      var words = analysed.match(/^[^ \.,;\?!]*[ \.,;\?!]+/);
      if (!words) {
        // no word found, returns original text
        return text
      }
      position += words[0].length;
      var result = text;

      // performs operation the number of awaited times
      var remains = this.number;
      while(remains > 0) {
        analysed = result.substring(position); 
        var num = 0;
        // search next 2 words, using ' ', '.', ',', '!' and '?' as word delimiters.
        //             word chars and delimiters - 1st word   - delimiters - rest
        words = analysed.match(/^([ \.,;\?!]*)([^ \.,;\?!]*)(.*)/);
        if (!words || !words[2]) {
          // no word found, returns original text
          return result
        }
        // add text before first word, replace first word by inserted.
        var inserted = this.words[random(0, this.words.length-1)]
        result = result.substring(0, position)+words[1]+inserted; 
        if (words[3]) {
          // add text after first word
          result += words[3];
        }
        // increment position and try to modified another time
        position += words[1].length+inserted.length;
        remains--;
      }
      return result;
    }

  });

  return Latinium;
});