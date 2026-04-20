/**
 * CoinGecko API Utilities
 * ========================
 * Shared utilities for CoinGecko API routes.
 * Provides common error handling, fetch wrapper, and constants.
 *
 * @module api/_utils/coingecko
 */

import { NextResponse } from 'next/server';

// =============================================================================
// Constants
// =============================================================================

/** CoinGecko API base URL from environment */
export const COINGECKO_API_BASE = process.env.NEXT_PUBLIC_COINGECKO_URL!;

/** CoinGecko API key from environment */
export const COINGECKO_API_KEY = process.env.NEXT_PUBLIC_COINGECKO_KEY;

// =============================================================================
// Types
// =============================================================================

/**
 * CoinGecko error response structure
 */
interface CoinGeckoErrorResponse {
  status?: {
    error_message?: string;
    error_code?: number;
  };
}

// =============================================================================
// Error Handler
// =============================================================================

/**
 * Handle errors from CoinGecko API or unexpected errors
 * Returns a standardized NextResponse with appropriate status code
 *
 * @param error - Error object (can be Error, Response, or unknown)
 * @returns NextResponse with error details
 */
export function handleCoinGeckoError(error: unknown): NextResponse {
  // Handle standard Error objects
  if (error instanceof Error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  // Handle unknown errors
  return NextResponse.json(
    { error: 'An unexpected error occurred' },
    { status: 500 }
  );
}

/**
 * Parse CoinGecko error response and return NextResponse
 *
 * @param response - Fetch Response object
 * @returns NextResponse with error details
 */
export async function handleCoinGeckoResponseError(response: Response): Promise<NextResponse> {
  let errorMessage = `CoinGecko error (${response.status})`;

  try {
    const errorData: CoinGeckoErrorResponse = await response.json();
    if (errorData?.status?.error_message) {
      errorMessage = errorData.status.error_message;
    }
  } catch {
    // Ignore JSON parsing errors, use default message
  }

  return NextResponse.json(
    { error: errorMessage, code: response.status },
    { status: response.status }
  );
}

// =============================================================================
// Fetch Wrapper
// =============================================================================

/**
 * Fetch data from CoinGecko API with automatic API key injection
 *
 * @param url - URL object with endpoint and params already set
 * @returns Fetch Response object
 */
export async function fetchCoinGecko(url: URL): Promise<Response> {
  // Add API key if available
  if (COINGECKO_API_KEY) {
    url.searchParams.set('x_cg_demo_api_key', COINGECKO_API_KEY);
  }

  return fetch(url.toString(), {
    headers: { Accept: 'application/json' },
  });
}

/**
 * Build CoinGecko URL with endpoint
 *
 * @param endpoint - API endpoint path (e.g., '/coins/markets')
 * @returns URL object
 */
export function buildCoinGeckoUrl(endpoint: string): URL {
  return new URL(`${COINGECKO_API_BASE}${endpoint}`);
}

// =============================================================================
// Validation Helpers
// =============================================================================

/**
 * Validate required parameter and return error response if missing
 *
 * @param value - Parameter value
 * @param name - Parameter name for error message
 * @returns NextResponse error or null if valid
 */
export function validateRequired(value: string | null, name: string): NextResponse | null {
  if (!value) {
    return NextResponse.json(
      { error: `Missing required parameter: ${name}` },
      { status: 400 }
    );
  }
  return null;
}

/**
 * Validate that a value is in an allowed list
 *
 * @param value - Value to validate
 * @param allowed - Array of allowed values
 * @param name - Parameter name for error message
 * @returns NextResponse error or null if valid
 */
export function validateEnum<T extends string>(
  value: T | null,
  allowed: readonly T[],
  name: string
): NextResponse | null {
  if (value && !allowed.includes(value)) {
    return NextResponse.json(
      { error: `Invalid ${name}. Must be one of: ${allowed.join(', ')}` },
      { status: 400 }
    );
  }
  return null;
}

// =============================================================================
// Response Helpers
// =============================================================================

/**
 * Return successful JSON response
 *
 * @param data - Response data
 * @returns NextResponse with JSON data
 */
export function successResponse<T>(data: T): NextResponse {
  return NextResponse.json(data, { status: 200 });
}

