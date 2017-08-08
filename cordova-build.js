/**
 * Triggers the Cordova build process
 */
'use strict';

const cordovaBuildAndroid = require('gulp-cordova-build-android');
const cordovaBuildIos = require('gulp-cordova-build-ios');
const lazypipe = require('lazypipe');
const path = require('path');
const replace = require('gulp-replace');
const size = require('gulp-size');

function createCordovaBuild(builder, buildConfig) {
	console.log(JSON.stringify(buildConfig));

	// Unfortunately the names in build.json don't match the arguments needed for cordova build
	const options = {
		release: buildConfig.release,

		// Android-specific options
		storeFile: buildConfig.keystore ? path.join(process.cwd(), buildConfig.keystore) : undefined,
		keyAlias: buildConfig.alias,
		storePassword: buildConfig.storePassword,
		keyPassword: buildConfig.password,

		// iOS-specific options
		codeSignIdentity: buildConfig.codeSignIdentity,
		provisioningProfile: buildConfig.provisioningProfile,
		developmentTeam: buildConfig.developmentTeam,
		packageType: buildConfig.packageType
	};

	console.log(JSON.stringify(options));

	return lazypipe().pipe(() => builder(options));
}

exports.buildAndroid = buildConfig => createCordovaBuild(cordovaBuildAndroid, buildConfig);
exports.buildIOS = buildConfig => createCordovaBuild(cordovaBuildIos, buildConfig);
