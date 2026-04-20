/**
 * Radio Card Theme Configuration
 * 
 * This file defines the theme overrides for the custom RadioCard component.
 * The RadioCard is a custom component (not a built-in MUI component),
 * so this file is mainly for documentation and potential future integration
 * with MUI's theming system via custom component registration.
 * 
 * Typography:
 * - Label (heading): body2Bold variant, left-aligned
 * - Description (subheading): overline variant, left-aligned, no text transformation
 * - Icon: Aligned with the heading text baseline
 * 
 * Color System (All colors sourced from theme):
 * - Default state: 
 *   - Background: yieldzNeutral[950] (#080808)
 *   - Corner brackets: yieldzNeutral[400]
 *   - Icons: original color (no filter)
 * - Hover state:
 *   - Background: yieldzPrimary[500] with ~3% opacity (#6DF2FE08)
 *   - Corner brackets: yieldzPrimary[500] (#6DF2FE)
 *   - Icons: yieldzPrimary[500] (#6DF2FE via CSS filter)
 * - Selected state:
 *   - Background: yieldzPrimary[500] with ~5% opacity (#6DF2FE0D)
 *   - Corner brackets: yieldzPrimary[500] (#6DF2FE)
 *   - Icons: yieldzPrimary[500] (#6DF2FE via CSS filter)
 * - Selected + Hover state:
 *   - Background: yieldzPrimary[500] with ~8% opacity (#6DF2FE14)
 *   - Corner brackets: yieldzPrimary[500] (#6DF2FE)
 *   - Icons: yieldzPrimary[500] (#6DF2FE via CSS filter)
 * - Focus state:
 *   - Corner brackets: yieldzPrimary[500] (#6DF2FE)
 *   - Icons: yieldzPrimary[500] (#6DF2FE via CSS filter)
 *   - Outline: yieldzSecondary.blue.focus (#6388F7)
 * - Disabled state:
 *   - Background: yieldzNeutral[950] (#080808)
 *   - Corner brackets: yieldzNeutral[600]
 *   - Icons: grayscale filter with opacity
 *   - Opacity: 0.5
 */

export const RadioCardTheme = {
  styleOverrides: {
    root: {
      position: 'relative',
      transition: 'all 0.25s ease',
    },
    default: {
      backgroundColor: 'var(--mui-palette-neutral-950)', // #080808
      cornerBrackets: 'var(--mui-palette-neutral-400)',
      icon: 'original-color',
    },
    hovered: {
      backgroundColor: 'rgba(109, 242, 254, 0.03)', // #6DF2FE with 3% opacity
      cornerBrackets: 'var(--mui-palette-primary-500)', // #6DF2FE
      icon: 'var(--mui-palette-primary-500)', // #6DF2FE (applied via CSS filter)
    },
    selected: {
      backgroundColor: 'rgba(109, 242, 254, 0.05)', // #6DF2FE with 5% opacity
      cornerBrackets: 'var(--mui-palette-primary-500)', // #6DF2FE
      icon: 'var(--mui-palette-primary-500)', // #6DF2FE (applied via CSS filter)
    },
    selectedAndHovered: {
      backgroundColor: 'rgba(109, 242, 254, 0.08)', // #6DF2FE with 8% opacity
      cornerBrackets: 'var(--mui-palette-primary-500)', // #6DF2FE
      icon: 'var(--mui-palette-primary-500)', // #6DF2FE (applied via CSS filter)
    },
    focused: {
      cornerBrackets: 'var(--mui-palette-primary-500)', // #6DF2FE
      icon: 'var(--mui-palette-primary-500)', // #6DF2FE (applied via CSS filter)
      outline: '2px solid var(--mui-palette-secondary-blue-focus)', // #6388F7
    },
    disabled: {
      backgroundColor: 'var(--mui-palette-neutral-950)', // #080808
      opacity: 0.5,
      cursor: 'not-allowed',
      cornerBrackets: 'var(--mui-palette-neutral-600)',
      icon: 'grayscale',
    },
  },
};

export default RadioCardTheme;

