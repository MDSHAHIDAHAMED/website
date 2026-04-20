/**
 * CoinGecko Types
 * ================
 * TypeScript interfaces for CoinGecko API responses
 *
 * @module types/coingecko
 */

// =============================================================================
// Coin List Types
// =============================================================================

/**
 * Platform contract addresses for a coin
 * Key is the platform name (e.g., "ethereum", "polygon-pos")
 * Value is the contract address
 */
export interface CoinPlatforms {
  [platform: string]: string;
}

/**
 * Coin data from /coins/list endpoint
 */
export interface CoinListItem {
  /** Unique coin identifier (e.g., "bitcoin", "ethereum") */
  id: string;
  /** Coin ticker symbol (e.g., "btc", "eth") */
  symbol: string;
  /** Full coin name (e.g., "Bitcoin", "Ethereum") */
  name: string;
  /** Platform contract addresses (optional, only if include_platform=true) */
  platforms?: CoinPlatforms;
}

/**
 * Response from /coins/list endpoint
 */
export type CoinsListResponse = CoinListItem[];

// =============================================================================
// Pagination Types
// =============================================================================

/**
 * Pagination metadata for paginated responses
 */
export interface PaginationMeta {
  /** Current page number (1-indexed) */
  page: number;
  /** Number of items per page */
  perPage: number;
  /** Total number of items */
  total: number;
  /** Total number of pages */
  totalPages: number;
  /** Whether there is a next page */
  hasNextPage: boolean;
  /** Whether there is a previous page */
  hasPrevPage: boolean;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

// =============================================================================
// API Error Types
// =============================================================================

/**
 * CoinGecko API error codes
 */
export type CoinGeckoErrorCode =
  | 400  // Bad Request
  | 401  // Unauthorized
  | 403  // Forbidden
  | 408  // Timeout
  | 429  // Too many requests
  | 500  // Internal Server Error
  | 503  // Service Unavailable
  | 1020 // Access Denied
  | 10002 // Missing API Key
  | 10005 // Subscription Required
  | 10010 // Invalid API Key (Pro)
  | 10011; // Invalid API Key (Demo)

/**
 * CoinGecko API error response
 */
export interface CoinGeckoError {
  status: {
    error_code: CoinGeckoErrorCode;
    error_message: string;
  };
}

// =============================================================================
// Request Parameter Types
// =============================================================================

/**
 * Sort order for /coins/markets endpoint
 */
export type CoinMarketSortOrder =
  | 'market_cap_asc'
  | 'market_cap_desc'
  | 'volume_asc'
  | 'volume_desc'
  | 'id_asc'
  | 'id_desc';

/**
 * Price change percentage timeframes
 */
export type PriceChangePercentage = '1h' | '24h' | '7d' | '14d' | '30d' | '200d' | '1y';

/**
 * Parameters for /coins/markets endpoint
 */
export interface CoinsMarketsParams {
  /** Target currency (e.g., 'usd', 'eur') - REQUIRED */
  vs_currency: string;
  /** Coin IDs to filter (comma-separated) */
  ids?: string;
  /** Coin names to filter (comma-separated, URL-encoded) */
  names?: string;
  /** Coin symbols to filter (comma-separated) */
  symbols?: string;
  /** Include all tokens for symbol lookups ('top' | 'all') */
  include_tokens?: 'top' | 'all';
  /** Filter by category */
  category?: string;
  /** Sort order (default: market_cap_desc) */
  order?: CoinMarketSortOrder;
  /** Results per page (1-250, default: 100) */
  per_page?: number;
  /** Page number (default: 1) */
  page?: number;
  /** Include sparkline 7 days data */
  sparkline?: boolean;
  /** Include price change percentage (comma-separated: 1h,24h,7d,14d,30d,200d,1y) */
  price_change_percentage?: string;
  /** Locale for language (default: en) */
  locale?: string;
  /** Decimal precision for price */
  precision?: string;
}

// =============================================================================
// Market Coins Types (/coins/markets endpoint)
// =============================================================================

/**
 * Market data for a coin from /coins/markets endpoint
 */
export interface CoinMarketData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: {
    times: number;
    currency: string;
    percentage: number;
  } | null;
  last_updated: string;
  sparkline_in_7d?: {
    price: number[];
  };
}

/**
 * Response from /coins/markets endpoint
 */
export type CoinsMarketsResponse = CoinMarketData[];

// =============================================================================
// Coin Detail Types (/coins/{id} endpoint)
// =============================================================================

/**
 * Parameters for /coins/{id} endpoint
 */
