define([
  'underscore',
  'model/mod'
], function(_, Mod){

  // Model for input
  var Double = function() {
    Mod.apply(this, arguments);
  };

  _.extend(Double.prototype, Mod.prototype, {

    process:function(text, position) {
      var words = 0;
      position++;

      while(text.substring(position, position + 1) != ' ') position++;
      position++;

      while(words < 2) {
        text = text.substring(0, position) + text.substring(position).replace(/(\w)/i, '$1$1');
        position += 2;

        if(text.substring(position, position + 1) == ' ') {
          position++;
          words++;
        }
      }

      return text;
    }
  });

  return Double;
});