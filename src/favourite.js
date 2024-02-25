export function initializeLikeButtons() {
    const likeButtons = document.querySelectorAll(".likeButton");

    likeButtons.forEach((button) => {
        button.addEventListener("click", function () {
            const heartIcon = this.querySelector(".i-heart");

            heartIcon.classList.toggle("bi-heart");
            heartIcon.classList.toggle("bi-heart-fill");

            const isFavourite = heartIcon.classList.contains("bi-heart-fill");
            const container = button.closest('.card-body');
            const name = container.querySelector(".resName").textContent;
            const placeID = container.querySelector(".resLink").href.split("place_id:")[1];

            const restaurantIndex = currentResults.findIndex(restaurant => restaurant.place_id === placeID);

            if (restaurantIndex !== -1) {
                currentResults[restaurantIndex].isLiked = !currentResults[restaurantIndex].isLiked;
                heartIcon.classList.toggle("bi-heart");
                heartIcon.classList.toggle("bi-heart-fill");
            } else {
                console.error("Restaurant not found in current results");
            }

            const userResDB = {
                userID: sessionStorage.getItem("userId"),
                resName: name,
                placeID: placeID
            };

            if (isFavourite) {
                addToFavourites(userResDB, heartIcon);
            } else {
                removeFromFavourites(userResDB, heartIcon);
            }
        });
    });
}

function addToFavourites(userResDB, heartIcon) {
    // console.log('Sent items: ', userResDB);
    // Send data to user_restaurants database
    fetch('http://localhost:5501/api/user_restaurants', {
        method: 'POST', // Specify the method
        headers: {
            'Content-Type': 'application/json', // Set the content type header for JSON
        },
        body: JSON.stringify(userResDB)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Sent to userRes DB:', data);
            heartIcon.classList.add("bi-heart-fill");
            heartIcon.classList.remove("bi-heart");
            alert('Restaurant added to favourites');
        })
        .catch((error) => {
            console.error('Error:', error);
            heartIcon.classList.remove("bi-heart-fill");
            heartIcon.classList.add("bi-heart");
            alert('An error occurred while adding the restaurant.');
        });
}

function removeFromFavourites(userResDB, heartIcon) {
    // console.log(userResDB);
    fetch(`http://localhost:5501/api/delete_user_restaurants?userID=${userResDB.userID}&placeID=${userResDB.placeID}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Deleted from userRes DB:', data);
            heartIcon.classList.remove("bi-heart-fill");
            heartIcon.classList.add("bi-heart");
            alert('Restaurant removed from favourites');
        })
        .catch((error) => {
            console.error('Error:', error);
            heartIcon.classList.add("bi-heart-fill");
            heartIcon.classList.remove("bi-heart");
            alert('An error occurred while removing the restaurant.');
        });
}
