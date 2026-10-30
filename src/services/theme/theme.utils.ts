import type { ThemeColorMap, ThemeColorPalette } from './theme.types';

type RgbColor = {
  red: number;
  green: number;
  blue: number;
};

type OklchColor = {
  lightness: number;
  chroma: number;
  hue: number;
};

type AccentColor = {
  chroma: number;
  hue: number;
};

const parseAccentColor = (accentHex: string): AccentColor => {
  const hexMatch: RegExpExecArray | null = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(accentHex.trim());

  if (hexMatch === null) {
    throw new TypeError('Accent color must be a 3- or 6-digit hex value.');
  }

  const capturedHex: string = hexMatch[1];
  const expandedHex: string =
    capturedHex.length === 3
      ? [...capturedHex].map((channel: string): string => `${channel}${channel}`).join('')
      : capturedHex;
  const rgb: RgbColor = {
    red: Number.parseInt(expandedHex.slice(0, 2), 16) / 255,
    green: Number.parseInt(expandedHex.slice(2, 4), 16) / 255,
    blue: Number.parseInt(expandedHex.slice(4, 6), 16) / 255,
  };
  const oklchColor: OklchColor = convertRgbToOklch(rgb);

  return { chroma: oklchColor.chroma, hue: oklchColor.hue };
};

const convertSrgbChannelToLinear = (channel: number): number =>
  channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;

const convertRgbToOklch = ({ red, green, blue }: RgbColor): OklchColor => {
  const linearRed: number = convertSrgbChannelToLinear(red);
  const linearGreen: number = convertSrgbChannelToLinear(green);
  const linearBlue: number = convertSrgbChannelToLinear(blue);

  const l: number = Math.cbrt(
    0.4122214708 * linearRed + 0.5363325363 * linearGreen + 0.0514459929 * linearBlue,
  );
  const m: number = Math.cbrt(
    0.2119034982 * linearRed + 0.6806995451 * linearGreen + 0.1073969566 * linearBlue,
  );
  const s: number = Math.cbrt(
    0.0883024619 * linearRed + 0.2817188376 * linearGreen + 0.6299787005 * linearBlue,
  );

  const lightness: number = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a: number = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const b: number = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const chroma: number = Math.hypot(a, b);
  const hue: number = chroma < 0.000001 ? 0 : ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360;

  return { lightness, chroma, hue };
};

const toOklch = (lightness: number, chroma: number, hue: number): string =>
  `oklch(${lightness.toFixed(3)} ${chroma.toFixed(3)} ${hue.toFixed(1)})`;

const getTintedNeutral = (accent: AccentColor, lightness: number, chromaFactor: number): string =>
  toOklch(lightness, accent.chroma * chromaFactor, accent.hue);

const getAccessibleForeground = ({ red, green, blue }: RgbColor): string => {
  const linearRed: number = convertSrgbChannelToLinear(red);
  const linearGreen: number = convertSrgbChannelToLinear(green);
  const linearBlue: number = convertSrgbChannelToLinear(blue);
  const luminance: number = 0.2126 * linearRed + 0.7152 * linearGreen + 0.0722 * linearBlue;
  const whiteContrast: number = 1.05 / (luminance + 0.05);
  const blackContrast: number = (luminance + 0.05) / 0.05;

  return whiteContrast > blackContrast ? '#ffffff' : '#000000';
};

const convertOklchToRgb = ({ lightness, chroma, hue }: OklchColor): RgbColor => {
  const radians: number = (hue * Math.PI) / 180;
  const a: number = chroma * Math.cos(radians);
  const b: number = chroma * Math.sin(radians);
  const l: number = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m: number = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s: number = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const linearRed: number = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const linearGreen: number = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const linearBlue: number = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

  return {
    red: convertLinearChannelToSrgb(linearRed),
    green: convertLinearChannelToSrgb(linearGreen),
    blue: convertLinearChannelToSrgb(linearBlue),
  };
};

const convertLinearChannelToSrgb = (channel: number): number => {
  const srgbChannel: number =
    channel <= 0.0031308 ? channel * 12.92 : 1.055 * channel ** (1 / 2.4) - 0.055;

  return Math.min(Math.max(srgbChannel, 0), 1);
};

