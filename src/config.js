import fs from 'fs';
import path from 'path';
import DefaultConfig from './default.config.js';
import { validateConfig } from './utils.js';

export const getConfig = async (ROOT_PATH, options) => {
	let configPath = options.config;
	if (configPath && fs.existsSync(configPath)) {
		configPath = path.resolve(ROOT_PATH, configPath)
		let config = (await import(configPath)).default;
		
		// 合并changelog
		if (config.changelog.config) {
			config.changelog = { config: config.changelog.config }
		} else if (!config.changelog.preset) {
			config.changelog.preset = DefaultConfig.changelog.preset
		}

		// 处理project
		config.project.projectPath = path.resolve(config.project.projectPath);
		config.project.privateKeyPath = path.resolve(config.project.privateKeyPath);

		// 处理预览
		config.preview.qrcodeOutputDest = path.resolve(config.preview.qrcodeOutputDest || DefaultConfig.preview.qrcodeOutputDest)

		// 指令参数 -r(robot: 1 - 30 )
		if (options.r) {
			config.upload.robot = options.r
			config.preview.robot = options.r
		}

		// 指令参数 --progress
		if (!options.progress) {
			config.upload.onProgressUpdate = () => {}
			config.preview.onProgressUpdate = () => {}
		}
		
		try {
			validateConfig(config);
		} catch (e) {
			return Promise.reject(e);
		}

		return config
	}

	return DefaultConfig;
}