/**
 * Triggers the Cordova build process
 */
'use strict';

const cordovaBuildAndroid = require('gulp-cordova-build-android');
const cordovaBuildIos = require('gulp-cordova-build-ios');
const fs = require('fs');
const lazypipe = require('lazypipe');
const path = require('path');
const replace = require('gulp-replace');
const size = require('gulp-size');

/**
 * Triggers the Cordova build
 * 
 * @param {string} osType Name of the OS for which to build
 * @param {Object} options Options for the Cordova build. This will overwrite the setting from build.json.
 * @param {boolean} options.release True if this a release for the app store
 * @param {string} options.storePassword Password for the app store (Android only)
 * @param {string} options.keyPassword Password for the Android key
 * @returns 
 */
module.exports = function buildCordova(osType, options) {
	// Get basic configuration from build.json
	const buildConfig = JSON.parse(fs.readFileSync('build.json', 'utf-8'));

	console.log(JSON.stringify(buildConfig));

	const buildConfigName = options.release ? 'release' : 'development';
	const osConfig = buildConfig[osType][buildConfigName];

	// Unfortunately the names in build.json don't match the arguments needed for cordova build
	const buildOptions = {
		release: options.release,

		// Android-specific options
		storeFile: buildConfig.keystore ? path.join(process.cwd(), buildConfig.keystore) : undefined,
		keyAlias: buildConfig.alias,
		storePassword: options.storePassword || buildConfig.storePassword,
		keyPassword: options.keyPassword || buildConfig.password,

		// iOS-specific options
		codeSignIdentity: buildConfig.codeSignIdentity,
		provisioningProfile: buildConfig.provisioningProfile,
		developmentTeam: buildConfig.developmentTeam,
		packageType: buildConfig.packageType
	};

	console.log(JSON.stringify(buildOptions));

	const builder = getBuilder(osType);
	return lazypipe().pipe(() => builder(buildOptions));
}

/**
 * Returns the builder for the selected OS
 * 
 * @param {string} osType OS for which the build shoulw be started
 * @returns {Function} builder
 */
function getBuilder(osType) {
	switch (osType) {
		case 'android':
			return cordovaBuildAndroid;
		case 'ios':
			return cordovaBuildIos;
		default:
			throw new Error(`No builder available for OS ${osType}`);
	}
}

