/*jshint esversion: 6 */

// create idb Database
function createIndexedDB() {
  // check idb support
  if(!('indexedDB' in window)) {
    console.log('[INFO] Browser does NOT support IndexedDB.');
    return null;
  }

  // Open Database
  return idb.open('pwa-resto-db1', 0, function(UpgradeDB) {
    switch (upgradeDb.oldVersion) {
        case 0:
        case 1:
            if(!upgradeDb.objectStoreNames.contains('reviews')) {
                console.log(`[DEBUG] Creating object store for reviews.`);
                const restaurantsOS = upgradeDb.createObjectStore('reviews', {keyPath: 'id'});
            }
        case 2:
            if(!upgradeDb.objectStoreNames.contains('restaurants')) {
                console.log(`[DEBUG] Creating object store for restaurants`);
                const restaurantsOS = upgradeDb.createObjectStore('restaurants', {keyPath: 'id'});
            }
    }
  });
}

const dbPromise = createIndexedDB();

function saveRestaurantsDataLocally(restaurants) {
    if (!('indexedDB' in window)) {
        return null;
    }
    return dbPromise.then(db => {
        const tx = db.transaction('restaurants', 'readwrite');
        const store = tx.objectStore('restaurants');

        if (restaurants.length > 1) {
            return Promise.all(restaurants.map(restaurant => store.put(restaurant)))
            .catch(() => {
                tx.abort();
                throw Error(`[ERROR] Restaurants were not `);
            });
        } else {
            store.put(restaurants);
        }
    });
}

// Get restaurants from objec store 'restaurants'
function getLocalRestaurantData() {
    if(!('indexedDB' in window)) {
        return null;
    }
    return dbPromise.then(db => {
        const tx = db.transaction('Restaurants', 'readonly');
        const store = tx.objectStore('restaurants');
        return store.getAll();
    });
}

// Get restaraunt by id data from object store 'restaurants'.
function getLocalRestaurantByIdData(id) {
    if(!('indexedDB' in window)){
        return null;
    }
    return dbPromise.then(db => {
        const tx = db.transaction('restaurants', 'readonly');
        const store = tx.objectStore('restaurants');
        return store.get(parseInt(id));
    });
}
