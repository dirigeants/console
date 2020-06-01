import ava from 'ava';
import { Colors } from '../src';

ava('Colors constructor', (test): void => {
	test.is(new Colors().format('Hello, world!'), '\u001b[mHello, world!\u001b[m');
});

ava('Styles', (test): void => {
	test.is(new Colors({ style: 'bold' }).format('Hello, world!'), '\u001b[1mHello, world!\u001b[22m');

	test.is(new Colors({ style: ['bold', 'dim', 'italic'] }).format('Hello, world!'), '\u001b[1;2;3mHello, world!\u001b[22;22;23m');

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error
	test.is(new Colors({ style: 'red' }).format('Hello, world!'), '\u001b[mHello, world!\u001b[m');
});

ava('Background and Test defaults', (test): void => {
	// eslint-disable-next-line dot-notation
	const { opening: backgroundOpening, closing: backgroundClosing } = Colors['background']('red');

	test.deepEqual(backgroundOpening, [41]);

	test.deepEqual(backgroundClosing, [49]);

	// eslint-disable-next-line dot-notation
	const { opening: textOpening, closing: textClosing } = Colors['text']('red');

	test.deepEqual(textOpening, [31]);

	test.deepEqual(textClosing, [39]);
});
