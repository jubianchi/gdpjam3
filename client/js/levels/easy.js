define({
  options: {
    // Optional spaces ?
    spaceopt: true
  },
  bonus: {
    shuffle: {
      proba: 5,
      level: 60,
      score: 10,
    },
    latinium: {
      proba: 10,
      level: 40,
      score: 5,
      number: 1
    },
    "double": {
      proba: 15,
      level: 20, 
      score: 2,
      number: 1
    }
  },
  god: {
    error: {
      // Dice : [0 - max]
      max: 1000,
      // If Dice > threshold : Error ! 
      threshold: 750
    },
    typing: {
      min: 250,
      max: 500
    }
  }
});