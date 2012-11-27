define({
  options: {
    // Optional spaces ?
    spaceopt: true
  },
  bonus: {
    shuffle: {
      proba: 15,
      level: 3,
      score: 10
    },
    latinium: {
      proba: 10,
      level: 6,
      score: 5
    },
    "double": {
      proba: 10,
      level: 9, 
      score: 2
    }
  },
  god: {
    error: {
      max: 1000,
      threshold: 400
    },
    typing: {
      min: 100,
      max: 250,
      speedmulti: 2
    }
  }
});