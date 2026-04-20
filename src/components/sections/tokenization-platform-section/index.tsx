'use client';
 
/**
 * TokenizationPlatformSection Component
 * ======================================
 * Displays the Yieldz tokenization platform message with girl person image.
 *
 * Layout:
 * - Left: Headline text with logo watermark and bottom text rows
 * - Right: Girl person image with phone
 */
import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { motion } from 'motion/react';
import Image from 'next/image';
import { memo } from 'react';
 
import CornerContainer from '@/components/atoms/corner-container';
import AtomTypography from '@/components/atoms/typography';
 
// Constants
// =============================================================================
 
/** Section container styles */
const SECTION_SX: SxProps<Theme> = {
    width: '100%',
    minHeight: '100vh',
    backgroundColor: 'background.default',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    p: { xs: 2, sm: 3, md: 4, lg: 5 },
};
 
/** Main content grid */
const CONTENT_GRID_SX: SxProps<Theme> = {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
    gap: 1,
    width: '100%',
};
 
/** Left panel styles */
const LEFT_PANEL_SX: SxProps<Theme> = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 5,
    p: { xs: 2, sm: 3, md: 5 },
    height: '100%',
    minHeight: { xs: '70vh', lg: '100vh' },
    position: 'relative',
    overflow: 'hidden',
    backgroundImage: 'url(/assets/backgrounds/chart-bg2.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
};
 
/** Right panel styles */
const RIGHT_PANEL_SX: SxProps<Theme> = {
    p: 0,
    height: '100%',
    minHeight: { xs: '70vh', lg: '100vh' },
    position: 'relative',
    overflow: 'hidden',
};
 
 
/** Headline container styles */
const HEADLINE_CONTAINER_SX: SxProps<Theme> = {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    alignItems: 'center',
    color: 'text.primary',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 1,
    textAlign: 'center',
};
 
/** Headline text styles */
const HEADLINE_TEXT_SX: SxProps<Theme> = {
    fontWeight: '600',
    textAlign: 'center',
};
 
/** Bottom text container styles */
const BOTTOM_TEXT_CONTAINER_SX: SxProps<Theme> = {
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    position: 'relative',
    zIndex: 1,
    width: { xs: '100%', sm: '80%', md: '60%' },
    margin: '0 auto',
};
 
/** Bottom text row styles */
const BOTTOM_TEXT_ROW_SX: SxProps<Theme> = {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: { xs: 0.5, sm: 1, md: 2 },
};
 
/** Bottom text item styles */
const BOTTOM_TEXT_ITEM_SX: SxProps<Theme> = {
    color: 'text.primary',
    textAlign: 'center',
};
 
/** Bottom text item secondary styles */
const BOTTOM_TEXT_ITEM_SECONDARY_SX: SxProps<Theme> = {
    color: 'text.primary',
    textAlign: 'center',
 
};
 
// =============================================================================
// Main Component
// =============================================================================
 
function TokenizationPlatformSection(): React.JSX.Element {
    return (
        <Box sx={SECTION_SX}>
            <Box sx={CONTENT_GRID_SX}>
                {/* Left Panel - Content */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    style={{ height: '100%' }}
                >
                    <CornerContainer sx={LEFT_PANEL_SX} showBorder>
                        {/* Headline */}
                        <Box sx={HEADLINE_CONTAINER_SX}>
                            <AtomTypography variant="display4" sx={HEADLINE_TEXT_SX}>
                                ALL OFFERED ON THE
                            </AtomTypography>
                            <AtomTypography variant="display4" color="primary.main" fontType="tickerbit" sx={HEADLINE_TEXT_SX}>
                                YIELDZ TOKENIZATION
                            </AtomTypography>
                            <AtomTypography variant="display4" sx={HEADLINE_TEXT_SX}>
                                PLATFORM
                            </AtomTypography>
                        </Box>
                        {/* Watermark Logo */}
 
                        <Image height={320} width={320} src="/assets/icons/Yicon.svg" alt="Yieldz" />
 
                        {/* Bottom Text */}
                        <Box sx={BOTTOM_TEXT_CONTAINER_SX}>
                            <Box sx={BOTTOM_TEXT_ROW_SX}>
                                {'PRIVATE INVESTMENT IS NO LONGER'.split(' ').map((text, index) => (
                                    <AtomTypography
                                        key={`private-${text}-${index}`}
                                        variant="body1"
                                        sx={BOTTOM_TEXT_ITEM_SX}
                                    >
                                        {text}
                                    </AtomTypography>
                                ))}
                            </Box>
                            <Box sx={BOTTOM_TEXT_ROW_SX}>
                                {'RESERVED JUST FOR THE WEALTHY'.split(' ').map((text, index) => (
                                    <AtomTypography
                                        key={`reserved-${text}-${index}`}
                                        variant="body1"
                                        sx={BOTTOM_TEXT_ITEM_SECONDARY_SX}
                                    >
                                        {text}
                                    </AtomTypography>
                                ))}
                            </Box>
                        </Box>
                    </CornerContainer>
                </motion.div>
 
                {/* Right Panel - Girl Person Image */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                    style={{ height: '100%' }}
                >
                    <CornerContainer sx={RIGHT_PANEL_SX} showBorder>
                        {/* Girl Person Image */}
                        <Image
                            src="/assets/persons/girl_person.png"
                            alt="Yieldz Platform User"
                            fill
                            style={{ objectFit: 'cover', objectPosition: 'center top' }}
                        />
                    </CornerContainer>
                </motion.div>
            </Box>
        </Box>
    );
}
 
export default memo(TokenizationPlatformSection);