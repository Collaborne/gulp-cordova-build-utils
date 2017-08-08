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

	console.log(JSON.stringify(buildConfig));

	const buildConfigName = args.release ? 'release' : 'development';
	const osConfig = buildConfig[osType][buildConfigName];

	// Unfortunately the names in build.json don't match the arguments needed for cordova build
	const buildOptions = {
		release: args.release,

		// Android-specific options
		storeFile: buildConfig.keystore ? path.join(process.cwd(), buildConfig.keystore) : undefined,
		keyAlias: buildConfig.alias,
		storePassword: args.storePassword || buildConfig.storePassword,
		keyPassword: args.keyPassword || buildConfig.password,

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
 * Adds command line arguments for build process
 * 
 * @param {Object} yargs Yargs instance
 */
exports.addYargs = function addYargs(yargs) {
	return yargs.option('app-endpoint', {
		describe: 'Endpoint of the backend',
		type: 'string',
		default: process.env.COLLABORNE_ENDPOINT || 'https://signals.collaborne.com'
	})
	.option('release', {
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