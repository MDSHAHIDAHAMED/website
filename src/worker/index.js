/**
 * Custom Service Worker
 * =====================
 * Handles lifecycle events for PWA update notifications.
 */

globalThis.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    globalThis.skipWaiting();
  }
});

globalThis.addEventListener('activate', async () => {
  const clients = await globalThis.clients.matchAll({ type: 'window' });
  for (const client of clients) {
    client.postMessage({ type: 'NEW_SW_ACTIVATED' });
  }
});
