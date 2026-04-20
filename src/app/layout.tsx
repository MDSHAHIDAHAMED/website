import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import type { Metadata, Viewport } from 'next';
import * as React from 'react';

import '@/styles/global.css';

import ServiceWorkerProvider from '@/providers/service-worker';
import { SocketProvider } from '@/providers/socket';
import { StoreProvider } from '@/providers/store';
import { WalletProvider } from '@/providers/wagmi-provider';

import { Analytics } from '@/components/core/analytics';
import { I18nProvider } from '@/components/core/i18n-provider';
import { LocalizationProvider } from '@/components/core/localization-provider';
import { ThemeProvider } from '@/components/core/theme-provider/theme-provider';
import { Toaster } from '@/components/core/toaster';
import { config } from '@/config';
import { UserProvider } from '@/contexts/auth/user-context';
import { SettingsProvider } from '@/contexts/settings';
import { applyDefaultSettings } from '@/lib/settings/apply-default-settings';
import { getSettings as getPersistedSettings } from '@/lib/settings/get-settings';

export const metadata = {
  title: config.site.name,
  manifest: '/manifest.json',
} satisfies Metadata;

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: config.site.themeColor,
} satisfies Viewport;

interface LayoutProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: Readonly<LayoutProps>): Promise<React.JSX.Element> {
  const settings = applyDefaultSettings(await getPersistedSettings());
  // const socketUrl = process.env.NEXT_PUBLIC_PUSHER_AUTH_ENDPOINT;
  return (
    <html lang={settings.language} suppressHydrationWarning>
      <head>
        {/* MUI Init Color Scheme can stay in body, no need in head */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content={config.site.themeColor} />
      </head>
      <body>
        <InitColorSchemeScript attribute="class" />
        <Analytics>
          <LocalizationProvider>
            <SocketProvider serverUrl={config.socket.url}>
              <StoreProvider>
                <WalletProvider>
                  <UserProvider>
                    <SettingsProvider settings={settings}>
                      <I18nProvider lng={settings.language}>
                        <ThemeProvider>
                          <ServiceWorkerProvider>
                            {children}
                            {/* <SettingsButton /> */}
                            <Toaster position="bottom-right" />
                          </ServiceWorkerProvider>
                        </ThemeProvider>
                      </I18nProvider>
                    </SettingsProvider>
                  </UserProvider>
                </WalletProvider>
              </StoreProvider>
            </SocketProvider>
          </LocalizationProvider>
        </Analytics>
      </body>
    </html>
  );
}
