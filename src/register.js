document.addEventListener('DOMContentLoaded', () => {
    registration();
});

function registration() {

    const registerButton = document.getElementById('registerButton');

    registerButton.addEventListener("click", () => {
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        console.log("Button clicked!")

    fetch('http://localhost:5501/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password }),
        })
        .then(resp => resp.json())
        .then(data => {
            if (data.redirect) {
                window.location.href = data.redirect;
            } else if (data.alert) {
                alert(data.alert);
            } else {
                alert('Error occurred!');
            }
        })
        .catch(error => {
            console.error("Error:", error);
        })
})
}