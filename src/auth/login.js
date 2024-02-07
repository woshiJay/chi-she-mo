document.addEventListener('DOMContentLoaded', () => {
    initializeLogin();
});

function initializeLogin() {
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', submitLoginResponse);
}

async function submitLoginResponse(event) {
    event.preventDefault();
    
    console.log("event", event)
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:5501/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });
        const data = await response.json();
        if (data.uid) {
            sessionStorage.setItem('userId', data.uid);
            window.location.href = '/src/index.html';
        } else if (data.alert) {
            alert(data.alert);
        } else {
            alert('Error occurred!');
        }
    } catch (error) {
        console.error("Error:", error);
    }
}




