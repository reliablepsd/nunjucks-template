import sourcemaps from "gulp-sourcemaps";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import sortMediaQueries from "postcss-sort-media-queries";
import * as dartSass from 'sass';
import gulpSass from "gulp-sass";
const sass = gulpSass(dartSass);
import pcsscomb from '../postcss-csscomb-fix.js';
// variable for hidden Deprecation Warning
const silenceDeprecationsVar = ['import', 'global-builtin', 'mixed-decls', 'legacy-js-api'];

// scss build version project
export const cssBuild = () =>  {
	return g.gulp.src(g.v.src.style)
		.pipe(
			g.plumber({ errorHandler: g.notify.onError("Error: <%= error.message %>") })
		)
		.pipe(sourcemaps.init())
		.pipe(sass.sync({
			style: "expanded",
			silenceDeprecations: silenceDeprecationsVar
		}))
		.pipe(sourcemaps.write())
		.pipe(g.gulp.dest(g.v.build.style))
		.pipe(g.browserSync.reload({ stream: true }));
}

// scss Prod version project
export const cssProd = () => {
	let postcssPlugins = [
		sortMediaQueries({
			sort: "desktop-first",
			// tips how group-css-media-queries work
			// Queries order see on https://www.npmjs.com/package/postcss-sort-media-queries
		}),
		autoprefixer(),
		pcsscomb(g.v.config.cssComb)
	];
	return g.gulp.src(g.v.src.style)
		.pipe(
			g.plumber({ errorHandler: g.notify.onError("Error: <%= error.message %>") })
		)
		.pipe(sass.sync({silenceDeprecations: silenceDeprecationsVar}))
		.pipe(postcss(postcssPlugins))
		.pipe(g.gulp.dest(g.v.dist.style))
		.pipe(g.browserSync.reload({ stream: true }));
}
