'use client';

import { Box, Stack } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { memo } from 'react';
import Image from 'next/image';
import CornerContainer from '@/components/atoms/corner-container';
import AtomTypography from '@/components/atoms/typography';
import { yieldzBase } from '@/styles/theme';

// =============================================================================
// Constants - Styles
// =============================================================================

/** Base card styles */
const CARD_SX: SxProps<Theme> = {
    p: 3,
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
    height: '100%',
    minHeight: { lg: '300px', xs: '200px', md: '250px' },
    backgroundColor: '#000000',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    imageRendering: '-webkit-optimize-contrast',
    WebkitFontSmoothing: 'antialiased',
    transform: 'translateZ(0)',
    willChange: 'transform',
};

/** Card 1 - SURANCE card with feature background */
const CARD_1_SX: SxProps<Theme> = {
    ...CARD_SX,
    backgroundImage: 'url(/assets/backgrounds/feature-bg.png)',
};

/** Card 3 - DE-RISK card with token info background */
const CARD_3_SX: SxProps<Theme> = {
    ...CARD_SX,
    backgroundImage: 'url(/assets/backgrounds/Token_Infob_bg.png)',
    position: 'relative',
};

/** Container grid layout */
const CONTAINER_SX: SxProps<Theme> = {
    display: 'grid',
    gridTemplateColumns: { lg: 'repeat(3, 1fr)', xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
    width: '100%',
    maxWidth: 'calc(100vw - 64px)',
    p: 3,
};

/** Card 1 - Heading text */
const CARD_1_HEADING_SX: SxProps<Theme> = {
    color: yieldzBase.white,
    mb: 'auto',
    fontWeight: 600,
    textTransform: 'uppercase',
};

/** Card 1 - SURANCE logo and text container */
const SURANCE_CONTAINER_SX: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'end',
    gap: 2,
};

/** Card 1 - SURANCE text */
const SURANCE_TEXT_SX: SxProps<Theme> = {
    color: yieldzBase.white,
    paddingTop: 1,
};

/** Card 2 - Heading text */
const CARD_2_HEADING_SX: SxProps<Theme> = {
    color: yieldzBase.white,
};

/** Card 2 - Subtitle text */
const CARD_2_SUBTITLE_SX: SxProps<Theme> = {
    color: yieldzBase.white,
    fontWeight: 600,
    mt: 0.5,
};

/** Card 2 - Percentage container */
const PERCENTAGE_CONTAINER_SX: SxProps<Theme> = {
    mt: 'auto',
    textAlign: 'right',
};

/** Card 2 - Percentage text */
const PERCENTAGE_TEXT_SX: SxProps<Theme> = {
    color: yieldzBase.white,
};

/** Card 3 - Heading text */
const CARD_3_HEADING_SX: SxProps<Theme> = {
    color: yieldzBase.white,
    zIndex: 1,
    fontWeight: 600,
    textTransform: 'uppercase',
};

/** Card 3 - BTC icon container */
const BTC_ICON_CONTAINER_SX: SxProps<Theme> = {
    position: 'absolute',
    top: '50%',
    right: 0,
    transform: 'translateY(-50%)',
    zIndex: 0,
    height: '100%',
    display: 'flex',
    alignItems: 'center',
};

/** Card 3 - BTC icon image styles */
const BTC_ICON_STYLE = {
    objectFit: 'contain' as const,
    height: '100%',
    width: 'auto',
    filter: 'brightness(0.2) contrast(1.1)',
};

// =============================================================================
// Component
// =============================================================================

const EthicallyNeutralYieldTooltipContent = memo(function EthicallyNeutralYieldTooltipContent() {
    return (
        <Box sx={CONTAINER_SX}>
            {/* Card 1: SURANCE */}
            <CornerContainer sx={CARD_1_SX} showBorder>
                <AtomTypography variant="h3" sx={CARD_1_HEADING_SX}>
                    NOT ALL RISK IS<br />CREATED EQUAL
                </AtomTypography>
                <Box sx={SURANCE_CONTAINER_SX}>
                    <Image
                        src="/assets/icons/Yicon2.svg"
                        alt="Surance Icon"
                        width={60}
                        height={60}
                    />
                    <AtomTypography
                        variant="display5"
                        sx={SURANCE_TEXT_SX}
                        fontType="tickerbit"
                    >
                        SURANCE
                    </AtomTypography>
                </Box>
            </CornerContainer>

            {/* Card 2: POWERED BY YLDZ */}
            <CornerContainer sx={CARD_SX} showBorder>
                <Stack spacing={0.5}>
                    <AtomTypography variant="h3" sx={CARD_2_HEADING_SX}>
                        POWERED BY YLDZ
                    </AtomTypography>
                    <AtomTypography variant="h3" sx={CARD_2_HEADING_SX}>
                        YIELD IN BTC
                    </AtomTypography>
                    <AtomTypography variant="body4" sx={CARD_2_SUBTITLE_SX}>
                        The Smartest Way To Build Legacy
                    </AtomTypography>
                </Stack>
                <Box sx={PERCENTAGE_CONTAINER_SX}>
                    <AtomTypography
                        variant="display5"
                        fontType="tickerbit"
                        sx={PERCENTAGE_TEXT_SX}
                    >
                        15.04%
                    </AtomTypography>
                </Box>
            </CornerContainer>

            {/* Card 3: DE-RISK */}
            <CornerContainer sx={CARD_3_SX} showBorder>
                <AtomTypography variant="h3" sx={CARD_3_HEADING_SX}>
                    WHAT IF YOU<br />COULD DE-RISK<br />YOUR BTC RETURNS
                </AtomTypography>
                <Box sx={BTC_ICON_CONTAINER_SX}>
                    <Image
                        src="/assets/icons/BTCdark2.svg"
                        alt="BTC Icon"
                        width={80}
                        height={250}
                        style={BTC_ICON_STYLE}
                    />
                </Box>
            </CornerContainer>
        </Box>
    );
});

export default EthicallyNeutralYieldTooltipContent;
