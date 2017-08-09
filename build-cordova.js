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
 * @param {Object} args Command line argument for tests
 * @returns 
 */
exports.build = function buildCordova(osType, args) {
	// Get basic configuration from build.json
	const buildConfig = JSON.parse(fs.readFileSync('build.json', 'utf-8'));

	const buildConfigName = args.release ? 'release' : 'development';
	const osConfig = buildConfig[osType][buildConfigName] || {};

	console.log(`Config for os=${osType} and config=${buildConfigName}: ${JSON.stringify(osConfig)}`);

	// Unfortunately the names in build.json don't match the arguments needed for cordova build
	const buildOptions = {
		release: args.release,

		// Android-specific options
		storeFile: osConfig.keystore ? path.join(process.cwd(), osConfig.keystore) : undefined,
		keyAlias: osConfig.alias,
		storePassword: args.storePassword || osConfig.storePassword,
		keyPassword: args.keyPassword || osConfig.password,

		// iOS-specific options
		codeSignIdentity: osConfig.codeSignIdentity,
		provisioningProfile: osConfig.provisioningProfile,
		developmentTeam: osConfig.developmentTeam,
		packageType: osConfig.packageType
	};

	console.log(JSON.stringify(buildOptions));

	const builder = getBuilder(osType);
	return lazypipe().pipe(() => builder(buildOptions));
}

/**
 * Adds command line arguments for build process
 * 
 * @param {Object} yargs Yargs instance
 */
exports.addYargs = function addYargs(yargs) {
	return yargs.option('release', {
		describe: 'True if the release is for the app store',
		type: 'boolean',
		default: false,
	})
	.option('storePassword', {
		describe: 'Password for the app store (Android only)',
		type: 'string',
	})
	.option('keyPassword', {
		describe: 'Password for the signing key (Android only)',
		type: 'string',
	})
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
