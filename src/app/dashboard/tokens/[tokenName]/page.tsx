'use client';

/**
 * Token Detail Page
 * =================
 * Dynamic route page displaying detailed information about a specific token.
 *
 * Sections:
 * - Video Header: Background video with token info and back button
 * - Price Chart: Interactive chart using TokenChartSection
 * - Market Details: Key market metrics grid
 *
 * @module app/dashboard/token/[tokenName]
 */

import { AtomButton } from '@/components/atoms/button';
import { TokenHeaderSkeleton } from '@/components/atoms/skeleton/token-header';
import BackgroundVideoContainer from '@/components/atoms/video/background-container';
import TokenHeaderInfo, {
  type BlockchainExplorerLink,
} from '@/components/molecules/token-header-info';
import MarketDetailsSection from '@/components/sections/market-details-section';
import TokenChartSection from '@/components/sections/token-chart-section';
import { config } from '@/config';
import { useDispatch, useSelector, type RootState } from '@/store';
import { fetchCoinDetailThunk } from '@/store/thunks/coingecko-thunk';
import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { CornerContainer } from 'yldzs-components';

// =============================================================================
// Constants & Styles
// =============================================================================

/** Main page container styles */
const PAGE_CONTAINER_SX: SxProps<Theme> = {
  width: '100%',
  minHeight: '100vh',
};

/** Video container styles for the header section */
const VIDEO_CONTAINER_SX: SxProps<Theme> = {
  width: '100%',
  minHeight: '300px',
  marginBottom: 3,
};

/** Header section content styles (overlay on video) */
const HEADER_CONTENT_SX: SxProps<Theme> = {
  width: '100%',
  height: '100%',
  p: { xs: 2, sm: 3, md: 4 },
};

/** Video source path */
const VIDEO_SRC = config.backgroundVids.boxexBg;

// =============================================================================
// Main Component
// =============================================================================

/**
 * Token Detail Page Component
 *
 * Dynamic route page that displays:
 * - Video header with token info
 * - Price chart section
 * - Market details metrics
 *
 * @returns Token detail page JSX element
 */
function TokenDetailPage(): React.JSX.Element {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch();

  // Extract token name from dynamic route params
  const tokenName = useMemo(() => {
    const name = params?.tokenName;
    return typeof name === 'string' ? name : '';
  }, [params]);

  // Redux state: coin detail data
  const { coinDetail, isLoadingCoinDetail } = useSelector(
    (state: RootState) => state.coingecko
  );

  /**
   * Fetch coin detail from API
   */
  const fetchCoinDetail = useCallback(() => {
    if (tokenName) {
      dispatch(fetchCoinDetailThunk({ id: tokenName }));
    }
  }, [dispatch, tokenName]);

  /**
   * Fetch coin detail on mount or when token changes
   * Sets up polling interval to refresh data periodically
   */
  useEffect(() => {
    // Initial fetch
    fetchCoinDetail();

    // Set up polling interval for auto-refresh
    const intervalId = setInterval(() => {
      fetchCoinDetail();
    }, config.marketPollingInterval);

    // Cleanup interval on unmount or when dependencies change
    return () => {
      clearInterval(intervalId);
    };
  }, [fetchCoinDetail]);

  /**
   * Navigate back to tokens page
   */
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  /**
   * Extract token display info from API response
   * Checks blockchain_site array for Etherscan URL, falls back to other explorers
   */
  const tokenInfo = useMemo(() => {
    if (!coinDetail) {
      return {
        symbol: tokenName,
        name: tokenName,
        logoUrl: undefined,
        description: undefined,
        explorerLink: undefined,
      };
    }

    // Get blockchain explorer URL - prioritize Etherscan
    const blockchainSites = coinDetail.links?.blockchain_site;
    let explorerLink: BlockchainExplorerLink | undefined;

    if (Array.isArray(blockchainSites) && blockchainSites.length > 0) {
      // Filter out empty strings and find Etherscan URL
      const validUrls = blockchainSites.filter(Boolean) as string[];
      const etherscanUrl = validUrls.find((url) => url.toLowerCase().includes('etherscan'));

      if (etherscanUrl) {
        // Found Etherscan URL
        explorerLink = {
          url: etherscanUrl,
          isEtherscan: true,
          label: 'View on Etherscan',
        };
      } else if (validUrls.length > 0) {
        // No Etherscan, use first available explorer
        const firstUrl = validUrls[0];
        // Extract domain name for label (e.g., "scan.kcc.io" -> "View on scan.kcc.io")
        const hostname = new URL(firstUrl).hostname;
        explorerLink = {
          url: firstUrl,
          isEtherscan: false,
          label: `View on ${hostname}`,
        };
      }
    }

    return {
      symbol: coinDetail.symbol || tokenName,
      name: coinDetail.name || tokenName,
      logoUrl: coinDetail.image?.large || coinDetail.image?.small,
      description: coinDetail.description?.en,
      explorerLink,
    };
  }, [coinDetail, tokenName]);

  return (
    <Box sx={PAGE_CONTAINER_SX}>
      {/* Section 1: Video Header with Token Info */}
      <BackgroundVideoContainer src={VIDEO_SRC} sx={VIDEO_CONTAINER_SX}>
        <Box sx={HEADER_CONTENT_SX}>
          {/* Back Button */}
          <AtomButton
            id="back-button"
            label="Back"
            onClick={handleBack}
            startIcon={<Image src="/assets/icons/right-scroll.png" alt="Back" width={16} height={16} style={{ transform: 'rotate(180deg)' }}/>}
            size="medium"
            variant="contained"
            color="secondary"
          />

          {/* Token Header Info or Skeleton */}
          {isLoadingCoinDetail ? (
            <TokenHeaderSkeleton />
          ) : (
            <TokenHeaderInfo
              symbol={tokenInfo.symbol}
              name={tokenInfo.name}
              logoUrl={tokenInfo.logoUrl}
              description={tokenInfo.description}
              explorerLink={tokenInfo.explorerLink}
              isStatic={false}
            />
          )}
        </Box>
      </BackgroundVideoContainer>

      {/* Section 2: Price Chart */}
      <CornerContainer outerSx={{ borderBottom: 'none'}}>
        <TokenChartSection coinId={tokenName} />
      </CornerContainer>

      {/* Section 3: Market Details */}
      <CornerContainer outerSx={{ borderTop: 'none'}}>
        <MarketDetailsSection coinId={tokenName} />
      </CornerContainer>
    </Box>
  );
}

export default memo(TokenDetailPage);

