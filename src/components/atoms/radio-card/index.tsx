'use client';

import { Box, Stack, type SxProps, type Theme } from '@mui/material';
import React from 'react';

import { yieldzNeutral, yieldzPrimary, yieldzSecondary } from '@/styles/theme/colors';
import AtomTypography from '../typography';

export interface RadioCardProps {
  /**
   * The label/title of the radio card
   */
  label: string;
  /**
   * The description text below the label
   */
  description?: string;
  /**
   * Whether the radio card is selected/active
   */
  selected?: boolean;
  /**
   * Whether the radio card is disabled
   */
  disabled?: boolean;
  /**
   * Click handler
   */
  onClick?: () => void;
  /**
   * Custom value for the radio
   */
  value?: string | number;
  /**
   * Custom name for form integration
   */
  name?: string;
  /**
   * Custom sx styles
   */
  sx?: SxProps<Theme>;
  /**
   * Data test id for testing
   */
  'data-testid'?: string;
  /**
   * Optional icon/logo to display
   */
  icon?: React.ReactNode;
}

// Default icon component (X mark in circle)
const DefaultIcon: React.FC<{ selected?: boolean; disabled?: boolean; hovered?: boolean; focused?: boolean }> = ({
  selected,
  disabled,
  hovered,
  focused,
}) => {
  let iconColor = yieldzNeutral[400];
  if (disabled) {
    iconColor = yieldzNeutral[500];
  } else if (focused || hovered) {
    iconColor = yieldzPrimary[500]; // #6DF2FE - highlight on focus/hover, not on active
  }

  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke={iconColor} strokeWidth="2" fill="none" />
      <line x1="8" y1="8" x2="16" y2="16" stroke={iconColor} strokeWidth="2" strokeLinecap="round" />
      <line x1="16" y1="8" x2="8" y2="16" stroke={iconColor} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

// Corner brackets component - Only corners, no full border
const CornerBrackets: React.FC<{ selected?: boolean; hovered?: boolean; focused?: boolean; disabled?: boolean }> = ({
  selected,
  hovered,
  focused,
  disabled,
}) => {
  const getBracketColor = () => {
    if (disabled) return yieldzNeutral[600];
    if (selected || focused || hovered) return yieldzPrimary[500]; // #6DF2FE - highlight corners on selected/focus/hover
    return yieldzNeutral[400]; // neutral on default state
  };

  const bracketColor = getBracketColor();
  const bracketSize = 16;
  const borderWidth = '2px';

  return (
    <>
      {/* Top-left bracket */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: bracketSize,
          height: bracketSize,
          borderLeft: `${borderWidth} solid ${bracketColor}`,
          borderTop: `${borderWidth} solid ${bracketColor}`,
          transition: 'border-color 0.25s ease',
        }}
      />
      {/* Top-right bracket */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: bracketSize,
          height: bracketSize,
          borderRight: `${borderWidth} solid ${bracketColor}`,
          borderTop: `${borderWidth} solid ${bracketColor}`,
          transition: 'border-color 0.25s ease',
        }}
      />
      {/* Bottom-left bracket */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: bracketSize,
          height: bracketSize,
          borderLeft: `${borderWidth} solid ${bracketColor}`,
          borderBottom: `${borderWidth} solid ${bracketColor}`,
          transition: 'border-color 0.25s ease',
        }}
      />
      {/* Bottom-right bracket */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: bracketSize,
          height: bracketSize,
          borderRight: `${borderWidth} solid ${bracketColor}`,
          borderBottom: `${borderWidth} solid ${bracketColor}`,
          transition: 'border-color 0.25s ease',
        }}
      />
    </>
  );
};

