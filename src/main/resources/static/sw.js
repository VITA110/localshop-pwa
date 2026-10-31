const CACHE_NAME = "localshop-v1";
const APP_SHELL = [
    "/",
    "/manifest.json",
    "/css/styles.css",
    "/js/app.js",
    "/images/icon-192.png",
    "/images/icon-512.png",
    "/images/cafe.jpg",
    "/images/miel.jpg",
    "/images/pan.jpg",
    "/images/mermelada.jpg"
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
                    .filter((cacheName) => cacheName.startsWith("localshop-") && cacheName !== CACHE_NAME)
                    .map((cacheName) => caches.delete(cacheName))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", (event) => {
    const requestUrl = new URL(event.request.url);
    if (event.request.method !== "GET" || !["http:", "https:"].includes(requestUrl.protocol)) return;
    if (requestUrl.origin !== self.location.origin) return;

    if (event.request.mode === "navigate") {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    if (response.ok) {
                        return caches.open(CACHE_NAME)
                            .then((cache) => cache.put("/", response.clone()))
                            .then(() => response);
                    }
                    return response;
                })
                .catch(async () => (await caches.match("/")) || Response.error())
        );
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            return fetch(event.request).then((response) => {
                if (!response.ok) return response;
                return caches.open(CACHE_NAME)
                    .then((cache) => cache.put(event.request, response.clone()))
                    .then(() => response);
            });
        })
    );
});
