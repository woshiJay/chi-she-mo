// const baseURL = window.location.origin;
const baseURL = "http://localhost:5501";

window.addEventListener('DOMContentLoaded', () => {
    const userId = sessionStorage.getItem('userId');
    const username = sessionStorage.getItem('username');  // Get username from storage

    if (!userId) {
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