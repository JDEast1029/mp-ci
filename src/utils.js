import { PROJECT_TYPE } from './constants.js';

export const validateConfig = (config) => {
	const { project = {}, upload = {}, preview = {} } = config || {};
	if (!project.appid) {
		throw new Error('project.appid不能为空')
	} else if (!project.privateKey) {
		throw new Error('project.privateKey不能为空')
	} else if (!PROJECT_TYPE.includes(project.type)) {
		throw new Error(`project.type必须是${PROJECT_TYPE.join('|')}当中的一个`)
	}
}