window.onload = async () => {
  const userId = sessionStorage.getItem('userId');
  if (!userId) {
    window.location.href = '/src/pages/login.html';
    return;
  }
  try {
    console.log("Fetching favourite restaurants for user:", userId);
    const resp = await fetch(`${baseURL}/api/user_restaurants?userID=${userId}`);
    const responseText = await resp.text();
    console.log("Response Text:", responseText);
    const data = JSON.parse(responseText);
    console.log("Fetched Data:", data);
    const restaurants = Array.isArray(data) ? data : Object.values(data);
    console.log("Fetched restaurants:", restaurants);
    displayFavourites(restaurants);
  } catch (error) {
    console.error('Error fetching favourite restaurants:', error);
  }
};

function displayFavourites(restaurants) {
  const container = document.querySelector('.row.justify-content-center');
  container.innerHTML = '';  // Clear the container first

  if (restaurants.length === 0) {
    container.innerHTML = '<p>No favourite restaurants found.</p>';
    return;
  }

  restaurants.forEach((restaurant) => {
    const cardHtml = `
      <div class="col-12 col-lg-8 mx-auto">
        <div class="card my-2 p-2">
          <div class="card-body d-flex justify-content-between align-items-center">
            <a href="https://www.google.com/maps/place/?q=place_id:${restaurant.placeID}"
              class="resLink text-decoration-none text-dark" target="_blank">
              <span class="resName fw-medium">${restaurant.resName}</span>
            </a>
            <div class="d-flex justify-content-end align-items-center mx-2">
              <button type="button" class="btn likeButton mx-2" data-place-id="${restaurant.placeID}">
                <a><i class="bi bi-heart-fill i-heart"></i></a>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', cardHtml);
  });
  initializeLikeButtons();
}

function initializeLikeButtons() {
  const likeButtons = document.querySelectorAll('.likeButton');
  likeButtons.forEach(button => {
    button.addEventListener('click', async function () {
      const heartIcon = this.querySelector('i');
      const placeId = this.getAttribute('data-place-id');
      const userId = sessionStorage.getItem('userId');
      
      try {
        await removeRestaurant(userId, placeId);
        // Remove the card from the DOM
        this.closest('.col-12').remove();
        
        // After removing, check if there are any restaurants left
        const remainingCards = document.querySelectorAll('.col-12');
        if (remainingCards.length === 0) {
          document.querySelector('.row.justify-content-center').innerHTML = '<p>No favourite restaurants found.</p>';
        }
      } catch (error) {
        console.error('Error removing restaurant:', error);
      }
    });
  });
}

async function removeRestaurant(userId, placeId) {
  try {
    const response = await fetch(`${baseURL}/api/delete_user_restaurants?userID=${userId}&placeID=${placeId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to remove restaurant');
    }
    console.log('Restaurant removed successfully');
    alert('Restaurant removed successfully');
  } catch (error) {
    console.error('Error removing restaurant:', error);
    throw error;
  }
}