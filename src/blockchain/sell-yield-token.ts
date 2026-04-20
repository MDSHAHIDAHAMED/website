/**
 * Sell Yield Token Blockchain Integration
 * ======================================
 *
 * Handles the blockchain interaction for selling yield tokens:
 * 1. Reads yield token decimals
 * 2. Checks and approves yield token allowance if needed
 * 3. Calls returnYieldToken on the OrderProcessor contract
 *
 * Uses wagmi/core for read operations and use-write-with-wait hook for write operations.
 */

import { readContract } from '@wagmi/core';
import type { Address } from 'viem';
import { parseAbi, parseUnits } from 'viem';

import { config } from '@/contexts/wallet/chain';

// ================= ABIs =================

// Minimal ERC20 ABI for reading decimals and allowance
const ERC20_ABI = parseAbi([
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function allowance(address owner, address spender) external view returns (uint256)',
  'function decimals() external view returns (uint8)',
]);

// OrderProcessor ABI for selling yield tokens
const ORDER_PROCESSOR_ABI = parseAbi([
  'function returnYieldToken(address returnTokenAddress, uint256 yieldTokenAmount)',
]);

// ================= TYPES =================

export interface SellYieldTokenParams {
  /** Yield token address (YLDZ token) */
  yieldTokenAddress: Address;
  /** Stable token address (e.g. USDC, USDT) that user will receive */
  stableTokenAddress: Address;
  /** Human-readable yield token amount (e.g. "100", "250.75") */
  humanAmount: string | number;
  /** User's wallet address */
  userAddress: Address;
  /** Order processor contract address */
  orderProcessorAddress: Address;
}

// ================= FUNCTIONS =================

/**
 * Read token decimals from the ERC20 contract
 *
 * @param tokenAddress - The ERC20 token contract address
 * @returns The number of decimals (e.g. 6 for USDC, 18 for ETH/YLDZ)
 */
export async function readTokenDecimals(tokenAddress: Address): Promise<number> {
  const decimals = await readContract(config, {
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'decimals',
  });

  return Number(decimals);
}

/**
 * Read current allowance for the order processor
 *
 * @param tokenAddress - The ERC20 token contract address (yield token)
 * @param ownerAddress - The token owner's address
 * @param spenderAddress - The spender's address (order processor)
 * @returns The current allowance as a bigint
 */
export async function readTokenAllowance(
  tokenAddress: Address,
  ownerAddress: Address,
  spenderAddress: Address
): Promise<bigint> {
  const allowance = await readContract(config, {
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: [ownerAddress, spenderAddress],
  });

  return allowance;
}

/**
 * Prepare sell yield token transaction data
 *
 * This function:
 * 1. Reads yield token decimals
 * 2. Converts human-readable amount to wei/smallest unit
 * 3. Checks current allowance for yield token
 * 4. Returns the necessary transaction steps for use-write-with-wait hook
 *
 * @param params - Sell yield token parameters
 * @returns Transaction steps array for use-write-with-wait hook
 */
export async function prepareSellYieldTokenSteps(params: SellYieldTokenParams): Promise<
  Array<{
    name: string;
    contractConfig: {
      address: Address;
      abi: typeof ERC20_ABI | typeof ORDER_PROCESSOR_ABI;
      functionName: string;
      args: any[];
    };
    waitForReceipt: boolean;
  }>
> {
  const { yieldTokenAddress, stableTokenAddress, humanAmount, userAddress, orderProcessorAddress } = params;

  // Read yield token decimals
  const decimals = await readTokenDecimals(yieldTokenAddress);

  // Convert human-readable amount to wei/smallest unit
  const yieldTokenAmount = parseUnits(humanAmount.toString(), decimals);

  // Check current allowance for yield token → order processor
  const currentAllowance = await readTokenAllowance(yieldTokenAddress, userAddress, orderProcessorAddress);

  const steps: Array<{
    name: string;
    contractConfig: {
      address: Address;
      abi: typeof ERC20_ABI | typeof ORDER_PROCESSOR_ABI;
      functionName: string;
      args: any[];
    };
    waitForReceipt: boolean;
  }> = [];

  // Step 1: Approve yield token if allowance is insufficient
  if (currentAllowance < yieldTokenAmount) {
    steps.push({
      name: 'Approve Yield Token',
      contractConfig: {
        address: yieldTokenAddress,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [orderProcessorAddress, yieldTokenAmount],
      },
      waitForReceipt: true,
    });
  }

  steps.push({
    name: 'Return Yield Token',
    contractConfig: {
      address: orderProcessorAddress,
      abi: ORDER_PROCESSOR_ABI,
      functionName: 'returnYieldToken',
      args: [stableTokenAddress, yieldTokenAmount],
    },
    waitForReceipt: true,
  });

  return steps;
}
