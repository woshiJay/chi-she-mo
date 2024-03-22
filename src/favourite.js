window.onload = () => {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      window.location.href = './pages/login.html';
    } else {
        fetch(`/get-username?uid=${userId}`)
        .then(resp => resp.json())
        .then(data => {
            // Assuming 'data' has a 'username' property with the user's name
            const username = data.username;
            const usernameElement = document.querySelector('.user-disp');
            // Replace the placeholder text with the actual username
            usernameElement.textContent = `Welcome Back, ${username}.`;
            
        return fetch(`/api/user_restaurants?userID=${userId}`)
    })
      .then(resp => resp.json())
      .then(restaurants => {
        const container = document.querySelector('.row.justify-content-center'); // The container where the rows will be appended
        container.innerHTML = ''; // Clear existing content
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
      })
      .catch(error => {
        console.error("Error:", error);
      });
    }
  };
  