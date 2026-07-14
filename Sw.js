const CACHE = 'diplomat-v1';
const URLS = ['/Diplomat_Cars/', '/Diplomat_Cars/index.html', '/Diplomat_Cars/manifest.json'];

const NOTIF_ICON = 'https://i.ibb.co/QFKYPWBc/IMG-20260622-WA0006.jpg';

self.addEventListener('install', e => {
    e.waitUntil(caches.open(CACHE).then(c => c.addAll(URLS)));
    self.skipWaiting();
});

self.addEventListener('activate', e => {
    e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', e => {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});

// ✅ إشعارات الدفع من OneSignal
self.addEventListener('push', e => {
    let data = {};
    try {
        data = e.data ? e.data.json() : {};
    } catch(err) {
        data = {};
    }
    
    const title = data.title || data.headings?.en || data.headings?.ar || 'الدبلوماسي للسيارات';
    const body = data.body || data.contents?.en || data.contents?.ar || '🚗 سيارات جديدة بانتظارك!';
    const image = data.image || data.big_picture || "";
    
    const options = {
        body: body,
        icon: NOTIF_ICON,
        badge: NOTIF_ICON,
        vibrate: [200, 100, 200],
        tag: data.tag || 'diplomat',
        renotify: true,
        requireInteraction: false,
        data: {
            url: data.url || data.data?.url || '/Diplomat_Cars/',
            branch: data.branch || data.data?.branch || ''
        },
        image: image,
        actions: [
            { action: 'open', title: '🔍 تصفح الآن' },
            { action: 'close', title: '❌ إغلاق' }
        ]
    };
    
    e.waitUntil(self.registration.showNotification(title, options));
});

// ✅ عند النقر على الإشعار
self.addEventListener('notificationclick', e => {
    e.notification.close();
    const urlToOpen = e.notification.data?.url || '/Diplomat_Cars/';
    
    if (e.action === 'close') return;
    
    e.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
            for (const client of clients) {
                if (client.url.includes('Diplomat_Cars') && 'focus' in client) {
                    return client.focus();
                }
            }
            if (self.clients.openWindow) {
                return self.clients.openWindow(urlToOpen);
            }
        })
    );
});
