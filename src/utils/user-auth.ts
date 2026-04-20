/**
 * User object returned from authentication APIs
 */
export interface AuthUser {
  user_id: string;
  email: string;
  status: string;
  is_locked: boolean;
  created_at: string;
  roles: string[];
  metadata?: Record<string, unknown>;
  claims?: Record<string, unknown>;
  external_id?: string;
}

/**
 * Session object returned from authentication APIs
 */
export interface AuthSession {
  session_jwt: string;
  expires_at: number;
  claims?: Record<string, unknown>;
  auth_type?: 'FULL' | 'PARTIAL';
}

/**
 * Device object returned from authentication APIs
 * Provided on unauthenticated requests (e.g., OTP verify during signup/login)
 */
export interface AuthDevice {
  device_id: string;
  platform: 'WEB' | 'IOS' | 'ANDROID';
  display_name: string;
  created_at: string;
  last_seen_at: string;
  status: 'ACTIVE' | 'REVOKED' | 'BLOCKED';
  first_seen_at: string;
  last_auth_at: string;
  has_passkey_for_user: boolean;
}

/**
 * Passkey object returned from passkey authentication APIs
 * Contains information about the passkey used for authentication
 */
export interface AuthPasskey {
  id: string;
  name: string;
  created_at: string;
  last_used_at: string;
  device_id: string;
  platform: 'WEB' | 'IOS' | 'ANDROID';
  display_name: string;
}

/**
 * Standard authentication response from OTP verify and other auth endpoints
 * Matches the /otp/verify API response structure
 */
export interface AuthResponse {
  data: {
    user: AuthUser;
    session: AuthSession;
    device?: AuthDevice; // Optional: Provided on unauthenticated requests
  };
}

/**
 * Response from /passkeys/login/finish endpoint
 */
export interface PasskeyLoginFinishResponse {
  data: {
    user: AuthUser;
    session: AuthSession;
    passkey: AuthPasskey;
    device: AuthDevice;
  };
}

/**
 * Response from /passkeys/register/finish endpoint
 * Note: This response IS wrapped in `data` object
 */
export interface PasskeyRegisterFinishResponse {
  data: {
    user: AuthUser;
    session: AuthSession;
    passkey: AuthPasskey;
  };
}