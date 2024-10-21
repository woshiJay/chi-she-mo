document.addEventListener('DOMContentLoaded', () => {
    function showLoadingSpinner(show) {
      const spinner = document.getElementById('loadingSpinner');
      if (spinner) {
        spinner.style.display = show ? 'block' : 'none';
      } else {
        console.error('Spinner element not found!');
      }
    }
  
    // Expose the function globally if necessary
    window.showLoadingSpinner = showLoadingSpinner;
  });