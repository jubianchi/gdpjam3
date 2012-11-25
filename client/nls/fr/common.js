define({

  constants: {
    bonus: [{
      level: 60,
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
        speedmulti: 3
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