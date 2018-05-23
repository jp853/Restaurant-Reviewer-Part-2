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
    "revision": "30e3403e2060d54c5e8131efadadcc3c"
  },
  {
    "url": "data/restaurants.json",
    "revision": "e96745e0b56104d5ce2bf199eb8314ea"
  },
  {
    "url": "img/1.jpg",
    "revision": "cc074688becddd2725114187fba9471c"
  },
  {
    "url": "img/10.jpg",
    "revision": "2bd68efbe70c926de6609946e359faa2"
  },
  {
    "url": "img/2.jpg",
    "revision": "759b34e9a95647fbea0933207f8fc401"
  },
  {
    "url": "img/3.jpg",
    "revision": "81ee36a32bcfeea00db09f9e08d56cd8"
  },
  {
    "url": "img/4.jpg",
    "revision": "23f21d5c53cbd8b0fb2a37af79d0d37f"
  },
  {
    "url": "img/5.jpg",
    "revision": "0a166f0f4e10c36882f97327b3835aec"
  },
  {
    "url": "img/6.jpg",
    "revision": "eaf1fec4ee66e121cadc608435fec72f"
  },
  {
    "url": "img/7.jpg",
    "revision": "bd0ac197c58cf9853dc49b6d1d7581cd"
  },
  {
    "url": "img/8.jpg",
    "revision": "6e0e6fb335ba49a4a732591f79000bb4"
  },
  {
    "url": "img/9.jpg",
    "revision": "ba4260dee2806745957f4ac41a20fa72"
  },
  {
    "url": "index.html",
    "revision": "c7bf009bb054deab5c16b4f23c7448b4"
  },
  {
    "url": "js/dbhelper.js",
    "revision": "ca48fa13aec0385a574812b7aa617fcc"
  },
  {
    "url": "js/main.js",
    "revision": "3d5b7d50970eea8fa57abc1e7e3846e5"
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
    "revision": "5912c7a33833667abc84fd2d93d4e4ea"
  },
  {
    "url": "workbox-config.js",
    "revision": "1ddec2bf6a156f1ada3aef846d9842b2"
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