'use client';
 
/**
 * DigitalAssetInvestment Component
 * ======================================
 * Displays "Constrained by Access to Energy" section.
 *
 * Layout:
 * - Headline
 * - 3 Column Grid
 * - Bottom Button
 */
import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import Image from 'next/image';
import { memo } from 'react';
 
import AtomButton from '@/components/atoms/button';
import CornerContainer from '@/components/atoms/corner-container';
import AtomTypography from '@/components/atoms/typography';
 
// =============================================================================
// Constants
// =============================================================================
 
/** Section container styles */
const SECTION_SX: SxProps<Theme> = {
    width: '100%',
    minHeight: '100vh',
    backgroundColor: '#000000', // Black background
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    p: { xs: 2, sm: 3, md: 4, lg: 5 },
};
 
/** Headline styles */
const HEADLINE_SX: SxProps<Theme> = {
    textAlign: 'center',
    width: '100%',
};
 
/** Headline container styles */
const HEADLINE_CONTAINER_SX: SxProps<Theme> = {
    p: { xs: 2, md: 4 },
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    minHeight: { xs: 'auto', md: '280px' },
};
 
/** Headline text styles */
const HEADLINE_TEXT_SX: SxProps<Theme> = {
    color: 'white',
    fontWeight: 600,
    lineHeight: 1.3,
    textAlign: 'center',
};
 
/** Grid container styles */
const GRID_SX: SxProps<Theme> = {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', md: '1fr 2fr 1fr' }, // Middle column wider
    width: '100%',
    alignItems: 'stretch',
    gap: { xs: 2, md: 0 },
};
 
/** Card styles */
const CARD_SX: SxProps<Theme> = {
    p: 3,
    height: '100%',
    minHeight: { xs: '200px', md: '300px' },
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative',
};
 
/** Card number text styles */
const CARD_NUMBER_SX: SxProps<Theme> = {
    color: 'text.primary',
};
 
/** Card content text styles */
const CARD_TEXT_SX: SxProps<Theme> = {
    color: 'white',
    fontSize: { xs: '18px', md: '24px' },
    mt: 'auto',
};
 
/** Image card container styles */
const IMAGE_CARD_SX: SxProps<Theme> = {
    ...CARD_SX,
    p: 0,
    overflow: 'hidden',
    backgroundColor: 'black',
    minHeight: { xs: '300px', md: '450px' },
};
 
/** Image number container styles */
const IMAGE_NUMBER_CONTAINER_SX: SxProps<Theme> = {
    position: 'absolute',
    top: 24,
    left: 24,
    zIndex: 2,
};
 
/** Image wrapper styles */
const IMAGE_WRAPPER_SX: SxProps<Theme> = {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& img': {
        objectFit: 'contain',
        maxWidth: '100%',
        maxHeight: '100%',
    },
};
 
/** Bottom button container styles */
const BUTTON_CONTAINER_SX: SxProps<Theme> = {
    p: { xs: 2, md: 4 },
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: { xs: '100px', md: '156px' },
};
 
 
/** Bottom section wrapper styles */
const BOTTOM_SECTION_WRAPPER_SX: SxProps<Theme> = {
    width: '100%',
};
 
// =============================================================================
// Main Component
// =============================================================================
 
function DigitalAssetInvestment(): React.JSX.Element {
    return (
        <Box sx={SECTION_SX}>
            {/* Headline */}
            <Box sx={HEADLINE_SX}>
                <CornerContainer
                    sx={HEADLINE_CONTAINER_SX}
                    showBorder
                    height="auto"
                >
                    <AtomTypography variant="h1" sx={HEADLINE_TEXT_SX}>
                        YLDZ is Constrained by Access to Energy &<br />
                        Compute Unlike any other Yield Generation
                    </AtomTypography>
                </CornerContainer>
            </Box>
 
            {/* 3 Column Grid */}
            <Box sx={GRID_SX}>
                {/* Card 01 */}
                <CornerContainer sx={CARD_SX} showBorder >
                    <AtomTypography variant="h5" sx={CARD_NUMBER_SX}>
                        01
                    </AtomTypography>
                    <AtomTypography variant="h5" sx={CARD_TEXT_SX}>
                        Hurry & reserve your Yield <br /> tokens that are truly <br />limited
                    </AtomTypography>
                </CornerContainer>
 
                {/* Card 02 - Image */}
                <CornerContainer
                    sx={IMAGE_CARD_SX}
                    showBorder
                >
                    <Box sx={IMAGE_NUMBER_CONTAINER_SX}>
                        <AtomTypography variant="h5" sx={CARD_NUMBER_SX}>
                            02
                        </AtomTypography>
                    </Box>
                    <Box sx={IMAGE_WRAPPER_SX}>
                        <Image
                            src="/assets/backgrounds/yldz-no-bg.png"
                            alt="Yieldz Container"
                            width={700}
                            height={400}
                        />
                    </Box>
                </CornerContainer>
 
                {/* Card 03 */}
                <CornerContainer sx={CARD_SX} showBorder>
                    <AtomTypography variant="h5" sx={CARD_NUMBER_SX}>
                        03
                    </AtomTypography>
                    <AtomTypography variant="h5" sx={CARD_TEXT_SX}>
                        Per $10M of YLDZ = Full <br /> container of yield Production
                    </AtomTypography>
                </CornerContainer>
            </Box>
 
            {/* Bottom Button Section */}
            <Box sx={BOTTOM_SECTION_WRAPPER_SX}>
                <CornerContainer
                    sx={BUTTON_CONTAINER_SX}
                    showBorder
                    height="auto"
                >
                    <AtomButton
                        id="reserve-yield"
                        variant="contained"
                        color="primary"
                        size="large"
                        label="Reserve your “ROC” tax deferred YLDZ Now"
                    />
                </CornerContainer>
            </Box>
        </Box >
    );
}
 
export default memo(DigitalAssetInvestment);