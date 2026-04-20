'use client';

/**
 * Category Listing Section Component
 * ===================================
 * Displays sortable, paginated table of coin categories with market data.
 * Fetches data from CoinGecko API via Redux thunk.
 *
 * Features:
 * - Fetches categories with market data (market cap, volume, top coins)
 * - Pagination with next/prev page and per-page selection
 * - Formatted currency, percentage values
 * - Top 3 coins display with avatars
 * - Loading skeleton
 * - Row click navigation to category page (future)
 *
 * @module components/sections/category-listing-section
 */

import { Avatar, AvatarGroup, Box, Skeleton, Stack } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

import SelectBox from '@/components/atoms/select-box';
import AtomTypography from '@/components/atoms/typography';
import Listing from '@/components/organisms/table';
import { NavButton, paginationOption, type ISelectOption } from '@/components/organisms/table/pagination';
import { CATEGORY_LISTING_HEADERS } from '@/constants/listing-header';
import { SECTION_CONTAINER_SX, SECTION_HEADER_SX } from '@/constants/token-explorer';
import { useDispatch } from '@/store';
import { selectCategoriesState } from '@/store/slices/coingecko-slice';
import { fetchCategoriesWithMarketThunk } from '@/store/thunks/coingecko-thunk';
import { yieldzNeutral, yieldzSecondary } from '@/styles/theme/colors';

// =============================================================================
// Constants
// =============================================================================

/** Default page size for categories */
const DEFAULT_PAGE_SIZE = 10;

/** Default page number (1-indexed) */
const DEFAULT_PAGE = 1;

/** Coin avatar dimensions */
const COIN_AVATAR_SIZE = 24;

/** Maximum number of top coins to display */
const MAX_TOP_COINS = 3;

/** Skeleton row IDs for loading state */
const SKELETON_ROW_IDS = [
  'row-1', 'row-2', 'row-3', 'row-4', 'row-5',
  'row-6', 'row-7', 'row-8', 'row-9', 'row-10',
] as const;

/** Skeleton avatar IDs for top coins */
const SKELETON_AVATAR_IDS = ['avatar-1', 'avatar-2', 'avatar-3'] as const;

// =============================================================================
// Styles
// =============================================================================

/** Avatar group styles */
const AVATAR_GROUP_SX: SxProps<Theme> = {
  '& .MuiAvatar-root': {
    width: COIN_AVATAR_SIZE,
    height: COIN_AVATAR_SIZE,
    fontSize: 10,
    border: `1px solid ${yieldzNeutral[800]}`,
  },
};

/** Skeleton row styles */
const SKELETON_CELL_SX: SxProps<Theme> = {
  bgcolor: yieldzNeutral[800],
  borderRadius: 0.5,
};

// =============================================================================
// Sub-Components
// =============================================================================

/**
 * Section Header Component
 * Displays section title without tabs
 */
interface SectionHeaderProps {
  title: string;
}

const SectionHeader = memo(function SectionHeader({
  title,
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
    </Box>
  );
});

/**
 * Top Coins Avatar Group Component
 * Displays avatars of top 3 coins in a category
 */
interface TopCoinsAvatarsProps {
  coinImages: string[];
  coinIds?: string[];
}

const TopCoinsAvatars = memo(function TopCoinsAvatars({
  coinImages,
  coinIds,
}: Readonly<TopCoinsAvatarsProps>): React.JSX.Element {
  if (!coinImages || coinImages.length === 0) {
    return (
      <AtomTypography variant="body2" color="text.secondary">
        --
      </AtomTypography>
    );
  }

  return (
    <Stack direction="row" spacing={0} alignItems="center" justifyContent="center">
      <AvatarGroup max={MAX_TOP_COINS} sx={AVATAR_GROUP_SX}>
      {coinImages.slice(0, MAX_TOP_COINS).map((image, idx) => (
        <Avatar
          key={coinIds?.[idx] ?? `coin-img-${image.slice(-20)}`}
          src={image}
          alt={coinIds?.[idx] ?? `coin-${idx}`}
          sx={{ width: COIN_AVATAR_SIZE, height: COIN_AVATAR_SIZE }}
        />
      ))}
    </AvatarGroup>
    </Stack>
  );
});

/**
 * Category Table Skeleton Component
 * Displays skeleton rows while loading
 */
