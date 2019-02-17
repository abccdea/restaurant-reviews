let restaurants,
  neighborhoods,
  cuisines;
var map;
var markers = [];



window.addEventListener('offline', (event) => {
  window.siiimpleToast.alert('No Internet Connection!');
});

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  initMap(); // added 
  fetchNeighborhoods();
  fetchCuisines();
});

/**
 * Fetch all neighborhoods and set their HTML.
 */
let fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods((error, neighborhoods) => {
    if (error) { // Got an error
      console.error(error);
    } else {
      self.neighborhoods = neighborhoods;
      fillNeighborhoodsHTML();
    }
  });
};

/**
 * Set neighborhoods HTML.
 */
let fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
  const select = document.getElementById('neighborhoods-select');
  select.innerHTML = '';
  const option = document.createElement('option');
  option.innerHTML = 'All Neighborhoods';
  option.value = 'all';
  select.append(option);
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });

};

/**
 * Fetch all cuisines and set their HTML.
 */
let fetchCuisines = () => {
  DBHelper.fetchCuisines((error, cuisines) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.cuisines = cuisines;
      fillCuisinesHTML();
    }
  });
};

/**
 * Set cuisines HTML.
 */
let fillCuisinesHTML = (cuisines = self.cuisines) => {
  const select = document.getElementById('cuisines-select');
  select.innerHTML = '';
  const option = document.createElement('option');
  option.innerHTML = 'All Cuisines';
  option.value = 'all';
  select.append(option);
  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
};

/**
 * Initialize leaflet map, called from HTML.
 */
let initMap = () => {
  let loc = {
    lat: 40.722216,
    lng: -73.987501
  };
  self.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: loc,
    scrollwheel: false
  });
  updateRestaurants();
};

/**
 * Update page and map for current restaurants.
 */
let updateRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;

  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      resetRestaurants(restaurants);
      fillRestaurantsHTML();
    }
  })
};

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
const resetRestaurants = (restaurants) => {
  // Remove all restaurants
  self.restaurants = [];
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  // Remove all map markers
  if (self.markers) {
    self.markers.forEach(m => m.setMap(null));
  }
  self.markers = [];
  self.restaurants = restaurants;
}


/**
 * Create all restaurants HTML and add them to the webpage.
 */
let fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const ul = document.getElementById('restaurants-list');
  const comment = document.createComment("");
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
    ul.append(comment);
  });
  addMarkersToMap();
};

/**
 * Create restaurant HTML.
 */
let createRestaurantHTML = (restaurant) => {
  const li = document.createElement('li');

  const favButton = document.createElement('button');
  favButton.innerHTML = '❤';
  favButton.classList.add('favButton');
  changeFavStatus(favButton, restaurant.is_favorite);
  favButton.onclick = function () {
    if (restaurant.is_favorite === 'true') {
      restaurant.is_favorite = 'false';
    }
    else if (restaurant.is_favorite === 'false') {
      restaurant.is_favorite = 'true';
    }
    DBHelper.changeFavoriteStateForRestaurant(restaurant.id, restaurant.is_favorite, (error, success) => {
      if (error) {
        console.log(error);
      }
      else {
        console.log(success);
        changeFavStatus(favButton, restaurant.is_favorite);
      }
    })
  };
  li.append(favButton);

  const image = document.createElement('img');
  image.className = 'restaurant-img';
  const imageUrl = DBHelper.imageUrlForRestaurant(restaurant);
  const imageUrlName = imageUrl;
  const imageType = 'webp';
  image.src = `${imageUrlName}-800_2x.${imageType}`;
  image.setAttribute('srcset', `${imageUrlName}-800_2x.${imageType} 800w, ${imageUrlName}-400_1x.${imageType} 400w`);
  image.setAttribute('sizes', '(max-width: 500px) 90vw, (max-width: 880px) 80vw, (max-width: 1205px) 40vw, (min-width: 1206px) 30vw');
  image.setAttribute('alt', `${restaurant.name} Restaurant`);
  li.append(image);

  const div = document.createElement('div');
  div.className = 'restaurant-text-area';
  li.append(div);

  const name = document.createElement('h1');
  name.innerHTML = restaurant.name;
  div.append(name);

  const neighborhood = document.createElement('p');
  neighborhood.innerHTML = restaurant.neighborhood;
  div.append(neighborhood);

  const address = document.createElement('p');
  address.innerHTML = restaurant.address;
  div.append(address);

  const more = document.createElement('a');
  more.innerHTML = 'View Details';
  more.href = DBHelper.urlForRestaurant(restaurant);
  more.setAttribute('role', 'button');
  more.setAttribute('aria-label', 'View Restaurant Details');
  div.append(more);

  return li
};

/**
 * Add markers for current restaurants to the map.
 */
const addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
    google.maps.event.addListener(marker, 'click', () => {
      window.location.href = marker.url
    });
    self.markers.push(marker);
  });
}


let changeFavStatus = (favBtn, isFav) => {
  if (isFav === 'true') {
    favBtn.classList.remove('notFav');
    favBtn.classList.add('fav');
    favBtn.setAttribute('aria-label', 'mark as favorite');
  }
  else if (isFav === 'false') {
    favBtn.classList.remove('fav');
    favBtn.classList.add('notFav');
    favBtn.setAttribute('aria-label', 'remove as favorite');
  }
};