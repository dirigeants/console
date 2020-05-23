export interface ColorsFormatOptions {
	background?: string;
	style?: string | string[];
	text?: string;
}

export type ColorsFormatType = string | number | [string, string, string] | [number, number, number];

export interface ColorsFormatData {
	opening?: number[];
	closing?: number[];
}

/**
 * The Colors class that manages the colors displayed in the console.
 */
export class Colors {

	public opening: string;
	public closing: string;


	/**
	 * @typedef {Object} ColorsFormatOptions
	 * @property {(string|string[])} [style] The style or styles to apply
	 * @property {string} [background] The format for the background
	 * @property {string} [text] The format for the text
	 */

	/**
	 * @typedef {Object} ColorsFormatData
	 * @property {string[]} opening The opening format data styles
	 * @property {string[]} closing The closing format data styles
	 * @private
	 */

	/**
	 * Constructs our Colors instance
	 * @param {ColorsFormatOptions} [options = {}] The options for this format
	 * @since 0.4.0
	 */
	constructor(options: ColorsFormatOptions = {}) {
		const { opening, closing } = Colors.text(options.text, (this.constructor as typeof Colors).background(options.background, (this.constructor as typeof Colors).style(options.style)));

		/**
		 * The opening tags
		 * @type {string}
		 * @since 0.5.0
		 */
		this.opening = (this.constructor as typeof Colors).useColors && opening ? `\u001B[${opening.join(';')}m` : '';

		/**
		 * The closing tags
		 * @type {string}
		 * @since 0.5.0
		 */
		this.closing = (this.constructor as typeof Colors) && closing ? `\u001B[${closing.join(';')}m` : '';
	}

	/**
	 * Format a string
	 * @since 0.4.0
	 * @param {string} string The string to format
	 * @returns {string}
	 */
	format(string: string): string {
		return this.opening + string + this.closing;
	}

	/**
	 * Apply the style
	 * @since 0.5.0
	 * @param {(string|string[])} [styles] The style or styles to apply
	 * @param {ColorsFormatData} [data={}] The data
	 * @returns {ColorsFormatData}
	 * @private
	 */
	static style(styles?: string | string[], { opening = [], closing = [] }: ColorsFormatData = {}): ColorsFormatData {
		if (styles) {
			if (!Array.isArray(styles)) styles = [styles];
			for (let style of styles) {
				style = style.toLowerCase();
				if (!(style in this.STYLES)) continue;
				opening.push(this.STYLES[style]);
				closing.push(this.CLOSE[style]);
			}
		}
		return { opening, closing };
	}

	/**
	 * Apply the background
	 * @since 0.5.0
	 * @param background The background to apply
	 * @param data The data
	 */
	private static background(background?: string, { opening = [], closing = [] }: ColorsFormatData = {}): ColorsFormatData {
		if (background && background.toLowerCase() in this.BACKGROUNDS) {
			opening.push(this.BACKGROUNDS[background.toLowerCase()]);
			closing.push(this.CLOSE.background);
		}
		return { opening, closing };
	}

	/**
	 * Apply the text format
	 * @since 0.5.0
	 * @param text The text format to apply
	 * @param data The data
	 */
	private static text(text?: string, { opening = [], closing = [] }: ColorsFormatData = {}): ColorsFormatData {
		if (text && text.toLowerCase() in this.TEXTS) {
			opening.push(this.TEXTS[text.toLowerCase()]);
			closing.push(this.CLOSE.text);
		}
		return { opening, closing };
	}

	/**
	 * Determines if this class should be constructed with colors or not
	 */
	static useColors = true;

	/**
	 * The close codes
	 */
	private static CLOSE: Record<string, number> = {
		normal: 0,
		bold: 22,
		dim: 22,
		italic: 23,
		underline: 24,
		inverse: 27,
		hidden: 28,
		strikethrough: 29,
		text: 39,
		background: 49
	};

	/**
	 * The style codes
	 */
	private static STYLES: Record<string, number> = {
		normal: 0,
		bold: 1,
		dim: 2,
		italic: 3,
		underline: 4,
		inverse: 7,
		hidden: 8,
		strikethrough: 9
	};

	/**
	 * The text codes
	 */
	private static TEXTS: Record<string, number> = {
		black: 30,
		red: 31,
		green: 32,
		yellow: 33,
		blue: 34,
		magenta: 35,
		cyan: 36,
		lightgray: 37,
		lightgrey: 37,
		gray: 90,
		grey: 90,
		lightred: 91,
		lightgreen: 92,
		lightyellow: 93,
		lightblue: 94,
		lightmagenta: 95,
		lightcyan: 96,
		white: 97
	};

	/**
	 * The background codes
	 */
	private static BACKGROUNDS: Record<string, number> = {
		black: 40,
		red: 41,
		green: 42,
		yellow: 43,
		blue: 44,
		magenta: 45,
		cyan: 46,
		gray: 47,
		grey: 47,
		lightgray: 100,
		lightgrey: 100,
		lightred: 101,
		lightgreen: 102,
		lightyellow: 103,
		lightblue: 104,
		lightmagenta: 105,
		lightcyan: 106,
		white: 107
	};

}
