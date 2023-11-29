const submitbtn = document.getElementById('create-user-btn');

// Function to check password requirements
function checkPassword() {
    const password = document.getElementById('create-password').value;
    const confirmPassword = document.getElementById('create-password-confirm').value;
    const lengthIcon = document.getElementById('length-icon');
    const confirmIcon = document.getElementById('confirm-icon');
    const uppercaseIcon = document.getElementById('uppercase-icon');
    const lowercaseIcon = document.getElementById('lowercase-icon');
    const numberIcon = document.getElementById('number-icon');

  
    // Check password length
    if (password.length >= 8) {
      lengthIcon.innerHTML = '✓'; // Checkmark if length requirement met
      lengthIcon.style.color = 'green';
    } else {
      lengthIcon.innerHTML = '✗'; // "X" if length requirement not met
      lengthIcon.style.color = 'red';
    }
  
   
    // Check for password match 
    if (password !== confirmPassword || (password === '' && confirmPassword === '')) {
        confirmIcon.innerHTML = '✗'; // "X" if passwords don't match
        confirmIcon.style.color = 'red';
    } else {
        confirmIcon.innerHTML = '✓'; // Checkmark if passwords match
        confirmIcon.style.color = 'green';
    }

    // Check for uppercase letter
    if (/[A-Z]/.test(password)) {
        uppercaseIcon.innerHTML = '✓'; // Checkmark if uppercase requirement met
        uppercaseIcon.style.color = 'green';
    } else {
        uppercaseIcon.innerHTML = '✗'; // "X" if uppercase requirement not met
        uppercaseIcon.style.color = 'red';
    }

    // Check for lowercase letter
    if (/[a-z]/.test(password)) {
        lowercaseIcon.innerHTML = '✓'; // Checkmark if lowercase requirement met
        lowercaseIcon.style.color = 'green';
    } else {
        lowercaseIcon.innerHTML = '✗'; // "X" if lowercase requirement not met
        lowercaseIcon.style.color = 'red';
    }

    // Check for number
    if (/[0-9]/.test(password)) {
        numberIcon.innerHTML = '✓'; // Checkmark if number requirement met
        numberIcon.style.color = 'green';
    } else {
        numberIcon.innerHTML = '✗'; // "X" if number requirement not met
        numberIcon.style.color = 'red';
    }
    }
  
  // Listen for input events on password fields and trigger real-time validation
  const passwordInput = document.getElementById('create-password');
  const confirmPasswordInput = document.getElementById('create-password-confirm');
  const lengthIcon = document.getElementById('length-icon');
  
  passwordInput.addEventListener('input', checkPassword);
  confirmPasswordInput.addEventListener('input', checkPassword);
  
  // Initialize the requirement check
  checkPassword();

function createUser() {
    const name = document.getElementById('create-name').value;
    const password = document.getElementById('create-password').value;
    const email = document.getElementById('create-email').value;
    const phone = document.getElementById('create-phone').value;
    const confirmPassword = document.getElementById('create-password-confirm').value;

    // Check for empty fields
    if (name === '' || password === '' || email === '' || phone === '' || confirmPassword === '') {
        showAlert("Please fill out all fields");
        return;
    }

     // Check password requirements
     if (password.length < 8) {
        showAlert("Password must be at least 8 characters");
        return;
    }

    if (password !== confirmPassword) {
        showAlert("Passwords do not match");
        return;
    }

    if (!/[A-Z]/.test(password)) {
        showAlert("Password must contain at least one uppercase letter");
        return;
    }

    if (!/[a-z]/.test(password)) {
        showAlert("Password must contain at least one lowercase letter");
        return;
    }

    if (!/[0-9]/.test(password)) {
        showAlert("Password must contain at least one number");
        return;
    }

    // All password requirements met, proceed to create user

    fetch('/users/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name,
            password,
            email,
            phone
        }),
   

    })
    .then(response => response.text())
    .then(result => handleFetchResult(result))
    .catch(error => {
        console.error("Fetch error:", error);
        showAlert("An error occurred while fetching data from the server.");
    });
}




function handleFetchResult(result) {
    try {
        if (result.startsWith('{') || result.startsWith('[')) {
            // It looks like JSON, attempt to parse
            const jsonData = JSON.parse(result);
            if (jsonData.error) {
                showAlert(jsonData.error);
            } else {
                showAlert(jsonData.message);
            }
        } else {
            // Assume it's plain text
            showAlert(result);
        }
    } catch (error) {
        console.error("Error parsing JSON:", error);
        showAlert("Error parsing server response");
    }
}



submitbtn.addEventListener('click', createUser);
