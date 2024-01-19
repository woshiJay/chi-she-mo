// Like Button
document.addEventListener("DOMContentLoaded", function () {
  const likeButton = document.getElementById("likeButton");

  function likeTransition(button) {
    const heartIcon = button.querySelector(".i-heart");
    heartIcon.classList.toggle("bi-heart");
    heartIcon.classList.toggle("bi-heart-fill");

    // If like-state is alive/not
    if (heartIcon.classList.contains("bi-heart-fill")) {
      alert("Added to Favourites.");
    } else {
      alert("Removed from Favourites.");
    }

    // TODO move the location link/address to favourites page
  }

  // Like Button
  likeButton.addEventListener("click", function () {
    likeTransition(this);
  });
});

// Enter & Text Input
document.addEventListener("DOMContentLoaded", function () {
  const enterButton = document.getElementById("enterButton");
  const cravingsInput = document.getElementById("cravingsInput");

  function getLocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          alert("User location obtained successfully.");
          console.log("Latitude: " + latitude + ", Longitude: " + longitude);
          // Pass to backend via bottom function
          searchRestaurantByCoordinates(latitude, longitude);
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

  // via Enter Button
  enterButton.addEventListener("click", function () {
    getLocation();
  });

  // via "Enter" in textbox
  cravingsInput.addEventListener("keydown", function (event) {
    console.log(event);
    if (event.key === "Enter" || event.keyCode === 13) {
        event.preventDefault();
        getLocation();
    }
  });
});

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

let currentIndex = 0;
const resultsPerPage = 5;
let restaurants = [];

// Placing results into container
function updateUI(restaurants) {

  }

// TODO Shuffle Button
