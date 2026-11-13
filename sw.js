const CACHE = "nisc-2026-v1";
const FILES = ["./", "index.html", "styles.css", "app.js", "data.js", "manifest.webmanifest",
  "assets/logo-shield.jpg", "assets/logo-nisc.jpg", "assets/logo-gartner.jpg", "assets/icon-192.png", "assets/icon-512.png"];
self.addEventListener("install", (e) => e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES))));
self.addEventListener("activate", (e) => e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))));
// Network first so edits to data.js show up; fall back to cache offline.
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(fetch(e.request).then((r) => { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request)));
});
