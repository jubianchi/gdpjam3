define([
  'model/doublemod'
], function(Double){


  describe('Double Mod tests', function(){
    // given a brand new mod
    var tested = new Double('', 0, 0);

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

    it('should double next two word', function() {
      // when processing one word text
      var result = tested.process('current word1 word2 remains.', 0);
      // then result is doubled
      assert.equal(result, 'current wwoorrdd11 wwoorrdd22 remains.');
    });

    it('should double next one word', function() {
      // when processing one word text
      var result = tested.process('current word1', 0);
      // then result is doubled
      assert.equal(result, 'current wwoorrdd11');
    });

    it('should double not fail on end', function() {
      // when processing text without word after position
      var result = tested.process('current', 0);
      // then result is not doubled
      assert.equal(result, 'current');
    });

    it('should take punctuation as delimiter', function() {
      // when processing words delimited with punctuation
      var result = tested.process('current WORD1,WORD2!remains', 0);
      // then result is doubled
      assert.equal(result, 'current WWOORRDD11,WWOORRDD22!remains');
    });

    it('should double accentuated letters', function() {
      // when processing word with accentuated letters
      var result = tested.process('current éàôÇ. îùêç? remains', 0);
      // then result is doubled
      assert.equal(result, 'current ééààôôÇÇ. îîùùêêçç? remains');
    });

    it('should use position', function() {
      // when processing text with position
      var result = tested.process('current Word', 7);
      // then next word after position is doubled
      assert.equal(result, 'current WWoorrdd');
    });

    it('should ignore current word', function() {
      // when processing text with position
      var result = tested.process('current Word', 8);
      // then current word is not doubled
      assert.equal(result, 'current Word');
    });
  });

});