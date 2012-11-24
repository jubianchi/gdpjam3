define([
], function(){

  // Model for input
  var Mod = function() {
  };

  // Call to invoke bonus on an input draft
  Mod.prototype.trigger = function(input) {
    var draft = input.get('draft');

    if(draft) {
      console.log('draft');
      input.set('draft', this.process(draft, input.position));
      console.log(input.get('draft'))
    } else {
      draft = input.get('text');
      input.set('text', this.process(draft, input.position));
      console.log(input.get('text'))
    }
  };

  // must return modified draft text.
  // text = original draft
  // position = current edition position
  Mod.prototype.process = function(text, position) {
    throw Error('to be implemented');
  };

  return Mod;
});