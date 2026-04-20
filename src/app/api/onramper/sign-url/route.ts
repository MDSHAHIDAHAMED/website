/**
 * Onramper URL Signing API Route
 * ===============================
 * 
 * Server-side endpoint to generate HMAC-SHA256 signatures for Onramper widget URLs.
 * This protects sensitive wallet data from tampering.
 * 
 * Sensitive parameters that require signing:
 * - wallets: Crypto wallet addresses (e.g., btc:address)
 * - networkWallets: Network-specific wallet addresses (e.g., ethereum:address)
 * - walletAddressTags: Wallet address tags
 * 
 * Endpoint: POST /api/onramper/sign-url
 * Body: { networkWallets?: string, wallets?: string, walletAddressTags?: string }
 * 
 * @module api/onramper/sign-url
 */

import { NextResponse } from 'next/server';
import crypto from 'node:crypto';

// =============================================================================
// Types
// =============================================================================

interface SignRequestBody {
  /** Network-specific wallet addresses (e.g., "ethereum:0x123...") */
  networkWallets?: string;
  /** Crypto wallet addresses (e.g., "btc:address,eth:address") */
  wallets?: string;
  /** Wallet address tags */
  walletAddressTags?: string;
}

interface SignSuccessResponse {
  /** The generated HMAC-SHA256 signature in hex format */
  signature: string;
  /** The sorted content string that was signed */
  signedContent: string;
}

