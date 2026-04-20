'use client';

import {
  SECTION_HEADER_SX,
  type FeaturedToken,
} from '@/constants/token-explorer';
import { Box, type SxProps, type Theme } from '@mui/material';
import * as React from 'react';
import { memo } from 'react';

import AtomTypography from '@/components/atoms/typography';
import FeaturedTokenCard from '@/components/molecules/featured-token-card';
import BenefitsSection from '@/components/sections/benefits-section';
import DigitalAssetInvestment from '@/components/sections/digital-asset-investment';
import ExpertsSection, { type Expert } from '@/components/sections/experts-section';
import Footer from '@/components/sections/footer';
import Header from '@/components/sections/header';
import HeroSection from '@/components/sections/hero-section';
import InfiniteSection from '@/components/sections/infinite-section';
import LearnEarnGrowSection, { type LearnEarnGrowCard } from '@/components/sections/learn-earn-grow-section';
import MoneyCalculatorSection from '@/components/sections/money-calculator-section';
import PromotionalBannerSection from '@/components/sections/promotional-banner-section';
import ReturnCapitalDistributionSection from '@/components/sections/return-capital-distribution';
import RiskTakerSection from '@/components/sections/risk-taker-section';
import SubHeroSection from '@/components/sections/sub-hero-section';
import TokenizationPlatformSection from '@/components/sections/tokenization-platform-section';
import TokenizationSliderSection from '@/components/sections/tokenization-slider-section';
import YieldAssetsSection from '@/components/sections/yield-assets-section';
import YieldComparisonSection from '@/components/sections/yield-comparison-section';
import YieldTypesSection from '@/components/sections/yield-types-section';
import CompoundInterestSection from '@/components/sections/compound-interest-section';
import ChartImageSection from '@/components/sections/chart-image-section';

export interface StatCardData {
  id: string;
  title: string;
  subtitle?: string;
  value: string;
  valueType: 'text' | 'logo' | 'percentage';
  icon?: string;
  isLogo?: boolean;
  backgroundImage?: string;
}

/**
 * Section container styles
 */
const SECTION_SX: SxProps<Theme> = {
  width: '100%',
  backgroundColor: 'background.default',
  p: { xs: 2, md: 5 },
};

/**
 * Main container - with top padding for spacing
 */
const CONTAINER_SX: SxProps<Theme> = {
  pt: { xs: 3, md: 4 },
  pb: { xs: 3, md: 4 },
  border: '0px',
};

/**
 * Featured Tokens Grid Styles
 * 4 columns on desktop for landing page
 */
const FEATURED_GRID_SX: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
  gap: 2,
};

/**
 * Featured Tokens Section Props
 */
interface FeaturedTokensSectionProps {
  tokens: readonly FeaturedToken[];
}

/**
 * Featured Tokens Section
 * Displays grid of featured token cards
 * Accepts tokens as props for dynamic data handling
 */
const FeaturedTokensSection = memo(function FeaturedTokensSection({ tokens }: Readonly<FeaturedTokensSectionProps>) {
  return (
    <Box sx={SECTION_SX}>
      {/* <CornerContainer sx={CONTAINER_SX}> */}
      <Box sx={SECTION_HEADER_SX}>
        <AtomTypography variant="h4" color="text.primary">
          Featured Tokens
        </AtomTypography>
      </Box>
      <Box sx={FEATURED_GRID_SX}>
        {tokens.map((token) => (
          <FeaturedTokenCard key={token.id} token={token} badgeType="simple" />
        ))}
      </Box>
      {/* </CornerContainer> */}
    </Box>
  );
});

