'use client';

import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { memo } from 'react';

import AtomTypography from '@/components/atoms/typography';
import CornerContainer from '@/components/atoms/corner-container';

// =============================================================================
// Types
// =============================================================================

export interface StatCardProps {
    label: string;
    value: string;
    fontSize?: string | { xs: string; md: string };
    fontType?: 'ppMori' | 'tickerbit';
    color?: string;
    backgroundImage?: string;
    icon?: string;
    sx?: SxProps<Theme>;
}

// =============================================================================
// Styles
// =============================================================================

/** Stat card label styles */
const STAT_CARD_LABEL_SX: SxProps<Theme> = {
    opacity: 0.5,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    fontSize: '13px',
    fontWeight: 500,
    color: '#FFFFFF',
};

/** Stat card value container styles */
const STAT_CARD_VALUE_CONTAINER_SX: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
    mt: 1,
};

/** Stat card icon styles */
const STAT_CARD_ICON_SX: SxProps<Theme> = {
    width: '36px',
    height: '36px',
    objectFit: 'contain',
};

/** Stat card value text styles */
const getStatCardValueSx = (fontSize?: string | { xs: string; md: string }): SxProps<Theme> => ({
    fontSize: '40px',
    fontWeight: 300,
    lineHeight: '1.2 !important',
    ...(fontSize && (
        typeof fontSize === 'string'
            ? { fontSize: `${fontSize} !important` }
            : {
                fontSize: Object.entries(fontSize).reduce((acc, [key, val]) => ({
                    ...acc,
                    [key]: `${val} !important`
                }), {})
            }
    )),
});

// =============================================================================
// Preset Styles
// =============================================================================

/** Base stat card styles */
export const STAT_CARD_BASE_SX: SxProps<Theme> = {
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
};

/** Standard stat card - black background */
export const STAT_CARD_STANDARD_SX: SxProps<Theme> = {
    ...STAT_CARD_BASE_SX,
    backgroundColor: 'black',
    height: '150px',
};

/** Stat card with background image support */
export const STAT_CARD_WITH_BG_SX: SxProps<Theme> = {
    ...STAT_CARD_BASE_SX,
    backgroundColor: '#000000',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '150px',
};

/** Stat card - compact size */
export const STAT_CARD_COMPACT_SX: SxProps<Theme> = {
    ...STAT_CARD_BASE_SX,
    backgroundColor: 'black',
    height: '120px',
    p: 3,
};

/** Stat card - large size */
export const STAT_CARD_LARGE_SX: SxProps<Theme> = {
    ...STAT_CARD_BASE_SX,
    backgroundColor: 'black',
    height: { xs: '180px', md: '200px' },
    p: 5,
};

// =============================================================================
// Component
// =============================================================================

const StatCard = memo(function StatCard({
    label,
    value,
    sx,
    fontSize,
    fontType,
    color,
    backgroundImage,
    icon
}: StatCardProps) {
    // Merge background image with sx if provided, otherwise remove any background image from sx
    const mergedSx = backgroundImage
        ? {
            ...sx,
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }
        : {
            ...sx,
            backgroundImage: 'none',
        };

    return (
        <CornerContainer
            sx={mergedSx}
            showBorder
            height="auto"
        >
            <AtomTypography
                variant="subtitle2"
                sx={STAT_CARD_LABEL_SX}
            >
                {label}
            </AtomTypography>
            <Box sx={STAT_CARD_VALUE_CONTAINER_SX}>
                {icon && (
                    <Box
                        component="img"
                        src={icon}
                        alt={`${label} Icon`}
                        sx={STAT_CARD_ICON_SX}
                    />
                )}
                <AtomTypography
                    variant="h2"
                    fontType={fontType}
                    color={color}
                    sx={getStatCardValueSx(fontSize)}
                >
                    {value}
                </AtomTypography>
            </Box>
        </CornerContainer>
    );
});

export default StatCard;
