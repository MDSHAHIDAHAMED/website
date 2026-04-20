/**
 * Coin Detail API Route
 * ======================
 * Fetches detailed coin data (metadata, market data, tickers) from CoinGecko.
 *
 * Endpoint: GET /api/coin-detail?id=bitcoin
 *
 * @module api/coin-detail
 */

import { NextResponse } from 'next/server';

import endPoints from '@/services/urls';
import type { CoinDetail } from '@/types/coingecko';

import {
    buildCoinGeckoUrl,
    fetchCoinGecko,
    handleCoinGeckoError,
    handleCoinGeckoResponseError,
    successResponse,
    validateRequired,
} from '../_utils/coingecko';

// =============================================================================
// Helpers
// =============================================================================

/** Parse boolean query param with default */
const parseBoolean = (value: string | null, defaultValue: boolean): boolean =>
  value === null ? defaultValue : value.toLowerCase() === 'true';

// =============================================================================
// Route Handler
// =============================================================================

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);

    // Validate required params
    const id = searchParams.get('id');
    const idError = validateRequired(id, 'id');
    if (idError) return idError;

    // Build URL
    const url = buildCoinGeckoUrl(endPoints.COINGECKO_COIN_DETAIL(id!));

    // Set query params
    url.searchParams.set('localization', String(parseBoolean(searchParams.get('localization'), true)));
    url.searchParams.set('tickers', String(parseBoolean(searchParams.get('tickers'), true)));
    url.searchParams.set('market_data', String(parseBoolean(searchParams.get('market_data'), true)));
    url.searchParams.set('community_data', String(parseBoolean(searchParams.get('community_data'), true)));
    url.searchParams.set('developer_data', String(parseBoolean(searchParams.get('developer_data'), true)));
    url.searchParams.set('sparkline', String(parseBoolean(searchParams.get('sparkline'), false)));

    const includeCategoriesDetails = searchParams.get('include_categories_details');
    if (includeCategoriesDetails) {
      url.searchParams.set('include_categories_details', includeCategoriesDetails);
    }

    const dexPairFormat = searchParams.get('dex_pair_format');
    if (dexPairFormat === 'contract_address' || dexPairFormat === 'symbol') {
      url.searchParams.set('dex_pair_format', dexPairFormat);
    }

    // Fetch from CoinGecko
    const response = await fetchCoinGecko(url);

    if (!response.ok) {
      return handleCoinGeckoResponseError(response);
    }

    const data: CoinDetail = await response.json();
    return successResponse(data);
  } catch (error) {
    return handleCoinGeckoError(error);
  }
}
