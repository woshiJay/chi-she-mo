// Page Indexing
let currentResults = [];
let currentIndex = 0;
const itemsPerPage = 5;

// Theme toggling and like button interactions
document.addEventListener("DOMContentLoaded", async function() {
  // initializeThemeToggle();
  initializeLikeButtons();
  initializeLoadMoreButton();
  initializeBackButton();
  initializeLocationAndSearch();
});

// function initializeThemeToggle() {
//   const lightThemeButton = document.getElementById('lightTheme');
//   const darkThemeButton = document.getElementById('darkTheme');
//   const bodyElement = document.body;

//   lightThemeButton.addEventListener('click', () => bodyElement.classList.remove('dark-theme'));
//   darkThemeButton.addEventListener('click', () => bodyElement.classList.add('dark-theme'));
// }

function initializeLikeButtons() {
  const likeButtons = document.querySelectorAll(".likeButton");

  likeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const heartIcon = this.querySelector(".i-heart");
      heartIcon.classList.toggle("bi-heart");
      heartIcon.classList.toggle("bi-heart-fill");

      const isFavourite = heartIcon.classList.contains("bi-heart-fill");

      const container = button.closest('.card-body'); 
      const name = container.querySelector(".resName").textContent;
      const placeId = container.querySelector(".resLink").dataset.placeId;

      const restaurantDB = {
        name: name,
        place_id: placeId
      };

      const userResDB = {
        user_id: sessionStorage.getItem('userId'),
        restaurant_id: placeId
      };

      if (isFavourite) {
        addToFavourites(restaurantDB, userResDB);
      } else {
        removeFromFavourites(restaurantDB, userResDB);
      }

    });
  });
}

function addToFavourites(restaurantDB, userResDB) {
  // Send data to restaurant database
  fetch('http://localhost:5501/api/restaurants', {
    method: 'POST', // Specify the method
    headers: {
      'Content-Type': 'application/json', // Set the content type header for JSON
    },
    body: JSON.stringify(restaurantDB) // Convert the JavaScript object to a JSON string
  })
    .then(response => response.json()) // Parse the JSON response
    .then(data => {
      console.log('Sent to Res DB:', data);
      alert(heartIcon.classList.contains("bi-heart-fill") ? "Added to Favourites." : "Removed from Favourites.");
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('An error occurred while adding the restaurant.');
    });

  // Send data to user_restaurants database
  fetch('http://localhost:5501/api/user_restaurants', {
    method: 'POST', // Specify the method
    headers: {
      'Content-Type': 'application/json', // Set the content type header for JSON
    },
    body: JSON.stringify(userResDB) // Convert the JavaScript object to a JSON string
  })
    .then(response => response.json()) // Parse the JSON response
    .then(data => {
      console.log('Sent to userRes DB:', data);
      alert(heartIcon.classList.contains("bi-heart-fill") ? "Added to Favourites." : "Removed from Favourites.");
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('An error occurred while adding the restaurant.');
    });
}

function removeFromFavourites(restaurantDB, userResDB) {
  fetch(`http://localhost:5501/api/delete_user_restaurants?userId=${restaurantDB.user_id}&restaurantId=${restaurantDB.restaurant_id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  .then(response => response.json())
  .then(data => {
    console.log('Removed from ResDB:', data);
    alert('Removed from Favourites.');
  })
  .catch((error) => {
    console.error('Error:', error);
    alert('An error occurred while removing from favourites.');
  });
  fetch(`http://localhost:5501/api/delete_user_restaurants?userId=${userResDB.user_id}&restaurantId=${userResDB.restaurant_id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  .then(response => response.json())
  .then(data => {
    console.log('Removed from userResDB:', data);
    alert('Removed from Favourites.');
  })
  .catch((error) => {
    console.error('Error:', error);
    alert('An error occurred while removing from favourites.');
  });
}

function initializeLoadMoreButton() {
  const loadMoreButton = document.getElementById("loadMoreButton");

  loadMoreButton.addEventListener("click", () => {
    // Load more results
    updateRestaurantContainer();
  });
}

function initializeBackButton() {
  const backButton = document.getElementById("backButton");

  backButton.addEventListener("click", () => {
      currentIndex -= itemsPerPage * 2;
      updateRestaurantContainer();
  });
}

async function initializeLocationAndSearch() {
  const shuffleButton = document.querySelectorAll(".shuffleButton");
  const enterButton = document.querySelectorAll(".enterButton");
  const cravingsInput = document.getElementById("cravingsInput");

  shuffleButton.forEach((button) => {
      button.addEventListener("click", (event) => getLocation(event));
  });

  cravingsInput.addEventListener("keydown", async (event) => {
      if (event.key === "Enter") {
          event.preventDefault();
          console.log("Enter Pressed")
          const userInput = cravingsInput.value;
          await getLocation(event, userInput);
      }
  });

  enterButton.forEach((button) => {
      button.addEventListener("click", async (event) => {
          const userInput = cravingsInput.value;
          await getLocation(event, userInput);
      });
  });
}

async function getLocation(event, userInput = '') {
  if ("geolocation" in navigator) {
    try {
      const permissionStatus = await navigator.permissions.query({ name: "geolocation" });

      if (permissionStatus.state === "granted") {
          console.log("Geolocation is granted");
      } else if (permissionStatus.state === "prompt") {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
      } else if (permissionStatus.state === "denied") {
        alert("Geolocation is denied");
      }

      async function successCallback(position) {
        const { latitude, longitude } = position.coords;
        console.log("Latitude: " + latitude + ", Longitude: " + longitude);
        
        if (event.target.classList.contains("shuffleButton")) {
            await searchRestaurantByCoordinates(latitude, longitude);
        } else if (event.target.classList.contains("enterButton")) {
            await searchRestaurantByUserRequest(latitude, longitude, userInput);
        } else if (event.key === "Enter") {
            await searchRestaurantByUserRequest(latitude, longitude, userInput);
        }
      } 

      function errorCallback(error) {
        console.error("Geolocation Error: ", error);
        alert("Error Fetching Location. Please try again.");
      }

    } catch (error) {
      console.error("Error during geolocation permission check", error);
    }
  } else {
    alert("Geolocation is not supported by your browser");
  }
}

async function searchRestaurantByCoordinates(lat, lon) {
  try {
      const response = await fetch("http://localhost:5501/getRestaurants", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({ lat, lon }),
      });
      currentResults = await response.json();
      currentIndex = 0;
      console.log("Successful Request:", currentResults);
      updatePagination(currentIndex, currentResults.length, itemsPerPage); // Update pagination
      updateRestaurantContainer(); // Update restaurant container
  } catch (error) {
      console.error("Error:", error);
  }
}

