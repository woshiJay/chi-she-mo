// window.onload = () => {
//     const userId = sessionStorage.getItem('userId');
//     if (!userId) {
//         window.location.href = '/src/login.html';
//     } else if (userId) {
//         fetch(`http://localhost:5501/get-username?uid=${userId}`)
//         .then(resp => resp.json())
//         .then(data => {
//             // gets username and updates HTML to display username
//         })
//         .catch(error => {
//             console.error("Error:", error);
//         })
//     }
// }