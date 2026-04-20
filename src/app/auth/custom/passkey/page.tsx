import type { Metadata } from 'next';
import * as React from 'react';

import { EnablePasskeyForm } from '@/components/auth/custom/enable-passkey';
import { GuestGuard } from '@/components/auth/guest-guard';
import { config } from '@/config';

export const metadata: Metadata = {
  title: `Enable Passkey  | ${config.site.name}`,
};

export default function Page(): React.JSX.Element {
  return (
    <GuestGuard>
      <EnablePasskeyForm />
    </GuestGuard>
  );
}
