//
// Types
//

/**
 * A 3-component color value representing a 24-bit color.
 * @property `r` - [0..255] red component
 * @property `g` - [0..255] green component
 * @property `b` - [0..255] blue component
 */
export interface ColorRGB255 {
    /** [0..255] */ r: number,
    /** [0..255] */ g: number,
    /** [0..255] */ b: number,
}

/** @throws TypeError */
export const assertRGB255 = (c: ColorRGB255): void | never => {
    if (!(
        (c.r === Math.floor(c.r) && 0 <= c.r && c.r <= 255) &&
        (c.g === Math.floor(c.g) && 0 <= c.g && c.g <= 255) &&
        (c.b === Math.floor(c.b) && 0 <= c.b && c.b <= 255))) {
        throw new TypeError(`ColorRGB255 must be an integer between 0 and 255 inclusive. Value was r${c.r} g${c.g} b${c.b}`);
    }
};

/**
 * A 3-component color value representing a float color.
 * @property `r` - [0..1] red component
 * @property `g` - [0..1] green component
 * @property `b` - [0..1] blue component
 */
export interface ColorRGB01 {
    /** [0..1] */ r: number,
    /** [0..1] */ g: number,
    /** [0..1] */ b: number,
}

/** @throws TypeError */
export const assertRGB01 = (c: ColorRGB01): void | never => {
    if (!(
        (0.0 <= c.r && c.r <= 1.0) &&
        (0.0 <= c.g && c.g <= 1.0) &&
        (0.0 <= c.b && c.b <= 1.0))) {
        throw new TypeError(`ColorRGB01 must be an fraction/decimal between 0.0 and 1.0 inclusive. Value was r${c.r} g${c.g} b${c.b}`);
    }
};

/**
 * A 3-component color value representing HSL.
 * @property `g` - [0..360] hue component
 * @property `s` - [0..1] saturation component
 * @property `l` - [0..1] lightness component
 */
export interface ColorHSL {
    /** [0..360] */ h: number,
    /** [0..100] */ s: number,
    /** [0..100] */ l: number,
}

export type HexColorComponent = `${number | string}${number | string | ''}`;
export type ColorHex = `${'#' | ''}${HexColorComponent}${HexColorComponent}${HexColorComponent}`;
export type ColorHex6 = `${'#' | ''}${number | string}${number | string}${number | string}${number | string}${number | string}${number | string}`;
export type ColorHex3 = `${'#' | ''}${number | string}${number | string}${number | string}`;

//
// Conversions
//

export namespace ColorConvert {
    /** ColorRGB255 */
    export namespace rgb255 {
        /** {@link ColorRGB255} => {@link ColorRGB01} */
        export const toRGB01 = (c: ColorRGB255): ColorRGB01 => {
            assertRGB255(c);
            return {
                r: c.r / 255.0,
                g: c.g / 255.0,
                b: c.b / 255.0,
            };
        };
        /** {@link ColorRGB255} => {@link ColorHSL} */
        export const toHSL = (c: ColorRGB255): ColorHSL => rgb01.toHSL(toRGB01(c));
    }
    export namespace rgb01 {
        /** {@link ColorRGB01} => {@link ColorHSL} */
        export const toHSL = (c: ColorRGB01): ColorHSL => {
            assertRGB01(c);
            const l = Math.max(c.r, c.g, c.b);
            const s = l - Math.min(c.r, c.g, c.b);
            const h = s
                ? l === c.r
                    ? (c.g - c.b) / s
                    : l === c.g
                        ? 2 + (c.b - c.r) / s
                        : 4 + (c.r - c.g) / s
                : 0;
            return {
                h: 60 * h < 0
                    ? 60 * h + 360
                    : 60 * h,
                s: 100 * (s
                    ? (l <= 0.5
                        ? s / (2 * l - s)
                        : s / (2 - (2 * l - s)))
                    : 0),
                l: (100 * (2 * l - s)) / 2,
            };
        };

