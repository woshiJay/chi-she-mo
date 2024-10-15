// const baseURL = window.location.origin;
const baseURL = "http://localhost:5501";

// window.onload = async () => {
//     try {
//         const userId = sessionStorage.getItem('userId');
//         console.log("userId", userId);
//         if (!userId) {
//             window.location.href = '/src/pages/login.html';
//         } else {
//             const resp = await fetch(`${baseURL}/get-username?uid=${userId}`);
//             if (!resp.ok) {
//                 throw new Error(`Failed to get username: ${resp.statusText}`);
//             }
//             const data = await resp.json();
//             if (data.username) {
//                 const usernameElement = document.querySelector('.user-disp');
//                 usernameElement.textContent = `Welcome Back, ${data.username}.`;
//             } else {
//                 throw new Error('Username not found in response');
//             }
//         }
//     } catch (error) {
//         console.error("Error:", error);
//     }
// }


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