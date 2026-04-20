/**
 * Onramper Utility Functions
 * ==========================
 * 
 * Utility functions for Onramper integration including:
 * - Partner context generation
 * - URL signature generation for secure wallet parameter handling
 * 
 * @module utils/onramper
 */

// =============================================================================
// Types
// =============================================================================

/**
 * Parameters for signing Onramper URLs
 * Contains sensitive wallet information that needs to be signed
 */
export interface OnramperSignParams {
  /** Network-specific wallet addresses (e.g., "ethereum:0x123...") */
  networkWallets?: string;
  /** Crypto wallet addresses (e.g., "btc:address,eth:address") */
  wallets?: string;
  /** Wallet address tags */
  walletAddressTags?: string;
}

/**
 * Response from the signature API endpoint
 */
export interface OnramperSignResponse {
  /** The generated HMAC-SHA256 signature in hex format */
  signature: string;
  /** The sorted content string that was signed */
  signedContent: string;
}

/**
 * Error response from the signature API endpoint
 */
export interface OnramperSignError {
  error: string;
  details?: string;
}

// =============================================================================
// Partner Context Functions
// =============================================================================

/**
 * Generates a unique partner context for Onramper widget
 * Format: {randomId}_{authUserId}
 * 
 * @param authUserId - The authenticated user's ID from the API
 * @returns Partner context string in format: {randomId}_{authUserId}
 */
export function generatePartnerContext(authUserId?: string): string {
  // Generate a random ID (using timestamp + random number for uniqueness)
  const randomId = `${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  
  // Combine with auth user ID if available
  if (authUserId) {
    return `${randomId}_${authUserId}`;
  }
  
  // Return just random ID if no user ID available
  return randomId;
}

// =============================================================================
// URL Signature Functions
// =============================================================================

/**
 * Fetches a signature for Onramper URL parameters from the server-side API.
 * This ensures the secret key is never exposed to the client.
 * 
 * The signature protects sensitive wallet parameters from tampering:
 * - wallets
 * - networkWallets
 * - walletAddressTags
 * 
 * @param params - Object containing wallet parameters to sign
 * @returns Promise resolving to signature and signed content, or null on error
 * 
 * @example
 * const result = await fetchOnramperSignature({
 *   networkWallets: 'ethereum:0x1234567890abcdef...'
 * });
 * if (result) {
 *   const signedUrl = `${baseUrl}&signature=${result.signature}`;
 * }
 */
export async function fetchOnramperSignature(
  params: OnramperSignParams
): Promise<OnramperSignResponse | null> {
  try {
    // Skip if no sensitive parameters are provided
    if (!params.networkWallets && !params.wallets && !params.walletAddressTags) {
      return null;
    }

    const response = await fetch('/api/onramper/sign-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData: OnramperSignError = await response.json();
      console.error('Failed to fetch Onramper signature:', errorData);
      return null;
    }

    const data: OnramperSignResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Onramper signature:', error);
    return null;
  }
}

/**
 * Checks if the provided parameters contain sensitive data that requires signing.
 * 
 * @param params - Object containing optional wallet parameters
 * @returns True if any sensitive parameter has a value
 */
export function requiresSignature(params: OnramperSignParams): boolean {
  return Boolean(params.networkWallets ?? params.wallets ?? params.walletAddressTags);
}

