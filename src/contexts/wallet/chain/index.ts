import { getSepoliaRpcUrl } from '@/constants/rpc';
import { createConfig, http } from 'wagmi';
import { sepolia } from 'wagmi/chains';

/**
 * Wallet chain configuration for Sepolia testnet.
 * Used by use-write-with-wait, buy-yield-token, sell-yield-token.
 * Uses the same RPC URL as reads (getSepoliaRpcUrl) so writes and reads
 * hit the same endpoint.
 */
export const config = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(getSepoliaRpcUrl()),
  },
});