export interface CoinDetailParams {
  /** Coin ID (e.g., 'bitcoin', 'ethereum') - REQUIRED */
  id: string;
  /** Include all localized languages (default: true) */
  localization?: boolean;
  /** Include tickers data (default: true) */
  tickers?: boolean;
  /** Include market data (default: true) */
  market_data?: boolean;
  /** Include community data (default: true) */
  community_data?: boolean;
  /** Include developer data (default: true) */
  developer_data?: boolean;
  /** Include sparkline 7 days data (default: false) */
  sparkline?: boolean;
  /** Include categories details (default: false) */
  include_categories_details?: boolean;
  /** DEX pair display format ('contract_address' | 'symbol') */
  dex_pair_format?: 'contract_address' | 'symbol';
}

/**
 * Localized strings for coin name
 */
export interface CoinLocalization {
  [locale: string]: string;
}

/**
 * Coin description in multiple languages
 */
export interface CoinDescription {
  [locale: string]: string;
}

/**
 * Links associated with a coin
 */
export interface CoinLinks {
  homepage: string[];
  whitepaper?: string;
  blockchain_site: string[];
  official_forum_url: string[];
  chat_url: string[];
  announcement_url: string[];
  snapshot_url?: string | null;
  twitter_screen_name?: string;
  facebook_username?: string;
  bitcointalk_thread_identifier?: string | null;
  telegram_channel_identifier?: string;
  subreddit_url?: string;
  repos_url?: {
    github?: string[];
    bitbucket?: string[];
  };
}

/**
 * Coin image URLs at different sizes
 */
export interface CoinImages {
  thumb: string;
  small: string;
  large: string;
}

/**
 * Price data in multiple currencies
 */
export interface MultiCurrencyPrice {
  [currency: string]: number;
}

/**
 * Date data in multiple currencies
 */
export interface MultiCurrencyDate {
  [currency: string]: string;
}

/**
 * Detailed market data for a coin
 */
export interface CoinDetailMarketData {
  current_price: MultiCurrencyPrice;
  total_value_locked?: number | null;
  mcap_to_tvl_ratio?: number | null;
  fdv_to_tvl_ratio?: number | null;
  roi?: {
    times: number;
    currency: string;
    percentage: number;
  } | null;
  ath: MultiCurrencyPrice;
  ath_change_percentage: MultiCurrencyPrice;
  ath_date: MultiCurrencyDate;
  atl: MultiCurrencyPrice;
  atl_change_percentage: MultiCurrencyPrice;
  atl_date: MultiCurrencyDate;
  market_cap: MultiCurrencyPrice;
  market_cap_rank: number;
  fully_diluted_valuation: MultiCurrencyPrice;
  market_cap_fdv_ratio?: number;
  total_volume: MultiCurrencyPrice;
  high_24h: MultiCurrencyPrice;
  low_24h: MultiCurrencyPrice;
  price_change_24h: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d: number;
  price_change_percentage_14d: number;
  price_change_percentage_30d: number;
  price_change_percentage_60d: number;
  price_change_percentage_200d: number;
  price_change_percentage_1y: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  price_change_24h_in_currency?: MultiCurrencyPrice;
  price_change_percentage_1h_in_currency?: MultiCurrencyPrice;
  price_change_percentage_24h_in_currency?: MultiCurrencyPrice;
  price_change_percentage_7d_in_currency?: MultiCurrencyPrice;
  price_change_percentage_14d_in_currency?: MultiCurrencyPrice;
  price_change_percentage_30d_in_currency?: MultiCurrencyPrice;
  price_change_percentage_60d_in_currency?: MultiCurrencyPrice;
  price_change_percentage_200d_in_currency?: MultiCurrencyPrice;
  price_change_percentage_1y_in_currency?: MultiCurrencyPrice;
  market_cap_change_24h_in_currency?: MultiCurrencyPrice;
  market_cap_change_percentage_24h_in_currency?: MultiCurrencyPrice;
  total_supply: number | null;
  max_supply: number | null;
  circulating_supply: number;
  last_updated: string;
}

/**
 * Community data for a coin
 */
export interface CoinCommunityData {
  facebook_likes?: number | null;
  reddit_average_posts_48h?: number;
  reddit_average_comments_48h?: number;
  reddit_subscribers?: number;
  reddit_accounts_active_48h?: number;
  telegram_channel_user_count?: number | null;
}

/**
 * Developer data for a coin
 */
