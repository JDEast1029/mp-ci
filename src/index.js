import minimist from 'minimist';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import DefaultConfig from './default.config.js';
import { validateConfig } from './utils.js';
import { createVersion, updatePackageVersion } from './version.js';

const ROOT_PATH = process.cwd()

const options = minimist(process.argv.slice(2))
const step = msg => console.log(chalk.cyan(msg))
const error = (msg) => console.log(chalk.red(msg))

// dev
step(JSON.stringify(options))
const getConfig = async () => {
	let configPath = options.c || options.config;
	let config = DefaultConfig;
	if (configPath) {
		configPath = path.resolve(ROOT_PATH, options.c || options.config)
		config = (await import(configPath)).default;
		// TODO: 合并defaultconfig
	}
	try {
		// validateConfig(config);
	} catch (e) {
		return Promise.reject(e);
	}

	// TODO: 默认项设置

	return config;
}

const main = async () => {
	try {
		const config = await getConfig();
		const version = await createVersion(ROOT_PATH);
		config.upload.version = version;
		step('\nUpdating package version...')
		updatePackageVersion(ROOT_PATH, version);

		step('\nbuild package...')

	} catch (e) {
		error(e instanceof Error ? e.message : e);
	}
}

main()