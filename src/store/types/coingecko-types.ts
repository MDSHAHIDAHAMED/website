/**
 * CoinGecko Redux Types
 * =====================
 * Type definitions for CoinGecko slice and thunks
 *
 * @module store/types/coingecko-types
 */

import type {
    CategoriesListResponse,
    CategoriesResponse,
    CategorySortOrder,
    CoinDetail,
    CoinMarketData,
    CoinMarketSortOrder,
    MarketChartResponse,
    OHLCDays,
    OHLCResponse,
    PaginationMeta,
} from '@/types/coingecko';

// =============================================================================
// Thunk Payload Types
// =============================================================================

/**
 * Parameters for fetching paginated coins with market data
 */
export interface FetchCoinsMarketsParams {
  /** Page number (1-indexed) */
  page?: number;
  /** Items per page (default: 100, max: 250) */
  perPage?: number;
  /** Target currency (default: 'usd') */
  vsCurrency?: string;
  /** Sort order (default: 'market_cap_desc') */
  order?: CoinMarketSortOrder;
  /** Filter by category */
  category?: string;
  /** Filter by coin IDs (comma-separated) */
  ids?: string;
  /** Include 7-day sparkline data */
  sparkline?: boolean;
  /** Price change percentage timeframes (default: '24h') */
  priceChangePercentage?: string;
}

/**
 * Response from coins markets API
 */
export interface FetchCoinsMarketsResponse {
  coins: CoinMarketData[];
  pagination: PaginationMeta;
}

/**
 * Parameters for fetching coin detail by ID
 */
export interface FetchCoinDetailParams {
  /** Coin ID (e.g., 'bitcoin', 'ethereum') - REQUIRED */
  id: string;
  /** Include localized languages (default: false for performance) */
  localization?: boolean;
  /** Include tickers data (default: false for performance) */
  tickers?: boolean;
  /** Include market data (default: true) */
  marketData?: boolean;
  /** Include community data (default: false) */
  communityData?: boolean;
  /** Include developer data (default: false) */
  developerData?: boolean;
  /** Include sparkline 7 days data (default: false) */
  sparkline?: boolean;
}

/**
 * Parameters for fetching market chart data
 */
export interface FetchMarketChartParams {
  /** Coin ID (e.g., 'bitcoin', 'ethereum') - REQUIRED */
  id: string;
  /** Target currency (default: 'usd') */
  vsCurrency?: string;
  /** Data up to number of days ago - REQUIRED */
  days: string | number;
  /** Data interval ('daily' or empty for auto) */
  interval?: 'daily';
}

/**
 * Parameters for fetching market chart range data
 */
export interface FetchMarketChartRangeParams {
  /** Coin ID (e.g., 'bitcoin', 'ethereum') - REQUIRED */
  id: string;
  /** Target currency (default: 'usd') */
  vsCurrency?: string;
  /** Starting date in UNIX timestamp - REQUIRED */
  from: number;
  /** Ending date in UNIX timestamp - REQUIRED */
  to: number;
}

/**
 * Parameters for fetching OHLC data
 */
export interface FetchOHLCParams {
  /** Coin ID (e.g., 'bitcoin', 'ethereum') - REQUIRED */
  id: string;
  /** Target currency (default: 'usd') */
  vsCurrency?: string;
  /** Data up to number of days ago - REQUIRED */
  days: OHLCDays;
}

/**
 * Parameters for fetching categories
 */
export interface FetchCategoriesParams {
  /** Type of response: 'list' for ID map, 'market' for full data */
  type?: 'list' | 'market';
  /** Sort order for market type */
  order?: CategorySortOrder;
  /** Page number (1-indexed) */
  page?: number;
  /** Items per page (default: 10) */
  perPage?: number;
}

/**
 * Response from categories with market data API (paginated)
 */
export interface FetchCategoriesWithMarketResponse {
  categories: CategoriesResponse;
  pagination: PaginationMeta;
}

// =============================================================================
// Slice State Types
// =============================================================================

/**
 * CoinGecko Slice State
 */
export interface CoinGeckoState {
  // Coins market data
  coins: CoinMarketData[];
  pagination: PaginationMeta | null;

  // Coin detail data
  coinDetail: CoinDetail | null;
  coinDetailId: string | null;

  // Market chart data
  marketChart: MarketChartResponse | null;
  marketChartCoinId: string | null;

  // OHLC data
  ohlc: OHLCResponse | null;
  ohlcCoinId: string | null;

  // Categories data (full listing)
  categoriesList: CategoriesListResponse | null;
  categoriesWithMarket: CategoriesResponse | null;
  categoriesPagination: PaginationMeta | null;

  // Categories carousel data (separate state for tokens page carousel)
  carouselCategories: CategoriesResponse | null;
  carouselCategoriesPagination: PaginationMeta | null;
  isLoadingCarouselCategories: boolean;
  carouselCategoriesError: string | null;

  // Loading states
  isLoading: boolean;
  isRefreshing: boolean;
  isLoadingCoinDetail: boolean;
  isLoadingMarketChart: boolean;
  isLoadingOHLC: boolean;
  isLoadingCategories: boolean;

  // Error state
  error: string | null;
  coinDetailError: string | null;
  marketChartError: string | null;
  ohlcError: string | null;
  categoriesError: string | null;

  // Current filters
  vsCurrency: string;
  category: string | null;
  sortOrder: CoinMarketSortOrder;

  // Last fetch timestamp (for cache invalidation)
  lastFetchedAt: number | null;
  coinDetailFetchedAt: number | null;
  marketChartFetchedAt: number | null;
  ohlcFetchedAt: number | null;
  categoriesFetchedAt: number | null;
}

/**
 * Initial state for CoinGecko slice
 */
export const initialCoinGeckoState: CoinGeckoState = {
  // Markets list state
  coins: [],
  pagination: null,
  isLoading: false,
  isRefreshing: false,
  error: null,
  lastFetchedAt: null,

  // Coin detail state
  coinDetail: null,
  coinDetailId: null,
  isLoadingCoinDetail: false,
  coinDetailError: null,
  coinDetailFetchedAt: null,

  // Market chart state
  marketChart: null,
  marketChartCoinId: null,
  isLoadingMarketChart: false,
  marketChartError: null,
  marketChartFetchedAt: null,

  // OHLC state
  ohlc: null,
  ohlcCoinId: null,
  isLoadingOHLC: false,
  ohlcError: null,
  ohlcFetchedAt: null,

  // Categories state (full listing)
  categoriesList: null,
  categoriesWithMarket: null,
  categoriesPagination: null,
  isLoadingCategories: false,
  categoriesError: null,
  categoriesFetchedAt: null,

  // Categories carousel state
  carouselCategories: null,
  carouselCategoriesPagination: null,
  isLoadingCarouselCategories: false,
  carouselCategoriesError: null,

  // Filters
  vsCurrency: 'usd',
  category: null,
  sortOrder: 'market_cap_desc',
};

