document.addEventListener('DOMContentLoaded', function() {
    const likeButton = document.getElementById('likeButton');

function likeTransition(button) {
    const heartIcon = button.querySelector('.i-heart');
    heartIcon.classList.toggle('bi-heart');
    heartIcon.classList.toggle('bi-heart-fill');

    // If like-state is alive/not
    if (heartIcon.classList.contains('bi-heart-fill')) {
        alert("Added to Favourites.")
    } else {
        alert("Removed from Favourites.")
    }

    // TODO move the location link/address to favourites page
  }

    // Like Button
    likeButton.addEventListener('click', function() {
        likeTransition(this);
    });
});

      