import fs from 'fs';
import path from 'path';
import DefaultConfig from './default.config.js';
import { validateConfig } from './utils.js';

const isObject = (target) => {
	return  Object.prototype.toString.call(target) || Array.isArray(target);
}
const mergeObjects = (objA, objB) => {
	// 如果 B 不是对象，直接返回 A
	if (typeof objB !== "object" || objB === null) return objA;

	// 如果 A 不是对象，先把它变成一个空对象
	if (typeof objA !== "object" || objA === null) objA = {};

	// 遍历 B 的属性
	for (const key in objB) {
		if (Object.prototype.hasOwnProperty.call(objB, key)) {
			// 如果 A 中也有这个属性且是对象或数组，递归合并属性值
			if (typeof objA[key] === "object" && objA[key] !== null) {
				objA[key] = mergeObjects(objA[key], objB[key]);
			} else if (!objA[key]) {
				// 如果A中午这个值，直接复制B中的属性值
				objA[key] = objB[key];
			}
		}
	}

	return objA;
};

export const getConfig = async (ROOT_PATH, options) => {
	let configPath = options.config;
	if (configPath && fs.existsSync(configPath)) {
		configPath = path.resolve(ROOT_PATH, configPath)
		let config = (await import(configPath)).default;
		
		config = mergeObjects(config, DefaultConfig)
		
		// changelog中preset和config只能存在一个，优先config
		if (config.changelog.config) {
			config.changelog = { config: config.changelog.config }
		}

		// 处理project
		config.project.projectPath = path.resolve(config.project.projectPath);
		config.project.privateKeyPath = path.resolve(config.project.privateKeyPath);

		// 处理预览
		config.preview.qrcodeOutputDest = path.resolve(config.preview.qrcodeOutputDest)
		config.preview.pagePath = options.pagePath || config.preview.pagePath;
		config.preview.searchQuery = options.searchQuery || config.preview.searchQuery;
		config.preview.scene = options.scene || config.preview.scene;

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