const CategoryTableSkeleton = memo(function CategoryTableSkeleton(): React.JSX.Element {
  return (
    <Box sx={{ width: '100%' }}>
      {/* Skeleton Header */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          p: 2,
          borderBottom: `1px solid ${yieldzNeutral[800]}`,
        }}
      >
        {CATEGORY_LISTING_HEADERS.map((header) => (
          <Box key={header.id} sx={{ width: header.width }}>
            <Skeleton
              variant="text"
              width="80%"
              height={16}
              sx={SKELETON_CELL_SX}
              animation="wave"
            />
          </Box>
        ))}
      </Box>

      {/* Skeleton Rows */}
      {SKELETON_ROW_IDS.map((rowId) => (
        <Box
          key={rowId}
          sx={{
            display: 'flex',
            gap: 2,
            p: 2,
            borderBottom: `1px solid ${yieldzNeutral[900]}`,
          }}
        >
          {/* Category name skeleton */}
          <Box sx={{ width: '20%' }}>
            <Skeleton
              variant="text"
              width="70%"
              height={20}
              sx={SKELETON_CELL_SX}
              animation="wave"
            />
          </Box>

          {/* Top coins skeleton - avatar group */}
          <Box sx={{ width: '15%', display: 'flex', gap: 0.5 }}>
            {SKELETON_AVATAR_IDS.map((avatarId) => (
              <Skeleton
                key={avatarId}
                variant="circular"
                width={COIN_AVATAR_SIZE}
                height={COIN_AVATAR_SIZE}
                sx={SKELETON_CELL_SX}
                animation="wave"
              />
            ))}
          </Box>

          {/* Market cap skeleton */}
          <Box sx={{ width: '20%' }}>
            <Skeleton
              variant="text"
              width="60%"
              height={20}
              sx={SKELETON_CELL_SX}
              animation="wave"
            />
          </Box>

          {/* 24h change skeleton */}
          <Box sx={{ width: '15%' }}>
            <Skeleton
              variant="text"
              width="50%"
              height={20}
              sx={SKELETON_CELL_SX}
              animation="wave"
            />
          </Box>

          {/* Volume skeleton */}
          <Box sx={{ width: '15%' }}>
            <Skeleton
              variant="text"
              width="55%"
              height={20}
              sx={SKELETON_CELL_SX}
              animation="wave"
            />
          </Box>

          {/* Last updated skeleton */}
          <Box sx={{ width: '15%' }}>
            <Skeleton
              variant="text"
              width="60%"
              height={20}
              sx={SKELETON_CELL_SX}
              animation="wave"
            />
          </Box>
        </Box>
      ))}
    </Box>
  );
});

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Format large numbers with appropriate suffixes (K, M, B, T)
 * @param value - Number to format
 * @param prefix - Currency prefix (e.g., '$')
 * @returns Formatted string
 */
function formatLargeNumber(value: number | null | undefined, prefix = '$'): string {
  if (value === null || value === undefined) return '--';

  const absValue = Math.abs(value);

  if (absValue >= 1e12) {
    return `${prefix}${(value / 1e12).toFixed(2)}T`;
  }
  if (absValue >= 1e9) {
    return `${prefix}${(value / 1e9).toFixed(2)}B`;
  }
  if (absValue >= 1e6) {
    return `${prefix}${(value / 1e6).toFixed(2)}M`;
  }
  if (absValue >= 1e3) {
    return `${prefix}${(value / 1e3).toFixed(2)}K`;
  }

  return `${prefix}${value.toFixed(2)}`;
}

/**
 * Format percentage value with sign indicator
 * @param value - Percentage value
 * @returns Formatted percentage string
 */
function formatPercentage(value: number | null | undefined): string {
  if (value === null || value === undefined) return '--';
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

/**
 * Format timestamp to relative time
 * @param timestamp - ISO timestamp string
 * @returns Formatted relative time string
 */
function formatUpdatedAt(timestamp: string | null | undefined): string {
  if (!timestamp) return '--';

  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return '--';
  }
}

// =============================================================================
// Main Component
// =============================================================================

/**
 * Category Listing Section Props
 */
interface CategoryListingSectionProps {
  /** Custom section title (defaults to "Categories") */
  title?: string;
}

/**
 * Category Listing Section Component
 * Displays coin categories with market data
 * Fetches data from CoinGecko API via Redux thunk
 *
 * @param props - Component props
 * @returns Category listing section with table and pagination
 */
