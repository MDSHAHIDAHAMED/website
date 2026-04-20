'use client';

/**
 * Token Listing Section Component
 * ================================
 * Displays sortable, paginated token table with tabs.
 * Fetches data from CoinGecko API via Redux thunk.
 *
 * Features:
 * - Tab-based filtering
 * - Paginated table with customizable page size
 * - Formatted currency, percentage, and number values
 * - ATH/ATL with change indicators
 */
import { TOKEN_LISTING_HEADERS, YLDZS_TOKEN_LISTING_HEADERS } from '@/constants/listing-header';
import { SECTION_HEADER_SX, TOKEN_TABS_DATA } from '@/constants/token-explorer';
import { YLDZS_COIN_DETAIL } from '@/constants/yldzs-token';
import { useDispatch, type RootState } from '@/store';
import { fetchCoinsMarketsThunk } from '@/store/thunks/coingecko-thunk';
import { Box, Stack } from '@mui/material';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

import SelectBox from '@/components/atoms/select-box';
import AtomTabs, { type CustomTabOptionProps } from '@/components/atoms/tabs';
import AtomTypography from '@/components/atoms/typography';
import Listing from '@/components/organisms/table';
import { NavButton, paginationOption, type ISelectOption } from '@/components/organisms/table/pagination';
import { config } from '@/config';
import { paths } from '@/paths';
import { yieldzNeutral } from '@/styles/theme/colors';
import type { CoinMarketSortOrder } from '@/types/coingecko';

// =============================================================================
// Tab to Sort Order Mapping
// =============================================================================

/**
 * Maps tab values to CoinGecko sort orders
 * - TOP_TOKENS: Sort by market cap (highest first)
 * - NEWEST: Sort by ID descending (newer coins have higher IDs)
 * - YIELD_TOKENS: Default to market cap (can be customized)
 * - STANDARD_TOKENS: Default to market cap (can be customized)
 */
const TAB_SORT_ORDER_MAP: Record<string, CoinMarketSortOrder> = {
  TOP_TOKENS: 'market_cap_desc',
  NEWEST: 'id_desc',
  YIELD_TOKENS: 'market_cap_desc',
  STANDARD_TOKENS: 'market_cap_desc',
};

// =============================================================================
// Constants
// =============================================================================

/** Default number of items per page */
const DEFAULT_PAGE_SIZE = 10;

/** Default starting page (1-indexed) */
const DEFAULT_PAGE = 1;

/** Token image dimensions */
const TOKEN_IMAGE_SIZE = 28;

// =============================================================================
// Selectors
// =============================================================================

/** Memoized selector for coins market state */
const selectCoinsMarketState = (state: RootState) => ({
  coins: state.coingecko.coins,
  pagination: state.coingecko.pagination,
  isLoading: state.coingecko.isLoading,
  error: state.coingecko.error,
});

// =============================================================================
// Sub-Components
// =============================================================================

/**
 * Section Header Component
 * Displays section title with optional navigation arrows
 */
interface SectionHeaderProps {
  title: string;
  children?: React.ReactNode;
}

