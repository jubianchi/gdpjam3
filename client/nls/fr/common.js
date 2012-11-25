define({

  constants: {
    options: {
      // Optional spaces ?
      spaceopt: true
    },
    bonus: [{
      'proba': 10,
      level: 30,
      name: 'double'
    },{
      'proba': 4,
      level: 60,
      name: 'shuffle'
    },{
      'proba': 1,
      level: 90,
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
        speedmulti: -0.7
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
    ],
    pitch: "<p>Lors d'une expédition dans des vestiges mayas, le jeune archéologue Adam découvrit une étrange tablette de pierre vierge. Sans intérêt apparent, il en fit une table basse.</p>"+
      "<p>Mais le 21 Décembre 2012, elle se mit à briller et une voix céleste se fit entendre :<b><i>\"Humain, si vous souhaitez sauver l'humanité, il vous faudra écrire l'histoire... plus vite que moi !\"</i></b></p>",
      controls: "<p>Comment jouer ?</p><p><b>TABULAS</b> est une course de saisie.</p><p>Vous gravez à l'aide de votre clavier et déclencher vos malus avec <b>Ctrl</b></p>"
  },

  tips: {
  }
});