import TerserPlugin from "terser-webpack-plugin";

import * as path from 'path';

const srcFolder = "src";
const buildFolder = "dist";
const rootFolder = path.basename(path.resolve());

const paths = {
	src: path.resolve(srcFolder),
	build: path.resolve(buildFolder)
}
const prodConfig = {
	mode: "production",
	optimization: {
		minimizer: [new TerserPlugin({
			extractComments: false,
			terserOptions: {
				ecma: undefined,
				warnings: false,
				parse: {},
				compress: {
					defaults: false,
					unused: true,
				},
				mangle: false,
				module: false,
				toplevel: false,
				keep_classnames: true,
				keep_fnames: true,
				format: {
					beautify: true
				}
			}
		})],
	},
	output: {
		path: `${paths.build}`,
		filename: 'app.js',
		publicPath: '/',
	}
}


export default prodConfig;