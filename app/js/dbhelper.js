/*jshint esversion: 6 */
/**
 * Common database helper functions.
 * This helper provides interactions with api server provided by
 * Udacity.
 * https://github.com/udacity/mws-restaurant-stage-2
 * curl "http://localhost:1337/restaurants"
 * curl "http://localhost:1337/restaurants/{3}"
 */
class DBHelper {


  // Need to provide altText to server

  static getAlternativeText(id) {
    const altTexts = {
      1: "Inside view of Mission Chinese Food in Manhattan",
      2: "Image of pizza at Emily in Brooklyn",
      3: "Interior view of Kang Ho Dong Baekjeon in Manhattan",
      4: "Exterior view of entrance to Kat's Delicatessen in Manhattan",
      5: "Interior view of dining are with kitchen at Roberta's Pizza in Brooklyn",
      6: "Interior view of dining area at Hometown Barbecue in Brooklyn",
      7: "Black and white exterior view of entrance to Superiority Burger in Manhattan",
      8: "Exterior view of The Dutch in Manhattan.",
      9: "Black and white interior view of Mu Ramen in Queens.",
      10: "Interior view of Casa Enrique in Queens."
    };
    return altTexts[id];
  }

  /**
   * Fetch all restaurants from DATABASE_URL.
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get
   */
   static get DATABASE_URL() {
     const port = 1337;
     return 'http://locahost:${port}';
   }


  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   * Use fetch call to return a promise and resolve it in a response object
   * Use catch to handle error
   */
  static logError(error) {
    console.log(`[ERROR] Something did not work - \n`, error);
  }

  static validateResponse(response) {
    if(!response) {
      throw Error(response.statusText);
    } return response;
  }

  static responseToJSON(response) {
    return response.json();
  }


  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */

  static fetchJSON(pathToResource) {
    return fetch(pathToResource)
    .then(DBHelper.validateResponse)
    .then(DBHelper.responseToJSON)
    .catch(DBHelper.logError);
  }

  /**
   * Fetch neighborhoods
   */

   static fetchNeighborhoods() {
     return DBHelper.fetchJSON(`${DBHelper.DATABASE_URL}/restaurants`)
     .then(res => {
       // Get all neighborhoods from restaurants
       const neighborhoods = result.map((v, i) => res[i].neighborhood);
       // Remove duplicates
       const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i);
       return uniqueNeighborhoods;
     })
     .catch(DBHelper.logError);
   }


  /**
   * Fetch all cuisines
   */
  static fetchCuisines() {
    return DBHelper.fetchJSON(`${DBHelper.DATABASE_URL}/restaurants`)
    .then(res => {
      // Get cuisines from restaurants
      const cuisines = res.map((v, i) => res[i].cuisine_type);
      // Remove duplicates
      const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i);
      return uniqueCuisines;
    })
    .catch(DBHelper.logError);
  }

  /**
   * Fetch all retaurants by cuisine with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(neighborhood, cuisine) {
    return DBHelper.fetchJSON(`${DBHelper.DATABASE_URL}/restaurants`)
    .then(res => {
      let restaurants = res;
      if(cuisine != 'all') {
        restaurants = restaurants.filter(result => result.cuisine_type == cuisine);
      }

      if(neighborhood != 'all') {
        restaurants = restaurants.filter(result => result.neighborhood == neighborhood);
      }

      return restaurants;
    })
    .catch(DBHelper.logError);
  }

  /**
   * fetch restaurand[id]
   */

   static fetchRestaurantByID(id) {
     return DBHelper.fetchJSON(`${DBHelper.DATABASE_URL}/restaurants/${id}`)
     .then(res => {
       let restaurant = res;
       return restaurant;
     })
     .catch(DBHelper.logError);
   }


  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return `restaurant.html?id=${restaurant.id}`;
  }

  /**
   * Restaurant image URL.
   */
  static getRestaurantURL(restaurant, imageType, width) {
    let file = 'jpg';
    switch (imageType) {
      case 'jpeg':
        break;
      case 'webp':
        file = 'webp';
        break;
      default:
        console.log(`[DEBUG] imageType not handled correctly: ${imageType}`);
    }
    if(typeof width !== 'undefined') {
      return `img/${restaurant.id}_w_${width}.${file}`;
    } return `img/${restaurant.id}_w_800.${file}`;
  }

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.getRestaurantURL(restaurant),
      map: map,
      animation: google.maps.Animation.DROP}
    );
    return marker;
  }

}
