importScripts('workbox-sw.prod.v2.0.0.js');

// Create Workbox service worker instance
const workboxSW = new self.WorkboxSW({ clientsClaim: true });

// Placeholder array which is populated automatically by workboxBuild.injectManifest()
workboxSW.precache([]);

workboxSW.router.registerRoute('https://frontend.ttdev.in/browsing/v1/*',
  workboxSW.strategies.staleWhileRevalidate({
    cacheName: 'cache-with-expiration',
    cacheExpiration: {
      maxEntries: 20,
      maxAgeSeconds: 120
    }
  })
);
