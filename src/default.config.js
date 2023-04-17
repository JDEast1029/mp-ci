export default {
	script: {
		build: 'build'
	},
	changelog: {
		preset: "angular"
	},
	project: {
		type: 'miniProgram',
	},
	upload: {
		
	},
	preview: {
		qrcodeFormat: 'image', // 官方默认terminal
		qrcodeOutputDest: './qrcode.png'
	}
}