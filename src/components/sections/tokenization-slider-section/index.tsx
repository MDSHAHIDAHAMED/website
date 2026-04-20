'use client';

import { Box, Stack } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { memo } from 'react';

import AtomButton from '@/components/atoms/button';
import CornerContainer from '@/components/atoms/corner-container';
import AtomTypography from '@/components/atoms/typography';

import TokenCard from './token-card';
import TokenCardDim from './token-card-dim';
import DashboardPreview from './dashboard-preview';
import { useRouter } from 'next/navigation';

// =============================================================================
// Constants & Styles
// =============================================================================

const SECTION_SX: SxProps<Theme> = {
    width: '100%',
    display: 'flex',
    px: { xs: 1, sm: 2, md: 3 },
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    py: { xs: 4, md: 8 },
};

const BACKGROUND_DECO_SX: SxProps<Theme> = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'url(/assets/backgrounds/chart-bg2.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    opacity: 0.3,
    zIndex: 0,
};

const SLIDER_CONTAINER_SX: SxProps<Theme> = {
    width: '100%',
    overflow: 'hidden',
};

const EMBLA_VIEWPORT_SX: SxProps<Theme> = {
    overflow: 'hidden',
};

const EMBLA_CONTAINER_SX: SxProps<Theme> = {
    display: 'flex',
};

const SLIDE_SX: SxProps<Theme> = {
    flex: { xs: '0 0 100%', md: '0 0 85%', lg: '0 0 75%' },
    minWidth: 0,
    p: { xs: 1 },
};

const CORNER_CONTAINER_SX: SxProps<Theme> = {
    p: { xs: 2, sm: 3, md: 4 },
    height: { xs: 'auto', md: '900px' },
    display: 'flex',
    flexDirection: 'column',
    gap: { xs: 4, md: 6 },
    position: 'relative',
};

const CONTENT_LAYOUT_SX: SxProps<Theme> = {
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    gap: { xs: 4, md: 2 },
    width: '100%',
    position: 'relative',
    height: '100%',
};

const HEADER_SX: SxProps<Theme> = {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 2,
};

const LEFT_CONTENT_SX: SxProps<Theme> = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'end',
    gap: { xs: 2, md: 4 },
    zIndex: 3,
    mt: { xs: 8, md: 0 },
};

const TYPOGRAPHY_H3_SX: SxProps<Theme> = {
    textTransform: 'uppercase',
};

const TYPOGRAPHY_H2_SX: SxProps<Theme> = {
    fontWeight: '600',
    whiteSpace: 'pre-line',
};

const TYPOGRAPHY_BODY_SX: SxProps<Theme> = {
    color: 'text.secondary',
    whiteSpace: 'pre-line',
};

const RIGHT_VISUAL_SX: SxProps<Theme> = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: { xs: 'center', md: 'flex-end' },
    width: '100%',
    zIndex: 1,
};

const CARD_STACK_SX: SxProps<Theme> = {
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    alignItems: 'flex-start',
    justifyContent: { xs: 'center', md: 'flex-end' },
    width: '100%',
    transform: { xs: 'scale(0.85)', sm: 'scale(0.95)', md: 'scale(1)' },
};

const BUTTON_SX: SxProps<Theme> = {
    width: { xs: '100%', sm: '200px' },
    alignSelf: 'flex-start',
};

// =============================================================================
// Data
// =============================================================================

const SLIDES_DATA = [
    {
        id: 1,
        title: "TOKENIZATION",
        headline: "Yieldz transforms Bitcoin\n income streams into\n beautifully engineered,\n limited-edition digital assets.",
        description: "Each token represents real financial utility — from monthly Bitcoin yield to fixed-term\n growth — all wrapped in a collectible, luxury-grade format that makes wealth\n management both intuitive and engaging.",
        buttonId: "sign-up-tokenization-1",
    },
    {
        id: 2,
        title: "Platform",
        headline: "Fully integrated,\n self-custodial wealth platform combining\n institutional security\n with concierge-level design.",
        description: "Each token represents real financial utility — from monthly Bitcoin yield to fixed-term\n growth — all wrapped in a collectible, luxury-grade format that makes wealth\n management both intuitive and engaging.",
        buttonId: "sign-up-tokenization-2",
    },

];

