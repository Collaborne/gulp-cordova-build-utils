/* jshint node: true */

'use strict';

const injectIndex = require('../../').injectIndex;
const fs = require('fs');
const gulp = require('gulp');
const path = require('path');
const should = require('should');
const File = require('vinyl');

describe('gulp-inject-cordova-index', function() {

	let check;

	beforeEach(function() {
		const file = new File({
			path: 'index.html',
			contents: fs.readFileSync(path.join(__dirname, 'fixtures/index.html'))
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
		const stream = injectIndex({
			connectSrc: ['wss://example.com', 'https://example.com'],
			frameSrc: ['https://example.com']
		})();

		check(stream, done, function(files) {
			const expected = fs.readFileSync(path.join(__dirname, 'expected/index-default-source.html'), {encoding: 'utf8'});

			const transformedFile = files['index.html'];
			String(transformedFile.contents).should.equal(expected);
		});
	});

	it('injects data for placeholders (with custom source)', function(done) {
		const stream = injectIndex({
			source: 'http://localhost:41234',
			connectSrc: ['wss://example.com', 'https://example.com'],
			frameSrc: ['https://example.com']
		})();

		check(stream, done, function(files) {
			const expected = fs.readFileSync(path.join(__dirname, 'expected/index-custom-source.html'), {encoding: 'utf8'});

			const transformedFile = files['index.html'];
			String(transformedFile.contents).should.equal(expected);
		});
	});

});