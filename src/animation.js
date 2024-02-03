// Choose to display container result based on "shuffle" or "enter" button
document.addEventListener("DOMContentLoaded", function () {
    const enterButton = document.querySelectorAll(".enterButton");
    const shuffleButton = document.querySelectorAll(".shuffleButton");
    const cravingsInput = document.getElementById("cravingsInput");
  
    function toggleSearchDisplay() {
      const showSearch = document.getElementById("showSearch");

      if (showSearch.classList.contains("show")) {
        showSearch.classList.remove("show");
        showSearch.addEventListener("transitionend", function handler() {
          showSearch.style.display = "none";
          showSearch.removeEventListener("transitionend", handler);
        });
      } else {
        showSearch.style.display = "block";
        void showSearch.offsetWidth;
        showSearch.classList.add("show");
        }
    }
  
    cravingsInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.keyCode === 13) {
        event.preventDefault();
        // here needs to check whether the results are obtained from server yet or not
        toggleSearchDisplay();
      }
    });
    shuffleButton
      .forEach((button) => {
        button.addEventListener("click", function () {
        // here needs to check whether the results are obtained from server yet or not
        toggleSearchDisplay();
        });
      });
    enterButton.forEach((button) => {
      button.addEventListener("click", function () {
      // here needs to check whether the results are obtained from server yet or not
      toggleSearchDisplay();    
      });
    });
  });