const RadioCard = React.forwardRef<HTMLDivElement, RadioCardProps>(
  (
    {
      label,
      description,
      selected = false,
      disabled = false,
      onClick,
      value,
      name,
      sx,
      'data-testid': dataTestId,
      icon,
    },
    ref
  ) => {
    const [hovered, setHovered] = React.useState(false);
    const [focused, setFocused] = React.useState(false);

    const getBackgroundColor = () => {
      if (disabled) return yieldzNeutral[950]; // #080808 - light black
      if (selected && hovered) return `${yieldzPrimary[500]}14`; // #6DF2FE with ~8% opacity when selected + hovered
      if (selected) return `${yieldzPrimary[500]}0D`; // #6DF2FE with ~5% opacity (light bluish) over dark background
      if (hovered) return `${yieldzPrimary[500]}08`; // #6DF2FE with ~3% opacity on hover
      return yieldzNeutral[950]; // #080808 - light black (default)
    };

    const getIconFilter = () => {
      if (disabled) {
        // Match yieldzNeutral[600] for disabled state
        return 'grayscale(100%) opacity(0.5)';
      }
      if (selected || hovered || focused) {
        // Match yieldzPrimary[500] (#6DF2FE) for selected/hover/focus states
        return 'brightness(0) saturate(100%) invert(77%) sepia(60%) saturate(1784%) hue-rotate(138deg) brightness(101%) contrast(98%)';
      }
      // Default state - keep the original icon color (no filter)
      return 'none';
    };

    const handleClick = () => {
      if (!disabled && onClick) {
        onClick();
      }
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (!disabled && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        onClick?.();
      }
    };

    // Calculate text color
    let labelColor = yieldzNeutral[100];
    if (disabled) {
      labelColor = yieldzNeutral[500];
    }

    return (
      <Box
        ref={ref}
        component="label"
        data-testid={dataTestId}
        onClick={handleClick}
        onMouseEnter={() => !disabled && setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        sx={{
          position: 'relative',
          width: '100%',
          minHeight: '100px',
          padding: 3,
          backgroundColor: getBackgroundColor(),
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          transition: 'all 0.25s ease',
          outline: 'none',
          // Outer border when focused or selected
          ...((focused || selected) && {
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '-6px',
              left: '-6px',
              right: '-6px',
              bottom: '-6px',
              border: selected ? '' : `2px solid ${yieldzSecondary.blue.focus}`,
              borderRadius: '4px',
              pointerEvents: 'none',
            },
          }),
          ...sx,
        }}
      >
        {/* Hidden native radio input for accessibility */}
        <input
          type="radio"
          name={name}
          value={value}
          checked={selected}
          disabled={disabled}
          onChange={handleClick}
          onFocus={() => !disabled && setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={handleKeyDown}
          aria-label={label}
          style={{
            position: 'absolute',
            opacity: 0,
            width: 0,
            height: 0,
            pointerEvents: 'none',
          }}
        />

        {/* Corner brackets - only corners, no full border */}
        <CornerBrackets selected={selected} hovered={hovered} focused={focused} disabled={disabled} />

        {/* Content */}
        <Stack direction="row" spacing={2} alignItems="flex-start">
          {/* Icon/Logo */}
          {icon && (
            <Box
              sx={{
                flexShrink: 0,
                // Apply color filter based on state
                '& img, & svg': {
                  transition: 'filter 0.25s ease',
                  filter: getIconFilter(),
                },
              }}
            >
              {icon}
            </Box>
          )}
          {!icon && (
            <Box sx={{ flexShrink: 0, marginTop: '2px' }}>
              <DefaultIcon selected={selected} disabled={disabled} hovered={hovered} focused={focused} />
            </Box>
          )}

          {/* Text Content */}
          <Stack spacing={1} sx={{ flex: 1, textAlign: 'left', gap: 0 }}>
            <AtomTypography
            id="radio-card-label1"
              variant="body2Bold"
              color='text.primary'
              sx={{
                transition: 'color 0.25s ease',
                textAlign: 'left',
              }}
            >
              {label}
            </AtomTypography>
            {description && (
              <AtomTypography
                variant="overline"
                 id="radio-card-description-1"
                 color={disabled ? 'text.disabled' : 'text.secondary'}
                sx={{
                  transition: 'color 0.25s ease',
                  textAlign: 'left',
                  textTransform: 'none',
                }}
              >
                {description}
              </AtomTypography>
            )}
          </Stack>
        </Stack>
      </Box>
    );
  }
);

RadioCard.displayName = 'RadioCard';

export default RadioCard;
