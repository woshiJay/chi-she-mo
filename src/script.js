// Ensure that the content is not displayed initially
let isContentDisplayed = false;

// Theme 
document.addEventListener("DOMContentLoaded", function() {
  const lightThemeButton = document.getElementById('lightTheme');
  const darkThemeButton = document.getElementById('darkTheme');
  const bodyElement = document.body;

  lightThemeButton.addEventListener('click', function() {
    bodyElement.classList.remove('dark-theme');
  });

  darkThemeButton.addEventListener('click', function() {
    bodyElement.classList.add('dark-theme');
  });
});

// Like Button
document.addEventListener("DOMContentLoaded", function () {
  const likeButton = document.querySelectorAll(".likeButton");

    likeButton.forEach((button) => {
      button.addEventListener("click", function () {
        const heartIcon = this.querySelector(".i-heart");
        heartIcon.classList.toggle("bi-heart");
        heartIcon.classList.toggle("bi-heart-fill");

    // If like-state is alive/not
    if (heartIcon.classList.contains("bi-heart-fill")) {
      alert("Added to Favourites.");
      // TODO Proceed to add to database
    } else {
      alert("Removed from Favourites.");
      // TODO Proceed to remove from database
    }
    });
  });
});

function getLocation(event, userInput) {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        alert("User location obtained successfully.");
        console.log("Latitude: " + latitude + ", Longitude: " + longitude);
        console.log(event, "+", userInput);
        // Pass to backend via bottom function
        // If "shuffleButton" is clicked, then "searchRestaurantByCoordinates", else "searchRestaurantByUserRequest"
        if (event.target.classList.contains("shuffleButton")) {
          searchRestaurantByCoordinates(latitude, longitude);
        } else if (event.target.classList.contains("enterButton")){
          searchRestaurantByUserRequest(latitude, longitude, userInput);
        }
      },
      function (error) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
          case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
          case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
        }
      }
    );
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

// Random Search for nearby restaurants
function searchRestaurantByCoordinates(lat, lon) {
  fetch("http://localhost:5501/getRestaurants", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ lat, lon }),
  })
    .then((resp) => resp.json())
    .then((restaurants) => {
      console.log("Sucessful Request: ", restaurants);
      // Update for every restaurant container
        updateRestaurantContainer(restaurants);
    })
    .catch((error) => {
      console.error("Error: ", error);
    });
}

// Based on Search Request for nearby restaurants
function searchRestaurantByUserRequest(lat, lon, userInput) {
  fetch("http://localhost:5501/getSearchedRestaurants", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ lat, lon, userInput }),
  })
    .then((resp) => resp.json())
    .then((restaurants) => {
      console.log("Sucessful Request: ", restaurants);
      // Update for every restaurant container
        updateRestaurantContainer(restaurants);
    })
    .catch((error) => {
      console.error("Error: ", error);
    });
}

// Update Container
function updateRestaurantContainer(restaurants) {
  const restaurantName = document.querySelectorAll(".resName");
  const restaurantRating = document.querySelectorAll(".resRating");

  // Update for every restaurant container
  restaurants.forEach((restaurant, index) => {
    if (index < restaurantName.length && index < restaurantRating.length) {
      restaurantName[index].textContent = restaurant.name;
      restaurantRating[index].textContent = restaurant.rating;
    }
  });
  console.log("Container Updated");
  
  // // Display container once results are obtained
  toggleSearchDisplay(true);

};

function toggleSearchDisplay(forceShow = false) {
  const showSearch = document.getElementById("showSearch");

  // Check if we are forcing the display (e.g., new content loaded)
  // Or toggle based on current state if not forcing
  if (forceShow || !isContentVisible) {
    showSearch.style.display = "block";
    // Force a reflow
    void showSearch.offsetWidth;
    showSearch.classList.add("show");
    isContentVisible = true; // Update state to visible
  } else if (isContentVisible && !forceShow) {
    showSearch.classList.remove("show");
    showSearch.addEventListener("transitionend", function handler() {
      showSearch.style.display = "none";
      showSearch.removeEventListener("transitionend", handler);
    });
    isContentVisible = false; // Update state to not visible
  }
}

// Randomize Results
document.addEventListener("DOMContentLoaded", function () {
  const shuffleButton = document.querySelectorAll(".shuffleButton");

  // via Shuffle Button
  shuffleButton.forEach((button) => {
    button.addEventListener("click", function (event) {
      getLocation(event);
    });
  });
});

// Based on User Search Request
document.addEventListener("DOMContentLoaded", function () { 
  const cravingsInput = document.getElementById("cravingsInput");
  const enterButton = document.querySelectorAll(".enterButton");

  cravingsInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.keyCode === 13) {
      event.preventDefault();
      const userInput = cravingsInput.value;
      getLocation(event, userInput);
    }
  });

  enterButton.forEach((button) => {
    button.addEventListener("click", function (event) {
      const userInput = cravingsInput.value;
      getLocation(event, userInput);
    });
  });
});
