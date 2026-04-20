'use client';

import { Box } from '@mui/material';
import Image from 'next/image';
import AtomTypography from '@/components/atoms/typography';
import CornerContainer from '@/components/atoms/corner-container';
import { BackgroundVideoContainer } from '@/components/atoms/video/background-container';
import { AtomButton } from '@/components/atoms/button';

const DASHBOARD_PREVIEW_VIDEO_SRC = '/assets/videos/split-bg.mp4';

const StatsFooter = ({ stats }: { stats: { label: string; value: string }[] }) => (
    <CornerContainer
        outerSx={{ bgcolor: 'transparent' }}
        sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            bgcolor: 'rgba(0,0,0,0.4)',
            mt: 'auto'
        }}
    >
        {stats.map((stat, i) => (
            <Box key={i} sx={{
                p: 1.5,
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
            }}>
                <AtomTypography variant="caption" sx={{ color: 'text.secondary', fontSize: '8px', textTransform: 'uppercase' }}>
                    {stat.label}
                </AtomTypography>
                <AtomTypography variant="caption" sx={{ color: 'white', fontSize: '10px', fontWeight: 500 }}>
                    {stat.value}
                </AtomTypography>
            </Box>
        ))}
    </CornerContainer>
);

export default function DashboardPreview() {
    const commonStats = [
        { label: 'LABEL', value: '0.00 VAL' },
        { label: 'FLEET EFFICIENCY', value: '0.00%' },
        { label: 'LABEL', value: '0.00 VAL' },
        { label: 'FLEET EFFICIENCY', value: '0.00%' },
    ];

    return (
        <Box
            sx={{
                width: '55%',
                height: '100%',
                borderRadius: '16px',
                backdropFilter: 'blur(20px)',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Dashboard Header */}
            <CornerContainer height={'fit-content'} sx={{ p: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <AtomTypography variant="body4" fontType="tickerbit" sx={{ color: 'primary.main' }}>
                        YIELDZ
                    </AtomTypography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
                        <AtomTypography variant="caption" sx={{ color: 'primary.main', cursor: 'pointer' }}>Home</AtomTypography>
                        <AtomTypography variant="caption" sx={{ color: 'text.secondary', cursor: 'pointer' }}>Tokens</AtomTypography>
                        <AtomTypography variant="caption" sx={{ color: 'text.secondary', cursor: 'pointer' }}>Portfolio</AtomTypography>
                    </Box>
                </Box>
                <AtomTypography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
                    [ FRANK@HERBERT.COM ]
                </AtomTypography>
            </CornerContainer>

            {/* Dashboard Content Grid */}

            {/* Top Row Grid */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, mt: 1, gap: 1 }}>
                {/* Left Column */}
                <BackgroundVideoContainer src={DASHBOARD_PREVIEW_VIDEO_SRC} sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%', justifyContent: 'space-between' }}>
                        {/* KYC Card */}
                        <CornerContainer
                            height={'fit-content'}
                            sx={{ p: 1, backgroundImage: 'url(/assets/backgrounds/cardBg.svg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
                                <AtomTypography variant="caption" >
                                    Complete KYC
                                </AtomTypography>

                                <AtomButton
                                    id="accreditation-cancel-button"
                                    label="Complete KYC"
                                    variant="transparent"
                                    size="medium"
                                />
                            </Box>
                            <AtomTypography variant="label1" component="p" sx={{ color: 'text.secondary', lineHeight: '1.5', my: 1 }}>
                                Lorem ipsum dolor sit amet consectetur. <br /> Nulla sodales enim imperdiet sed <br /> elementum pulvinar tristique curabitur.
                            </AtomTypography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{
                                    flex: 1,
                                    height: '14px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    display: 'flex',
                                    gap: '1px',
                                }}>
                                    {Array.from({ length: 50 }).map((_, i) => (
                                        <Box
                                            key={i}
                                            sx={{
                                                flex: 1,
                                                bgcolor: i < 13 ? 'white' : 'transparent',
                                                borderRight: '1px solid rgba(255,255,255,0.05)',
                                            }}
                                        />
                                    ))}
                                </Box>
                                <AtomTypography variant="caption" sx={{ color: 'text.secondary' }}>
                                    STEP 1 OF 3
                                </AtomTypography>
                            </Box>
                        </CornerContainer>

                        {/* My YIELDZ Card */}
                        <Box sx={{ p: 2, backdropFilter: 'blur(10px)' }}>
                            <AtomTypography variant="caption" sx={{ color: 'text.secondary', mb: 1, display: 'block' }}>
                                My <Box component="span" sx={{ color: 'primary.main' }}>YIELDZ</Box>
                            </AtomTypography>
                            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                                <AtomTypography variant="h3" fontType="tickerbit" sx={{ color: 'white', opacity: 0.5 }}>
                                    22.54%
                                </AtomTypography>
                                <AtomTypography variant="caption" sx={{ color: 'text.secondary' }}>
                                    APY
                                </AtomTypography>
                            </Box>
                            <hr />
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', justifyContent: 'space-between', mt: 2, pt: 2 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
                                    <AtomTypography variant="label1" sx={{ color: 'text.secondary' }}>
                                        label
                                    </AtomTypography>
                                    <AtomTypography variant="label1" sx={{ color: 'text.secondary' }}>
                                        0.00 val
                                    </AtomTypography>
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
                                    <AtomTypography variant="label1" sx={{ color: 'text.secondary' }}>
                                        Fleet Efficiency
                                    </AtomTypography>
                                    <AtomTypography variant="label1" sx={{ color: 'text.secondary' }}>
                                        0.00%
                                    </AtomTypography>
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
                                    <AtomTypography variant="label1" sx={{ color: 'text.secondary' }}>
                                        label
                                    </AtomTypography>
                                    <AtomTypography variant="label1" sx={{ color: 'text.secondary' }}>
                                        0.00 val
                                    </AtomTypography>
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
                                    <AtomTypography variant="label1" sx={{ color: 'text.secondary' }}>
                                        Fleet Efficiency
                                    </AtomTypography>
                                    <AtomTypography variant="label1" sx={{ color: 'text.secondary' }}>
                                        0.00%
                                    </AtomTypography>
                                </Box>
                            </Box>
                        </Box>
                    </Box >
                </BackgroundVideoContainer >

                {/* Right Column */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {/* Holdings Card */}
                    <Box height="auto" sx={{ display: 'flex', flexDirection: 'column', backgroundImage: 'url(/assets/backgrounds/cardBg.svg)', backgroundSize: 'cover' }}>
                        <CornerContainer outerSx={{ bgcolor: 'transparent' }} sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1, bgcolor: 'transparent' }}>
                            <AtomTypography variant="h6" fontType="tickerbit" sx={{ color: 'primary.main', }}>
                                YIELDZ
                            </AtomTypography>
                            <AtomTypography variant="caption" sx={{ color: 'text.secondary', fontSize: '10px' }}>
                                Holdings Inc.
                            </AtomTypography>

                            <AtomTypography variant="caption" sx={{ color: 'text.secondary', fontSize: '10px' }}>
                                COST TO MINE 1 BTC
                            </AtomTypography>
                            <AtomTypography variant="h4" sx={{ color: 'white' }}>
                                $33,384
                            </AtomTypography>
                        </CornerContainer>
                        <StatsFooter stats={commonStats} />
                    </Box>

                    {/* Token Card */}
                    <Box height="auto" sx={{ display: 'flex', flexDirection: 'column', backgroundImage: 'url(/assets/backgrounds/cardBg.svg)', backgroundSize: 'cover' }}>
                        <CornerContainer outerSx={{ bgcolor: 'transparent' }} sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1, bgcolor: 'transparent' }}>
                            <AtomTypography variant="h6" fontType="tickerbit" sx={{ color: 'primary.main', }}>
                                YIELDZ
                            </AtomTypography>
                            <AtomTypography variant="label1" sx={{ color: 'text.secondary' }}>
                                Token
                            </AtomTypography>


                            <AtomTypography variant="label1" sx={{ color: 'text.secondary' }}>
                                42.54%
                            </AtomTypography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <AtomTypography variant="h4">
                                    42.54%
                                </AtomTypography>
                                <Box component="span" >⚡</Box>
                            </Box>

                        </CornerContainer>
                        <StatsFooter stats={commonStats} />
                    </Box>
                </Box>

            </Box>
            {/* Bottom Section */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 1, alignItems: 'stretch' }}>
                {/* Left Column - Large Image */}
                <Box sx={{ position: 'relative', width: '100%', minHeight: '400px' }}>
                    <Image
                        src="/assets/persons/rightslider_person_image.png"
                        alt="person-large"
                        fill
                        style={{ borderRadius: '8px', objectFit: 'cover' }}
                    />
                </Box>

                {/* Right Column - Chart and Small Images */}
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    {/* Top - Chart Image */}
                    <CornerContainer >
                        <Box sx={{ position: 'relative', width: '100%', height: '200px' }}>
                            <Image
                                src="/assets/images/chartImage.png"
                                alt="person-small-1"
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </Box>
                    </CornerContainer>

                    {/* Bottom - Two Small Images */}
                    <CornerContainer sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                        <Box sx={{ position: 'relative', width: '100%', height: '200px' }}>
                            <Image
                                src="/assets/persons/person_image_and_bg.png"
                                alt="person-small-1"
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </Box>
                        <Box sx={{ position: 'relative', width: '100%', height: '200px' }}>
                            <Image
                                src="/assets/persons/person_image_and_bg.png"
                                alt="person-small-2"
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </Box>
                    </CornerContainer>
                </Box>
            </Box>
        </Box >
    );
}