export const createAccentThemePalette = (accentHex: string): ThemeColorPalette => {
  const accent: AccentColor = parseAccentColor(accentHex);
  const primaryChroma: number = Math.min(accent.chroma, 0.16);
  const lightPrimaryColor: OklchColor = {
    lightness: 0.48,
    chroma: primaryChroma,
    hue: accent.hue,
  };
  const darkPrimaryColor: OklchColor = {
    lightness: 0.76,
    chroma: primaryChroma,
    hue: accent.hue,
  };
  const lightPrimary: string = toOklch(
    lightPrimaryColor.lightness,
    lightPrimaryColor.chroma,
    lightPrimaryColor.hue,
  );
  const darkPrimary: string = toOklch(
    darkPrimaryColor.lightness,
    darkPrimaryColor.chroma,
    darkPrimaryColor.hue,
  );
  const lightPrimaryForeground: string = getAccessibleForeground(
    convertOklchToRgb(lightPrimaryColor),
  );
  const darkPrimaryForeground: string = getAccessibleForeground(
    convertOklchToRgb(darkPrimaryColor),
  );
  const light: ThemeColorMap = {
    '--background': getTintedNeutral(accent, 0.985, 0.08),
    '--foreground': getTintedNeutral(accent, 0.205, 0.25),
    '--card': getTintedNeutral(accent, 1, 0.04),
    '--card-foreground': getTintedNeutral(accent, 0.205, 0.25),
    '--popover': getTintedNeutral(accent, 1, 0.04),
    '--popover-foreground': getTintedNeutral(accent, 0.205, 0.25),
    '--primary': lightPrimary,
    '--primary-foreground': lightPrimaryForeground,
    '--secondary': getTintedNeutral(accent, 0.97, 0.12),
    '--secondary-foreground': getTintedNeutral(accent, 0.205, 0.25),
    '--muted': getTintedNeutral(accent, 0.97, 0.08),
    '--muted-foreground': getTintedNeutral(accent, 0.5, 0.15),
    '--accent': getTintedNeutral(accent, 0.94, 0.18),
    '--accent-foreground': getTintedNeutral(accent, 0.205, 0.25),
    '--destructive': 'oklch(0.577 0.245 27.325)',
    '--border': getTintedNeutral(accent, 0.922, 0.12),
    '--input': getTintedNeutral(accent, 0.922, 0.12),
    '--ring': lightPrimary,
    '--sidebar': getTintedNeutral(accent, 0.985, 0.08),
    '--sidebar-foreground': getTintedNeutral(accent, 0.145, 0.25),
    '--sidebar-primary': lightPrimary,
    '--sidebar-primary-foreground': lightPrimaryForeground,
    '--sidebar-accent': getTintedNeutral(accent, 0.97, 0.12),
    '--sidebar-accent-foreground': getTintedNeutral(accent, 0.205, 0.25),
    '--sidebar-border': getTintedNeutral(accent, 0.922, 0.12),
    '--sidebar-ring': lightPrimary,
  };

  const dark: ThemeColorMap = {
    '--background': getTintedNeutral(accent, 0.145, 0.08),
    '--foreground': getTintedNeutral(accent, 0.985, 0.12),
    '--card': getTintedNeutral(accent, 0.205, 0.08),
    '--card-foreground': getTintedNeutral(accent, 0.985, 0.12),
    '--popover': getTintedNeutral(accent, 0.205, 0.08),
    '--popover-foreground': getTintedNeutral(accent, 0.985, 0.12),
    '--primary': darkPrimary,
    '--primary-foreground': darkPrimaryForeground,
    '--secondary': getTintedNeutral(accent, 0.269, 0.12),
    '--secondary-foreground': getTintedNeutral(accent, 0.985, 0.12),
    '--muted': getTintedNeutral(accent, 0.269, 0.08),
    '--muted-foreground': getTintedNeutral(accent, 0.708, 0.15),
    '--accent': getTintedNeutral(accent, 0.269, 0.18),
    '--accent-foreground': getTintedNeutral(accent, 0.985, 0.12),
    '--destructive': 'oklch(0.704 0.191 22.216)',
    '--border': 'oklch(1 0 0 / 10%)',
    '--input': 'oklch(1 0 0 / 15%)',
    '--ring': darkPrimary,
    '--sidebar': getTintedNeutral(accent, 0.205, 0.08),
    '--sidebar-foreground': getTintedNeutral(accent, 0.985, 0.12),
    '--sidebar-primary': darkPrimary,
    '--sidebar-primary-foreground': darkPrimaryForeground,
    '--sidebar-accent': getTintedNeutral(accent, 0.269, 0.12),
    '--sidebar-accent-foreground': getTintedNeutral(accent, 0.985, 0.12),
    '--sidebar-border': 'oklch(1 0 0 / 10%)',
    '--sidebar-ring': darkPrimary,
  };

  return { light, dark };
};
