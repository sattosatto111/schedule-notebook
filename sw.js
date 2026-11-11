// ???뚯씪???곗뿉 ??ν빐 ?먭퀬, ?명꽣?룹씠 ?놁뼱???대━寃???二쇰뒗 肄붾뱶.
// ?깆쓣 怨좎튌 ?뚮쭏???꾨옒 踰꾩쟾 ?レ옄瑜??щ젮 二쇱꽭??
const CACHE = 'schedule-v3';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];
const CDN = ['https://www.gstatic.com/firebasejs/', 'https://fonts.googleapis.com/', 'https://fonts.gstatic.com/'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// ??ν빐 ??嫄?癒쇱? 蹂댁뿬二쇨퀬, ?ㅼ뿉????踰꾩쟾??諛쏆븘 ?ъ슂 (?ㅼ쓬??????諛섏쁺).
// Firebase 濡쒓렇?맞룸뜲?댄꽣 ?듭떊? 嫄대뱶由ъ? ?딆븘??
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = req.url;
  const sameOrigin = url.startsWith(self.location.origin);
  if (!sameOrigin && !CDN.some(p => url.startsWith(p))) return;

  e.respondWith(caches.open(CACHE).then(async cache => {
    const key = req.mode === 'navigate' ? './index.html' : req;
    const cached = await cache.match(key);
    const fresh = fetch(req).then(res => {
      if (res.ok) cache.put(key, res.clone());
      return res;
    }).catch(() => cached);
    return cached || fresh;
  }));
});
