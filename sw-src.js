importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js');

if (workbox) {
  console.log(` [DEBUG] Yay! Workbox is loaded 🎉`);

  // Dev Build, set to debug to true
  //workbox.setConfig({ debug: true });

  // Prod Build, set debug to false
  workbox.setConfig({ debug: false });

  // Precache was set up with the injectManifest wizard
  // in workbox. The urls along with their hashed revisions
  // be cached upon the installation of service worker.

  workbox.precaching.precacheAndRoute([]);

  // https://developers.google.com/web/tools/workbox/modules/workbox-strategies#stale-while-revalidate
  // Google
  workbox.routing.registerRoute(
    new RegExp('(.*).(?:googleapis|gstatic).com/(.*)'),
    workbox.strategies.staleWhileRevalidate({
      cacheName: 'googleapis-cache',
      cacheableResponse: {
        statuses: [0, 200]
      }
    })
  );

  // https://developers.google.com/web/tools/workbox/modules/workbox-strategies#cache_first_cache_falling_back_to_network
  // Images
  workbox.routing.registerRoute(
      /\.(?:png|gif|jpg|jpeg|svg)$/,
      workbox.strategies.cacheFirst({
        cacheName: 'images-cache'
      })
    );

  // Restaurants
  workbox.routing.registerRoute(
      new RegExp('restaurant.html(.*)'),
      workbox.strategies.networkFirst({
        cacheName: 'restaurants-cache',
        cacheableResponse: {
          statuses: [0, 200]
        }
      })
    );


} else {
  console.log(` [DEBUG] Boo! Workbox didn't load 😬`);
}