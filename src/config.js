import fs from 'fs';
import path from 'path';
import DefaultConfig from './default.config.js';
import { validateConfig } from './utils.js';

export const getConfig = async (ROOT_PATH, options) => {
	let configPath = options.c || options.config;
	let config = DefaultConfig;
	if (configPath) {
		configPath = path.resolve(ROOT_PATH, options.c || options.config)
		config = (await import(configPath)).default;

		config.project.projectPath = path.resolve(config.project.projectPath);
		config.project.privateKeyPath = path.resolve(config.project.privateKeyPath);
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