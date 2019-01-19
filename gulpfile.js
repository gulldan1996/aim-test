var syntax        = 'scss'; // Syntax: sass or scss;

var gulp          = require('gulp'),
		gutil         = require('gulp-util' ),
		sass          = require('gulp-sass'),
		browserSync   = require('browser-sync'),
		concat        = require('gulp-concat'),
		uglify        = require('gulp-uglify'),
		cleancss      = require('gulp-clean-css'),
		rename        = require('gulp-rename'),
		autoprefixer  = require('gulp-autoprefixer'),
		notify        = require("gulp-notify"),
		imagemin      = require("gulp-imagemin"),
		webp          = require("gulp-webp"),
		rsync         = require('gulp-rsync');
		svgSprite = require('gulp-svg-sprite'),
		// svgmin = require('gulp-svgmin'),
		// cheerio = require('gulp-cheerio'),
		// replace = require('gulp-replace');

		// gulp.task('svgSpriteBuild', function () {
		// 	return gulp.src(assetsDir + 'svg/*.svg')
		// 	// minify svg
		// 		.pipe(svgmin({
		// 			js2svg: {
		// 				pretty: true
		// 			}
		// 		}))
		// 		// remove all fill, style and stroke declarations in out shapes
		// 		.pipe(cheerio({
		// 			run: function ($) {
		// 				$('[fill]').removeAttr('fill');
		// 				$('[stroke]').removeAttr('stroke');
		// 				$('[style]').removeAttr('style');
		// 			},
		// 			parserOptions: {xmlMode: true}
		// 		}))
		// 		// cheerio plugin create unnecessary string '&gt;', so replace it.
		// 		.pipe(replace('&gt;', '>'))
		// 		// build svg sprite
		// 		.pipe(svgSprite({
		// 			mode: {
		// 				symbol: {
		// 					sprite: "../sprite.svg",
		// 					render: {
		// 						scss: {
		// 							dest:'../../../sass/_sprite.scss',
		// 							template: assetsDir + "sass/templates/_sprite_template.scss"
		// 						}
		// 					}
		// 				}
		// 			}
		// 		}))
		// 		.pipe(gulp.dest(assetsDir + 'i/sprite/'));
		// });
gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false,
		// open: false,
		// online: false, // Work Offline Without Internet Connection
		// tunnel: true, tunnel: "projectname", // Demonstration page: http://projectname.localtunnel.me
	})
});

gulp.task('styles', function() {
	return gulp.src('app/scss/style.scss')
	.pipe(sass({ outputStyle: 'expand' }).on("error", notify.onError()))
	.pipe(rename({ suffix: '.min', prefix : '' }))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.stream())
});

gulp.task('js', function() {
	return gulp.src([
		'app/libs/jquery/dist/jquery.min.js',
		'app/js/common.js', // Always at the end
		])
	.pipe(concat('scripts.min.js'))
	// .pipe(uglify()) // Mifify js (opt.)
	.pipe(gulp.dest('app/js'))
	.pipe(browserSync.reload({ stream: true }))
});

gulp.task("images", function () {
  return gulp.src("app/img/**/*.{png,jpg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true})
    ]))
    .pipe(gulp.dest("app/img"));
});

gulp.task("webp", function () {
  return gulp.src("app/img/**/*.{png,jpg}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("app/img/webp"));
});

gulp.task('code', function(){
	return gulp.src('app/*html')
	.pipe(browserSync.reload({ stream: true }))
});

gulp.task('rsync', function() {
	return gulp.src('app/**')
	.pipe(rsync({
		root: 'app/',
		hostname: 'username@yousite.com',
		destination: 'yousite/public_html/',
		// include: ['*.htaccess'], // Includes files to deploy
		exclude: ['**/Thumbs.db', '**/*.DS_Store'], // Excludes files from deploy
		recursive: true,
		archive: true,
		silent: false,
		compress: true
	}))
});

gulp.task('watch', function() {
	gulp.watch('app/'+syntax+'/**/*.'+syntax+'', gulp.parallel('styles'));
	gulp.watch(['libs/**/*.js', 'app/js/common.js'], gulp.parallel('js'));
	gulp.watch('app/*.html', gulp.parallel('code'))
});

gulp.task('default', gulp.parallel('watch', 'styles', 'images', 'webp', 'js', 'browser-sync'));