function CategoryListingSection({
  title = 'Categories',
}: Readonly<CategoryListingSectionProps>): React.JSX.Element {
  const dispatch = useDispatch();

  // Redux state with memoized selector
  const { categoriesWithMarket, categoriesPagination, isLoadingCategories } =
    useSelector(selectCategoriesState);

  // Local UI state for pagination
  const [pageNumber, setPageNumber] = useState(DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  // Form for page size SelectBox
  const methods = useForm<{ pageSize: ISelectOption }>({
    defaultValues: {
      pageSize: paginationOption[0], // Default to 10
    },
  });

  /**
   * Fetch categories with pagination params
   */
  const fetchCategories = useCallback(() => {
    dispatch(
      fetchCategoriesWithMarketThunk({
        order: 'market_cap_desc',
        page: pageNumber,
        perPage: pageSize,
      })
    );
  }, [dispatch, pageNumber, pageSize]);

  /**
   * Fetch categories on mount and when pagination changes
   */
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  /**
   * Navigate to next page if available
   */
  const handleNextPage = useCallback(() => {
    if (categoriesPagination?.hasNextPage) {
      setPageNumber((prev) => prev + 1);
    }
  }, [categoriesPagination?.hasNextPage]);

  /**
   * Navigate to previous page if available
   */
  const handlePrevPage = useCallback(() => {
    if (categoriesPagination?.hasPrevPage) {
      setPageNumber((prev) => prev - 1);
    }
  }, [categoriesPagination?.hasPrevPage]);

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
   * Transform category data to match Listing component requirements
   * Maps category data to table row format with the expected object structure
   */
  const categoryTableRows = useMemo(() => {
    if (!categoriesWithMarket) return [];

    return categoriesWithMarket.map((category) => {
      const changeType = (category.market_cap_change_24h ?? 0) >= 0 ? 'positive' : 'negative';
      const changeIcon = changeType === 'positive' ? '↑' : '↓';

      return {
        id: category.id,
        // Name cell - just category name
        category_name: (
            <AtomTypography variant="subtitle3" color="text.primary">
              {category.name}
            </AtomTypography>
        ),
        // Top coins - avatar group
        top_coins: (
          <TopCoinsAvatars
            coinImages={category.top_3_coins || []}
            coinIds={category.top_3_coins_id}
          />
        ),
        // Market cap
        market_cap: (
          <AtomTypography variant="subtitle3" color="text.primary">
            {formatLargeNumber(category.market_cap)}
          </AtomTypography>
        ),
        // Market cap 24h change
        market_cap_change: (
          <AtomTypography
            variant="subtitle3"
            sx={{
              color: changeType === 'positive'
                ? yieldzSecondary.green[500]
                : yieldzSecondary.red[500],
            }}
          >
            {changeIcon} {formatPercentage(category.market_cap_change_24h)}
          </AtomTypography>
        ),
        // 24h Volume
        volume_24h: (
          <AtomTypography variant="subtitle3" color="text.primary">
            {formatLargeNumber(category.volume_24h)}
          </AtomTypography>
        )
      };
    });
  }, [categoriesWithMarket]);

  return (
    <Box sx={SECTION_CONTAINER_SX}>
      {/* Section Header */}
      <SectionHeader title={title} />

      {/* Category Table */}
        <Listing
          headers={CATEGORY_LISTING_HEADERS}
          rows={categoryTableRows}
          loading={isLoadingCategories}
          pageSize={pageSize}
          pageNumber={pageNumber}
          totalCount={categoriesPagination?.total ?? 0}
          noRecords="No categories found"
          isPaginationEnabled={false}
        />

      {/* Custom Pagination Controls */}
      {categoryTableRows.length > 0 && !isLoadingCategories && (
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
                  id="category-pagination-handler"
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
                <NavButton
                  direction="prev"
                  disabled={!categoriesPagination?.hasPrevPage}
                  onClick={() => handlePrevPage()}
                />
              </Box>
              <Box>
                <NavButton
                  direction="next"
                  disabled={!categoriesPagination?.hasNextPage}
                  onClick={() => handleNextPage()}
                />
              </Box>
            </Stack>
          </Stack>
        </FormProvider>
      )}
    </Box>
  );
}

export default memo(CategoryListingSection);
