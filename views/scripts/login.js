document.addEventListener('DOMContentLoaded', function() {
    const loginbutton = document.getElementById('loginbtn');
  
    // Define the login function
    async function login() {
      const email = document.getElementById('email-input').value;
      const password = document.getElementById('password-input').value;
  
      try {
        const response = await fetch('/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
  
        if (response.ok) {
          const data = await response.json();
          alert(data.message); // Show a success message
          console.log(data);
        } else {
          const errorData = await response.json();
          alert(errorData.error); // Show an error message
        }
      } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login.'); // Show a generic error message
      }
    }
  
    // Add the event listener to the button (not form submission)
    loginbutton.addEventListener('click', function(e) {
      e.preventDefault(); // Prevent the button's default behavior
      login();
    });
});