// demo
export default {
	script: {
		build: 'build' // 项目内构建小程序的命令，有就执行，没有就不执行
	},
	changelog: {
		// changelog的规范，默认preset: "angular", 也可以通过config，引入自己定义的规范， config 和 preset有且只能有一个
		preset: "angular"
	},
	// 参数参照官方文档 https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html#项目对象
	project: {
		type: 'miniProgram',
		appid: 'wx62192d9d724edd32',
		projectPath: "./", // 传相对路径，内部会转换成绝对路径
		privateKeyPath: './private.wx62192d9d724edd32.key', // 传相对路径，内部会转换成绝对路径
		ignores: ['node_modules/**/*'],
	},
	// 参数参照官方文档 https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html#上传
	upload: {
		// project和version由内部指定，不接收配置文件内的值
	},
	// 参数参照官方文档 https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html#预览
	preview: {
		// project由内部指定，不接收配置文件内的值
		qrcodeOutputDest: './qrcode.png',// 传相对路径，内部会转换成绝对路径
	}
};