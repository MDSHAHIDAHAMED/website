import { buttonClasses } from '@mui/material/Button';
import type { Components } from '@mui/material/styles';

import { yieldzBase, yieldzNeutral, yieldzPrimary } from '../colors';
import type { Theme } from '../types';

function getContainedVars(color: string): Record<string, string> {
  return {
    '--Button-containedBg': `var(--mui-palette-${color}-dark)`,
    '--Button-containedBgGradient': `linear-gradient(180deg, var(--mui-palette-${color}-main) 0%, var(--mui-palette-${color}-dark) 100%)`,
    '--Button-containedStroke': `inset 0px 0px 0px 1px var(--mui-palette-${color}-dark), inset 0px 2px 0px 0px rgba(255, 255, 255, 0.16)`,
  };
}

function getOutlinedVars(color: string, dark: boolean): Record<string, string> {
  const vars = {
    '--Button-outlinedBorder': `var(--mui-palette-${color}-main)`,
    '--Button-outlinedHoverBg': `var(--mui-palette-${color}-hovered)`,
    '--Button-outlinedActiveBg': `var(--mui-palette-${color}-activated)`,
  };

  // Custom case for secondary
  if (color === 'secondary') {
    if (dark) {
      vars['--Button-outlinedBorder'] = 'var(--mui-palette-secondary-700)';
    } else {
      vars['--Button-outlinedBorder'] = 'var(--mui-palette-secondary-200)';
    }
  }

  return vars;
}

function getTextVars(color: string): Record<string, string> {
  return {
    '--Button-textHoverBg': `var(--mui-palette-${color}-hovered)`,
    '--Button-textActiveBg': `var(--mui-palette-${color}-activated)`,
  };
}

