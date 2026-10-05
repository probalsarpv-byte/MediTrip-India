const C='meditrip-production-v1.2-20261005';
const CORE=[
  './','./index.html','./manifest.json',
  './css/design-system.css','./css/app.css',
  './js/app.js','./js/router.js','./js/storage.js',
  './assets/logo.svg','./assets/hero-medical.svg','./assets/hospital-cover.svg',
  './assets/images/icon-192.svg','./assets/images/icon-512.svg','./assets/images/icon-maskable.svg',
  './data/hospitals.production.json','./data/doctors.production.json',
  './data/treatments.production.json','./data/cities.production.json',
  './data/hostels.production.json','./data/sources.json',
  './data/verification-log.json','./data/phrases.json','./data/offline-db.json'
];
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  if(u.pathname.includes('/data/')){
    e.respondWith(fetch(e.request).then(r=>{const x=r.clone();caches.open(C).then(c=>c.put(e.request,x));return r}).catch(()=>caches.match(e.request)));
    return;
  }
  e.respondWith(caches.match(e.request).then(h=>h||fetch(e.request).then(r=>{const x=r.clone();caches.open(C).then(c=>c.put(e.request,x));return r}).catch(()=>caches.match('./index.html'))));
});
