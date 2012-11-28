define([
  'underscore',
  'model/mod'
], function(_, Mod){

  // Model for input
  var Double = function() {
    Mod.apply(this, arguments);

    this.name = 'double';
  };

  _.extend(Double.prototype, Mod.prototype, {

    process:function(text, position) {
      // limit cases
      if (position < 0 || position >= text.length) {
        return text
      }

      var analysed = text.substring(position); 
      // search next 2 words, using ' ', '.', ',', '!' and '?' as word delimiters.
      //                         word chars and delimiters - 1st word     - delimiters - 2nd word    - rest
      var words = analysed.match(/^([^ \.,;\?!]*[ \.,;\?!]+)([^ \.,;\?!]*)([ \.,;\?!]*)([^ \.,;\?!]*)?(.*)/)
      if (!words || !words[2]) {
        // no word found, returns original text
        return text
      }
      // add text before first word, double first word.
      var result = text.substring(0, position)+words[1]+words[2].replace(/(.)/g, '$1$1'); 
      if (words[3]) {
        // add text after first word
        result += words[3];
        if (words[4]) {
          result += words[4].replace(/(.)/g, '$1$1')
          if (words[5]) {
            result += words[5];
          }
        }
      }
      return result;
    }
  });

  return Double;
});