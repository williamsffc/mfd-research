/**
 * Service Worker for MFD Research Website
 * Provides offline functionality and faster loading through intelligent caching
 *
 * Cache Strategy:
 * - Static assets: Cache first, network fallback
 * - Pages: Network first, cache fallback
 * - Images: Cache first with size limits
 */

// The placeholder below is replaced with a per-build id (see astro.config.mjs).
const BUILD_VERSION = '__BUILD_VERSION__';
const CACHE_VERSION = `mfd-research-${BUILD_VERSION}`;
const RUNTIME_CACHE = `mfd-runtime-${BUILD_VERSION}`;

// Assets to cache immediately on install
const PRECACHE_URLS = [
  '/',
  '/assets/mfd-logo.jpg',
  '/assets/favicon.svg',
];

// Cache size limits (in items)
const MAX_CACHE_SIZE = 50;
const MAX_PAGE_CACHE_SIZE = 20;
const CACHEABLE_DESTINATIONS = new Set(['script', 'style', 'image', 'font']);

/**
 * Install event - cache critical assets
 */
self.addEventListener('install', (event) => {

  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => {
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => self.skipWaiting()) // Activate immediately
  );
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', (event) => {

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

  // Keep navigation documents network-first to reduce stale/poisoned-page risk.
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_VERSION).then(async (cache) => {
              await cache.put(request, responseToCache);
              await trimCache(CACHE_VERSION, MAX_PAGE_CACHE_SIZE, PRECACHE_URLS);
            });
          }
          return networkResponse;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match('/')))
    );
    return;
  }

  if (!CACHEABLE_DESTINATIONS.has(request.destination)) {
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
            return caches.match('/');
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
        return caches.open(RUNTIME_CACHE)
          .then((cache) => {
            cache.put(request, response);
            trimCache(RUNTIME_CACHE, MAX_CACHE_SIZE);
          });
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
 * @param {string[]} [keep] - Paths that must never be evicted
 */
async function trimCache(cacheName, maxItems, keep = []) {
  const cache = await caches.open(cacheName);
  const keepSet = new Set(keep.map((path) => new URL(path, self.location.origin).href));
  const keys = (await cache.keys()).filter((key) => !keepSet.has(key.url));

  // Remove oldest items (keys are in insertion order); pinned entries are never evicted
  const itemsToDelete = keys.length - maxItems;
  for (let i = 0; i < itemsToDelete; i++) {
    await cache.delete(keys[i]);
  }
}

/**
 * Message handler - allows page to control service worker
 */
self.addEventListener('message', (event) => {
  const sourceUrl = event.source && event.source.url ? new URL(event.source.url) : null;
  if (sourceUrl && sourceUrl.origin !== self.location.origin) {
    return;
  }

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      );
    }).then(() => {
      if (event.ports && event.ports[0]) {
        event.ports[0].postMessage({ success: true });
      }
    });
  }
});

