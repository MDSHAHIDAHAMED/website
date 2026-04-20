'use client';

/**
 * Token Detail Page
 * =================
 * Dynamic route page displaying detailed information about the YLDZ token.
 *
 * Sections:
 * - Video Header: Background video with token info and back button
 * - Investor Pitch Deck: Video with description and market stats
 * - Price Chart: Interactive chart using TokenChartSection
 * - Market Details: Key market metrics grid
 *
 * @module app/dashboard/tokens/yldzs-token
 */
import CornerContainer from '@/components/atoms/corner-container';
import { BACKGROUND_VIDEO_SRC } from '@/constants';
import {
  YLDZS_COIN_DETAIL,
  YLDZS_INVESTOR_SECTION,
  YLDZS_MARKET_STATS,
  YLDZS_VIDEO_CARDS,
} from '@/constants/yldzs-token';
import { showErrorToast } from '@/utils/toast';
import { Box, Grid, Tooltip } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { memo, useCallback, useEffect } from 'react';

import { AtomButton } from '@/components/atoms/button';
import AtomTypography from '@/components/atoms/typography';
import BackgroundVideoContainer from '@/components/atoms/video/background-container';
import FundsDepositedSuccessDialog from '@/components/molecules/funds-deposited-success-dialog';
import TokenHeaderInfo from '@/components/molecules/token-header-info';
import VideoContentCard from '@/components/molecules/video-content-card';
import InvestmentSection from '@/components/sections/investment-section';
import MarketDetailsSection, { StaticMetricCard } from '@/components/sections/market-details-section';
import TokenChartSection from '@/components/sections/token-chart-section';
import YieldChartSection from '@/components/sections/yield-chart-section';
import { config } from '@/config';

// =============================================================================
// Constants & Styles
// =============================================================================

/** Main page container styles */
const PAGE_CONTAINER_SX: SxProps<Theme> = {
  width: '100%',
  minHeight: '100vh',
  position: 'relative',
};

/** Video container styles for the header section */
const VIDEO_CONTAINER_SX: SxProps<Theme> = {
  width: '100%',
  minHeight: '300px',
};

/** Header section content styles (overlay on video) */
const HEADER_CONTENT_SX: SxProps<Theme> = {
  width: '100%',
  height: '100%',
  p: { xs: 2, sm: 3, md: 4 },
};

/** Video source path */
const VIDEO_SRC = config.backgroundVids.boxexBg;

/** Investor section container styles - horizontal layout */
const INVESTOR_SECTION_CONTAINER_SX: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column', md: 'row' },
  minHeight: { xs: 'auto', md: 512 },
  width: "100%",
  alignItems: 'stretch',
};

/** Right container - market stats */
const RIGHT_CONTAINER_SX: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 0,
  height: '100%',
};

/** Video cards row container - 2 cards horizontally */
const VIDEO_CARDS_ROW_SX: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column', md: 'row' },
  width: '100%',
};

// =============================================================================
// Sub-Components
// =============================================================================

/**
 * Investor Pitch Deck Section Component
 * Displays video preview and description on left, market stats on right
 */
const InvestorPitchDeckSection = memo(function InvestorPitchDeckSection(): React.JSX.Element {
  return (
    <Box sx={INVESTOR_SECTION_CONTAINER_SX}>
      <VideoContentCard
        key={'yldzs-token-video'}
        videoSrc={BACKGROUND_VIDEO_SRC}
        overlayImageSrc={'/assets/persons/yldz-person.png'}
        overlayImageAlt={YLDZS_INVESTOR_SECTION.title}
        title={`${YLDZS_INVESTOR_SECTION.title}`}
        description={YLDZS_INVESTOR_SECTION.description}
        iconSrc={'/assets/icons/yldzs-token.svg'}
        showBorder={true}
        isVideoCard={true}
      />

      {/* Right Container: Market Stats */}
      <Box sx={{ ...RIGHT_CONTAINER_SX, border: 'none', width: '100%', height: '100%', margin: 'auto 0' }}>
        {YLDZS_MARKET_STATS.map((stat) => (
          <Box key={stat.id} sx={{ p: 2, width: '100%', height: '100%' }}>
            <StaticMetricCard metric={stat} isCenter={true} />
          </Box>
        ))}
      </Box>
    </Box>
  );
});

// =============================================================================
// Main Component
// =============================================================================

/**
 * Token Detail Page Component
 *
 * Dynamic route page that displays:
 * - Video header with token info
 * - Investor pitch deck section with market stats
 * - Price chart section
 * - Market details metrics
 * - Yield chart section
 *
 * @returns Token detail page JSX element
 */
