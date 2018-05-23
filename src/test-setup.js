/* eslint-disable */
'use strict';

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _sinonChai = require('sinon-chai');

var _sinonChai2 = _interopRequireDefault(_sinonChai);

var _jsdom = require('jsdom');

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiAsPromised = require('chai-as-promised');

var _chaiAsPromised2 = _interopRequireDefault(_chaiAsPromised);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var proxyquire = require('proxyquire').noCallThru();

global.chai = _chai2.default;
global.expect = _chai.expect;
global.sinon = _sinon2.default;

_chai2.default.use(_sinonChai2.default);
_chai2.default.use(_chaiAsPromised2.default);

/**
 * Set up proxyquire globally so that we don't have to require() it at the top
 * of each file.
 *
 * To make this work we need to find the path of the test file, so that we can
 * extract it's directory path and prepend it to the path the proxyquire call is
 * making. Otherwise proxyquire tries to find a file relative to _this_ test-setup file.
 */
global.proxyquire = function (request, stubs) {
  // throw an error so we can examine the stack trace
  var errorStack = new Error().stack;
  // break the stack up and get the chunk that contains the calling file path
  var rawPath = errorStack.split('at ')[2];
  // extract the file path from the raw error
  var callingModulePath = /\(([^)]+)\)/g.exec(rawPath)[0];
  var path = callingModulePath.split('/');
  // remove the file name and parentheses from the path
  var dirPath = path.slice(1, path.length - 1);
  // finally, join the path back together and append the file that we're proxyquiring
  var finalPath = '/' + dirPath.join('/') + '/' + request;
  return proxyquire(finalPath, stubs);
};

// setup the simplest document possible
var doc = (0, _jsdom.jsdom)('<!doctype html><html><body></body></html>');

// get the window object out of the document
var win = doc.defaultView;

// set globals for mocha that make access to document and window feel
// natural in the test environment
global.document = doc;
global.window = win;

// enzyme requires react-dom to have a global navigator
global.navigator = win.navigator;

global.window.localStorage = { getItem: function getItem() {
    return '{}';
  }, setItem: function setItem() {
    return '{}';
  }, removeItem: function removeItem() {}
};

// React needs to be imported after global has been setup to prevent issues with enzyme
// require is used instead of import so that babel doesn't move includes back to the top
// of the module.
var React = require('react');
var TestUtils = require('react-dom/test-utils');
global.React = React;
global.TestUtils = TestUtils;

// take all properties of the window object and also attach it to the
// mocha global object
// from mocha-jsdom https://github.com/rstacruz/mocha-jsdom/blob/master/index.js#L80
Object.keys(win).forEach(function (key) {
  if (win.hasOwnProperty(key) && !global[key]) global[key] = win[key];
});

// Ignore scss modules for testing
require.extensions['.scss'] = function (module, filename) {
  return module._compile('', filename);
}; //eslint-disable-line
require.extensions['.css'] = function (module, filename) {
  return module._compile('', filename);
}; //eslint-disable-line
require.extensions['.sass'] = function (module, filename) {
  return module._compile('', filename);
}; //eslint-disable-line

// Must be imported after React to prevent issues with enzyme
// require is used instead of import so that
// babel doesn't move includes back to the top of the module.
var chaiEnzyme = require('chai-enzyme');
_chai2.default.use(chaiEnzyme());