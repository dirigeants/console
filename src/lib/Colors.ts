/**
 * The format options for Color.
 * @since 0.0.1
 */
export interface ColorsFormatOptions {
	/**
	 * The background color. Can be a basic string like "red", a hex string, or a RGB array.
	 * @since 0.0.1
	 */
	background?: Color;

	/**
	 * Style or Styles to apply.
	 * @since 0.0.1
	 */
	style?: Style | Style[];

	/**
	 * The text color. Can be a basic string like "red", a hex string, a RGB array, or HSL array.
	 * @since 0.0.1
	 */
	text?: Color;
}

/**
 * The format data for Color.
 * @since 0.0.1
 */
export interface ColorsFormatData {
	/**
	 * The opening format data styles.
	 * @since 0.0.1
	 */
	opening?: number[];
	/**
	 * The closing format data styles.
	 * @since 0.0.1
	 */
	closing?: number[];
}

/**
 * The color to apply.
 * @since 0.0.1
 */
export type Color = 'black' | 'green' | 'yellow' | 'blue' | 'red' | 'magenta' | 'cyan' | 'gray' |
'grey' | 'lightgray' | 'lightgrey' | 'lightred' | 'lightgreen' |
'lightyellow' | 'lightblue' | 'lightmagenta' | 'lightcyan' | 'white';

/**
 * The style or styles to apply.
 * @since 0.0.1
 */
export type Style = 'normal' | 'bold' | 'dim' | 'italic' | 'underline' | 'inverse' | 'hidden' | 'strikethrough';

/**
 * The Colors class that manages the colors displayed in the console.
 * @since 0.0.1
 */
export class Colors {

	/**
	 * The opening tags.
	 * @since 0.0.1
	 */
	public readonly opening: string;

	/**
	 * the closing tags.
	 * @since 0.0.1
	 */
	public readonly closing: string;

	/**
	 * @since 0.0.1
	 * @param options The options.
	 * @example
	 * const red = new Colors({ text: 'red' });
	 * console.log(red.format('Hello World'));
	 * // A 'Hello World' string will be printed red.
	 */
	public constructor(options: ColorsFormatOptions = {}) {
		const { opening, closing } = Colors.text(options.text, (this.constructor as typeof Colors).background(options.background, (this.constructor as typeof Colors).style(options.style)));

		this.opening = (this.constructor as typeof Colors).useColors && opening ? `\u001B[${opening.join(';')}m` : '';
		this.closing = (this.constructor as typeof Colors).useColors && closing ? `\u001B[${closing.join(';')}m` : '';
	}

	/**
	 * Format a string.
	 * @since 0.0.1
	 * @param string The string to format
	 */
	public format(string: string): string {
		return this.opening + string + this.closing;
	}

	/**
	 * Applies the style.
	 * @since 0.0.1
	 * @param styles The style or styles to apply
	 * @param FormatData the format data
	 */
	private static style(styles?: Style | Style[], { opening = [], closing = [] }: ColorsFormatData = {}): ColorsFormatData {
		if (styles) {
			if (!Array.isArray(styles)) styles = [styles];
			for (let style of styles) {
				style = style.toLowerCase() as Style;
				if (!Reflect.has(this.STYLES, style)) continue;
				opening.push(this.STYLES[style]);
				closing.push(this.CLOSE[style]);
			}
		}
		return { opening, closing };
	}

	/**
	 * Applies the background.
	 * @since 0.0.1
	 * @param background the background to apply
	 * @param FormatData the format data
	 */
	private static background(background?: Color, { opening = [], closing = [] }: ColorsFormatData = {}): ColorsFormatData {
		if (background && Reflect.has(this.BACKGROUNDS, background.toLowerCase())) {
			opening.push(this.BACKGROUNDS[background.toLowerCase()]);
			closing.push(this.CLOSE.background);
		}
		return { opening, closing };
	}

	/**
	 * Applies the text format.
	 * @since 0.0.1
	 * @param text the text format to apply
	 * @param FormatData the format data
	 */
	private static text(text?: Color, { opening = [], closing = [] }: ColorsFormatData = {}): ColorsFormatData {
		if (text && Reflect.has(this.TEXTS, text.toLowerCase())) {
			opening.push(this.TEXTS[text.toLowerCase()]);
			closing.push(this.CLOSE.text);
		}
		return { opening, closing };
	}

	/**
	 * Determines if this class should be constructed with colors or not.
	 * @since 0.0.1
	 */
	protected static useColors = true;

	/**
	 * The close codes.
	 * @since 0.0.1
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
	 * The style codes.
	 * @since 0.0.1
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
	 * The text codes.
	 * @since 0.0.1
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
	 * The background codes.
	 * @since 0.0.1
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
