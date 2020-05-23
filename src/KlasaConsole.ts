import { Timestamp } from '@klasa/timestamp';
import { mergeDefault } from '@klasa/utils';
import { Console } from 'console';
import { inspect } from 'util';
import { Colors, ColorsFormatOptions } from './Colors';
import { ConsoleDefaults } from './lib/constants';

export interface ConsoleOptions {
	useColor?: boolean;
	stdout: NodeJS.WriteStream;
	stderr: NodeJS.WriteStream;
	timestamps: boolean | string;
	utc: boolean;
	types: ConsoleOptionsTypes;
	colors: {
		debug: ConsoleOptionsColor,
		error: ConsoleOptionsColor,
		log: ConsoleOptionsColor,
		verbose: ConsoleOptionsColor,
		warn: ConsoleOptionsColor,
		wtf: ConsoleOptionsColor
	};
}

export interface ConsoleOptionsColor {
	time: ColorsFormatOptions;
	message: ColorsFormatOptions;
	shard: ColorsFormatOptions;
}

export interface ConsoleOptionsTypes {
	debug: string;
	error: string;
	log: string;
	verbose: string;
	warn: string;
	wtf: string;
}

export class KlasaConsole extends Console {

	public template: Timestamp;
	public colors;
	public utc: boolean;

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

	get timestamp(): string {
		return this.utc ? this.template.displayUTC(new Date()) : this.template.display();
	}

	write(data: any[], type = 'log'): void {
		type = type.toLowerCase();
		const content = data.map((this.constructor as typeof KlasaConsole)._flatten).join('\n');
		const { time, message } = this.colors[type];
		const timestamp = this.template ? time.format(`[${this.timestamp}]`) : '';
		super[ConsoleDefaults.types[type] || 'log'](content.split('\n').map(str => `${timestamp} ${message.format(str)}`).join('\n'));
	}

	log(...data: any[]): void {
		this.write(data, 'log');
	}

	warn(...data: any[]): void {
		this.write(data, 'warn');
	}

	error(...data: any[]): void {
		this.write(data, 'error');
	}

	debug(...data: any[]): void {
		this.write(data, 'debug');
	}

	verbose(...data: any[]): void {
		this.write(data, 'verbose');
	}

	wtf(...data: any[]): void {
		this.write(data, 'wtf');
	}

	static _flatten(data: unknown | unknown[]): string {
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
