import type { Metadata } from 'next';
import * as React from 'react';

import { VerifyCodeForm } from '@/components/auth/custom/verify-code';
import { GuestGuard } from '@/components/auth/guest-guard';
import { config } from '@/config';

export const metadata: Metadata = {
  title: `Verify Code | ${config.site.name}`,
};

interface PageProps {
  params: {
    type: string;
  };
}

/**
 * Dynamic verify code page that handles different verification types:
 * - /auth/custom/verify-code/email
 * - /auth/custom/verify-code/sms
 * - /auth/custom/verify-code/totp
 * 
 * @param params - Route parameters containing the verification type
 */
export default function Page({ params }: Readonly<PageProps>): React.JSX.Element {
  return (
    <GuestGuard>
      <VerifyCodeForm verificationType={params.type} />
    </GuestGuard>
  );
}

