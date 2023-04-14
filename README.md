# mp-ci
小程序自动上传工具

1. 获取config发布的配置文件 mp-release.config.js
```js
{
	project: IProject,
	upload: IUpload,
	preview: IPreview
}
```
IProject
| 键 | 类型 | 说明 |
| ---- | ---- |	---- |
| appid | 属性 | 小程序/小游戏项目的 appid |
| type | 属性 |	项目的类型，有效值miniProgram/miniProgramPlugin/miniGame/miniGamePlugin |
| projectPath |	属性 | 项目的路径，即project.config.json 所在的目录 |
| privateKey | 属性 | 私钥，在获取项目属性和上传时用于鉴权使用，在微信公众平台 上登录后下载 |
| attr | 异步方法 |	项目的属性，如指定了 privateKey 则会使用真实的项目属性 |
| stat | 同步方法 |	特定目录下前缀下（prefix）文件路径 (filePath) 的 stat, 如果不存在则返回 undefined |
| getFile |	异步方法 | 特定目录下前缀下（prefix）文件路径 (filePath) 的 Buffer |
| getFileList |	同步方法 | 特定目录下前缀下（prefix）文件路径 (filePath) 下的文件列表 |
| updateFile | 同步方法 | 更新项目文件 |

IUpload
| 键 | 类型 | 必填 | 说明 |
| ---- | ---- |	---- | ---- |
| project |	IProject |	是 | #项目对象 |
| version | string | 是 | 内部默认会自动生成 |
| desc | string | 否 | 内部默认会根据changelog自动生成 |
| setting | object | 否 | #编译设置 |
| onProgressUpdate | function | 否 | 进度更新监听函数 |
| robot | number | 否 | 指定使用哪一个 ci 机器人，可选值：1 ~ 30 |
| threads | number | 否 | 指定本地编译过程中开启的线程数 |

IPreview
| 键 | 类型 | 必填 | 说明 |
| ---- | ---- |	---- | ---- |
| project | IProject | 是 | #项目对象 |
| desc | string | 否 | 自定义备注，将显示在“小程序助手”开发版列表中 |
| setting | object | 否 | #编译设置 |
| onProgressUpdate | function | 否 | 进度更新监听函数 |
| robot | number | 否 | 指定使用哪一个 ci 机器人，可选值：1 ~ 30 |
| qrcodeFormat | string | 否 | 返回二维码文件的格式 "image" 或 "base64"， 默认值 "terminal" 供调试用 |
| qrcodeOutputDest | string | 是 | 二维码文件保存路径 |
| pagePath | string | 否 | 预览页面路径 |
| searchQuery | string | 否 | 预览页面路径启动参数 |
| scene | number | 否 | 默认值 1011，具体含义见场景值列表 |

1. 确认发布的版本  or  预览(只执行3)
2. 打包
3. 生成changelog
4. 提交代码
5. 上传到微信
6. 推送到github