export const MuiButton = {
  defaultProps: { disableRipple: true },
  styleOverrides: {
    root: {
      borderRadius: '0px',
      minHeight: 'var(--Button-minHeight)',
      minWidth: 'unset',
      textTransform: 'none',
      fontWeight: 500,
      position: 'relative',
      // Provide a bit of breathing room so the bracket decorations don't overlap the content
      paddingLeft: '32px',
      paddingRight: '32px',
      '&:focus-visible': { outline: 'none' },
    },
    text: {
      '&:hover': { backgroundColor: 'var(--Button-textHoverBg)' },
      '&:active': { backgroundColor: 'var(--Button-textActiveBg)' },
    },
    textPrimary: getTextVars('primary'),
    textSecondary: getTextVars('secondary'),
    textSuccess: getTextVars('success'),
    textInfo: getTextVars('info'),
    textWarning: getTextVars('warning'),
    textError: getTextVars('error'),
    outlined: {
      boxShadow: 'var(--mui-shadows-1)',
      borderColor: 'var(--Button-outlinedBorder)',
      '&:hover': { borderColor: 'var(--Button-outlinedBorder)', backgroundColor: 'var(--Button-outlinedHoverBg)' },
      '&:active': { backgroundColor: 'var(--Button-outlinedActiveBg)' },
    },
    outlinedPrimary: {
      borderColor: 'var(--mui-palette-common-black)',
      backgroundColor: 'var(--mui-palette-common-white)',
      color: 'var(--mui-palette-common-black)',
      '&:hover': {
        borderColor: 'var(--mui-palette-common-black)',
        backgroundColor: 'var(--mui-palette-neutral-50)',
        color: 'var(--mui-palette-common-black)',
      },
      '&:active': {
        borderColor: 'var(--mui-palette-common-black)',
        backgroundColor: 'var(--mui-palette-neutral-100)',
        color: 'var(--mui-palette-common-black)',
      },
    },
    outlinedSecondary: ({ theme }) => {
      return getOutlinedVars('secondary', theme.palette.mode === 'dark');
    },
    outlinedSuccess: ({ theme }) => {
      return getOutlinedVars('success', theme.palette.mode === 'dark');
    },
    outlinedInfo: ({ theme }) => {
      return getOutlinedVars('info', theme.palette.mode === 'dark');
    },
    outlinedWarning: ({ theme }) => {
      return getOutlinedVars('warning', theme.palette.mode === 'dark');
    },
    outlinedError: ({ theme }) => {
      return getOutlinedVars('error', theme.palette.mode === 'dark');
    },
    contained: {
      backgroundColor: 'var(--Button-containedBg)',
      backgroundImage: 'var(--Button-containedBgGradient)',
      boxShadow: 'var(--mui-shadows-1), var(--Button-containedStroke)',
      overflow: 'hidden',
      '&:hover': {
        boxShadow:
          'var(--mui-shadows-8), var(--Button-containedStroke), inset 0px 6px 10px 0px rgba(255, 255, 255, 0.10)',
      },
      '&:active': { backgroundImage: 'var(--Button-containedBg)' },
      '&:focus-visible': { boxShadow: 'var(--mui-shadows-8)', outlineOffset: '1px' },
      [`&.${buttonClasses.disabled}`]: { backgroundImage: 'none', '&::before': { boxShadow: 'none' } },
    },

    containedPrimary: {
      ...getContainedVars('primary'),
      backgroundColor: yieldzPrimary[950], // #001315
      backgroundImage: 'none',
      boxShadow: 'none',
      backdropFilter: 'blur(6px)',
      color: yieldzPrimary[500], // #6DF2FE
      fontWeight: 500,
      letterSpacing: '0.5px',
      position: 'relative',
      overflow: 'visible',
      transition: 'all 0.25s ease-in-out',

      // Corner bracket decorations
      '&::before, &::after': {
        content: '""',
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        height: '100%',
        width: '15px',
        borderStyle: 'solid',
        borderColor: yieldzPrimary[500], // #6DF2FE
        borderRadius: '0px',
        pointerEvents: 'none',
        transition: 'border-color .25s ease, width .25s ease',
      },

      '&::before': {
        left: '0',
        borderWidth: '2px 0 2px 3px',
      },

      '&::after': {
        right: '0',
        borderWidth: '2px 3px 2px 0',
      },

      // Hover state – lighter text and border colors
      '&:hover': {
        backgroundColor: yieldzPrimary[900], // #0B292C
        color: yieldzPrimary[400], // #8AF5FE - lighter variant
        boxShadow: 'none',
      },

      '&:hover::before, &:hover::after': {
        borderColor: yieldzPrimary[400], // #8AF5FE - lighter variant
      },

      // Focused state – outer border
      '&:focus-visible': {
        backgroundColor: yieldzPrimary[900], // #0B292C
        color: yieldzPrimary[400], // #8AF5FE - lighter variant
        boxShadow: `0 0 0 4px ${yieldzPrimary[400]}66`, // #8AF5FE with 40% opacity
      },

      '&:focus-visible::before, &:focus-visible::after': {
        borderColor: yieldzPrimary[400], // #8AF5FE - lighter variant
      },

      // Active (pressed) state – slightly darker
      '&:active': {
        backgroundColor: yieldzPrimary[800], // #164044
        boxShadow: `0 0 0 4px ${yieldzPrimary[400]}66`, // #8AF5FE with 40% opacity
      },

      // Disabled state – muted
      [`&.${buttonClasses.disabled}`]: {
        backgroundColor: yieldzNeutral[800], // #222222
        color: yieldzNeutral[400], // #898989
        boxShadow: 'none',
        '&::before, &::after': { borderColor: yieldzNeutral[400] }, // #424242
        fontWeight: 600,
      },
    },

    // Variant 1: White bracket button (white borders, white text, black background)
    containedSecondary: {
      ...getContainedVars('secondary'),
      backgroundColor: yieldzBase.black, // #000000
      backgroundImage: 'none',
      boxShadow: 'none',
      color: yieldzBase.white, // #FFFFFF
      fontWeight: 500,
      letterSpacing: '0.5px',
      position: 'relative',
      overflow: 'visible',
      transition: 'all 0.25s ease-in-out',

      // Corner bracket decorations
      '&::before, &::after': {
        content: '""',
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        height: '100%',
        width: '15px',
        borderStyle: 'solid',
        borderColor: yieldzBase.white, // #FFFFFF
        borderRadius: '0px',
        pointerEvents: 'none',
        transition: 'border-color .25s ease, width .25s ease',
      },

      '&::before': {
        left: '0',
        borderWidth: '2px 0 2px 3px',
      },

      '&::after': {
        right: '0',
        borderWidth: '2px 3px 2px 0',
      },

      // Hover state
      '&:hover': {
        backgroundColor: yieldzBase.black,
        color: yieldzBase.white,
        boxShadow: 'none',
      },

      '&:hover::before, &:hover::after': {
        borderColor: yieldzBase.white,
      },

      // Focused state – outer border
      '&:focus-visible': {
        backgroundColor: yieldzBase.black,
        color: yieldzBase.white,
        boxShadow: `0 0 0 4px ${yieldzBase.white}66`, // white with 40% opacity
      },

      '&:focus-visible::before, &:focus-visible::after': {
        borderColor: yieldzBase.white,
      },

      // Active state
      '&:active': {
        backgroundColor: yieldzNeutral[900], // #111111
        boxShadow: `0 0 0 4px ${yieldzBase.white}66`,
      },

      // Disabled state
      [`&.${buttonClasses.disabled}`]: {
        backgroundColor: yieldzNeutral[900],
        color: yieldzNeutral[500],
        boxShadow: 'none',
        '&::before, &::after': { borderColor: yieldzNeutral[600] },
      },
    },

    // Variant 2: Cyan bracket button (cyan borders, cyan text, transparent → cyan on hover)
    containedSuccess: {
      ...getContainedVars('success'),
      backgroundColor: 'transparent',
      backgroundImage: 'none',
      boxShadow: 'none',
      color: yieldzPrimary[500], // #6DF2FE
      fontWeight: 500,
      letterSpacing: '0.5px',
      position: 'relative',
      overflow: 'visible',
      transition: 'all 0.25s ease-in-out',

      // Corner bracket decorations
      '&::before, &::after': {
        content: '""',
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        height: '100%',
        width: '15px',
        borderStyle: 'solid',
        borderColor: yieldzPrimary[500], // #6DF2FE
        borderRadius: '0px',
        pointerEvents: 'none',
        transition: 'border-color .25s ease, width .25s ease',
      },

      '&::before': {
        left: '0',
        borderWidth: '2px 0 2px 3px',
      },

      '&::after': {
        right: '0',
        borderWidth: '2px 3px 2px 0',
      },

      // Hover state - background becomes cyan
      '&:hover': {
        backgroundColor: yieldzPrimary[900], // #0B292C
        color: yieldzPrimary[400], // #8AF5FE
        boxShadow: 'none',
      },

      '&:hover::before, &:hover::after': {
        borderColor: yieldzPrimary[400],
      },

      // Focused state – outer border
      '&:focus-visible': {
        backgroundColor: yieldzPrimary[900], // #0B292C
        color: yieldzPrimary[400], // #8AF5FE
        boxShadow: `0 0 0 4px ${yieldzPrimary[400]}66`,
      },

      '&:focus-visible::before, &:focus-visible::after': {
        borderColor: yieldzPrimary[400],
      },

      // Active state
      '&:active': {
        backgroundColor: yieldzPrimary[800], // #164044
        boxShadow: `0 0 0 4px ${yieldzPrimary[400]}66`,
      },

      // Disabled state
      [`&.${buttonClasses.disabled}`]: {
        backgroundColor: 'transparent',
        color: yieldzNeutral[500],
        boxShadow: 'none',
        '&::before, &::after': { borderColor: yieldzNeutral[600] },
      },
    },

    // Variant 3: Dark gray button (gray borders, white text, dark gray bg → lighter gray on hover)
    containedInfo: {
      ...getContainedVars('info'),
      backgroundColor: yieldzNeutral[900], // #111111
      backgroundImage: 'none',
      boxShadow: 'none',
      color: yieldzBase.white, // #FFFFFF
      fontWeight: 500,
      letterSpacing: '0.5px',
      position: 'relative',
      overflow: 'visible',
      transition: 'all 0.25s ease-in-out',

      // Corner bracket decorations - light gray
      '&::before, &::after': {
        content: '""',
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        height: '100%',
        width: '15px',
        borderStyle: 'solid',
        borderColor: yieldzNeutral[400], // #898989 - light gray
        borderRadius: '0px',
        pointerEvents: 'none',
        transition: 'border-color .25s ease, width .25s ease, background-color .25s ease',
      },

      '&::before': {
        left: '0',
        borderWidth: '2px 0 2px 3px',
      },

      '&::after': {
        right: '0',
        borderWidth: '2px 3px 2px 0',
      },

      // Hover state - borders become white, background becomes lighter gray
      '&:hover': {
        backgroundColor: yieldzNeutral[700], // #343434
        color: yieldzBase.white,
        boxShadow: 'none',
      },

      '&:hover::before, &:hover::after': {
        borderColor: yieldzBase.white, // #FFFFFF
      },

      // Focused state – outer border
      '&:focus-visible': {
        backgroundColor: yieldzNeutral[700], // #343434
        color: yieldzBase.white,
        boxShadow: `0 0 0 4px ${yieldzBase.white}44`,
      },

      '&:focus-visible::before, &:focus-visible::after': {
        borderColor: yieldzBase.white, // #FFFFFF
      },

      // Active state
      '&:active': {
        backgroundColor: yieldzNeutral[600], // #424242
        boxShadow: `0 0 0 4px ${yieldzBase.white}44`,
      },

      // Disabled state
      [`&.${buttonClasses.disabled}`]: {
        backgroundColor: yieldzNeutral[900],
        color: yieldzNeutral[500],
        boxShadow: 'none',
        '&::before, &::after': { borderColor: yieldzNeutral[700] },
      },
    },

    containedWarning: getContainedVars('warning'),
    containedError: getContainedVars('error'),
    sizeSmall: { '--Button-minHeight': '40px', fontSize: '14px', fontWeight: 400, lineHeight: '20px' },
    sizeMedium: { '--Button-minHeight': '48px', fontSize: '16px', fontWeight: 400, lineHeight: '24px' },
    sizeLarge: { '--Button-minHeight': '56px', fontSize: '18px', fontWeight: 400, lineHeight: '28px' },
  },
  variants: [
    {
      props: { size: 'xs' as any },
      style: {
        '--Button-minHeight': '32px',
        fontSize: '12px',
        fontWeight: 400,
        lineHeight: '16px',
        padding: '6px 12px',
      },
    },
  ],
} satisfies Components<Theme>['MuiButton'];
