import type { Metadata } from 'next';
import * as React from 'react';

import { config } from '@/config';

export const metadata: Metadata = {
  title: `Portfolio | Dashboard | ${config.site.name}`,
};

interface LayoutProps {
 readonly children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  return <>{children}</>;
}

