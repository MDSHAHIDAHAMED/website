/**
 * Coin Market Chart API Route
 * ============================
 * Fetches historical chart data (price, market cap, volume) from CoinGecko.
 *
 * Endpoint: GET /api/coin-chart?id=bitcoin&vs_currency=usd&days=7
 *
 * Auto Granularity:
 * - 1 day: 5-minutely | 2-90 days: hourly | 90+ days: daily
 *
 * @module api/coin-chart
 */

import { NextResponse } from 'next/server';

import endPoints from '@/services/urls';
import type { MarketChartResponse } from '@/types/coingecko';

import {
    buildCoinGeckoUrl,
    fetchCoinGecko,
    handleCoinGeckoError,
    handleCoinGeckoResponseError,
    successResponse,
    validateRequired,
} from '../_utils/coingecko';

// =============================================================================
// Route Handler
// =============================================================================

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);

    // Validate required params
    const id = searchParams.get('id');
    const vs_currency = searchParams.get('vs_currency');
    const days = searchParams.get('days');

    const idError = validateRequired(id, 'id');
    if (idError) return idError;

    const currencyError = validateRequired(vs_currency, 'vs_currency');
    if (currencyError) return currencyError;

    const daysError = validateRequired(days, 'days');
    if (daysError) return daysError;

    // Build URL
    const url = buildCoinGeckoUrl(endPoints.COINGECKO_COIN_MARKET_CHART(id!));
    url.searchParams.set('vs_currency', vs_currency!);
    url.searchParams.set('days', days!);

    // Optional params
    const interval = searchParams.get('interval');
    if (interval === 'daily') {
      url.searchParams.set('interval', 'daily');
    }

    const precision = searchParams.get('precision');
    if (precision) {
      url.searchParams.set('precision', precision);
    }

    // Fetch from CoinGecko
    const response = await fetchCoinGecko(url);

    if (!response.ok) {
      return handleCoinGeckoResponseError(response);
    }

    const data: MarketChartResponse = await response.json();
    return successResponse(data);
  } catch (error) {
    return handleCoinGeckoError(error);
  }
}
