'use client';

/**
 * Category Carousel Section Component
 * =====================================
 * Displays a paginated carousel of token categories using embla-carousel.
 * Fetches categories from CoinGecko API and appends on navigation.
 *
 * Features:
 * - Uses embla-carousel for smooth sliding
 * - Fixed height cards (320px)
 * - Auto-scrollable with smooth transitions
 * - Next/Prev buttons fetch new data and append to list
 * - Loading skeleton while fetching
 *
 * @module components/sections/category-carousel-section
 */
import { type TokenCategory } from '@/constants/token-explorer';
import { useDispatch } from '@/store';
import { clearCarouselCategories, selectCarouselCategoriesState } from '@/store/slices/coingecko-slice';
import { fetchCarouselCategoriesThunk } from '@/store/thunks/coingecko-thunk';
import { Box, Skeleton, useMediaQuery } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import type { EmblaCarouselType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import { useRouter } from 'next/navigation';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { CornerContainer } from 'yldzs-components';

import AtomTypography from '@/components/atoms/typography';
import { BackgroundVideoContainer } from '@/components/atoms/video/background-container';
import TokenCategoryCard from '@/components/molecules/token-category-card';
import { config } from '@/config';
import { paths } from '@/paths';
import { yieldzNeutral } from '@/styles/theme/colors';
import SectionHeaderCategories from '../section-header-categories';

// =============================================================================
// Constants
// =============================================================================

/** Number of categories to fetch per page */
export const CATEGORIES_PER_PAGE = 5;

/** Fixed card height for carousel items */
const CARD_HEIGHT = 316;

/** Number of slides to scroll per navigation click */
const SLIDES_TO_SCROLL = 4;

/** Threshold for fetching more data (slides before end) */
const FETCH_THRESHOLD = 3;

/** Skeleton description line IDs */
const SKELETON_LINE_IDS = ['desc-1', 'desc-2', 'desc-3', 'desc-4', 'desc-5'] as const;

// =============================================================================
// Styles
// =============================================================================

/**
 * Generate carousel container styles with CSS variables
 * @param cardsPerView - Number of cards visible at once
 * @returns SxProps with dynamic slide size
 */
const getCarouselContainerSx = (cardsPerView: number): SxProps<Theme> => ({
  // '--slide-spacing': '16px',
  '--slide-size': `calc(100% / ${cardsPerView})`,
  '--slide-height': `${CARD_HEIGHT}px`,
  overflow: 'hidden',
});

/** Carousel viewport styles */
const CAROUSEL_VIEWPORT_SX: SxProps<Theme> = {
  overflow: 'hidden',
};

/** Carousel track styles */
const CAROUSEL_TRACK_SX: SxProps<Theme> = {
  backfaceVisibility: 'hidden',
  display: 'flex',
  touchAction: 'pan-y',
  // ml: 'calc(var(--slide-spacing) * -1)',
};

/** Carousel slide styles */
const CAROUSEL_SLIDE_SX: SxProps<Theme> = {
  flex: '0 0 var(--slide-size)',
  minWidth: 0,
  pl: 'var(--slide-spacing)',
  position: 'relative',
  height: 'var(--slide-height)',
};

/** Skeleton card container styles */
const SKELETON_CARD_SX: SxProps<Theme> = {
  width: '100%',
  height: CARD_HEIGHT,
  bgcolor: yieldzNeutral[900],
  borderRadius: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: 5,
  p: 3,
  pt: 4,
};

/** Skeleton element base styles */
const SKELETON_ELEMENT_SX: SxProps<Theme> = {
  bgcolor: yieldzNeutral[800],
  borderRadius: 0.5,
};

/** Loading skeleton grid styles */
const LOADING_SKELETON_SX: SxProps<Theme> = {
  display: 'flex',
  gap: 2,
};

/** Error/Empty state container styles */
const STATE_CONTAINER_SX: SxProps<Theme> = {
  textAlign: 'center',
};

// =============================================================================
// Sub-Components
// =============================================================================


/**
 * Category Skeleton Card - Displays placeholder while loading
 */
const CategorySkeletonCard = memo(function CategorySkeletonCard(): React.JSX.Element {
  return (
    <CornerContainer showBorder={false} sx={SKELETON_CARD_SX}>
      {/* Icon skeleton */}
      <Skeleton variant="circular" width={40} height={40} sx={SKELETON_ELEMENT_SX} animation="wave" />

      {/* Content skeleton */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        {/* Name skeleton */}
        <Skeleton variant="text" width={100} height={24} sx={SKELETON_ELEMENT_SX} animation="wave" />

        {/* Description skeleton lines */}
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'center' }}>
          {SKELETON_LINE_IDS.map((id) => (
            <Skeleton key={id} variant="text" width="90%" height={14} sx={SKELETON_ELEMENT_SX} animation="wave" />
          ))}
        </Box>
      </Box>
    </CornerContainer>
  );
});

