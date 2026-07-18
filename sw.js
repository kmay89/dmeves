/* The Classroom — service worker.
   Job: keep home-screen installs FRESH (network-first for pages, so every
   launch shows the latest room when online) while making the whole site
   work offline from cache. It never touches localStorage — the door-code
   unlock, intro state, and seating charts are untouched by updates.
   Bump VERSION to retire old caches on the next visit. */
const VERSION = "classroom-v1";

const CORE = [
  "/",
  "/seating/",
  "/spiral/",
  "/fonts/fredoka.woff2",
  "/fonts/nunito.woff2",
  "/fonts/caveat.woff2",
  "/fonts/space-grotesk.woff2",
  "/fonts/plex-mono-400.woff2",
  "/fonts/plex-mono-500.woff2",
  "/fonts/plex-mono-600.woff2"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(VERSION)
      .then((cache) => cache.addAll(CORE))
      .catch(() => {}) // partial precache is fine; fetch handler fills gaps
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

async function networkFirst(request) {
  const cache = await caches.open(VERSION);
  try {
    const fresh = await fetch(request);
    if (fresh && fresh.ok) cache.put(request, fresh.clone());
    return fresh;
  } catch (err) {
    const hit = await cache.match(request, { ignoreSearch: true });
    if (hit) return hit;
    // last resort for an unknown page while offline: the classroom itself
    const home = await cache.match("/");
    if (home) return home;
    throw err;
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(VERSION);
  const hit = await cache.match(request);
  const refresh = fetch(request)
    .then((fresh) => {
      if (fresh && fresh.ok) cache.put(request, fresh.clone());
      return fresh;
    })
    .catch(() => undefined);
  return hit || refresh.then((fresh) => {
    if (fresh) return fresh;
    throw new Error("offline and uncached: " + request.url);
  });
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // CDN libs etc: browser handles
  if (request.mode === "navigate" || request.destination === "document") {
    event.respondWith(networkFirst(request));
  } else {
    event.respondWith(staleWhileRevalidate(request));
  }
});
