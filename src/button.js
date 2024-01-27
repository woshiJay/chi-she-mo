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
    .then((data) => {
      console.log("Sucessful Request: ", data);
      updateUI(data); // update data to client side
    })
    .catch((error) => {
      console.error("Error: ", error);
    });
}

// ----------------------------------------------------------------------

let allRestaurants = []; // This will store all fetched restaurants
let currentIndex = 0; // This will keep track of the current index
const resultsPerPage = 5; // Number of results per page

// Function to update the UI with restaurant data
function displayRestaurants() {
  const container = document.getElementById('restaurantContainer'); // Assuming you have a container for the restaurants
  container.innerHTML = ''; // Clear current restaurants

  // Get the subset of restaurants to display
  const restaurantsToDisplay = allRestaurants.slice(currentIndex, currentIndex + resultsPerPage);

  // Create HTML for each restaurant and append to the container
  restaurantsToDisplay.forEach((restaurant) => {
    const restaurantElement = document.createElement('div');
    restaurantElement.innerHTML = `
      <div>${restaurant.name}</div>
      <div>Ratings: ${restaurant.rating}</div>
    `;
    container.appendChild(restaurantElement);
  });
}

// Function to load more restaurants
function loadMoreRestaurants() {
  currentIndex += resultsPerPage;
  displayRestaurants();
  // Show previous button if currentIndex is greater than 0
  document.getElementById('prevButton').style.display = currentIndex > 0 ? 'block' : 'none';
  // Show next button if there are more restaurants to display
  document.getElementById('nextButton').style.display = (currentIndex + resultsPerPage) < allRestaurants.length ? 'block' : 'none';
}

// Function to go back to previous restaurants
function previousRestaurants() {
  currentIndex -= resultsPerPage;
  if (currentIndex < 0) currentIndex = 0;
  displayRestaurants();
  // Show or hide buttons accordingly
  document.getElementById('prevButton').style.display = currentIndex > 0 ? 'block' : 'none';
  document.getElementById('nextButton').style.display = 'block';
}

// Initial function to fetch restaurants
function fetchRestaurants() {
  // Your fetch code here
  // After fetching, set allRestaurants and call displayRestaurants
}

// Call fetchRestaurants initially to load the first set of restaurants
fetchRestaurants();

// Add event listeners to your next and previous buttons
document.getElementById('nextButton').addEventListener('click', loadMoreRestaurants);
document.getElementById('prevButton').addEventListener('click', previousRestaurants);

// ----------------------------------------------------------------------

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

// Show search container when "enter" is pressed
document.addEventListener("DOMContentLoaded", function () {
  const enterButton = document.querySelectorAll(".enterButton");
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
  enterButton.forEach((button) => {
    button.addEventListener("click", function () {
    // here needs to check whether the results are obtained from server yet or not
    toggleSearchDisplay();    
    });
  });
});


let currentIndex = 0;
const resultsPerPage = 5;
let restaurants = [];

// Placing results into container
function updateUI(restaurants) {

  }

// TODO Shuffle Button
