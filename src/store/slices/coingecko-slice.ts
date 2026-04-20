/**
 * CoinGecko Slice
 * ===============
 * Redux slice for managing CoinGecko API state
 *
 * Features:
 * - Coins market data with pagination
 * - Loading and error states
 * - Currency and category filters
 * - Sort order management
 * - Cache timestamp tracking
 *
 * @module store/slices/coingecko-slice
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import {
    fetchCarouselCategoriesThunk,
    fetchCategoriesListThunk,
    fetchCategoriesWithMarketThunk,
    fetchCoinDetailThunk,
    fetchCoinsMarketsThunk,
    fetchMarketChartRangeThunk,
    fetchMarketChartThunk,
    fetchOHLCThunk,
    refreshCoinsMarketsThunk,
} from '@/store/thunks/coingecko-thunk';
import {
    initialCoinGeckoState,
} from '@/store/types/coingecko-types';
import type { CoinMarketSortOrder } from '@/types/coingecko';

// =============================================================================
// Slice Definition
// =============================================================================

const coingeckoSlice = createSlice({
  name: 'coingecko',
  initialState: initialCoinGeckoState,

  // =============================================================================
  // Synchronous Reducers
  // =============================================================================
  reducers: {
    /**
     * Set target currency for market data
     * @param state - Current state
     * @param action - Currency code (e.g., 'usd', 'eur')
     */
    setVsCurrency: (state, action: PayloadAction<string>) => {
      state.vsCurrency = action.payload;
    },

    /**
     * Set category filter
     * @param state - Current state
     * @param action - Category slug or null to clear
     */
    setCategory: (state, action: PayloadAction<string | null>) => {
      state.category = action.payload;
    },

    /**
     * Set sort order
     * @param state - Current state
     * @param action - Sort order
     */
    setSortOrder: (state, action: PayloadAction<CoinMarketSortOrder>) => {
      state.sortOrder = action.payload;
    },

    /**
     * Clear error state
     * @param state - Current state
     */
    clearError: (state) => {
      state.error = null;
    },

    /**
     * Clear coin detail error state
     * @param state - Current state
     */
    clearCoinDetailError: (state) => {
      state.coinDetailError = null;
    },

    /**
     * Clear coin detail data
     * @param state - Current state
     */
    clearCoinDetail: (state) => {
      state.coinDetail = null;
      state.coinDetailId = null;
      state.coinDetailError = null;
      state.coinDetailFetchedAt = null;
    },

    /**
     * Clear market chart data
     * @param state - Current state
     */
    clearMarketChart: (state) => {
      state.marketChart = null;
      state.marketChartCoinId = null;
      state.marketChartError = null;
      state.marketChartFetchedAt = null;
    },

    /**
     * Clear OHLC data
     * @param state - Current state
     */
    clearOHLC: (state) => {
      state.ohlc = null;
      state.ohlcCoinId = null;
      state.ohlcError = null;
      state.ohlcFetchedAt = null;
    },

    /**
     * Clear categories data
     * @param state - Current state
     */
    clearCategories: (state) => {
      state.categoriesList = null;
      state.categoriesWithMarket = null;
      state.categoriesPagination = null;
      state.categoriesError = null;
      state.categoriesFetchedAt = null;
    },

    /**
     * Clear carousel categories data
     * @param state - Current state
     */
    clearCarouselCategories: (state) => {
      state.carouselCategories = null;
      state.carouselCategoriesPagination = null;
      state.carouselCategoriesError = null;
    },

    /**
     * Reset entire CoinGecko state to initial values
     */
    resetCoinGeckoState: () => {
      return initialCoinGeckoState;
    },
  },

  // =============================================================================
  // Async Reducers (Extra Reducers)
  // =============================================================================
  extraReducers: (builder) => {
    // =========================================================================
    // Fetch Coins Markets Thunk
    // =========================================================================
    builder
      .addCase(fetchCoinsMarketsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCoinsMarketsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.coins = action.payload.coins;
        state.pagination = action.payload.pagination;
        state.lastFetchedAt = Date.now();
        state.error = null;
      })
      .addCase(fetchCoinsMarketsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Failed to fetch coins';
        state.coins = [];
        state.pagination = null;
      });

    // =========================================================================
    // Refresh Coins Markets Thunk
    // =========================================================================
    builder
      .addCase(refreshCoinsMarketsThunk.pending, (state) => {
        state.isRefreshing = true;
        state.error = null;
      })
      .addCase(refreshCoinsMarketsThunk.fulfilled, (state, action) => {
        state.isRefreshing = false;
        state.coins = action.payload.coins;
        state.pagination = action.payload.pagination;
        state.lastFetchedAt = Date.now();
        state.error = null;
      })
      .addCase(refreshCoinsMarketsThunk.rejected, (state, action) => {
        state.isRefreshing = false;
        state.error = action.payload ?? 'Failed to refresh coins';
      });

    // =========================================================================
    // Fetch Coin Detail Thunk
    // =========================================================================
    builder
      .addCase(fetchCoinDetailThunk.pending, (state, action) => {
        state.isLoadingCoinDetail = true;
        state.coinDetailError = null;
        state.coinDetailId = action.meta.arg.id;
      })
      .addCase(fetchCoinDetailThunk.fulfilled, (state, action) => {
        state.isLoadingCoinDetail = false;
        state.coinDetail = action.payload;
        state.coinDetailId = action.payload.id;
        state.coinDetailFetchedAt = Date.now();
        state.coinDetailError = null;
      })
      .addCase(fetchCoinDetailThunk.rejected, (state, action) => {
        state.isLoadingCoinDetail = false;
        state.coinDetailError = action.payload ?? 'Failed to fetch coin detail';
        state.coinDetail = null;
      });

    // =========================================================================
    // Fetch Market Chart Thunk
    // =========================================================================
    builder
      .addCase(fetchMarketChartThunk.pending, (state, action) => {
        state.isLoadingMarketChart = true;
        state.marketChartError = null;
        state.marketChartCoinId = action.meta.arg.id;
      })
      .addCase(fetchMarketChartThunk.fulfilled, (state, action) => {
        state.isLoadingMarketChart = false;
        state.marketChart = action.payload;
        state.marketChartFetchedAt = Date.now();
        state.marketChartError = null;
      })
      .addCase(fetchMarketChartThunk.rejected, (state, action) => {
        state.isLoadingMarketChart = false;
        state.marketChartError = action.payload ?? 'Failed to fetch market chart';
        state.marketChart = null;
      });

    // =========================================================================
    // Fetch Market Chart Range Thunk (uses same state as regular chart)
    // =========================================================================
    builder
      .addCase(fetchMarketChartRangeThunk.pending, (state, action) => {
        state.isLoadingMarketChart = true;
        state.marketChartError = null;
        state.marketChartCoinId = action.meta.arg.id;
      })
      .addCase(fetchMarketChartRangeThunk.fulfilled, (state, action) => {
        state.isLoadingMarketChart = false;
        state.marketChart = action.payload;
        state.marketChartFetchedAt = Date.now();
        state.marketChartError = null;
      })
      .addCase(fetchMarketChartRangeThunk.rejected, (state, action) => {
        state.isLoadingMarketChart = false;
        state.marketChartError = action.payload ?? 'Failed to fetch market chart range';
        state.marketChart = null;
      });

    // =========================================================================
    // Fetch OHLC Thunk
    // =========================================================================
    builder
      .addCase(fetchOHLCThunk.pending, (state, action) => {
        state.isLoadingOHLC = true;
        state.ohlcError = null;
        state.ohlcCoinId = action.meta.arg.id;
      })
      .addCase(fetchOHLCThunk.fulfilled, (state, action) => {
        state.isLoadingOHLC = false;
        state.ohlc = action.payload;
        state.ohlcFetchedAt = Date.now();
        state.ohlcError = null;
      })
      .addCase(fetchOHLCThunk.rejected, (state, action) => {
        state.isLoadingOHLC = false;
        state.ohlcError = action.payload ?? 'Failed to fetch OHLC data';
        state.ohlc = null;
      });

    // =========================================================================
    // Fetch Categories List Thunk
    // =========================================================================
    builder
      .addCase(fetchCategoriesListThunk.pending, (state) => {
        state.isLoadingCategories = true;
        state.categoriesError = null;
      })
      .addCase(fetchCategoriesListThunk.fulfilled, (state, action) => {
        state.isLoadingCategories = false;
        state.categoriesList = action.payload;
        state.categoriesFetchedAt = Date.now();
        state.categoriesError = null;
      })
      .addCase(fetchCategoriesListThunk.rejected, (state, action) => {
        state.isLoadingCategories = false;
        state.categoriesError = action.payload ?? 'Failed to fetch categories list';
      });

    // =========================================================================
    // Fetch Categories with Market Data Thunk
    // =========================================================================
    builder
      .addCase(fetchCategoriesWithMarketThunk.pending, (state) => {
        state.isLoadingCategories = true;
        state.categoriesError = null;
      })
      .addCase(fetchCategoriesWithMarketThunk.fulfilled, (state, action) => {
        state.isLoadingCategories = false;
        state.categoriesWithMarket = action.payload.categories;
        state.categoriesPagination = action.payload.pagination;
        state.categoriesFetchedAt = Date.now();
        state.categoriesError = null;
      })
      .addCase(fetchCategoriesWithMarketThunk.rejected, (state, action) => {
        state.isLoadingCategories = false;
        state.categoriesError = action.payload ?? 'Failed to fetch categories with market data';
      });

    // =========================================================================
    // Fetch Carousel Categories Thunk
    // =========================================================================
    builder
      .addCase(fetchCarouselCategoriesThunk.pending, (state) => {
        state.isLoadingCarouselCategories = true;
        state.carouselCategoriesError = null;
      })
      .addCase(fetchCarouselCategoriesThunk.fulfilled, (state, action) => {
        state.isLoadingCarouselCategories = false;
        // Append new categories to existing list (for infinite scroll carousel)
        const existingCategories = state.carouselCategories ?? [];
        const newCategories = action.payload.categories;
        // Avoid duplicates by filtering out existing IDs
        const existingIds = new Set(existingCategories.map((c) => c.id));
        const uniqueNewCategories = newCategories.filter((c) => !existingIds.has(c.id));
        state.carouselCategories = [...existingCategories, ...uniqueNewCategories];
        state.carouselCategoriesPagination = action.payload.pagination;
        state.carouselCategoriesError = null;
      })
      .addCase(fetchCarouselCategoriesThunk.rejected, (state, action) => {
        state.isLoadingCarouselCategories = false;
        state.carouselCategoriesError = action.payload ?? 'Failed to fetch carousel categories';
      });
  },
});

