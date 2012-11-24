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
    'soundmanager': 'lib/soundmanager2-min',
    'text': 'lib/text-2.0.0-min',
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
    'soundmanager': {exports:'soundManager'},
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
  'view/play',
  'i18n!nls/common',
  'utils',
  'bootstrap'
], function(_, $, Backbone, io, buzz, HomeView, PlayView, i18n) {

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
      var sounds = [
        'keystroke.wav', 
        'keystroke2.wav', 
        'double.wav', 
        'latinum.wav',
        'shuffle.wav',
        'soundtrack.wav'
      ];
      for (var i = 0; i < sounds.length; i++) {
        (function(name) {
          console.log('load sound', name, '...')
          var sound = new buzz.sound("/sound/"+name, {
            autoplay: false,
            loop: false
          });
          sound.load();
          sound.bind("loadeddata", function(e) {
            console.info('sound loaded:', name)
            gdpjam3.sounds[name.replace(/\.\w+$/, '')] = sound;
          });
        })(sounds[i]);
      }
    },

    _onHome: function() {
      // display mode selection
      $('#main').empty().append(new HomeView().$el);
    },

    _onPlay: function(mode) {
      if (mode === 'duel') {
        // display waiting message*
        console.dir(i18n.msgs)
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