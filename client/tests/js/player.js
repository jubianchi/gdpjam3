define([
  'model/player'
], function(Player){


  describe('Player model tests', function(){
    var tested;

    // given a brand new player
    beforeEach(function() {
      tested = new Player({player:'human'});
      tested.start();
    });

    it('should input be checked against draft', function() {
      // given a draft
      var draft = 'awaited words';
      var score = 0;
      var suite = 0;
      tested.set('draft', draft);
      // when setting correct content

      for (var i = 1; i <= 10; i++) {
        tested.set('content', draft.substr(0, i));
        // then content is accepted and position updated
        assert.equal(draft.substr(0, i), tested.get('content'));
        assert.equal(++score, tested.get('score'));
        assert.equal(++suite, tested.get('suite'));
        assert.equal(i, tested.position);
      }
    });

    it('should error reset current word', function() {
      // given a draft and an existing content
      var draft = 'word1 word2 word3';
      tested.position = 8;
      tested.set('suite', tested.position);
      tested.set('score', tested.position);
      tested.attributes.content = draft.substr(0, tested.position);
      tested.set('draft', draft);

      // when setting incorrect content
      tested.set('content', tested.get('content')+'_');
      
      // then content is refused and position reseted
      assert.equal('word1 ', tested.get('content'));
      assert.equal(6, tested.get('score'));
      assert.equal(0, tested.get('suite'));
      assert.equal(6, tested.position);
    });

    it('should correct letter be inputed after error', function() {
      // given a draft and an existing content
      var draft = 'word1 word2 word3';
      tested.position = 8;
      tested.set('suite', tested.position);
      tested.set('score', tested.position);
      tested.attributes.content = draft.substr(0, tested.position);
      tested.set('draft', draft);

      // given an incorrect input
      tested.set('content', tested.get('content')+'_');
      
      // when sending a correct content
      tested.set('content', tested.get('content')+'w');

      // then content is refused and position reseted
      assert.equal('word1 w', tested.get('content'));
      assert.equal(7, tested.get('score'));
      assert.equal(1, tested.get('suite'));
      assert.equal(7, tested.position);
    });

    it('should error reset first word', function() {
      // given a draft and an existing content
      var draft = 'word1 word2 word3';
      tested.position = 3;
      tested.set('suite', tested.position);
      tested.set('score', tested.position);
      tested.attributes.content = draft.substr(0, tested.position);
      tested.set('draft', draft);

      // when setting incorrect content
      tested.set('content', tested.get('content')+'_');
      
      // then content is refused and position reseted
      assert.equal('', tested.get('content'));
      assert.equal(0, tested.get('score'));
      assert.equal(0, tested.get('suite'));
      assert.equal(0, tested.position);
    });

    it('should space as first word letter be ignored', function() {
      // given a draft and an existing content
      var draft = 'word1 word2 word3';
      tested.position = 6;
      tested.set('suite', tested.position);
      tested.set('score', tested.position);
      tested.attributes.content = draft.substr(0, tested.position);
      tested.set('draft', draft);

      // when setting incorrect content
      tested.set('content', tested.get('content')+' ');
      
      // then content is refused and position reseted
      assert.equal('word1 ', tested.get('content'));
      assert.equal(6, tested.get('score'));
      assert.equal(0, tested.get('suite'));
      assert.equal(6, tested.position);
    });

    it('should space after error be ignored', function() {
      // given a draft and an existing content
      var draft = 'word1 word2 word3';
      tested.position = 6;
      tested.set('suite', tested.position);
      tested.set('score', tested.position);
      tested.attributes.content = draft.substr(0, tested.position);
      tested.set('draft', draft);

      // given an incorrect input
      tested.set('content', tested.get('content')+'_');
      
      // when sending a space
      tested.set('content', tested.get('content')+' ');
      
      // then content is refused and position reseted
      assert.equal('word1 ', tested.get('content'));
      assert.equal(6, tested.get('score'));
      assert.equal(0, tested.get('suite'));
      assert.equal(6, tested.position);
    });
  });

});