        /** {@link ColorRGB01} => {@link ColorRGB255} */
        export const toRGB255 = (c: ColorRGB01): ColorRGB255 => {
            assertRGB01(c);
            return {
                r: c.r * 255.0,
                g: c.g * 255.0,
                b: c.b * 255.0,
            };
        };
    }
    export namespace hsl {
        // todo, if need arises.
    }
    export namespace hex6 {
        /** {@link ColorHex6} => {@link ColorRGB255} */
        export const toRGB255 = (hexColor: ColorHex6): ColorRGB255 => {
            const rx: RegExp = /#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})/i;
            const sections: RegExpExecArray = rx.exec(hexColor)!;
            const hexVal = (x: string): number => Number('0x' + x);
            return {
                r: hexVal(sections[1]),
                g: hexVal(sections[2]),
                b: hexVal(sections[3]),
            } as ColorRGB255;
        };

        /** {@link ColorHex6} => {@link ColorRGB01} */
        export const toRGB01 = (hexColor: ColorHex6): ColorRGB01 => rgb255.toRGB01(toRGB255(hexColor));

        /** {@link ColorHex6} => {@link ColorHSL} */
        export const toHSL = (hexColor: ColorHex6): ColorHSL => rgb01.toHSL(toRGB01(hexColor));
    }
}

//
// Functions
//

/** Returns the perceived brightness of a color. */
export const getBrightness = (color: ColorRGB01): number => {
    assertRGB01(color);
    return (color.r * 0.299 + color.g * 0.587 + color.b * 0.114);
};

/** Finds whether black or white will contrast better with the given color. */
export const colorContrast = (color: ColorRGB01): string => {
    assertRGB01(color);
    return getBrightness(color) < 0.55 ? "white" : "black";
};

export const rgbToHilbert = (color: ColorRGB255): number => {
    assertRGB255(color);
    const n = 8; // Recursion level

    let r = { x: 0, y: 0, z: 0 }; // Initial orientation

    let d = 0;

    for (let i = n - 1; i >= 0; --i) {
        const b: ColorRGB255 = {
            r: (color.r >> i) & 1,
            g: (color.g >> i) & 1,
            b: (color.b >> i) & 1,
        };

        const c = {
            x: r.y ^ b.g ^ b.b,
            y: r.x ^ b.r ^ b.b,
            z: r.z ^ b.r ^ b.g,
        };

        d +=
            (c.x << (3 * i + 2)) +
            (c.y << (3 * i + 1)) +
            (c.z << (3 * i));
        
        r = c;
    }

    return d;
};

/**
 * Finds where on the color wheel the given color falls under.
 * @example```
 * "#FF0000" // "red"
 * "#0000AA" // "blue"
 * "#FFFF00" // "yellow"
 * "#000000" // "black"
 * "#C0C0C0" // "gray"
 * ```
 */
export const colorCategory = (color: ColorHSL): string => {
    const hueNames: string[] = [
        "red",
        "orange",
        "yellow",
        "green",
        "green",
        "green",
        "cyan",
        "azure",
        "blue",
        "violet",
        "magenta",
        "rose",
    ];
    if (color.l < 15 && color.s < 50) {
        return "black";
    } else if (color.l > 95) {
        return "white";
    } else if (color.s < 0.15 * (100 - color.l)) {
        return "gray";
    } else if (color.l > 75 && (color.h <= 30 || color.h >= 290)) {
        return "pink";
    } else {
        return hueNames[Math.floor(color.h / 30)];
    }
};

export const colorSort = (a: ColorRGB255, b: ColorRGB255): number => {
    try {
        const hilbertA: number = rgbToHilbert(a);
        const hilbertB: number = rgbToHilbert(b);
        return hilbertA - hilbertB;
    } catch (err) {
        console.error(err);
        return 0;
    }
};
