/**
 * Buy Yield Token Blockchain Integration
 * =======================================
 * 
 * Handles the blockchain interaction for buying yield tokens:
 * 1. Reads token decimals
 * 2. Checks and approves token allowance if needed
 * 3. Calls buyYieldToken on the OrderProcessor contract
 * 
 * Uses wagmi/core for read operations and use-write-with-wait hook for write operations.
 */

import { config } from '@/contexts/wallet/chain';
import { readContract } from '@wagmi/core';
import type { Address } from 'viem';
import { parseAbi, parseUnits } from 'viem';

// ================= ABIs =================

// Minimal ERC20 ABI for reading decimals and allowance
const ERC20_ABI = parseAbi([
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function allowance(address owner, address spender) external view returns (uint256)',
  'function decimals() external view returns (uint8)',
]);

// OrderProcessor ABI
const ORDER_PROCESSOR_ABI = parseAbi([
  'function buyYieldToken(address depositTokenAddress, uint256 depositAmount)',
]);

// ================= TYPES =================

export interface BuyYieldTokenParams {
  /** Stable token address (e.g. USDC, USDT) */
  depositTokenAddress: Address;
  /** Human-readable amount (e.g. "100", "250.75") */
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
 * @returns The number of decimals (e.g. 6 for USDC, 18 for ETH)
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
 * @param tokenAddress - The ERC20 token contract address
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
 * Prepare buy yield token transaction data
 * 
 * This function:
 * 1. Reads token decimals
 * 2. Converts human-readable amount to wei/smallest unit
 * 3. Checks current allowance
 * 4. Returns the necessary transaction steps for use-write-with-wait hook
 * 
 * @param params - Buy yield token parameters
 * @returns Transaction steps array for use-write-with-wait hook
 */
export async function prepareBuyYieldTokenSteps(
  params: BuyYieldTokenParams
): Promise<
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
  const { depositTokenAddress, humanAmount, userAddress, orderProcessorAddress } = params;

  // Read token decimals
  const decimals = await readTokenDecimals(depositTokenAddress);

  // Convert human-readable amount to wei/smallest unit
  const depositAmount = parseUnits(humanAmount.toString(), decimals);

  // Check current allowance
  const currentAllowance = await readTokenAllowance(
    depositTokenAddress,
    userAddress,
    orderProcessorAddress
  );

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

  // Step 1: Approve if allowance is insufficient
  if (currentAllowance < depositAmount) {
    steps.push({
      name: 'Approve Token',
      contractConfig: {
        address: depositTokenAddress,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [orderProcessorAddress, depositAmount],
      },
      waitForReceipt: true,
    });
  }

  // Step 2: Buy yield token
  steps.push({
    name: 'Buy Yield Token',
    contractConfig: {
      address: orderProcessorAddress,
      abi: ORDER_PROCESSOR_ABI,
      functionName: 'buyYieldToken',
      args: [depositTokenAddress, depositAmount],
    },
    waitForReceipt: true,
  });

  return steps;
}

