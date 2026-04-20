// src/styles/theme/typography.ts
import { TypographyVariantsOptions } from '@mui/material';
import { CSSProperties } from 'react';

import { DEFAULT_FONT_FAMILY } from './fonts';

interface ExtendedTypographyVariantsOptions extends TypographyVariantsOptions {
  display1?: CSSProperties;
  display2?: CSSProperties;
  display3?: CSSProperties;
  body2Bold?: CSSProperties;
  body3?: CSSProperties;
  body4?: CSSProperties;
  body5?: CSSProperties;
  body6?: CSSProperties;
  button1?: CSSProperties;
  button2?: CSSProperties;
  button3?: CSSProperties;
  label1?: CSSProperties;
  label2?: CSSProperties;
  label3?: CSSProperties;
  subtitle3?: CSSProperties;
  subtitle4?: CSSProperties;
  caption2?: CSSProperties;
}

export const typography = {
  fontFamily: DEFAULT_FONT_FAMILY,

  // Display Variants
  display1: {
    fontWeight: 700,
    fontSize: '38px', // Mobile
    lineHeight: '38px',
    textTransform: 'uppercase',
    '@media (min-width:600px)': {
      fontSize: '110px', // Desktop
      lineHeight: '110px',
    },
  },
  display2: {
    fontWeight: 615,
    fontSize: '50px', // Mobile
    lineHeight: '70px',
    textTransform: 'uppercase',
    '@media (min-width:600px)': {
      fontSize: '78px', // Desktop
      lineHeight: '90px',
    },
  },
  display3: {
    fontWeight: 400,
    fontSize: '30px', // Mobile
    lineHeight: '30px',
    '@media (min-width:600px)': {
      fontSize: '36px', // Desktop
      lineHeight: '36px',
    },
  },
  display4: {
    fontWeight: 400,
    fontSize: '50px', // Mobile
    lineHeight: '50px',
    '@media (min-width:600px)': {
      fontSize: '94px', // Desktop
      lineHeight: '80px',
    },
  },
  display5: {
    fontWeight: 400,
    fontSize: '50px', // Mobile
    lineHeight: '50px',
    '@media (min-width:600px)': {
      fontSize: '72px', // Desktop
      lineHeight: '72px',
    },
  },

  // Headings
  h1: {
    fontWeight: 700,
    fontSize: '42px', // Mobile
    lineHeight: '48px',
    '@media (min-width:600px)': {
      fontSize: '56px', // Desktop
      lineHeight: '64px',
    },
  },
  h2: {
    fontWeight: 615,
    fontSize: '32px', // Mobile
    lineHeight: '40px',
    '@media (min-width:600px)': {
      fontSize: '42px', // Desktop
      lineHeight: '48px',
    },
  },
  h3: {
    fontWeight: 615,
    fontSize: '24px', // Mobile
    lineHeight: '28px',
    '@media (min-width:600px)': {
      fontSize: '32px', // Desktop
      lineHeight: '40px',
    },
  },
  h4: {
    fontWeight: 615,
    fontSize: '20px', // Mobile
    lineHeight: '24px',
    '@media (min-width:600px)': {
      fontSize: '24px', // Desktop
      lineHeight: '28px',
    },
  },
  h5: {
    fontWeight: 615,
    fontSize: '18px', // Mobile
    lineHeight: '20px',
    '@media (min-width:600px)': {
      fontSize: '20px', // Desktop
      lineHeight: '24px',
    },
  },
  h6: {
    fontWeight: 615,
    fontSize: '16px', // Mobile
    lineHeight: '20px',
    '@media (min-width:600px)': {
      fontSize: '18px', // Desktop
      lineHeight: '24px',
    },
  },

  // Body Text
  body1: {
    fontWeight: 400,
    fontSize: '20px', // Mobile
    lineHeight: '30px',
    '@media (min-width:600px)': {
      fontSize: '24px', // Desktop
      lineHeight: '36px',
    },
  },
  body2: {
    fontWeight: 400,
    fontSize: '18px', // Mobile
    lineHeight: '28px',
    '@media (min-width:600px)': {
      fontSize: '20px', // Desktop
      lineHeight: '30px',
    },
  },
  body2Bold: {
    fontWeight: 615,
    fontSize: '18px', // Mobile
    lineHeight: '28px',
    '@media (min-width:600px)': {
      fontSize: '20px', // Desktop
      lineHeight: '30px',
    },
  },
  body3: {
    fontWeight: 400,
    fontSize: '16px', // Mobile
    lineHeight: '24px',
    '@media (min-width:600px)': {
      fontSize: '18px', // Desktop
      lineHeight: '28px',
    },
  },
  body4: {
    fontWeight: 500,
    fontSize: '14px', // Mobile
    lineHeight: '20px',
    '@media (min-width:600px)': {
      fontSize: '16px', // Desktop
      lineHeight: '24px',
    },
  },
  body5: {
    fontWeight: 600,
    fontSize: '20px', // Mobile
    lineHeight: '20px',
    '@media (min-width:600px)': {
      fontSize: '24px', // Desktop
      lineHeight: '24px',
    },
  },
  body6: {
    fontWeight: 600,
    fontSize: '36px', // Mobile
    lineHeight: '36px',
    '@media (min-width:600px)': {
      fontSize: '36px', // Desktop
      lineHeight: '36px',
    },
  },

  // Button Text
  button1: {
    fontWeight: 700,
    fontSize: '16px', // Both Mobile and Desktop
    lineHeight: '16px',
    textTransform: 'uppercase',
  },
  button2: {
    fontWeight: 700,
    fontSize: '14px', // Both Mobile and Desktop
    lineHeight: '14px',
    textTransform: 'uppercase',
  },
  button3: {
    fontWeight: 400,
    fontSize: '12px', // Both Mobile and Desktop
    lineHeight: '12px',
    textTransform: 'uppercase',
  },

  // Label Text
  label1: {
    fontWeight: 400,
    fontSize: '14px', // Both Mobile and Desktop
    lineHeight: '16px',
  },
  label2: {
    fontWeight: 500,
    fontSize: '10px', // Both Mobile and Desktop
    lineHeight: '10px',
    textTransform: 'uppercase',
  },
  label3: {
    fontWeight: 615,
    fontSize: '10px', // Both Mobile and Desktop
    lineHeight: '10px',
    textTransform: 'uppercase',
  },

  // Legacy MUI variants for backward compatibility
  button: {
    fontWeight: 700,
    fontSize: '16px',
    lineHeight: '16px',
    textTransform: 'uppercase',
  },
  caption: {
    fontSize: '12px',
    fontWeight: 400,
    lineHeight: '16px',
  },
  caption2: {
    fontSize: '12px',
    fontWeight: 615,
    lineHeight: '12px',
  },
  subtitle1: {
    fontSize: '16px',
    fontWeight: 400,
    lineHeight: '24px',
  },
  subtitle2: {
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '20px',
  },
  subtitle3: {
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: '20px',
  },
  subtitle4: {
    fontSize: '14px',
    fontWeight: 615,
    lineHeight: '20px',
  },

  overline: {
    fontSize: '12px',
    fontWeight: 500,
    letterSpacing: '0.5px',
    lineHeight: '16px',
  },
} as ExtendedTypographyVariantsOptions;
