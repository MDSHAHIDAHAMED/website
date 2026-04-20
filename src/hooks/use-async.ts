import { useState } from 'react';

/**
 * useAsync Hook
 * -------------
 * A reusable hook to handle async operations with loading, success, and error states.
 * 
 * Common usage:
 * const { loading, message, error, run, setMessage } = useAsync();
 * run(async () => {
 *    await someAsyncFunction();
 * });
 * 
 * Benefits:
 * - Avoids repetitive try/catch boilerplate in components
 * - Provides centralized loading, success, and error state management
 * - Easy to integrate with UI components (buttons, alerts, spinners)
 */
export function useAsync() {
  // Loading state: true when async operation is in progress
  const [loading, setLoading] = useState(false);

  // Success message to show after operation completes successfully
  const [message, setMessage] = useState<string | null>(null);

  // Error message in case the async operation fails
  const [error, setError] = useState<string | null>(null);

  /**
   * run
   * ---
   * Executes an async function and automatically manages:
   * - Loading state
   * - Success message reset
   * - Error handling
   *
   * @param fn - an async function to execute
   */
  const run = async (fn: () => Promise<void>) => {
    try {
      setLoading(true);   // Start loading
      setMessage(null);   // Clear previous success message
      setError(null);     // Clear previous error message
      await fn();         // Execute the passed async function
    } catch (err: any) {
      // Extract error message from axios response if available
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);  // Stop loading
    }
  };

  // Return the states and helpers for use in components
  return { loading, message, error, run, setMessage };
}
