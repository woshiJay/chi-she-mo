// !IMPORTANT
// DO NOT USE APP.JS, INTEGRATING EVERYTHING INTO BUTTON.JS

const searchInput = document.getElementById("searchInput");
const enterButton = document.getElementById("enterButton");

async function init() {
    // Get user current location
    function getLocation() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function(position) {
              const latitude = position.coords.latitude;
              const longitude = position.coords.longitude;
              alert("Current user location obtained successfully.");
              console.log("Latitude: " + latitude + ", Longitude: " + longitude);
              // Search for restaurants using google api based on user location
              searchRestaurantByCoordinates(latitude,longitude);
            }, function(error) {
              switch(error.code) {
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
            });
          } else {
            alert("Geolocation is not supported by this browser.");
          }
    }


    getFoodButton.addEventListener('click', function() {
      update();
    });

    enterButton.addEventListener('click', function() {
      getLocation();
    });


    document.addEventListener('keypress', function handleKeyPress (event) {
        const action = event.key;
        console.log(action);

        if (action == "Enter") {
            update();
        }
    })

}

init();