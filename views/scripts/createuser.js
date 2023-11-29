const submitbtn = document.getElementById('create-user-btn');

function createUser() {
    const name = document.getElementById('create-name').value;
    const password = document.getElementById('create-password').value;
    const confirmPassword = document.getElementById('create-password-confirm').value;
    const email = document.getElementById('create-email').value;
    const phone = document.getElementById('create-phone').value;
    console.log(name);
    // Validate inputs
    if (password !== confirmPassword) {
        showAlert("Passwords do not match");
        return;
    }

    if (password.length < 8) {
        showAlert("Password must be at least 8 characters");
        return;
    }

    if (email.length < 1) {
        showAlert("Email cannot be empty");
        return;
    }

    if (phone.length < 1) {
        showAlert("Phone cannot be empty");
        return;
    }

    if (name.length < 1) {
        showAlert("Name cannot be empty");
        return;
    }

    // If all validations pass, make the fetch request
    fetch('/users/create', {
        method: 'POST',
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

function showAlert(message) {
    alert(message);
}

function handleFetchResult(result) {
    console.log(result); // Log the raw response
    try {
        //const jsonData = JSON.parse(result);
        console.log(result);
        if (jsonData.error) {
            showAlert(jsonData.error);
        } else {
            showAlert(jsonData.message);
        }
    } catch (error) {
        console.error(error);
        //showAlert("Error parsing server response.");
    }
}

submitbtn.addEventListener('click', createUser);
