const submitbtn = document.getElementById('create-user-btn');

function createUser() {
    const username = document.get('#username').value;
    const password = document.querySelector('#password').value;
    const email = document.querySelector('#email').value;
    const phone = document.querySelector('#phone').value; // Added .value to get the input value

    fetch('/create', {
        method: 'POST',
        body: JSON.stringify({
            "username": username,
            "password": password,
            "email": email,
            "phone": phone
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
        if (result.error) {
            alert(result.error);
        } else {
            alert(result.message);
        }
    });
}

submitbtn.addEventListener('click', createUser);