function YLDZSTokenDetails(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = React.useState(false);
  const [isSuccessFromOnramper, setIsSuccessFromOnramper] = React.useState(false);
  const [isWithdrawalTransaction, setIsWithdrawalTransaction] = React.useState(false);

  /**
   * Ref to store the balance refetch function from InvestmentCard
   * This allows us to call it when the success dialog closes
   */
  const refetchBalanceRef = React.useRef<(() => void) | null>(null);

  /**
   * Handle Onramper callback - check for success parameter and show dialog
   * Sets flag to hide "View in Portfolio" button for onramper flow
   * 
   * IMPORTANT: The "View in Portfolio" button is ALWAYS hidden in onramper flow
   * by setting isSuccessFromOnramper = true
   */
  useEffect(() => {
    const success = searchParams.get('success');

    if (success === 'true') {
      // Explicitly set to true to ensure button is hidden in onramper flow
      setIsSuccessFromOnramper(true);
      setIsSuccessDialogOpen(true);

      // Get partnerContext from URL if available (for tracking)
      const partnerContext = searchParams.get('partnerContext');
      if (partnerContext) {
        console.debug('Onramper success - partnerContext:', partnerContext);
      }

      // Clean up URL by removing query parameters
      router.replace('/dashboard/tokens/yldzs-token', { scroll: false });
    } else if (success === 'false') {
      // Get error message from URL if available
      const errorMessage = searchParams.get('error') || searchParams.get('message');

      // Show error toast with custom message if available
      const toastMessage = errorMessage
        ? `Transaction failed: ${errorMessage}`
        : 'Transaction failed. Please try again or contact support if the issue persists.';

      showErrorToast(
        'onramper-transaction-failure',
        toastMessage,
        6000
      );

      // Get partnerContext from URL if available (for tracking)
      const partnerContext = searchParams.get('partnerContext');
      if (partnerContext) {
        console.debug('Onramper failure - partnerContext:', partnerContext);
      }

      // Clean up URL by removing query parameters
      router.replace('/dashboard/tokens/yldzs-token', { scroll: false });
    }
  }, [searchParams, router]);

  /**
   * Handle success dialog close
   * Resets both dialog open state and onramper flag
   * Also refetches balance to update the displayed balance (same as confirm-investment-dialog)
   */
  const handleSuccessDialogClose = useCallback(() => {
    setIsSuccessDialogOpen(false);
    setIsSuccessFromOnramper(false);
    setIsWithdrawalTransaction(false);

    // Refetch balance when dialog closes (same behavior as confirm-investment-dialog)
    // This ensures the balance is updated after funds are deposited
    if (refetchBalanceRef.current) {
      refetchBalanceRef.current();
    }
  }, []);

  /**
   * Handle investment success - opens success dialog with "View in Portfolio" button
   * Called after successful blockchain transaction in investment flow
   * 
   * IMPORTANT: The "View in Portfolio" button ALWAYS shows in investment flow
   * by setting isSuccessFromOnramper = false
   * 
   * @param isWithdrawal - Whether this is a withdrawal transaction (default: false)
   */
  const handleInvestmentSuccess = useCallback((isWithdrawal: boolean = false) => {
    // Explicitly set to false to ensure button shows in investment flow
    setIsSuccessFromOnramper(false);
    setIsWithdrawalTransaction(isWithdrawal);
    setIsSuccessDialogOpen(true);
  }, []);

  /**
   * Callback to register balance refetch function from InvestmentCard
   * This function is called by InvestmentCard to expose its refetch function
   */
  const handleRefetchBalanceRegister = useCallback((refetchFn: (() => void) | null) => {
    refetchBalanceRef.current = refetchFn;
  }, []);

  /**
   * Navigate back to tokens page
   */
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);
  /**
   * Open blockchain explorer URL in a new tab
   */
  const handleOpenExplorer = () => {
    window.open('https://etherscan.io', '_blank', 'noopener,noreferrer');
  };

  return (
    <Box sx={{ ...PAGE_CONTAINER_SX, bgcolor: 'background.default' }}>
      {/* Section 1: Video Header with Token Info */}
      <BackgroundVideoContainer src={VIDEO_SRC} sx={VIDEO_CONTAINER_SX}>
        <Box sx={HEADER_CONTENT_SX}>
          {/* Back Button */}
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <AtomButton
              id="back-button"
              label="Back"
              onClick={handleBack}
              startIcon={
                <Image
                  src="/assets/icons/right-scroll.png"
                  alt="Back"
                  width={16}
                  height={16}
                  style={{ transform: 'rotate(180deg)' }}
                />
              }
              size="medium"
              variant="contained"
              color="secondary"
            />
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', gap: 3 }}>
              <Box
                sx={{
                  mt: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                }}
              >
                <AtomTypography
                  variant="label2"
                  color="text.secondary"
                  textAlign={'right'}
                  sx={{ mb: 0.5, width: '100%', display: 'block' }}
                >
                  YIELD
                </AtomTypography>
                <Box sx={{ display: 'flex', alignItems: 'end', gap: 1 }}>
                  <AtomTypography fontType="tickerbit" variant="display3" color="primary">
                    12.50%
                  </AtomTypography>
                </Box>
              </Box>
              <Tooltip title={'View on Etherscan'}>
                <Box
                  component="span"
                  onClick={handleOpenExplorer}
                  sx={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
                >
                  <Image src="/assets/icons/etherscan.svg" alt="Etherscan" width={20} height={20} />
                </Box>
              </Tooltip>
            </Box>
          </Box>

          {/* Token Header Info - Using static YLDZ data */}
          <TokenHeaderInfo
            symbol={YLDZS_COIN_DETAIL.symbol}
            name={YLDZS_COIN_DETAIL.name}
            logoUrl={YLDZS_COIN_DETAIL.image.large}
            description={YLDZS_COIN_DETAIL.description.en}
            explorerLink={undefined}
            isStatic={true}
          />
        </Box>
      </BackgroundVideoContainer>

      <Box sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          {/* LEFT COLUMN */}
          <Grid size={{ xs: 12, md: 7, lg: 8.8 }} spacing={0}>
            <Grid container direction="column" spacing={0}>
              {/* Chart Section */}
              <Grid size={12}>
                <CornerContainer
                  showGradient={true}
                  outerSx={{
                    width: '100%',
                    border: 'none',
                  }}

                >
                  <TokenChartSection coinId="usd-coin" />
                </CornerContainer>
              </Grid>

              {/* Investor Pitch */}
              <Grid size={{ xs: 12, md: 12, lg: 12 }}>
                <CornerContainer
                  showGradient={true}
                  outerSx={{
                    width: '100%',
                    border: 'none',
                  }}
                >
                  <InvestorPitchDeckSection />
                </CornerContainer>
              </Grid>




              <Grid size={{ xs: 12, md: 12, lg: 12 }}>
                <CornerContainer outerSx={{ border: 'none' }}>
                  <MarketDetailsSection coinId="yldzs" isStatic={true} />
                </CornerContainer>
              </Grid>

              <Grid size={{ xs: 12, md: 12, lg: 12 }}>
                {/* Section 6: Video Cards Row - CEO & Platform Demo */}
                <Box sx={VIDEO_CARDS_ROW_SX}>
                  {YLDZS_VIDEO_CARDS.map((card) => (
                    <VideoContentCard
                      key={card.id}
                      videoSrc={config.backgroundVids.boxexBg}
                      overlayImageSrc={card.overlayImageSrc}
                      overlayImageAlt={card.title}
                      title={`${card.title}\n${card.subtitle}`}
                      description={card.description}
                      iconSrc={card.iconSrc}
                      playUrl={card.playUrl}
                      showBorder={true}
                      isVideoCard={false}
                    />
                  ))}
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 12, lg: 12 }}>
                {/* Section 5: Yield Chart */}
                <CornerContainer outerSx={{ border: 'none' }}>
                  <YieldChartSection />
                </CornerContainer>

                {/* 
        Success Dialog - Opens after onramper flow or investment transaction completes
        
        Button Visibility Rules:
        - Investment Flow: showViewPortfolio = true (button ALWAYS shows)
        - Onramper Flow: showViewPortfolio = false (button ALWAYS hidden)
      */}
                <FundsDepositedSuccessDialog
                  open={isSuccessDialogOpen}
                  onClose={handleSuccessDialogClose}
                  showViewPortfolio={!isSuccessFromOnramper}
                  isWithdrawal={isWithdrawalTransaction}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* INVESTMENT SECTION (Overlay aligned with Chart) */}
          <Grid size={{ xs: 12, md: 5, lg: 3.2 }}>
            <Box
              sx={{
                position: { xs: 'relative', md: 'absolute' },
                top: { xs: 0, md: 200, lg: 200 },
                right: 0,
                zIndex: 10,
                pointerEvents: 'auto',
              }}
            >
              <InvestmentSection
                onInvestmentSuccess={handleInvestmentSuccess}
                onRefetchBalance={handleRefetchBalanceRegister}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>


    </Box>
  );
}

export default memo(YLDZSTokenDetails);
