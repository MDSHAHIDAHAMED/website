import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { kebabCase } from 'change-case';

import { yieldzBase, yieldzNeutral } from '@/styles/theme/colors';

/**
 * Interface for time display properties
 * Follows Interface Segregation Principle - focused interface for time data
 */
interface TimeDisplayProps {
  years?: number;
  quarters?: number;
  months?: number;
  days?: number;
  hours?: number;
}

/**
 * Available progress bar formats
 * Follows DRY principle - centralized format options
 */
type ProgressFormat = 'day-wise' | 'percentage' | 'yearly' | 'quarterly';

/**
 * Props interface for the main ProgressBar component
 * Follows Single Responsibility Principle - handles only progress bar functionality
 */
interface ProgressBarProps {
  value?: number;
  id: string;
  timeDisplay?: TimeDisplayProps;
  format?: ProgressFormat;
  showLabel?: boolean;
  // Visual variant of progress: 'lined' (striped backgrounds) or 'segmented' (boxed cells)
  visualVariant?: 'lined' | 'segmented';
}

/**
 * Readonly version of ProgressBarProps for immutability
 * Follows best practices for prop immutability
 */
type ReadonlyProgressBarProps = Readonly<ProgressBarProps>;

/**
 * AtomProgressBar Component
 *
 * A reusable progress bar component with multiple display formats
 * Follows SOLID principles:
 * - Single Responsibility: Handles only progress bar functionality
 * - Open/Closed: Extensible through props without modification
 * - Liskov Substitution: Can be used anywhere progress display is needed
 * - Interface Segregation: Clean, focused prop interface
 * - Dependency Inversion: Depends on abstractions (theme)
 *
 * Follows KISS principle: Simple, focused functionality
 * Follows DRY principle: Reusable across the application
 */
function AtomProgressBar(props: ReadonlyProgressBarProps): React.JSX.Element {
  // Destructure props with sensible defaults
  const {
    id = 'progress',
    value = 0,
    timeDisplay,
    format = 'percentage',
    showLabel = true,
    visualVariant = 'lined',
    ...rest
  } = props;

  // State management for progress value
  const [progress, setProgress] = useState<number>(value);

  /**
   * Effect hook to sync external value changes with internal state
   * Follows Single Responsibility Principle - handles only value synchronization
   */
  useEffect(() => {
    setProgress(value);
  }, [value]);

  return (
    <Box sx={{ width: '100%' }}>
      <CustomProgressBar
        id={id}
        value={progress}
        timeDisplay={timeDisplay}
        format={format}
        showLabel={showLabel}
        visualVariant={visualVariant}
        {...rest}
      />
    </Box>
  );
}

interface CustomProgressBarProps {
  id: string;
  value: number;
  timeDisplay?: TimeDisplayProps;
  format: ProgressFormat;
  showLabel: boolean;
  visualVariant: 'lined' | 'segmented';
  [key: string]: unknown;
}

type ReadonlyCustomProgressBarProps = Readonly<CustomProgressBarProps>;

/**
 * Props interface for the internal CustomProgressBar component
 * Follows Interface Segregation Principle - focused interface for internal use
 */

/**
 * CustomProgressBar Component
 *
 * Internal component that handles the actual progress bar rendering
 * Follows Single Responsibility Principle - handles only rendering logic
 * Follows DRY principle - reusable rendering logic
 */
