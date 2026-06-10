const CACHE_NAME = 'cacup-v1';

// Al instalar, no cacheamos nada — siempre queremos la versión más reciente
self.addEventListener('install', e => {
  self.skipWaiting();
});

// Al activar, eliminar cachés antiguas
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: network first, fallback a caché
self.addEventListener('fetch', e => {
  // Solo interceptar peticiones al mismo origen (la app)
  if (!e.request.url.startsWith(self.location.origin)) return;
  if (e.request.method !== 'GET') return;

  e.respondWith(
    fetch(e.request)
      .then(response => {
        // Guardar copia fresca en caché
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        return response;
      })
      .catch(() => caches.match(e.request))
  );
});

// Cuando hay nueva versión, notificar a todos los clientes para que recarguen
self.addEventListener('message', e => {
  if (e.data === 'skipWaiting') self.skipWaiting();
});
