/**
 * CoinGecko Service
 * ==================
 * Service for interacting with CoinGecko API
 *
 * API Documentation: https://docs.coingecko.com
 *
 * Rate Limits (Demo/Free Plan):
 * - Call credits/month: 10K
 * - Rate limit/min: 30
 *
 * Cache/Update Frequency:
 * - Every 60 seconds for Public API (markets endpoint)
 * - Every 45 seconds for Pro API
 *
 * @module lib/coingecko
 */

import endPoints from '@/services/urls';
import type {
    CoinGeckoError,
    CoinMarketData,
    CoinsMarketsParams,
    CoinsMarketsResponse,
    PaginatedResponse,
    PaginationMeta,
} from '@/types/coingecko';

// =============================================================================
// Constants
// =============================================================================

/** CoinGecko Demo API base URL */
const COINGECKO_API_BASE = process.env.NEXT_PUBLIC_COINGECKO_URL!;

/** Default items per page */
const DEFAULT_PER_PAGE = 100;

/** Maximum items per page for /coins/markets (CoinGecko limit: 250) */
const MAX_PER_PAGE = 250;

/** Default currency for market data */
const DEFAULT_CURRENCY = 'usd';

/** Cache duration in milliseconds (60 seconds for markets endpoint) */
const CACHE_DURATION_MS = 60 * 1000;

// =============================================================================
// In-Memory Cache
// =============================================================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache: Map<string, CacheEntry<unknown>> = new Map();

/**
 * Get cached data if still valid
 * @param key - Cache key
 * @returns Cached data or null if expired/not found
 */
function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;

  const isExpired = Date.now() - entry.timestamp > CACHE_DURATION_MS;
  if (isExpired) {
    cache.delete(key);
    return null;
  }

  return entry.data as T;
}

/**
 * Set cache entry
 * @param key - Cache key
 * @param data - Data to cache
 */
function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

/**
 * Generate cache key from params
 * @param params - Request parameters
 * @returns Cache key string
 */
function generateCacheKey(params: CoinsMarketsParams): string {
  return `markets_${params.vs_currency}_${params.page ?? 1}_${params.per_page ?? DEFAULT_PER_PAGE}_${params.order ?? 'market_cap_desc'}_${params.category ?? ''}_${params.ids ?? ''}`;
}

// =============================================================================
// Error Handling
// =============================================================================

/**
 * Error messages for CoinGecko API error codes
 */
const ERROR_MESSAGES: Record<number, string> = {
  400: 'Invalid request. Please check your parameters.',
  401: 'Unauthorized. Please check your API key.',
  403: 'Access forbidden. Your access may be blocked.',
  408: 'Request timeout. Please try again.',
  429: 'Rate limit exceeded. Please wait before making more requests.',
  500: 'CoinGecko server error. Please try again later.',
  503: 'CoinGecko service unavailable. Please check status.coingecko.com',
  1020: 'Access denied. CDN firewall rule violation.',
  10002: 'API key missing. Please provide a valid API key.',
  10005: 'Subscription required. This endpoint requires a paid plan.',
  10010: 'Invalid API key. If using Pro key, use pro-api.coingecko.com',
  10011: 'Invalid API key. If using Demo key, use api.coingecko.com',
};

/**
 * Get human-readable error message for CoinGecko error code
 * @param code - Error code
 * @returns Error message
 */
function getErrorMessage(code: number): string {
  return ERROR_MESSAGES[code] ?? `Unknown error (code: ${code})`;
}

/**
 * Custom error class for CoinGecko API errors
 */
export class CoinGeckoAPIError extends Error {
  code: number;

  constructor(code: number, message?: string) {
    super(message ?? getErrorMessage(code));
    this.name = 'CoinGeckoAPIError';
    this.code = code;
  }
}

// =============================================================================
// API Functions
// =============================================================================

/**
 * Fetch data from CoinGecko API
 * @param endpoint - API endpoint (without base URL)
 * @param params - Query parameters
 * @returns Response data
 * @throws CoinGeckoAPIError on API errors
 */
