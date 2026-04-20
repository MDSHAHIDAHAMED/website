/**
 * useGetUnlockAmount Hook
 * =======================
 *
 * Reads unlockable (withdrawable) amount from the registry contract via
 * getUnlockAmount(compliance, user). Query runs only when all three
 * addresses are provided.
 */

'use client';

import { useMemo } from 'react';
import { parseAbi } from 'viem';
import { useReadContract } from 'wagmi';

/** ABI for registry getUnlockAmount view */
const REGISTRY_ABI = parseAbi([
  'function getUnlockAmount(address compliance, address user) external view returns (uint256 unlockable)',
]);

/** Return type of useGetUnlockAmount */
export interface UseGetUnlockAmountReturn {
  /** Unlockable amount in wei; undefined until loaded or when disabled */
  unlockableAmount: bigint | undefined;
  /** True while the contract read is in progress */
  isLoading: boolean;
  /** Set when the contract read fails */
  error: Error | null;
  /** Trigger a new read from the chain */
  refetch: () => void;
}

/**
 * Fetches unlockable amount from the registry contract.
 * Query is enabled only when regDAddress, complianceAddress, and userAddress are all set.
 *
 * @param regDAddress   – Registry contract address
 * @param complianceAddress – Compliance module address
 * @param userAddress   – User wallet address
 * @returns Unlockable amount, loading, error, and refetch
 */
export function useGetUnlockAmount(
  regDAddress?: `0x${string}`,
  complianceAddress?: `0x${string}`,
  userAddress?: `0x${string}`
): UseGetUnlockAmountReturn {
  const args = useMemo(
    () =>
      regDAddress && complianceAddress && userAddress
        ? ([complianceAddress, userAddress] as const)
        : undefined,
    [regDAddress, complianceAddress, userAddress]
  );

  const { data, isLoading, error, refetch } = useReadContract({
    address: regDAddress,
    abi: REGISTRY_ABI,
    functionName: 'getUnlockAmount',
    args,
    query: {
      enabled: args !== undefined,
      retry: 2,
    },
  });

  return {
    unlockableAmount: data as bigint | undefined,
    isLoading,
    error: error as Error | null,
    refetch,
  };
}
