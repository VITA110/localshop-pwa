const CACHE_NAME = "localshop-v1";
const APP_SHELL = [
    "/",
    "/manifest.json",
    "/css/styles.css",
    "/js/app.js"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(APP_SHELL))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => Promise.all(
                cacheNames
                    .filter((cacheName) =>
                        cacheName.startsWith("localshop-") && cacheName !== CACHE_NAME
                    )
                    .map((cacheName) => caches.delete(cacheName))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", (event) => {
    const request = event.request;
    const requestUrl = new URL(request.url);

    if (request.method !== "GET" || requestUrl.origin !== self.location.origin) {
        return;
    }

    if (request.mode === "navigate") {
        event.respondWith(
            fetch(request)
                .then(async (response) => {
                    if (response.ok) {
                        const cache = await caches.open(CACHE_NAME);
                        await cache.put("/", response.clone());
                    }
                    return response;
                })
                .catch(async () => (await caches.match("/")) || Response.error())
        );
        return;
    }

    event.respondWith(
        caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(request).then((response) => {
                if (!response.ok) {
                    return response;
                }

                return caches.open(CACHE_NAME)
                    .then((cache) => cache.put(request, response.clone()))
                    .then(() => response);
            });
        })
    );
});