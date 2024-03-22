window.onload = () => {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
        window.location.href = '/src/pages/login.html';
    } else {
        fetch(`http://localhost:5501/get-username?uid=${userId}`)
        .then(resp => resp.json())
        .then(data => {
            // Assuming 'data' has a 'username' property with the user's name
            const username = data.username;
            const usernameElement = document.querySelector('.user-disp');
            // Replace the placeholder text with the actual username
            usernameElement.textContent = `Welcome Back, ${username}.`;
        })
        .catch(error => {
            console.error("Error:", error);
        });
    }
}