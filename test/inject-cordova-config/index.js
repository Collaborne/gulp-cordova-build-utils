/* jshint node: true */

'use strict';

const injectConfig = require('../../').injectConfig;
const fs = require('fs');
const gulp = require('gulp');
const path = require('path');
const should = require('should');
const File = require('vinyl');

describe('gulp-inject-cordova-config', function() {

	let check;

	beforeEach(function() {
		const file = new File({
			path: 'config.xml',
			contents: fs.readFileSync(path.join(__dirname, 'fixtures/config.xml'))
		});

		// Function to collects all created files
		check = function(stream, done, cb) {
			const newFiles = {};
			stream.on('data', function(newFile) {
				newFiles[newFile.path] = newFile;
			});
			stream.on('end', function(newFile) {
				cb(newFiles);
				done();
			});

			stream.write(file);
			stream.end();
		};
	});

	it('injects data for placeholders (with default source)', function(done) {
		const stream = injectConfig({
			appId: 'com.company.app',
			versionNumber: '1.2.3',
		})();
		check(stream, done, function(files) {
			const expected = fs.readFileSync(path.join(__dirname, 'expected/config-default-source.xml'), {encoding: 'utf8'});

			const transformedFile = files['config.xml'];
			String(transformedFile.contents).should.equal(expected);
		});
	});

	it('injects data for placeholders (with custom source)', function(done) {
		const stream = injectConfig({
			appId: 'com.company.app',
			versionNumber: '1.2.3',
			source: 'http://localhost:41234'
		})();

		check(stream, done, function(files) {
			const expected = fs.readFileSync(path.join(__dirname, 'expected/config-custom-source.xml'), {encoding: 'utf8'});

			const transformedFile = files['config.xml'];
			String(transformedFile.contents).should.equal(expected);
		});
	});

});