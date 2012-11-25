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

      var words = text.substring(position).match(/(\w*) (\w*)/),
          r1 = words[1].replace(/(\w)/g, '$1$1');
          r2 = words[2].replace(/(\w)/g, '$1$1');

      return text.substring(0, position) + text.substring(position).replace(words[1] + ' ' + words[2], r1 + ' ' + r2);
    }
  });

  return Double;
});