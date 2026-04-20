import { useEthereumWallet } from './ethereum-wallet';
import { BaseWallet } from './types';

/**
 * Supported wallet types
 */
export type WalletType = 'ethereum' | 'custom';

/**
 * Hook factory that returns a wallet instance based on wallet type.
 *
 * This is the central point for creating different wallet hooks.
 * It abstracts away the implementation details of each wallet type.
 *
 * @param type - Type of wallet ('ethereum', 'custom', etc.)
 * @returns BaseWallet - A wallet instance exposing standard wallet methods
 */
export const useWalletFactory = (type: WalletType): BaseWallet => {
  if (type === 'ethereum') {
    // Ethereum wallet is implemented via `useEthereumWallet` hook
    // Safe because it's a hook and will only run in a React function/component
    return useEthereumWallet();
  }
  // Throw error for unsupported wallet types to prevent runtime issues
  throw new Error(`Unsupported wallet type: ${type}`);
};
