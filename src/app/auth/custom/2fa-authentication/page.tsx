import type { Metadata } from 'next';
import * as React from 'react';

import { TwoFactorAuthenticationForm } from '@/components/auth/custom/2fa-authentication';
import { GuestGuard } from '@/components/auth/guest-guard';
import { config } from '@/config';

export const metadata: Metadata = {
  title: `2FA Authentication | ${config.site.name}`,
};

export default function Page(): React.JSX.Element {
  return (
    <GuestGuard>
      <TwoFactorAuthenticationForm />
    </GuestGuard>
  );
}

