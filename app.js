const searchInput = document.getElementById("searchInput");
const imageSelect = document.querySelectorAll(".imageSelect");

async function init() {

    //update images 
    async function update() {
        const res = await fetch("https://dog.ceo/api/breeds/image/random");
        const resObj = await res.json();
        console.log(resObj);
        
        imageSelect.forEach(imageSelect => {
            imageSelect.src = resObj.message;
        });
    }

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

    // TODO Need api access
     function searchRestaurantByCoordinates(lat, lon) {
      
      fetch('http://localhost:5501/getRestaurants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({lat, lon}),
      })
      .then(resp => resp.text())
      .then(data => {
        console.log("Successfully sent the request doggy yee tao", data);
      })
      .catch((error) => {
        console.error("Error wtf yee tao:", error);
      })
      





//        let url = `http://localhost:5501/getRestaurants?lat=${lat}&lon=${lon}`;
      // // let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=3.064521607198422,101.66827045945098&radius=5000&type=restaurant&key=AIzaSyBcvo-BCmcl79jG9BnDmZYHqoFpLc2CdVc`;
      //  const resp = await nodefetch(url);
     // //  const body = await resp.json();
     //   console.log(body);
        //nodefetch(url)
        //.then((response)=> response.json())
        //.then((data)=> {
          //  console.log(data);
            // if (data.status === 'OK') {
            //     // Extract restaurant data (name and rating) from the results
            //     const restaurants = data.results.map((result) => {
            //       return {
            //         name: result.name,
            //         rating: result.rating,
            //       };
            //     });
        
            //     // Display the restaurant data
            //     console.log(restaurants);
            //   } else {
            //     console.error('Error:', data.status);
            //   }
          //  })
          //  .catch((error) => {
          //    console.error('Error:', error);
          //  });
        }

   // TODO nearbySearch from api to obtain name, ratings and distance from me
    // async function search() {
    //     const mapRes = await fetch(url);
    //     const mapResObj = await mapRes.json();
    //     console.log(mapResObj);
    // };

    getFoodButton.addEventListener('click', function() {
        update();
    });

    getLocationButton.addEventListener('click', function() {
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