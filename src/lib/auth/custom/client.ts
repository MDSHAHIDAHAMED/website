'use client';

import { logger } from '@/lib/default-logger';
import { fetchCurrentUser, logoutUser } from '@/services/user/me';
import type { User } from '@/types/user';
import { handleServiceError } from '@/utils/error-handler';

/**
 * AuthClient
 * ----------
 * Handles authentication operations including fetching current user
 * and signing out. Uses cookies for authentication.
 */
class AuthClient {
  /**
   * Fetches current authenticated user from /me endpoint
   * Response structure: { data: { user, session, device } }
   * 
   * @returns User data or null if not authenticated
   */
  async getUser(): Promise<{ data?: User | null; error?: string }> {
    try {
      // Fetch user data from /me endpoint using cookies for authentication
      const response = await fetchCurrentUser();
      
      // Response is now wrapped in data: { user, session, device }
      if (!response?.data?.user) {
        return { data: null };
      }

      const { user } = response.data;
      const metadata = user.metadata as Record<string, string> | undefined;

      // Transform the API response to match our User type
      const userData: User = {
        id: user.user_id,
        email: user.email ?? '',
        firstName: metadata?.firstName ?? '',
        lastName: metadata?.lastName ?? '',
        avatar: metadata?.avatar ?? '/assets/avatar.png',
        // Add any other fields you need from the response
      };

      return { data: userData };
    } catch (error_) {
      // If the request fails (e.g., no valid session), return null
      logger.debug('getUser failed (e.g. no valid session)', error_);
      return { data: null };
    }
  }

  async signOut(): Promise<{ error?: string }> {
    try {
      await logoutUser();
      return {};
    } catch (error: unknown) {
      // Don't block sign out if server logout fails (e.g., token expired)
      const errorMessage = handleServiceError(error, 'Failed to logout');
      return { error: errorMessage };
    }
  }
}

export const authClient = new AuthClient();
