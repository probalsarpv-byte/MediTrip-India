const CACHE = 'meditrip-v1.0.0';
const ASSETS = [
  './','./index.html','./manifest.json',
  './css/base.css','./css/components.css','./css/mobile.css','./css/animations.css',
  './js/app.js','./js/router.js','./js/data.js','./js/storage.js','./js/search.js','./js/recommender.js','./js/ui.js','./js/three-scene.js',
  './data/hospitals.json','./data/doctors.json','./data/treatments.json','./data/cities.json','./data/phrases.json','./data/visa.json'
];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
    const clone = res.clone(); caches.open(CACHE).then(c=>c.put(e.request, clone)); return res;
  }).catch(()=>caches.match('./index.html'))));
});
