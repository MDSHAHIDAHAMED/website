import * as React from 'react';

import { AuthGuard } from '@/components/auth/auth-guard';
import { DynamicLayout } from '@/components/dashboard/layout/dynamic-layout';
import { config } from '@/config';
import type { Metadata } from 'next';

interface LayoutProps {
 readonly children: React.ReactNode;
}

export const metadata: Metadata = {
  title: `Dashboard | ${config.site.name} `,
};

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <AuthGuard>
      <DynamicLayout>{children}</DynamicLayout>
    </AuthGuard>
  );
}
