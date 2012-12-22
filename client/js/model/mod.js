define([
], function(){

  // Modification constructor. Intended to be overriden by subclasses
  //
  // @param name [String] name of associated sound (optionnal)
  // @param options [Object] configuration options
  // @option options proba [Number] probability used by IA to trigger this mode
  // @option options score [Number] added to the player's score that triggers the bonus
  var Mod = function(name, options) {
    this.sound = name;
    this.options = options;
  };

  // Call to invoke bonus on an input draft
  Mod.prototype.trigger = function(player, view) {
    player.set('draft', this.process(player.get('draft'), player.position));
    view.model.set('score', view.model.get('score') + this.options.score || 0); 

    // apply sound if available
    if (gdpjam3.sounds[this.sound]) {
      gdpjam3.sounds[this.sound].play();
    }

    // translate to bonus applied
    if (gdpjam3.router.playView) {
      gdpjam3.router.playView.setBonus(view ? view.editable : false, this.sound);
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