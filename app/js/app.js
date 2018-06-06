/*jshint esversion: 6 */

// Declare variable and id elements (restructored)
let restaurants,
    neighborhoods,
    cuisines,
    map;
let markers = [];

const googleMap = document.getElementById('map');
const neighborhoodsSelect = document.getElementById('neighborhoods-select');
const cuisinesSelect = document.getElementById('cuisines-select');
const restaurantsList = document.getElementById('restaurants-list');


/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', (event) => {
  fetchNeighborhoods();
  fetchCuisines();
});

/**
 * Fetch all neighborhoods and UPDDATE their HTML.
 */
fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods((error, neighborhoods) => {
    if (error) { // Got an error
      console.error(error);
    } else {
      self.neighborhoods = neighborhoods;
      updateNeighborhoodsUI();
    }
  });
}

/**
 * Update and Set neighborhoods HTML.
 */
updateNeighborhoodsUI = (neighborhoods = self.neighborhoods) => {
  // const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    // select.append(option);
    neighborhoodsSelect.appendChild(option);
  });
}

/**
 * Fetch all cuisines and UPDATE their HTML.
 */
fetchCuisines = () => {
  DBHelper.fetchCuisines((error, cuisines) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.cuisines = cuisines;
      // fillCuisinesHTML();
      updateCuisinesUI();
    }
  });
}

/**
 * Update cuisines HTML.
 */
updateCuisinesUI = (cuisines = self.cuisines) => {
  // const select = document.getElementById('cuisines-select');

  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    // select.append(option);
    cuisinesSelect.appendChild(option);
  });
}

// Update ul restaurants-list and markers on map for current restaurants.
refreshRestaurants = () => {
  const neighborhoodIndex = neighborhoodsSelect.selectedIndex;
  const cuisineIndex = cuisinesSelect.selectedIndex;
  const neighborhood = neighborhoodsSelect[neighborhoodIndex].value;
  const cuisine = cuisinesSelect[cuisineIndex].value;

  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      resetRestaurantsUI(restaurants);
      // console.log("Reached1")
      updateRestaurantsUI();
    }
  });
}

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
resetRestaurantsUI = (restaurants) => {
  // Remove all restaurants
  self.restaurants = [];
  // const ul = document.getElementById('restaurants-list');
  // ul.innerHTML = '';

  // Remove all map markers
  markers.forEach(m => m.setMap(null));
  markers = [];
  self.restaurants = restaurants;
}

/**
 * Create all restaurants HTML and add them to the webpage.
 */
updateRestaurantsUI = (restaurants = self.restaurants) => {
  // const ul = document.getElementById('restaurants-list');
  restaurants.forEach(restaurant => {
    restaurantsList.append(createRestaurantContainerUI(restaurant));
  });
  addMarkersToMap();
}

/**
 * Create restaurant container in the li element
 */
addRestaurantContainerUI = (restaurant) => {
  // console.log("hit")
  const li = document.createElement('li');
  li.className = 'restaurant-container';

  // Create image
  // Make image clickable for easier user experience
  const href = document.createElement('a')
  href.href = DBHelper.urlForRestaurant(restaurant)
  const image = document.createElement('img');
  image.className = 'restaurant-img';
  image.src = DBHelper.imageUrlForRestaurant(restaurant);

  // set alternative text here for better scalability
  image.setAttribute('alt', restaurant.alt_text);
  href.appendChild(image);
  li.appendChild(href);
  // console.log(href)

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
}

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
