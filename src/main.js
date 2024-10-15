// original code of main.js
// base URL
// const baseURL = window.location.origin;
const baseURL = "http://localhost:5501";
console.log("baseURL", baseURL);

// Page Indexing
let currentResults = [];
let currentIndex = 0;
const itemsPerPage = 5;

function initializeLikeButtons() {
  const likeButtons = document.querySelectorAll(".likeButton");

  likeButtons.forEach((button) => {
    button.addEventListener("click", async function () {
      const heartIcon = this.querySelector(".i-heart");
      const container = button.closest('.card-body'); 
      const name = container.querySelector(".resName").textContent;
      const placeID = container.querySelector(".resLink").href.split("place_id:")[1];

      const userResDB = {
        userID: sessionStorage.getItem("userId"),
        resName: name,
        placeID: placeID
      };

      const isFavourite = heartIcon.classList.contains("bi-heart-fill");

      try {
        if (!isFavourite) {
          await addToFavourites(userResDB, heartIcon);
        } else {
          await removeFromFavourites(userResDB, heartIcon);
        }

        // Update the currentResults array
        const restaurantIndex = currentResults.findIndex(restaurant => restaurant.place_id === placeID);
        if (restaurantIndex !== -1) {
          currentResults[restaurantIndex].isLiked = !isFavourite;
        }
      } catch (error) {
        console.error("Error updating like status:", error);
      }
    });
  });
}

// async function addToFavourites(userResDB, heartIcon) {
//   try {
//     const response = await fetch('http://localhost:5501/api/user_restaurants', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(userResDB)
//     });
//     const data = await response.json();
//     console.log('Sent to userRes DB:', data);
//     heartIcon.classList.add("bi-heart-fill");
//     heartIcon.classList.remove("bi-heart");
//     alert('Restaurant added to favourites');
//   } catch (error) {
//     console.error('Error:', error);
//     alert('An error occurred while adding the restaurant.');
//   }
// }

// async function removeFromFavourites(userResDB, heartIcon) {
//   try {
//     const response = await fetch(`http://localhost:5501/api/delete_user_restaurants?userID=${userResDB.userID}&placeID=${userResDB.placeID}`, {
//       method: 'DELETE',
//       headers: {
//         'Content-Type': 'application/json',
//       }
//     });
//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     } 
//     const data = await response.json();
//     console.log('Deleted from userRes DB:', data);
//     heartIcon.classList.remove("bi-heart-fill");
//     heartIcon.classList.add("bi-heart");
//     alert('Restaurant removed from favourites');
//   } catch (error) {
//     console.error('Error:', error);
//     alert('An error occurred while removing the restaurant.');
//   }
// }

function initializeLoadMoreButton() {
  const loadMoreButton = document.getElementById("loadMoreButton");
  loadMoreButton.addEventListener("click", async () => {
    await updateRestaurantContainer();
  });
}

