function aboutPageAnimation() {
    const dots = document.querySelectorAll('.dot'); // Use querySelectorAll to get all elements with class 'dot'
    const items = document.querySelectorAll('.item'); // Get all items for reference

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            const item = items[index];
            item.scrollIntoView({
                behavior: 'smooth',
                inline: 'center'
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', aboutPageAnimation);