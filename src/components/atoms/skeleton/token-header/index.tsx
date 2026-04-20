'use client';

/**
 * Token Header Skeleton Component
 * ================================
 * Displays loading skeleton for token header section.
 *
 * Features:
 * - Symbol, logo, and title placeholders
 * - Description lines with varying widths
 * - Wave animation for loading effect
 *
 * @module components/atoms/skeleton/token-header
 */

import { Box, Skeleton } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import React, { memo } from 'react';
import { yieldzNeutral } from 'yldzs-components';

// =============================================================================
// Constants
// =============================================================================

/** Skeleton dimensions */
const DIMENSIONS = {
  SYMBOL_WIDTH: 60,
  SYMBOL_HEIGHT: 20,
  LOGO_SIZE: 64,
  TITLE_WIDTH: 200,
  TITLE_HEIGHT: 48,
  ICON_SIZE: 20,
  LINE_HEIGHT: 18,
} as const;

/** Description lines configuration with unique IDs */
const DESCRIPTION_LINES = [
  { id: 'line-1', width: '100%' },
  { id: 'line-2', width: '100%' },
  { id: 'line-3', width: '100%' },
  { id: 'line-4', width: '95%' },
  { id: 'line-5', width: '70%' },
] as const;

// =============================================================================
// Styles
// =============================================================================

/** Base skeleton styles */
const SKELETON_SX: SxProps<Theme> = {
  bgcolor: yieldzNeutral[800],
  borderRadius: 0.5,
};

/** Token header (logo + name) container styles */
export const TOKEN_HEADER_SX: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 2,
};

/** Token info container styles */
export const TOKEN_INFO_CONTAINER_SX: SxProps<Theme> = {
  mt: 4,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  flexWrap: 'wrap',
  gap: 2,
};

/** Description container styles */
const DESCRIPTION_CONTAINER_SX: SxProps<Theme> = {
  mt: 3,
  maxWidth: '800px',
};

// =============================================================================
// Component
// =============================================================================

/**
 * Token Header Skeleton
 * Displays loading skeleton for token symbol, logo, title, and description
 *
 * @returns Skeleton placeholder JSX element
 */
export const TokenHeaderSkeleton = memo(function TokenHeaderSkeleton(): React.JSX.Element {
  return (
    <>
      {/* Token Info Row */}
      <Box sx={TOKEN_INFO_CONTAINER_SX}>
        {/* Left: Token Symbol, Logo & Name */}
        <Box>
          {/* Symbol */}
          <Skeleton
            variant="text"
            width={DIMENSIONS.SYMBOL_WIDTH}
            height={DIMENSIONS.SYMBOL_HEIGHT}
            sx={{ ...SKELETON_SX, mb: 1 }}
            animation="wave"
          />
          <Box sx={TOKEN_HEADER_SX}>
            {/* Logo */}
            <Skeleton
              variant="circular"
              width={DIMENSIONS.LOGO_SIZE}
              height={DIMENSIONS.LOGO_SIZE}
              sx={SKELETON_SX}
              animation="wave"
            />
            {/* Title */}
            <Skeleton
              variant="text"
              width={DIMENSIONS.TITLE_WIDTH}
              height={DIMENSIONS.TITLE_HEIGHT}
              sx={SKELETON_SX}
              animation="wave"
            />
          </Box>
        </Box>

        {/* Right: Action Icon */}
        <Skeleton
          variant="circular"
          width={DIMENSIONS.ICON_SIZE}
          height={DIMENSIONS.ICON_SIZE}
          sx={SKELETON_SX}
          animation="wave"
        />
      </Box>

      {/* Description Lines */}
      <Box sx={DESCRIPTION_CONTAINER_SX}>
        {DESCRIPTION_LINES.map((line, idx) => (
          <Skeleton
            key={line.id}
            variant="text"
            width={line.width}
            height={DIMENSIONS.LINE_HEIGHT}
            sx={{
              ...SKELETON_SX,
              mb: idx < DESCRIPTION_LINES.length - 1 ? 0.5 : 0,
            }}
            animation="wave"
          />
        ))}
      </Box>
    </>
  );
});
