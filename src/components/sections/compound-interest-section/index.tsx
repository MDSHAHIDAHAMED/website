'use client';

import { Box, Stack } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { motion } from 'motion/react';
import { memo } from 'react';

import AtomTypography from '@/components/atoms/typography';
import { yieldzBase, yieldzPrimary } from '@/styles/theme/colors';

// =============================================================================
// Constants
// =============================================================================

const SECTION_SX: SxProps<Theme> = {
    width: '100%',
    backgroundColor: yieldzBase.black,
    py: { xs: 10, md: 15 },
    px: { xs: 4, md: 8 },
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '44vh',
    overflow: 'hidden',
    gap: 10,
};

const QUOTE_CONTAINER_SX: SxProps<Theme> = {
    maxWidth: '870px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
};

const QUOTE_LINE_SX: SxProps<Theme> = {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    mb: 1,
    flexWrap: { xs: 'wrap', md: 'nowrap' },
    gap: { xs: 1, md: 0 },
};

const QUOTE_LINE_3_SX: SxProps<Theme> = {
    ...QUOTE_LINE_SX,
    justifyContent: 'space-between',
    mx: 'auto',
};

const QUOTE_WORD_SX: SxProps<Theme> = {
    color: yieldzBase.white,
    wordBreak: 'break-word',
    fontWeight: '500',
};

const QUOTE_WORD_HIGHLIGHT_SX: SxProps<Theme> = {
    color: yieldzPrimary[500],
    wordBreak: 'break-word',
    fontWeight: '500',
};

const ATTRIBUTION_CONTAINER_SX: SxProps<Theme> = {
    display: 'flex',
    justifyContent: 'flex-end',
    mt: 4,
    width: '100%',
};



// =============================================================================
// Main Component
// =============================================================================

function CompoundInterestSection(): React.JSX.Element {
    const line1 = ['COMPOUND', 'INTEREST', 'IS', 'THE', 'EIGHTH', 'WONDER', 'OF'];
    const line2 = ['THE', 'WORLD.', 'HE', 'WHO', 'UNDERSTANDS', 'IT,', 'EARNS', 'IT;'];
    const line3 = ['HE', 'WHO', 'DOESN\'T,', 'PAYS', 'IT.'];

    return (
        <Box sx={SECTION_SX}>
            {/* Quote Section */}
            <Box sx={QUOTE_CONTAINER_SX}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    style={{ width: '100%' }}
                >
                    <Stack spacing={0} width="100%">
                        {/* Line 1 */}
                        <Box sx={QUOTE_LINE_SX}>
                            {line1.map((word, i) => (
                                <AtomTypography variant="h4" key={`line1-${word}-${i}`} sx={QUOTE_WORD_SX}>
                                    {word}
                                </AtomTypography>
                            ))}
                        </Box>
                        {/* Line 2 */}
                        <Box sx={QUOTE_LINE_SX}>
                            {line2.map((word, i) => (
                                <AtomTypography variant="h4" key={`line2-${word}-${i}`} sx={QUOTE_WORD_SX}>
                                    {word}
                                </AtomTypography>
                            ))}
                        </Box>
                        {/* Line 3 */}
                        <Box sx={QUOTE_LINE_3_SX}>
                            {line3.map((word, i) => (
                                <AtomTypography variant="h4" key={`line3-${word}-${i}`} sx={QUOTE_WORD_HIGHLIGHT_SX}>
                                    {word}
                                </AtomTypography>
                            ))}
                        </Box>
                    </Stack>

                    <Box sx={ATTRIBUTION_CONTAINER_SX}>
                        <AtomTypography
                            variant="subtitle2"
                        >
                            • Albert Einstein
                        </AtomTypography>
                    </Box>
                </motion.div>
            </Box>

        </Box>
    );
}

export default memo(CompoundInterestSection);
