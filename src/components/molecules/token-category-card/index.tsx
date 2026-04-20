'use client';

/**
 * TokenCategoryCard Component
 * ===========================
 * Displays a token category with icon and description.
 * Uses CornerContainer for consistent styling with triangle corners.
 */

import CornerContainer from '@/components/atoms/corner-container';
import AtomTypography from '@/components/atoms/typography';
import { CATEGORY_CARD_HEIGHT, CATEGORY_CARD_SX, type TokenCategory } from '@/constants/token-explorer';
import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import Image from 'next/image';
import React, { memo } from 'react';

// =============================================================================
// Styles
// =============================================================================

/** Description text styles - limited to 4 lines with ellipsis */
const DESCRIPTION_SX: SxProps<Theme> = {
  display: '-webkit-box',
  WebkitLineClamp: 5,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxHeight: '7em', // 5 lines × 1.4 line-height
  width: '100%',
  lineHeight: '18px',
};

// =============================================================================
// Types
// =============================================================================

interface TokenCategoryCardProps {
  category: TokenCategory;
  onClick?: () => void;
}

// =============================================================================
// Sub-Components
// =============================================================================

/**
 * Category Icon - displays an X icon placeholder
 */
const CategoryIcon = memo(function CategoryIcon() {
  return (
    <Box
      sx={{
        width: 40,
        height: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        m: 1,
      }}
    >
      <Image src="/assets/icons/token-square.svg" alt="Token Logo" width={40} height={40} />
    </Box>
  );
});

// =============================================================================
// Main Component
// =============================================================================

function TokenCategoryCard({ category, onClick }: Readonly<TokenCategoryCardProps>): React.JSX.Element {
  return (
    <CornerContainer showBorder={false} sx={CATEGORY_CARD_SX} outerSx={{ cursor: 'pointer', height: CATEGORY_CARD_HEIGHT, minHeight: CATEGORY_CARD_HEIGHT, borderColor: 'var(--mui-palette-neutral-800)' }}>
      <Box 
        onClick={onClick} 
        sx={{ 
          width: '100%', 
          height: '100%', 
          textAlign: 'center', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'flex-start', 
          gap: 5,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Icon */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CategoryIcon />
        </Box>
        {/* Name */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
        <AtomTypography variant="h5" color="text.primary">
          {category.name}
        </AtomTypography>

        {/* Description - limited to 4 lines with ellipsis */}
        <AtomTypography variant="caption" color="text.secondary" sx={DESCRIPTION_SX}>
          {category.description}
        </AtomTypography>
        </Box>
      </Box>
    </CornerContainer>
  );
}

export default memo(TokenCategoryCard);

