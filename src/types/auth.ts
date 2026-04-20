/**
 * Common Authentication Response Types
 * =====================================
 * Centralized type definitions for authentication API responses
 * to eliminate duplication across the codebase.
 */

/**
 * Session information returned from authentication endpoints
 */
export interface AuthSession {
  session_jwt: string;
  expires_at: number;
  claims?: Record<string, any>;
}

/**
 * User data structure returned from authentication endpoints
 */
export interface AuthUser {
  user_id: string;
  email: string;
  status: string;
  is_locked: boolean;
  created_at: string;
  roles: string[];
  claims?: Record<string, any>;
  external_id?: string;
}

/**
 * Standard authentication response structure
 * Used across OTP verification, passkey registration, and passkey login
 */
export interface AuthResponse {
  data: {
    session: AuthSession;
    user: AuthUser;
  };
}

/**
 * OTP method response (when initiating OTP flow)
 */
export interface OtpMethodResponse {
  data: {
    method_id: string;
  };
}

