define([
  'underscore',
  'model/mod'
], function(_, Mod){

  // Model for input
  var Shuffle = function() {
    Mod.apply(this, arguments);

    this.name = 'shuffle';
  };

  _.extend(Shuffle.prototype, Mod.prototype, {

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

      var words = text.substring(position).match(/(\w*) (\w*)/);
      return text.substring(0, position) + text.substring(position).replace(words[1] + ' ' + words[2], this.shuffle(words[1]) + ' ' + this.shuffle(words[2]));
    },

    shuffle: function(s) {
      var a = s.split(""),
          n = a.length;

      for(var i = n - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var tmp = a[i];
          a[i] = a[j];
          a[j] = tmp;
      }
      return a.join("");
    }
  });

  return Shuffle;
});