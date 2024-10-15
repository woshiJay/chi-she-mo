// const baseURL = window.location.origin;
const baseURL = "http://localhost:5501";
console.log("baseURL", baseURL);

document.addEventListener('DOMContentLoaded', () => {
    initializeRegistration();
});

function initializeRegistration() {
    const registerForm = document.getElementById('registerForm');
    registerForm.addEventListener('submit', submitRegistrationResponse);
}

async function submitRegistrationResponse(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${baseURL}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
          });
          
        console.log(response.status);  // Log status to ensure request success
        const data = await response.json();  // Parse response safely
        console.log("Response Data:", data);
        if (data.redirect) {
            window.location.href = data.redirect;
        } else if (data.alert) {
            alert(data.alert);
        } else {
            alert('Error occurred!');
        }
    } catch (error) {
        console.error("Error:", error);
    }
}




