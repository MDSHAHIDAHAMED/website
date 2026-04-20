/**
 * Coin Categories API Route
 * ==========================
 * Fetches coin categories from CoinGecko with pagination support.
 *
 * Endpoint: GET /api/categories?type=list|market&order=market_cap_desc&page=1&per_page=10
 *
 * Note: CoinGecko doesn't support native pagination for categories,
 * so we implement client-side pagination by fetching all data and slicing.
 *
 * @module api/categories
 */

import { NextResponse } from 'next/server';

import endPoints from '@/services/urls';
import type { CategoriesListResponse, CategoriesResponse, CategorySortOrder, PaginationMeta } from '@/types/coingecko';

import {
  buildCoinGeckoUrl,
  fetchCoinGecko,
  handleCoinGeckoError,
  handleCoinGeckoResponseError,
  successResponse,
  validateEnum,
} from '../_utils/coingecko';

// =============================================================================
// Constants
// =============================================================================

const VALID_SORT_ORDERS: readonly CategorySortOrder[] = [
  'market_cap_desc',
  'market_cap_asc',
  'name_desc',
  'name_asc',
  'market_cap_change_24h_desc',
  'market_cap_change_24h_asc',
];

/** Default page size for categories */
const DEFAULT_PAGE_SIZE = 10;

/** Default page number (1-indexed) */
const DEFAULT_PAGE = 1;

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Build pagination metadata from array slice
 * @param total - Total number of items
 * @param page - Current page (1-indexed)
 * @param perPage - Items per page
 * @returns Pagination metadata object
 */
function buildPaginationMeta(total: number, page: number, perPage: number): PaginationMeta {
  const totalPages = Math.ceil(total / perPage);
  return {
    page,
    perPage,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

/**
 * Parse pagination parameters from search params
 * @param searchParams - URL search parameters
 * @returns Parsed page and perPage values
 */
function parsePaginationParams(searchParams: URLSearchParams): { page: number; perPage: number } {
  const pageParam = searchParams.get('page');
  const perPageParam = searchParams.get('per_page');

  const page = pageParam ? Math.max(1, Number.parseInt(pageParam, 10)) : DEFAULT_PAGE;
  const perPage = perPageParam ? Math.max(1, Math.min(100, Number.parseInt(perPageParam, 10))) : DEFAULT_PAGE_SIZE;

  return { page, perPage };
}

// =============================================================================
// Route Handler
// =============================================================================

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') ?? 'list';

    // Handle categories list (ID map) - no pagination needed
    if (type === 'list') {
      const url = buildCoinGeckoUrl(endPoints.COINGECKO_CATEGORIES_LIST);
      const response = await fetchCoinGecko(url);

      if (!response.ok) {
        return handleCoinGeckoResponseError(response);
      }

      const data: CategoriesListResponse = await response.json();
      return successResponse(data);
    }

    // Handle categories with market data (with pagination)
    if (type === 'market') {
      const order = searchParams.get('order') as CategorySortOrder | null;
      const { page, perPage } = parsePaginationParams(searchParams);

      const orderError = validateEnum(order, VALID_SORT_ORDERS, 'order');
      if (orderError) return orderError;

      const url = buildCoinGeckoUrl(endPoints.COINGECKO_CATEGORIES);
      if (order) {
        url.searchParams.set('order', order);
      }

      const response = await fetchCoinGecko(url);

      if (!response.ok) {
        return handleCoinGeckoResponseError(response);
      }

      const allCategories: CategoriesResponse = await response.json();

      // Client-side pagination: slice the results
      const total = allCategories.length;
      const startIndex = (page - 1) * perPage;
      const endIndex = startIndex + perPage;
      const paginatedCategories = allCategories.slice(startIndex, endIndex);

      // Build paginated response
      const paginationMeta = buildPaginationMeta(total, page, perPage);

      return successResponse({
        categories: paginatedCategories,
        pagination: paginationMeta,
      });
    }

    // Invalid type
    return NextResponse.json(
      { error: "Invalid type. Must be 'list' or 'market'" },
      { status: 400 }
    );
  } catch (error) {
    return handleCoinGeckoError(error);
  }
}
