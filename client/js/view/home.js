define([
  'underscore',
  'backbone',
  'text!template/home.html',
  'i18n!nls/common'
], function(_, Backbone, template, i18n){

  var HomeView = Backbone.View.extend({

    // Mustache template
    template: template,

    className: 'home-view',
    
    // i18n labels, buttons, tips...
    i18n: i18n,

    events: {
      'click .single': function(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        if(gdpjam3.sounds && gdpjam3.sounds.button) {
          gdpjam3.sounds.button.play();
        }
        gdpjam3.router.navigate('/play?mode=single', {trigger:true});
      },
      'click .duel': function(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        if(gdpjam3.sounds && gdpjam3.sounds.button) {
          gdpjam3.sounds.button.play();
        }
        gdpjam3.router.navigate('/play?mode=duel', {trigger:true});
      },
      'click .credits': '_onCredits'
    },

    // View initialization: immediately displays the poll list
    initialize: function() {
      _.bindAll(this);
      this.render();

      if(gdpjam3.sounds && gdpjam3.sounds.soundtrack) {
        gdpjam3.sounds.soundtrack.stop();
      }
      // Play sountrack when available.
      function playSoundTrack() {
        if (gdpjam3.sounds && gdpjam3.sounds.soundtrackMenu) {
          gdpjam3.sounds.soundtrackMenu.setVolume(10).fadeIn(3000).play();
        }
      }
      if (gdpjam3.router.soundReady) {
        playSoundTrack();
      } else {
        gdpjam3.router.on('sound-ready', playSoundTrack);
      }
    },

    _onCredits: function(event) {
      if(gdpjam3.sounds && gdpjam3.sounds.button) {
        gdpjam3.sounds.button.play();
      }
      event.preventDefault();
      event.stopImmediatePropagation();
      this.$('.credits').toggleClass('active');
      this.$('.pitch, .controls').toggleClass('hidden');
      this.$('.credits-content').toggleClass('hidden');
    }

  });

  return HomeView;

});