async function fetchFromCoinGecko<T>(
  endpoint: string,
  params?: Record<string, string | boolean | number | undefined>
): Promise<T> {
  // Build URL with query params
  const url = new URL(`${COINGECKO_API_BASE}${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });
  }

  // Add Demo API key if available
  const apiKey = process.env.NEXT_PUBLIC_COINGECKO_KEY;
  if (apiKey) {
    url.searchParams.set('x_cg_demo_api_key', apiKey);
  }

  // Make request
  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  // Handle errors
  if (!response.ok) {
    let errorCode = response.status;
    let errorMessage: string | undefined;

    try {
      const errorBody = await response.json() as CoinGeckoError;
      if (errorBody?.status?.error_code) {
        errorCode = errorBody.status.error_code;
        errorMessage = errorBody.status.error_message;
      }
    } catch {
      // Ignore JSON parsing errors
    }

    throw new CoinGeckoAPIError(errorCode, errorMessage);
  }

  return response.json() as Promise<T>;
}

// =============================================================================
// Coins Markets Endpoint
// =============================================================================

/**
 * Get coins with market data from CoinGecko
 *
 * Endpoint: GET /coins/markets
 *
 * This endpoint provides price, market cap, volume, and other market data.
 * Results are cached for 60 seconds (CoinGecko's update frequency for free tier).
 *
 * @param params - Market data parameters (vs_currency is required)
 * @returns Array of coins with market data
 *
 * @example
 * // Get top 100 coins by market cap in USD
 * const coins = await getCoinsMarkets({ vs_currency: 'usd' });
 *
 * @example
 * // Get specific coins with sparkline
 * const coins = await getCoinsMarkets({
 *   vs_currency: 'usd',
 *   ids: 'bitcoin,ethereum',
 *   sparkline: true,
 * });
 */
export async function getCoinsMarkets(
  params: CoinsMarketsParams
): Promise<CoinsMarketsResponse> {
  const cacheKey = generateCacheKey(params);

  // Check cache first
  const cached = getCached<CoinsMarketsResponse>(cacheKey);
  if (cached) {
    return cached;
  }

  // Validate per_page (max 250 for this endpoint)
  const perPage = Math.min(MAX_PER_PAGE, Math.max(1, params.per_page ?? DEFAULT_PER_PAGE));

  // Fetch from API
  const data = await fetchFromCoinGecko<CoinsMarketsResponse>(endPoints.COINGECKO_COINS_MARKETS, {
    vs_currency: params.vs_currency,
    ids: params.ids,
    names: params.names,
    symbols: params.symbols,
    include_tokens: params.include_tokens,
    category: params.category,
    order: params.order ?? 'market_cap_desc',
    per_page: perPage,
    page: params.page ?? 1,
    sparkline: params.sparkline,
    price_change_percentage: params.price_change_percentage,
    locale: params.locale,
    precision: params.precision,
  });

  // Cache the result
  setCache(cacheKey, data);

  return data;
}

/**
 * Get paginated coins with market data
 *
 * This function wraps getCoinsMarkets and adds pagination metadata.
 * Note: CoinGecko doesn't provide total count, so we estimate based on response.
 *
 * @param params - Market data parameters with pagination
 * @returns Paginated response with coins and pagination metadata
 */
export async function getPaginatedCoinsMarkets(
  params?: Partial<CoinsMarketsParams>
): Promise<PaginatedResponse<CoinMarketData>> {
  const page = Math.max(1, params?.page ?? 1);
  const perPage = Math.min(MAX_PER_PAGE, Math.max(1, params?.per_page ?? DEFAULT_PER_PAGE));

  // Fetch coins with market data
  const coins = await getCoinsMarkets({
    vs_currency: params?.vs_currency ?? DEFAULT_CURRENCY,
    ids: params?.ids,
    names: params?.names,
    symbols: params?.symbols,
    include_tokens: params?.include_tokens,
    category: params?.category,
    order: params?.order,
    per_page: perPage,
    page,
    sparkline: params?.sparkline,
    price_change_percentage: params?.price_change_percentage ?? '24h',
    locale: params?.locale,
    precision: params?.precision,
  });

  // CoinGecko doesn't provide total count in response
  // Estimate: if we got a full page, there might be more
  const hasNextPage = coins.length === perPage;
  const estimatedTotal = hasNextPage ? (page * perPage) + 1 : ((page - 1) * perPage) + coins.length;

  // Build pagination metadata
  const pagination: PaginationMeta = {
    page,
    perPage,
    total: estimatedTotal,
    totalPages: Math.ceil(estimatedTotal / perPage),
    hasNextPage,
    hasPrevPage: page > 1,
  };

  return {
    data: coins,
    pagination,
  };
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Clear the in-memory cache
 * Useful for testing or manual cache invalidation
 */
export function clearCache(): void {
  cache.clear();
}

/**
 * Check CoinGecko API status
 *
 * Endpoint: GET /ping
 *
 * @returns True if API is healthy
 */
export async function checkApiStatus(): Promise<boolean> {
  try {
    const response = await fetchFromCoinGecko<{ gecko_says: string }>('/ping');
    return !!response?.gecko_says;
  } catch {
    return false;
  }
}
