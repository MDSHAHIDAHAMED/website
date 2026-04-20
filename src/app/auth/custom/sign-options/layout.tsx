import { GuestGuard } from '@/components/auth/guest-guard';
import { config } from '@/config';
import { Metadata } from 'next';
import * as React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}
export const metadata = { title: `Sign In / Sign Up | ${config.site.name}` } satisfies Metadata;

export default function Layout({ children }: Readonly<LayoutProps>): React.JSX.Element {
  return (
    <GuestGuard>
      {children}
    </GuestGuard>
  );
}
