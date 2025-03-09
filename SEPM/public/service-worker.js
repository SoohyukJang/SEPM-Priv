// This is the service worker with the Cache-first network strategy.

const CACHE = "nutrigen-cache-v1";
const OFFLINE_URL = "/offline.html";
const API_CACHE_NAME = "nutrigen-api-cache";
const IMAGE_CACHE_NAME = "nutrigen-image-cache";

// Cached pages
const precacheResources = [
  "/",
  "/index.html",
  "/offline.html",
  "/static/js/main.chunk.js",
  "/static/js/0.chunk.js",
  "/static/js/bundle.js",
  "/static/css/main.chunk.css",
  "/images/Logo.png"
];

// Install event
self.addEventListener("install", (event) => {
  console.log("[ServiceWorker] Install");
  
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      console.log("[ServiceWorker] Caching all: app shell and content");
      await cache.addAll(precacheResources);
    })()
  );
  
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Active event: clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((cacheName) => {
            // Return true if you want to remove this cache
            return cacheName.startsWith('nutrigen-') && cacheName !== CACHE &&
                   cacheName !== API_CACHE_NAME && cacheName !== IMAGE_CACHE_NAME;
          })
          .map((cacheName) => {
            return caches.delete(cacheName);
          })
      );
      
      // Take control of all clients as soon as the service worker activates
      await self.clients.claim();
    })()
  );
});

// Fetch event: return cached response or fetch from network
self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin) && 
      !event.request.url.includes('spoonacular.com')) {
    return;
  }
  
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      
      // API requests handling (Spoonacular)
      if (event.request.url.includes('api.spoonacular.com')) {
        return handleApiRequest(event);
      }
      
      // Image caching for recipe images
      if (event.request.url.includes('spoonacular.com/recipeImages')) {
        return handleImageRequest(event);
      }
      
      // Try to get the response from the cache first
      const cachedResponse = await cache.match(event.request);
      
      if (cachedResponse) {
        return cachedResponse;
      }
      
      try {
        // If not in cache, try to fetch from network
        const networkResponse = await fetch(event.request);
        
        // Cache valid responses
        if (networkResponse && networkResponse.status === 200) {
          cache.put(event.request, networkResponse.clone());
        }
        
        return networkResponse;
      } catch (error) {
        // Network failure: show offline page for navigation requests
        if (event.request.mode === 'navigate') {
          const offlineResponse = await cache.match(OFFLINE_URL);
          return offlineResponse;
        }
        
        // For other requests, just fail
        return new Response('Network error happened', {
          status: 408,
          headers: { 'Content-Type': 'text/plain' },
        });
      }
    })()
  );
});

// Handle API requests with specific caching strategy
async function handleApiRequest(event) {
  const apiCache = await caches.open(API_CACHE_NAME);
  
  try {
    // Try network first for API calls
    const networkResponse = await fetch(event.request);
    
    // Clone and cache valid responses
    if (networkResponse && networkResponse.status === 200) {
      apiCache.put(event.request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // If network fails, try the cache
    const cachedResponse = await apiCache.match(event.request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If nothing in cache, return a JSON error response
    return new Response(JSON.stringify({ 
      error: 'You are offline. Please connect to the internet.',
      offlineMode: true 
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle image requests with specific caching strategy
async function handleImageRequest(event) {
  const imageCache = await caches.open(IMAGE_CACHE_NAME);
  const cachedResponse = await imageCache.match(event.request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    // Fetch from network and cache
    const networkResponse = await fetch(event.request);
    
    if (networkResponse && networkResponse.status === 200) {
      imageCache.put(event.request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // If image fetch fails, return a placeholder
    return fetch('/images/placeholder-recipe.jpg');
  }
}
