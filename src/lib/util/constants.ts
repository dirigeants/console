import { mergeDefault } from '@klasa/utils';
import { ConsoleOptions } from '../KlasaConsole';

const colorBase = {
	shard: { background: 'cyan', text: 'black' },
	message: {},
	time: {}
};

export const ConsoleDefaults: Partial<ConsoleOptions> = {
	stdout: process.stdout,
	stderr: process.stderr,
	timestamps: true,
	utc: false,
	colors: {
		debug: mergeDefault(colorBase, { time: { background: 'magenta' } }),
		error: mergeDefault(colorBase, { time: { background: 'red' } }),
		log: mergeDefault(colorBase, { time: { background: 'blue' } }),
		verbose: mergeDefault(colorBase, { time: { text: 'gray' } }),
		warn: mergeDefault(colorBase, { time: { background: 'lightyellow', text: 'black' } }),
		wtf: mergeDefault(colorBase, { message: { text: 'red' }, time: { background: 'red' } })
	}
};

export const ConsoleTypes = {
	debug: 'debug',
	error: 'error',
	log: 'log',
	verbose: 'log',
	warn: 'warn',
	wtf: 'error'
};
