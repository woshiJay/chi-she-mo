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

function getLocation(event) {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        alert("User location obtained successfully.");
        console.log("Latitude: " + latitude + ", Longitude: " + longitude);
        console.log(event);
        // Pass to backend via bottom function
        // If "shuffleButton" is clicked, then "searchRestaurantByCoordinates", else "searchRestaurantByUserRequest"
        if (event.target.classList.contains("shuffleButton")) {
          searchRestaurantByCoordinates(latitude, longitude);
        } else {
          searchRestaurantByUserRequest(latitude, longitude);
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
    .then((resp) => resp.text())
    .then((restaurants) => {
      console.log("Sucessful Request: ", restaurants);
      // Update for every restaurant container
      restaurants.forEach((restaurant) => {
        updateRestaurantContainer(restaurant);
      });
    })
    .catch((error) => {
      console.error("Error: ", error);
    });
}

// Specific Search for nearby restaurants
function searchRestaurantByUserRequest(lat, lon) {
  fetch("http://localhost:5501/getSearchedRestaurants", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ lat, lon }),
  })
    .then((resp) => resp.text())
    .then((data) => {
      console.log("Sucessful Request: ", data);
      updateUI(data); // update data to client side
    })
    .catch((error) => {
      console.error("Error: ", error);
    });
}

// Update Container
function updateRestaurantContainer(restaurant) {
  const restaurantNames = document.querySelectorAll('.resName');
  const restaurantRatings = document.querySelectorAll('.resRating');

  restaurantNames.forEach(() => {
    restaurantNames.innerHTML = restaurant.name;
  });

  restaurantRatings.forEach(() => {
    restaurantRatings.innerHTML = restaurant.rating;
  });
};

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

// Choose to display container result based on "shuffle" or "enter" button
document.addEventListener("DOMContentLoaded", function () {
  const enterButton = document.querySelectorAll(".enterButton");
  const shuffleButton = document.querySelectorAll(".shuffleButton");
  const cravingsInput = document.getElementById("cravingsInput");
  const showSearch = document.getElementById("showSearch");

  function toggleSearchDisplay() {
    if (showSearch.classList.contains("show")) {
      showSearch.classList.remove("show");
      showSearch.addEventListener("transitionend", function handler() {
        showSearch.style.display = "none";
        showSearch.removeEventListener("transitionend", handler);
      });
    } else {
      showSearch.style.display = "block";
      void showSearch.offsetWidth;
      showSearch.classList.add("show");
      }
  }

  cravingsInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.keyCode === 13) {
      event.preventDefault();
      // here needs to check whether the results are obtained from server yet or not
      toggleSearchDisplay();
    }
  });
  shuffleButton
    .forEach((button) => {
      button.addEventListener("click", function () {
      // here needs to check whether the results are obtained from server yet or not
      toggleSearchDisplay();
      });
    });
  enterButton.forEach((button) => {
    button.addEventListener("click", function () {
    // here needs to check whether the results are obtained from server yet or not
    toggleSearchDisplay();    
    });
  });
});


// TODO Shuffle Button
