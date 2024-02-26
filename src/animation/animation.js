// initializeThemeToggle();

// Theme toggling and like button interactions
// function initializeThemeToggle() {
//   const lightThemeButton = document.getElementById('lightTheme');
//   const darkThemeButton = document.getElementById('darkTheme');
//   const bodyElement = document.body;

//   lightThemeButton.addEventListener('click', () => bodyElement.classList.remove('dark-theme'));
//   darkThemeButton.addEventListener('click', () => bodyElement.classList.add('dark-theme'));
// }
function aboutPageAnimation() {
    const dots = document.querySelectorAll('.dot'); // Use querySelectorAll to get all elements with class 'dot'
    const items = document.querySelectorAll('.item'); // Get all items for reference

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            const item = items[index]; // Get the corresponding item
            item.scrollIntoView({
                behavior: 'smooth',
                inline: 'center' // Changed from 'start' to 'center' to align item in the center
            });
        });
    });
}

// Call this function when the about page is loaded
document.addEventListener('DOMContentLoaded', aboutPageAnimation);