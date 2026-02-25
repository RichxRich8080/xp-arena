const CACHE_NAME = 'xp-arena-v4';
const ASSETS = [
  '/',
  '/index.html',
  '/tool.html',
  '/leaderboard.html',
  '/submit.html',
  '/css/main.css',
  '/js/auth.js',
  '/js/user.js',
  '/js/layout.js',
  '/js/app.js',
  '/js/effects.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(names =>
      Promise.all(names.map(n => n !== CACHE_NAME ? caches.delete(n) : undefined))
    ).then(() => self.clients.claim())
  );
  self.clients.matchAll({ type: 'window' }).then(clients => {
    clients.forEach(c => c.postMessage({ type: 'SW_ACTIVE', version: CACHE_NAME }));
  });
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  // For API calls, always go network-first
  if (req.url.includes('/api/')) {
    event.respondWith(fetch(req).catch(() => caches.match(req)));
    return;
  }

  // For static assets, use stale-while-revalidate
  if (ASSETS.some(a => req.url.includes(a)) || req.destination === 'style' || req.destination === 'script' || req.destination === 'image') {
    event.respondWith(staleWhileRevalidate(req));
  } else {
    event.respondWith(fetch(req).catch(() => caches.match(req)));
  }
});

async function staleWhileRevalidate(req) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(req);

    const networkPromise = fetch(req).then(res => {
      if (res && res.status === 200) cache.put(req, res.clone());
      return res;
    }).catch(err => {
      console.warn('[SW] Fetch failed:', err);
      return null;
    });

    // Return cached response if available, otherwise wait for network
    return cached || networkPromise || fetch(req);
  } catch (err) {
    console.error('[SW] staleWhileRevalidate error:', err);
    return fetch(req);
  }
}
