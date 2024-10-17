// const baseURL = window.location.origin;
const baseURL = "http://localhost:5501";

window.addEventListener('DOMContentLoaded', () => {
    const userId = sessionStorage.getItem('userId');
    const username = sessionStorage.getItem('username');  // Get username from storage

    if (!userId) {
        const spinner = document.createElement('div');
        spinner.classList.add('spinner');
        document.body.appendChild(spinner);

        // Redirect after a short delay to show the spinner
        setTimeout(() => {
            window.location.href = '/src/pages/login.html';
        }, 1000);
        window.location.href = '/src/pages/login.html';
    } else {
        const usernameElement = document.querySelector('.user-disp');
        if (usernameElement) {
            usernameElement.textContent = `Welcome Back, ${username}.`;
        } else {
            console.error("Element with class 'user-disp' not found.");
        }
    }
});