export interface CoinDeveloperData {
  forks?: number;
  stars?: number;
  subscribers?: number;
  total_issues?: number;
  closed_issues?: number;
  pull_requests_merged?: number;
  pull_request_contributors?: number;
  code_additions_deletions_4_weeks?: {
    additions?: number;
    deletions?: number;
  };
  commit_count_4_weeks?: number;
  last_4_weeks_commit_activity_series?: number[];
}

/**
 * Ticker market info
 */
export interface TickerMarket {
  name: string;
  identifier: string;
  has_trading_incentive: boolean;
}

/**
 * Converted price/volume data
 */
export interface ConvertedData {
  btc: number;
  eth: number;
  usd: number;
}

/**
 * Ticker data for a coin
 */
export interface CoinTicker {
  base: string;
  target: string;
  market: TickerMarket;
  last: number;
  volume: number;
  converted_last: ConvertedData;
  converted_volume: ConvertedData;
  trust_score: string;
  bid_ask_spread_percentage: number;
  timestamp: string;
  last_traded_at: string;
  last_fetch_at: string;
  is_anomaly: boolean;
  is_stale: boolean;
  trade_url?: string;
  token_info_url?: string | null;
  coin_id: string;
  target_coin_id?: string;
}

/**
 * Category details for a coin
 */
export interface CoinCategoryDetail {
  id: string;
  name: string;
}

/**
 * ICO data for a coin
 */
export interface CoinIcoData {
  ico_start_date?: string;
  ico_end_date?: string;
  short_desc?: string;
  description?: string;
  links?: Record<string, string>;
  softcap_currency?: string;
  hardcap_currency?: string;
  total_raised_currency?: string;
  softcap_amount?: number;
  hardcap_amount?: number;
  total_raised?: number;
  quote_pre_sale_currency?: string;
  base_pre_sale_amount?: number;
  quote_pre_sale_amount?: number;
  quote_public_sale_currency?: string;
  base_public_sale_amount?: number;
  quote_public_sale_amount?: number;
  accepting_currencies?: string;
  country_origin?: string;
  pre_sale_start_date?: string;
  pre_sale_end_date?: string;
  whitelist_url?: string;
  whitelist_start_date?: string;
  whitelist_end_date?: string;
  bounty_detail_url?: string;
  amount_for_sale?: number;
  kyc_required?: boolean;
  whitelist_available?: boolean;
  pre_sale_available?: boolean;
  pre_sale_ended?: boolean;
}

/**
 * Detail platforms info
 */
export interface DetailPlatform {
  decimal_place: number | null;
  contract_address: string;
}

/**
 * Complete coin detail from /coins/{id} endpoint
 */
export interface CoinDetail {
  /** Unique coin identifier */
  id: string;
  /** Coin ticker symbol */
  symbol: string;
  /** Full coin name */
  name: string;
  /** Web slug for URLs */
  web_slug?: string;
  /** Asset platform ID */
  asset_platform_id?: string | null;
  /** Platform contract addresses */
  platforms?: CoinPlatforms;
  /** Detailed platform info with decimals */
  detail_platforms?: Record<string, DetailPlatform>;
  /** Block time in minutes */
  block_time_in_minutes?: number;
  /** Hashing algorithm */
  hashing_algorithm?: string | null;
  /** Categories */
  categories?: string[];
  /** Detailed categories */
  categories_details?: CoinCategoryDetail[];
  /** Preview listing flag */
  preview_listing?: boolean;
  /** Public notice */
  public_notice?: string | null;
  /** Additional notices */
  additional_notices?: string[];
  /** Localized names */
  localization?: CoinLocalization;
  /** Description in multiple languages */
  description?: CoinDescription;
  /** Links */
  links?: CoinLinks;
  /** Image URLs */
  image?: CoinImages;
  /** Country of origin */
  country_origin?: string;
  /** Genesis date */
  genesis_date?: string | null;
  /** Sentiment votes up percentage */
  sentiment_votes_up_percentage?: number;
  /** Sentiment votes down percentage */
  sentiment_votes_down_percentage?: number;
  /** ICO data */
  ico_data?: CoinIcoData;
  /** Watchlist portfolio users count */
  watchlist_portfolio_users?: number;
  /** Market cap rank */
  market_cap_rank?: number;
  /** Market data */
  market_data?: CoinDetailMarketData;
  /** Community data */
  community_data?: CoinCommunityData;
  /** Developer data */
  developer_data?: CoinDeveloperData;
  /** Status updates */
  status_updates?: string[];
  /** Last updated timestamp */
  last_updated?: string;
  /** Exchange tickers (limited to 100) */
  tickers?: CoinTicker[];
}