interface LoadingSkeletonProps {
  readonly cardsPerView: number;
}

/**
 * Loading Skeleton Grid - Displays skeleton cards during initial load
 * @param cardsPerView - Number of skeleton cards to display
 */
const LoadingSkeleton = memo(function LoadingSkeleton({ cardsPerView }: LoadingSkeletonProps): React.JSX.Element {
  // Generate skeleton IDs based on cardsPerView
  const skeletonIds = Array.from({ length: cardsPerView }, (_, i) => `card-${i + 1}`);

  return (
    <Box sx={LOADING_SKELETON_SX}>
      {skeletonIds.map((id) => (
        <Box key={id} sx={{ flex: `0 0 calc(100% / ${cardsPerView})`, minWidth: 0 }}>
          <CategorySkeletonCard />
        </Box>
      ))}
    </Box>
  );
});

// =============================================================================
// Main Component
// =============================================================================

interface CategoryCarouselSectionProps {
  /** Custom section title (defaults to "Token Categories") */
  readonly title?: string;
  /** Whether to show "View All" button */
  readonly showViewAll?: boolean;
}

/**
 * Category Carousel Section Component
 *
 * Displays a paginated carousel of token categories using embla-carousel.
 * Fetches data from CoinGecko API and appends new data on navigation.
 *
 * @param props - Component props
 * @returns Category carousel section with navigation
 */
