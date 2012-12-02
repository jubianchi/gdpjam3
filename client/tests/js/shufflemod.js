define([
  'model/shufflemod'
], function(Shuffle){


  describe('Shuffle Mod tests', function(){
    // given a brand new mod
    var tested = new Shuffle('', 0, 0);

    it('should not failed on empty string', function() {
      // when processing empty text
      var result = tested.process('', 0);
      // then result is empty
      assert.equal(result, '');
    });

    it('should not failed on negative position', function() {
      // when processing empty text
      var result = tested.process('something', -5);
      // then result is empty
      assert.equal(result, 'something');
    });

    it('should not failed on out of bounds position', function() {
      // when processing empty text
      var result = tested.process('something', 18);
      // then result is empty
      assert.equal(result, 'something');
    });

    it('should shuffle next two word', function() {
      // when processing one word text
      var model = 'word1 word2';
      var result = tested.process('current '+model+' remains.', 0);
      // then 2 next words are shuffled
      var shuffled = result.substr(8, model.length);
      assert.equal(result.replace(shuffled, ''), 'current  remains.');

      // then the result contains only the shuffled letters
      assert.equal(shuffled.length, model.length);
      assert.notEqual(shuffled, model);
      for (var i = 0; i < model.length; i++) {
        assert.include(shuffled, model[i]);
      }
    });

    it('should shuffle next one word', function() {
      // when processing one word text
      var model = 'word1';
      var result = tested.process('current '+model, 0);
      // then next words is shuffled
      var shuffled = result.substr(8, model.length);
      assert.equal(result.replace(shuffled, ''), 'current ');

      // then the result contains only the shuffled letters
      assert.equal(shuffled.length, model.length);
      assert.notEqual(shuffled, model);
      for (var i = 0; i < model.length; i++) {
        assert.include(shuffled, model[i]);
      }
    });

    it('should shuffle not fail on end', function() {
      // when processing one word text
      var result = tested.process('current', 0);
      // then result is doubled
      assert.equal(result, 'current');
    });

    it('should take punctuation as delimiter', function() {
      // when processing words delimited with punctuation
      var model = 'WORD1,WORD2!';
      var result = tested.process('current '+model+'remains', 0);
      // then 2 next words are shuffled
      var shuffled = result.substr(8, model.length);
      assert.equal(result.replace(shuffled, ''), 'current remains');

      // then the result contains only the shuffled letters
      assert.equal(shuffled.length, model.length);
      assert.notEqual(shuffled, model);
      for (var i = 0; i < model.length; i++) {
        assert.include(shuffled, model[i]);
      }
    });

    it('should shuffle accentuated letters', function() {
      // when processing words with accentuated characters
      var model = 'éàôÇ. îùêç?!';
      var result = tested.process('current '+model+'remains', 0);
      // then 2 next words are shuffled
      var shuffled = result.substr(8, model.length);
      assert.equal(result.replace(shuffled, ''), 'current remains');

      // then the result contains only the shuffled letters
      assert.equal(shuffled.length, model.length);
      assert.notEqual(shuffled, model);
      for (var i = 0; i < model.length; i++) {
        assert.include(shuffled, model[i]);
      }
    });

    it('should use position', function() {
      // when processing with position
      var model = 'Word';
      var result = tested.process('current '+model, 7);
      // then next words is shuffled
      var shuffled = result.substr(8, model.length);
      assert.equal(result.replace(shuffled, ''), 'current ');

      // then the result contains only the shuffled letters
      assert.equal(shuffled.length, model.length);
      assert.notEqual(shuffled, model);
      for (var i = 0; i < model.length; i++) {
        assert.include(shuffled, model[i]);
      }
    });

    it('should use position', function() {
      // when processing with position
      var result = tested.process('current Word', 8);
      // then current word is not shuffled
      assert.equal(result, 'current Word');
    });
  });

});