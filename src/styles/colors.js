import { darken, lighten, rgba } from 'polished'

const themeColors = {
  primary: '#0573db',
  base: '#ECEFF3',
  danger: '#DD0000',
  darkGray: '#333333',
  gray: '#9B9B9B',
  lightGray: '#D9D9D9',
  white: '#FFFFFF',
  black: '#000000',
  text: '#191919',
  lightText: '#F0F0F0'
};

const colorVariations = {
  lighter: 0.05,
  lightest: 0.1,
  darker: 0.1,
  darkest: 0.2,
  overlay: 0.45,
}

export const colors = {
  ...makeVariations('primary', themeColors.primary, true),
  ...makeVariations('base', themeColors.base),
  ...makeVariations('danger', themeColors.danger, true),
  ...makeVariations('darkGray', themeColors.darkGray),
  ...makeVariations('gray', themeColors.gray),
  ...makeVariations('lightGray', themeColors.lightGray),
  black: themeColors.black,
  white: themeColors.white,
  text: themeColors.text,
  lightText: themeColors.lightText,
  shadow: rgba(themeColors.black, 0.12)
};

function makeVariations(name, color, overlay = false) {
  const variations = {};
  variations[name] = color;
  variations[`${name}Lighter`] = lighten(colorVariations.lighter, color);
  variations[`${name}Lightest`] = lighten(colorVariations.lightest, color);
  variations[`${name}Darker`] = darken(colorVariations.darker, color);
  variations[`${name}Darkest`] = darken(colorVariations.darkest, color);
  if (overlay) {
    variations[`${name}Overlay`] = lighten(colorVariations.overlay, color);
  }
  return variations;
}
