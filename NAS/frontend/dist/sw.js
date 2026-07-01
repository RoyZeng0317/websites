// Vaultix NAS service worker — enables PWA install + offline app shell.
// Only the same-origin (Firebase-hosted) app shell is cached; the cross-origin
// Tailscale backend API is passed straight through (never cached).
const CACHE = 'vaultix-v2'

self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url)
  // Passthrough: non-GET, or anything not on our own origin (e.g. the NAS backend).
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) return

  event.respondWith(
    fetch(event.request)
      .then(res => {
        const copy = res.clone()
        caches.open(CACHE).then(c => c.put(event.request, copy)).catch(() => {})
        return res
      })
      .catch(() => caches.match(event.request).then(r => r || caches.match('/index.html'))),
  )
})
