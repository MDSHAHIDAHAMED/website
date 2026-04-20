import type { Metadata } from 'next';
import * as React from 'react';

import { TOTPAuthenticatorForm } from '@/components/auth/custom/totp-authenticator';
import { GuestGuard } from '@/components/auth/guest-guard';
import { config } from '@/config';

export const metadata: Metadata = {
  title: `TOTP Authenticator | ${config.site.name}`,
};

export default function Page(): React.JSX.Element {
  return (
    <GuestGuard>
        <TOTPAuthenticatorForm />
    </GuestGuard>
  );
}
