/**
 * Coin Market Chart Range API Route
 * ===================================
 * Fetches historical chart data within a UNIX timestamp range from CoinGecko.
 *
 * Endpoint: GET /api/coin-chart-range?id=bitcoin&vs_currency=usd&from=1704067200&to=1706745600
 *
 * Auto Granularity:
 * - 1 day from current: 5-minutely | 2-90 days: hourly | 90+ days: daily
 *
 * @module api/coin-chart-range
 */

import { NextResponse } from 'next/server';

import endPoints from '@/services/urls';
import type { MarketChartRangeResponse } from '@/types/coingecko';

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
    const fromStr = searchParams.get('from');
    const toStr = searchParams.get('to');

    const idError = validateRequired(id, 'id');
    if (idError) return idError;

    const currencyError = validateRequired(vs_currency, 'vs_currency');
    if (currencyError) return currencyError;

    const fromError = validateRequired(fromStr, 'from');
    if (fromError) return fromError;

    const toError = validateRequired(toStr, 'to');
    if (toError) return toError;

    // Parse and validate timestamps
    const from = Number.parseInt(fromStr!, 10);
    const to = Number.parseInt(toStr!, 10); 

    if (Number.isNaN(from) || Number.isNaN(to)) {
      return NextResponse.json(
        { error: 'Invalid timestamp format for from/to parameters' },
        { status: 400 }
      );
    }

    if (from >= to) {
      return NextResponse.json(
        { error: "'from' must be less than 'to'" },
        { status: 400 }
      );
    }

    // Build URL
    const url = buildCoinGeckoUrl(endPoints.COINGECKO_COIN_MARKET_CHART_RANGE(id!));
    url.searchParams.set('vs_currency', vs_currency!);
    url.searchParams.set('from', String(from));
    url.searchParams.set('to', String(to));

    // Optional precision
    const precision = searchParams.get('precision');
    if (precision) {
      url.searchParams.set('precision', precision);
    }

    // Fetch from CoinGecko
    const response = await fetchCoinGecko(url);

    if (!response.ok) {
      return handleCoinGeckoResponseError(response);
    }

    const data: MarketChartRangeResponse = await response.json();
    return successResponse(data);
  } catch (error) {
    return handleCoinGeckoError(error);
  }
}
