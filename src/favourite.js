window.onload = async () => {
  const userId = sessionStorage.getItem('userId');
  if (!userId) {
    window.location.href = '/src/pages/login.html';
  } else {
    try {
      const resp = await fetch(`http://localhost:5501/get-username?uid=${userId}`);
      const data = await resp.json();
      const username = data.username;
      const usernameElement = document.querySelector('.user-disp');
      usernameElement.textContent = `Welcome Back, ${username}.`;

      const resp2 = await fetch(`http://localhost:5501/api/user_restaurants?userID=${userId}`);
      const restaurants = await resp2.json();
      const container = document.querySelector('.row.justify-content-center');
      container.innerHTML = '';
      restaurants.forEach(restaurant => {
        const cardHtml = `
          <div class="container">
            <div class="col">
              <div class="card my-2 p-2">
                <div class="card-body d-flex justify-content-between align-items-center">
                  <a href="https://www.google.com/maps/place/?q=place_id:${restaurant.placeID}" class="resLink text-decoration-none text-dark" target=_blank>
                    <span class="resName fw-medium">${restaurant.resName}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        `;
        container.insertAdjacentHTML('beforeend', cardHtml);
      });
    } catch (error) {
      console.error("Error:", error);
    }
  }
};
