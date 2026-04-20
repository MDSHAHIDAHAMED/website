/**
 * Transactions Service
 * ====================
 * 
 * Service functions for handling user transaction operations.
 * 
 * Features:
 * - Fetch user transactions with filters (type, status)
 * - Handle transaction API responses
 */

import { getMethod } from '@/services/api';
import endPoints from '@/services/urls';

// =============================================================================
// Types
// =============================================================================

/**
 * Transaction type filter
 */
export type TransactionType = 'deposit' | 'withdrawal';

/**
 * Transaction status filter
 */
export type TransactionStatus = 'completed' | 'pending' | 'failed';

/**
 * Transaction data from API response
 */
export interface TransactionData {
  id: number;
  transactionId: string | null;
  externalTransactionId: string | null;
  transactionHash: string | null;
  type: TransactionType;
  status: string;
  userId: number;
  walletAddress: string;
  amountIn: string;
  tokenIn: string;
  tokenInAddress: string;
  amountOut: string | null;
  tokenOut: string | null;
  tokenOutAddress: string | null;
  allocationType: string | null;
  pendingTokenAmount: string | null;
  platformFee: string | null;
  networkFee: string | null;
  networkFeeCurrency: string | null;
  metadata: Record<string, any> | null;
  statusUpdatedAt: string | null;
  withdrawalUnlockDate: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Paginated transactions data from API
 */
export interface TransactionsPaginatedData {
  /** Array of transaction records */
  records: TransactionData[];
  /** Total count of transactions */
  totalCount: number;
  /** Current page number */
  page: number;
  /** Number of items per page */
  pageSize: number;
}

/**
 * Transactions API response
 */
export interface TransactionsResponse {
  status: 'success' | 'error';
  data: TransactionsPaginatedData;
  message: string;
}

/**
 * Fetch user transactions parameters
 */
export interface FetchTransactionsParams {
  /** Transaction type filter (deposit or withdrawal) */
  type: TransactionType;
  /** Transaction status filter (default: completed) */
  status?: TransactionStatus;
  /** Page number for pagination (default: 1) */
  page?: number;
  /** Number of items per page (default: 10) */
  pageSize?: number;
}

/**
 * Fetch user transactions
 * 
 * @param params - Query parameters (type, status, page, pageSize)
 * @returns Promise with transactions response
 * @throws Error if API call fails
 */
export async function fetchUserTransactions(
  params: FetchTransactionsParams
): Promise<TransactionsResponse> {
  const { type, status = 'completed', page, pageSize } = params;
  
  // Build query string with exactMatch filters
  // Manually construct query string to keep brackets [] unencoded
  // Only encode the parameter values, not the brackets
  // Convert status to uppercase for API compatibility
  const encodedType = encodeURIComponent(type);
  const encodedStatus = encodeURIComponent(status.toUpperCase());
  const queryParams: string[] = [
    `exactMatch[type]=${encodedType}`,
    `exactMatch[status]=${encodedStatus}`,
  ];
  
  // Add pagination parameters if provided
  if (page !== undefined && page !== null) {
    queryParams.push(`page=${encodeURIComponent(page)}`);
  }
  if (pageSize !== undefined && pageSize !== null) {
    queryParams.push(`pageSize=${encodeURIComponent(pageSize)}`);
  }
  
  const queryString = queryParams.join('&');
  const url = `${endPoints.TRANSACTIONS_USER}?${queryString}`;
  
  return getMethod<TransactionsResponse>(url);
}
