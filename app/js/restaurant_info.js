/*jshint esversion: 6 */

let restaurant;
var map;

// Element Id's

const elementBreadcrumb = document.getElementById('breadcrumb');
const elementContainerPrimary = document.getElementById('containerPrimary');
const elementRestaurantName = document.getElementById('restaurant-name');
const elementRestaurantCuisine = document.getElementById('restaurant-cuisine');
const elementRestaurantHours = document.getElementById('restaurant-hours');
const elementRestaurantAddress = document.getElementById('restaurant-address');
const elementGoogleMap = document.getElementById('map');
const elementReviewsContainer = document.getElementById('reveiws-container');
const elementReviewsList = document.getElementById('reviews-list');

/**
 * Initialize Google map, called from HTML.
 * https://developers.google.com/maps/documentation/javascript/tutorial
 */
window.initMap = () => {
  const id = getParameterByName('id');
  DBHelper.fetchRestaurantByID('id')
  .then(restaurant => {
    self.restaurant = restaurant;
    updateRestaurantUI();
    createBreadcrumb();
    return restaurant;
  })
  .then(restaurant => {
    createGoogleMaps();
  })
  .catch(DBHelper.logError);
};

/**
 * Create Google Maps
 */

const createGoogleMaps = () => {
  let loc = {lat: 40.722216, lng: -73.987501};
  map = new google.maps.Map(elementGoogleMap, {
    center: loc,
    zoom: 12
  });
  DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
  let setTitle = () => {
    // https://developers.google.com/maps/documentation/javascript/events
    const iFrameGoogleMaps = document.querySelector('#map iframe');
    iFrameGoogleMaps.setAttribute('title', 'Map over of restaurants in New York City');
  };
  map.addListener('tilesloaded', setTitle);
};

/**
 * Create restaurant HTML and add it to the webpage
 */
const updateRestaurantUI = (restaurant = self.restaurant) => {
  const picture = createResponsivePicture(restaurant);
  const parentElement = elementContainerPrimary.parentNode;
  parentElement.insertBefore(picture, elementContainerPrimary);

  // Restaurant name innerHTML and tabIndex
  elementRestaurantName.innerHTML = restaurant.name;
  elementRestaurantName.tabIndex = '0';

  // Restaurant address inter html
  elementRestaurantAddress.innerHTML = restaurant.address;

  // Restaurant cuisine inner html
  elementRestaurantCuisine.innerHTML = restaurant.cuisine_type;

  if(restaurant.operating_hours) {
    updateRestaurantHoursUI();
  }
  updateReviewsUI();
};


/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
const updateRestaurantHoursUI = (operatingHours = self.restaurant.operating_hours) => {
  for (let key in operatingHours) {
    const row = document.createElement('tr');
    // give row className for quicker styling
    // insert tabIndex
    row.className = 'restaurant-info-hours-content';
    row.tabIndex = '0';

    const day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    elementRestaurantHours.appendChild(row);
  }
};

/**
 * Create all reviews HTML and add them to the webpage.
 */
const updateReviewsUI = (reviews = self.restaurant.reviews) => {
  // const container = document.getElementById('reviews-container');
  const title = document.createElement('h3');
  title.className = 'review-title';
  title.innerHTML = 'Reviews';
  elementReviewsContainer.appendChild(title);

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    elementReviewsContainer.appendChild(noReviews);
    return;
  }
  // const ul = document.getElementById('reviews-list');
  reviews.forEach(review => {
    elementReviewsList.appendChild(createReviewHTML(review));
  });
  elementReviewsContainercontainer.appendChild(elementReviewsList);
};

/**
 * Create review HTML and add it to the webpage.
 */

 // Use createReviewHTML to create classes so review card has margin
 // name-space, date-space, rating-space, content-space that can be
 // edited with css.
