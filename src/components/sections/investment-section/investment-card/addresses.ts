/**
 * Investment Card Addresses
 * =========================
 *
 * Reads contract addresses from env. Single place for investment-card env usage.
 * No React.
 */

/**
 * YLDZ token contract address (management) for SELL tab and LP balance.
 */
export function getYieldzTokenAddress(): `0x${string}` | undefined {
  return (process.env.NEXT_PUBLIC_YIELDZ_TOKEN_MANAGEMENT as `0x${string}` | undefined) ?? undefined;
}

/**
 * Vault contract address for liquidity pool balance and withdraw fee.
 */
export function getVaultAddress(): `0x${string}` | undefined {
  return (process.env.NEXT_PUBLIC_VAULT_ADDRESS as `0x${string}` | undefined) ?? undefined;
}

/**
 * Registry unlock amount contract address (e.g. for SellTab).
 */
export function getRegistryAddress(): `0x${string}` | undefined {
  return (process.env.NEXT_PUBLIC_REGD_UNLOCK_AMOUNT as `0x${string}` | undefined) ?? undefined;
}

/**
 * Modular compliance contract address (e.g. for SellTab).
 */
export function getComplianceAddress(): `0x${string}` | undefined {
  return (process.env.NEXT_PUBLIC_MODULAR_COMPLIANCE_ADDRESS as `0x${string}` | undefined) ?? undefined;
}
