// Page Indexing
let currentResults = [];
let currentIndex = 0;
const itemsPerPage = 5;

// Theme toggling and like button interactions
document.addEventListener("DOMContentLoaded", async function() {
  // initializeThemeToggle();
  initializeLikeButtons();
  initializeLocationAndSearch();
  initializeLoadMoreButton();
});

function initializeThemeToggle() {
  const lightThemeButton = document.getElementById('lightTheme');
  const darkThemeButton = document.getElementById('darkTheme');
  const bodyElement = document.body;

  lightThemeButton.addEventListener('click', () => bodyElement.classList.remove('dark-theme'));
  darkThemeButton.addEventListener('click', () => bodyElement.classList.add('dark-theme'));
}

function initializeLikeButtons() {
  const likeButtons = document.querySelectorAll(".likeButton");

  likeButtons.forEach((button) => {
      button.addEventListener("click", function () {
          const heartIcon = this.querySelector(".i-heart");
          heartIcon.classList.toggle("bi-heart");
          heartIcon.classList.toggle("bi-heart-fill");
          alert(heartIcon.classList.contains("bi-heart-fill") ? "Added to Favourites." : "Removed from Favourites.");
      });
  });
}

function initializeLoadMoreButton() {
  const loadMoreButton = document.getElementById("loadMoreButton");

  loadMoreButton.addEventListener("click", (event) => {
    // Load more results
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
      if (event.key === "Enter" || event.keyCode === 13) {
          event.preventDefault();
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
      navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Latitude: " + latitude + ", Longitude: " + longitude);
          if (event.target.classList.contains("shuffleButton")) {
              await searchRestaurantByCoordinates(latitude, longitude);
          } else if (event.target.classList.contains("enterButton")) {
              await searchRestaurantByUserRequest(latitude, longitude, userInput);
          }
      }, (error) => {
          console.error("Geolocation error:", error);
          alert("Error obtaining location.");
      });
  } else {
      alert("Geolocation is not supported by this browser.");
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
      updateRestaurantContainer();
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
      updateRestaurantContainer();
  } catch (error) {
      console.error("Error:", error);
  }
}

function updateRestaurantContainer() {
  const restaurantNameElements = document.querySelectorAll(".resName");
  const restaurantRatingElements = document.querySelectorAll(".resRating");

  const showEachResults = currentResults.slice(currentIndex, currentIndex + itemsPerPage);
  showEachResults.forEach((restaurant, index) => {
      if (index < restaurantNameElements.length) {
          restaurantNameElements[index].textContent = restaurant.name;
          restaurantRatingElements[index].textContent = restaurant.rating;
      }
  });

  // If there are no more results to show, hide the load more button
  if (currentIndex + itemsPerPage >= currentResults.length) {
      const loadMoreButton = document.getElementById("loadMoreButton");
      loadMoreButton.style.display = "none";
  } else {
    currentIndex += itemsPerPage;
  }

  console.log("Container Updated");
  toggleSearchDisplay(true);
}

function toggleSearchDisplay(forceShow = true) {
  const showSearch = document.getElementById("showSearch");
  if (forceShow) {
      showSearch.style.display = "block";
      void showSearch.offsetWidth; // Trigger reflow
      showSearch.classList.add("show");
  }
}
