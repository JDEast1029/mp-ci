import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import terser from "@rollup/plugin-terser";
import json from "@rollup/plugin-json";
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const env = process.env.NODE_ENV
const config = {
	input: './src/index.js',
	output: [{
		file: 'lib/index.cjs',
		format: 'cjs',
	},{
		file: 'lib/index.mjs',
		format: 'esm',
	}],
	plugins: [
		commonjs(), 
		nodeResolve({
			extensions:['.js'],
		}),
		json(),
		babel({ 
			babelHelpers: 'bundled',
			exclude: '**/node_modules/**'
		}),
	]
};

if (env === 'production') {
	config.plugins.push(terser())
}

export default config