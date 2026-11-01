// Service Worker بۆ ئەپی مزگەوتەکانی پێنجوێن (Offline & Online PWA)
const CACHE_NAME = 'penjwen-mosques-v52-full-offline';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './tailwind.min.js',
  './fontawesome.offline.min.css',
  './fonts.offline.css',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// 1. Install Event: Cache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching app shell for offline use');
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('[SW] Some external CDN assets could not be pre-cached, will cache on fetch:', err);
      });
    })
  );
  self.skipWaiting();
});

// 2. Activate Event: Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Fetch Event: Cache First for static assets, Network First with Cache Fallback for APIs
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // For GitHub Gist / Real-time Sync APIs / Mosques Data: Bypass Service Worker completely (Network Only)
  if (
    url.hostname.includes('github.com') ||
    url.hostname.includes('githubusercontent.com') ||
    (url.hostname.includes('github.io') && url.pathname.includes('.json')) ||
    url.pathname.includes('penjwen_mosques_data.json') ||
    url.pathname.includes('penjwen_sync_meta.json') ||
    url.hostname.includes('ntfy.sh')
  ) {
    return;
  }

  // For external APIs (Open-Meteo, Aladhan): Network first, then cache
  if (url.hostname.includes('open-meteo.com') || url.hostname.includes('aladhan.com')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
    return;
  }

  // For app assets & static files: Network first with cache fallback
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});
