import ava from 'ava';
import { KlasaConsole } from '../src';
import { makeWritable } from './lib';

/* eslint-disable dot-notation */
ava('Default stdout is process.stdout', (test): void => {
	const kConsole = new KlasaConsole();
	test.is(kConsole['stdout'], process.stdout);
});

ava('Options set properly', (test): void => {
	const kConsole = new KlasaConsole({ useColor: true, timestamps: 'HH:mm:ss' });
	test.is(typeof kConsole['timestamp'], 'string');
	kConsole.utc = true;
	test.is(typeof kConsole['timestamp'], 'string');

	const console2 = new KlasaConsole({ timestamps: false });
	test.is(console2['timestamp'], null);
});

ava('Writing to console works properly', (test): void => {
	test.plan(7);
	// Need to do 1 with the timestamp for branches.
	const consoleWithTs = new KlasaConsole({ stdout: makeWritable(1) });
	test.is(consoleWithTs['write'](['Hello, world!']), undefined);

	const stdout = makeWritable(6);
	const kConsole = new KlasaConsole({ stdout, timestamps: false });
	for (const type of ['log', 'warn', 'error', 'debug', 'verbose', 'wtf'] as const) {
		test.notThrows((): void => kConsole[type]('Hello, world!'));
	}
});

ava('Flattening different things works properly', (test): void => {
	// eslint-disable-next-line dot-notation
	const flatten = KlasaConsole['_flatten'];

	test.is(flatten(1), '1');
	test.is(flatten(null), 'null');
	test.is(flatten(undefined), 'undefined');

	test.is(flatten('Hello, world!'), 'Hello, world!');
	test.is(flatten({ a: 1, b: 2 }), '{ a: 1, b: 2 }');
	test.is(flatten(['1', '2', '3']), '1\n2\n3');
	test.is(flatten(Symbol('foo')), 'Symbol(foo)');
});
/* eslint-enable dot-notation */
