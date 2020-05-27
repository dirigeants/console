import ava from 'ava';
import { KlasaConsole } from '../src';

ava('Default stdout is process.stdout', (test): void => {
	const console = new KlasaConsole();
	test.is(console['stdout'], process.stdout);
});

ava('Options set properly', (test): void => {
	const console = new KlasaConsole({ useColor: true, timestamps: 'HH:mm:ss' });
	test.true(typeof console['timestamp'] === 'string');
	console.utc = true;
	test.true(typeof console['timestamp'] === 'string');

	const console2 = new KlasaConsole({timestamps: false});
	test.true(typeof console2['timestamp'] !== 'string');
})