define({

  constants: {
    options: {
      // Optional spaces ?
      spaceopt: true
    },
    bonus: [{
      'proba': 10,
      level: 3,
      name: 'double'
    },{
      'proba': 4,
      level: 120,
      name: 'shuffle'
    },{
      'proba': 1,
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
    texts: [
      "Now that there is the Tec-9, a crappy spray gun from South Miami.",
      "Now that there is the Tec-9, a crappy spray gun from South Miami. This gun is advertised as the most popular gun in American crime." 
    ],
    ends1: [
      "ceci est la phrase de fin"
    ],
    ends2: [
      "ceci est l'autre phrase de fin"
    ]
  },

  tips: {
  }
});