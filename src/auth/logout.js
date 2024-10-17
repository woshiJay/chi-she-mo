// Event listener for logout button
document.addEventListener('DOMContentLoaded', () => {
  const logoutButton = document.getElementById('logout');
  if (logoutButton) {
    logoutButton.addEventListener('click', handleLogout);
  }
});

async function handleLogout(event) {
  event.preventDefault();  // Prevents default anchor behavior
  try {
    // Optional: Call the backend logout endpoint
    const response = await fetch(`${baseURL}/signout`);
    if (!response.ok) {
      throw new Error('Failed to logout. Please try again.');
    }
    alert('Logged out successfully');
    // Clear sessionStorage and redirect to login
    sessionStorage.clear();
    window.location.href = '/src/pages/login.html';
  } catch (error) {
    console.error('Logout error:', error);
    alert('Error logging out. Please try again.');
  }
}