
   //Hide the buttons that are not needed yet
   document.getElementById("accountsavebtn").style.display = "none";
   document.getElementById("accountpasswordconfirm").style.display = "none";
   document.getElementById("accountcancelbtn").style.display = "none";
   document.getElementById("confirmlabel").innerHTML = "";
async function getUserInfo() {
    const user = await getUser(userAuth);
    //Change greeting on account page
    document.getElementById("accountHeader").innerHTML = "Welcome back, " + user.name + "!😎☕️";
    //Fill in user info
    document.getElementById("accountname").value = user.name;
    document.getElementById("accountemail").value = user.email;
    document.getElementById("accountphone").value = user.phone;
    //We don't want to have the password on the page, so we'll replace it with x's
    document.getElementById("accountpassword").value = "xxxxxxxx";
 
    
}

//Add eventlistener to edit button, which unlocks the readonly fields
document.getElementById("accountbtn").addEventListener("click", function() {
    document.getElementById("accountname").readOnly = false;
    document.getElementById("accountemail").readOnly = false;
    document.getElementById("accountphone").readOnly = false;
    document.getElementById("accountpassword").readOnly = false;
    //Display a new button to save the changes
    document.getElementById("accountbtn").style.display = "none";
    document.getElementById("accountsavebtn").style.display = "block";
    //Add eventlistener to the password field; If the user clicks on it, the field will be cleared, and if the user enters a new password, a confirm new password field will appear
document.getElementById("accountpassword").addEventListener("click", function() {
    document.getElementById("accountpassword").value = "";
    document.getElementById("accountpassword").type = "password";
    document.getElementById("accountpasswordconfirm").style.display = "block";
    document.getElementById("confirmlabel").innerHTML = "Confirm new password:";
    //remove the save button until the user has confirmed the new password
    document.getElementById("accountsavebtn").style.display = "none";
     //if the password and confirm password fields are not empty, and the password and confirm password fields match, the save button will reappear
    document.getElementById("accountpasswordconfirm").addEventListener("keyup", function() {
    if (document.getElementById("accountpassword").value == document.getElementById("accountpasswordconfirm").value) {
        document.getElementById("accountsavebtn").style.display = "block";
    }
    else {
        document.getElementById("accountsavebtn").style.display = "none";
    }
});
    //add a cancel password change button
    document.getElementById("accountcancelbtn").style.display = "block";
    //add eventlistener to cancel password change button
    document.getElementById("accountcancelbtn").addEventListener("click", function() {
        document.getElementById("accountpassword").value = "xxxxxxxx";
        document.getElementById("accountpasswordconfirm").style.display = "none";
        document.getElementById("accountcancelbtn").style.display = "none";
        document.getElementById("accountsavebtn").style.display = "none";
        document.getElementById("confirmlabel").innerHTML = "";
        document.getElementById("accountbtn").style.display = "block";
        document.getElementById("accountpassword").readOnly = true;
        document.getElementById("accountname").readOnly = true;
        document.getElementById("accountemail").readOnly = true;
        document.getElementById("accountphone").readOnly = true;
    });
});
});


//API call to update user info
async function updateUser(user, name, email, phone, password) {
    try {
        const requestBody = { user, name, email, phone, password };
        
        const response = await fetch('/users/' + userAuth, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        console.log(response);
        console.log(response.body);

        const responseText = await response.text();

        function showAlert(message) {
            alert(message);
        }

        if (response.ok) {
            showAlert("User info updated successfully!");
            return;
        } else {
            showAlert(responseText);
            return;
        }
    } catch (error) {
        console.error(error);
    }
}




//Add eventlistener to save button, which saves the changes by sending them to the database
document.getElementById("accountsavebtn").addEventListener("click", function() {
    //Get the values of the fields
    const name = document.getElementById("accountname").value;
    const email = document.getElementById("accountemail").value;
    const phone = document.getElementById("accountphone").value;
    const password = document.getElementById("accountpassword").value;
    //Update the user info
    updateUser(userAuth, name, email, phone, password);
    //Lock the fields again
    document.getElementById("accountname").readOnly = true;
    document.getElementById("accountemail").readOnly = true;
    document.getElementById("accountphone").readOnly = true;
    document.getElementById("accountpassword").readOnly = true;
    //Display the edit button again
    document.getElementById("accountbtn").style.display = "block";
    document.getElementById("accountsavebtn").style.display = "none";
});



    

getUserInfo();