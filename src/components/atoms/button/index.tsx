'use client';

import { Button, ButtonBase, CircularProgress, SvgIcon, useTheme, type SxProps, type Theme } from '@mui/material';
import { kebabCase } from 'change-case';
import React, { forwardRef } from 'react';

import { yieldzNeutral, yieldzPrimary, yieldzSecondary } from '@/styles/theme/colors';
import { type TColor, type TSize } from '@/types/common';

/**
 * Available button variants
 * Follows DRY principle - centralized variant options
 */
type TVariant = 'contained' | 'outlined' | 'text' | 'link' | 'transparent';

/**
 * Available icon positions
 * Follows DRY principle - centralized position options
 */
type TPosition = 'end' | 'start';


/**
 * Props interface for the Button component
 * Follows Single Responsibility Principle - handles only button functionality
 * Follows Interface Segregation Principle - focused interface for button props
 */
export interface ButtonProps {
  type?: 'submit' | 'reset' | 'button';
  label: string | React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: TVariant;
  fullWidth?: boolean;
  size?: TSize;
  color?: TColor;
  isLoading?: boolean;
  id: string;
  iconPosition?: TPosition;
  isIconButton?: boolean;
  icon?: React.ReactNode;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  sx?: SxProps<Theme>;
  ref?: React.Ref<HTMLButtonElement>;
  disableFocusRipple?: boolean;
  disableRipple?: boolean;
  disableTouchRipple?: boolean;
}

/**
 * Helper function to get button styles based on variant, color, and disabled state
 * Follows DRY principle - centralizes styling logic
 * Follows Single Responsibility Principle - handles only style calculation
 */
const getButtonStyles = (
  theme: Theme,
  variant: TVariant,
  color: TColor,
  disabled: boolean
): { backgroundColor: string; border: string } => {
  // Initialize with default values based on the disabled state
  let backgroundColor = disabled ? theme.palette.neutral[300] : 'transparent';
  let border = disabled ? `1px solid ${theme.palette.neutral[300]}` : 'none';

  // Modify styles based on the variant if not disabled
  if (!disabled) {
    if (variant === 'contained') {
      backgroundColor = `${color}.main`;
      border = 'none';
    } else if (variant === 'outlined') {
      backgroundColor = 'transparent';
      border = `1px solid var(--mui-palette-primary-main)`;
    }
  }

  return { backgroundColor, border };
};

/**
 * AtomButton Component
 * 
 * A reusable button component with multiple variants and loading states
 * Follows SOLID principles:
 * - Single Responsibility: Handles only button functionality
 * - Open/Closed: Extensible through props without modification
 * - Liskov Substitution: Can be used anywhere a button is needed
 * - Interface Segregation: Clean, focused prop interface
 * - Dependency Inversion: Depends on abstractions (theme, MUI components)
 * 
 * Follows KISS principle: Simple, focused functionality
 * Follows DRY principle: Reusable across the application
 */
