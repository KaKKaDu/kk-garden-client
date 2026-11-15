import { createAccentThemePalette } from './theme.utils';
import { handleError } from '@kk-garden/shared/errors';
import {
  themeSvgColorNames,
  type ThemeApplyResult,
  type ThemeColorMap,
  type ThemePaletteResult,
  type ThemeSvgColorMap,
} from './theme.types';

export class ThemeService {
  private static readonly themeStyleElementId: string = 'kk-garden-accent-theme';

  public setAccentColor(accentHex: string): ThemeApplyResult {
    try {
      const paletteResult: ThemePaletteResult = createAccentThemePalette(accentHex);

      if (!paletteResult.success) {
        throw new Error(paletteResult.errors[0]?.message ?? 'Accent palette generation failed.');
      }

      if (paletteResult.data === undefined) {
        throw new Error('Accent palette generation returned no data.');
      }

      const styleElement: HTMLStyleElement = this.getThemeStyleElement();
      const svgColors: ThemeSvgColorMap = this.getSvgThemeColors(paletteResult.data.light);
      styleElement.textContent = [
        this.formatThemeRule(':root', paletteResult.data.light),
        this.formatThemeRule('.dark', paletteResult.data.dark),
      ].join('\n\n');
      this.syncLoadedSvgAccents(svgColors);

      return { success: true, data: { applied: true } };
    } catch (error: unknown) {
      return handleError(error);
    }
  }

  public syncSvgAccent(element: HTMLIFrameElement): ThemeApplyResult {
    try {
      if (typeof document === 'undefined') {
        throw new Error('Accent themes can only be applied in a browser environment.');
      }

      const embeddedDocument: Document | null = element.contentDocument;
      if (embeddedDocument === null) {
        throw new Error('The embedded accent SVG document is not available.');
      }

      const svgColors: ThemeSvgColorMap = this.getSvgThemeColorsFromDocument();
      this.styleEmbeddedSvg(embeddedDocument, svgColors);
      return { success: true, data: { applied: true } };
    } catch (error: unknown) {
      return handleError(error);
    }
  }

  private formatThemeRule(selector: ':root' | '.dark', colors: ThemeColorMap): string {
    const declarations: string = Object.entries(colors)
      .map(([property, value]: [string, string]): string => `  ${property}: ${value};`)
      .join('\n');

    return `${selector} {\n${declarations}\n}`;
  }

  private getSvgThemeColors(colors: ThemeColorMap): ThemeSvgColorMap {
    return {
      '--svg-base': colors['--svg-base'],
      '--svg-deep': colors['--svg-deep'],
      '--svg-dark': colors['--svg-dark'],
      '--svg-light': colors['--svg-light'],
      '--svg-pale': colors['--svg-pale'],
    };
  }

  private getSvgThemeColorsFromDocument(): ThemeSvgColorMap {
    const rootStyles: CSSStyleDeclaration = getComputedStyle(document.documentElement);
    const colors: ThemeSvgColorMap = {
      '--svg-base': rootStyles.getPropertyValue('--svg-base').trim(),
      '--svg-deep': rootStyles.getPropertyValue('--svg-deep').trim(),
      '--svg-dark': rootStyles.getPropertyValue('--svg-dark').trim(),
      '--svg-light': rootStyles.getPropertyValue('--svg-light').trim(),
      '--svg-pale': rootStyles.getPropertyValue('--svg-pale').trim(),
    };

    themeSvgColorNames.forEach((property: keyof ThemeSvgColorMap): void => {
      if (colors[property] === '') {
        throw new Error(`The current SVG color "${property}" is not available.`);
      }
    });

    return colors;
  }

  private getThemeStyleElement(): HTMLStyleElement {
    if (typeof document === 'undefined') {
      throw new Error('Accent themes can only be applied in a browser environment.');
    }

    const existingElement: HTMLElement | null = document.getElementById(
      ThemeService.themeStyleElementId,
    );

    if (existingElement !== null) {
      if (!(existingElement instanceof HTMLStyleElement)) {
        throw new Error(
          `The "${ThemeService.themeStyleElementId}" element must be a style element.`,
        );
      }

      return existingElement;
    }

    const styleElement: HTMLStyleElement = document.createElement('style');
    styleElement.id = ThemeService.themeStyleElementId;
    document.head.append(styleElement);

    return styleElement;
  }

  private syncLoadedSvgAccents(colors: ThemeSvgColorMap): void {
    const svgElements: NodeListOf<HTMLIFrameElement> =
      document.querySelectorAll('iframe[data-accent-svg]');

    svgElements.forEach((element: HTMLIFrameElement): void => {
      const embeddedDocument: Document | null = element.contentDocument;
      if (embeddedDocument !== null) {
        this.styleEmbeddedSvg(embeddedDocument, colors);
      }
    });
  }

  private styleEmbeddedSvg(embeddedDocument: Document, colors: ThemeSvgColorMap): void {
    const svgRoot: HTMLElement = embeddedDocument.documentElement;
    if (svgRoot.localName !== 'svg') {
      throw new Error('The embedded menu icon is not an SVG document.');
    }

    themeSvgColorNames.forEach((property: keyof ThemeSvgColorMap): void => {
      svgRoot.style.setProperty(property, colors[property]);
    });
    svgRoot.style.setProperty('display', 'block');
    svgRoot.style.setProperty('width', '100%');
    svgRoot.style.setProperty('height', '100%');
    svgRoot.style.setProperty('overflow', 'hidden');
  }
}
