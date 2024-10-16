window.onload = async () => {
  const userId = sessionStorage.getItem('userId');
  if (!userId) {
    window.location.href = '/src/pages/login.html';
    return;
  }

  try {
    console.log("Fetching favourite restaurants for user:", userId);
    const resp = await fetch(`http://localhost:5501/api/user_restaurants?userID=${userId}`);
    const responseText = await resp.text();
    console.log("Response Text:", responseText);

    // const data = await resp.json();
    const data = JSON.parse(responseText); // Parse JSON from response  
    console.log("Fetched Data:", data); // Debugging

    // Flatten the restaurant data if needed
    const restaurants = Object.values(data);
    console.log("Fetched restaurants:", restaurants);

    displayFavourites(restaurants);
  } catch (error) {
    console.error('Error fetching favourite restaurants:', error);
  }
};

function displayFavourites(restaurants) {
  const container = document.querySelector('.row.justify-content-center');
  container.innerHTML = ''; // Clear previous results

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
              <button type="button" class="btn likeButton mx-2">
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
    button.addEventListener('click', function () {
      const heartIcon = this.querySelector('i');
      const isLiked = heartIcon.classList.contains('bi-heart-fill');
      heartIcon.classList.toggle('bi-heart-fill', !isLiked);
      heartIcon.classList.toggle('bi-heart', isLiked);
    });
  });
}