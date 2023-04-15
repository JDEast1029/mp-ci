import minimist from 'minimist';
import chalk from 'chalk';
import { execa } from 'execa';
import { getConfig } from './config.js';
import { createVersion, updatePackageVersion } from './version.js';
import { createChangeLog } from "./change-log.js";

const ROOT_PATH = process.cwd()

const options = minimist(process.argv.slice(2))
const step = msg => console.log(chalk.cyan(msg))
const error = (msg) => console.log(chalk.red(msg))
const run = (bin, args, opts = {}) =>
  execa(bin, args, { stdio: 'inherit', ...opts })

export const main = async () => {
	try {
		// dev
		// const config = await getConfig(ROOT_PATH, options);
		// const version = await createVersion(ROOT_PATH);
		// config.upload.version = version;
		
		// step('\nUpdating package version...')
		// updatePackageVersion(ROOT_PATH, version);
		
		// step('\nbuild package...')
		// await run('npm', ['run', config.script.build || 'build'])
		

		step('\nGenerating changelog...')
		await createChangeLog(ROOT_PATH, options)
	} catch (e) {
		error(e instanceof Error ? e.message : e);
	}
}