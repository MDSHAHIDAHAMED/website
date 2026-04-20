/**
 * Transaction status type
 * - 'pending': transaction is still being confirmed
 * - 'success': transaction confirmed successfully
 * - 'failed': transaction failed
 * - null: no transaction info available
 */
export type TxStatus = 'pending' | 'success' | 'failed' | null;

/**
 * Represents the connection state of a wallet
 */
export interface WalletConnectionState {
  isConnected: boolean;    // Wallet is connected and ready to use
  isConnecting: boolean;   // Wallet connection is in progress
  isDisconnected: boolean; // Wallet is disconnected
}

/**
 * Represents blockchain/chain information
 */
export interface ChainInfo {
  chainId: string | number; // Unique chain ID (e.g., 1 for Ethereum mainnet)
  name: string;             // Chain name (e.g., "Ethereum Mainnet")
  isSupported?: boolean;    // Whether this chain is supported by the app
}

/**
 * Standard wallet error object
 */
export interface WalletError {
  type: string;    // Error type identifier (e.g., 'balanceError')
  message: string; // Human-readable error message
}

/**
 * BaseWallet represents the reactive wallet state and exposes common wallet methods
 * All wallets (Ethereum, Solana, custom) should implement this interface
 */
export interface BaseWallet {
  // Connection methods
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getConnectionState(): WalletConnectionState;

  // Address and identity methods
  getAddress(): string | null;
  getDisplayName(): string | null;
  getEnsName?(): Promise<string | null>;

  // Balance and chain
  getBalance(): Promise<{ formatted: string; symbol: string; } | null>;
  getChainInfo(): Promise<ChainInfo>;

  // Transaction methods
  getTransactionStatus?(txHash: string): Promise<TxStatus>;
  getTransactionError?(txHash: string): Promise<string | null>;

  // Error handling
  getLastError?(): WalletError | null; // QUESTION: Why is this optional? and how what is the meaning of last?

  // -------------------------
  // Reactive fields
  // -------------------------
  isConnected: boolean;
  isConnecting: boolean;
  isDisconnected: boolean;
  address: string | null;
  displayName: string | null;
  ensName?: string | null;
  balance?: { formatted: string; symbol: string; } | null;
  chain?: ChainInfo | null;
  error?: WalletError | null;

  // Optional reactive tx fields
  txStatus?: TxStatus | null;
  txError?: string | null;
}
