'use client';

import { authPatchMethod } from '@/services/api';
import endPoints from '@/services/urls';
import { RootState, useSelector } from '@/store';
import { showErrorToast, showSuccessToast } from '@/utils/toast';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import AtomButton from '@/components/atoms/button';
import ProfileItem from '@/components/atoms/profile-item';
import AtomTypography from '@/components/atoms/typography';
import ConfirmActionModal from '@/components/molecules/confirmation-dialog';
import { ConnectWallet } from '@/components/wallet/connect-wallet';
import { usePasskeyState } from '@/hooks/use-passkey-state';
import { useUser } from '@/hooks/use-user';
import { useWalletState } from '@/hooks/use-wallet';
import { authClient } from '@/lib/auth/custom/client';
import { paths } from '@/paths';

/**
 * Profile Page Component
 *
 * Displays user profile information organized into sections:
 * - Account: Email, Passkey, Account Verification
 * - Security: Two-Factor Authentication
 * - Wallets: Connect Wallets
 *
 * Each section contains ProfileItem components that display
 * information cards with icons, descriptions, status, and action buttons.
 */
export default function ProfilePage(): React.JSX.Element {
  const { t } = useTranslation(['profile']);
  const { webauthn_registration_id } = useSelector((state: RootState) => state.passkey);
  const { hasPasskeyForUser } = useSelector((state: RootState) => state.device);
  const [isRevokeDialogOpen, setIsRevokeDialogOpen] = React.useState(false);
  const [isRevoking, setIsRevoking] = React.useState(false);
  const router = useRouter();
  const { clearUser, user } = useUser();
  const { setIsPasskeyEnabled } = usePasskeyState();
  const { address, displayName, disconnect } = useWalletState('ethereum');
  const handleDisconnect = async () => {
    await disconnect();
  };

  const handleSignOut = React.useCallback(async (): Promise<void> => {
    try {
      await authClient.signOut();
      handleDisconnect();
      // Clear user state immediately
      clearUser();
      // Redirect to sign-in page
      router.push(paths.auth.custom.signIn);
    } catch {
      clearUser();
      router.push(paths.auth.custom.signIn);
    } finally {
      setIsPasskeyEnabled(false);
    }
  }, [clearUser, router, setIsPasskeyEnabled]);

  /**
   * Handle email update action
   */
  const handleEmailUpdate = () => {
    console.log('Update email clicked');
  };

  /**
   * Handle passkey change action
   */
  const handlePasskeyChange = () => {
    console.log('Change passkey clicked');
  };

  /**
   * Handle account verification action
   */
  const handleAccountVerification = () => {
    console.log('Verify account clicked');
  };

  /**
   * Handle 2FA enable action
   */
  const handle2FAEnable = () => {
    console.log('Enable 2FA clicked');
  };

  /**
   * Open revoke passkey confirmation dialog
   */
  const handleRevokeClick = () => {
    setIsRevokeDialogOpen(true);
  };

  /**
   * Handle revoke passkey action (called after confirmation)
   * Uses PATCH /me/passkeys/{passkey_id}/revoke endpoint
   */
  const revokePasskey = async () => {
    if (!webauthn_registration_id) {
      showErrorToast('passkey-revoked-error', t('profile:passkeyRevokedError'));
      return;
    }

    setIsRevoking(true);
    try {
      // PATCH request with passkey_id as path parameter, no body needed
      await authPatchMethod(endPoints.REVOKE_PASSKEY(webauthn_registration_id));
      setIsRevokeDialogOpen(false);
      await handleSignOut();
      showSuccessToast('passkey-revoked-successfully', t('profile:accountRemovedFromBrowserSuccess'));
    } catch {
      showErrorToast('passkey-revoked-error', t('profile:passkeyRevokedError'));
    } finally {
      setIsRevoking(false);
    }
  };
  // Handle copy to clipboard
  const handleCopyAddress = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(address ?? '');
      showSuccessToast('wallet-address-copied', 'address copied to clipboard');
    } catch {
      showErrorToast('wallet-address-copied-error', 'Failed to copy address');
    }
  }, [address]);

  return (
    <Box
      sx={{
        maxWidth: 'var(--Content-maxWidth)',
        m: 'var(--Content-margin)',
        p: 'var(--Content-padding)',
        py: '30px',
        width: 'var(--Content-width)',
      }}
    >
      {/* Page Title */}
      <AtomTypography variant="h1" color="text.primary">
        {t('profile:myProfile')}
      </AtomTypography>

      <Stack spacing={4} sx={{ marginTop: 4 }}>
        {/* Account Section */}
        <Box>
          <AtomTypography
            variant="h4"
            color="text.primary"
            sx={{
              fontWeight: 615,
            }}
          >
            {t('profile:account')}
          </AtomTypography>
          <Stack sx={{ marginTop: 2 }}>
            {/* Email Address */}
            <ProfileItem
              button={
                <AtomButton
                  id="profile-item-email-button"
                  variant="contained"
                  label={t('profile:updateEmail')}
                  size="medium"
                  onClick={handleEmailUpdate}
                />
              }
              icon={<Image src="/assets/icons/mail.svg" alt="Email" width={24} height={24} />}
              title={t('profile:emailAddress')}
              description={user?.email ?? ''}
              status="Verified"
              statusColor="success"
            />

            {/* Passkey */}
            <ProfileItem
              icon={<Image src="/assets/icons/lock.svg" alt="Passkey" width={24} height={24} />}
              title={t('profile:passkey')}
              description="Secure your account using a passkey for faster, password-less login with enhanced protection against unauthorized access."
              status={hasPasskeyForUser ? 'Active' : 'Inactive'}
              statusColor={hasPasskeyForUser ? 'success' : 'default'}
              button={[
                <AtomButton
                  id="profile-item-passkey-button"
                  variant="contained"
                  label={t('profile:change')}
                  size="medium"
                  onClick={handlePasskeyChange}
                  key="profile-item-passkey-button"
                />,
                <AtomButton
                  id="profile-item-revoke-passkey-button"
                  variant="contained"
                  label={t('profile:removeAccountFromBrowser')}
                  size="medium"
                  onClick={handleRevokeClick}
                  disabled={isRevoking || !hasPasskeyForUser}
                  isLoading={isRevoking}
                  key="profile-item-revoke-passkey-button"
                />,
              ]}
            />
            {/* Account Verification */}
            <ProfileItem
              icon={<Image src="/assets/icons/verification.svg" alt="Verification" width={24} height={24} />}
              title={t('profile:accountVerification')}
              description="Verify your identity to unlock full platform features, increase limits, and ensure compliance with security standards."
              status="Not Verified"
              statusColor="default"
              button={
                <AtomButton
                  id="profile-item-verification-button"
                  variant="contained"
                  label={t('profile:verify')}
                  size="medium"
                  onClick={handleAccountVerification}
                />
              }
            />
          </Stack>
        </Box>

        {/* Security Section */}
        <Box>
          <AtomTypography
            variant="h4"
            color="text.primary"
            sx={{
              fontWeight: 615,
            }}
          >
            {t('profile:security')}
          </AtomTypography>
          <Stack sx={{ marginTop: 2 }}>
            {/* Two-Factor Authentication */}
            <ProfileItem
              icon={<Image src="/assets/icons/safety.svg" alt="Verification" width={24} height={24} />}
              title={t('profile:twoFactorAuthentication')}
              description="Add an extra layer of security to your account by requiring a verification code during sign-in and sensitive actions."
              status={hasPasskeyForUser ? 'Active' : 'Inactive'}
              statusColor={hasPasskeyForUser ? 'success' : 'default'}
              button={
                <AtomButton
                  id="profile-item-2fa-button"
                  variant="contained"
                  label={t('profile:enable')}
                  size="medium"
                  onClick={handle2FAEnable}
                />
              }
            />
          </Stack>
        </Box>

        {/* Wallets Section */}
        <Box>
          <AtomTypography
            variant="h4"
            color="text.primary"
            sx={{
              fontWeight: 615,
            }}
          >
            {t('profile:wallets')}
          </AtomTypography>
          <Stack sx={{ marginTop: 2 }}>
            {/* Connect Wallets */}
            <ProfileItem
              icon={<Image src="/assets/icons/wallets.svg" alt="Verification" width={24} height={24} />}
              type="listing"
              title={t('profile:connectWallets')}
              description="Link your blockchain wallets to view balances, track transactions, and interact seamlessly with platform features."
              button={<ConnectWallet />}
              listItems={
                displayName
                  ? [
                      {
                        address: displayName,
                        onUnlink: () => {
                          void handleDisconnect();
                        },
                        onCopyAddress: () => {
                          handleCopyAddress();
                        },
                      },
                    ]
                  : []
              }
            />
          </Stack>
        </Box>
      </Stack>

      {/* Revoke Passkey Confirmation Dialog */}
      <ConfirmActionModal
        open={isRevokeDialogOpen}
        onClose={() => setIsRevokeDialogOpen(false)}
        onConfirm={revokePasskey}
        title={t('profile:confirmRemoveAccount')}
        description={t('profile:confirmRemoveAccountDescription')}
        confirmButtonText={t('profile:confirm')}
        cancelButtonText={t('profile:cancel')}
        isLoading={isRevoking}
      />
    </Box>
  );
}
