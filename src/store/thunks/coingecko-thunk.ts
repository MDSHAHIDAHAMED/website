/**
 * CoinGecko Thunks
 * ================
 * Async thunks for CoinGecko API operations
 *
 * @module store/thunks/coingecko-thunk
 */

import { createAsyncThunk } from '@reduxjs/toolkit';

import type {
    FetchCategoriesParams,
    FetchCategoriesWithMarketResponse,
    FetchCoinDetailParams,
    FetchCoinsMarketsParams,
    FetchCoinsMarketsResponse,
    FetchMarketChartParams,
    FetchMarketChartRangeParams,
    FetchOHLCParams,
} from '@/store/types/coingecko-types';
import type {
    CategoriesListResponse,
    CoinDetail,
    CoinMarketData,
    MarketChartResponse,
    OHLCResponse,
    PaginatedResponse,
} from '@/types/coingecko';
import { CATEGORIES_PER_PAGE } from '@/components/sections/category-carousel-section';

// =============================================================================
// Constants
// =============================================================================

/** API endpoint for market coins */
const MARKET_COINS_ENDPOINT = '/api/market-coins';

/** API endpoint for coin detail */
const COIN_DETAIL_ENDPOINT = '/api/coin-detail';

/** API endpoint for market chart */
const COIN_CHART_ENDPOINT = '/api/coin-chart';

/** API endpoint for market chart range */
const COIN_CHART_RANGE_ENDPOINT = '/api/coin-chart-range';

/** API endpoint for OHLC */
const COIN_OHLC_ENDPOINT = '/api/coin-ohlc';

/** API endpoint for categories */
const CATEGORIES_ENDPOINT = '/api/categories';

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Build query string from params object
 * @param params - Query parameters
 * @returns Query string (without leading ?)
 */
function buildQueryString(params: Record<string, string | number | boolean | undefined>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      searchParams.set(key, String(value));
    }
  });

  return searchParams.toString();
}

// =============================================================================
// Thunks
// =============================================================================

/**
 * Fetch Coins Markets Thunk
 * =========================
 * Fetches paginated coins with market data from CoinGecko API via internal endpoint.
 *
 * @param params - Pagination and filter parameters
 * @returns Coins market data with pagination metadata
 *
 * @example
 * dispatch(fetchCoinsMarketsThunk({ page: 1, perPage: 50, vsCurrency: 'usd' }));
 */
export const fetchCoinsMarketsThunk = createAsyncThunk<
  FetchCoinsMarketsResponse,
  FetchCoinsMarketsParams | undefined,
  { rejectValue: string }
>(
  'coingecko/fetchCoinsMarkets',
  async (params, { rejectWithValue }) => {
    try {
      // Build query parameters
      const queryParams = buildQueryString({
        page: params?.page,
        per_page: params?.perPage,
        vs_currency: params?.vsCurrency ?? 'usd',
        order: params?.order,
        category: params?.category,
        ids: params?.ids,
        sparkline: params?.sparkline,
        price_change_percentage: params?.priceChangePercentage ?? '24h',
      });

      // Build full URL
      const url = queryParams
        ? `${MARKET_COINS_ENDPOINT}?${queryParams}`
        : MARKET_COINS_ENDPOINT;

      // Fetch from API
      const response = await fetch(url);

      // Handle non-OK responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error ?? `Failed to fetch coins (${response.status})`;
        return rejectWithValue(errorMessage);
      }

      // Parse response
      const data: PaginatedResponse<CoinMarketData> = await response.json();

      return {
        coins: data.data,
        pagination: data.pagination,
      };
    } catch (error) {
      // Handle network or parsing errors
      const errorMessage = error instanceof Error
        ? error.message
        : 'An unexpected error occurred while fetching coins';

      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Refresh Coins Markets Thunk
 * ===========================
 * Same as fetchCoinsMarketsThunk but intended for pull-to-refresh scenarios.
 * Uses same logic but different action type for UI distinction.
 *
 * @param params - Pagination and filter parameters
 * @returns Coins market data with pagination metadata
 */
export const refreshCoinsMarketsThunk = createAsyncThunk<
  FetchCoinsMarketsResponse,
  FetchCoinsMarketsParams | undefined,
  { rejectValue: string }
>(
  'coingecko/refreshCoinsMarkets',
  async (params, { rejectWithValue }) => {
    try {
      const queryParams = buildQueryString({
        page: params?.page,
        per_page: params?.perPage,
        vs_currency: params?.vsCurrency ?? 'usd',
        order: params?.order,
        category: params?.category,
        ids: params?.ids,
        sparkline: params?.sparkline,
        price_change_percentage: params?.priceChangePercentage ?? '24h',
      });

      const url = queryParams
        ? `${MARKET_COINS_ENDPOINT}?${queryParams}`
        : MARKET_COINS_ENDPOINT;

      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error ?? `Failed to refresh coins (${response.status})`;
        return rejectWithValue(errorMessage);
      }

      const data: PaginatedResponse<CoinMarketData> = await response.json();

      return {
        coins: data.data,
        pagination: data.pagination,
      };
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : 'An unexpected error occurred while refreshing coins';

      return rejectWithValue(errorMessage);
    }
  }
);

// =============================================================================
// Coin Detail Thunk
// =============================================================================

/**
 * Fetch Coin Detail Thunk
 * =======================
 * Fetches detailed coin data by ID from CoinGecko API via internal endpoint.
 *
 * This provides all metadata (image, websites, socials, description,
 * contract address, etc.) and market data (price, ATH, exchange tickers, etc.)
 * for a specific coin.
 *
 * @param params - Coin detail parameters (id is required)
 * @returns Complete coin detail data
 *
 * @example
 * dispatch(fetchCoinDetailThunk({ id: 'bitcoin' }));
 *
 * @example
 * // With minimal data for faster loading
 * dispatch(fetchCoinDetailThunk({
 *   id: 'ethereum',
 *   localization: false,
 *   tickers: false,
 *   communityData: false,
 *   developerData: false,
 * }));
 */
export const fetchCoinDetailThunk = createAsyncThunk<
  CoinDetail,
  FetchCoinDetailParams,
  { rejectValue: string }
>(
  'coingecko/fetchCoinDetail',
  async (params, { rejectWithValue }) => {
    try {
      // Validate required param
      if (!params.id) {
        return rejectWithValue('Coin ID is required');
      }

      // Build query parameters
      const queryParams = buildQueryString({
        id: params.id,
        localization: params.localization ?? false, // Default false for performance
        tickers: params.tickers ?? false, // Default false for performance
        market_data: params.marketData ?? true, // Default true - most common use case
        community_data: params.communityData ?? false,
        developer_data: params.developerData ?? false,
        sparkline: params.sparkline ?? false,
      });

      // Build full URL
      const url = `${COIN_DETAIL_ENDPOINT}?${queryParams}`;

      // Fetch from API
      const response = await fetch(url);

      // Handle non-OK responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error ?? `Failed to fetch coin detail (${response.status})`;
        return rejectWithValue(errorMessage);
      }

      // Parse and return response
      const data: CoinDetail = await response.json();
      return data;
    } catch (error) {
      // Handle network or parsing errors
      const errorMessage = error instanceof Error
        ? error.message
        : 'An unexpected error occurred while fetching coin detail';

      return rejectWithValue(errorMessage);
    }
  }
);

