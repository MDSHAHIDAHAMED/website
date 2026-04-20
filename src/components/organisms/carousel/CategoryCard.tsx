'use client';

import CornerContainer from '@/components/atoms/corner-container';
import { yieldzBase, yieldzNeutral, yieldzPrimary } from '@/styles/theme/colors';
import { Box, Stack, Typography } from '@mui/material';
import React from 'react';
import type { ICategoryCardProps } from './types';

/**
 * CategoryCard Component
 * 
 * A card component designed to display token categories with icon, title, and description
 * Matches the design pattern shown in the Token Categories carousel
 * 
 * SOLID Principles:
 * - Single Responsibility: Displays a single category card
 * - Open/Closed: Extensible through props
 * - Liskov Substitution: Can be replaced with any similar card component
 * - Interface Segregation: Minimal, focused props
 * - Dependency Inversion: Uses theme colors from abstraction layer
 * 
 * KISS Principle: Simple, focused card display
 * 
 * @example
 * ```tsx
 * <CategoryCard
 *   id="stable-tokens"
 *   icon={<YourIcon />}
 *   title="STABLE TOKENS"
 *   description="RWA Asset Stable Tokens"
 *   onClick={() => handleCategoryClick('stable-tokens')}
 * />
 * ```
 */
const CategoryCard: React.FC<ICategoryCardProps> = ({
  id,
  icon,
  title,
  description,
  onClick,
}) => {
  return (
    <CornerContainer
      sx={{
        background: 'linear-gradient(135deg, #000000 0%, #171717 50%, #222222 100%)',
        padding: '24px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease-in-out',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        minHeight: '180px',
        '&:hover': onClick ? {
          background: 'linear-gradient(135deg, #171717 0%, #222222 50%, #2a2a2a 100%)',
          borderColor: yieldzPrimary[500],
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 24px ${yieldzNeutral[950]}`,
        } : {},
      }}
    >
      <Box
        onClick={onClick}
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
        }}
      >
        <Stack spacing={2} width="100%">
          {/* Icon */}
          {icon && (
            <Box
              sx={{
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: yieldzPrimary[500],
                '& svg': {
                  width: '100%',
                  height: '100%',
                },
                '& img': {
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                },
              }}
            >
              {icon}
            </Box>
          )}

          {/* Title */}
          <Typography
            variant="h6"
            sx={{
              color: yieldzBase.white,
              fontSize: '16px',
              fontWeight: 600,
              letterSpacing: '0.5px',
              lineHeight: '24px',
              textTransform: 'uppercase',
            }}
          >
            {title}
          </Typography>

          {/* Description */}
          {description && (
            <Typography
              variant="body2"
              sx={{
                color: yieldzNeutral[300],
                fontSize: '14px',
                fontWeight: 400,
                lineHeight: '20px',
              }}
            >
              {description}
            </Typography>
          )}
        </Stack>
      </Box>
    </CornerContainer>
  );
};

export default CategoryCard;

