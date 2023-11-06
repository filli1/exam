document.addEventListener("DOMContentLoaded", function () {
  // This code runs after the DOM content is fully loaded

  document
    .getElementById("open-popup")
    .addEventListener("click", function (event) {
      console.log("Clicked on 'Login' link");
      event.preventDefault();
      document.getElementById("login-popup").style.display = "block";
    });

  document.getElementById("close-popup").addEventListener("click", function () {
    console.log("Clicked on 'Close' button");
    document.getElementById("login-popup").style.display = "none";
  });
});