async function searchRestaurantByUserRequest(lat, lon, userInput) {
  try {
      const response = await fetch("http://localhost:5501/getSearchedRestaurants", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({ lat, lon, userInput }),
      });
      currentResults = await response.json();
      currentIndex = 0;
      console.log("Successful Request:", currentResults);
      updatePagination(currentIndex, currentResults.length, itemsPerPage);
      updateRestaurantContainer();
  } catch (error) {
      console.error("Error:", error);
  }
}

function updateRestaurantContainer() {
  const restaurantNameElements = document.querySelectorAll(".resName");
  const restaurantRatingElements = document.querySelectorAll(".resRating");
  const restaurantLinks = document.querySelectorAll(".resLink");
  const backButton = document.getElementById("backButton");
  const loadMoreButton = document.getElementById("loadMoreButton");

  const showEachResults = currentResults.slice(currentIndex, currentIndex + itemsPerPage);
  showEachResults.forEach((restaurant, index) => {
      if (index < restaurantNameElements.length) {
          restaurantNameElements[index].textContent = restaurant.name;
          restaurantRatingElements[index].textContent = restaurant.rating;
          restaurantLinks[index].href = `https://www.google.com/maps/place/?q=place_id:${restaurant.place_id}`;
          restaurantLinks[index].target = "_blank";
        } else {
        // clear remaining containers if there are no more results left
          restaurantNameElements[index].textContent = "";
          restaurantRatingElements[index].textContent = "";
          restaurantLinks[index].href = "";
      }
  });

  currentIndex += itemsPerPage;

  // Hide/Show backButton based on current index
  backButton.style.display = currentIndex > itemsPerPage ? "block" : "none";

  // Hide/Show loadMoreButton based on current index
  loadMoreButton.style.display = (currentIndex < currentResults.length) ? "block" : "none";

  console.log("Container Updated");
  toggleSearchDisplay(true);
  updatePagination();
}

function updatePagination() {
  const pagination = document.querySelector(".pagination");
  const totalPages = Math.ceil(currentResults.length / itemsPerPage);

  // Clear pagination
  pagination.innerHTML = "";

  // Generate pagination
  for (let i = 1; i <= totalPages; i++) {
    const pageItem = document.createElement("li");
    pageItem.className = `page-item ${i === Math.ceil(currentIndex / itemsPerPage) ? "active" : ""}`;

    const pageLink = document.createElement("a");
    pageLink.className = "page-link";
    pageLink.href = "#";
    pageLink.textContent = i;

    // Click listener
    pageLink.addEventListener("click", (e) => {
      e.preventDefault();
      currentIndex = (i - 1) * itemsPerPage;
      console.log("Current Index: ", currentIndex);
      updateRestaurantContainer();
    });
    pageItem.appendChild(pageLink);
    pagination.appendChild(pageItem);
  }
}

function toggleSearchDisplay(forceShow = true) {
  const showSearch = document.getElementById("showSearch");
  if (forceShow) {
      showSearch.style.display = "block";
      void showSearch.offsetWidth; // Trigger reflow
      showSearch.classList.add("show");
  }
}

// TODO - Add event listeners for the following:
// 1. Like button interactions with database
// - need to check if liked restaurant is already in the database, else if matches search results, fill like button
// 2. About Page
// 3. Trial Page
