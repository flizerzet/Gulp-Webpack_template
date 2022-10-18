'use strict';

import gulp from 'gulp';
import fs from 'fs';
import fileInclude from 'gulp-file-include';
import autoprefixer from 'gulp-autoprefixer';
import group_media from 'gulp-group-css-media-queries';
import plumber from 'gulp-plumber';
import {deleteAsync} from 'del';
import minRename from 'gulp-rename';
import cleanCss from 'gulp-clean-css';
import newer from 'gulp-newer';
import imagemin from 'gulp-imagemin';
import image from 'gulp-image';
import webp from 'imagemin-webp';
import webpcss from 'gulp-webpcss';
import webphtml from 'gulp-webp-html-nosvg';
import gulpSass from 'gulp-sass';
import dartSass from 'sass';
import notify from 'gulp-notify';
import ttf2woff2 from 'gulp-ttf2woff2';
import webpack from 'webpack-stream';
import cleanapp from 'gulp-clean';
import path from 'path'
import TerserPlugin from "terser-webpack-plugin";

import browsersync from "browser-sync";
browsersync.create();

const scss = gulpSass(dartSass)

let projectName = `${path.basename(path.resolve())}`;
const srcFolder = "src";
const { src, dest, watch } = gulp;

import devConfig from './config/webpack.dev.js';
import prodConfig from './config/webpack.prod.js';

const app = {
	build: {
		html: `${projectName}/`,
		js: `${projectName}/js/`,
		css: `${projectName}/css/`,
		images: `${projectName}/img/`,
		fonts: `${projectName}/fonts/`,
		assets: `${projectName}/assets/`,
	},
	src: {
		html: [`${srcFolder}/**/*.html`, `!${srcFolder}/_*.html`],
		js: `${srcFolder}/js/app.js`,
		css: `${srcFolder}/scss/style.scss`,
		images: [`${srcFolder}/img/**/*.{jpg,jpeg,png,gif,webp}`, "!**/favicon.*"],
		icons: [`${srcFolder}/img/**/*.svg`, `${srcFolder}/img/**/favicon.*`],
		fonts: `${srcFolder}/fonts/*.ttf`,
		assets: `${srcFolder}/assets/**/*.*`,
	},
	watch: {
		html: `${srcFolder}/*.html`,
		css: `${srcFolder}/scss/**/*.scss`,
		js: `${srcFolder}/js/**/*.js`,
		images: [`${srcFolder}/img/**/*.{jpg,png,jpeg,svg,gif,webp}`, "!**/favicon.*"],
		icons: [`${srcFolder}/img/**/*.svg`, `${srcFolder}/img/**/favicon.*`],
		fonts: `${srcFolder}/fonts/*.ttf`,
		assets: `${srcFolder}/assets/**/*.*`,
	},
	clean: `./${projectName}/`
};

// Сборка HTML файлов
function html() {
	return src(app.src.html)
		.pipe(fileInclude())
		.pipe(dest(app.build.html))
		.pipe(browsersync.stream());
}

// Сборка Html файлов с конвертацией в webp
function htmlWebp() {
	return src(app.src.html)
		.pipe(fileInclude())
		.pipe(webphtml())
		.pipe(dest(app.build.html))
}


// Сборка CSS файлов
function css() {
	return src(app.src.css)
		.pipe(scss({ outputStyle: 'expanded' }).on('error', notify.onError()))
		.pipe(group_media())
		.pipe(
			autoprefixer({
				grid: true,
				overrideBrowserslist: ["last 5 versions"],
				cascade: true
			})
		)
		.pipe(dest(app.build.css))
		.pipe(minRename({
			suffix: '.min'
		}))
		.pipe(cleanCss({
			level: 2,
		}))
		.pipe(dest(app.build.css))
		.pipe(browsersync.stream());
}

// Сборка CSS файлов с конвертацией в webp
function cssWebp() {
	return src(app.src.css, {})
		.pipe(scss({ outputStyle: 'expanded' }).on('error', notify.onError()))
		.pipe(
			autoprefixer({
				grid: true,
				overrideBrowserslist: ["last 5 versions"],
				cascade: true
			})
		)
		.pipe(webpcss(
			{
				webpClass: ".webp",
				noWebpClass: ".no-webp"
			}
		))
		.pipe(group_media())
		.pipe(dest(app.build.css))
		.pipe(minRename({
			suffix: '.min'
		}))
		.pipe(cleanCss({
			level: 2,
		}))
		.pipe(dest(app.build.css))
}


// Картинки
function images() {
	return src(app.src.images)
		.pipe(newer(app.build.images))
		.pipe(dest(app.build.images))
		.pipe(browsersync.stream());
}

// Картинки с конвертацией в webp
function imagesWebp() {
	return src(app.src.images)
		.pipe(newer(app.build.images))
		.pipe(
			imagemin([
				webp({
					quality: 85
				})
			])
		)
		.pipe(
			minRename({ extname: ".webp" })
		)
		.pipe(dest(app.build.images))
		.pipe(src(app.src.images))
		.pipe(newer(app.build.images))
		.pipe(image())
		.pipe(dest(app.build.images))
		.pipe(src(app.src.icons))
		.pipe(newer(app.build.images))
		.pipe(dest(app.build.images))
}

