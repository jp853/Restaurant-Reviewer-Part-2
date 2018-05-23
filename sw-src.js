// https://developers.google.com/web/tools/workbox/guides/get-started
// start by importing workbox-sw.js file into your service worker

importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js');

if (workbox) {
  console.log(` [DEBUG] Yay! Workbox is loaded 🎉`);

  workbox.setConfig({ debug: false });

  workbox.precaching.precacheAndRoute([]);

 // One of Workbox’s primary features is it’s routing and caching strategy modules. It allows you to listen for requests from your web page and determine if and how that request should be cached and responded to.

  workbox.routing.registerRoute(
    new RegExp('(.*).(?:googleapis|gstatic).com/(.*)'),
    workbox.strategies.staleWhileRevalidate({
      cacheName: 'pwa-cache-googleapis',
      cacheableResponse: {
        statuses: [0, 200]
      }
    })
  );

  // Images
  workbox.routing.registerRoute(
      /\.(?:png|gif|jpg|jpeg|svg)$/,
      workbox.strategies.cacheFirst({
        cacheName: 'pwa-cache-images'
      })
    );

  // Restaurants
  workbox.routing.registerRoute(
      new RegExp('restaurant.html(.*)'),
      workbox.strategies.networkFirst({
        cacheName: 'pwa-cache-restaurants',
        cacheableResponse: {
          statuses: [0, 200]
        }
      })
    );


} else {
  console.log(` [DEBUG] Boo! Workbox didn't load 😬`);
}