export default function Page(): React.JSX.Element {
  // Experts data
  const EXPERTS_DATA: Expert[] = [
    {
      id: 'expert-1',
      name: 'Justin Walton',
      title: 'CEO - YIELDZ HOLDINGS',
      imageSrc: '/assets/persons/justing.svg',
    },
    {
      id: 'expert-2',
      name: 'Dan Thompson',
      title: 'CEO - YIELDZ LIFE',
      imageSrc: '/assets/persons/dan.svg',
    },
    {
      id: 'expert-3',
      name: 'Emerson Walton',
      title: 'COO - YIELDZ SECURITIES',
      imageSrc: '/assets/persons/emerson.svg',
    },
    {
      id: 'expert-4',
      name: 'Logan Harris',
      title: 'COMPLIANCE OFFICER - YIELDZ SECURITIES',
      imageSrc: '/assets/persons/logan.svg',
    },
    {
      id: 'expert-5',
      name: 'Ethan Walton',
      title: 'CTO - YIELDZ HOLDINGS',
      imageSrc: '/assets/persons/ethan.svg',
    },
    {
      id: 'expert-6',
      name: 'Justin Walton',
      title: 'CEO - YIELDZ HOLDINGS',
      imageSrc: '/assets/persons/justing.svg',
    },
    {
      id: 'expert-7',
      name: 'Steve Harper',
      title: 'REGULATORY ADVISOR',
      imageSrc: '/assets/persons/steve.svg',
    },
    {
      id: 'expert-8',
      name: 'Andrea Perlak',
      title: 'CFO',
      imageSrc: '/assets/persons/andrea.svg',
    },
  ];

  // Data
  const STAT_CARDS: StatCardData[] = [
    {
      id: 'hpc-produced',
      title: 'Yield Produced by HPC \n (high performance compute)',
      subtitle: 'Containerized hashing\n data centers',
      value: '',
      valueType: 'logo',
      isLogo: true,
      backgroundImage: '/assets/backgrounds/cardBg.svg',
    },
    {
      id: 'real-world-asset',
      title: 'YLDZ is a\n Real world asset ',
      subtitle: '(RWA) Backed Powered data center\n Digital asset Token',
      value: '$1 PEG',
      valueType: 'text',
    },
    {
      id: 'rwa-yield',
      title: 'Real world asset\n (RWA) backed Yield',
      value: '15.04%',
      valueType: 'percentage',
      isLogo: true,
    },
  ];

  const STAT_CARDS1: StatCardData[] = [
    {
      id: 'hpc-produced',
      title: 'YLDZ Is a digital\nasset $1 peg Token',
      subtitle: '',
      value: '',
      valueType: 'logo',
      isLogo: true,
      backgroundImage: '/assets/backgrounds/feature-bg.png',
    },
    {
      id: 'real-world-asset',
      title: 'YYLDZ is a Real world\n asset (RWA) Backed\n Powered data center',
      subtitle: 'Transforms electricity into  Compute power',
      value: 'POWER',
      valueType: 'text',
    },
    {
      id: 'rwa-yield',
      title: 'ETHICALLY NEUTRAL',
      subtitle: 'No humans were diluted or debased in the\n Production of this Yield',
      value: 'Yield',
      valueType: 'text',
      isLogo: true,
    },
  ];

  // Learn Earn Grow Section Cards Data
  const LEARN_EARN_GROW_CARDS: LearnEarnGrowCard[] = [
    {
      id: 'card-1',
      type: 'content',
      title: 'Bitcoin Refinery',
      mainText: 'YOUR OWN BITCOIN REFINERY AT YIELDZ',
      subText: 'WHERE YOUR BITCOIN IS REFINED INTO STEADY YIELD COMPOUNDING',
      footerTitle: 'Derivative Mining™ Explained: A Smarter Path to BTC Yield',
      footerDate: '14.11.2025',
      footerAuthor: 'Justin Walton',
    },
    {
      id: 'card-2',
      type: 'event',
      title: 'Token2049 Event',
      date: '24TH MAY',
      time: '09:30 AM.',
      location: 'LOS ANGELES, CALIFORNIA',
      eventName: 'ON CRYPTO SUMMIT',
      eventLogo: 'TOKEN 2049',
      footerTitle: 'Derivative Mining™ Explained: A Smarter Path to BTC Yield',
      footerDate: '14.11.2025',
      footerAuthor: 'Justin Walton',
    },
    {
      id: 'card-3',
      type: 'content',
      title: 'Bitcoin Refinery',
      mainText: 'YOUR OWN BITCOIN REFINERY AT YIELDZ',
      subText: 'WHERE YOUR BITCOIN IS REFINED INTO STEADY YIELD COMPOUNDING',
      footerTitle: 'Derivative Mining™ Explained: A Smarter Path to BTC Yield',
      footerDate: '14.11.2025',
      footerAuthor: 'Justin Walton',
    },
    {
      id: 'card-4',
      type: 'event',
      title: 'Token2049 Event',
      date: '24TH MAY',
      time: '09:30 AM.',
      location: 'LOS ANGELES, CALIFORNIA',
      eventName: 'ON CRYPTO SUMMIT',
      eventLogo: 'TOKEN 2049',
      footerTitle: 'Derivative Mining™ Explained: A Smarter Path to BTC Yield',
      footerDate: '14.11.2025',
      footerAuthor: 'Justin Walton',
    },
    {
      id: 'card-5',
      type: 'content',
      title: 'Bitcoin Refinery',
      mainText: 'YOUR OWN BITCOIN REFINERY AT YIELDZ',
      subText: 'WHERE YOUR BITCOIN IS REFINED INTO STEADY YIELD COMPOUNDING',
      footerTitle: 'Derivative Mining™ Explained: A Smarter Path to BTC Yield',
      footerDate: '14.11.2025',
      footerAuthor: 'Justin Walton',
    },
    {
      id: 'card-6',
      type: 'event',
      title: 'Token2049 Event',
      date: '24TH MAY',
      time: '09:30 AM.',
      location: 'LOS ANGELES, CALIFORNIA',
      eventName: 'ON CRYPTO SUMMIT',
      eventLogo: 'TOKEN 2049',
      footerTitle: 'Derivative Mining™ Explained: A Smarter Path to BTC Yield',
      footerDate: '14.11.2025',
      footerAuthor: 'Justin Walton',
    },
    {
      id: 'card-7',
      type: 'content',
      title: 'Bitcoin Refinery',
      mainText: 'YOUR OWN BITCOIN REFINERY AT YIELDZ',
      subText: 'WHERE YOUR BITCOIN IS REFINED INTO STEADY YIELD COMPOUNDING',
      footerTitle: 'Derivative Mining™ Explained: A Smarter Path to BTC Yield',
      footerDate: '14.11.2025',
      footerAuthor: 'Justin Walton',
    },
    {
      id: 'card-8',
      type: 'event',
      title: 'Token2049 Event',
      date: '24TH MAY',
      time: '09:30 AM.',
      location: 'LOS ANGELES, CALIFORNIA',
      eventName: 'ON CRYPTO SUMMIT',
      eventLogo: 'TOKEN 2049',
      footerTitle: 'Derivative Mining™ Explained: A Smarter Path to BTC Yield',
      footerDate: '14.11.2025',
      footerAuthor: 'Justin Walton',
    },
    {
      id: 'card-9',
      type: 'content',
      title: 'Bitcoin Refinery',
      mainText: 'YOUR OWN BITCOIN REFINERY AT YIELDZ',
      subText: 'WHERE YOUR BITCOIN IS REFINED INTO STEADY YIELD COMPOUNDING',
      footerTitle: 'Derivative Mining™ Explained: A Smarter Path to BTC Yield',
      footerDate: '14.11.2025',
      footerAuthor: 'Justin Walton',
    },
    {
      id: 'card-10',
      type: 'event',
      title: 'Token2049 Event',
      date: '24TH MAY',
      time: '09:30 AM.',
      location: 'LOS ANGELES, CALIFORNIA',
      eventName: 'ON CRYPTO SUMMIT',
      eventLogo: 'TOKEN 2049',
      footerTitle: 'Derivative Mining™ Explained: A Smarter Path to BTC Yield',
      footerDate: '14.11.2025',
      footerAuthor: 'Justin Walton',
    },
    {
      id: 'card-11',
      type: 'content',
      title: 'Bitcoin Refinery',
      mainText: 'YOUR OWN BITCOIN REFINERY AT YIELDZ',
      subText: 'WHERE YOUR BITCOIN IS REFINED INTO STEADY YIELD COMPOUNDING',
      footerTitle: 'Derivative Mining™ Explained: A Smarter Path to BTC Yield',
      footerDate: '14.11.2025',
      footerAuthor: 'Justin Walton',
    },
    {
      id: 'card-12',
      type: 'event',
      title: 'Token2049 Event',
      date: '24TH MAY',
      time: '09:30 AM.',
      location: 'LOS ANGELES, CALIFORNIA',
      eventName: 'ON CRYPTO SUMMIT',
      eventLogo: 'TOKEN 2049',
      footerTitle: 'Derivative Mining™ Explained: A Smarter Path to BTC Yield',
      footerDate: '14.11.2025',
      footerAuthor: 'Justin Walton',
    },
  ];

  return (
    <>
      <Header transparent />
      <HeroSection /> {/* section 1 */}
      <CompoundInterestSection />{/* section 2 */} {/* Done */}
      <SubHeroSection /> {/* section 3 */} {/* Done */}
      <YieldComparisonSection /> {/* section 4 */} {/* Done */}
      <MoneyCalculatorSection /> {/* section 5 */} {/* Done */}
      <YieldAssetsSection /> {/* section 6 */} {/* Done */}
      <ReturnCapitalDistributionSection /> {/* section 7 */} {/* Done */}
      <YieldTypesSection /> {/* section 8 */} {/* Done */}
      <RiskTakerSection /> {/* section 9 */}
      <ChartImageSection />
      <BenefitsSection /> {/* section 10 */}
      <InfiniteSection IMAGE_SRC="/assets/backgrounds/yldzs-infinite.png" STAT_CARDS={STAT_CARDS} isImage={false} /> {/* section 11 */}
      <InfiniteSection IMAGE_SRC="/assets/backgrounds/yldz-no-bg.png" STAT_CARDS={STAT_CARDS1} isImage={true} /> {/* section 12 */}
      <DigitalAssetInvestment /> {/* section 13 */}
      <TokenizationPlatformSection /> {/* section 14 */}
      <PromotionalBannerSection /> {/* section 15 */}
      <TokenizationSliderSection /> {/* section 16 */}
      <ExpertsSection experts={EXPERTS_DATA} /> {/* section 17 */}
      <LearnEarnGrowSection cards={LEARN_EARN_GROW_CARDS} itemsPerView={3} /> {/* section 18 */}
      {/* <YieldzExperienceSection /> */}
      {/* <FeaturedTokensSection tokens={[...FEATURED_TOKENS, ...FEATURED_TOKENS_DATA]} /> */}
      <Footer /> {/* section 19 */}
    </>
  );
}
