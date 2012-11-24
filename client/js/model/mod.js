define([
], function(){

  // Model for input
  var Mod = function() {
  };

  // Call to invoke bonus on an input draft
  Mod.prototype.trigger = function(input) {
    var draft = input.get('draft');
    input.set('draft', this.process(draft, input.position));
    console.log(input.get('draft'))
  };

  // must return modified draft text.
  // text = original draft
  // position = current edition position
  Mod.prototype.process = function(text, position) {
    throw Error('to be implemented');
  };

  return Mod;
});