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
    "revision": "344408da8bdb7cc78af4063e117406fc"
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
    "url": "img/icon/icon_med.png",
    "revision": "ecda527981651dff7ff5d465fbd19068"
  },
  {
    "url": "img/icon/icon_small.png",
    "revision": "07b3c9a670802b1edd4fe92ee419b087"
  },
  {
    "url": "index.html",
    "revision": "f94b5f4dc697bf07f1000d59969cd2fd"
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
    "url": "manifest.json",
    "revision": "e47f96341d4da2546903c6603032e6d9"
  },
  {
    "url": "package-lock.json",
    "revision": "eade550747b8205eaaa42fef4e105e54"
  },
  {
    "url": "package.json",
    "revision": "c4c337ad4a2d30002ce9c986f505ca00"
  },
  {
    "url": "restaurant.html",
    "revision": "234d3cad66b996d0de9e5091974830ce"
  },
  {
    "url": "sw-src.js",
    "revision": "4e82b32c6fa10df2528e960e48dd757d"
  },
  {
    "url": "workbox-config.js",
    "revision": "67bdd4bf61a4959c5ae90551564c11fd"
  }
]);

  // https://developers.google.com/web/tools/workbox/modules/workbox-strategies#stale-while-revalidate
  // Google
  workbox.routing.registerRoute(
    new RegExp('https://maps.(?:googleapis|gstatic).com/(.*)'),
    workbox.strategies.staleWhileRevalidate({
      cacheName: 'maps-cache',
      cacheableResponse: {
        statuses: [0, 200]
      },
      cacheExpiration: {
        maxEntries: 30
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
