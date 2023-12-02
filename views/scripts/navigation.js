
function getCookie(name) {
        // Split cookie string and get all individual name=value pairs in an array. Later we will specifically search for the value of userAuth
        //'(^|;)\\s*' makes sure that we only get the value of userAuth and not the value of another cookie that contains userAuth in its name, since 
        // the ^ character means that the match has to be at the beginning of the string, and the ; character means that the match has to be followed by a semicolon. 
        // these are seperated by the |. \\s* means that there can be any number of spaces between the ; and the name=value pair
        // [^;]+ means that the value can be any character except a semicolon, and that there can be any number of these characters, so the userid can be any length 
        //we use pop() to return the last element of the array, which is the value of userAuth, since the format of the cookie is eg. userAuth=31
        // if the cookie doesn't exist, return an empty string 
        //lang forklaring men jeg forstod den ikke selv haha 

        const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
        // If the cookie exists, return the value of userAuth
        return cookieValue ? cookieValue.pop() : '';
    }


        function deleteCookie(name) {
        // Set the cookie to expire by setting the expiration date to a date in the past
         document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    const userAuth = getCookie('userAuth');
   

    async function getUser(userAuth) {
        try {
            const response = await fetch('/users/f/' + userAuth, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                throw new Error(response.statusText);
            }
        } catch (error) {
            console.error(error);
            return null; // Return null in case of an error
        }
    }
    
    async function updateUserNav() {
        const userAuth = getCookie('userAuth');

        const user = await getUser(userAuth);
        if (user) {
            // User is logged in
            // Change the log in button to a log out button
            //Change the create user link to the user's name
            //Add cart button
            const loginLink = document.getElementById("open-popup");
            if (loginLink) {
              loginLink.innerHTML = 'Log out';
                loginLink.addEventListener('click', function (event) {
                    event.preventDefault();
                    deleteCookie('userAuth');
                    window.location.href = '/';
                });
                createUserLink = document.getElementById("createuser");
                const userName = user.name;
                createUserLink.innerHTML =  userName;
                createUserLink.href = '/account.html';

                const cartBtn = document.getElementById("cart-button")
                cartBtn.href = "../cart.html";
                cartBtn.innerHTML = "Cart";

            

            }
       
          }
           else {
            // User is not logged in
            // Hide or remove the Log out button
            const logoutLink = document.getElementById("open-popup");
            if (logoutLink) {
                logoutLink.innerHTML = 'Login';
                logoutLink.addEventListener('click', function (event) {
                    event.preventDefault();
                    const loginPopup = document.getElementById("login-popup");
                    if (loginPopup) {
                    loginPopup.style.display = "block";
                    }
                });

                createUserLink = document.getElementById("createuser");
                createUserLink.innerHTML = 'Create User';
                createUserLink.href = '/create-user.html';
                

            }
            // Add the Login link
            // const nav = document.querySelector('nav');
            // const loginLink = '<a href="#" id="open-popup">Login</a>';
            // nav.insertAdjacentHTML('beforeend', loginLink);

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
            const createUserLink = '<a id="createuserlink" href="/create-user.html">Create User</a>';
            nav.insertAdjacentHTML('beforeend', createUserLink);
        }
        
    }
    
    // Call the function to update the navigation based on the user's authentication status
    updateUserNav();
