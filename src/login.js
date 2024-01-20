const { response } = require("express");

const submitButton = document.getElementById('submitButton')
submitButton.addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:5501/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.uid) {
            sessionStorage.setItem('userId', data.uid);
            window.location.href = '/src/index.html';
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