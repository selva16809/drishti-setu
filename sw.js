// Unregister any old caches immediately to ensure fresh code
self.addEventListener('install', (e) => {
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(keys.map(key => caches.delete(key)));
        })
    );
    self.clients.claim();
});

// Always fetch fresh network copies during development
self.addEventListener('fetch', (e) => {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
