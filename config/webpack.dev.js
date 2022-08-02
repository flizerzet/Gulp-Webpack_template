import TerserPlugin from "terser-webpack-plugin";

import * as path from 'path';

const srcFolder = "src";
const buildFolder = "dist";
const rootFolder = path.basename(path.resolve());

const paths = {
	src: path.resolve(srcFolder),
	build: path.resolve(buildFolder)
}

const devConfig = {
	mode: "production",
	cache: {
		type: 'filesystem'
	},
	optimization: {
		minimizer: [new TerserPlugin({
			extractComments: false,
		})],
	},
	output: {
		path: `${paths.build}`,
		filename: 'app.min.js',
		publicPath: '/',
	},
}

export default devConfig;