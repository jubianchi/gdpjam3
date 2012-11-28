// configure requireJs
requirejs.config({
  baseUrl: '/js',
  paths: {
    'backbone': 'lib/backbone-0.9.2-min',
    'bootstrap': 'lib/bootstrap-2.2.1-min',
    'buzz': 'lib/buzz-1.0.5-min',
    'chai': 'lib/chai-1.3.0',
    'hogan': 'lib/hogan-2.0.0-min',
    'i18n': 'lib/i18n-2.0.1-min',
    'jquery': 'lib/jquery-1.8.2-min',
    'mocha': 'lib/mocha-1.7.1',
    'nls': '../nls',
    'template': '../template',
    'socket.io': 'lib/socket.io-0.9.11-min',
    'test': '../tests/js',
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
    'chai': {exports: 'chai'},
    'hogan': {exports: 'Hogan'},
    'jquery': {exports: '$'},
    'mocha': {exports: 'mocha'},
    'render': {exports: 'render'},
    'socket.io': {exports:'io'},
    'underscore': {exports: '_'}
  }
});

// initialize gdpjm3 global namespace
window.gdpjam3 = {};

define(['require', 'chai', 'mocha'], function(require, chai, mocha) {
  // Use global variables
  assert = chai.assert;
  should = chai.should();
  expect = chai.expect;

  // Mocha
  mocha.setup('bdd');

  // Require tests
  require(['test/doublemod'], function(){
    // Start runner
    mocha.run();
  });
});