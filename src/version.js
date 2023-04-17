import fs from 'fs';
import path from 'path';
import enquirer from 'enquirer';
import semver from 'semver';

export const createVersion = async (ROOT_PATH, options) => {
	const currentVersion = JSON.parse(fs.readFileSync(path.resolve(ROOT_PATH, 'package.json'))).version
	const preId = options.preid ? options.preid : (semver.prerelease(currentVersion) && semver.prerelease(currentVersion)[0]);
	const versionIncrements = [
		'patch',
		'minor',
		'major',
		...(preId ? ['prepatch', 'preminor', 'premajor', 'prerelease'] : [])
	]
	const inc = i => semver.inc(currentVersion, i, preId)

	let targetVersion = '';

	const { release } = await enquirer.prompt({
		type: 'select',
		name: 'release',
		message: 'Select release type',
		choices: versionIncrements.map(i => `${i} (${inc(i)})`).concat(['custom'])
	})

	if (release === 'custom') {
		targetVersion = (await enquirer.prompt({
			type: 'input',
			name: 'version',
			message: 'Input custom version',
			initial: currentVersion
		})).version;
	} else {
		targetVersion = release.match(/\((.*)\)/)[1];
	}

	if (!semver.valid(targetVersion)) {
		throw new Error(`invalid target version: ${targetVersion}`)
	}

	const { yes } = await enquirer.prompt({
		type: 'confirm',
		name: 'yes',
		message: `Releasing v${targetVersion}. Confirm?`
	})

	if (yes) {
		return targetVersion;
	}

	return Promise.reject('发布中断: 版本号未更新')
}

export const updatePackageVersion = (ROOT_PATH, version) => {
	const pkgPath = path.resolve(ROOT_PATH, 'package.json')
	const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
	pkg.version = version
	fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
}