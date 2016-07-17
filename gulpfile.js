"use strict";
var gulp = require('gulp');
//var prefix = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
var jade = require('gulp-jade');
//
//var reload = browserSync.reload;
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var sass = require('gulp-ruby-sass');
var sourcemaps = require('gulp-sourcemaps');

var paths = {
	css: 'public/assets/css/**/*.css',
	html: 'public/**/*.html',
	jade: 'app/acme/jade/**/*.jade',
	php: 'app/**/*.php',
	sass: 'app/acme/assets/sass/**/*.sass',
	scripts: ['public/assets/js/*.js', '!public/assets/js/libs/*.js', 'public/testing/**/*.js'],
	images: 'client/img/**/*'
};

var options = {};


options.autoprefixer = {
	// map: true,
	// from: 'asset',
	// to: 'asrp.min.css'
};

// var onError = function(err) {
// 	console.log(err);
// 	this.emit('end');
// };

gulp.task('templates', function()
{
	var YOUR_LOCALS = {};

	gulp.src(paths.jade)
		.pipe(plumber())
		.pipe(jade(
		{
			locals: YOUR_LOCALS,
			pretty: "\t"
		}))
		.pipe(gulp.dest('public/'))
		.pipe(notify(
		{
			message: 'templates expanded'
		}
		));
});

// gulp.task('sass', function()
// {
// 	return sass(paths.sass,
// 		{
// 			style: 'expanded'
// 		})
// 		.pipe(plumber({errorHandler: onError}))
// 		//.pipe(sass())
// 		//.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4', options.autoprefixer))
// 		.pipe(gulp.dest('public/assets/css'));
// 		//.pipe(reload({ stream:true }))
// 		// .pipe(notify(
// 		// {
// 		// 	message: 'All done, master!'
// 		// }));
// });


gulp.task('sass', function()
{
	sass(paths.sass, {sourcemap: true})
	.on('error', sass.logError)
	.pipe(sourcemaps.write())
	.pipe(sourcemaps.write('maps', {
		includeContent: false,
		sourceRoot: 'source'
	}))
	.pipe(gulp.dest('public/assets/css'));
});

// files = [
// 	paths.css,
// 	paths.scripts
// ];

gulp.task('browserSync', function()
{
	var config = {
		browser: "google chrome",
		files: [paths.scripts, paths.css, paths.html, paths.php],
		notify: false,
		port: 4000, //port for server, different than proxy port
		proxy: "testing.app",
		reloadDelay: 500
	};

	browserSync(config);
});


gulp.task('watch', function()
{
	gulp.watch(paths.sass, ['sass']);
	gulp.watch(paths.jade, ['templates']);
	//gulp.watch(paths.html, ['browserSync']);
	gulp.watch(paths.html).on('change', browserSync.reload);
	gulp.watch(paths.scripts).on('change', browserSync.reload);
	//gulp.watch(paths.scripts, ['lint']);

});

gulp.task('default', ['watch', 'sass', 'browserSync']);
