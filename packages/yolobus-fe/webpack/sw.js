importScripts('https://ssl.widgets.webengage.com/js/service-worker.js');

workbox.skipWaiting();
workbox.clientsClaim();
workbox.core.setCacheNameDetails({
  prefix: 'yolobus',
  suffix: 'msiv1'
});

workbox.precaching.precacheAndRoute(self.__precacheManifest);

workbox.routing.registerRoute(/.*\/browsing\/v1\/(?!user\/status).*/, workbox.strategies.staleWhileRevalidate({
  cacheName: 'apis-cache',
  plugins: [
    new workbox.expiration.Plugin({
      maxAgeSeconds: 1 * 24 * 60 * 60 // 1 Days
    })
  ]
}));

workbox.routing.registerRoute(/.*woff/, workbox.strategies.cacheFirst({
  cacheName: 'fonts-cache',
  plugins: [
    new workbox.expiration.Plugin({
      maxAgeSeconds: 1 * 24 * 60 * 60 // 1 Days
    })
  ]
}));

workbox.routing.registerRoute(/(\/$|\/\?.*$)/, workbox.strategies.networkFirst({
  cacheName: 'pages-cache',
  plugins: [
    new workbox.expiration.Plugin({
      maxAgeSeconds: 1 * 24 * 60 * 60 // 1 Days
    })
  ]
}));
