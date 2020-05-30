import { Timestamp } from '@klasa/timestamp';
import { mergeDefault } from '@klasa/utils';
import { Console } from 'console';
import { inspect } from 'util';
import { Colors, ColorsFormatOptions } from './Colors';
import { ConsoleDefaults, ConsoleTypes } from './util/constants';

/**
 * The options for the klasa console.
 * @since 0.0.1
 */
export interface ConsoleOptions {
	/**
	 * Whether the timestamps should use colours.
	 * @since 0.0.1
	 */
	useColor?: boolean;

	/**
	 * The WritableStream for the output logs.
	 * @since 0.0.1
	 * @default process.stdout
	 */
	stdout: NodeJS.WriteStream;

	/**
	 * The WritableStream for the error logs.
	 * @since 0.0.1
	 * @default process.stderr
	 */
	stderr: NodeJS.WriteStream;

	/**
	 * If false, it won't use timestamps. Otherwise it will use 'YYYY-MM-DD HH:mm:ss' if true or custom if string is given.
	 * @since 0.0.1
	 * @default true
	 */
	timestamps: boolean | string;

	/**
	 * If the timestamps should be in utc.
	 * @since 0.0.1
	 * @default false
	 */
	utc: boolean;

	/**
	 * The console color styles.
	 * @since 0.0.1
	 */
	colors: ConsoleColorsOptions;
}

/**
 * The console output types.
 * @since 0.0.1
 */
export type ConsoleOutputType = 'debug' | 'error' | 'log' | 'verbose' | 'warn' | 'wtf';

/**
 * The console color options.
 * @since 0.0.1
 */
export interface ConsoleColorsOptions extends Record<ConsoleOutputType, ConsoleOptionsColor> {
	/**
	 * An object containing a message and time color object.
	 * @since 0.0.1
	 */
	debug: ConsoleOptionsColor;

	/**
	 * An object containing a message and time color object.
	 * @since 0.0.1
	 */
	error: ConsoleOptionsColor;

	/**
	 * An object containing a message and time color object.
	 * @since 0.0.1
	 */
	log: ConsoleOptionsColor;

	/**
	 * An object containing a message and time color object.
	 * @since 0.0.1
	 */
	verbose: ConsoleOptionsColor;

	/**
	 * An object containing a message and time color object.
	 * @since 0.0.1
	 */
	warn: ConsoleOptionsColor;

	/**
	 * An object containing a message and time color object.
	 * @since 0.0.1
	 */
	wtf: ConsoleOptionsColor;
}

/**
 * Time is for the timestamp of the log, message is for the actual output.
 * @since 0.0.1
 */
export interface ConsoleOptionsColor extends Record<string, ColorsFormatOptions> {
	/**
	 * A time object containing colors and styles.
	 * @since 0.0.1
	 */
	time: ColorsFormatOptions;

	/**
	 * A message object containing colors and styles.
	 * @since 0.0.1
	 */
	message: ColorsFormatOptions;

	/**
	 * A shard object containing colors and styles.
	 * @since 0.0.1
	 */
	shard: ColorsFormatOptions;
}

/**
 * Klasa's console class, extends NodeJS Console class.
 * @since 0.0.1
 */
export class KlasaConsole extends Console {

	/**
	 * Whether or not timestamps should be enabled for this console.
	 * @since 0.0.1
	 */
	public template: Timestamp | null;

	/**
	 * The colors for this console.
	 * @since 0.0.1
	 */
	public colors: Record<ConsoleOutputType, Record<string, Colors>>;

	/**
	 * Whether the timestamp should be in utc or not.
	 * @since 0.0.1
	 */
	public utc: boolean;

	/**
	 * The standard output stream for this console, defaulted to process.stderr.
	 * @since 0.0.1
	 */
	private stdout!: NodeJS.WriteStream;

