// logout.js
document.addEventListener('DOMContentLoaded', () => {
  const logoutButton = document.getElementById('logout');
  if (logoutButton) {
    logoutButton.addEventListener('click', handleLogout);
  }
});

function handleLogout(event) {
  event.preventDefault();  // Prevents default anchor behavior

  // Clear sessionStorage and redirect to login
  sessionStorage.clear();
  alert('Logged out successfully!');
  window.location.href = '/pages/login.html';
}