define([
  'model/latiniummod'
], function(Latinium){

  describe('Latinium Mod tests', function(){
    // given a brand new mod
    var tested = new Latinium('', {words: ['one', 'two']});

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

    it('should change next two word', function() {
      // when processing text
      var result = tested.process('current word1 word2 remains.', 0);
      // then two words are changed
      assert.include(result, 'current');
      assert.ok(result.indexOf('word1') == -1);
      assert.ok(result.indexOf('word2') == -1);
      assert.ok(result.indexOf('one') > 0 || result.indexOf('two') > 0);
      assert.include(result, 'remains.');
      assert.equal(result.split(' ').length, 4);
    });

    it('should change next one word', function() {
      // when processing one word text
      var result = tested.process('current word1', 0);
      // then one words is changed
      assert.include(result, 'current');
      assert.ok(result.indexOf('word1') == -1);
      assert.ok(result.indexOf('one') > 0 || result.indexOf('two') > 0);
      assert.equal(result.split(' ').length, 2);
    });

    it('should change last two word', function() {
      // when processing one word text
      var result = tested.process('current word1 word2', 0);
      // then one words is changed
      assert.include(result, 'current');
      assert.ok(result.indexOf('word1') == -1);
      assert.ok(result.indexOf('word2') == -1);
      assert.ok(result.indexOf('one') > 0 || result.indexOf('two') > 0);
      assert.equal(result.split(' ').length, 3);
    });

    it('should take punctuation as delimiter', function() {
      // when processing words delimited with punctuation
      var result = tested.process('current,word1!word2?remains', 0);
      // then two words are changed
      assert.include(result, 'current,');
      assert.ok(result.indexOf('word1') == -1);
      assert.ok(result.indexOf('word2') == -1);
      assert.ok(result.indexOf('one!') > 0 || result.indexOf('two!') > 0);
      assert.include(result, '?remains');
      assert.equal(result.split(/\W/).length, 4);
    });

    it('should use position', function() {
      // when processing text with position
      var result = tested.process('current word1 word2 Word', 7);
      // then two words are changed
      assert.include(result, 'current');
      assert.ok(result.indexOf('word1') == -1);
      assert.ok(result.indexOf('word2') == -1);
      assert.include(result, 'Word');
      assert.ok(result.indexOf('one') > 0 || result.indexOf('two') > 0);
      assert.equal(result.split(' ').length, 4);
    });

    it('should ignore current word', function() {
      // when processing text with position
      var result = tested.process('current Word word1', 12);
      // then two words are changed
      assert.include(result, 'current Word');
      assert.ok(result.indexOf('word1') == -1);
      assert.ok(result.indexOf('one') > 0 || result.indexOf('two') > 0);
      assert.equal(result.split(' ').length, 3);
    });

    describe('given a parametrized Latinium mode', function() {

      it('should only one word be included', function() {
        var tested = new Latinium('', {words: ['one', 'two'], number: 1})
        // when processing text
        var result = tested.process('current word1 remains.', 0);
        // then one word is added
        assert.include(result, 'current');
        assert.ok(result.indexOf('word1') == -1);
        assert.ok(result.indexOf('one') > 0 || result.indexOf('two') > 0);
        assert.include(result, 'remains.');
        assert.equal(result.split(' ').length, 3);
      });

      it('should third words be included', function() {
        var tested = new Latinium('', {words: ['three', 'four'], number: 3})
        // when processing text
        var result = tested.process('current word1 word2 word3 remains.', 0);
        // then three word are changed
        assert.include(result, 'current');
        assert.ok(result.indexOf('word1') == -1);
        assert.ok(result.indexOf('word2') == -1);
        assert.ok(result.indexOf('word3') == -1);
        assert.ok(result.indexOf('three') > 0 || result.indexOf('four') > 0);
        assert.include(result, 'remains.');
        assert.equal(result.split(' ').length, 5);
      });
    });
  });

});