define({

  constants: {
    texts: [
      "Now that there is the Tec-9, a crappy spray gun from South Miami. This gun is advertised as the most popular gun in American crime. Do you believe that shit? It actually says that in the little book that comes with it: the most popular gun in American crime. Like they\'re actually proud of that shit. Normally, both your asses would be dead as fucking fried chicken, but you happen to pull this shit while I\'m in a transitional period so I don\'t wanna kill you, I wanna help you. But I can\'t give you this case, it don\'t belong to me. Besides, I\'ve already been through too much shit this morning over this case to hand it over to your dumb ass. Your bones don\'t break, mine do. That\'s clear. Your cells react to bacteria and viruses differently than mine. You don\'t get sick, I do. That\'s also clear. But for some reason, you and I react the exact same way to water. We swallow it too fast, we choke. We get some in our lungs, we drown. However unreal it may seem, we are connected, you and I. We\'re on the same curve, just on opposite ends. The path of the righteous man is beset on all sides by the iniquities of the selfish and the tyranny of evil men. Blessed is he who, in the name of charity and good will, shepherds the weak through the valley of darkness, for he is truly his brother\'s keeper and the finder of lost children. And I will strike down upon thee with great vengeance and furious anger those who would attempt to poison and destroy My brothers. And you will know My name is the Lord when I lay My vengeance upon thee. Now that there is the Tec-9, a crappy spray gun from South Miami. This gun is advertised as the most popular gun in American crime. Do you believe that shit? It actually says that in the little book that comes with it: the most popular gun in American crime. Like they\'re actually proud of that shit."
    ],
    options: {
      // Optional spaces ?
      spaceopt: false
    },
    bonus: [{
      level: 3,
      name: 'double'
    },{
      level: 120,
      name: 'shuffle'
    },{
      level: 180,
      name: 'latinium'
    }],
    god: {
      error: {
        max: 1000,
        threshold: 800
      },
      typing: {
        min: 100,
        max: 250,
        speedmulti: 0.7
      }
    }
  },  

  titles: {
    application: 'Tabulas',
    game: 'Tabulas'
  },

  labels: {
  },
  
  buttons: {
    duel: 'Duel',
    single: 'Solo',
    mute: 'mute'
  },

  msgs: {
    waitingOpponent: '<div class="waiting">Waiting for an opponnent...<br/>Please be patient !</div>',
    loading: '<div class="waiting">Loading...</div>',
  },

  tips: {
  }
});