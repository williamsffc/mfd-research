/**
 * Service Worker for MFD Research Website
 * Provides offline functionality and faster loading through intelligent caching
 *
 * Cache Strategy:
 * - Static assets: Cache first, network fallback
 * - Pages: Network first, cache fallback
 * - Images: Cache first with size limits
 */

const CACHE_VERSION = 'mfd-research-v1';
const RUNTIME_CACHE = 'mfd-runtime';

// Assets to cache immediately on install
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/assets/mfd-logo.jpg',
  '/assets/favicon.svg',
  // Add other critical assets
];

// Cache size limits (in items)
const MAX_CACHE_SIZE = 50;

/**
 * Install event - cache critical assets
 */
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');

  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => {
        console.log('[Service Worker] Precaching app shell');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => self.skipWaiting()) // Activate immediately
  );
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              // Delete old versions
              return cacheName !== CACHE_VERSION && cacheName !== RUNTIME_CACHE;
            })
            .map((cacheName) => {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => self.clients.claim()) // Take control immediately
  );
});

/**
 * Fetch event - intelligent caching strategy
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests and certain request types
  if (url.origin !== location.origin || request.method !== 'GET') {
    return;
  }

  // Skip form submissions
  if (request.url.includes('submit') || request.url.includes('?')) {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // Strategy: Cache first, then network
        if (cachedResponse) {
          // Return cached version, but update cache in background
          updateCache(request);
          return cachedResponse;
        }

        // Not in cache - fetch from network
        return fetch(request)
          .then((networkResponse) => {
            // Only cache successful responses
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();

              caches.open(RUNTIME_CACHE)
                .then((cache) => {
                  cache.put(request, responseToCache);
                  trimCache(RUNTIME_CACHE, MAX_CACHE_SIZE);
                });
            }

            return networkResponse;
          })
          .catch(() => {
            // Network failed - try to return offline page or fallback
            return caches.match('/index.html');
          });
      })
  );
});

/**
 * Update cache in background
 * @param {Request} request - The request to update
 */
function updateCache(request) {
  return fetch(request)
    .then((response) => {
      if (response && response.status === 200) {
        return caches.open(CACHE_VERSION)
          .then((cache) => cache.put(request, response));
      }
    })
    .catch(() => {
      // Silently fail - we have cached version
    });
}

/**
 * Limit cache size by removing oldest entries
 * @param {string} cacheName - Name of the cache to trim
 * @param {number} maxItems - Maximum number of items to keep
 */
async function trimCache(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();

  if (keys.length > maxItems) {
    // Remove oldest items
    const itemsToDelete = keys.length - maxItems;
    for (let i = 0; i < itemsToDelete; i++) {
      await cache.delete(keys[i]);
    }
  }
}

/**
 * Message handler - allows page to control service worker
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      );
    }).then(() => {
      event.ports[0].postMessage({ success: true });
    });
  }
});

console.log('[Service Worker] Loaded');
