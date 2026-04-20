/**
 * Coin OHLC Chart API Route
 * ==========================
 * Fetches OHLC (Open, High, Low, Close) candlestick data from CoinGecko.
 *
 * Endpoint: GET /api/coin-ohlc?id=bitcoin&vs_currency=usd&days=30
 *
 * Data Granularity (candle body):
 * - 1-2 days: 30 min | 3-30 days: 4 hours | 31+ days: 4 days
 *
 * @module api/coin-ohlc
 */

import { NextResponse } from 'next/server';

import endPoints from '@/services/urls';
import type { OHLCDays, OHLCResponse } from '@/types/coingecko';

import {
    buildCoinGeckoUrl,
    fetchCoinGecko,
    handleCoinGeckoError,
    handleCoinGeckoResponseError,
    successResponse,
    validateEnum,
    validateRequired,
} from '../_utils/coingecko';

// =============================================================================
// Constants
// =============================================================================

const VALID_OHLC_DAYS: readonly OHLCDays[] = ['1', '7', '14', '30', '90', '180', '365'];

// =============================================================================
// Route Handler
// =============================================================================

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);

    // Validate required params
    const id = searchParams.get('id');
    const vs_currency = searchParams.get('vs_currency');
    const days = searchParams.get('days') as OHLCDays | null;

    const idError = validateRequired(id, 'id');
    if (idError) return idError;

    const currencyError = validateRequired(vs_currency, 'vs_currency');
    if (currencyError) return currencyError;

    const daysRequiredError = validateRequired(days, 'days');
    if (daysRequiredError) return daysRequiredError;

    const daysEnumError = validateEnum(days, VALID_OHLC_DAYS, 'days');
    if (daysEnumError) return daysEnumError;

    // Build URL
    const url = buildCoinGeckoUrl(endPoints.COINGECKO_COIN_OHLC(id!));
    url.searchParams.set('vs_currency', vs_currency!);
    url.searchParams.set('days', days!);

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

    const data: OHLCResponse = await response.json();
    return successResponse(data);
  } catch (error) {
    return handleCoinGeckoError(error);
  }
}
