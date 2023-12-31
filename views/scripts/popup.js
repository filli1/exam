document.addEventListener("DOMContentLoaded", function () {
  // Creates the popup HTML for the login popup
  const popupHTML = `
    <div id="login-popup" class="popup">
      <div class="popup-content">
        <span class="close" id="close-popup">&times;</span>
        <h2 id="label">Login</h2>
        <form id="login-form">
          <label for="email">Email</label>
          <input type="text" id="email" />
          <label for="password">Password</label>
          <input type="password" id="password" autocomplete="current-password"/>
          <input type="submit" value="Submit" id="login-submit-btn"/>
          <a class="pink-text" href="/create-user">Don't have a user? Click here to sign up!</a>
          
        </form>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', popupHTML);

  // Add event listener for closing the popup
  const closePopupButton = document.getElementById("close-popup");
  if (closePopupButton) {
    closePopupButton.addEventListener("click", function () {
      const loginPopup = document.getElementById("login-popup");
      if (loginPopup) {
        loginPopup.style.display = "none";
      }
    });
  }
});
