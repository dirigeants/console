import ava from 'ava';
import { KlasaConsole } from '../src';
import { makeWritable } from './lib';

/* eslint-disable dot-notation */
ava('Default stdout is process.stdout', (test): void => {
	const console = new KlasaConsole();
	test.is(console['stdout'], process.stdout);
});

ava('Options set properly', (test): void => {
	const console = new KlasaConsole({ useColor: true, timestamps: 'HH:mm:ss' });
	test.is(typeof console['timestamp'], 'string');
	console.utc = true;
	test.is(typeof console['timestamp'], 'string');

	const console2 = new KlasaConsole({ timestamps: false });
	test.is(console2['timestamp'], null);
});

ava('Writing to console works properly', (test): void => {
	// Need to do 1 with the timestamp for branches.
	const consoleWithTimestamp = new KlasaConsole({ stdout: makeWritable(1) });
	test.notThrows((): void => consoleWithTimestamp['write'](['Hello']));

	const stdout = makeWritable(6);
	const console = new KlasaConsole({ stdout, timestamps: false });
	for (const type of ['log', 'warn', 'error', 'debug', 'verbose', 'wtf'] as const) {
		console[type]('Hello, world!');
	}

	global.console.log(stdout.writtenData);
})
/* eslint-enable dot-notation */