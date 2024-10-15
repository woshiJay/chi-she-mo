// const baseURL = window.location.origin;
// Temporary localhost test
const baseURL = "http://localhost:5501";
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

    try {
        const response = await fetch(`${baseURL}/signin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (data.uid) {
            sessionStorage.setItem('userId', data.uid);
            sessionStorage.setItem('username', data.username);  // Store username here
            window.location.href = `${window.location.origin}/src/pages/home.html`;
        } else {
            alert(data.alert || 'Error occurred!');
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

