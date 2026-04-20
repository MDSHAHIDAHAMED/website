import type { Metadata } from 'next';
import * as React from 'react';

import { VerifyPhoneForm } from '@/components/auth/custom/verify-phone';
import { config } from '@/config';

export const metadata: Metadata = { title: `Verify Phone | Custom | Auth | ${config.site.name}` };

export default function Page(): React.JSX.Element {
  return <VerifyPhoneForm />;
}

