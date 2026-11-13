export type StaticTexts = {
  [key: string]: StaticTexts | string | string[] | ((...args: string[]) => string);
};
