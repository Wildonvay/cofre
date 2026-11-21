// COFRE: guarda os arquivos do app para abrir sem internet. Os dados do usuário não passam por aqui.
const VERSAO = 'cofre-v1-2';
const ARQUIVOS = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "icon-maskable-512.png", "fundos/01_aco_minimalista.webp", "fundos/02_arsenal_discreto.webp", "fundos/03_cofre_industrial.webp", "fundos/04_metal_escuro.webp", "fundos/05_porta_cofre_bronze.webp", "fundos/06_cofre_militar_armas.webp"];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(VERSAO).then((c) => c.addAll(ARQUIVOS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSAO).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
// Rede primeiro, para receber atualizações; sem rede, usa a cópia guardada.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then((r) => { const copia = r.clone(); caches.open(VERSAO).then((c) => c.put(e.request, copia)); return r; }).catch(() => caches.match(e.request).then((r) => r || caches.match('index.html'))));
});
