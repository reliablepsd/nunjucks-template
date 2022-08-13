const {src,dest,parallel,series,watch} = require('gulp');
const del = require('del');
const newer = require('gulp-newer');
const plumber = require('gulp-plumber');
const notify = require("gulp-notify");
const htmlbeautify = require('gulp-html-beautify');
const imgRetina = require('gulp-responsive-imgz-ignore');
const imagemin = require('gulp-imagemin');
const imageminPngquant = require('imagemin-pngquant');
const imageminMozjpeg = require('imagemin-mozjpeg');
const rigger = require('gulp-rigger');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sortMediaQueries = require('postcss-sort-media-queries');
const path = require('path');
const nunjucksRender = require('gulp-nunjucks-render');
const frontMatter = require('gulp-front-matter');
const pcsscomb = require('postcss-csscomb');
const webpackStream = require('webpack-stream');
const browserSync = require('browser-sync').create();
const bsr = function reload(cb) {
	browserSync.reload();
	cb();
}


// ==================== COMMON VARIABLE ====================

const modulesOn = false;
let v = {};
v = require('./gulp-config.js');

// For debug
// function test(cb) {
// 	console.log(v);
// 	cb()
// }
// exports.test = test;

// ====================
// ====================
// ====================
// ==================== BUILD task ========================
// ====================
// ====================
// ====================


// delet folder build version project
function cleanBuild(cb) {
	console.log('----------- FOLDER FOR BUILD CLEAN');
	del.sync(v.build.clean, {force: true})
	cb()
}
// If need make some task global - just use exports this task
// exports.cleanBuild = cleanBuild;

// fonts file build version project
function fontsBuild(cb) {
	src(v.src.fonts)
		.pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
		.pipe(newer(v.build.fonts))
		.pipe(dest(v.build.fonts))
		cb()
}

// other file build version project
function otherBuild(cb) {
	src(v.src.other)
	.pipe(newer(v.build.other))
	.pipe(dest(v.build.other))
	cb()
}

// html file build version
function htmlBuild() {
	return src(v.src.html)
	.pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
		.pipe(rigger())
		.pipe(frontMatter({ property: 'data' }))
		.pipe(nunjucksRender())
		.pipe(imgRetina(v.config.imgRetina))
		.pipe(dest(v.build.html))
}


// image optimize build version project
function imageBuild(cb) {
	src(v.src.img)
		.pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
		.pipe(newer(v.build.img))
		.pipe(dest(v.build.img))
		cb()
}

// js Modules build version project
function jsModulesBuild(cb) {
	if (modulesOn) {
		console.log('----------- Modules BUILD');
		return src(v.src.jsModules)
		.pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
		.pipe(webpackStream(v.config.webpackConf))
		.pipe(dest(v.build.js))
	} else {
		console.log('----------- Work with modules is DISABLED');
		cb()
	}
}

// js file build version project
function jsBuild() {
	return src(v.src.js)
	.pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
	.pipe(rigger())
	.pipe(dest(v.build.js))
}
// scss build version project
function cssBuild() {
	return src(v.src.style)
		.pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
		.pipe(sourcemaps.init())
		.pipe(sass({outputStyle: 'expanded'}))
		.pipe(sourcemaps.write())
		.pipe(dest(v.build.style))
		.pipe(browserSync.reload({stream:true}))
}

// watch task with DEV and init server
function watchServBuild() {

	// init server for DEV mode
	browserSync.init(v.config.configWebserverBuild);

	watch(v.watch.html, series(
		htmlBuild,
		bsr
	))

	watch(v.watch.style, cssBuild)

	watch(v.watch.js, series(
		jsBuild,
		bsr
	))

	watch(v.watch.jsModules, series(
		jsModulesBuild,
		bsr
	))

	watch(v.watch.fonts, series(
		fontsBuild,
		bsr
	))

	watch(v.watch.img, series(
		imageBuild,
		bsr
	))

	watch(v.watch.delet).on('unlink', function (filepath) {
		var filePathFromSrc = path.relative(path.resolve(v.folderProject.src), filepath);
		var destFilePath = path.resolve(v.folderProject.build, filePathFromSrc);
		console.log("You delet this file - " + destFilePath);
		del.sync(destFilePath);
	});
}


