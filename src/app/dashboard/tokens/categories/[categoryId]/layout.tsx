import { config } from '@/config';
import type { Metadata } from 'next';
import * as React from 'react';

interface LayoutProps {
  readonly children: React.ReactNode;
}

export const metadata: Metadata = {
  title: `Token List - Category | ${config.site.name}`,
};

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  return <>{children}</>;
}

