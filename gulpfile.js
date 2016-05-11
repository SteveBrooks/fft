'use strict';
/* jshint node: true */
/* global require module */

var path = require('path');
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var excludeGitignore = require('gulp-exclude-gitignore');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var plumber = require('gulp-plumber');
var gulpIf = require('gulp-if');
var gutil = require('gulp-util');

var mochaErr;

var paths = ['lib/**/*.js', 'test/**/*.js'];

gulp.task('lint', function () {
  mochaErr = undefined;

  return gulp.src(paths)
    .pipe(plumber())
    .on('error', gutil.log) 
    .pipe(excludeGitignore())
    .on('error', gutil.log) 
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('pre-test', ['lint'], function () {
  return gulp.src(paths)
    .pipe(plumber())
    .on('error', gutil.log) 
    .pipe(excludeGitignore())
    .on('error', gutil.log) 
    .pipe(istanbul({
      includeUntested: true
    }))
    .on('error', gutil.log) 
    .pipe(istanbul.hookRequire())
    .on('error', gutil.log);
});

gulp.task('test', ['pre-test'], function (cb) {
  return gulp.src(paths)
    //.pipe(plumber())
    .pipe(mocha({reporter: 'dot'}))
    .on('error', function (err) {
      mochaErr = err;
    });
});

gulp.task('coverage-report', ['test'], function () {
  return gulp.src(paths)
    .pipe(plumber())
    .on('error', gutil.log) 
    .pipe(excludeGitignore())
    .pipe(gulpIf(!mochaErr,istanbul.writeReports({reporters:['text-summary', 'text']})));
});

gulp.task('watch', function () {
  gulp.watch(['lib/**/*.js', 'test/**/*.js'], ['coverage-report']);
});

gulp.task('default', ['coverage-report']);
