import conventionalChangelog from 'conventional-changelog'
import fs from "fs";
import path from "path";

// TODO: 适配项目写一个自己config，参照angular
export const createChangeLog = (ROOT_PATH, config) => {
	// conventional-changelog -p angular -i CHANGELOG.md -s
	// 默认生成前一个Tag到目前的记录
	const changelogStream = conventionalChangelog(config.changelog);

	const outputFilePath = path.resolve(ROOT_PATH, "CHANGELOG.md");

	return new Promise((r, j) => {
		let newChangelog = "";

		changelogStream.on("data", (chunk) => {
			newChangelog += chunk.toString();
		});

		changelogStream.on("end", () => {
			if (!fs.existsSync(outputFilePath)) {
				fs.writeFileSync(outputFilePath, '');
			}
			
			// 读取原始的 changelog 文件
			fs.readFile(outputFilePath, (err, data) => {
				if (err) {
					j(err);
					return;
				}

				// 把新的 changelog 追加到原始 changelog 文件内容的最前面
				const oldChangelog = data.toString();
				const finalChangelog = newChangelog + oldChangelog;

				// 写入新的 changelog
				fs.writeFile(outputFilePath, finalChangelog, (err) => {
					if (err) {
						j(err);
						return;
					}
					r()
				});
			});
		});
	})
}