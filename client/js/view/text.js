define([
  'underscore',
  'backbone',
  'model/doublemod',
  'model/shufflemod',
  'model/latiniummod',
  'text!template/text.html',
  'levels/easy'
], function(_, Backbone, Double, Shuffle, Latinium, template, level){

  var bonusClasses = {
    'double': Double,
    'latinium': Latinium,
    'shuffle': Shuffle
  };

  var TextView = Backbone.View.extend({

    template: template,

    steps: [],

    className: 'text-view',

    model: null,

    editable: false,

    currentMod: null,

    opponent: null,

    bonusDice: null,

    stopped: false,

    events: {
      'keyup .input > input': '_onPlayerInput'
    },

    initialize: function(model, opponent, editable) {
      _.bindAll(this);
      this.model = model;
      this.inhibit = false;
      this.opponent = opponent;
      this.editable = editable;
      this.stopped = false;
      this.bindTo(this.model, 'change:content', this._onContentChanged);
      this.bindTo(this.model, 'change:draft change:end', this._onDraftChanged);
      this.bindTo(this.model, 'change:suite', this._onSuiteChanged);
      this.bindTo(this.model, 'change:score', this._onScoreChanged);
      this.bindTo(this.model, 'change:avatar', this._onAvatarChanged);
      this.render();
      // initialize levels by sorting them
      this.steps = [];
      for (var name in level.bonus) {
        this.steps.push({
          name: name,
          level: level.bonus[name].level,
          options: level.bonus[name]
        })
      }
      this.steps = _.sortBy(this.steps, 'level');
      console.log(this.steps, level.bonus)
    },

    render: function() {
      Backbone.View.prototype.render.apply(this, arguments);
      if (!this.editable) {
        this.$('.input').remove();
      }
      this.model.set('score', 0);
      // for chaining purposes
      return this;
    },

    applyMod: function() {
      if (this.currentMod) {
        this.model.set('avatar', 'happy');
        this.opponent.set('avatar', 'mad');        

        this.currentMod.trigger(this.opponent, this);
        this.inhibit = true;
        this.model.set('suite', 0);        
        this.currentMod = null;              
        this.model.trigger('triggerMod');
      }
    },

    random: function(min, max) {
      return Math.round(Math.random() * (max - min) + min);
    },

    // starts view and underlying model
    start: function() {
      // must be attached to the DOM for width computations
      this._onContentChanged();
      this._onPlayerInput();
      this.model.start()
    },

    /**
     * Display text inside container, manually breaking lines for a better
     * control on text flow. Spaces will be replaced by non-breaking spaces
     *
     * @param container [Object] dom node inside which text is displayed
     * @param text [String] displayed text.
     */
    displayText: function(container, text, draft) {
      container.empty();
      words = text.split(' ');
      var width = container.width();
      var length = words.length;
      var line = $('<div></div>').appendTo(container);
      var draftIdx = 0
      if (draft) {
        // if using draft, use draft width as referential 
        width = draft.children().eq(draftIdx).width();
      }
      for (var i=0; i < length; i++) {
        var word = words[i];
        var last = word[word.length-1];
        var lineContent = line.html();
        // do NOT use append, because of Chrome
        line.html(lineContent+word);
        // is there any overflow ?
        if (line.width() > width) {
          // reset line to previous state, without trailing space
          line.html(line.html().substr(0, lineContent.length-6));
          // add a new one with the text if necessary
          line = $('<div>'+word+(i < length-1 ? '&nbsp;' : '')+'</div>').appendTo(container);
          if (draft) {
            width = draft.children().eq(++draftIdx).width();
          }
        } else if (i < length-1) {
          line.append('&nbsp;');
        }
        if (last === '\n') {
          // remove new line character and trailing space
          line.html(line.html().substring(0, line.html().length-7));
          // add a new line if not draft because draft lines are not displayed as block
          if (!draft) {
            container.append('<br/>');
          } else {
            width = draft.children().eq(++draftIdx).width();
          }
          line = $('<div></div>').appendTo(container);
        }
      }
    },

    _onPlayerInput: function(event) {   
      // 219 is OS home key
      if (!event || this.stopped || event.which == 219) {
        return;
      };      

      // 17 is ctrl: trigger bonus
      if (event.which === 17) {
        this.applyMod();        
      } else {
        var inputZone = this.$('.input > input');
        var key = inputZone.val();
        if (this.model.won && this.model.get('player') !== 'god' && (
            key === '.' || event.which === 13)) {
          // end player free time !
          inputZone.remove();
          return this.model.trigger('finished');
        }
        key = event.which === 13 ? '\n' : key;
        inputZone.val('');
        this.model.set('content', this.model.get('content')+key);
      }
    },

    _onContentChanged: function() {
      var content = this.model.get('content');
      if (content == null) {
        return;
      }
      this.displayText(this.$('.text'), content, this.$('.draft'));
      // play sound only for us
      if (content && this.editable && gdpjam3.sounds) {
        // try to load one sound from the pool
        for (var i = 1; i <= 3; i++) {
          if (!gdpjam3.sounds['keystroke'+i].playing) {
            gdpjam3.sounds['keystroke'+i].play();
            break;
          }
        }
      }
      var container = this.$('.inner-text');
      var last = this.$('.text').children().last();
      
      // set vertical scroll
      var height = container.height();
      var scrollHeight = container[0].scrollHeight;
      if (scrollHeight > height) {
        this.$('.scrollable').scrollTop(scrollHeight-height);
      }

      // set horizontal scroll
      var model = this.$('.draft > *').eq(last.index());
      var width = last.width();
      var modelWidth = model.width();
      var totalWidth = container.width();
      this.$('.draft, .text').css('left', 0)
      if (modelWidth > totalWidth && width > totalWidth-30) {
        this.$('.draft, .text').css('left', (totalWidth-30)-width);
      }

      // positionate caret above the input
      // if last child is empty, position will returns with an half-height offset
      var vOffset = (last.text() === '' ? 14.5 : 0);
      var hOffset = parseInt(this.$('.text').css('left'));
      // add a space if we are at the end of a word
      this.$('.input').css({top: last.position().top-vOffset, left: last.width()+hOffset});
    },

    _onDraftChanged: function() {
      var content = this.model.get('draft');
      var end = this.model.get('end') || '';
      if (content == null) {
        return;
      }
      // always follow \n by space to allow word recognition
      this.displayText(this.$('.draft'), content + '\n ' + end);
    },

    _onSuiteChanged: function() {
      var value = this.model.get('suite');

      if (value === 0) {
        // reset bonuses
        this.currentMod = null;
        this.$('.gauge').removeClass('full');
        this.$('.bonus:not(.anim)').attr('class', 'bonus');
        // display error feedback
        var caret = this.$('.caret');
        caret.addClass('error');
        _.delay(function() {
          caret.removeClass('error');
        }, 300);
        // error sound
        if (!this.inhibit && this.editable && gdpjam3.sounds.error) {
          gdpjam3.sounds.error.play();
        }
        this.inhibit = false;
        caret.addClass('error');
      } else {
        // goes from higher level and decrease
        for (var i = this.steps.length; i > 0; i--) {
          var step = this.steps[i-1];
          if (value === step.level) {
            this.$('.gauge.bonus-' + i).addClass('full');
            this.$('.bonus:not(.anim)').attr('class', 'bonus ' + step.name);
            this.currentMod = new bonusClasses[step.name](step.name, step.options);
            if (gdpjam3.sounds['powerup'+i]) {
              gdpjam3.sounds['powerup'+i].play();
            }
            break;
          }
        }

        if(this.model.get('player') == 'god' && this.currentMod) {        
          if(this.random(1, this.currentMod.options.proba) == this.currentMod.options.proba) {
            this.applyMod();
          }
        }
      }
    },

    _onScoreChanged: function() {
      this.$('.score').html(this.model.get('score'));
    },

    _onAvatarChanged: function() {
      if(this.model.get('avatar')) {
        this.$('.avatar')
          .removeClass('happy')
          .removeClass('mad')
          .addClass(this.model.get('avatar'))
        ;

        _.delay(
          _.bind(function() { 
            this.$('.avatar').removeClass(this.model.get('avatar')); 
            this.model.set('avatar', '');
          }, this), 
          2000
        );  
      }
    }

  });

  return TextView;

});