define([
], function(){

  // Model for input
  var Mod = function(sound, proba, score) {
    this.sound = sound;
    this.proba = proba;
    this.score = score;
  };

  // Call to invoke bonus on an input draft
  Mod.prototype.trigger = function(input, view) {
    input.set('draft', this.process(input.get('draft'), input.position));
    view.model.set('score', view.model.get('score') + this.score); 

    // apply sound if available
    if (gdpjam3.sounds[this.sound]) {
      gdpjam3.sounds[this.sound].play();
    }

    // translate to bonus applied
    gdpjam3.playView.setBonus(view ? view.editable : false, this.sound);
  };

  // must return modified draft text.
  // text = original draft
  // position = current edition position
  Mod.prototype.process = function(text, position) {
    throw Error('to be implemented');
  };

  return Mod;
});