// =============================================================================
// Market Chart Thunk
// =============================================================================

/**
 * Fetch Market Chart Thunk
 * ========================
 * Fetches historical chart data for a coin.
 *
 * Auto granularity based on days:
 * - 1 day: 5-minutely data
 * - 2-90 days: hourly data
 * - Above 90 days: daily data
 *
 * @param params - Market chart parameters
 * @returns Historical chart data with prices, market_caps, total_volumes
 *
 * @example
 * dispatch(fetchMarketChartThunk({ id: 'bitcoin', days: 7 }));
 */
export const fetchMarketChartThunk = createAsyncThunk<
  MarketChartResponse,
  FetchMarketChartParams,
  { rejectValue: string }
>(
  'coingecko/fetchMarketChart',
  async (params, { rejectWithValue }) => {
    try {
      if (!params.id) {
        return rejectWithValue('Coin ID is required');
      }

      const queryParams = buildQueryString({
        id: params.id,
        vs_currency: params.vsCurrency ?? 'usd',
        days: String(params.days),
        interval: params.interval,
      });

      const url = `${COIN_CHART_ENDPOINT}?${queryParams}`;
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return rejectWithValue(errorData.error ?? `Failed to fetch chart data (${response.status})`);
      }

      return await response.json();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch market chart';
      return rejectWithValue(errorMessage);
    }
  }
);

// =============================================================================
// Market Chart Range Thunk
// =============================================================================

/**
 * Fetch Market Chart Range Thunk
 * ==============================
 * Fetches historical chart data for a coin within a specific time range.
 *
 * @param params - Market chart range parameters
 * @returns Historical chart data within specified range
 *
 * @example
 * dispatch(fetchMarketChartRangeThunk({
 *   id: 'bitcoin',
 *   from: 1704067200,
 *   to: 1706745600,
 * }));
 */
export const fetchMarketChartRangeThunk = createAsyncThunk<
  MarketChartResponse,
  FetchMarketChartRangeParams,
  { rejectValue: string }
>(
  'coingecko/fetchMarketChartRange',
  async (params, { rejectWithValue }) => {
    try {
      if (!params.id) {
        return rejectWithValue('Coin ID is required');
      }
      if (!params.from || !params.to) {
        return rejectWithValue('From and to timestamps are required');
      }

      const queryParams = buildQueryString({
        id: params.id,
        vs_currency: params.vsCurrency ?? 'usd',
        from: params.from,
        to: params.to,
      });

      const url = `${COIN_CHART_RANGE_ENDPOINT}?${queryParams}`;
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return rejectWithValue(errorData.error ?? `Failed to fetch chart range data (${response.status})`);
      }

      return await response.json();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch market chart range';
      return rejectWithValue(errorMessage);
    }
  }
);

