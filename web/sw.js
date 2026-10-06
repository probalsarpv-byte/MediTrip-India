const CACHE = 'meditrip-offline-v2.1.0';
const ASSETS = ['./assets/fonts/NotoSansBengali-Regular.ttf','./assets/fonts/NotoSansBengali-Bold.ttf','./assets/fonts/NotoSansDevanagari-Regular.ttf','./assets/fonts/NotoSansDevanagari-Bold.ttf','./','./index.html','./styles.css','./config.js','./i18n.js','./data.js','./content.js','./core.js','./app.js','./manifest.webmanifest','./assets/icon.svg','./assets/icon-192.png','./assets/icon-512.png','./assets/icon-maskable.png','./assets/journey.svg','./assets/kolkata.svg','./assets/chennai.svg','./assets/bengaluru.svg','./assets/delhi.svg','./assets/india-city.svg'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('meditrip-offline-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==self.location.origin)return;
 event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));
});
