const submitbtn = document.getElementById("create-user-btn");

//function to check if email is already in use, will be used later. If the email already exists, the user will be notified and the function will return false. 
//If the email does not exist, the function will return true.
async function checkEmail(email) {
  try {
    const response = await fetch("/users/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    if (response.ok) {
      const data = await response.json();
      return data.exists; 
    } else {
      throw new Error(response.statusText);
    }
  } catch (error) {
    console.error(error);
    return null; 
  }
}

//Set password field to password on focus. 
//Done to prevent safari strong password feature from blocking the users ability to choose their own password, which occured in some instances when the password field was set to password by default.
document.getElementById('create-password').addEventListener('focus', function() {
  document.getElementById('create-password').type = 'password';
});
//Same for confirm password field
document.getElementById('create-password-confirm').addEventListener('focus', function() {
  document.getElementById('create-password-confirm').type = 'password';
}); 

// Function to check password requirements
function checkPassword() {
  const password = document.getElementById("create-password").value;
  const confirmPassword = document.getElementById(
    "create-password-confirm"
  ).value;
  const lengthIcon = document.getElementById("length-icon");
  const confirmIcon = document.getElementById("confirm-icon");
  const uppercaseIcon = document.getElementById("uppercase-icon");
  const lowercaseIcon = document.getElementById("lowercase-icon");
  const numberIcon = document.getElementById("number-icon");

  // Check password length
  if (password.length >= 8) {
    lengthIcon.innerHTML = "✓"; // Checkmark if length requirement met
    lengthIcon.style.color = "lightgreen";
  } else {
    lengthIcon.innerHTML = "✗"; // "X" if length requirement not met
    lengthIcon.style.color = "lightcoral";
  }

  // Check for password match
  if (
    password !== confirmPassword ||
    (password === "" && confirmPassword === "")
  ) {
    confirmIcon.innerHTML = "✗"; // "X" if passwords don't match
    confirmIcon.style.color = "lightcoral";
  } else {
    confirmIcon.innerHTML = "✓"; // Checkmark if passwords match
    confirmIcon.style.color = "lightgreen";
  }

  // Check for uppercase letter
  if (/[A-Z]/.test(password)) {
    uppercaseIcon.innerHTML = "✓"; // Checkmark if uppercase requirement met
    uppercaseIcon.style.color = "lightgreen";
  } else {
    uppercaseIcon.innerHTML = "✗"; // "X" if uppercase requirement not met
    uppercaseIcon.style.color = "lightcoral";
  }

  // Check for lowercase letter
  if (/[a-z]/.test(password)) {
    lowercaseIcon.innerHTML = "✓"; // Checkmark if lowercase requirement met
    lowercaseIcon.style.color = "lightgreen";
  } else {
    lowercaseIcon.innerHTML = "✗"; // "X" if lowercase requirement not met
    lowercaseIcon.style.color = "lightcoral";
  }

  // Check for number
  if (/[0-9]/.test(password)) {
    numberIcon.innerHTML = "✓"; // Checkmark if number requirement met
    numberIcon.style.color = "lightgreen";
  } else {
    numberIcon.innerHTML = "✗"; // "X" if number requirement not met
    numberIcon.style.color = "lightcoral";
  }
}

// Listen for input events on password fields and call checkPassword so requirement fulfillment is checked in real time
const passwordInput = document.getElementById("create-password");
const confirmPasswordInput = document.getElementById("create-password-confirm");
const lengthIcon = document.getElementById("length-icon");

passwordInput.addEventListener("input", checkPassword);
confirmPasswordInput.addEventListener("input", checkPassword);

// Initialize the requirement check
checkPassword();

// Function to create a user
  async function createUser() {
    const name = document.getElementById("create-name").value;
    const password = document.getElementById("create-password").value;
    const email = document.getElementById("create-email").value;
    const phone = document.getElementById("create-phone").value;
    const confirmPassword = document.getElementById(
      "create-password-confirm"
    ).value;
    
    // Check if email already exists, if so, return and show alert
    const emailExists = await checkEmail(email);
    if (emailExists === 1) {
      alert("Email already in use");
      return;
    } else if (emailExists === null) {
      alert("Error checking email. Please try again.");
      return;
    }

    // Check if email is valid by checking if it at least contains @ and .
    if (!email.includes("@") || !email.includes(".")) {
      alert("Please enter a valid email");
      return;
    }

    // Check if phone number is valid (only numbers and + allowed)
    if (!/^\+?[0-9]+$/.test(phone)) {
      alert("Please enter a valid phone number");
      return;
    }

    // Check if phone number includes country code by checking if it includes +
    if (!phone.includes("+")) {
      alert("Please include country code in phone number");
      return;
    }

    //Check if phone number is at least 8 digits
    if (phone.length < 8) {
      alert("Please enter a valid phone number");
      return;
    }

    //Check if phone number is at most 15 digits
    if (phone.length > 15) {
      alert("Please enter a valid phone number");
      return;
    }

  // Check for empty fields
  if (
    name === "" ||
    password === "" ||
    email === "" ||
    phone === "" ||
    confirmPassword === ""
  ) {
    alert("Please fill out all fields");
    return;
  }

  // Check password requirements
  if (password.length < 8) {
    alert("Password must be at least 8 characters");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  if (!/[A-Z]/.test(password)) {
    alert("Password must contain at least one uppercase letter");
    return;
  }

  if (!/[a-z]/.test(password)) {
    alert("Password must contain at least one lowercase letter");
    return;
  }

  if (!/[0-9]/.test(password)) {
    alert("Password must contain at least one number");
    return;
  }

  // All requirements met, proceed to create user

  fetch("/users/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      password,
      email,
      phone,
    }),
  })
    .then((response) => {
      response.text();
    })
    .then((result) => {
      //do nothing
    })
    .catch((error) => {
      console.error("Fetch error:", error);
      alert("An error occurred while fetching data from the server.");
    });

        //Redirect to home page if user is created successfully after 2 seconds. If redirected imediattely, the cookie doesnt always have time do be set, therefore the timeout.
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
          
}

submitbtn.addEventListener("click", createUser);
