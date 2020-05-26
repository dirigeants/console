import { Timestamp } from '@klasa/timestamp';
import { mergeDefault } from '@klasa/utils';
import { Console } from 'console';
import { inspect } from 'util';
import { Colors, ColorsFormatOptions } from './Colors';
import { ConsoleDefaults, ConsoleTypes } from './util/constants';

/**
 * The options for the klasa console
 */
export interface ConsoleOptions {
	/**
	 * Whether the timestamps should use colours
	 */
	useColor?: boolean;
	/**
	 * The WritableStream for the output logs
	 */
	stdout: NodeJS.WriteStream;
	/**
	 * The WritableStream for the error logs
	 */
	stderr: NodeJS.WriteStream;
	/**
	 * If false, it won't use timestamps. Otherwise it will use 'YYYY-MM-DD HH:mm:ss' if true or custom if string is given
	 */
	timestamps: boolean | string;
	/**
	 * If the timestamps should be in utc
	 */
	utc: boolean;
	/**
	 * The console color styles
	 */
	colors: {
		/**
		 * An object containing a message and time color object
		 */
		debug: ConsoleOptionsColor,
		/**
		 * An object containing a message and time color object
		 */
		error: ConsoleOptionsColor,
		/**
		 * An object containing a message and time color object
		 */
		log: ConsoleOptionsColor,
		/**
		 * An object containing a message and time color object
		 */
		verbose: ConsoleOptionsColor,
		/**
		 * An object containing a message and time color object
		 */
		warn: ConsoleOptionsColor,
		/**
		 * An object containing a message and time color object
		 */
		wtf: ConsoleOptionsColor
	};
}

/**
 * Time is for the timestamp of the log, message is for the actual output.
 */
export interface ConsoleOptionsColor {
	/**
	 * A time object containing colors and styles
	 */
	time: ColorsFormatOptions;
	/**
	 * A message object containing colors and styles
	 */
	message: ColorsFormatOptions;
	/**
	 * A shard object containing colors and styles
	 */
	shard: ColorsFormatOptions;
}

/**
 * Klasa's console class, extends NodeJS Console class.
 */
export class KlasaConsole extends Console {
	/**
	 * Whether or not timestamps should be enabled for this console.
	 */
	public template: Timestamp;

	/**
	 * The colors for this console.
	 */
	public colors;

	/**
	 * Whether the timestamp should be in utc or not
	 */
	public utc: boolean;

	/**
	 * The standard output stream for this console, defaulted to process.stderr.
	 */
	private stdout: NodeJS.WriteStream;

	constructor(options: Partial<ConsoleOptions> = {}) {
		options = mergeDefault(ConsoleDefaults, options) as Required<ConsoleOptions>;
		super(options.stdout, options.stderr);

		Object.defineProperty(this, 'stdout', { value: options.stdout });
		Object.defineProperty(this, 'stderr', { value: options.stderr });

		Colors.useColors = typeof options.useColor === 'undefined' ? this.stdout.isTTY || false : options.useColor;

		this.template = options.timestamps !== false ? new Timestamp(options.timestamps === true ? 'YYYY-MM-DD HH:mm:ss' : options.timestamps) : null;

		for (const [name, formats] of Object.entries(options.colors)) {
			this.colors[name] = {};
			for (const [type, format] of Object.entries(formats)) this.colors[name][type] = new Colors(format);
		}

		this.utc = options.utc;
	}


	/**
	 * The timestamp to use
	 */
	private get timestamp(): string {
		return this.utc ? this.template.displayUTC(new Date()) : this.template.display();
	}

	/**
	 * Logs everything to the console/writable stream.
	 * @param data The data we want to print
	 * @param type The type of log, particularly useful for coloring
	 */
	protected write(data: any[], type = 'log'): void {
		type = type.toLowerCase();
		const content = data.map((this.constructor as typeof KlasaConsole)._flatten).join('\n');
		const { time, message } = this.colors[type];
		const timestamp = this.template ? time.format(`[${this.timestamp}]`) : '';
		super[ConsoleTypes[type] || 'log'](content.split('\n').map(str => `${timestamp} ${message.format(str)}`).join('\n'));
	}

	/**
	 * Calls a log write with everything to the console/writable stream.
	 * @param data The data we want to print
	 */
	log(...data: any[]): void {
		this.write(data, 'log');
	}

	/**
	 * Calls a warn write with everything to the console/writable stream.
	 * @param data The data we want to print
	 */
	warn(...data: any[]): void {
		this.write(data, 'warn');
	}

	/**
	 * Calls an error write with everything to the console/writable stream.
	 * @param data The data we want to print
	 */
	error(...data: any[]): void {
		this.write(data, 'error');
	}

	/**
	 * Calls an error write with everything to the console/writable stream.
	 * @param data The data we want to print
	 */
	public debug(...data: any[]): void {
		this.write(data, 'debug');
	}

	/**
	 * Calls a verbose write with everything to the console/writable stream.
	 * @param data The data we want to print
	 */
	public verbose(...data: any[]): void {
		this.write(data, 'verbose');
	}

	/**
	 * Calls a wtf (what a terrible failure) write with everything to the console/writable stream.
	 * @param data The data we want to print
	 */
	public wtf(...data: any[]): void {
		this.write(data, 'wtf');
	}

	/**
	 * Flattens data into a readable string.
	 * @param data Data to flatten, could be anything
	 */
	private static _flatten(data: unknown | unknown[]): string {
		if (typeof data === 'undefined' || typeof data === 'number' || data === null) return String(data);
		if (typeof data === 'string') return data;
		if (typeof data === 'object') {
			const isArray = Array.isArray(data);
			if (isArray && (data as []).every(datum => typeof datum === 'string')) return (data as string[]).join('\n');
			return (data as any).stack || (data as any).message || inspect(data, { depth: Number(isArray), colors: Colors.useColors });
		}
		return String(data);
	}

}
