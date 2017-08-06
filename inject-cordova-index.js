/**
 * Injects Cordova content into the application's index.html
 */
'use strict';

const filter = require('gulp-filter');
const lazypipe = require('lazypipe');
const replace = require('gulp-replace');
const size = require('gulp-size');

const DEFAULT_SOURCE = 'index.html';

/**
 * Creates the <meta> tag for the Content-Security-Policy
 * 
 * It enables by default access to Youtube, Google Analytics, and Google fonts.
 * 
 * @return {string} Meta tag with CSP rules
 */
function createMetaCsp(source, connectSrc = [], frameSrc = []) {
	const cspConnectSrc = [ 'self:', ...connectSrc ];
	if (source === DEFAULT_SOURCE) {
		cspConnectSrc.push('file:');
	} else {
		cspConnectSrc.push(source);
	}

	// Allow playing embeded Youtube videos
	const cspFrameSrc = [ 'https://www.youtube.com', ...frameSrc ];

	const cspRules = {
		'default-src': '\'self\' data: gap: https://ssl.gstatic.com \'unsafe-eval\' \'unsafe-inline\' https://www.google-analytics.com https://www.youtube.com https://s.ytimg.com',
		'media-src': 'data: *',
		'img-src': 'data: blob: *',
		'font-src': 'data: \'self\' https://fonts.gstatic.com',
		'style-src': '\'self\' \'unsafe-inline\' https://fonts.googleapis.com',
		'connect-src': cspConnectSrc.join(' '),
		'frame-src': cspFrameSrc.join(' '),
		'child-src': cspFrameSrc.join(' '),
	};

	const csp = Object.keys(cspRules)
		.map(key => `${key} ${cspRules[key]}`)
		.join(';');
	return `<meta http-equiv="Content-Security-Policy" content="${csp}"/>`;
}

/**
 * @param {string} source Path of the application, e.g. index.html (or http://localhost:post for iOS)
 * @param {Object} options Options for the CSP rules
 * @param {string[]} options.connectSrc Entries to be added to the CSP rule for "connect-src"
 * @param {string[]} options.frameSrc Entries to be added to the CSP rule for "frame-src"
 */
module.exports = ({source = DEFAULT_SOURCE, connectSrc, frameSrc} = options) => {
	const indexFilter = filter('index.html', {restore: true});

	return lazypipe()
		.pipe(() => indexFilter)
		.pipe(() => replace('<!-- inject:cordova-script -->', '<script src="cordova.js" async></script>'))
		.pipe(() => replace('<!-- inject:cordova-csp -->', createMetaCsp(source, connectSrc, frameSrc)))
		.pipe(() => size({title: 'inject-cordova-index'}))
		.pipe(() => indexFilter.restore);
}
