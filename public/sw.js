const CACHE_NAME = 'xp-arena-v3';
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
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
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
  if (ASSETS.some(a => req.url.includes(a)) || req.destination === 'style' || req.destination === 'script') {
    event.respondWith(staleWhileRevalidate(req));
  } else {
    event.respondWith(fetch(req).catch(() => caches.match(req)));
  }
});

async function staleWhileRevalidate(req) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(req);
  const networkPromise = fetch(req).then(res => {
    if (res && res.ok) cache.put(req, res.clone());
    return res;
  }).catch(() => null);
  return cached || networkPromise || fetch(req);
}
