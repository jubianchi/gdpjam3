define([
], function(){

  // Model for input
  var Mod = function(sound) {
    this.sound = sound;
  };

  // Call to invoke bonus on an input draft
  Mod.prototype.trigger = function(input, view) {
    var draft = input.get('draft');

    if(draft) {
      console.log('draft');
      input.set('draft', this.process(draft, input.position));
    } else {
      draft = input.get('text');
      input.set('text', this.process(draft, input.position));
    }

    // apply sound if available
    if (gdpjam3.sounds[this.sound]) {
      gdpjam3.sounds[this.sound].play();
    }

    // translate to bonus applied
    gdpjam3.playView.setBonus(view.editable, this.sound);
  };

  // must return modified draft text.
  // text = original draft
  // position = current edition position
  Mod.prototype.process = function(text, position) {
    throw Error('to be implemented');
  };

  return Mod;
});