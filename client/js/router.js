// configure requireJs
requirejs.config({
  paths: {
    'backbone': 'lib/backbone-0.9.2-min',
    'bootstrap': 'lib/bootstrap-2.2.1-min',
    'buzz': 'lib/buzz-1.0.5',
    'hogan': 'lib/hogan-2.0.0-min',
    'i18n': 'lib/i18n-2.0.1-min',
    'jquery': 'lib/jquery-1.8.2-min',
    'nls': '../nls',
    'template': '../template',
    'socket.io': 'lib/socket.io-0.9.11-min',
    'text': 'lib/text-2.0.0-min',
    'transit': 'lib/transit-0.1.3',
    'underscore': 'lib/underscore-1.4.2-min',
    'underscore.string': 'lib/underscore.string-2.2.0rc-min'
  },
  shim: {
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    'bootstrap': {deps: ['jquery']},
    'buzz': {exports: 'buzz'},
    'hogan': {exports: 'Hogan'},
    'jquery': {exports: '$'},
    'render': {exports: 'render'},
    'socket.io': {exports:'io'},
    'transit': {deps: ['jquery']},
    'underscore': {exports: '_'}
  }
});

// initialize gdpjm3 global namespace
window.gdpjam3 = {};

define([
  'underscore',
  'jquery',
  'backbone',
  'socket.io',
  'buzz',
  'view/home',
  'view/credits',
  'view/play',
  'i18n!nls/common',
  'utils',
  'bootstrap',
  'transit'
], function(_, $, Backbone, io, buzz, HomeView, CreditsView, PlayView, i18n) {

  // manage disclaimer for unsupported versions
  var version = parseInt($.browser.version, 10);
  if (!(($.browser.msie && version >= 9) || ($.browser.chrome) || ($.browser.mozilla && version >= 13))) {
    return $('.disclaimer').show();
  }
  $('.disclaimer').remove();

  var Router = Backbone.Router.extend({

    // Define some URL routes (order is significant: evaluated from last to first)
    routes: {
      'home': '_onHome',
      'credits': '_onCredits',
      'play?mode=:mode': '_onPlay',
      '*route': '_onNotFound'
    },

    /**
     * Object constructor.
     *
     * For links that have a route specified (attribute data-route), prevent link default action and
     * and trigger route navigation.
     *
     * Starts history tracking
     */
    initialize: function() {
      _.bindAll(this);
      // global router instance
      gdpjam3.router = this;

      // Wire socket.io
      gdpjam3.socket = io.connect();
      gdpjam3.socket.on('error', function(err){
        console.error('error', err);
        gdpjam3.wired = false;
      });
      gdpjam3.socket.on('disconnect', function(err){
        console.error('disconnect', err);
        gdpjam3.wired = false;
      });
      gdpjam3.socket.on ('connect', function(){
        gdpjam3.wired = true;
      });

      gdpjam3.player = 'player'+new Date().getTime();
            
      // run current route
      Backbone.history.start({
        pushState: true
      });

      // init sound only when dom is loaded
      gdpjam3.sounds = {}
      var sounds = [{
        name:'keystroke1',file:'keystroke2.wav',loop: false
      }, {
        name:'keystroke2',file:'keystroke2.wav',loop: false
      }, {
        name:'keystroke3',file:'keystroke2.wav',loop: false
      }, { 
        name:'keystroke',file:'double.wav',loop: false
      }, { 
        name:'latinum',file:'latinum.wav',loop: false
      }, {
        name:'shuffle',file:'shuffle.wav',loop: false
      }, {
        name:'double',file:'double.wav',loop: false
      }, {
        name:'soundtrack',file:'soundtrack.wav',loop: true
      }, {
        name:'start',file:'start.wav',loop: false
      }, {
        name:'error',file:'error.wav',loop: false
      }, {
        name:'countdown3',file:'countdown-3.wav',loop: false
      }, {
        name:'countdown2',file:'countdown-2.wav',loop: false
      }, {
        name:'countdown1',file:'countdown-1.wav',loop: false
      }, {
        name:'write',file:'write.wav',loop: false
      }];
      
      this.remains = sounds.length;
      for (var i = 0; i < sounds.length; i++) {
        (function(spec, context) {
          console.log('load sound', spec.name, '...')
          var sound = new buzz.sound("/sound/"+spec.file, {
            autoplay: false,
            loop: spec.loop
          });
          sound.load();
          sound.bind("loadeddata", _.bind(function(e) {
            console.info('sound loaded:', spec.name)
            gdpjam3.sounds[spec.name] = sound;
            context._onSoundLoaded();
          }, context));
          sound.bind("error", context._onSoundLoaded);
          // bind on play only works once on FF
          var originalPlay = sound.play;
          sound.play = function() {
            this.playing = true;
            originalPlay.call(sound);
          };
          sound.bind("ended", function(e) {
            sound.playing = false;
          });
        })(sounds[i], this);
      }
    },

    _onSoundLoaded: function() {
      this.remains--;
      if (this.remains === 0) {
        this.soundReady = true;
        this.trigger('sound-ready');
      }
    },

    _onHome: function() {
      // display mode selection
      $('#main').empty().append(new HomeView().$el);
    },

    _onCredits: function() {
      // display mode selection
      $('#main').empty().append(new CreditsView().$el);
    },

    _onPlay: function(mode) {
      if (!this.soundReady) {
        $('#main').empty().append(i18n.msgs.loading);
        // wait for assets to be loaded
        return this.on('sound-ready', _.bind(function() {
          // re-run !
          this._onPlay(mode);
        }, this));
      }

      if (mode === 'duel') {
        // display waiting message*
        $('#main').empty().append(i18n.msgs.waitingOpponent);
        // display rooms
        $.ajax({
          url:'/api/rooms',
          type: 'GET',
          cache: false,
          dataType: 'json',
          success: _.bind(function(rooms, status, xhr) {
            // first player: no room
            if (!Array.isArray(rooms) || rooms.length === 0) {
              gdpjam3.room = 'room-'+new Date().getTime();
            } else {
              // take the first free room
              gdpjam3.room = rooms[0];
            }
            gdpjam3.socket.emit('register', gdpjam3.player, gdpjam3.room);
            gdpjam3.socket.on('players', function(players) {
              // wait for 2 payers
              if (players.length == 2) {
                // Render play view
                $('#main').empty().append(new PlayView({mode: 'duel', players: players}).$el);
              }
            });
          }, this),

          error: function(xhr, status, err) {
            console.error('failed to display rooms', err || status);
          }
        });
      } else {
        gdpjam3.room = null;
        // Render play view
        $('#main').empty().append(new PlayView({mode: 'single', players: [gdpjam3.player, 'god']}).$el);
      }
    },

    /**
     * Invoked when a route that doesn't exists has been run.
     *
     * @param route [String] the unknown route
     */
    _onNotFound: function(route) {
      console.error('Unknown route '+route);
      this.navigate('home', {trigger: true});
    }

  });

  new Router();
});