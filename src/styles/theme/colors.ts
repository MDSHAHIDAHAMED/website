import type { PaletteRange } from '@mui/material/styles/createPalette';

export const chateauGreen = {
  50: '#edfcf2',
  100: '#d2f9de',
  200: '#aaf0c4',
  300: '#72e3a3',
  400: '#3acd7e',
  500: '#16b364',
  600: '#0a9150',
  700: '#087442',
  800: '#095c37',
  900: '#094b2f',
  950: '#032b1a',
} satisfies PaletteRange;

export const neonBlue = {
  50: '#ecf0ff',
  100: '#dde3ff',
  200: '#c2cbff',
  300: '#9ca7ff',
  400: '#7578ff',
  500: '#635bff',
  600: '#4e36f5',
  700: '#432ad8',
  800: '#3725ae',
  900: '#302689',
  950: '#1e1650',
} satisfies PaletteRange;

export const nevada = {
  50: '#fbfcfe',
  100: '#f0f4f8',
  200: '#dde7ee',
  300: '#cdd7e1',
  400: '#9fa6ad',
  500: '#636b74',
  600: '#555e68',
  700: '#32383e',
  800: '#202427',
  900: '#121517',
  950: '#090a0b',
} satisfies PaletteRange;

export const royalBlue = {
  50: '#ecf3ff',
  100: '#dce8ff',
  200: '#c0d4ff',
  300: '#9bb6ff',
  400: '#738dff',
  500: '#5265ff',
  600: '#3339f8',
  700: '#3739de',
  800: '#2225b1',
  900: '#24298b',
  950: '#151651',
} satisfies PaletteRange;

export const shakespeare = {
  50: '#ecfdff',
  100: '#cff7fe',
  200: '#a4eefd',
  300: '#66e0fa',
  400: '#10bee8',
  500: '#04aad6',
  600: '#0787b3',
  700: '#0d6d91',
  800: '#145876',
  900: '#154964',
  950: '#082f44',
} satisfies PaletteRange;

export const tomatoOrange = {
  50: '#fff3ed',
  100: '#ffe2d4',
  200: '#ffc1a8',
  300: '#ffa280',
  400: '#ff9771',
  500: '#ff6c47',
  600: '#fe4011',
  700: '#ed3507',
  800: '#9f2c0f',
  900: '#7e1110',
  950: '#440608',
} satisfies PaletteRange;
// YLDZ Neutral Color Palette
export const yieldzNeutral = {
  25: '#F8F8F8',
  50: '#E9E9E9',
  100: '#D9D9D9',
  200: '#C6C6C6',
  300: '#A7A7A7',
  400: '#898989',
  500: '#595959',
  600: '#424242',
  700: '#343434',
  800: '#222222',
  900: '#111111',
  950: '#080808',
} satisfies PaletteRange;

// YLDZ Base Colors
export const yieldzBase = {
  black: '#000000',
  white: '#FFFFFF',
} as const;

// YLDZ Primary Color Palette (Cyan/Blue)
export const yieldzPrimary = {
  50: '#F0FEFF',
  100: '#E2FCFF',
  200: '#C5FAFF',
  300: '#A7F7FE',
  400: '#8AF5FE',
  500: '#6DF2FE',
  600: '#4199A1',
  700: '#21565B',
  800: '#164044',
  900: '#0B292C',
  950: 'rgb(109 242 254 / 10%)',
} satisfies PaletteRange;

// YLDZ Secondary Colors
export const yieldzSecondary = {
  red: {
    100: 'rgb(255 91 35 / 80%)',
    500: '#FF5B23',
  },
  green: {
    100: 'rgb(119 255 35 / 50%)',
    500: '#77FF23',
  },
  yellow: {
    100: 'rgb(255 247 25 / 80%)',
    500: '#FFF719',
  },
  orange: {
    100: 'rgb(247 147 26 / 80%)',
    500: '#F7931A',
  },
  blue: {
    focus: '#6388F7',
  },
};

// Legacy customGrey for backward compatibility
export const customGrey = {
  50: '#FAFAFA',   // almost white
  100: '#F7F7F7',  // very light grey
  200: '#F4F4F4',  // ultra subtle grey
  300: '#F6F6F6',  // very very light (your request)
  400: '#F0F0F0',  // base neutral mid-tone
  500: '#C8C8C8',  // darker grey (for text, borders)
  600: '#D9D9D9',  // medium dark
  700: '#616161',  // darker, for disabled states
  800: '#424242',  // dark grey background
  900: '#212121',  // deepest grey (almost black)
  950: '#141414',  // extra-deep tone (for dark mode)
} satisfies PaletteRange;

// YLDZ Gradient Colors
// Used for card backgrounds and decorative elements
export const yieldzGradient = {
  darkGrey1: '#171717',  // Dark grey for gradient start
  darkGrey2: '#222222',  // Medium dark grey for gradient middle (same as yieldzNeutral[800])
  black: '#000000',      // Pure black for gradient end (same as yieldzBase.black)

  // Pre-configured gradient strings for common use cases
  cardBackground: 'linear-gradient(135deg, #171717 0%, #000000 50%, #222222 100%)',
  cardRadial: 'radial-gradient(circle at top left, rgba(23, 23, 23, 0.4) 0%, transparent 60%)',

  // With opacity variations for layering
  overlay: {
    light: 'linear-gradient(135deg, rgba(23, 23, 23, 0.12) 0%, rgba(0, 0, 0, 0.05) 50%, rgba(34, 34, 34, 0.08) 100%)',
    medium: 'linear-gradient(135deg, rgba(23, 23, 23, 0.25) 0%, rgba(0, 0, 0, 0.15) 50%, rgba(34, 34, 34, 0.2) 100%)',
    strong: 'linear-gradient(135deg, rgba(23, 23, 23, 0.5) 0%, rgba(0, 0, 0, 0.3) 50%, rgba(34, 34, 34, 0.4) 100%)',
  },
} as const;