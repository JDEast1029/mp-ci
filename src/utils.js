import { PROJECT_TYPE } from './constants.js';
import { DEFAULT_OPTIONS } from './constants.js';

export const validateConfig = (config) => {
	const { project = {}, upload = {}, preview = {}, changelog = {} } = config || {};
	if (!project.appid) {
		throw new Error('project.appid不能为空')
	} else if (!project.privateKeyPath) {
		throw new Error('project.privateKeyPath不能为空')
	} else if (!PROJECT_TYPE.includes(project.type)) {
		throw new Error(`project.type必须是${PROJECT_TYPE.join('|')}当中的一个`)
	} else if (!changelog.preset && !changelog.config) {
		throw new Error(`changelog内需要设置preset或者config`)
	} else if (changelog.preset && changelog.config) {
		throw new Error(`changelog内不能同时设置preset或者config`)
	}
}

export const mergeOptionsWithDefault = (options = {}) => {
	options = {
		...DEFAULT_OPTIONS,
		...options
	}
	if (options.c) {
		options.config = options.c;
		Reflect.deleteProperty(options, 'c');
	}
	return options;
}