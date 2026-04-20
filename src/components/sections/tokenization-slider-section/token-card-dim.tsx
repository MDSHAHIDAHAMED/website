'use client';

import { Box, Stack } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import Image from 'next/image';

import CornerContainer from '@/components/atoms/corner-container';
import AtomTypography from '@/components/atoms/typography';
import { yieldzNeutral } from '@/styles/theme/colors';

// =============================================================================
// Types & Interfaces
// =============================================================================

export interface TokenCardDimProps {
    name: string;
    description: string;
    availability: string;
    lockup: string;
    underlyingAsset: string;
    apy: string;
    sx?: SxProps<Theme>;
}

// =============================================================================
// Constants & Styles
// =============================================================================

const CARD_CONTAINER_BORDER_SX: SxProps<Theme> = {
    border: '1px solid transparent',
    padding: 0.3,
    width: 'fit-content',
    transition: 'all 0.9s ',
    cursor: 'pointer',
    '&:hover': {
        borderColor: yieldzNeutral[500],
    },
};

const CARD_CONTAINER_SX: SxProps<Theme> = {
    width: '100%',
    maxWidth: '300px',
    backgroundColor: 'rgba(10, 10, 10, 0.6)',
    backdropFilter: 'blur(10px)',
    p: 0,
    opacity: 0.2, // Dimmed version
    '&:hover': {
        opacity: .5,
    },
};

const CARD_PADDING_SX: SxProps<Theme> = {
    p: 2,
};

const HEADER_BOX_SX: SxProps<Theme> = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
};

const HEADER_STACK_SX: SxProps<Theme> = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1.5,
};

const NAME_TYPOGRAPHY_SX: SxProps<Theme> = {
    letterSpacing: '0.5px',
    fontSize: '20px',
};

const LABEL_Stack_SX: SxProps<Theme> = {
    fontSize: '8px !important',
    color: 'text.secondary',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    borderLeft: '2px solid #FFFFFF',
    px: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    mb: 0.5,
};

const DESCRIPTION_SX: SxProps<Theme> = {
    fontSize: '10px !important',
    color: 'text.secondary',
    lineHeight: '18px !important',
    fontWeight: 400,
    display: 'block',
    margin: 0,
    padding: 0,
    mt: 1,
};

const METRICS_GRID_SX: SxProps<Theme> = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
};

const METRIC_ITEM_SX: SxProps<Theme> = {
    display: 'flex',
    flexDirection: 'column',
};

const LABEL_SX: SxProps<Theme> = {
    fontSize: '7.5px !important',
    color: 'text.secondary',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    mb: 0.5,
};

const VALUE_SX: SxProps<Theme> = {
    fontSize: '10px !important',
    fontWeight: 600,
    color: 'text.primary',
};

const APY_STACK_SX: SxProps<Theme> = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1.5,
};

const VALUE_PERCENT_SX: SxProps<Theme> = {
    fontSize: '26px !important',
    fontWeight: 600,
    color: 'text.primary',
};

const APY_LABEL_SX: SxProps<Theme> = {
    fontWeight: 500,
    fontSize: '14px !important',
};

// =============================================================================
// Main Component
// =============================================================================

export default function TokenCardDim({
    name,
    description,
    availability,
    lockup,
    underlyingAsset,
    apy,
    sx,
}: Readonly<TokenCardDimProps>): React.JSX.Element {
    return (
        <Box sx={CARD_CONTAINER_BORDER_SX}>
            <Box sx={[CARD_CONTAINER_SX, ...(Array.isArray(sx) ? sx : [sx])]}>
                <CornerContainer height="auto" sx={{ ...CARD_PADDING_SX, backgroundImage: "url(/assets/backgrounds/feature-bg.png)" }}>
                    {/* Header */}
                    <Box sx={HEADER_BOX_SX}>
                        <Stack sx={HEADER_STACK_SX}>
                            <Image src="/assets/icons/YLDG_tocken.svg" alt="Y" width={24} height={24} />
                            <AtomTypography variant="h6" sx={NAME_TYPOGRAPHY_SX}>
                                {name}
                            </AtomTypography>
                        </Stack>
                        <AtomTypography variant="h5" sx={LABEL_Stack_SX}>
                        YLDZ
                        </AtomTypography>
                    </Box>
                    {/* Description */}
                    <AtomTypography variant='body1' sx={DESCRIPTION_SX}>{description}</AtomTypography>
                </CornerContainer>

                {/* Metrics Grid */}
                <CornerContainer height="auto" sx={CARD_PADDING_SX}>
                    <Box sx={METRICS_GRID_SX}>
                        <Box sx={METRIC_ITEM_SX}>
                            <AtomTypography variant='h5' sx={LABEL_SX}>AVAILABILITY</AtomTypography>
                            <AtomTypography variant='h5' sx={VALUE_SX}>{availability}</AtomTypography>
                        </Box>
                        <Box sx={METRIC_ITEM_SX}>
                            <AtomTypography variant='h5' sx={LABEL_SX}>LOCKUP</AtomTypography>
                            <AtomTypography variant='h5' sx={VALUE_SX}>{lockup}</AtomTypography>
                        </Box>
                        <Box sx={METRIC_ITEM_SX}>
                            <AtomTypography variant='h5' sx={LABEL_SX}>UNDERLYING ASSET</AtomTypography>
                            <AtomTypography variant='h5' sx={VALUE_SX}>{underlyingAsset}</AtomTypography>
                        </Box>
                    </Box>
                </CornerContainer>

                {/* APY Section */}
                <CornerContainer height="auto" sx={{ ...CARD_PADDING_SX, backgroundImage: "url(/assets/backgrounds/feature-bg.png)" }}>
                    <Box>
                        <AtomTypography sx={LABEL_SX} mb={1}>CURRENT</AtomTypography>
                        <Stack sx={APY_STACK_SX}>
                            <AtomTypography
                                variant="h2"
                                sx={VALUE_PERCENT_SX}
                                fontType="tickerbit"
                            >
                                {apy}
                            </AtomTypography>
                            <Image src="/assets/icons/boltz.svg" alt="Energy" width={20} height={20} />
                            <AtomTypography variant="h6" color="text.secondary" sx={APY_LABEL_SX}>
                                APY
                            </AtomTypography>
                        </Stack>
                    </Box>
                </CornerContainer >
            </Box >
        </Box>
    );
}
