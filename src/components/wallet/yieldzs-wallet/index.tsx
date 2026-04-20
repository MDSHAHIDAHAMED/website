import {
    type Wallet,
    getWalletConnectConnector,
} from '@rainbow-me/rainbowkit';
  
  /**
   * ✅ Custom Yieldz Wallet (via WalletConnect)
   * Compatible with RainbowKit v2.x and Wagmi v2.x
   */
  export interface YieldzWalletOptions {
    projectId: string;
  }
  
  export const yldzWallet = ({ projectId }: YieldzWalletOptions): Wallet => ({
    id: 'yldz-wallet',
    name: 'YIELDZ Wallet',
    iconUrl: '/assets/logo-dark.svg',
    iconBackground: '#000000',
    downloadUrls: {
      android: 'https://play.google.com/store/apps/details?id=com.yieldz.app',
      ios: 'https://apps.apple.com/app/idXXXXXXX',
      qrCode: 'https://yieldz.app/qr',
    },
    createConnector: getWalletConnectConnector({
      projectId,
    }),
    qrCode: {
      getUri: (uri: string) => uri,
      instructions: {
        learnMoreUrl: 'https://yieldz.app',
        steps: [
          {
            step: 'install',
            title: 'Open the Yieldz Wallet App',
            description:
              'Download and install the Yieldz Wallet from your app store.',
          },
          {
            step: 'scan',
            title: 'Scan the QR Code',
            description:
              'Open the app and use the QR code scanner to connect your wallet.',
          },
        ],
      },
    },
  });
  