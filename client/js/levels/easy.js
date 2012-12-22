define({
  options: {
    // Optional spaces ?
    spaceopt: true
  },
  bonus: {
    "double": {
      // probability for IA to trigger
      proba: 15,
      // Number of correct characters required
      level: 20, 
      // score added when applying
      score: 2,
      // number of word doubled
      number: 1
    },
    latinium: {
      // probability for IA to trigger
      proba: 10,
      // Number of correct characters required
      level: 40,
      // score added when applying
      score: 5,
      // number of word added
      number: 1,
      // possible words
      words: [
        'lorem',
        'consectetur',
        'ipsum',
        'vestibulum',
        'dolor',
        'malesuada',
        'mollis',
        'faucibus'
      ]
    },
    shuffle: {
      // probability for IA to trigger
      proba: 5,
      // Number of correct characters required
      level: 60,
      // score added when applying
      score: 10,
      // number of word shuffled
      number: 2
    }
  },
  god: {
    error: {
      // Dice : [0 - max]
      max: 1000,
      // If Dice > threshold: make an error ! 
      threshold: 750
    },
    // typing speed, in millis
    typing: {
      min: 250,
      max: 500
    }
  }
});