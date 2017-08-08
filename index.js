'use strict';

exports.injectConfig = require('./inject-cordova-config.js');
exports.injectIndex = require('./inject-cordova-index.js');
exports.build = require('./build-cordova.js').build;
exports.addYargs = require('./build-cordova.js').addYargs;
