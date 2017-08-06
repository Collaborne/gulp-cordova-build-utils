'use strict';

exports.injectCordovaConfig = require('./inject-cordova-config.js');
exports.injectCordovaIndex = require('./inject-cordova-index.js');
exports.buildAndroid = require('./cordova-build.js').buildAndroid;
exports.buildIOS = require('./cordova-build.js').buildIOS;
