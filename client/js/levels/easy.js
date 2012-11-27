define({
  options: {
    // Optional spaces ?
    spaceopt: true
  },
  bonus: {
    shuffle: {
      proba: 15,
      level: 9,
      score: 10
    },
    latinium: {
      proba: 10,
      level: 6,
      score: 5
    },
    "double": {
      proba: 10,
      level: 3, 
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