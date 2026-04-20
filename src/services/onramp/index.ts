/**
 * Onramp Transaction Service
 * ==========================
 * 
 * Service functions for handling onramp transaction operations.
 * 
 * Features:
 * - Initiate onramp transactions
 * - Handle onramp API responses
 */

import { postMethod } from '@/services/api';
import endPoints from '@/services/urls';

// =============================================================================
// Types
// =============================================================================

/**
 * Initiate onramp transaction request payload
 */
export interface InitiateOnrampRequest {
  /** Required: Wallet address where tokens should be sent */
  walletAddress: string;
  /** Required: Partner context for tracking the transaction */
  partnerContext: string;
  /** Optional: Amount to purchase (must be positive if provided) */
  amountIn?: number;
  /** Optional: Source currency (e.g., "USD") */
  sourceCurrency?: string;
  /** Optional: Target currency (e.g., "USDT", "USDC") */
  targetCurrency?: string;
  /** Optional: Additional metadata */
  metadata?: Record<string, any>;
}

/**
 * Onramp transaction data from API response
 */
export interface OnrampTransactionData {
  id: number;
  transactionId: string | null;
  onrampTransactionId: string | null;
  status: string;
  walletAddress: string;
  amountIn: string | null;
  sourceCurrency: string | null;
  amountOut: string | null;
  targetCurrency: string | null;
  partnerContext: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Initiate onramp transaction API response
 */
export interface InitiateOnrampResponse {
  status: 'success' | 'error';
  data: OnrampTransactionData;
  message: string;
}

// =============================================================================
// Service Functions
// =============================================================================

/**
 * Initiate an onramp transaction
 * 
 * Informs the backend about the onramp transaction being initiated.
 * The backend will track the transaction and return a partnerContext
 * that should be used with the Onramper widget.
 * 
 * @param payload - Initiate onramp request payload
 * @returns Promise with onramp transaction response
 * @throws Error if API call fails
 */
export async function initiateOnrampTransaction(
  payload: InitiateOnrampRequest
): Promise<InitiateOnrampResponse> {
  return postMethod<InitiateOnrampResponse>(endPoints.ONRAMP_INITIATE, payload);
}

