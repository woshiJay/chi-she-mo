// window.onload = () => {
//     const userId = sessionStorage.getItem('userId');
//     console.log("this is the userID: ", {userId});
//     if (!userId) {
//         window.location.href = '../pages/login.html';
//     } else {
//         fetch(`/get-username?uid=${userId}`)
//         .then(resp => resp.json())
//         .then(data => {
//             // Assuming 'data' has a 'username' property with the user's name
//             const username = data.username;
//             const usernameElement = document.querySelector('.user-disp');
//             // Replace the placeholder text with the actual username
//             usernameElement.textContent = `Welcome Back, ${username}.`;
//         })
//         .catch(error => {
//             console.error("Error:", error);
//         });
//     }
// }

window.onload = () => {
    const userId = sessionStorage.getItem('userId');
    console.log("this is the userID: ", userId);
    if (!userId) {
        window.location.href = '/pages/login.html'; // This path might need to be adjusted depending on your structure
    } else {
        fetch(`/get-username?uid=${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text(); // Temporarily get raw text to see what's actually coming back
        })
        .then(text => {
            console.log("Received text: ", text); // Log out the raw text response
            return JSON.parse(text); // Parse text to JSON
        })
        .then(data => {
            const usernameElement = document.querySelector('.user-disp');
            if(data && data.username) {
                usernameElement.textContent = `Welcome Back, ${data.username}`;
            } else {
                throw new Error('Username not found in response');
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
    }
}