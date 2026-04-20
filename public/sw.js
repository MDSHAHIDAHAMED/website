/* eslint-disable no-restricted-globals */
 
/**
* ===============================
* Service Worker - yieldz-cache
* ===============================
*
* Features:
* 1. Dynamic cache name using build version
* 2. Pre-caching of core static assets with error handling
* 3. Cache-first strategy for pages & static assets
* 4. Network-first strategy for API requests
* 5. Offline fallback for navigation
* 6. Background sync of queued requests via IndexedDB
* 7. Automatic activation and update notification to clients
* 8. Navigation preload enabled for faster page loads
*/
 
// Load build version
importScripts('/sw-version.js');
 
const CACHE_NAME = `yieldz-cache-${self.SW_BUILD}`;
const STATIC_ASSETS = ['/', '/favicon.ico', '/manifest.json', '/offline.html'];
 
// ======= INSTALL =======
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
 
  event.waitUntil(
    (async () => {
      console.log('[SW] Pre-caching static assets...');
      for (const asset of STATIC_ASSETS) {
        try {
          // await caches.open(CACHE_NAME).then(cache => cache.add(asset));
        } catch (err) {
          console.warn(`[SW] Failed to cache ${asset}`, err);
        }
      }
    })()
  );
 
  self.skipWaiting(); // Activate immediately
});
 
// ======= ACTIVATE =======
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
 
  event.waitUntil(
    (async () => {
      if (self.registration.navigationPreload) {
        await self.registration.navigationPreload.enable();
      }
 
      // Delete old caches
      // const cacheKeys = await caches.keys();
      // await Promise.all(cacheKeys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)));
 
      await self.clients.claim();
 
      const clientsList = await self.clients.matchAll({ type: 'window' });
      for (const client of clientsList) {
        client.postMessage({ type: 'NEW_SW_ACTIVATED', build: self.SW_BUILD });
      }
 
      console.log('[SW] Activation complete');
    })()
  );
});
 
// ======= FETCH HANDLER =======
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
 
  if (url.pathname.startsWith('/api/')) {
    // Network-first for API
    event.respondWith(
      (async () => {
        try {
          return await fetch(event.request);
        } catch (err) {
          // const cachedResp = await caches.match(event.request);
          // if (cachedResp) return cachedResp;
          throw err;
        }
      })()
    );
  } else {
    // Pages/assets
    event.respondWith(
      (async () => {
        try {
          const preloadResp = await event.preloadResponse;
          if (preloadResp) return preloadResp;
 
          // const cachedResp = await caches.match(event.request);
          // if (cachedResp) return cachedResp;
 
          const networkResp = await fetch(event.request);
          // if (
          //   networkResp &&
          //   networkResp.status === 200 &&
          //   networkResp.type === 'basic' &&
          //   (event.request.url.startsWith('http://') || event.request.url.startsWith('https://'))
          // ) {
          //   try {
          //     const cache = await caches.open(CACHE_NAME);
          //     await cache.put(event.request, networkResp.clone());
          //   } catch (err) {
          //     console.warn('[SW] Skipped caching for:', event.request.url, err);
          //   }
          // }
          return networkResp;
        } catch (err) {
          // Offline fallback for HTML pages
          const acceptHeader = event.request.headers.get('accept') || '';
          if (acceptHeader.includes('text/html')) {
            const offlineResp = await caches.match('/offline.html');
            if (offlineResp) return offlineResp;
          }
          throw err;
        }
      })()
    );
  }
});
 
// ======= BACKGROUND SYNC =======
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-background') {
    console.log('[SW] Running background sync...');
    event.waitUntil(syncQueuedRequests());
  }
});
 
// ======= INDEXEDDB QUEUE HANDLING =======
const DB_NAME = 'yieldz-sw-db';
const STORE_NAME = 'offline-requests';
 
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
 
async function addToQueue(requestData) {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  tx.objectStore(STORE_NAME).add(requestData);
  await tx.complete;
  db.close();
}
 
async function getQueuedRequests() {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.getAll();
    req.onsuccess = () => {
      resolve(req.result);
      db.close();
    };
  });
}
 
async function removeFromQueue(id) {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  tx.objectStore(STORE_NAME).delete(id);
  await tx.complete;
  db.close();
}
 
async function syncQueuedRequests() {
  const queued = await getQueuedRequests();
  await Promise.all(
    queued.map(async (item) => {
      try {
        await fetch(item.url, {
          method: item.method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item.body),
        });
        await removeFromQueue(item.id);
        console.log('[SW] Synced request:', item.url);
      } catch (err) {
        console.error('[SW] Background sync failed for', item, err);
      }
    })
  );
}
 
// ======= MESSAGE HANDLER =======
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    console.log('[SW] skipWaiting triggered by client');
    self.skipWaiting();
  }
});
 
 