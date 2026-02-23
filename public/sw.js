const CACHE_NAME = 'xp-arena-v2';
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
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap'
];

self.addEventListener('install', (event) => {
    // Force immediate takeover
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

self.addEventListener('activate', (event) => {
    // Delete old caches so users get the fresh updates!
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    // Use Network-First caching strategy! Guarantees the newest updates are shown immediately, but still works flawlessly offline.
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});