// =============================================================================
// Exports
// =============================================================================

/** Slice actions */
export const {
  setVsCurrency,
  setCategory,
  setSortOrder,
  clearError,
  clearCoinDetailError,
  clearCoinDetail,
  clearMarketChart,
  clearOHLC,
  clearCategories,
  clearCarouselCategories,
  resetCoinGeckoState,
} = coingeckoSlice.actions;

/** Slice reducer */
export default coingeckoSlice.reducer;

/** Re-export types for convenience */
export type { CoinGeckoState } from '@/store/types/coingecko-types';

// =============================================================================
// Selectors
// =============================================================================

import type { RootState } from '@/store';

/**
 * Memoized selector for categories with market data state
 */
export const selectCategoriesState = (state: RootState) => ({
  categoriesWithMarket: state.coingecko.categoriesWithMarket,
  categoriesPagination: state.coingecko.categoriesPagination,
  isLoadingCategories: state.coingecko.isLoadingCategories,
  categoriesError: state.coingecko.categoriesError,
  categoriesFetchedAt: state.coingecko.categoriesFetchedAt,
});

/**
 * Memoized selector for carousel categories state (tokens page)
 */
export const selectCarouselCategoriesState = (state: RootState) => ({
  carouselCategories: state.coingecko.carouselCategories,
  carouselCategoriesPagination: state.coingecko.carouselCategoriesPagination,
  isLoadingCarouselCategories: state.coingecko.isLoadingCarouselCategories,
  carouselCategoriesError: state.coingecko.carouselCategoriesError,
});

/**
 * Memoized selector for coins market state
 */
export const selectCoinsMarketsState = (state: RootState) => ({
  coins: state.coingecko.coins,
  pagination: state.coingecko.pagination,
  isLoading: state.coingecko.isLoading,
  error: state.coingecko.error,
});

/**
 * Memoized selector for coin detail state
 */
export const selectCoinDetailState = (state: RootState) => ({
  coinDetail: state.coingecko.coinDetail,
  isLoadingCoinDetail: state.coingecko.isLoadingCoinDetail,
  coinDetailError: state.coingecko.coinDetailError,
});

/**
 * Memoized selector for market chart state
 */
export const selectMarketChartState = (state: RootState) => ({
  marketChart: state.coingecko.marketChart,
  isLoadingMarketChart: state.coingecko.isLoadingMarketChart,
  marketChartError: state.coingecko.marketChartError,
});