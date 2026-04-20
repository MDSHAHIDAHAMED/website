/**
 * RPC URL Constants
 * =================
 *
 * Single source of truth for Sepolia RPC configuration.
 * Uses NEXT_PUBLIC_SEPOLIA_CHAIN_RPC_URL from env when set; otherwise the default.
 */

/** Fallback when NEXT_PUBLIC_SEPOLIA_CHAIN_RPC_URL is unset or empty */
export const DEFAULT_SEPOLIA_RPC_URL = 'https://rpc.sepolia.org';

/** Returns the Sepolia RPC URL from env (NEXT_PUBLIC_SEPOLIA_CHAIN_RPC_URL) or default. */
export function getSepoliaRpcUrl(): string {
  const url = process.env.NEXT_PUBLIC_SEPOLIA_CHAIN_RPC_URL?.trim();
  return url && url.length > 0 ? url : DEFAULT_SEPOLIA_RPC_URL;
}