function initializeBackButton() {
  const backButton = document.getElementById("backButton");
  backButton.addEventListener("click", async () => {
    currentIndex -= itemsPerPage * 2;
    if (currentIndex < 0) currentIndex = 0;
    await updateRestaurantContainer();
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
      await checkLikedRestaurants(currentResults); // check in DB whether user has liked any of the restaurants
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
      await checkLikedRestaurants(currentResults); // check in DB whether user has liked any of the restaurants
      currentIndex = 0;
      console.log("Successful Request:", currentResults);
      updatePagination(currentIndex, currentResults.length, itemsPerPage);
      updateRestaurantContainer();
  } catch (error) {
      console.error("Error:", error);
  }
}

async function checkLikedRestaurants(restaurants) {
  const userId = sessionStorage.getItem('userId');
  const userLikedRestaurants = await fetchUserLikedRestaurant(userId); // pass to fetching
  restaurants.forEach(restaurant => {
    // restaurant.isLiked = userLikedRestaurants.some(likedRestaurant => likedRestaurant.place_id === restaurant.place_id);
    restaurant.isLiked = userLikedRestaurants.includes(restaurant.place_id);
  });
}

async function fetchUserLikedRestaurant(userId) {
  try {
    const response = await fetch(`http://localhost:5501/api/user_restaurants?userID=${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Fetched liked restaurants:', data);
    return data.map(restaurant => restaurant.placeID);
  } catch (error) {
    console.error("Error fetching liked restaurants:", error);
    return [];
  }
}

async function updateRestaurantContainer() {
  try {
    const userId = sessionStorage.getItem('userId');
    const userLikedRestaurants = await fetchUserLikedRestaurant(userId);

    const restaurantElements = document.querySelectorAll(".card");
    const showEachResults = currentResults.slice(currentIndex, currentIndex + itemsPerPage);

    showEachResults.forEach((restaurant, index) => {
      if (index < restaurantElements.length) {
        const element = restaurantElements[index];
        const nameElement = element.querySelector(".resName");
        const ratingElement = element.querySelector(".resRating");
        const linkElement = element.querySelector(".resLink");
        const likeButton = element.querySelector(".likeButton");
        const heartIcon = likeButton.querySelector(".i-heart");

        nameElement.textContent = restaurant.name;
        ratingElement.textContent = restaurant.rating;
        linkElement.href = `https://www.google.com/maps/place/?q=place_id:${restaurant.place_id}`;
        linkElement.target = "_blank";

        const isLiked = userLikedRestaurants.includes(restaurant.place_id);
        heartIcon.classList.toggle("bi-heart-fill", isLiked);
        heartIcon.classList.toggle("bi-heart", !isLiked);

        // Update the like button event listener
        likeButton.onclick = async function() {
          await toggleLike(restaurant, heartIcon);
        };
      }
    });

    // Update pagination and buttons
    currentIndex += itemsPerPage;
    const backButton = document.getElementById("backButton");
    const loadMoreButton = document.getElementById("loadMoreButton");
    backButton.style.display = currentIndex > itemsPerPage ? "block" : "none";
    loadMoreButton.style.display = currentIndex < currentResults.length ? "block" : "none";

    console.log("Container Updated");
    toggleSearchDisplay(true);
    updatePagination();
  } catch (error) {
    console.error("Error updating restaurant container:", error);
  }
}

async function toggleLike(restaurant, heartIcon) {
  const userId = sessionStorage.getItem('userId');
  const isCurrentlyLiked = heartIcon.classList.contains("bi-heart-fill");

  try {
    if (isCurrentlyLiked) {
      await removeFromFavourites(userId, restaurant.place_id);
    } else {
      await addToFavourites(userId, restaurant.name, restaurant.place_id);
    }

    heartIcon.classList.toggle("bi-heart-fill");
    heartIcon.classList.toggle("bi-heart");

    // Update the restaurant's liked status in currentResults
    const index = currentResults.findIndex(r => r.place_id === restaurant.place_id);
    if (index !== -1) {
      currentResults[index].isLiked = !isCurrentlyLiked;
    }
  } catch (error) {
    console.error("Error toggling like status:", error);
    alert("Failed to update like status. Please try again.");
  }
}

async function addToFavourites(userId, resName, placeID) {
  const response = await fetch('http://localhost:5501/api/user_restaurants', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userID: userId, resName, placeID })
  });

  if (!response.ok) {
    throw new Error('Failed to add to favorites');
  }

  console.log('Added to favorites:', await response.json());
}

async function removeFromFavourites(userId, placeID) {
  const response = await fetch(`http://localhost:5501/api/delete_user_restaurants?userID=${userId}&placeID=${placeID}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    throw new Error('Failed to remove from favorites');
  }

  console.log('Removed from favorites:', await response.json());
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
      // console.log("Current Index: ", currentIndex);
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

document.addEventListener("DOMContentLoaded", async function() {
  initializeLikeButtons();
  initializeLoadMoreButton();
  initializeBackButton();
  initializeLocationAndSearch();
});