const SectionHeader = memo(function SectionHeader({
  title,
  children,
}: Readonly<SectionHeaderProps>): React.JSX.Element {
  return (
    <Box
      sx={{
        ...SECTION_HEADER_SX,
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <AtomTypography variant="h4" color="text.primary">
        {title}
      </AtomTypography>
      {children}
    </Box>
  );
});

// =============================================================================
// Main Component
// =============================================================================

/**
 * Token Listing Section Props
 */
interface TokenListingSectionProps {
  /** Custom section title (defaults to "Tokens") */
  title?: string;
  /** Category name (defaults to "") */
  categoryName?: string;
  /** Whether to show the button (defaults to false) */
  noButton?: boolean;
}

/**
 * Token Listing Section Component
 * Displays sortable, paginated token table with tabs
 * Fetches data from CoinGecko API via Redux thunk
 *
 * @param props - Component props
 * @returns Token listing section with table and pagination
 */
function TokenListingSection({
  title = 'Tokens',
  categoryName = '',
  noButton = false,
}: Readonly<TokenListingSectionProps>): React.JSX.Element {
  const dispatch = useDispatch();
  const router = useRouter();
  const currentUrl = usePathname();

  // Redux state with memoized selector
  const { coins, pagination, isLoading } = useSelector(selectCoinsMarketState);

  // Local UI state
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [activeTabValue, setActiveTabValue] = useState<string>('TOP_TOKENS');
  const [pageNumber, setPageNumber] = useState(DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const YIELD_TOKENS = 'YIELD_TOKENS';

  // Form for page size SelectBox
  const methods = useForm<{ pageSize: ISelectOption }>({
    defaultValues: {
      pageSize: paginationOption[0], // Default to 10
    },
  });

  /**
   * Get sort order based on active tab
   */
  const sortOrder = useMemo((): CoinMarketSortOrder => {
    return TAB_SORT_ORDER_MAP[activeTabValue] ?? 'market_cap_desc';
  }, [activeTabValue]);

  /** Polling interval in milliseconds (60 seconds) */
  const POLLING_INTERVAL_MS = config.marketPollingInterval;

  /**
   * Fetch coins via Redux thunk
   * Dispatches fetchCoinsMarketsThunk with current pagination and sort order
   * Note: pageNumber is 1-indexed
   */
  const fetchCoins = useCallback(() => {
    dispatch(
      fetchCoinsMarketsThunk({
        page: pageNumber,
        perPage: pageSize,
        vsCurrency: 'usd',
        order: sortOrder,
        category: categoryName,
      })
    );
  }, [dispatch, pageNumber, pageSize, sortOrder, categoryName]);

  /**
   * Fetch coins on mount and when pagination/sort changes
   * Also sets up polling interval to refresh data every 60 seconds
   */
  useEffect(() => {
    // Initial fetch
    fetchCoins();

    // Set up polling interval for auto-refresh
    const intervalId = setInterval(() => {
      fetchCoins();
    }, POLLING_INTERVAL_MS);

    // Cleanup interval on unmount or when dependencies change
    return () => {
      clearInterval(intervalId);
    };
  }, [fetchCoins]);

  /**
   * Tab change handler
   * Updates active tab and resets pagination
   */
  const handleTabChange = useCallback((_event: React.SyntheticEvent, newValue: CustomTabOptionProps) => {
    const tabIndex = TOKEN_TABS_DATA.findIndex((tab) => tab.value === newValue.value);
    setActiveTabIndex(Math.max(tabIndex, 0));
    setActiveTabValue(String(newValue.value));
    if (newValue.value === YIELD_TOKENS) {
      return;
    }
    setPageNumber(DEFAULT_PAGE); // Reset to first page on tab change
  }, []);

  /**
   * Navigate to next page if available
   */
  const handleNextPage = useCallback(() => {
    if (pagination?.hasNextPage) {
      setPageNumber((prev) => prev + 1);
    }
  }, [pagination?.hasNextPage]);

  /**
   * Navigate to previous page if available
   */
  const handlePrevPage = useCallback(() => {
    if (pagination?.hasPrevPage) {
      setPageNumber((prev) => prev - 1);
    }
  }, [pagination?.hasPrevPage]);

  /**
   * Handle page size change from SelectBox
   */
  const handlePageSizeChange = useCallback(() => {
    const currentValue = methods.getValues('pageSize');
    if (currentValue) {
      setPageSize(Number(currentValue.value));
      setPageNumber(DEFAULT_PAGE); // Reset to first page on size change
    }
  }, [methods]);

  /**
   * Handle row click to navigate to token detail page
   * @param tokenId - CoinGecko coin ID (e.g., 'bitcoin', 'ethereum')
   */
  const handleRowClick = useCallback(
    (tokenId: string) => {
      router.push(paths.dashboard.tokensDetails(tokenId));
    },
    [router]
  );

  /**
   * Format currency value with comma separation
   * Shows full value with commas, $ prefix, and appropriate decimal precision
   *
   * @param value - Numeric value to format
   * @returns Formatted currency string
   */
  const formatCurrency = useCallback((value: number | null | undefined): string => {
    if (value === null || value === undefined) return '--';
    // For small values (< 1), show up to 6 decimal places
    if (value < 1) return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`;
    // For larger values, show 2 decimal places with comma separation
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }, []);

  /**
   * Format number value with comma separation (no $ prefix)
   *
   * @param value - Numeric value to format
   * @returns Formatted number string
   */
  const formatNumber = useCallback((value: number | null | undefined): string => {
    if (value === null || value === undefined) return '--';
    return value.toLocaleString('en-US', { maximumFractionDigits: 0 });
  }, []);

  /**
   * Format percentage value with sign indicator
   *
   * @param value - Percentage value to format
   * @returns Formatted percentage string
   */
  const formatPercentage = useCallback((value: number | null | undefined): string => {
    if (value === null || value === undefined) return '--';
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  }, []);

  /**
   * Helper: Get change type based on value
   */
  const getChangeType = useCallback((value: number | null | undefined): 'positive' | 'negative' | 'neutral' => {
    if (value === null || value === undefined) return 'neutral';
    return value >= 0 ? 'positive' : 'negative';
  }, []);

  /**
   * Helper: Get change icon based on value
   */
  const getChangeIcon = useCallback((value: number | null | undefined): string => {
    if (value === null || value === undefined) return '';
    return value >= 0 ? '↑' : '↓';
  }, []);

  /**
   * Helper: Render price change cell content
   */
  const renderPriceChange = useCallback(
    (value: number | null | undefined): string => {
      if (value === null || value === undefined) return '--';
      return `${getChangeIcon(value)} ${formatPercentage(value)}`;
    },
    [formatPercentage, getChangeIcon]
  );

  /**
   * Helper: Render ATH/ATL cell with change indicator
   */
  const renderPriceWithChange = useCallback(
    (price: number | null | undefined, changePercent: number | null | undefined): React.JSX.Element => {
      const hasValidChange = changePercent !== null && changePercent !== undefined && price !== null;
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <AtomTypography variant="subtitle3">{formatCurrency(price)}</AtomTypography>
          {hasValidChange ? (
            <AtomTypography variant="caption" sx={{ color: changePercent >= 0 ? 'success.main' : 'error.main' }}>
              {getChangeIcon(changePercent)} {formatPercentage(changePercent)}
            </AtomTypography>
          ) : (
            <AtomTypography variant="caption" color="text.secondary">
              --
            </AtomTypography>
          )}
        </Box>
      );
    },
    [formatCurrency, formatPercentage, getChangeIcon]
  );

  /**
   * Helper: Render token image with fallback
   */
  const renderTokenImage = useCallback(
    (src: string, alt: string): React.JSX.Element => (
      <Box
        component="img"
        src={src}
        alt={alt}
        sx={{ width: TOKEN_IMAGE_SIZE, height: TOKEN_IMAGE_SIZE, borderRadius: '50%' }}
        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
          e.currentTarget.style.display = 'none';
        }}
      />
    ),
    []
  );
  /**
   * Handle row click to navigate to token detail page
   * @param tokenId - CoinGecko coin ID (e.g., 'bitcoin', 'ethereum')
   */
  const handleYLDZRowClick = useCallback(
    (tokenId: string) => {
      console.log('Row clicked:', tokenId);
      router.push(paths.dashboard.yldzsToken);
    },
    [router]
  );

  /**
   * Transform CoinGecko market data to match Listing component requirements
   * Maps coin data to table row format with the expected object structure
   */
  const tokenTableRow = useMemo(() => {
    return coins.map((coin) => ({
      id: coin.id,
      onRowClick: () => handleRowClick(coin.id),
      name: {
        icon: renderTokenImage(coin.image, coin.name),
        primary: coin.name,
        secondary: coin.symbol?.toUpperCase(),
      },
      price: {
        value: formatCurrency(coin.current_price),
        change: renderPriceChange(coin.price_change_percentage_24h),
        changeType: getChangeType(coin.price_change_percentage_24h),
      },
      ath: renderPriceWithChange(coin.ath, coin.ath_change_percentage),
      atl: renderPriceWithChange(coin.atl, coin.atl_change_percentage),
      circulating_supply: coin.circulating_supply ? `$${formatNumber(coin.circulating_supply)}` : '--',
      marketCap: formatCurrency(coin.market_cap),
    }));
  }, [
    coins,
    formatCurrency,
    formatNumber,
    getChangeType,
    handleRowClick,
    renderPriceChange,
    renderPriceWithChange,
    renderTokenImage,
  ]);
  /**
   * Static token table row data
   * Single object array for table display
   */
  const yldzsTokenTableRow = useMemo(
    () => [
      {
        id: YLDZS_COIN_DETAIL.id,
        onRowClick: () => handleYLDZRowClick(YLDZS_COIN_DETAIL.id),
        name: {
          icon: <Image src="/assets/logo-emblem.png" alt="YLDZ Token" width={20} height={20} />,
          primary: YLDZS_COIN_DETAIL.name,
          secondary: YLDZS_COIN_DETAIL.symbol,
        },
        price: {
          value: `$${formatNumber(YLDZS_COIN_DETAIL.market_data.current_price.usd)}`,
          change: renderPriceChange(YLDZS_COIN_DETAIL.market_data.price_change_percentage_24h),
          changeType: getChangeType(YLDZS_COIN_DETAIL.market_data.price_change_percentage_24h),
        },
        total_liquidity: formatNumber(YLDZS_COIN_DETAIL.liquidity_stats.total_liquidity_usd),
        ctp_BTC: formatNumber(YLDZS_COIN_DETAIL.mining_stats.cost_to_produce_btc),
        current_apy: formatPercentage(YLDZS_COIN_DETAIL.market_data.apy.fixed),
        circulating_supply: formatNumber(YLDZS_COIN_DETAIL.market_data.circulating_supply),
        marketCap: `$${formatNumber(YLDZS_COIN_DETAIL.market_data.market_cap.usd)}`,
        total_supply: formatNumber(YLDZS_COIN_DETAIL.market_data.total_supply),
      },
    ],
    [formatNumber, formatPercentage, getChangeType, renderPriceChange]
  );

  return (
    <Box>
      {/* Section Header with Tabs */}
      <SectionHeader title={title}>
        {!noButton && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <AtomTabs
              id="token-listing-tabs"
              value={activeTabIndex}
              tabsData={TOKEN_TABS_DATA}
              onTabChange={handleTabChange}
              variant="standard"
              width="400px"
              showSection={false}
            />
          </Box>
        )}
      </SectionHeader>
      {/* YLDZ Tokens Listing Section */}
      {(activeTabValue === YIELD_TOKENS || activeTabValue === 'TOP_TOKENS') &&
        currentUrl === paths.dashboard.tokens && (
          <>
            <Listing
              headers={YLDZS_TOKEN_LISTING_HEADERS}
              rows={yldzsTokenTableRow}
              loading={false}
              pageSize={10}
              pageNumber={1}
              totalCount={tokenTableRow.length}
              noRecords="No tokens found"
              isPaginationEnabled={false}
            />
            <br />
          </>
        )}
      {/* Token Table */}
      {activeTabValue !== YIELD_TOKENS && (
        <Listing
          headers={TOKEN_LISTING_HEADERS}
          rows={tokenTableRow}
          loading={isLoading}
          pageSize={pageSize}
          pageNumber={pageNumber}
          totalCount={0}
          noRecords="No tokens found"
          isPaginationEnabled={true}
        />
      )}

      {/* Custom Pagination Controls */}
      {tokenTableRow.length > 0 && !isLoading && activeTabValue !== YIELD_TOKENS && (
        <FormProvider {...methods}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              mt: 2,
              py: 1.5,
              px: 2,
              borderRadius: 1,
            }}
          >
            {/* Page Size Selector */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: '12px',
                marginTop: '-10px',
              }}
            >
              <AtomTypography
                id="rows-label"
                variant="subtitle1"
                sx={{
                  whiteSpace: 'nowrap',
                  color: yieldzNeutral[100],
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom:'8px'
                }}
              >
                Rows per Page:
              </AtomTypography>

              <Box sx={{ display: 'flex', alignItems: 'center', minWidth: '100px' }}>
                <SelectBox
                  name="pageSize"
                  id="row-pagination-handler"
                  label=""
                  options={paginationOption}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      padding: '19px 0 4px 0',
                    },
                  }}
                  onSelectBoxChange={handlePageSizeChange}
                  disabled={false}
                  noLabel
                />
              </Box>
            </Box>

            {/* Page Info & Navigation */}
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box sx={{ mr: 2 }}>
                <NavButton direction="prev" disabled={!pagination?.hasPrevPage} onClick={() => handlePrevPage()} />
              </Box>
              <Box>
                <NavButton direction="next" disabled={!pagination?.hasNextPage} onClick={() => handleNextPage()} />
              </Box>
            </Stack>
          </Stack>
        </FormProvider>
      )}
    </Box>
  );
}

export default memo(TokenListingSection);
