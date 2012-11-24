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

    className: 'play-view', 

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

      var text = 'Now that there is the Tec-9, a crappy spray gun from South Miami. This gun is advertised as the most popular gun in American crime. Do you believe that shit? It actually says that in the little book that comes with it: the most popular gun in American crime. Like they\'re actually proud of that shit.\nNormally, both your asses would be dead as fucking fried chicken, but you happen to pull this shit while I\'m in a transitional period so I don\'t wanna kill you, I wanna help you. But I can\'t give you this case, it don\'t belong to me. Besides, I\'ve already been through too much shit this morning over this case to hand it over to your dumb ass.\nYour bones don\'t break, mine do. That\'s clear. Your cells react to bacteria and viruses differently than mine. You don\'t get sick, I do. That\'s also clear. But for some reason, you and I react the exact same way to water. We swallow it too fast, we choke. We get some in our lungs, we drown. However unreal it may seem, we are connected, you and I. We\'re on the same curve, just on opposite ends.\nThe path of the righteous man is beset on all sides by the iniquities of the selfish and the tyranny of evil men. Blessed is he who, in the name of charity and good will, shepherds the weak through the valley of darkness, for he is truly his brother\'s keeper and the finder of lost children. And I will strike down upon thee with great vengeance and furious anger those who would attempt to poison and destroy My brothers. And you will know My name is the Lord when I lay My vengeance upon thee.\nNow that there is the Tec-9, a crappy spray gun from South Miami. This gun is advertised as the most popular gun in American crime. Do you believe that shit? It actually says that in the little book that comes with it: the most popular gun in American crime. Like they\'re actually proud of that shit.';

      if (this.options.mode === 'duel') {
        // display other player input
        gdpjam3.socket.on('message', function(player, content) {
          console.log('receive from '+player)
          if (player === player2.get('player')) {
            player2.set('content', content);
          }
        });
        // and send current player input
        player1.set('draft', text)
        player1.on('change:content', function() {
          var content = player1.get('content');
          if (!content) {
            return;
          }
          console.log('send to '+player1.get('player'))
          gdpjam3.socket.emit('message', content);
        });
      } else {
        player1.set('draft', text);
        player2.set('text', text);
      }
    }

  });

  return PlayView;

});