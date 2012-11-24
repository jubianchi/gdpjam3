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
      return text+' coucou';
    }
  });

  return Double;
});