const createReviewHTML = (review) => {
  const li = document.createElement('li');
  li.className = 'review-container';

  // Create div with primary information to contain the following -
  // restaurant name (title), date (subtitle).
  // title and subtitle will contain constistent styling with restaurantHTML
  const containerPrimary = document.createElement('div');
  containerPrimary.className = 'container-primary';

  // Create Restaurant Name info.
  // Use h2 for easier accessibility
  const name = document.createElement('h2');
  name.className = 'container-primary-title';
  name.innerHTML = review.name;
  containerPrimary.appendChild(name);

  // Create Review Date
  // Use h3 for better accessibility
  const date = document.createElement('h3');
  date.className = 'container-primary-subtitle';
  date.innerHTML = review.date;
  containerPrimary.appendChild(date);
  li.appendChild(containerPrimary);

  // Create review rating with a div to also contain
  // the review text from the user
  const containerActions = document.createElement('div');
  containerActions.className = 'review-container-rating';
  const rating = document.createElement('p');
  rating.className = 'review-rating';
  rating.innerHTML = `Rating: ${review.rating}`;
  containerActions.append(rating);
  li.appendChild(containerActions);

  // Create review comments
  const containerSecondary = document.createElement('div');
  containerSecondary.className = 'container-secondary';
  const comments = document.createElement('p');
  comments.className = 'container-secondary-content';
  comments.innerHTML = review.comments;
  containerSecondary.appendChild(comments);
  li.appendChild(containerSecondary);

  return li;
};

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
const createBreadcrumb = (restaurant=self.restaurant) => {
  // const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.className = 'breadcrumb';
  li.innerHTML = restaurant.name;
  // insert 'current page' for a11y
  // www.w3.org/TR/wai-aria-practices/examples/breadcrumb/index.html
  li.setAttribute('aria-current', 'page');
  elementBreadcrumb.appendChild(li);
};

/**
 * Get a parameter by name from page URL.
 */
const getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

/**
* Responsive Imagaes
**/

const createResponsivePicture = restaurant => {
  const picture = document.createElement('picture');
  const sizes = '(max-width: 37.44rem) 100vw, (min-width: 37.5rem) 50vw, 100vw';
  const srcsetWebP = `
    ${DBHelper.getImageUrlForRestaurant(restaurant, 'jpeg', 300)} 300w,
    ${DBHelper.getImageUrlForRestaurant(restaurant, 'jpeg', 433)} 433w,
    ${DBHelper.getImageUrlForRestaurant(restaurant, 'jpeg', 552)} 552w,
    ${DBHelper.getImageUrlForRestaurant(restaurant, 'jpeg', 653)} 653w,
    ${DBHelper.getImageUrlForRestaurant(restaurant, 'jpeg', 752)} 752w,
    ${DBHelper.getImageUrlForRestaurant(restaurant, 'jpeg', 800)} 800w
  `;

  const srcsetJPEG = `
    ${DBHelper.getImageUrlForRestaurant(restaurant, 'jpeg', 300)} 300w,
    ${DBHelper.getImageUrlForRestaurant(restaurant, 'jpeg', 433)} 433w,
    ${DBHelper.getImageUrlForRestaurant(restaurant, 'jpeg', 552)} 552w,
    ${DBHelper.getImageUrlForRestaurant(restaurant, 'jpeg', 653)} 653w,
    ${DBHelper.getImageUrlForRestaurant(restaurant, 'jpeg', 752)} 752w,
    ${DBHelper.getImageUrlForRestaurant(restaurant, 'jpeg', 800)} 800w
  `;

  const sourceWebP = document.createElement('source');
  sourceWebP.srcset = srcsetWebP;
  sourceWebP.sizes = sizes;
  sourceWebP.type = 'image/webp';
  picture.appendChild(sourceWebP);

  const sourceDefault = document.createElement('source');
  sourceDefault.srcset = srcsetJPEG;
  sourceDefault.size = sizes;
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
  defaultImg.tabIndex = '0';
  picture.appendChild(defaultImg);

  return picture;
};
