/**
 * Session Utility Functions
 * =========================
 * Shared utilities for session management across auth guards.
 * 
 * Note: This file intentionally does NOT have 'use client' directive
 * because it exports async functions that are called from client components.
 * The 'use client' directive would cause async/await errors.
 */

// =============================================================================
// Types
// =============================================================================

/** Response shape from /api/cookie endpoint */
interface CookieCheckResponse {
  exists: boolean;
  hasValue?: boolean;
}

// =============================================================================
// Session Cookie Verification
// =============================================================================

/**
 * Verifies if session_jwt cookie exists by calling /api/cookie endpoint.
 *
 * This function is used by both AuthGuard and GuestGuard to determine
 * if a valid session cookie is present on the client.
 *
 * @returns Promise<boolean> - true if cookie exists, false otherwise
 *
 * @example
 * const isSessionValid = await verifySessionCookie();
 * if (isSessionValid) {
 *   // User has a valid session
 * }
 */
export async function verifySessionCookie(): Promise<boolean> {
  try {
    const response = await fetch('/api/cookie');

    // Handle non-OK responses
    if (!response.ok) {
      return false;
    }

    const data: CookieCheckResponse = await response.json();
    return data.exists === true;
  } catch {
    // Network error or parsing error - assume no valid session
    return false;
  }
}

