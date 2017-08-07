/**
 * Triggers the Cordova build process
 */
'use strict';

const cordovaBuildAndroid = require('gulp-cordova-build-android');
const cordovaBuildIos = require('gulp-cordova-build-ios');
const lazypipe = require('lazypipe');
const replace = require('gulp-replace');
const size = require('gulp-size');

const argv = require('yargs')
	.boolean('release')
	.string('storePassword')
	.string('keyPassword')
	.help()
	.argv;

function createCordovaBuild(builder, buildConfig) {
	console.log(JSON.stringify(buildConfig));

	// Unfortunately the names in build.json don't match the arguments needed for cordova build
	const options = {
		release: argv.release,

		// Android-specific options
		storeFile: buildConfig.keystore ? path.join(process.cwd(), buildConfig.keystore) : undefined,
		keyAlias: buildConfig.alias,
		storePassword: buildConfig.storePassword || argv.storePassword,
		keyPassword: buildConfig.password || argv.keyPassword,

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
