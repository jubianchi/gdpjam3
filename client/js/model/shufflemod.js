define([
  'underscore',
  'model/mod'
], function(_, Mod){

  // Shuffle modification will shuffle every letters in the previous words 
  // (number of affected word as parameter)
  //
  // @param name [String] name of associated sound (optionnal)
  // @param options [Object] configuration options
  // @option options proba [Number] probability used by IA to trigger this mode
  // @option options score [Number] added to the player's score that triggers the bonus
  // @option options number [Number] number of times replacement are performed (default to 2)
  var Shuffle = function(name, options) {
    Mod.apply(this, arguments);

    this.name = 'shuffle';
    this.number = options.number || 2;
  };

  _.extend(Shuffle.prototype, Mod.prototype, {

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
        // add text before first word, double first word.
        result = result.substring(0, position)+words[1]+_.shuffle(words[2]).join(''); 
        if (words[3]) {
          // add text after first word
          result += words[3];
        }
        // increment position and try to modified another time
        position += words[1].length+words[2].length;
        remains--;
      }
      return result;
    }
  });

  return Shuffle;
});