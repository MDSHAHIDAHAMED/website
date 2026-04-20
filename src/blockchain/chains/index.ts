import { getSepoliaRpcUrl } from '@/constants/rpc';
import { http } from 'viem';
import { sepolia } from 'viem/chains';
import { createConfig } from 'wagmi';

/**
 * Sepolia Chain Configuration
 * ===========================
 *
 * Sepolia is an Ethereum testnet used for testing and development.
 * Chain ID: 11155111
 *
 * This configuration uses the built-in Sepolia chain from viem,
 * which includes all standard network parameters.
 */
export const SEPOLIA_CHAIN = {
  ID: sepolia.id, // 11155111
  NATIVE_NAME: sepolia.nativeCurrency.name, // 'Ether'
  NATIVE_SYMBOL: sepolia.nativeCurrency.symbol, // 'ETH'
  NATIVE_DECIMAL: sepolia.nativeCurrency.decimals, // 18
  EXPLORER_NAME: sepolia.blockExplorers?.default?.name || 'Etherscan',
};

/**
 * Sepolia Chain Instance
 *
 * Uses the built-in Sepolia chain definition from viem.
 * RPC URL comes from @/constants/rpc.
 */
export const SepoliaChain = sepolia;

/**
 * Wagmi Configuration (optional / legacy)
 *
 * Uses getSepoliaRpcUrl() so RPC URL never is undefined; read/write paths
 * stay consistent with the API proxy and env.
 */
export const config = createConfig({
  chains: [SepoliaChain],
  transports: {
    [SepoliaChain.id]: http(getSepoliaRpcUrl()),
  },
});