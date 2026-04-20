import * as React from 'react';
import { config } from '@/config';
import type { Metadata } from 'next';

interface LayoutProps {
  readonly children: React.ReactNode;
}

export const metadata: Metadata = {
  title: `Token Details | ${config.site.name}`,
};

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  return <>{children}</>;
}

