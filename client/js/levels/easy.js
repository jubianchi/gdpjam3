define({
  options: {
    // Optional spaces ?
    spaceopt: true
  },
  bonus: {
    shuffle: {
      proba: 15,
      level: 60,
      score: 10
    },
    latinium: {
      proba: 10,
      level: 40,
      score: 5
    },
    "double": {
      proba: 10,
      level: 20, 
      score: 2
    }
  },
  god: {
    error: {
      // Dice : [0 - max]
      max: 1000,
      // If Dice > threshold : Error ! 
      threshold: 800
    },
    typing: {
      min: 250,
      max: 500
    }
  }
});