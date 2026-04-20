import type { Metadata } from 'next';
import * as React from 'react';

import { config } from '@/config';

export const metadata: Metadata = {
  title: `Profile | Dashboard | ${config.site.name}`,
};

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: Readonly<LayoutProps>): React.JSX.Element {
  return <>{children}</>;
}

