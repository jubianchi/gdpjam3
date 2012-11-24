// configure requireJs
requirejs.config({
  paths: {
    'backbone': 'lib/backbone-0.9.2-min',
    'bootstrap': 'lib/bootstrap-2.2.1-min',
    'hogan': 'lib/hogan-2.0.0-min',
    'i18n': 'lib/i18n-2.0.1-min',
    'jquery': 'lib/jquery-1.8.2-min',
    'jquery-autosize': 'lib/jquery-autosize-1.13-min',
    'nls': '../nls',
    'template': '../template',
    'socket.io': 'lib/socket.io-0.9.11-min',
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
    'hogan': {exports: 'Hogan'},
    'jquery': {exports: '$'},
    'jquery-autosize': {deps: ['jquery']},
    'render': {exports: 'render'},
    'socket.io': {exports:'io'},
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
  'view/layout',
  'i18n!nls/common',
  'utils',
  'bootstrap',
  'jquery-autosize'
], function(_, $, Backbone, io, LayoutView) {

  // manage disclaimer for unsupported versions
  var version = parseInt($.browser.version, 10);
  if (!(($.browser.msie && version >= 9) || ($.browser.chrome) || ($.browser.mozilla && version >= 13))) {
    return $('.disclaimer').show();
  }
  if ($.browser.msie) {
    window.Placeholders.init({live:true});
  }
  $('.disclaimer').remove();

  var Router = Backbone.Router.extend({

    // Define some URL routes (order is significant: evaluated from last to first)
    routes: {
      'play': '_onPlay',
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

      // Render layout
      this.layout = new LayoutView();
      this.layout.$el.appendTo('#main');

      // Wire socket.io
      gdpjam3.socket = io.connect();
      gdpjam3.socket.on('error', function(err){
        console.error('error', err);
      });
      gdpjam3.socket.on('disconnect', function(err){
        console.error('disconnect', err);
      });
      gdpjam3.socket.on ('connect', function(){
        console.info('wired !!');
        gdpjam3.socket.emit('message', 'player1', 'youhou');
      });

      // run current route
      Backbone.history.start({
        pushState: true
      });
    },

    _onPlay: function() {
      // display editorial with welcome panel
      /*this.layout.display('menu', this.listView);
      this.layout.display('content', new EditorialView(welcomeTpl));*/
    },

    /**
     * Invoked when a route that doesn't exists has been run.
     *
     * @param route [String] the unknown route
     */
    _onNotFound: function(route) {
      console.error('Unknown route '+route);
      this.navigate('play', {trigger: true});
    }

  });

  new Router();
});