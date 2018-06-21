/*jshint esversion: 6 */

// Declare variable and id elements (restructored)
let restaurants;
let neighborhoods;
let cuisines;
let map;
let markers = [];
const endpointRestaurants = `http://localhost:1337/restaurants`;

const elementGoogleMap = document.getElementById('map');
const elementNeighborhoodsSelect = document.getElementById('neighborhoods-select');
const elementCuisinesSelect = document.getElementById('cuisines-select');
const elementRestaurantsList = document.getElementById('restaurants-list');


/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', (event) => {
  loadMainNetworkFirst();
});

/**
 * Fetch all neighborhoods and UPDDATE their HTML.
 * Error handling will be don in DBHelper.fetchNeighborhoods
 */
const loadMainNetworkFirst = () => {
  DBHelper.getServerData(endpointRestaurants)
  .then(dataFromNetwork => {
    updateNeighborhoodsUI(dataFromNetwork);
    updateCuisinesUI(dataFromNetwork);
    saveRestaurantsDataLocally(dataFromNetwork)
    .then(() => {
      DBHelper.setLastUpdated(new Date());
    }).catch(err => {
      console.warn(err);
    });
  }).catch(err => {
    console.log('[DEBUG] Network requests have failed, this is expected if offline');
    getLocalRestaurantsData()
    .then(offlineData => {
      if(!offlineData.length) {

      } else {
        updateNeighborhoodsUI(offlineData);
        updateCuisinesUI(offlineData);
      }
    });
  });
};

/**
 * Update neighborhood select
 */
const updateNeighborhoodsUI = (result) => {
  // Get neighborhoods from restaurants
  let allNeighborhoods = result.map((v, i) => result[i].neighborhood);
  // remove duplicates
  self.neighborhoods = allNeighborhoods.filter((v, i) => allNeighborhoods.indexOf(v) == i);
  // update neighborhoods in selection
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    // select.append(option);
    elementNeighborhoodsSelect.appendChild(option);
  });
};

// Fetch and update all cuisines
// Error handling in DBHelper.fetchNeighborhoods

const updateCuisinesUI = (result) => {
  // Get cuisines from restaurants
  let allCuisines = result.map((v, i) => result[i].cuisine_type);
  // remove dubplicates
  self.cuisines = allCuisines.filter((v, i) => allCuisines.indexOf(v) == i);
  // update selected cuisines
  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    elementCuisinesSelect.appendChild(option);
  });
};

/*
* Fetch restaurants from network and push to idb
*/

const refreshRestaurantsNetworkFirst = () => {
  DBHelper.getServerData(endpointRestaurants)
  .then(dataFromNetwork => {
    refreshRestaurantsUI(dataFromNetwork);
    saveRestaurantsDataLocally(dataFromNetwork)
    .then(() => {
      DBHelper.setLastUpdated(new Date());
      // DBHelper.messageDataSaved();
    }).catch(err => {
      // DBHelper.messageSaveError();
      console.warn(err);
    });
  }).catch(err => {
    console.log('[DEBUG] Network requests have failed, this is expected if offline');
    getLocalRestaurantsData()
    .then(offlineData => {
      if (!offlineData.length) {
        // DBHelper.messageNoData();
      } else {
        // DBHelper.messageOffline();
        refreshRestaurantsUI(offlineData);
      }
    });
  });
};

// Update ul restaurants-list and markers on map for current restaurants.
const refreshRestaurants = () => {
  const neighborhoodIndex = elementNeighborhoodsSelect.selectedIndex;
  const cuisineIndex = elementCuisinesSelect.selectedIndex;
  const neighborhood = elementNeighborhoodsSelect[neighborhoodIndex].value;
  const cuisine = elementCuisinesSelect[cuisineIndex].value;

  DBHelper.fetchRestaurantByCuisineAndNeighborhood(neighborhood, cuisine)
  .then(restaurants => {
    resetRestaurantsUI(restaurants);
    updateRestaurantsUI();
  });
};

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
const resetRestaurantsUI = (restaurants) => {
  // Remove all restaurants
  self.restaurants = [];
  // Set inner html
  elementRestaurantsList.innerHTML = '';
  // const ul = document.getElementById('restaurants-list');
  // ul.innerHTML = '';

  // Remove all map markers
  markers.forEach(m => m.setMap(null));
  markers = [];
  self.restaurants = restaurants;
};


 // Create all restaurants HTML and add them to the webpage.

const updateRestaurantsUI = (restaurants = self.restaurants) => {
  // const ul = document.getElementById('restaurants-list');
  restaurants.forEach(restaurant => {
    elementRestaurantsList.append(createRestaurantContainerUI(restaurant));
  });
  addMarkersToMap();
};


 // Create restaurant container in the li element

