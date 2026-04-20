'use client';

import { alpha, Box, type SxProps, type Theme } from '@mui/material';
import { kebabCase } from 'change-case';
import React, { forwardRef } from 'react';

import { yieldzPrimary, yieldzSecondary } from '@/styles/theme/colors';

/**
 * Available badge variants
 * Each variant has its own color scheme with left border indicator
 */
type TBadgeVariant = 'neutral' | 'brand' | 'yellow' | 'red' | 'green';

/**
 * Props interface for the YieldsBadge component
 * Follows SOLID principles for clean, focused interface
 */
export interface YieldsBadgeProps {
  /**
   * The variant/type of the badge - determines color scheme
   * @default 'neutral'
   */
  variant?: TBadgeVariant;

  /**
   * The content to display in the badge
   */
  label: string | React.ReactNode;

  /**
   * Unique identifier for the badge
   */
  id: string;

  /**
   * Additional custom styles
   */
  sx?: SxProps<Theme>;

  /**
   * Optional click handler
   */
  onClick?: () => void;
}

/**
 * Helper function to get badge styles based on variant
 * Returns appropriate colors for border, background, and text
 * Uses theme colors from yieldzPrimary, yieldzSecondary palettes
 *
 * Color mapping:
 * - green: #77FF23 (yieldzSecondary.green)
 * - red: #FF5B23 (yieldzSecondary.red)
 * - yellow: #F7931A (yieldzSecondary.orange)
 * - brand: #6DF2FE (yieldzPrimary[500])
 * - neutral: white
 */
const getBadgeStyles = (variant: TBadgeVariant, theme: Theme) => {
  const styles = {
    neutral: {
      // Neutral uses white border and very light background
      borderColor: theme.palette.common.white,
      backgroundColor: alpha(theme.palette.common.white, 0.1),
      color: theme.palette.common.white,
    },
    brand: {
      // Brand uses yieldzPrimary color (#6DF2FE)
      borderColor: yieldzPrimary[500], // #6DF2FE
      backgroundColor: alpha(yieldzPrimary[500], 0.1),
      color: theme.palette.common.white,
    },
    yellow: {
      // Yellow uses orange color (#F7931A) from yieldzSecondary.orange
      borderColor: yieldzSecondary.orange[500],
      backgroundColor: alpha(yieldzSecondary.orange[500], 0.1),
      color: theme.palette.common.white,
    },
    red: {
      // Red uses error color (#FF5B23)
      borderColor: theme.palette.error.main, // #FF5B23
      backgroundColor: alpha(theme.palette.error.main, 0.1),
      color: theme.palette.common.white,
    },
    green: {
      // Green uses success color (#77FF23)
      borderColor: theme.palette.success.main, // #77FF23
      backgroundColor: alpha(theme.palette.success.main, 0.1),
      color: theme.palette.common.white,
    },
  };

  return styles[variant];
};

/**
 * YieldsBadge Component
 *
 * A badge component with multiple color variants and a distinctive left border indicator
 * Perfect for displaying status, categories, or labels
 *
 * Features:
 * - 5 color variants: neutral, brand, yellow, red, green
 * - Left border indicator matching the variant color
 * - Responsive design that works in both light and dark modes
 * - Clean, modern pill-shaped design
 *
 * @example
 * ```tsx
 * <YieldsBadge variant="brand" label="Status" id="status-badge" />
 * <YieldsBadge variant="green" label="Active" id="active-badge" />
 * ```
 */
function YieldsBadge(props: Readonly<YieldsBadgeProps>, ref: React.Ref<HTMLDivElement>): React.JSX.Element {
  const { variant = 'neutral', label, id, sx = {}, onClick } = props;

  return (
    <Box
      ref={ref}
      id={id}
      data-testid={`qa-${kebabCase(id ?? '')}`}
      onClick={onClick}
      sx={[
        (theme) => {
          const variantStyles = getBadgeStyles(variant, theme);

          return {
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            pl: 1.25,
            pr: 1.25,
            py: 0.5,
            backgroundColor: variantStyles.backgroundColor,
            color: variantStyles.color,
            fontSize: '0.875rem',
            fontWeight: 400,
            lineHeight: 1.5,
            cursor: onClick ? 'pointer' : 'default',
            transition: 'all 0.2s ease-in-out',
            userSelect: 'none',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '3px',
              backgroundColor: variantStyles.borderColor,
              borderTopLeftRadius: '6px',
              borderBottomLeftRadius: '6px',
            },
            ...(onClick && {
              '&:hover': {
                opacity: 0.85,
                transform: 'translateY(-1px)',
              },
              '&:active': {
                transform: 'translateY(0)',
              },
            }),
          };
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {label}
    </Box>
  );
}

export default forwardRef(YieldsBadge);
