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

  workbox.precaching.precacheAndRoute([
  {
    "url": "css/styles.css",
    "revision": "4ab7d3fcbed5c39b0e4931424199dc66"
  },
  {
    "url": "data/restaurants.json",
    "revision": "e96745e0b56104d5ce2bf199eb8314ea"
  },
  {
    "url": "index.html",
    "revision": "7d235c7a9a8f6b6c965efca13484d2b0"
  },
  {
    "url": "js/dbhelper.js",
    "revision": "ca48fa13aec0385a574812b7aa617fcc"
  },
  {
    "url": "js/main.js",
    "revision": "a5def8257c8ea2214125d763f98d49eb"
  },
  {
    "url": "js/restaurant_info.js",
    "revision": "c62f764b26e9806bbe28ee7a7458d754"
  },
  {
    "url": "package-lock.json",
    "revision": "15fe397d8ac2caa73520496321bc7f06"
  },
  {
    "url": "package.json",
    "revision": "ebc5de01937633502a3097993062ee9b"
  },
  {
    "url": "restaurant.html",
    "revision": "544614ea31001f69b50a4285cb87d61b"
  },
  {
    "url": "sw-src.js",
    "revision": "d6763415714f2c317beb52d4af9181f4"
  },
  {
    "url": "workbox-config.js",
    "revision": "fa311cee6ab005274fb4f86c70db9630"
  }
]);

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