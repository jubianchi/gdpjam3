define([
  'underscore',
  'backbone',
  'text!template/play.html',
  'i18n!nls/common',
  'view/text',
  'model/input'
], function(_, Backbone, template, i18n, TextView, InputModel){

  var PlayView = Backbone.View.extend({

    // Mustache template
    template: template,

    // i18n labels, buttons, tips...
    i18n: i18n,

    events: {
    },

    // View initialization: immediately displays the poll list
    initialize: function() {
      _.bindAll(this);
      this.render();
    },

    render: function() {
      Backbone.View.prototype.render.apply(this, arguments);
      console.dir(this.options)
      // creates 2 input model and displays them in text views
      var player1 = new InputModel({player: gdpjam3.player, content:''});
      this.$('.player1').empty().append(new TextView(player1, true).$el);

      var other = _.without(this.options.players, gdpjam3.player)[0];
      var player2 = new InputModel({player: other, content:''});
      this.$('.player2').empty().append(new TextView(player2, false).$el);

      console.info('current player', gdpjam3.player, 'other is', other);

      if (this.options.mode === 'duel') {
        // display other player input
        gdpjam3.socket.on('message', function(player, content) {
          console.log('receive from '+player)
          if (player === player2.get('player')) {
            player2.set('content', content);
          }
        });
        // and send current player input
        player1.on('change:content', function() {
          var content = player1.get('content');
          if (!content) {
            return;
          }
          console.log('send to '+player1.get('player'))
          gdpjam3.socket.emit('message', content);
        });
      }
    }

  });

  return PlayView;

});