	/**
	 * @since 0.0.1
	 * @param options The options for the console.
	 */
	public constructor(options: Partial<ConsoleOptions> = {}) {
		const castedOptions = mergeDefault(ConsoleDefaults, options) as Required<ConsoleOptions>;
		super(castedOptions.stdout, options.stderr);

		Object.defineProperty(this, 'stdout', { value: castedOptions.stdout });
		Object.defineProperty(this, 'stderr', { value: castedOptions.stderr });

		// eslint-disable-next-line dot-notation
		Colors['useColors'] = castedOptions.useColor ?? (this.stdout.isTTY || false);

		this.template = castedOptions.timestamps !== false ? new Timestamp(castedOptions.timestamps === true ? 'YYYY-MM-DD HH:mm:ss' : castedOptions.timestamps) : null;

		this.colors = {} as Record<ConsoleOutputType, Record<string, Colors>>;

		for (const [name, formats] of Object.entries(castedOptions.colors)) {
			this.colors[name as ConsoleOutputType] = {};
			for (const [type, format] of Object.entries(formats)) this.colors[name as ConsoleOutputType][type] = new Colors(format as ColorsFormatOptions);
		}

		this.utc = castedOptions.utc;
	}
	/**
	 * The timestamp to use.
	 * @since 0.0.1
	 */
	private get timestamp(): string | null {
		return this.template ? this.utc ? this.template.displayUTC(new Date()) : this.template.display() : null;
	}

	/**
	 * Logs everything to the console/writable stream.
	 * @since 0.0.1
	 * @param data The data we want to print
	 * @param type The type of log, particularly useful for coloring
	 */
	protected write(data: readonly unknown[], type: ConsoleOutputType = 'log'): void {
		type = type.toLowerCase() as ConsoleOutputType;
		const content = data.map((this.constructor as typeof KlasaConsole)._flatten).join('\n');
		const { time, message } = this.colors[type];
		const timestamp = this.template ? time.format(`[${this.timestamp as string}]`) : '';
		/* istanbul ignore next */
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		super[ConsoleTypes[type] || 'log'](content.split('\n').map(str => `${timestamp} ${message.format(str)}`).join('\n'));
	}

	/**
	 * Calls a log write with everything to the console/writable stream.
	 * @since 0.0.1
	 * @param data The data we want to print
	 */
	public log(...data: readonly unknown[]): void {
		this.write(data, 'log');
	}

	/**
	 * Calls a warn write with everything to the console/writable stream.
	 * @since 0.0.1
	 * @param data The data we want to print
	 */
	public warn(...data: readonly unknown[]): void {
		this.write(data, 'warn');
	}

	/**
	 * Calls an error write with everything to the console/writable stream.
	 * @since 0.0.1
	 * @param data The data we want to print
	 */
	public error(...data: readonly unknown[]): void {
		this.write(data, 'error');
	}

	/**
	 * Calls an error write with everything to the console/writable stream.
	 * @since 0.0.1
	 * @param data The data we want to print
	 */
	public debug(...data: readonly unknown[]): void {
		this.write(data, 'debug');
	}

	/**
	 * Calls a verbose write with everything to the console/writable stream.
	 * @since 0.0.1
	 * @param data The data we want to print
	 */
	public verbose(...data: readonly unknown[]): void {
		this.write(data, 'verbose');
	}

	/**
	 * Calls a wtf (what a terrible failure) write with everything to the console/writable stream.
	 * @since 0.0.1
	 * @param data The data we want to print
	 */
	public wtf(...data: readonly unknown[]): void {
		this.write(data, 'wtf');
	}

	/**
	 * Flattens data into a readable string.
	 * @since 0.0.1
	 * @param data Data to flatten, could be anything
	 */
	private static _flatten(data: unknown | readonly unknown[]): string {
		if (typeof data === 'undefined' || typeof data === 'number' || data === null) return String(data);
		if (typeof data === 'string') return data;
		if (typeof data === 'object') {
			const isArray = Array.isArray(data);
			if (isArray && (data as []).every(datum => typeof datum === 'string')) return (data as string[]).join('\n');
			// eslint-disable-next-line dot-notation
			return (data as Error).stack || (data as Error).message || inspect(data, { depth: Number(isArray), colors: Colors['useColors'] });
		}
		return String(data);
	}

}
