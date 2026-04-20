/**
 * Market Coins API Route
 * =======================
 * Provides paginated coin listing with market data from CoinGecko
 *
 * Endpoint: GET /api/market-coins
 *
 * Query Parameters:
 * - page: Page number (1-indexed, default: 1)
 * - per_page: Items per page (default: 100, max: 250)
 * - vs_currency: Target currency (default: 'usd')
 * - order: Sort order (default: 'market_cap_desc')
 * - category: Filter by category
 * - ids: Filter by coin IDs (comma-separated)
 * - sparkline: Include 7-day sparkline data (default: false)
 * - price_change_percentage: Price change timeframes (default: '24h')
 *
 * Response:
 * {
 *   data: CoinMarketData[],
 *   pagination: {
 *     page: number,
 *     perPage: number,
 *     total: number,
 *     totalPages: number,
 *     hasNextPage: boolean,
 *     hasPrevPage: boolean
 *   }
 * }
 *
 * Error Response:
 * {
 *   error: string,
 *   code?: number
 * }
 *
 * @module api/market-coins
 */

import { NextRequest, NextResponse } from 'next/server';

import { CoinGeckoAPIError, getPaginatedCoinsMarkets } from '@/lib/coingecko';
import type { CoinMarketSortOrder, CoinsMarketsParams } from '@/types/coingecko';

// =============================================================================
// Route Configuration
// =============================================================================

/**
 * Force dynamic rendering for this route.
 * Required because we use request.url to parse query parameters.
 */
export const dynamic = 'force-dynamic';

// =============================================================================
// Constants
// =============================================================================

/** Default page number */
const DEFAULT_PAGE = 1;

/** Default items per page */
const DEFAULT_PER_PAGE = 100;

/** Maximum items per page (CoinGecko limit for /coins/markets) */
const MAX_PER_PAGE = 250;

/** Default currency */
const DEFAULT_CURRENCY = 'usd';

/** Valid sort orders */
const VALID_SORT_ORDERS: CoinMarketSortOrder[] = [
  'market_cap_asc',
  'market_cap_desc',
  'volume_asc',
  'volume_desc',
  'id_asc',
  'id_desc',
];

// =============================================================================
// Types
// =============================================================================

/** Parsed query parameters */
interface ParsedParams {
  page: number;
  perPage: number;
  vsCurrency: string;
  order: CoinMarketSortOrder | null;
  category: string | undefined;
  ids: string | undefined;
  sparkline: boolean;
  priceChangePercentage: string;
}

/** Validation result */
type ValidationResult = { valid: true } | { valid: false; response: NextResponse };

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Parse query parameters from request URL
 */
function parseQueryParams(searchParams: URLSearchParams): ParsedParams {
  return {
    page: Number.parseInt(searchParams.get('page') ?? String(DEFAULT_PAGE), 10),
    perPage: Number.parseInt(searchParams.get('per_page') ?? String(DEFAULT_PER_PAGE), 10),
    vsCurrency: searchParams.get('vs_currency') ?? DEFAULT_CURRENCY,
    order: searchParams.get('order') as CoinMarketSortOrder | null,
    category: searchParams.get('category') ?? undefined,
    ids: searchParams.get('ids') ?? undefined,
    sparkline: searchParams.get('sparkline') === 'true',
    priceChangePercentage: searchParams.get('price_change_percentage') ?? '24h',
  };
}

/**
 * Validate parsed parameters
 * Returns error response if validation fails
 */
function validateParams(params: ParsedParams): ValidationResult {
  const { page, perPage, order } = params;

  if (Number.isNaN(page) || page < 1) {
    return {
      valid: false,
      response: NextResponse.json(
        { error: 'Invalid page parameter. Must be a positive integer.' },
        { status: 400 }
      ),
    };
  }

  if (Number.isNaN(perPage) || perPage < 1 || perPage > MAX_PER_PAGE) {
    return {
      valid: false,
      response: NextResponse.json(
        { error: `Invalid per_page parameter. Must be between 1 and ${MAX_PER_PAGE}.` },
        { status: 400 }
      ),
    };
  }

  if (order && !VALID_SORT_ORDERS.includes(order)) {
    return {
      valid: false,
      response: NextResponse.json(
        { error: `Invalid order parameter. Must be one of: ${VALID_SORT_ORDERS.join(', ')}` },
        { status: 400 }
      ),
    };
  }

  return { valid: true };
}

/**
 * Build CoinGecko API params from parsed params
 */
function buildApiParams(params: ParsedParams): Partial<CoinsMarketsParams> {
  return {
    page: params.page,
    per_page: params.perPage,
    vs_currency: params.vsCurrency,
    order: params.order ?? 'market_cap_desc',
    category: params.category,
    ids: params.ids,
    sparkline: params.sparkline,
    price_change_percentage: params.priceChangePercentage,
  };
}

/**
 * Handle errors and return appropriate response
 */
function handleError(error: unknown): NextResponse {
  if (error instanceof CoinGeckoAPIError) {
    const status = error.code >= 1000 ? 400 : error.code;
    return NextResponse.json({ error: error.message, code: error.code }, { status });
  }

  console.error('[API/market-coins] Unexpected error:', error);
  return NextResponse.json(
    { error: 'Internal server error. Please try again later.' },
    { status: 500 }
  );
}

// =============================================================================
// Request Handler
// =============================================================================

/**
 * GET /api/market-coins
 *
 * Fetches paginated coin listing with market data from CoinGecko
 *
 * @param request - Next.js request object
 * @returns JSON response with paginated coin market data
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const params = parseQueryParams(searchParams);

    // Validate parameters
    const validation = validateParams(params);
    if (!validation.valid) {
      return validation.response;
    }

    // Fetch paginated coins with market data
    const apiParams = buildApiParams(params);
    const result = await getPaginatedCoinsMarkets(apiParams);

    // Return successful response with cache headers
    return NextResponse.json(result, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    return handleError(error);
  }
}
