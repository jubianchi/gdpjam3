define([
  'underscore',
  'model/mod'
], function(_, Mod){

  // Model for input
  var Latinium = function() {
    Mod.apply(this, arguments);
  };

  _.extend(Latinium.prototype, Mod.prototype, {

    process:function(text, position) {
      var delay = 0;
      position++;

      while(text.substring(position, position + 1) != ' ' || delay < 2) {
        if(text.substring(position, position + 1) == ' ') {
          delay++;
        }

        position++;
      }
      position++;

      var models = [
        'lorem',
        'consectetur',
        'ipsum',
        'vestibulum',
        'dolor',
        'malesuada',
        'mollis',
        'faucibus'
      ];

      var words = text.substring(position).match(/(\w*) (\w*)/),          
          r1 = models[this.random(0, models.length - 1)],
          r2 = '';      

      while(r2 == '' || r1 === r2) {        
        r2 = models[this.random(0, models.length - 1)];
      }

      return text.substring(0, position) + text.substring(position).replace(words[1] + ' ' + words[2], r1 + ' ' + r2);
    },

    random: function(min, max) { return Math.round(Math.random() * (max - min) + min); }
  });

  return Latinium;
});