interface SignErrorResponse {
  error: string;
  details?: string;
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Alphabetical string comparator using localeCompare for reliable sorting.
 * Used to ensure consistent alphabetical ordering across different environments.
 *
 * @param a - First string to compare
 * @param b - Second string to compare
 * @returns Negative if a < b, positive if a > b, zero if equal
 */
const alphabeticalCompare = (a: string, b: string): number => a.localeCompare(b);

/**
 * Comparator for sorting object entries alphabetically by key.
 * Uses localeCompare for reliable string comparison.
 *
 * @param a - First entry [key, value]
 * @param b - Second entry [key, value]
 * @returns Negative if a[0] < b[0], positive if a[0] > b[0], zero if equal
 */
const entryKeyCompare = (
  a: [string, string],
  b: [string, string]
): number => a[0].localeCompare(b[0]);

/**
 * Arranges the signing content string alphabetically for consistent signature generation.
 * Both top-level keys and nested values are sorted alphabetically using localeCompare.
 *
 * @param inputString - The unencoded query string to sort (e.g., "wallets=btc:addr1,eth:addr2")
 * @returns Alphabetically sorted string for consistent signing
 *
 * @example
 * Input:  "wallets=eth:addr2,btc:addr1&networkWallets=polygon:addr3,ethereum:addr4"
 * Output: "networkWallets=ethereum:addr4,polygon:addr3&wallets=btc:addr1,eth:addr2"
 */
function arrangeStringAlphabetically(inputString: string): string {
  // Parse the input string into an object
  const inputObject: Record<string, Record<string, string>> = {};

  inputString.split('&').forEach((pair) => {
    // Split each pair into key and value
    const [key, value] = pair.split('=');

    if (!key || !value) return;

    // Split the value into nested key-value pairs
    const nestedPairs = value.split(',');
    inputObject[key] = {}; // Initialize the nested object for the key

    nestedPairs.forEach((nestedPair) => {
      // Split each nested pair into nested key and value
      const [nestedKey, nestedValue] = nestedPair.split(':');
      if (nestedKey && nestedValue) {
        // Assign the nested key-value pair to the nested object
        inputObject[key][nestedKey] = nestedValue;
      }
    });
  });

  // Sort the keys of each nested object alphabetically using localeCompare
  for (const key of Object.keys(inputObject)) {
    const sortedEntries = Object.entries(inputObject[key]).sort(entryKeyCompare);
    inputObject[key] = Object.fromEntries(sortedEntries);
  }

  // Sort the keys of the top-level object alphabetically using localeCompare
  const sortedKeys = Object.keys(inputObject).sort(alphabeticalCompare);

  // Reconstruct the string from the sorted object
  const resultParts: string[] = [];
  for (const key of sortedKeys) {
    // Build nested key-value pairs string (already sorted)
    const nestedString = Object.entries(inputObject[key])
      .map(([nestedKey, nestedValue]) => `${nestedKey}:${nestedValue}`)
      .join(',');
    resultParts.push(`${key}=${nestedString}`);
  }

  return resultParts.join('&');
}

/**
 * Generates an HMAC-SHA256 signature for the given data using the secret key.
 * 
 * @param secretKey - The secret key for HMAC generation
 * @param data - The data string to sign
 * @returns Hex-encoded HMAC-SHA256 signature
 */
function generateSignature(secretKey: string, data: string): string {
  const hmac = crypto.createHmac('sha256', secretKey);
  hmac.update(data);
  return hmac.digest('hex');
}

/**
 * Converts network/crypto IDs to lowercase while preserving wallet address case.
 * Onramper requires network IDs (ethereum, btc) to be lowercase,
 * but wallet addresses should preserve their original case.
 * 
 * @param value - Value in format "network:address,network:address"
 * @returns Value with lowercase network IDs but original address case
 * 
 * @example
 * Input:  "ETHEREUM:0xAbCdEf123,POLYGON:0x987654"
 * Output: "ethereum:0xAbCdEf123,polygon:0x987654"
 */
function lowercaseNetworkIds(value: string): string {
  return value
    .split(',')
    .map((pair) => {
      const colonIndex = pair.indexOf(':');
      if (colonIndex === -1) return pair;
      
      // Only lowercase the network ID (before the colon)
      const networkId = pair.substring(0, colonIndex).toLowerCase();
      const address = pair.substring(colonIndex + 1); // Keep address as-is
      
      return `${networkId}:${address}`;
    })
    .join(',');
}

/**
 * Builds the sign content string from wallet parameters.
 * Only includes parameters that have values.
 * Network/crypto IDs are lowercased, but wallet addresses preserve their case.
 * 
 * @param params - Object containing wallet parameters
 * @returns Formatted sign content string (unencoded)
 */
function buildSignContent(params: SignRequestBody): string {
  const parts: string[] = [];

  // Add parameters in the order they should appear (will be sorted later)
  // Only lowercase network/crypto IDs, preserve wallet address case
  if (params.networkWallets) {
    parts.push(`networkWallets=${lowercaseNetworkIds(params.networkWallets)}`);
  }

  if (params.wallets) {
    parts.push(`wallets=${lowercaseNetworkIds(params.wallets)}`);
  }

  if (params.walletAddressTags) {
    parts.push(`walletAddressTags=${lowercaseNetworkIds(params.walletAddressTags)}`);
  }

  return parts.join('&');
}

// =============================================================================
// Route Handler
// =============================================================================

/**
 * POST handler for signing Onramper URLs.
 * 
 * Receives wallet parameters, sorts them alphabetically, and generates
 * an HMAC-SHA256 signature using the server-side secret key.
 * 
 * @param request - The incoming request with wallet parameters in JSON body
 * @returns JSON response with signature or error
 */
export async function POST(request: Request): Promise<NextResponse<SignSuccessResponse | SignErrorResponse>> {
  try {
    // Get the secret key from environment variable
    // Checks for server-side variable first, falls back to NEXT_PUBLIC_ for compatibility
    // Note: For production, prefer using ONRAMPER_SIGNATURE_SECRET (without NEXT_PUBLIC_)
    const secretKey = process.env.ONRAMPER_SIGNATURE;

    if (!secretKey) {
      console.error('ONRAMPER_SIGNATURE_SECRET or ONRAMPER_SIGNATURE environment variable is not configured');
      return NextResponse.json(
        { 
          error: 'Server configuration error',
          details: 'Signature secret is not configured'
        },
        { status: 500 }
      );
    }

    // Parse request body
    const body: SignRequestBody = await request.json();

    // Validate that at least one sensitive parameter is provided
    if (!body.networkWallets && !body.wallets && !body.walletAddressTags) {
      return NextResponse.json(
        { 
          error: 'Validation error',
          details: 'At least one of networkWallets, wallets, or walletAddressTags must be provided'
        },
        { status: 400 }
      );
    }

    // Build the content string to be signed (unencoded)
    const signContent = buildSignContent(body);

    // Sort alphabetically for consistent signature generation
    const sortedContent = arrangeStringAlphabetically(signContent);

    // Generate HMAC-SHA256 signature
    const signature = generateSignature(secretKey, sortedContent);

    return NextResponse.json({
      signature,
      signedContent: sortedContent,
    });
  } catch (error) {
    console.error('Error signing Onramper URL:', error);
    
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { 
          error: 'Invalid request body',
          details: 'Request body must be valid JSON'
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

