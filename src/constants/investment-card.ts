/**
 * Investment Card Constants
 * ========================
 * 
 * Constants, types, and styles for the Investment Card component
 */

import { yieldzNeutral } from '@/styles/theme/colors';
import type { SxProps, Theme } from '@mui/material/styles';

// =============================================================================
// Constants
// =============================================================================

/** Tab index identifiers */
export const TABS = {
  BUY: 0,
  SELL: 1,
} as const;

/** Tab index type */
export type TabIndex = typeof TABS[keyof typeof TABS];

/** Investment constants */
export const CURRENT_APY = '~12.50%';
export const PLATFORM_FEE_PERCENT = 1;
export const NETWORK_FEE_PERCENT = 1;

/** Approved accreditation status constant */
export const APPROVED_ACCREDITATION_STATUS = 'APPROVED';

/** Withdrawal percentage of LP balance (70%) */
export const WITHDRAWAL_PERCENTAGE = 0.7;

/** Default token decimals (most ERC20 tokens use 18) */
export const DEFAULT_TOKEN_DECIMALS = 18;

/** USDC token decimals */
export const USDC_DECIMALS = 6;

/** Default display values */
export const DEFAULT_DISPLAY_VALUES = {
  ZERO: '0.00',
  LOADING: 'Loading...',
  MIN_FEE: '<$0.01',
} as const;

// =============================================================================
// Styles
// =============================================================================

/** Card container styles */
export const CARD_CONTAINER_SX: SxProps<Theme> = {
  backgroundColor: yieldzNeutral[950],
  p: 5,
  width: '100%',
  gap: 4,
};

/** Tab container styles */
export const TAB_CONTAINER_SX: SxProps<Theme> = {
  display: 'flex',
  borderRadius: 0,
  p: 0.5,
  mb: 3,
};

/** Input row styles for sell tab */
export const INPUT_ROW_SX: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  flexDirection: 'column',
  gap: 1,
  mb: 3,
};

// =============================================================================
// Types
// =============================================================================

/** Verification check result */
export interface VerificationResult {
  isValid: boolean;
  errorKey?: string;
  errorMessage?: string;
}

/** Investment Card Component Props */
export interface InvestmentCardProps {
  /** Callback to open success dialog after investment transaction completes */
  onInvestmentSuccess?: (isWithdrawal?: boolean) => void;
  /** Callback to register refetch function - receives refetch function that can be called when success dialog closes */
  onRefetchBalance?: (refetchFn: (() => void) | null) => void;
}

/** Parameters for building update deposit payload */
export interface BuildUpdateDepositPayloadParams {
  transactionHash: string;
  blockNumber: number | undefined;
  onChainTimestamp: string;
  tokenIn: string;
  platformFeeAmount: number;
  networkFeeAmount: number;
  allocationType: 'FULL' | 'PARTIAL' | 'PENDING' | undefined;
  amountOut: string | undefined;
  pendingTokenAmount: string | undefined;
  orderId: string;
}

/** Common liquidity pool parameters used across deposit functions */
export interface LiquidityPoolParams {
  /** Current liquidity pool balance */
  lpBalance: number;
  /** Whether LP balance is loading */
  isLpBalanceLoading: boolean;
  /** LP balance error if any */
  lpBalanceError: Error | null;
  /** Vault contract address */
  vaultAddress: `0x${string}` | undefined;
  /** YLDZ token contract address */
  yieldzTokenAddress: `0x${string}` | undefined;
}

/** Parameters for creating a deposit record */
export interface CreateDepositParams extends LiquidityPoolParams {
  /** Selected asset object with id */
  selectedAsset: { id: number };
  /** Investment amount string */
  amountIn: string;
  /** Parsed investment amount */
  enteredAmount: number;
  /** User wallet address */
  walletAddress: string;
  /** Whether this is a buy transaction */
  isBuy: boolean;
  /** Translation function */
  t: (key: string) => string;
}

/** Parameters for updating deposit after blockchain transaction */
export interface UpdateDepositParams extends LiquidityPoolParams {
  /** Deposit ID to update */
  depositId: number;
  /** Transaction hash from blockchain */
  transactionHash: string;
  /** Transaction receipt */
  lastReceipt: any;
  /** Token symbol */
  tokenIn: string;
  /** Parsed investment amount */
  enteredAmount: number;
  /** User ID for metadata */
  userId: string | undefined;
  /** Translation function */
  t: (key: string) => string;
}
