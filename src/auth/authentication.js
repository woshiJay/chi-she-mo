document.addEventListener('DOMContentLoaded', () => {
    login();
    registration();
});

async function login() {
    const submitButton = document.getElementById('submitButton');
    submitButton.addEventListener('click', async () => {
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
    });
}

async function registration() {
    const registerButton = document.getElementById('registerButton');
    registerButton.addEventListener("click", async () => {
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:5501/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password }),
            });
            const data = await response.json();
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
    });
}




