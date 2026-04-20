'use client';

/**
 * Onramper Flow
 * =============
 *
 * Owns onramper dialog state and handlers. Parent opens the dialog by calling
 * ref.current.open(amountIn, tokenIn). Renders OnramperDialog.
 */

import type { InitiateOnrampRequest } from '@/services/onramp';
import { clearTransaction } from '@/store/slices/onramp-slice';
import { initiateOnrampTransactionThunk } from '@/store/thunks/onramp-thunk';
import OnramperDialog from '@/components/molecules/onramper-dialog';
import { paths } from '@/paths';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface OnramperFlowHandle {
  /** Open onramper dialog with given amount and token. Call from parent when balance is insufficient. */
  open: (amountIn: string, tokenIn: string) => Promise<void>;
}

export interface OnramperFlowProps {
  walletAddress: `0x${string}` | undefined;
  userId: string | undefined;
  /** Redux current transaction (partnerContext for dialog) */
  partnerContext: string | undefined;
  /** Called when dialog open state changes (e.g. for parent to show "Buy USDC" when open) */
  onOpenChange?: (open: boolean) => void;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export const OnramperFlow = forwardRef<OnramperFlowHandle, OnramperFlowProps>(
  function OnramperFlow({ walletAddress, userId, partnerContext, onOpenChange }, ref) {
    const dispatch = useDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [isOnramperOpen, setIsOnramperOpen] = useState(false);
    const [isOnrampLoading, setIsOnrampLoading] = useState(false);
    const [onramperAmount, setOnramperAmount] = useState<string | undefined>(undefined);
    const [onramperCurrency, setOnramperCurrency] = useState<string | undefined>(undefined);

    const openOnramper = useCallback(
      async (amountIn: string, tokenIn: string): Promise<void> => {
        setIsOnrampLoading(true);
        setIsOnramperOpen(true);
        onOpenChange?.(true);
        setOnramperAmount(amountIn);
        setOnramperCurrency(tokenIn);
        try {
          const initialPartnerContext = `${Date.now()}_${userId ?? 'anonymous'}`;
          const onrampPayload: InitiateOnrampRequest = {
            walletAddress: walletAddress!,
            partnerContext: initialPartnerContext,
            amountIn: amountIn ? Number.parseFloat(amountIn) : undefined,
            sourceCurrency: 'USD',
            targetCurrency: tokenIn,
            metadata: { userId, currency: tokenIn },
          };
          await dispatch(initiateOnrampTransactionThunk(onrampPayload) as never);
        } finally {
          setIsOnrampLoading(false);
        }
      },
      [walletAddress, userId, dispatch, onOpenChange]
    );

    useImperativeHandle(ref, () => ({ open: openOnramper }), [openOnramper]);

    const handleOnramperClose = useCallback(() => {
      setIsOnramperOpen(false);
      setIsOnrampLoading(false);
      setOnramperAmount(undefined);
      setOnramperCurrency(undefined);
      onOpenChange?.(false);
      dispatch(clearTransaction());
    }, [dispatch, onOpenChange]);

    useEffect(() => {
      if (searchParams.get('success') === 'true') {
        router.replace(paths.dashboard.yldzsToken, { scroll: false });
      }
    }, [searchParams, router]);

    return (
      <OnramperDialog
        open={isOnramperOpen}
        onClose={handleOnramperClose}
        amount={onramperAmount}
        currency={onramperCurrency}
        walletAddress={walletAddress}
        partnerContext={partnerContext}
        authUserId={userId}
        isLoading={isOnrampLoading}
      />
    );
  }
);
