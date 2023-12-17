//Display userinfo, and allow the user to edit it
        //Hide the buttons that are not needed yet
        document.getElementById("accountsavebtn").style.display = "none";
        document.getElementById("accountpasswordconfirm").style.display = "none";
        document.getElementById("accountcancelbtn").style.display = "none";
        document.getElementById("confirmlabel").innerHTML = "";
        async function getUserInfo() {
            const user = await getUser();
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
            document.getElementById("accountname").disabled = false;
            document.getElementById("accountemail").disabled = false;
            document.getElementById("accountphone").disabled = false;
            document.getElementById("accountpassword").disabled = false;
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
        async function updateUser( name, email, phone, password) {
            
            try {
                const requestBody = { name, email, phone, password };
                
                const response = await fetch('/users', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody),
                });

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
            updateUser(name, email, phone, password);
            //Lock the fields again
            document.getElementById("accountname").readOnly = true;
            document.getElementById("accountemail").readOnly = true;
            document.getElementById("accountphone").readOnly = true;
            document.getElementById("accountpassword").readOnly = true;
            document.getElementById("accountname").disabled = true;
            document.getElementById("accountemail").disabled = true;
            document.getElementById("accountphone").disabled = true;
            document.getElementById("accountpassword").disabled = true;
            //Display the edit button again
            document.getElementById("accountbtn").style.display = "block";
            document.getElementById("accountsavebtn").style.display = "none";
        });



            

        getUserInfo();


// {
//     "id": "cs_test_a1nHWiVzoXzItjf9xYhavULHovLckPdKw3swgo7uUoj0C7B1WBMuw9MdVr",
//     "payment_status": "paid",
//     "amount_total": 45,
//     "customer": "cus_PBF2WtLibsGjDM",
//     "date": 1702823694
// },

//Next part displays the user's order history, by using the retrieveSessions controller. 
async function getOrderHistory() {
const orderHistory = await fetch('/orders/retrieveSessions', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
})
.then(response => response.json())
.then(data => {
    console.log('Session:', data);
    return data;
})
.catch((error) => {
    console.error('Error:', error);
});
//Loop through all sessionId's in the orderHistory array, and display the order details
for (let i = 0; i < orderHistory.length; i++) {
    const order = orderHistory[i];
    const id = order.id;
    const itemHistory = await fetch('/orders/items/' + id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        console.log('Items:', data);
        return data;
    })
    .catch((error) => {
        console.error('Error:', error);
    });
    //Define all the variables that will be used to display the order details
    const date = new Date(order.date * 1000);
    //Only display the date, not the time
    day = date.getDate();
    month = date.getMonth();
    year = date.getFullYear();
    dateNew = day + "/" + month + "/" + year;
    const paymentStatus = order.payment_status;
    //Display the order details in a table format
    const orderDisplay = document.getElementById("order-history")
    let table = document.createElement("table");
    let headerRow = document.createElement("tr");
        let headers = ["Date", "Payment Status", "Item", "Quantity"];
        headers.forEach(headerText => {
            let header = document.createElement("th");
            header.textContent = headerText;
            headerRow.appendChild(header);
    });
    table.appendChild(headerRow);
    let row = document.createElement("tr");
        row.appendChild(createCell("Date: " + dateNew));
        row.appendChild(createCell("Payment Status: " + paymentStatus));
        row.appendChild(createCell("")); // Empty cell for alignment
        row.appendChild(createCell("")); // Empty cell for alignment
        table.appendChild(row);

    // orderDisplay.appendChild(document.createElement("p")).innerHTML = "Date: " + dateNew;
    // orderDisplay.appendChild(document.createElement("p")).innerHTML = "Payment status: " + paymentStatus;
    for (let x = 0; x < itemHistory.length; x++) {
        const item = itemHistory[x].productName;
        const quantity = itemHistory[x].quantity;
        // orderDisplay.appendChild(document.createElement("p")).innerHTML = "Item: " + item;
        // orderDisplay.appendChild(document.createElement("p")).innerHTML = "Quantity: " + quantity;
    }
    itemHistory.forEach(item => {
        let row = document.createElement("tr");
        row.appendChild(createCell("")); // Empty cell for date
        row.appendChild(createCell("")); // Empty cell for payment status
        row.appendChild(createCell(item.productName));
        row.appendChild(createCell(item.quantity));
        table.appendChild(row);
    });
    orderDisplay.appendChild(table);
        function createCell(text) {
            let cell = document.createElement("td");
            cell.textContent = text;
            return cell;
        }
}

}
getOrderHistory();