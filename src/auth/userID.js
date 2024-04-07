window.onload = async () => {
    try {
        const userId = sessionStorage.getItem('userId');
        if (!userId) {
            window.location.href = '/src/pages/login.html';
        } else {
            const resp = await fetch(`/get-username?uid=${userId}`);
            if (!resp.ok) {
                throw new Error(`Failed to get username: ${resp.statusText}`);
            }
            const data = await resp.json();
            if (data.username) {
                const usernameElement = document.querySelector('.user-disp');
                usernameElement.textContent = `Welcome Back, ${data.username}.`;
            } else {
                throw new Error('Username not found in response');
            }
        }
    } catch (error) {
        console.error("Error:", error);
        // Redirect to login or handle the error appropriately
    }
}
