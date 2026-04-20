/**
 * Deposits Service
 * ================
 * 
 * Service functions for handling deposit/investment operations.
 * 
 * Features:
 * - Create deposit transactions
 * - Get deposit configuration
 * - Handle deposit API responses
 */

import { getMethod, patchMethod, postMethod } from '@/services/api';
import endPoints from '@/services/urls';

// =============================================================================
// Types
// =============================================================================

/**
 * Deposit request payload
 */
export interface DepositRequest {
  /** ID of the deposit asset (must be positive integer) */
  assetId: number;
  /** Deposit amount (must be positive decimal string) */
  amountIn: string;
  /** Valid Ethereum address */
  walletAddress: string;
  /** Optional: Amount of tokens user will receive */
  amountOut?: string;
  /** Optional: Output token symbol */
  tokenOut?: string;
  /** Optional: Output token contract address */
  tokenOutAddress?: string;
  /** Optional: Amount of tokens still pending */
  pendingTokenAmount?: string;
  /** Optional: Allocation type */
  allocationType?: 'FULL' | 'PARTIAL' | 'PENDING';
  /** Optional: Platform fee amount */
  platformFee?: string;
  /** Optional: Network fee amount */
  networkFee?: string;
  /** Optional: Currency for network fee */
  networkFeeCurrency?: string;
  /** Optional: Transaction hash */
  transactionHash?: string;
  /** Optional: Additional metadata */
  metadata?: Record<string, any>;
}

/**
 * Update deposit request payload
 * Used to update a deposit transaction after blockchain execution
 */
export interface UpdateDepositRequest {
  /** REQUIRED: Transaction hash (0x + 64 hex chars, will be lowercased) */
  transactionHash: string;
  /** Optional: Amount of tokens user will receive */
  amountOut?: string;
  /** Optional: Output token symbol */
  tokenOut?: string;
  /** Optional: Output token contract address */
  tokenOutAddress?: string;
  /** Optional: Amount of tokens still pending */
  pendingTokenAmount?: string;
  /** Optional: Allocation type */
  allocationType?: 'FULL' | 'PARTIAL' | 'PENDING';
  /** Optional: Platform fee amount */
  platformFee?: string;
  /** Optional: Network fee amount */
  networkFee?: string;
  /** Optional: Currency for network fee */
  networkFeeCurrency?: string;
  /** Optional: Additional metadata */
  metadata?: {
    orderId?: string;
    blockNumber?: number;
    onChainTimestamp?: string;
    receiveTokenAmount?: string; // Legacy field
    deductedFeeAmount?: string; // Legacy field
    [key: string]: any;
  };
}

/**
 * Deposit transaction data from API response
 */
export interface DepositTransactionData {
  id: number;
  transactionId: string;
  externalTransactionId: string | null;
  transactionHash: string | null;
  type: 'deposit';
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
  metadata: Record<string, any>;
  statusUpdatedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Deposit API response
 */
export interface DepositResponse {
  status: 'success' | 'error';
  data: DepositTransactionData;
  message: string;
}

// =============================================================================
// Service Functions
// =============================================================================

/**
 * Supported asset from deposit config
 */
export interface SupportedAsset {
  id: number;
  symbol: string;
  assetName: string;
  contractAddress: string;
}

/**
 * Deposit configuration response
 */
export interface DepositConfigResponse {
  status: 'success' | 'error';
  data: {
    minimumDepositAmount: string;
    maximumDepositAmount: string | null;
    supportedAssets: SupportedAsset[];
    chainId: number;
  };
  message: string;
}

/**
 * Get deposit configuration
 * 
 * @returns Promise with deposit configuration
 * @throws Error if API call fails
 */
export async function getDepositConfig(): Promise<DepositConfigResponse> {
  return getMethod<DepositConfigResponse>(endPoints.DEPOSIT_CONFIG);
}

/**
 * Create a new deposit/investment
 * 
 * @param payload - Deposit request payload
 * @returns Promise with deposit response
 * @throws Error if API call fails
 */
export async function createDeposit(payload: DepositRequest): Promise<DepositResponse> {
  return postMethod<DepositResponse>(endPoints.DEPOSITS, payload);
}

/**
 * Update an existing deposit transaction
 * 
 * Called after blockchain execution completes to update the deposit with:
 * - Transaction hash
 * - Amount out, token out details
 * - Fees and allocation information
 * - Metadata (block number, timestamps, etc.)
 * 
 * @param id - Deposit transaction ID
 * @param payload - Update deposit request payload
 * @returns Promise with updated deposit response
 * @throws Error if API call fails
 */
export async function updateDeposit(
  id: number,
  payload: UpdateDepositRequest
): Promise<DepositResponse> {
  return patchMethod<DepositResponse>(endPoints.UPDATE_DEPOSIT(id), payload);
}

