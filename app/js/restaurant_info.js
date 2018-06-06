let restaurant;
var map;

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false
      });
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);

      // set frames to have a filled title attribute
      // https://developers.google.com/maps/documentation/javascript/events
      let fillTitle = () => {
        const iFrameGoogleMaps = document.querySelector('#map iframe');
        iFrameGoogleMaps.setAttribute('title', 'Google Maps view of restaurants in New York City');
      }
      self.map.addListener('tilesloaded', fillTitle);
    }
  });
}

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant)
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL'
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      fillRestaurantHTML();
      callback(null, restaurant)
    });
  }
}

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;
  // insert tabIndex for a11y
  name.tabIndex = '0';

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;

  const image = document.getElementById('restaurant-img');
  image.className = 'restaurant-img'
  image.src = DBHelper.imageUrlForRestaurant(restaurant);

  // Alternative text for scalability
  image.alt = restaurant.alt_text;
  image.tabIndex = '0';

  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
  fillReviewsHTML();
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
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

    hours.appendChild(row);
  }
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (reviews = self.restaurant.reviews) => {
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h2');
  title.className = 'review-title';
  title.innerHTML = 'Reviews';
  container.appendChild(title);

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById('reviews-list');
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
}

/**
 * Create review HTML and add it to the webpage.
 */

 // Use createReviewHTML to create classes so review card has margin
 // name-space, date-space, rating-space, content-space that can be
 // edited with css.
createReviewHTML = (review) => {
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
  rating.className = 'review-rating'
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
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant=self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.className = 'breadcrumb';
  li.innerHTML = restaurant.name;
  // insert 'current page' for a11y
  // www.w3.org/TR/wai-aria-practices/examples/breadcrumb/index.html
  li.setAttribute('aria-current', 'page');
  breadcrumb.appendChild(li);
}

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
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
}
