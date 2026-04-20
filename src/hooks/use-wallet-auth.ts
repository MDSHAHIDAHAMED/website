import { useState, useCallback } from 'react';
import { verifyMessage } from 'ethers';
import { useAccount, useWalletClient } from 'wagmi';

/**
 * useWalletAuth
 * -------------------
 * Hook to handle wallet authentication via message signing.
 * This is a frontend-only prototype version using a static nonce for testing.
 *
 * Responsibilities:
 * 1. Ensure wallet is connected and ready.
 * 2. Prompt user to sign a message (mocked nonce).
 * 3. Verify the signature locally.
 * 4. Return a mock token (nonce) to simulate backend verification.
 *
 * Later integration with a backend should replace the static nonce and
 * local verification with API calls:
 *   - fetchNonce(address) -> to request backend-generated nonce
 *   - verifySignature({ address, signature, nonce }) -> to verify and receive token
 */
export function useWalletAuth() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [loading, setLoading] = useState(false);       // Tracks signing/authentication progress
  const [status, setStatus] = useState<string | null>(null); // Stores success/error messages

  /**
   * authenticate
   * -------------------
   * Main function to handle wallet authentication.
   * Performs validation, message signing, and local verification.
   */
  const authenticate = useCallback(async () => {
    // --- Step 0: Validation ---
    if (!isConnected || !walletClient || !address) {
      setStatus('Please connect your wallet first');
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      // --- Step 1: Prepare static message/nonce ---
      const nonce = 'test-nonce-12345'; 
      const message = `MyApp wallet authentication test\nNonce: ${nonce}`;

      // --- Step 2: Ask wallet to sign message ---
      const signature = await walletClient.signMessage({ message });

      // --- Step 3: Local verification of the signature ---
      const recovered = verifyMessage(message, signature);
      if (recovered.toLowerCase() !== address.toLowerCase()) {
        throw new Error('Signature mismatch');
      }

      // --- Step 4: Mock backend verification ---
      // In a real backend integration, replace with:
      // const { token } = await verifySignature({ address, signature, nonce });
      // Here, returning static nonce to simulate token issuance.
      setStatus('Signature verified locally');
      return nonce; // mock token
    } catch (err: any) {
      setStatus(err?.message || 'Message signing failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isConnected, walletClient, address]);

  return { authenticate, loading, status };
}
