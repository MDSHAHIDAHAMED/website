import * as React from 'react';

/**
 * useResendTimer
 * Manages a simple countdown timer for resend/cooldown flows (e.g., OTP resend).
 *
 * API:
 * - resendTimer: number (seconds remaining)
 * - isActive: boolean (whether timer is running)
 * - start(seconds): void (start or restart the timer with given seconds)
 * - reset(): void (stop timer and set to 0)
 */
export function useResendTimer() {
  const [resendTimer, setResendTimer] = React.useState<number>(0);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const clearTimer = React.useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const start = React.useCallback((seconds: number) => {
    clearTimer();
    setResendTimer(seconds);

    timerRef.current = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [clearTimer]);

  const reset = React.useCallback(() => {
    clearTimer();
    setResendTimer(0);
  }, [clearTimer]);

  React.useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  return {
    resendTimer,
    isActive: resendTimer > 0,
    start,
    reset,
  } as const;
}