// =============================================================================
// OHLC Thunk
// =============================================================================

/**
 * Fetch OHLC Thunk
 * ================
 * Fetches OHLC (Open, High, Low, Close) chart data for a coin.
 *
 * Data granularity (candle's body):
 * - 1-2 days: 30 minutes
 * - 3-30 days: 4 hours
 * - 31+ days: 4 days
 *
 * @param params - OHLC parameters
 * @returns Array of OHLC data points [timestamp, open, high, low, close]
 *
 * @example
 * dispatch(fetchOHLCThunk({ id: 'bitcoin', days: '30' }));
 */
export const fetchOHLCThunk = createAsyncThunk<
  OHLCResponse,
  FetchOHLCParams,
  { rejectValue: string }
>(
  'coingecko/fetchOHLC',
  async (params, { rejectWithValue }) => {
    try {
      if (!params.id) {
        return rejectWithValue('Coin ID is required');
      }

      const queryParams = buildQueryString({
        id: params.id,
        vs_currency: params.vsCurrency ?? 'usd',
        days: params.days,
      });

      const url = `${COIN_OHLC_ENDPOINT}?${queryParams}`;
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return rejectWithValue(errorData.error ?? `Failed to fetch OHLC data (${response.status})`);
      }

      return await response.json();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch OHLC data';
      return rejectWithValue(errorMessage);
    }
  }
);

// =============================================================================
// Categories Thunks
// =============================================================================

/**
 * Fetch Categories List Thunk
 * ===========================
 * Fetches list of all coin categories (ID map only).
 * Useful for populating filter dropdowns.
 *
 * @returns Array of category items with id and name
 *
 * @example
 * dispatch(fetchCategoriesListThunk());
 */
export const fetchCategoriesListThunk = createAsyncThunk<
  CategoriesListResponse,
  void,
  { rejectValue: string }
>(
  'coingecko/fetchCategoriesList',
  async (_, { rejectWithValue }) => {
    try {
      const url = `${CATEGORIES_ENDPOINT}?type=list`;
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return rejectWithValue(errorData.error ?? `Failed to fetch categories (${response.status})`);
      }

      return await response.json();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch categories list';
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Fetch Categories with Market Data Thunk
 * =======================================
 * Fetches paginated coin categories with market data (market cap, volume, top coins).
 *
 * @param params - Sort order and pagination parameters
 * @returns Paginated categories with market data
 *
 * @example
 * dispatch(fetchCategoriesWithMarketThunk({ order: 'market_cap_desc', page: 1, perPage: 10 }));
 */
export const fetchCategoriesWithMarketThunk = createAsyncThunk<
  FetchCategoriesWithMarketResponse,
  FetchCategoriesParams | undefined,
  { rejectValue: string }
>(
  'coingecko/fetchCategoriesWithMarket',
  async (params, { rejectWithValue }) => {
    try {
      const queryParams = buildQueryString({
        type: 'market',
        order: params?.order,
        page: params?.page,
        per_page: params?.perPage,
      });

      const url = `${CATEGORIES_ENDPOINT}?${queryParams}`;
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return rejectWithValue(errorData.error ?? `Failed to fetch categories (${response.status})`);
      }

      return await response.json();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch categories with market data';
      return rejectWithValue(errorMessage);
    }
  }
);

// =============================================================================
// Carousel Categories Thunk
// =============================================================================

/**
 * Fetch Carousel Categories Thunk
 * ================================
 * Fetches paginated categories for the carousel on tokens page.
 * Uses separate state from the full listing to avoid conflicts.
 *
 * @param params - Pagination parameters (page, perPage defaults to 10)
 * @returns Paginated categories with market data
 *
 * @example
 * dispatch(fetchCarouselCategoriesThunk({ page: 1, perPage: 10 }));
 */
export const fetchCarouselCategoriesThunk = createAsyncThunk<
  FetchCategoriesWithMarketResponse,
  FetchCategoriesParams | undefined,
  { rejectValue: string }
>(
  'coingecko/fetchCarouselCategories',
  async (params, { rejectWithValue }) => {
    try {
      const queryParams = buildQueryString({
        type: 'market',
        order: params?.order ?? 'market_cap_desc',
        page: params?.page ?? 1,
        per_page: params?.perPage ?? CATEGORIES_PER_PAGE,
      });

      const url = `${CATEGORIES_ENDPOINT}?${queryParams}`;
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return rejectWithValue(errorData.error ?? `Failed to fetch carousel categories (${response.status})`);
      }

      return await response.json();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch carousel categories';
      return rejectWithValue(errorMessage);
    }
  }
);

// =============================================================================
// Legacy Exports (for backwards compatibility)
// =============================================================================

/** @deprecated Use fetchCoinsMarketsThunk instead */
export const fetchCoinsListThunk = fetchCoinsMarketsThunk;

/** @deprecated Use refreshCoinsMarketsThunk instead */
export const refreshCoinsListThunk = refreshCoinsMarketsThunk;
