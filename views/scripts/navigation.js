function deleteCookie(name) {
  // Set the cookie to expire by setting the expiration date to a date in the past
  document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

async function getUser() {
  try {
    const response = await fetch("/users/checkWithCookie", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error(response.statusText);
    }
  } catch (error) {
    //console.error(error);
    return null; // Return null in case of an error
  }
}

async function updateUserNav() {
  const user = await getUser();
  if (user) {
    // User is logged in
    // Change the log in button to a log out button
    //Change the create user link to the user's name
    const loginLink = document.getElementById("open-popup");
    if (loginLink) {
      loginLink.innerHTML = "Log out";
      loginLink.addEventListener("click", function (event) {
        event.preventDefault();
        deleteCookie("userAuth");
        window.location.href = "/";
      });

      createUserLink = document.getElementById("createuser");
      const userName = user.name;
      createUserLink.innerHTML = userName;
      createUserLink.href = "/account";
    }
  } else {
    // User is not logged in
    // Hide or remove the Log out button
    const logoutLink = document.getElementById("open-popup");
    if (logoutLink) {
      logoutLink.innerHTML = "Login";
      logoutLink.addEventListener("click", function (event) {
        event.preventDefault();
        const loginPopup = document.getElementById("login-popup");
        if (loginPopup) {
          loginPopup.style.display = "block";
        }
      });

      createUserLink = document.getElementById("createuser");
      createUserLink.innerHTML = "Create User";
      createUserLink.href = "/create-user";
    }

    // Event listener for opening the popup
    const openPopupLink = document.getElementById("open-popup");
    if (openPopupLink) {
      openPopupLink.addEventListener("click", function (event) {
        event.preventDefault();
        const loginPopup = document.getElementById("login-popup");
        if (loginPopup) {
          loginPopup.style.display = "block";
        }
      });
    }
    // Add the Create User link
    //er det denne der bliver brugt eller den der ligger i html?
    const createUserLink =
      '<a id="createuserlink" href="/create-user">Create User</a>';
    nav.insertAdjacentHTML("beforeend", createUserLink);
  }
}

// Call the function to update the navigation based on the user's authentication status
updateUserNav();
