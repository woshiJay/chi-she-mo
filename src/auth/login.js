const baseURL = window.location.origin;
console.log("baseURL", baseURL);

document.addEventListener('DOMContentLoaded', () => {
    initializeLogin();
});

function initializeLogin() {
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', submitLoginResponse);
}

async function submitLoginResponse(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    showLoadingSpinner(true);
    try {
      const response = await fetch(`${baseURL}/signin`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to authenticate');
      }
      const data = await response.json();
      if (data.uid) {
        sessionStorage.setItem('userId', data.uid);
        sessionStorage.setItem('username', data.username);
        alert('Logged in successfully!');
        window.location.href = `${window.location.origin}/pages/home.html`;
      } else {
        alert(data.alert || 'Error occurred!');
      }
    } catch (error) {
      console.error("Error:", error);
      alert(`Authentication failed: ${error.message}`);
    } finally {
      showLoadingSpinner(false);  // Hide spinner when login is complete
  }
}