// create common task for DEV mode
const filesBuild = parallel(htmlBuild, jsBuild, jsModulesBuild, cssBuild, fontsBuild, otherBuild);
// exports task for DEV mode
exports.default = series(filesBuild, imageBuild, watchServBuild);
exports.dev = series(cleanBuild, filesBuild, imageBuild, watchServBuild);


// ====================
// ====================
// ====================
// ==================== DIST task ========================
// ====================
// ====================
// ====================


// delet folder build version project
function cleanProd(cb) {
	console.log('------------ FOLDER FOR PRODUCTION CLEAN');
	del.sync(v.dist.clean, {force: true})
	cb()
}

// fonts file build version project
function fontsProd(cb) {
	src(v.src.fonts)
		.pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
		.pipe(dest(v.dist.fonts))
		cb()
}

// other file build version project
function otherProd(cb) {
	src(v.src.other)
		.pipe(dest(v.dist.other))
		cb()
}

//html file production version
function htmlProd() {
	return src(v.src.html)
		.pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
		.pipe(rigger())
		.pipe(frontMatter({ property: 'data' }))
		.pipe(nunjucksRender())
		.pipe(imgRetina(v.config.imgRetina))
		.pipe(htmlbeautify(v.config.optionsHtmlBeautify))
		.pipe(dest(v.dist.html))
}

//image optimize build version project
function imageProd(cb) {
	src(v.src.img)
		.pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
		.pipe(imagemin([
			imageminPngquant({quality: [0.7, 0.8]}),
			imageminMozjpeg({progressive: true})
		],
		//for more detailed information output
		{ verbose: true,}))
		.pipe(dest(v.dist.img))
		cb()
}

// js Modules dist version project
function jsModulesProd(cb) {
	if (modulesOn) {
		console.log('----------- Modules BUILD');
		v.config.webpackConf.mode = "production";
		v.config.webpackConf.devtool = false;
		return src(v.src.jsModules)
		.pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
		.pipe(webpackStream(v.config.webpackConf))
		.pipe(dest(v.dist.js))
	} else {
		console.log('----------- Work with modules is DISABLED');
		cb()
	}
}
exports.jsModulesProd = jsModulesProd;

// js file Prod version project
function jsProd() {
	return src(v.src.js)
		.pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
		.pipe(rigger())
		.pipe(dest(v.dist.js))
}

// scss Prod version project
function cssProd() {
	var postcssPlugins = [
		sortMediaQueries({
			sort: 'desktop-first'
			// tips how group-css-media-queries work
			// Queries order see on https://www.npmjs.com/package/postcss-sort-media-queries
		}),
		autoprefixer(),
		pcsscomb(v.config.cssComb)
	];
	return src(v.src.style)
		.pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
		.pipe(sass())
		.pipe(postcss(postcssPlugins))
		.pipe(dest(v.dist.style))
		.pipe(browserSync.reload({stream:true}))
}

// watch task and init server on PROD mode
function watchServerProd() {

	// init server for DEV mode
	browserSync.init(v.config.configWebserverProd);

	watch(v.watch.html, series(
		htmlProd,
		bsr
	))

	watch(v.watch.style, cssProd)

	watch(v.watch.js, series(
		jsProd,
		bsr
	))

	watch(v.watch.jsModules, series(
		jsModulesProd,
		bsr
	))

	watch(v.watch.fonts, series(
		fontsProd,
		bsr
	))

	watch(v.watch.img, series(
		imageProd,
		bsr
	))

	watch(v.watch.delet).on('unlink', function (filepath) {
    var filePathFromSrc = path.relative(path.resolve(v.folderProject.src), filepath);
    var destFilePath = path.resolve(v.folderProject.dist, filePathFromSrc);
		console.log("You delet this file - " + destFilePath);
    del.sync(destFilePath);
  });
}

// create common task for PROD mode
const filesProd = parallel(htmlProd, jsProd, jsModulesProd, cssProd, fontsProd, otherProd);
// exports task for PROD mode
exports.dist = series(filesProd, imageProd, watchServerProd);
exports.distClean = series(cleanProd, filesProd, imageProd, watchServerProd);