// Картинки с оптимизацией
function imagesBuild() {
	return src(app.src.images)
		.pipe(newer(app.build.images))
		.pipe(image())
		.pipe(dest(app.build.images))
		.pipe(browsersync.stream());
}

// Сброка JS файлов (вебпаком)
function js() {
	return src(app.src.js)
		.pipe(plumber(
			notify.onError({
				title: "JS",
				message: "Error: <%= error.message %>"
			}))
		)
		.pipe(webpack({
			config: devConfig,
		}))
		.pipe(dest(app.build.js))
		.pipe(browsersync.stream());
}

function jsDev() {
	return src(app.src.js)
		.pipe(plumber(
			notify.onError({
				title: "JS",
				message: "Error: <%= error.message %>"
			}))
		)
		.pipe(webpack({
			config: prodConfig
		}))
		.pipe(dest(app.build.js));
}



// Шрифты
function fonts() {
	return src(app.src.fonts)
		.pipe(ttf2woff2())
		.pipe(dest(app.build.fonts))
		.pipe(browsersync.stream());
}
function fontStyle() {
	let fontsFile = `src/scss/components/fonts.scss`;
	// Если передан флаг --rewrite удаляем файл подключения шрифтов
	app.isFontsReW ? fs.unlink(fontsFile, cb) : null;
	// Проверяем существуют ли файлы шрифтов
	fs.readdir(app.build.fonts, function (err, fontsFiles) {
		if (fontsFiles) {
			let newFileOnly;
			for (var i = 0; i < fontsFiles.length; i++) {
				// Записываем подключения шрифтов в файл стилей
				let fontFileName = fontsFiles[i].split('.')[0];
				if (newFileOnly !== fontFileName) {
					let fontName = fontFileName.split('-')[0] ? fontFileName.split('-')[0] : fontFileName;
					let fontWeight = fontFileName.split('-')[1] ? fontFileName.split('-')[1] : fontFileName;
					if (fontWeight.toLowerCase() === 'thin') {
						fontWeight = 100;
					} else if (fontWeight.toLowerCase() === 'extralight') {
						fontWeight = 200;
					} else if (fontWeight.toLowerCase() === 'light') {
						fontWeight = 300;
					} else if (fontWeight.toLowerCase() === 'medium') {
						fontWeight = 500;
					} else if (fontWeight.toLowerCase() === 'semibold') {
						fontWeight = 600;
					} else if (fontWeight.toLowerCase() === 'bold') {
						fontWeight = 700;
					} else if (fontWeight.toLowerCase() === 'extrabold' || fontWeight.toLowerCase() === 'heavy') {
						fontWeight = 800;
					} else if (fontWeight.toLowerCase() === 'black') {
						fontWeight = 900;
					} else {
						fontWeight = 400;
					}
					fs.appendFile(fontsFile, `@font-face {\n\tfont-family: ${fontName};\n\tfont-display: swap;\n\tsrc: url("../fonts/${fontFileName}.woff2") format("woff2");\n\tfont-weight: ${fontWeight};\n\tfont-style: normal;\n}\r\n`, cb);
					newFileOnly = fontFileName;
				}
			}
		} else {
			// Если шрифтов нет
			fs.unlink(fontsFile, cb)
		}
	});
	return src(`${app.src}`);
}



// Дополнительные функции
function clean() {
	return deleteAsync(app.clean);
}

// Вспомогательная функция
function cb() { }

//---Иконки
function icons() {
	return src(app.src.icons)
		.pipe(dest(app.build.images))
}

//---Дополнения
function assets() {
	return src(app.src.assets)
		.pipe(dest(app.build.assets))
}

//---Удаление dist-директории
function cleanDir() {
	if (!fs.existsSync(app.clean)) {
		fs.mkdirSync(app.clean);
	}
	return src(app.clean).pipe(cleanapp());
}

//---Слежка за файлами
function watchFiles() {
	browsersync.init({
		server: {
			baseDir: `./${projectName}/`
		},
		notify: false,
		port: 3000,
	});

	watch(app.watch.html, html);
	watch(app.watch.css, css);
	watch(app.watch.js, js);
	watch(app.watch.images, images);
	watch(app.watch.icons, icons);
	watch(app.watch.fonts, fonts);
	watch(app.watch.fonts, fontStyle);
	watch(app.watch.assets, assets);
}

let fontsBuild = gulp.series(fonts, fontStyle);
let dev = gulp.series(clean, gulp.parallel(html, fonts, js, images, icons, assets), fontStyle, css, watchFiles);
let buildNoWebp = gulp.series(cleanDir, gulp.parallel(html, jsDev, js, fonts, imagesBuild, icons, assets), css);
let build = gulp.series(cleanDir, gulp.parallel(htmlWebp, jsDev, js, fonts, imagesWebp, icons, assets), cssWebp);

gulp.task('clean', cleanDir)
gulp.task('fonts', fontsBuild);

gulp.task('default', dev);
gulp.task('build', build);
gulp.task('buildNoWebp', buildNoWebp);
