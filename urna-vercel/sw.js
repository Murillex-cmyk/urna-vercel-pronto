// Cache para funcionar offline. Ao mudar arquivos, aumente o número da versão (v3 -> v4).
const C = "urna-v3";
const ARQUIVOS = [
  "./", "./index.html", "./manifest.webmanifest",
  "./css/style.css", "./js/config.js", "./js/app.js",
  "./assets/fotos/lula.jpg", "./assets/fotos/flavio.jpg", "./assets/fotos/leo.jpg",
  "./assets/sons/click.mp3", "./assets/sons/confirma.mp3",
  "./icons/icon-180.png", "./icons/icon-192.png", "./icons/icon-512.png"
];
self.addEventListener("install", e => { e.waitUntil(caches.open(C).then(c => c.addAll(ARQUIVOS))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x)))));
  self.clients.claim();
});
self.addEventListener("fetch", e => { e.respondWith(caches.match(e.request).then(r => r || fetch(e.request))); });
