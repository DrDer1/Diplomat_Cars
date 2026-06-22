const CACHE = 'diplomat-v1';
const URLS = ['/Diplomat_Cars/', '/Diplomat_Cars/index.html', '/Diplomat_Cars/manifest.json'];

self.addEventListener('install', e => {
    e.waitUntil(caches.open(CACHE).then(c => c.addAll(URLS)));
});

self.addEventListener('fetch', e => {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
