import { ColorName as IColorName, InterpolatedMaterialColors as MaterialColors } from "interpolated-material-colors";
import { createFont } from "ts-fonts";

export function grid(
  big: number, // 8 cells
  half: 0 | 1 = 0, // 4 cells
  quarter: 0 | 1 = 0, // 2 cells
  eighth: 0 | 1 = 0 // 1 cells
): number {
  const cells = big * 8 + half * 4 + quarter * 2 + eighth;
  return cells * 3;
}

export type ColorName = IColorName;

export const Colors = {
  black: MaterialColors.blueGrey(950),
  white: MaterialColors.blueGrey(0),
  ...MaterialColors,
  resolve: resolveTuple,
};

export type ColorTuple = ColorName | [ColorName, number];

function resolveTuple(tuple: ColorTuple): string {
  if (Array.isArray(tuple)) {
    return Colors[tuple[0]](tuple[1]);
  }
  return Colors[tuple](500);
}

const LINE_HEIGHT_RATIO = 0.625;

function fontSizeFromLineHeight(size: number) {
  return Math.floor(size * LINE_HEIGHT_RATIO);
}

export function fontHeight(size: number): {
  fontSize: number;
  lineHeight: string;
} {
  return {
    fontSize: fontSizeFromLineHeight(size),
    lineHeight: size + "px",
  } as const;
}

export function fontHeightGrid(
  big: number, // 8 cells
  half?: 0 | 1, // 4 cells
  quarter?: 0 | 1, // 2 cells
  eighth?: 0 | 1 // 1 cells
): { fontSize: number; lineHeight: string } {
  return fontHeight(grid(big, half, quarter, eighth));
}

const SpaceGrotesk = createFont(`SpaceGrotesk`, {
  400: {
    normal: "/fonts/SpaceGrotesk-Regular",
  },
  300: {
    normal: "/fonts/SpaceGrotesk-Light",
  },
  600: {
    normal: "/fonts/SpaceGrotesk-Bold",
  },
  500: {
    normal: "/fonts/SpaceGrotesk-Medium",
  },
});

export const fontFaces = SpaceGrotesk.fontFaces;

export const Fonts = {
  SpaceGrotesk: SpaceGrotesk.styles,
};
