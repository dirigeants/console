/**
 * The format options for Color
 */
export interface ColorsFormatOptions {
	/**
	 * The background color. Can be a basic string like "red", a hex string, or a RGB array
	 */
	background?: Color;
	/**
	 * Style or Styles to apply
	 */
	style?: Style | Style[];
	/**
	 * The text color. Can be a basic string like "red", a hex string, a RGB array, or HSL array
	 */
	text?: Color;
}

/**
 * The format data for Color
 */
export interface ColorsFormatData {
	/**
	 * The opening format data styles
	 */
	opening?: number[];
	/**
	 * The closing format data styles
	 */
	closing?: number[];
}

/**
 * The color to apply
 */
export type Color = 'black' | 'green' | 'yellow' | 'blue' | 'red' | 'magenta' | 'cyan' | 'gray' |
'grey' | 'lightgray' | 'lightgrey' | 'lightred' | 'lightgreen' |
'lightyellow' | 'lightblue' | 'lightmagenta' | 'lightcyan' | 'white' | string;

/**
 * The style or styles to apply
 */
export type Style = 'normal' | 'bold' | 'dim' | 'italic' | 'underline' | 'inverse' | 'hidden' | 'strikethrough' | string;

/**
 * The Colors class that manages the colors displayed in the console.
 */
export class Colors {

	/**
	 * The opening tags
	 */
	public opening: string;

	/**
	 * the closing tags
	 */
	public closing: string;

	constructor(options: ColorsFormatOptions = {}) {
		const { opening, closing } = Colors.text(options.text, (this.constructor as typeof Colors).background(options.background, (this.constructor as typeof Colors).style(options.style)));

		this.opening = (this.constructor as typeof Colors).useColors && opening ? `\u001B[${opening.join(';')}m` : '';
		this.closing = (this.constructor as typeof Colors).useColors && closing ? `\u001B[${closing.join(';')}m` : '';
	}

	/**
	 * Format a string
	 * @param string The string to format
	 */
	format(string: string): string {
		return this.opening + string + this.closing;
	}

	/**
		* Applies the style
		* @param styles The style or styles to apply
		* @param FormatData the format data
		*/
	static style(styles?: Style | Style[], { opening = [], closing = [] }: ColorsFormatData = {}): ColorsFormatData {
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
		* @param background the background to apply
		* @param FormatData the format data
		*/
	private static background(background?: Color, { opening = [], closing = [] }: ColorsFormatData = {}): ColorsFormatData {
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

	/**
	 * Apply the text format
	 * @param text the text format to apply
	 * @param FormatData the format data
	 */
	private static text(text?: Color, { opening = [], closing = [] }: ColorsFormatData = {}): ColorsFormatData {
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
	private static STYLES: Record<Style, number> = {
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
	private static TEXTS: Record<Color, number> = {
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
	private static BACKGROUNDS: Record<Color, number> = {
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
