import babel from '@rollup/plugin-babel';
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
	external: ['miniprogram-ci', 'conventional-changelog'],
	plugins: [
		nodeResolve({
			exportConditions: ['node'],
			preferBuiltins: true,
		}),
		commonjs(),
		json(),
		babel({ 
			babelHelpers: 'bundled',
			exclude: '**/node_modules/**'
		}),
	],
};

if (env === 'production') {
	// config.plugins.push(terser())
}

export default config