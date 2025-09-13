const CACHE_NAME = 'canna-bomb-v1.0.0';
const STATIC_CACHE_NAME = 'canna-bomb-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'canna-bomb-dynamic-v1.0.0';

// Static assets to cache
const STATIC_ASSETS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/offline.html'
];

// API routes to cache
const API_ROUTES = [
  '/api/products',
  '/api/categories',
  '/api/auth/profile'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Failed to cache static assets', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated successfully');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle different types of requests
  if (url.pathname.startsWith('/api/')) {
    // API requests - network first, then cache
    event.respondWith(handleApiRequest(request));
  } else if (url.pathname.startsWith('/static/') || url.pathname.endsWith('.js') || url.pathname.endsWith('.css')) {
    // Static assets - cache first
    event.respondWith(handleStaticRequest(request));
  } else {
    // HTML pages - network first, then cache
    event.respondWith(handlePageRequest(request));
  }
});

// Handle API requests
async function handleApiRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Network failed for API request, trying cache');
    
    // Try cache if network fails
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response for API requests
    return new Response(
      JSON.stringify({ 
        error: 'Offline', 
        message: 'You are offline. Please check your connection.' 
      }),
      { 
        status: 503, 
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Handle static asset requests
async function handleStaticRequest(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Try network if not in cache
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Failed to fetch static asset', request.url);
    return new Response('Asset not available offline', { status: 404 });
  }
}

// Handle page requests
async function handlePageRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Network failed for page request, trying cache');
    
    // Try cache if network fails
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for HTML requests
    if (request.headers.get('accept').includes('text/html')) {
      return caches.match('/offline.html');
    }
    
    return new Response('Page not available offline', { status: 404 });
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered', event.tag);
  
  if (event.tag === 'cart-sync') {
    event.waitUntil(syncCartData());
  } else if (event.tag === 'order-sync') {
    event.waitUntil(syncOrderData());
  }
});

// Sync cart data when back online
async function syncCartData() {
  try {
    const cartData = await getCartDataFromIndexedDB();
    if (cartData && cartData.length > 0) {
      // Sync cart with server
      const response = await fetch('/api/cart/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cartData })
      });
      
      if (response.ok) {
        console.log('Service Worker: Cart synced successfully');
        // Clear local cart data
        await clearCartDataFromIndexedDB();
      }
    }
  } catch (error) {
    console.error('Service Worker: Failed to sync cart data', error);
  }
}

// Sync order data when back online
async function syncOrderData() {
  try {
    const orderData = await getOrderDataFromIndexedDB();
    if (orderData) {
      // Sync order with server
      const response = await fetch('/api/orders/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      
      if (response.ok) {
        console.log('Service Worker: Order synced successfully');
        // Clear local order data
        await clearOrderDataFromIndexedDB();
      }
    }
  } catch (error) {
    console.error('Service Worker: Failed to sync order data', error);
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  let notificationData = {
    title: 'Canna Bomb',
    body: 'New update available!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
      url: '/'
    }
  };
  
  // Parse notification data if available
  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = {
        title: data.title || 'Canna Bomb',
        body: data.body || 'New update available!',
        icon: data.icon || '/icons/icon-192x192.png',
        badge: data.badge || '/icons/badge-72x72.png',
        vibrate: data.vibrate || [100, 50, 100],
        data: {
          ...data.data,
          dateOfArrival: Date.now(),
          url: data.url || '/orders'
        },
        actions: data.actions || [
          {
            action: 'view-order',
            title: 'View Order',
            icon: '/icons/action-view.png'
          },
          {
            action: 'close',
            title: 'Close',
            icon: '/icons/action-close.png'
          }
        ]
      };
    } catch (error) {
      console.error('Service Worker: Failed to parse notification data', error);
      notificationData.body = event.data.text() || 'New update available!';
    }
  }
  
  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked', event.action);
  
  event.notification.close();
  
  const notificationData = event.notification.data || {};
  const targetUrl = notificationData.url || '/orders';
  
  if (event.action === 'view-order') {
    event.waitUntil(
      clients.openWindow(targetUrl)
    );
  } else if (event.action === 'close') {
    // Just close the notification
  } else {
    // Default action - open the orders page or specific URL
    event.waitUntil(
      clients.openWindow(targetUrl)
    );
  }
});

// Helper functions for IndexedDB operations
async function getCartDataFromIndexedDB() {
  // Implementation would depend on your IndexedDB setup
  return [];
}

async function clearCartDataFromIndexedDB() {
  // Implementation would depend on your IndexedDB setup
}

async function getOrderDataFromIndexedDB() {
  // Implementation would depend on your IndexedDB setup
  return null;
}

async function clearOrderDataFromIndexedDB() {
  // Implementation would depend on your IndexedDB setup
}



