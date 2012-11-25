define({

  constants: {
    options: {
      // Optional spaces ?
      spaceopt: true
    },
    bonus: [{
      'proba': 30,
      level: 30,
      name: 'double'
    },{
      'proba': 4,
      level: 60,
      name: 'latinium'
    },{
      'proba': 1,
      level: 90,
      name: 'shuffle'
    }],
    god: {
      error: {
        max: 1000,
        threshold: 800
      },
      typing: {
        min: 100,
        max: 250,
        speedmulti: -0.6
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
      "Now that there is the Tec-9, a crappy spray gun from South Miami. This gun is advertised as the most popular gun in American crime. Do you believe that shit? It actually says that in the little book that comes with it: the most popular gun in American crime. Like they're actually proud of that shit. ",
      "Sed vestibulum vestibulum mauris, et consectetur tortor rhoncus in. Phasellus ut dolor non risus blandit egestas. Donec tellus elit, feugiat quis posuere sed, mollis vel lorem. Donec accumsan congue est, ac tincidunt leo pellentesque non. Nullam eget lacus urna. Duis nec nibh et sem eleifend ullamcorper in quis lectus. Quisque placerat lobortis malesuada. Aenean rhoncus ultricies sodales. Nam aliquet, arcu et fermentum hendrerit, enim dui vulputate ligula, sit amet lobortis nisi ante nec mauris. Suspendisse non nibh vitae diam convallis feugiat sed in sem. Integer tincidunt ante sit amet leo facilisis et scelerisque sapien eleifend. Mauris in eros lorem. Mauris luctus ultricies ante at ornare." 
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