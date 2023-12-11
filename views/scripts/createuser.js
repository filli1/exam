const submitbtn = document.getElementById('create-user-btn');

//function to check if email is already in use, will be used later. If the email already exists, the user will be notified and the function will return false. If the email does not exist, the function will return true.
async function checkEmail(email) {
    try {
        const response = await fetch('/users/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });
        if (response.ok) {
            const data = await response.json();
            return data.exists; // Directly return the existence check
        } else {
            throw new Error(response.statusText);
        }
    } catch (error) {
        console.error(error);
        return null; // Return null in case of an error
    }
}


// Function to check password requirements
function checkPassword() {
    const password = document.getElementById('create-password').value;
    const confirmPassword = document.getElementById('create-password-confirm').value;
    const lengthIcon = document.getElementById('length-icon');
    const confirmIcon = document.getElementById('confirm-icon');
    const uppercaseIcon = document.getElementById('uppercase-icon');
    const lowercaseIcon = document.getElementById('lowercase-icon');
    const numberIcon = document.getElementById('number-icon');
    const name = document.getElementById('create-name').value;
    const email = document.getElementById('create-email').value;
    
  
    // Check password length
    if (password.length >= 8) {
      lengthIcon.innerHTML = '✓'; // Checkmark if length requirement met
      lengthIcon.style.color = 'lightgreen';
    } else {
      lengthIcon.innerHTML = '✗'; // "X" if length requirement not met
      lengthIcon.style.color = 'lightcoral';
    }
  
   
    // Check for password match 
    if (password !== confirmPassword || (password === '' && confirmPassword === '')) {
        confirmIcon.innerHTML = '✗'; // "X" if passwords don't match
        confirmIcon.style.color = 'lightcoral';
    } else {
        confirmIcon.innerHTML = '✓'; // Checkmark if passwords match
        confirmIcon.style.color = 'lightgreen';
    }

    // Check for uppercase letter
    if (/[A-Z]/.test(password)) {
        uppercaseIcon.innerHTML = '✓'; // Checkmark if uppercase requirement met
        uppercaseIcon.style.color = 'lightgreen';
    } else {
        uppercaseIcon.innerHTML = '✗'; // "X" if uppercase requirement not met
        uppercaseIcon.style.color = 'lightcoral';
    }

    // Check for lowercase letter
    if (/[a-z]/.test(password)) {
        lowercaseIcon.innerHTML = '✓'; // Checkmark if lowercase requirement met
        lowercaseIcon.style.color = 'lightgreen';
    } else {
        lowercaseIcon.innerHTML = '✗'; // "X" if lowercase requirement not met
        lowercaseIcon.style.color = 'lightcoral';
    }

    // Check for number
    if (/[0-9]/.test(password)) {
        numberIcon.innerHTML = '✓'; // Checkmark if number requirement met
        numberIcon.style.color = 'lightgreen';
    } else {
        numberIcon.innerHTML = '✗'; // "X" if number requirement not met
        numberIcon.style.color = 'lightcoral';
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

    async function createUser() {
        const name = document.getElementById('create-name').value;
        const password = document.getElementById('create-password').value;
        const email = document.getElementById('create-email').value;
        const phone = document.getElementById('create-phone').value;
        const confirmPassword = document.getElementById('create-password-confirm').value;

        const emailExists = await checkEmail(email);
        if (emailExists === 1) {
            showAlert("Email already in use");
            return;
        } else if (emailExists === null) {
            showAlert("Error checking email. Please try again.");
            return;
        }


        // Check if email is valid
        if (!email.includes('@') || !email.includes('.')) {
            showAlert("Please enter a valid email");
            return;
        }
    
        // Check if phone number is valid (only numbers)
        if (!/^\+?[0-9]+$/.test(phone)) {
            showAlert("Please enter a valid phone number");
            return;
        }
    
        // Check if phone number includes country code
        if (!phone.includes('+')) {
            showAlert("Please include country code in phone number");
            return;
        }
    
        //Check if phone number is at least 8 digits
        if (phone.length < 8) {
            showAlert("Please enter a valid phone number");
            return;
        }
    
        //Check if phone number is at most 15 digits
        if (phone.length > 15) {
            showAlert("Please enter a valid phone number");
            return;
        }
    

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

        // All requirements met, proceed to create user

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
        .then(response => {
            response.text()
        })
        .then(result => {
            //do nothing
        })
        .catch(error => {
            console.error("Fetch error:", error);
            showAlert("An error occurred while fetching data from the server.");
        });

        //wait 2 seconds before redirecting to index.html
        setTimeout(function() {
            window.location.href = '/';
        }, 2000);


    }





function showAlert(message) {
    alert(message);
}

function handleFetchResult(result) {
    try {
        //if the result is a cookie, redirect to index.html
        if (result.startsWith('userAuth')) {
            window.location.href = '../index.html';
            return;
        }
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
