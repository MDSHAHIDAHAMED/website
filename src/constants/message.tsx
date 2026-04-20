import { sepolia } from 'wagmi/chains';

export const MESSAGES = {
  WALLET_NOT_CONNECTED: 'Please connect your wallet first',
}

export const WRONG_CHAIN_MESSAGE = `Please switch to ${process.env.NEXT_PUBLIC_CUSTOM_CHAIN_NAME ?? 'Sepolia'} (Chain ID: ${sepolia.id}) in your wallet`;
