'use client';

import { AtomButton } from "@/components/atoms/button";

/**
 * Offline Page Component
 * ======================
 * Displayed when the user is offline and tries to access a cached page.
 * Uses the 'use client' directive to enable interactivity (onClick handler).
 */
export default function OfflinePage(): React.JSX.Element {
  /**
   * Handle retry button click - reloads the page
   */
  const handleRetry = (): void => {
    globalThis.location.reload();
  };

  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <h1>You&apos;re offline</h1>
      <p>Please check your internet connection.</p>
      <AtomButton onClick={handleRetry} type="button" label="Retry" id="offline-retry-btn" />
    </div>
  );
}
  