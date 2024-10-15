// const baseURL = window.location.origin;
window.onload = async () => {
  const userId = sessionStorage.getItem('userId');
  if (!userId) {
    window.location.href = '/src/pages/login.html';
  } else {
    try {
      const resp = await fetch(`${baseURL}/api/user_restaurants?userID=${userId}`);
      const restaurants = await resp.json();
      const container = document.querySelector('.row.justify-content-center');
      container.innerHTML = '';

      if (restaurants.length === 0) {
        container.innerHTML = '<p>No favourite restaurants found.</p>';
      } else {
        restaurants.forEach((restaurant) => {
          const cardHtml = `
            <div class="container">
              <div class="col">
                <div class="card my-2 p-2">
                  <div class="card-body d-flex justify-content-between align-items-center">
                    <a href="https://www.google.com/maps/place/?q=place_id:${restaurant.placeID}" 
                       class="resLink text-decoration-none text-dark" target=_blank>
                      <span class="resName fw-medium">${restaurant.resName}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          `;
          container.insertAdjacentHTML('beforeend', cardHtml);
        });
      }
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  }
};