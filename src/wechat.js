import ci from 'miniprogram-ci';

export default class MPCI {
	constructor(options) {
		this.projectConfig = options.project;
		this.uploadConfig = options.upload;
		this.previewConfig = options.preview;

		this.project = new ci.Project(this.projectConfig);
	}

	upload() {
		return ci.upload({
			...this.uploadConfig,
			project: this.project,
		})
	}

	preview() {
		return ci.preview({
			...this.previewConfig,
			project: this.project,
		});
	}
}