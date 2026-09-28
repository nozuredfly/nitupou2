// 作業日報 Service Worker：電波がなくてもアプリを開けるようにする
const CACHE = 'nippo-trainee-v2.2.0';
const CORE = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './config.json'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).catch(() => {})); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request; const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;       // GAS送信には触らない
  // 画面と設定：まずネット、だめならキャッシュ（更新がすぐ届く）
  e.respondWith(fetch(req).then(res => { if (res.ok) { const cp = res.clone(); caches.open(CACHE).then(c => c.put(req.url.split('?')[0], cp)); } return res; })
    .catch(() => caches.match(req.url.split('?')[0]).then(r => r || caches.match('./index.html'))));
});
