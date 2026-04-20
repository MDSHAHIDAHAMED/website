import { Metadata } from 'next';
import * as React from 'react';

import { config } from '@/config';

interface LayoutProps {
  children: React.ReactNode;
}

export const metadata = { title: config.site.name + ' - Launch App', description: config.site.description } satisfies Metadata;

export default function Layout({ children }: Readonly<LayoutProps>): React.JSX.Element {
  return (
    <React.Fragment>{children}</React.Fragment>
  );
}