// =============================================================================
// Main Component
// =============================================================================

function TokenizationSliderSection(): React.JSX.Element {
    const [emblaRef] = useEmblaCarousel({ loop: true, align: 'start' });
    const router = useRouter();
    const handleSignUp = () => {
        router.push('/auth/custom/sign-options');
    };
    return (
        <Box sx={SECTION_SX}>
            {/* Background Decoration */}
            <Box sx={BACKGROUND_DECO_SX} />

            <Box sx={SLIDER_CONTAINER_SX}>
                <Box ref={emblaRef} sx={EMBLA_VIEWPORT_SX}>
                    <Box sx={EMBLA_CONTAINER_SX}>
                        {SLIDES_DATA.map((slide) => (
                            <Box key={slide.id} sx={SLIDE_SX}>
                                <CornerContainer height="auto" sx={CORNER_CONTAINER_SX}>
                                    <Box sx={CONTENT_LAYOUT_SX}>
                                        {/* Header (Absolute) */}
                                        {/* <Stack sx={HEADER_SX} direction="row" spacing={2} alignItems="center">
                                            <Image src="/assets/icons/Union.svg" alt="Icon" width={32} height={32} />
                                            <AtomTypography variant="h3" fontType="tickerbit" sx={TYPOGRAPHY_H3_SX}>
                                                {slide.title}
                                            </AtomTypography>
                                        </Stack> */}

                                        {/* Left Content */}
                                        {/* <Stack sx={LEFT_CONTENT_SX}>
                                            <AtomTypography variant="h2" sx={TYPOGRAPHY_H2_SX}>
                                                {slide.headline}
                                            </AtomTypography>

                                            <AtomTypography variant="body1" sx={TYPOGRAPHY_BODY_SX}>
                                                {slide.description}
                                            </AtomTypography>

                                            <AtomButton
                                                id={slide.buttonId}
                                                variant="contained"
                                                color="primary"
                                                size="large"
                                                label="SIGN UP"
                                                onClick={handleSignUp}
                                                sx={BUTTON_SX}
                                            />
                                        </Stack> */}

                                        {/* Right Visual: Conditional based on slide */}
                                        <Box sx={RIGHT_VISUAL_SX}>
                                            {slide.id === 1 ? (
                                                // Slide 1: Token Cards (keep as is)
                                                <>
                                                    <Box sx={CARD_STACK_SX}>
                                                        <TokenCardDim
                                                            name="YLDG Token"
                                                            description="Equity Based Investment token, a revolutionary investment opportunity designed to generate consistent returns based on Bitcoin's performance."
                                                            availability="Instant"
                                                            lockup="365 Days"
                                                            underlyingAsset="Bitcoin ASICS"
                                                            apy="42.85%"
                                                        />
                                                        <TokenCard
                                                            name="YLDG Token"
                                                            description="Equity Based Investment token, a revolutionary investment opportunity designed to generate consistent returns based on Bitcoin's performance."
                                                            availability="Instant"
                                                            lockup="365 Days"
                                                            underlyingAsset="Bitcoin ASICS"
                                                            apy="42.85%"
                                                        />
                                                    </Box>
                                                    <Box sx={CARD_STACK_SX}>
                                                        <TokenCardDim
                                                            name="YLDG Token"
                                                            description="Equity Based Investment token, a revolutionary investment opportunity designed to generate consistent returns based on Bitcoin's performance."
                                                            availability="Instant"
                                                            lockup="365 Days"
                                                            underlyingAsset="Bitcoin ASICS"
                                                            apy="42.85%"
                                                        />
                                                    </Box>
                                                </>
                                            ) : (
                                                // Slide 2: Dashboard Preview
                                                <DashboardPreview />
                                            )}
                                        </Box>
                                    </Box>
                                </CornerContainer>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default memo(TokenizationSliderSection);