function CategoryCarouselSection({
  title = 'Token Categories',
  showViewAll = true,
}: CategoryCarouselSectionProps): React.JSX.Element {
  const dispatch = useDispatch();
  const router = useRouter();
  const theme = useTheme();

  // ==========================================================================
  // Responsive Cards Per View
  // ==========================================================================

  /** Mobile: < 600px */
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  /** Small: 600px - 899px */
  const isSmall = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  /** Medium: 900px - 1199px */
  const isMedium = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  /**
   * Determine cards per view based on screen size
   * - Large (>= 1200px): 5 cards
   * - Medium (900px - 1199px): 4 cards
   * - Small (600px - 899px): 3 cards
   * - Mobile (< 600px): 2 cards
   */
  const cardsPerView = useMemo((): number => {
    if (isMobile) return 2;
    if (isSmall) return 3;
    if (isMedium) return 4;
    return 5; // Large screens
  }, [isMobile, isSmall, isMedium]);

  // ==========================================================================
  // Embla Carousel State
  // ==========================================================================

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'start',
    slidesToScroll: SLIDES_TO_SCROLL,
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [currentFetchedPage, setCurrentFetchedPage] = useState(1);

  // ==========================================================================
  // Redux State
  // ==========================================================================

  const { carouselCategories, carouselCategoriesPagination, isLoadingCarouselCategories, carouselCategoriesError } =
    useSelector(selectCarouselCategoriesState);

  // ==========================================================================
  // Memoized Values
  // ==========================================================================

  /** Transform API data to TokenCategory format */
  const categoryCards = useMemo((): TokenCategory[] => {
    if (!carouselCategories) return [];

    return carouselCategories.map((category) => ({
      id: category.id,
      name: category.name,
      description: category.content || `${category.name} tokens`,
      icon: category.top_3_coins?.[0],
    }));
  }, [carouselCategories]);

  /** Check if this is the initial loading state */
  const isInitialLoading = isLoadingCarouselCategories && categoryCards.length === 0;

  /** Check if there are more pages to fetch */
  const hasMorePages = carouselCategoriesPagination?.hasNextPage ?? false;

  // ==========================================================================
  // Callbacks
  // ==========================================================================

  /** Fetch categories for a specific page */
  const fetchPage = useCallback(
    async (page: number): Promise<void> => {
      setIsFetchingMore(true);
      await dispatch(
        fetchCarouselCategoriesThunk({
          page,
          perPage: CATEGORIES_PER_PAGE,
          order: 'market_cap_desc',
        })
      );
      setCurrentFetchedPage(page);
      setIsFetchingMore(false);
    },
    [dispatch]
  );

  /** Update scroll button states from embla */
  const onEmblaSelect = useCallback((api: EmblaCarouselType): void => {
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  /** Handle previous slide navigation */
  const handlePrevious = useCallback((): void => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  /** Handle next slide navigation - fetches more data when approaching end */
  const handleNext = useCallback(async (): Promise<void> => {
    if (!emblaApi) return;

    const currentIndex = emblaApi.selectedScrollSnap();
    const totalSlides = emblaApi.scrollSnapList().length;

    // Fetch more if near end and more pages available
    if (currentIndex >= totalSlides - FETCH_THRESHOLD && hasMorePages && !isFetchingMore) {
      await fetchPage(currentFetchedPage + 1);
    }

    emblaApi.scrollNext();
  }, [emblaApi, hasMorePages, isFetchingMore, currentFetchedPage, fetchPage]);

  /** Navigate to all categories page */
  const handleViewAll = useCallback((): void => {
    router.push(paths.dashboard.tokenCategories);
  }, [router]);

  /** Handle category card click - navigate to filtered tokens */
  const handleCategoryClick = useCallback(
    (categoryId: string): void => {
      router.push(paths.dashboard.tokenListCategories(categoryId));
    },
    [router]
  );

  // ==========================================================================
  // Effects
  // ==========================================================================

  /** Fetch initial page on mount, clear on unmount */
  useEffect((): (() => void) => {
    dispatch(clearCarouselCategories());
    fetchPage(1);

    return () => {
      dispatch(clearCarouselCategories());
    };
  }, [dispatch, fetchPage]);

  /** Initialize embla event listeners */
  useEffect((): (() => void) | undefined => {
    if (!emblaApi) return undefined;

    onEmblaSelect(emblaApi);
    emblaApi.on('reInit', onEmblaSelect);
    emblaApi.on('select', onEmblaSelect);

    return () => {
      emblaApi.off('reInit', onEmblaSelect);
      emblaApi.off('select', onEmblaSelect);
    };
  }, [emblaApi, onEmblaSelect]);
  /** Video container styles for the carousel content */
  const VIDEO_CONTAINER_SX: SxProps<Theme> = {
    width: '100%',
    p: '40px',
  };

  // ==========================================================================
  // Render
  // ==========================================================================

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}>
      {/* Section Header */}
      <SectionHeaderCategories
        title={title}
        onViewAll={showViewAll ? handleViewAll : undefined}
        onPrevious={handlePrevious}
        onNext={handleNext}
        canScrollPrev={canScrollPrev}
        canScrollNext={canScrollNext || hasMorePages}
        isLoading={isInitialLoading}
        isFetchingMore={isFetchingMore}
      />
      <BackgroundVideoContainer src={config.backgroundVids.boxexBg} sx={VIDEO_CONTAINER_SX}>
        {/* Initial Loading State */}
        {isInitialLoading && <LoadingSkeleton cardsPerView={cardsPerView} />}

        {/* Error State */}
        {!isInitialLoading && carouselCategoriesError && (
          <Box sx={STATE_CONTAINER_SX}>
            <AtomTypography variant="body2" color="error">
              {carouselCategoriesError}
            </AtomTypography>
          </Box>
        )}

        {/* Carousel */}
        {!isInitialLoading && !carouselCategoriesError && categoryCards.length > 0 && (
          <Box sx={getCarouselContainerSx(cardsPerView)}>
            <Box ref={emblaRef} sx={CAROUSEL_VIEWPORT_SX}>
              <Box sx={CAROUSEL_TRACK_SX}>
                {categoryCards.map((category) => (
                  <Box key={category.id} sx={CAROUSEL_SLIDE_SX}>
                    <TokenCategoryCard category={category} onClick={() => handleCategoryClick(category.id)} />
                  </Box>
                ))}
                {/* Loading skeleton for fetching more */}
                {isFetchingMore && (
                  <Box sx={CAROUSEL_SLIDE_SX}>
                    <CategorySkeletonCard />
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        )}

        {/* Empty State */}
        {!isInitialLoading && !carouselCategoriesError && categoryCards.length === 0 && (
          <Box sx={STATE_CONTAINER_SX}>
            <AtomTypography variant="body2" color="text.secondary">
              No categories found
            </AtomTypography>
          </Box>
        )}
      </BackgroundVideoContainer>
    </Box>
  );
}

export default memo(CategoryCarouselSection);
