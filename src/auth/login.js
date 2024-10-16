const baseURL = "https://us-central1-chi-se-mo.cloudfunctions.net/api";
// const baseURL = "http://localhost:5501";
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
        
        if (!response.ok) {
            console.error('Server responded with an error:', response.status);
            throw new Error('Failed to authenticate');
        }
        
        const data = await response.json();
        if (data.uid) {
            sessionStorage.setItem('userId', data.uid);
            sessionStorage.setItem('username', data.username);
            window.location.href = `${window.location.origin}/src/pages/home.html`;
        } else {
            alert(data.alert || 'Error occurred!');
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

