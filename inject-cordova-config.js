/**
 * Injects values into the placeholders in Cordova config.xml file
 */
'use strict';

const filter = require('gulp-filter');
const lazypipe = require('lazypipe');
const replace = require('gulp-replace');
const size = require('gulp-size');

const DEFAULT_SOURCE = 'index.html';

/**
 * Replaces placeholder in the Cordova's config.xml
 * 
 * @param {Object} options Configuration for the replacement
 * @param {string} options.appId ID under which the app is registered in the app store, e.g. com.company.app
 * @param {string[]} options.versionNumber Version number of the release
 * @param {string} options.source Path of the application, e.g. index.html (or http://localhost:post for iOS)
 */
module.exports = function injectConfig({ appId, versionNumber, source = DEFAULT_SOURCE} = options) {
	// Split version into major/minor/patch, and calculate a version code for android versioning
	const versionTokens = versionNumber.split('.');
	const androidVersionCode = versionTokens[0]*100000 + versionTokens[1]*1000 + versionTokens[2]*10

	const configFilter = filter('config.xml', {restore: true});

	return lazypipe()
		.pipe(() => configFilter)
		.pipe(() => replace('%%GULP.CORDOVA_ID%%', appId))
		.pipe(() => replace('%%GULP.CORDOVA_VERSION%%', versionNumber))
		.pipe(() => replace('%%GULP.CORDOVA_VERSION_ANDROID_VERSION_CODE%%', androidVersionCode))
		.pipe(() => replace('%%GULP.CORDOVA_SOURCE%%', source))
		.pipe(() => replace('%%GULP.CORDOVA_USER_AGENT%%', `${appId}/${versionNumber}`))
		.pipe(() => replace('%%GULP.CORDOVA_ALLOWED_NAV_SOURCE%%', source !== DEFAULT_SOURCE ? source : 'file://'))
		.pipe(() => size({title: 'inject-cordova-config'}))
		.pipe(() => configFilter.restore);
}
