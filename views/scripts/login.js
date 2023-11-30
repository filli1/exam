document.addEventListener('DOMContentLoaded', function() {
    
    // Define the login function
    async function login(event) {
      event.preventDefault(); // Prevent form from submitting normally
  
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
  
      try {
        const response = await fetch('/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
        
        const responseText = await response.text(); // Await the response content
        function showAlert(message) {
            alert(message);
        }
        // Handle the response
        if (response.ok) {
            //refresh page
            location.reload();
        }
        else {
            showAlert(responseText);
            //return here, to prevent the popup from closing
            return;
        }
        }
        catch (error) {
            console.error(error);
        }

        const createUserLink = document.querySelector('a[href="../create-user.html"]');
        if (createUserLink) {
            createUserLink.style.display = 'none';
        }
        const loginBtn = document.getElementById("login-popup");
        loginBtn.style.display = "none";
    }
  
    // Attach event listener to the login form
    const loginForm = document.getElementById('login-form');
    //add event listener to login button, that runs login function and updates nav with function updateNav from navigation.js
    if (loginForm) {
        loginForm.addEventListener('submit', login);
    }
    
});
