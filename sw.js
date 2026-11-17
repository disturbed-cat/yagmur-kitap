// Ana sayfayı önbelleğe alır: internet yokken de uygulama açılır, Kitaplarım bölümü çalışır.
// Yalnızca sayfa açılışlarını (navigasyon) yakalar; /api istekleri ve görseller etkilenmez.
const CACHE = 'analiz-masasi-v1';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.mode !== 'navigate') return;
  e.respondWith(fetch(e.request).then(r => {
    if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
    return r;
  }).catch(() => caches.match(e.request, { ignoreSearch: true })
    .then(r => r || caches.match('./'))
    .then(r => r || Response.error())));
});