function CustomProgressBar({
  id,
  value,
  timeDisplay,
  format,
  showLabel,
  visualVariant,
  ...rest
}: ReadonlyCustomProgressBarProps): React.JSX.Element {
  // Normalize incoming value (supports 0-1 and 0-100)
  const normalizedValue = React.useMemo(() => {
    const asPercent = value <= 1 ? value * 100 : value;
    return Math.max(0, Math.min(100, asPercent));
  }, [value]);
  /**
   * Helper function to format time display based on format type
   * Follows DRY principle - centralizes time formatting logic
   * Follows Single Responsibility Principle - handles only time formatting
   */
  const formatTimeDisplay = () => {
    if (!timeDisplay) return null;

    const parts = [];

    // Handle different time display formats based on format prop
    if (format === 'yearly') {
      if (timeDisplay.years) parts.push(`${timeDisplay.years}Y`);
      if (timeDisplay.months) parts.push(`${timeDisplay.months}M`);
      if (timeDisplay.days) parts.push(`${timeDisplay.days}D`);
    } else if (format === 'quarterly') {
      if (timeDisplay.quarters) parts.push(`${timeDisplay.quarters}Q`);
      if (timeDisplay.months) parts.push(`${timeDisplay.months}M`);
      if (timeDisplay.days) parts.push(`${timeDisplay.days}D`);
    } else {
      // Default day-wise format
      if (timeDisplay.months) parts.push(`${timeDisplay.months}M`);
      if (timeDisplay.days) parts.push(`${timeDisplay.days}D`);
      if (timeDisplay.hours) parts.push(`${timeDisplay.hours}H`);
    }

    return parts.join(' ');
  };

  /**
   * Helper function to get the display label based on format and data
   * Follows DRY principle - centralizes label generation logic
   * Follows Single Responsibility Principle - handles only label generation
   */
  const getDisplayLabel = () => {
    if ((format === 'day-wise' || format === 'yearly' || format === 'quarterly') && timeDisplay) {
      return formatTimeDisplay();
    }
    if (format === 'percentage') {
      return `${Math.round(value)}%`;
    }
    return null;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
      id={id}
      data-testid={`qa-${kebabCase(id ?? '')}`}
    >
      {/* Label Display - shows formatted time or percentage */}
      {showLabel && getDisplayLabel() && (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            fontSize: '14px',
            lineHeight: 1.2,
            color: 'text.primary',
          }}
        >
          {getDisplayLabel()}
        </Typography>
      )}

      {visualVariant === 'lined' ? (
        <Box
          sx={(theme) => ({
            width: '100%',
            height: { xs: '12px', sm: '16px', md: '24px' },
            position: 'relative',
            border: `1px solid ${yieldzNeutral[900]}`, // #222222
            borderRadius: { xs: '3px', sm: '4px' },
            overflow: 'hidden',
            backgroundColor: yieldzNeutral[800], // #111111
            backgroundImage: `linear-gradient(90deg, ${yieldzBase.white}2E 0, ${yieldzBase.white}2E 1px, transparent 1px)`, // white with ~18% opacity
            backgroundSize: '8px 100%',
            [theme.breakpoints.up('sm')]: { backgroundSize: '10px 100%' },
            [theme.breakpoints.up('md')]: { backgroundSize: '12px 100%' },
          })}
        >
          <Box
            sx={(theme) => ({
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: `${normalizedValue}%`,
              backgroundColor: yieldzBase.white, // #FFFFFF
              backgroundImage: `linear-gradient(90deg, ${yieldzBase.black} 0, ${yieldzBase.black} 1px, transparent 1px)`,
              backgroundSize: '8px 100%',
              [theme.breakpoints.up('sm')]: { backgroundSize: '10px 100%' },
              [theme.breakpoints.up('md')]: { backgroundSize: '12px 100%' },
              transition: 'width 0.35s ease',
            })}
          />
        </Box>
      ) : (
        <Box
          sx={(theme) => ({
            width: '100%',
            height: { xs: '20px', sm: '28px', md: '42px' },
            position: 'relative',
            border: `1px solid ${yieldzNeutral[900]}`, // #111111

            overflow: 'hidden',
            backgroundColor: yieldzNeutral[800], // #222222
            // Dark cell separators across the whole track - thicker lines, narrower cells
            backgroundImage: `repeating-linear-gradient(90deg, ${yieldzNeutral[700]}CC 0px, ${yieldzNeutral[700]}CC 2px, transparent 2px, transparent 10px)`, // neutral-700 with 80% opacity
            [theme.breakpoints.up('md')]: {
              backgroundImage: `repeating-linear-gradient(90deg, ${yieldzNeutral[700]}CC 0px, ${yieldzNeutral[700]}CC 0px, transparent 3px, transparent 12px)`, // neutral-700 with 80% opacity
            },
          })}
        >
          {/* Filled cells layer - white with thick black separators; width reflects value */}
          <Box
            sx={(theme) => ({
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: `${normalizedValue}%`,
              backgroundColor: yieldzBase.white, // #FFFFFF
              // Thick black vertical separators on white fill - narrower cells to match track
              backgroundImage: `repeating-linear-gradient(90deg, ${yieldzBase.black} 0px, ${yieldzBase.black} 0px, transparent 1px, transparent 10px)`,
              [theme.breakpoints.up('md')]: {
                backgroundImage: `repeating-linear-gradient(90deg, ${yieldzBase.black} 0px, ${yieldzBase.black} 0, transparent 2px, transparent 12px)`,
              },
              [theme.breakpoints.up('sm')]: {
                backgroundImage: `repeating-linear-gradient(90deg, ${yieldzBase.black} 0px, ${yieldzBase.black} 1px, transparent 2px, transparent 12px)`,
              },
              transition: 'width 0.35s ease',
            })}
          />
        </Box>
      )}
    </Box>
  );
}

export default AtomProgressBar;