const createRestaurantContainerUI = (restaurant) => {
  // console.log("hit")
  const li = document.createElement('li');
  li.className = 'restaurant-container';

  li.appendChild(createResponsivePicture(restaurant));




 // ---------------------- Look at make image clickable Later -----------------




  // Create image
  // Make image clickable for easier user experience
  // const href = document.createElement('a')
  // href.href = DBHelper.urlForRestaurant(restaurant)
  // const image = document.createElement('img');
  // image.className = 'restaurant-img';
  // image.src = DBHelper.imageUrlForRestaurant(restaurant);
  //
  // // set alternative text here for better scalability
  // image.setAttribute('alt', restaurant.alt_text);
  // href.appendChild(image);
  // li.appendChild(href);
  // // console.log(href)

  // ------------------------------- End href image --------------------------





  // Create divs for easier restaurant info styling

  // Div for primary content to include the following -
  // name (title), neighborhood (subtitle)
  const containerPrimary = document.createElement('div');
  containerPrimary.className = 'container-primary';

  //Create name (title) for primary information
  //change to h2 for better accessibility
  const name = document.createElement('h2');
  name.className = 'container-primary-title';
  name.innerHTML = restaurant.name;
  containerPrimary.appendChild(name);

  // Create neighborhood for primary information
  // use h3 for subtitle and beter accessibility
  const neighborhood = document.createElement('h3');
  neighborhood.className = 'cotainer-primary-subtitle';
  neighborhood.innerHTML = restaurant.neighborhood;
  containerPrimary.appendChild(neighborhood);
  li.appendChild(containerPrimary);

  // Create div for secondary content to include address
  const containerSecondary = document.createElement('div');
  containerSecondary.className = 'container-secondary';
  // There is an address element to use instead of p
  const address = document.createElement('address');
  // use content in class name so the css can be used
  // for secondary content in review containers
  address.className = 'container-secondary-content';
  address.innerHTML = restaurant.address;
  containerSecondary.appendChild(address);
  li.appendChild(containerSecondary);

  //Create div for actions for so user can click a link
  //for more details
  const containerActions = document.createElement('div');
  containerActions.className = 'container-button';
  const more = document.createElement('a');
  more.className = 'container-button-link';
  more.innerHTML = 'View Details';
  more.href = DBHelper.getRestaurantURL(restaurant);
  containerActions.appendChild(more);
  li.appendChild(containerActions);

  return li;
};

// Begin Responsive Images
const createResponsivePicture = (restaurant) => {
  const picture = document.createElement('picture');
  const sizes = '(min-width: 80rem) 22.5vw, (min-width: 60rem) 30vw, (min-width: 37.5rem) 45vw, 100vw';

  const srcsetWebP = `${DBHelper.getImageUrlForRestaurant(restaurant, 'webp', 300)} 300w,
                      ${DBHelper.getImageUrlForRestaurant(restaurant, 'webp', 433)} 433w,
                      ${DBHelper.getImageUrlForRestaurant(restaurant, 'webp', 552)} 552w,
                      ${DBHelper.getImageUrlForRestaurant(restaurant, 'webp', 653)} 653w,
                      ${DBHelper.getImageUrlForRestaurant(restaurant, 'webp', 752)} 752w,
                      ${DBHelper.getImageUrlForRestaurant(restaurant, 'webp', 800)} 800w`;

  const srcsetJPEG = `${DBHelper.getImageUrlForRestaurant(restaurant, 'webp', 300)} 300w,
                      ${DBHelper.getImageUrlForRestaurant(restaurant, 'webp', 433)} 433w,
                      ${DBHelper.getImageUrlForRestaurant(restaurant, 'webp', 552)} 552w,
                      ${DBHelper.getImageUrlForRestaurant(restaurant, 'webp', 653)} 653w,
                      ${DBHelper.getImageUrlForRestaurant(restaurant, 'webp', 752)} 752w,
                      ${DBHelper.getImageUrlForRestaurant(restaurant, 'webp', 800)} 800w`;

  const sourceWebP = document.createElement('source');
  sourceWebP.srcset = srcsetWebP;
  sourceWebP.sizes = sizes;
  sourceDefault.sizes = sizes;
  sourceDefault.type = 'image/jpeg';
  picture.appendChild(sourceDefault);

  const defaultImg = document.createElement('img');
  const imageSrc = DBHelper.getImageUrlForRestaurant(restaurant, 'jpeg', 800);
  defaultImg.src = imageSrc;

  let altText = DBHelper.getAlternativeText(restaurant.id);
  if(!altText) {
    altText = `Restaurant ${restaurant.name}`;
  }
  defaultImg.alt = altText;
  picture.appendChild(defaultImg);

  return picture;
};


// Initialize Google Maps, called from HTML
// https://developers.google.com/maps/documentation/javascript/tutorial

windo.initMap = () => {
  let loc = {lat: 40.722216, lng: -73.987501};

  self.map = new google.maps.Map(googleMap, {
    center: loc,
    zoom: 12
  });

  let setTitle = () => {
    const iFrameGoogleMaps = document.querySelector('#map iframe');
    iFrameGoogleMaps.setAttribute('title', 'Google Maps overview of popular restaurants in New York.');
  }
  self.map.addListener('tilesloaded', setTitle);
  // Refresh restaurants
  refreshRestaurants();
}

/**
 * Add markers for current restaurants to the map.
 */
addMarkersToMapUI = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
    google.maps.event.addListener(marker, 'click', () => {
      window.location.href = marker.url
    });
    markers.push(marker);
  });
}
