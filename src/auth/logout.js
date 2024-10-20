// logout.js
document.addEventListener('DOMContentLoaded', () => {
  const logoutButton = document.getElementById('logout');
  if (logoutButton) {
    logoutButton.addEventListener('click', handleLogout);
  }
});

function handleLogout(event) {
  event.preventDefault();  // Prevents default anchor behavior
  showLoadingSpinner(true);  // Show spinner during logout process
  // Clear sessionStorage and redirect to login
  sessionStorage.clear();
  alert('Logged out successfully!');
  window.location.href = '/pages/login.html';

  setTimeout(() => {
    showLoadingSpinner(false);
  }, 500); 
}