function AtomButton(props: Readonly<ButtonProps>, ref: React.Ref<HTMLButtonElement>): React.JSX.Element {
  // Destructure props with sensible defaults
  const {
    type = 'button',
    startIcon,
    endIcon,
    label,
    onClick,
    disabled = false,
    sx,
    variant = 'contained',
    fullWidth,
    isIconButton = false,
    icon,
    size = 'large',
    color = 'primary',
    isLoading,
    id,
    ...rest
  } = props;

  const theme = useTheme();

  // Get the button styles (background color and border)
  const { backgroundColor, border } = getButtonStyles(theme, variant, color, disabled);

  // Get font size based on button size
  const getFontSize = (btnSize: TSize) => {
    switch (btnSize) {
      case 'large': return '18px';
      case 'medium': return '16px';
      case 'small': return '14px';
      case 'xs': return '12px';
      default: return '16px';
    }
  };

  // Helper to get MUI-compatible variant
  const getMuiVariant = (customVariant: TVariant): 'contained' | 'outlined' | 'text' => {
    if (customVariant === 'link') {
      return 'text';
    }
    if (customVariant === 'transparent') {
      return 'contained';
    }
    return customVariant;
  };

  // Link variant custom styles
  const linkStyles: SxProps<Theme> = variant === 'link' ? {
    padding: '4px 8px',
    minHeight: 'unset',
    paddingLeft: '8px',
    paddingRight: '8px',
    textDecoration: 'underline',
    textDecorationStyle: 'dashed',
    textDecorationColor: yieldzPrimary[500], // #6DF2FE
    color: yieldzPrimary[500], // #6DF2FE
    backgroundColor: 'transparent',
    fontWeight: 400,
    fontSize: getFontSize(size),
    transition: 'all 0.2s ease-in-out',
    textUnderlineOffset: '4px',
    border: '2px solid transparent',
    borderRadius: '4px',
    '&:hover': {
      backgroundColor: 'transparent',
      textDecorationStyle: 'solid',
      textDecorationColor: yieldzPrimary[500], // #6DF2FE
      color: yieldzPrimary[400], // #8AF5FE - lighter on hover
    },
    '&:focus-visible': {
      outline: 'none',
      border: `2px solid ${yieldzSecondary.blue.focus}`, // #6388F7
      textDecorationStyle: 'solid',
      textDecorationColor: yieldzPrimary[500], // #6DF2FE
    },
    '&:active': {
      color: yieldzPrimary[600], // #4199A1 - darker on press
      textDecorationColor: yieldzPrimary[600], // #4199A1
      textDecorationStyle: 'solid',
    },
    '&.Mui-disabled': {
      color: yieldzNeutral[500], // #595959
      textDecorationColor: yieldzNeutral[500], // #595959
      textDecorationStyle: 'dashed',
      backgroundColor: 'transparent',
      border: '2px solid transparent',
    },
  } : {};

  // white variant custom styles - same as contained but with white border
  const transparentStyles: SxProps<Theme> = variant === 'transparent' ? {
    backgroundColor: 'rgba(8, 8, 8, 0.4)',
    color: 'white',
    blur: 2,
    '&::before, &::after': {
      borderColor: 'white',
    },
    '&:hover': {
      backgroundColor: 'rgba(18, 18, 18, 1)',
      color: 'white',
      '&::before, &::after': {
        borderColor: 'white',
      },
    },
  } : {};

  // If it's an icon button, render ButtonBase for circular styling
  if (isIconButton) {
    return (
      // Icon Button - circular button with icon
      <ButtonBase
        sx={{
          backgroundColor,
          borderRadius: '50%',
          color: variant === 'contained' ? 'primary.contrastText' : 'primary.main',
          p: '5px',
          border,
        }}
        disabled={disabled}
        data-testid={`qa-${kebabCase(id ?? '')}`}
        id={id}
        onClick={onClick}
        ref={ref}
        {...rest}
      >
        <SvgIcon>{icon}</SvgIcon>
      </ButtonBase>
    );
  }

  // Render the regular button with loading state support
  return (
    <Button
      type={type}
      size={size === 'xs' ? 'small' : size} // MUI doesn't support 'xs', map to 'small'
      variant={getMuiVariant(variant)} // Map custom variants to MUI-compatible variants
      ref={ref}
      fullWidth={fullWidth}
      onClick={onClick}
      color={color ?? 'primary'}
      disabled={disabled}
      startIcon={isLoading ? icon : startIcon}
      endIcon={endIcon}
      disableElevation
      data-testid={`qa-${kebabCase(id ?? '')}`}
      id={id}
      sx={{
        ...(size === 'xs' ? {
          fontSize: '12px',
          fontWeight: 400,
          minHeight: '32px',
          padding: '6px 12px',
          lineHeight: '16px',
        } : {}),
        ...linkStyles,
        ...transparentStyles,
        ...sx
      }}
      {...rest}
    >
      {isLoading ? <CircularProgress color="secondary" size={20} /> : typeof label === 'string' ? label.toUpperCase() : label}
    </Button>
  );
}

/**
 * Export the main AtomButton component
 * Using forwardRef to allow ref forwarding
 */
const AtomButtonComponent = forwardRef(AtomButton);

// Default export
export default AtomButtonComponent;

/**
 * Named export for AtomButton (for consistency)
 * Allows: import { AtomButton } from '@/components/atoms/button';
 */
export { AtomButtonComponent as AtomButton };

/**
 * Export BackButton component for easy access
 * Allows: import { BackButton } from '@/components/atoms/button';
 */
export { BackButton } from './back-button';
