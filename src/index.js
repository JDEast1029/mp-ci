import minimist from 'minimist';
import chalk from 'chalk';
import { execa } from 'execa';
import { mergeOptionsWithDefault } from './utils.js';
import { getConfig } from './config.js';
import { createVersion, updatePackageVersion } from './version.js';
import { createChangeLog } from "./change-log.js";
import MPCI from "./wechat.js";

const ROOT_PATH = process.cwd()

const options = mergeOptionsWithDefault(minimist(process.argv.slice(2)))
const isDryRun = options.dry
const step = msg => console.log(chalk.cyan(msg))
const error = (msg) => console.log(chalk.red(msg))
const run = (bin, args, opts = {}) =>
  execa(bin, args, { stdio: 'inherit', ...opts })
const dryRun = (bin, args, opts = {}) =>
  console.log(chalk.blue(`[dryrun] ${bin} ${args.join(' ')}`), opts)

const runIfNotDry = isDryRun ? dryRun : run

export const main = async () => {
	try {
		const config = await getConfig(ROOT_PATH, options);
		const targetVersion = await createVersion(ROOT_PATH, options);
		config.upload.version = targetVersion;

		const mpCI = new MPCI(config)
		const uploadFn = async () => {
			step('\nUploading to miniprogram...')
			await mpCI.upload();
		}
		if (options.preview) {
			step('\nPreviewing to miniprogram...')
			await mpCI.preview()
			return;
		} else if (options.onlyUpload) {
			await uploadFn()
			return
		}

		step('\nUpdating package version...')
		updatePackageVersion(ROOT_PATH, targetVersion);
		
		if (!options.skipBuild && config.script.build) {
			step('\nBuild package...')
			await run('npm', ['run', config.script.build])
		}

		step('\nGenerating changelog...')
		await createChangeLog(ROOT_PATH, config)

		const { stdout } = await run('git', ['diff'], { stdio: 'pipe' })
		if (stdout) {
			step('\nCommitting changes...')
			await runIfNotDry('git', ['add', '-A'])
			await runIfNotDry('git', ['commit', '-m', `release: v${targetVersion}`])
		} else {
			console.log('No changes to commit.')
		}

		step('\nPushing to GitHub...')
		await runIfNotDry('git', ['tag', `v${targetVersion}`])
		await runIfNotDry('git', ['push', 'origin', `refs/tags/v${targetVersion}`])
		await runIfNotDry('git', ['push'])
		if (isDryRun) {
			console.log(`\nDry run finished - run git diff to see package changes.`)
		}

		await uploadFn()

		console.log()
	} catch (e) {
		if (e instanceof Error) {
			error(e.message);
			console.log(e);
		} else {
			error(e)
		}
	}
}