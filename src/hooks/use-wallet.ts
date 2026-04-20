import { useWalletFactory, WalletType } from "@/components/wallet/base/wallet-factory";

/**
 * Returns a reactive wallet state for a given wallet type.
 * Mimics Wagmi's hook output by simply passing through fields from the wallet.
 * Optionally tracks transaction status and errors if `txHash` is provided.
 *
 * @param walletType - Type of wallet to use ('ethereum', 'custom', etc.)
 * @param txHash - Optional transaction hash to track status/error
 */
export const useWalletState = (walletType: WalletType, txHash?: string) => {
  // ---------------------------
  // Create wallet instance using the factory
  // ---------------------------
  const wallet = useWalletFactory(walletType); // Pass-through wallet instance

  // ---------------------------
  // Return all reactive wallet fields + extra info
  // ---------------------------
  return {
    // Spread all fields/methods from Ethereum or custom wallet
    ...wallet,

    // Add optional transaction info
    txStatus: txHash ? wallet.getTransactionStatus?.(txHash) : null,
    txError: txHash ? wallet.getTransactionError?.(txHash) : null,
  };
};