// =============================================================================
// Market Chart Types (/coins/{id}/market_chart endpoint)
// =============================================================================

/**
 * Time series data point [timestamp, value]
 */
export type TimeSeriesDataPoint = [number, number];

/**
 * Parameters for /coins/{id}/market_chart endpoint
 */
export interface MarketChartParams {
  /** Coin ID (e.g., 'bitcoin', 'ethereum') - REQUIRED */
  id: string;
  /** Target currency (e.g., 'usd', 'eur') - REQUIRED */
  vs_currency: string;
  /** Data up to number of days ago - REQUIRED */
  days: string | number;
  /** Data interval ('daily' or empty for auto granularity) */
  interval?: 'daily';
  /** Decimal place for price value */
  precision?: string;
}

/**
 * Response from /coins/{id}/market_chart endpoint
 */
export interface MarketChartResponse {
  /** Price data points [timestamp, price] */
  prices: TimeSeriesDataPoint[];
  /** Market cap data points [timestamp, market_cap] */
  market_caps: TimeSeriesDataPoint[];
  /** 24h volume data points [timestamp, volume] */
  total_volumes: TimeSeriesDataPoint[];
}

// =============================================================================
// Market Chart Range Types (/coins/{id}/market_chart/range endpoint)
// =============================================================================

/**
 * Parameters for /coins/{id}/market_chart/range endpoint
 */
export interface MarketChartRangeParams {
  /** Coin ID (e.g., 'bitcoin', 'ethereum') - REQUIRED */
  id: string;
  /** Target currency (e.g., 'usd', 'eur') - REQUIRED */
  vs_currency: string;
  /** Starting date in UNIX timestamp - REQUIRED */
  from: number;
  /** Ending date in UNIX timestamp - REQUIRED */
  to: number;
  /** Decimal place for price value */
  precision?: string;
}

/**
 * Response from /coins/{id}/market_chart/range endpoint (same as MarketChartResponse)
 */
export type MarketChartRangeResponse = MarketChartResponse;

// =============================================================================
// OHLC Types (/coins/{id}/ohlc endpoint)
// =============================================================================

/**
 * Valid days values for OHLC endpoint
 */
export type OHLCDays = '1' | '7' | '14' | '30' | '90' | '180' | '365';

/**
 * Parameters for /coins/{id}/ohlc endpoint
 */
export interface OHLCParams {
  /** Coin ID (e.g., 'bitcoin', 'ethereum') - REQUIRED */
  id: string;
  /** Target currency (e.g., 'usd', 'eur') - REQUIRED */
  vs_currency: string;
  /** Data up to number of days ago - REQUIRED */
  days: OHLCDays;
  /** Decimal place for price value */
  precision?: string;
}

/**
 * OHLC data point [timestamp, open, high, low, close]
 */
export type OHLCDataPoint = [number, number, number, number, number];

/**
 * Response from /coins/{id}/ohlc endpoint
 */
export type OHLCResponse = OHLCDataPoint[];

// =============================================================================
// Categories Types
// =============================================================================

/**
 * Category sort order options
 */
export type CategorySortOrder =
  | 'market_cap_desc'
  | 'market_cap_asc'
  | 'name_desc'
  | 'name_asc'
  | 'market_cap_change_24h_desc'
  | 'market_cap_change_24h_asc';

/**
 * Category item from /coins/categories/list endpoint
 */
export interface CategoryListItem {
  /** Category ID */
  category_id: string;
  /** Category name */
  name: string;
}

/**
 * Response from /coins/categories/list endpoint
 */
export type CategoriesListResponse = CategoryListItem[];

/**
 * Parameters for /coins/categories endpoint
 */
export interface CategoriesParams {
  /** Sort order (default: market_cap_desc) */
  order?: CategorySortOrder;
}

/**
 * Category with market data from /coins/categories endpoint
 */
export interface CategoryWithMarketData {
  /** Category ID */
  id: string;
  /** Category name */
  name: string;
  /** Category market cap */
  market_cap: number;
  /** Market cap change in 24 hours (percentage) */
  market_cap_change_24h: number;
  /** Category description */
  content?: string;
  /** IDs of top 3 coins in the category */
  top_3_coins_id?: string[];
  /** Image URLs of top 3 coins in the category */
  top_3_coins?: string[];
  /** 24h trading volume */
  volume_24h: number;
  /** Last updated timestamp */
  updated_at: string;
}

/**
 * Response from /coins/categories endpoint
 */
export type CategoriesResponse = CategoryWithMarketData[];

