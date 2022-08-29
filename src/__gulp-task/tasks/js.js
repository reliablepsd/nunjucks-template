import webpackStream from "webpack-stream";
import rigger from "gulp-rigger";

// js Modules build version project
export const jsModulesBuild = (cb) => {
	if (g.modulesOn) {
		console.log("----------- Modules BUILD");
		return g.gulp.src(g.v.src.jsModules)
			.pipe(
				g.plumber({ errorHandler: g.notify.onError("Error: <%= error.message %>") })
			)
			.pipe(webpackStream(g.v.config.webpackConf))
			.pipe(g.gulp.dest(g.v.build.js));
	} else {
		console.log("----------- Work with modules is DISABLED");
		cb();
	}
}

// // js file build version project
export const jsBuild = (cb) => {
	return g.gulp.src(g.v.src.js)
		.pipe(
			g.plumber({ errorHandler: g.notify.onError("Error: <%= error.message %>") })
		)
		.pipe(rigger())
		.pipe(g.gulp.dest(g.v.build.js));
}

// js Modules dist version project
export const jsModulesProd = (cb) => {
	if (g.modulesOn) {
		console.log("----------- Modules BUILD");
		g.v.config.webpackConf.mode = "production";
		g.v.config.webpackConf.devtool = false;
		return g.gulp.src(g.v.src.jsModules)
			.pipe(
				g.plumber({ errorHandler: g.notify.onError("Error: <%= error.message %>") })
			)
			.pipe(webpackStream(g.v.config.webpackConf))
			.pipe(g.gulp.dest(g.v.dist.js));
	} else {
		console.log("----------- Work with modules is DISABLED");
		cb();
	}
}

// js file Prod version project
export const jsProd = (cb) => {
	return g.gulp.src(g.v.src.js)
		.pipe(
			g.plumber({ errorHandler: g.notify.onError("Error: <%= error.message %>") })
		)
		.pipe(rigger())
		.pipe(g.gulp.dest(g.v.dist.js));
}
