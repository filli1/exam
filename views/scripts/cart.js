document.addEventListener('DOMContentLoaded', () => {
   displayCart();
   // Call checkout function when the checkout button is clicked
    document.querySelector('.checkout-button').addEventListener('click', checkout);
});


//Cart should only be displayed if user is logged in
//Check if user is logged in by checking if cookie exists

// async function getUser() {
//     try {
//         const response = await fetch("/users/checkWithCookie", {
//             method: "GET",
//             headers: {
//             "Content-Type": "application/json",
//             },
//         });

//         if (response.ok) {
//             const data = await response.json();
//             return data;
//         } else {
//             throw new Error(response.statusText);
//         }
//         } catch (error) {
//         //console.error(error);
//         return null; // Return null in case of an error
//         }
// }

function getCart() {
    var cart = sessionStorage.getItem('cart');
    return cart ? JSON.parse(cart) : {};
}

let lineItems = [];

async function displayCart() {
    const cart = getCart();
    const numberOfDistinctProducts = Object.keys(cart).length;
    const cartOverview = document.getElementById('cart-overview');

    const user = await getUser()
    console.log(user)

    // If the cart is empty, display a message and return
    if (numberOfDistinctProducts === 0) {
        const p = document.createElement('p');
        p.textContent = 'Your cart is empty.';
        cartOverview.appendChild(p);

        checkoutButton = document.querySelector('.checkout-button');
        checkoutButton.style.display = 'none';
        return;
    } else {

        if (!user) {
            checkoutButton = document.querySelector('.checkout-button');
            checkoutButton.removeEventListener('click', checkout);
            checkoutButton.style.backgroundColor = 'grey';
            checkoutButton.style.cursor = 'not-allowed';
            checkoutButton.style.color = 'black';

            // Create a tooltip message
            const tooltip = document.createElement('span');
            tooltip.className = 'tooltip';
            tooltip.textContent = 'Create a user or log in to continue to checkout.';
            checkoutButton.appendChild(tooltip);
            checkoutButton.addEventListener("mouseover", showTooltip);
            checkoutButton.addEventListener("mouseout", hideTooltip);
            
        }

        // Create a table element
        const cartTable = document.createElement('table');
        cartOverview.appendChild(cartTable);

        // Optionally, create and append a header row to the table
        const headerRow = document.createElement('tr');
        ['Image', 'Name', 'Quantity', 'Price', 'Total',''].forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            headerRow.appendChild(th);
        });
        cartTable.appendChild(headerRow);

        // Append product rows to the table
        Object.keys(cart).forEach(productId => {
            fetch(`/products/${productId}`)
                .then(response => response.json())
                .then(product => {
                    lineItems.push({
                        price: product.stripe_price_id,
                        quantity: cart[productId].quantity,
                    })
                    const productElement = createProductElement(product, cart[productId].quantity);
                    cartTable.appendChild(productElement);
                })
                .catch(error => console.error('Error fetching product:', error));
        });


        // Display cart total
        const totalDisplay = document.createElement('p');
        cartOverview.appendChild(totalDisplay);
        updateCartTotal();
    }
}

function showTooltip() {
    const tooltip = document.querySelector(".tooltip");
    tooltip.style.display = "block";
}
function hideTooltip() {
    const tooltip = document.querySelector(".tooltip");
    tooltip.style.display = "none";
}

//This takes the customer to the Stripe checkout page via the api endpoint on the server
function checkout() {
    const cartData = lineItems;
    
    fetch('/orders/create-checkout-session', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cartData)
    })
    .then(response => response.json())
    .then(data => {
        // Redirect to the Stripe checkout page
        window.location.href = data.url;
    })
    .catch(error => console.error('Error:', error));
}


function createProductElement(product, quantity) {
    // Create a table row
    const tr = document.createElement('tr');
    tr.setAttribute('id', `row-${product.id}`);
    
    // Create and append the product image cell
    const imageCell = document.createElement('td');
    const image = document.createElement('img');
    image.src = product.image;
    image.alt = product.name;
    image.style.width = '50px'; // Adjust size as needed
    image.style.height = 'auto';
    imageCell.appendChild(image);
    tr.appendChild(imageCell);

    // Create and append the product name cell
    const nameCell = document.createElement('td');
    nameCell.textContent = product.name;
    tr.appendChild(nameCell);

    // Create and append the quantity cell
    const quantityCell = document.createElement('td');
    const quantityDisplay = document.createElement('span');
    quantityDisplay.textContent = quantity;
    quantityDisplay.setAttribute('id', `quantity-${product.id}`);
    quantityCell.appendChild(quantityDisplay);
    

    // Plus Button
    const plusBtn = document.createElement('button');
    plusBtn.textContent = '+';
    plusBtn.onclick = () => adjustQuantity(product.id, 1);
    quantityCell.appendChild(plusBtn);

    // Minus Button
    const minusBtn = document.createElement('button');
    minusBtn.textContent = '-';
    minusBtn.onclick = () => adjustQuantity(product.id, -1);
    quantityCell.appendChild(minusBtn);
    tr.appendChild(quantityCell);

     // Create and append the price cell
     const priceCell = document.createElement('td');
     priceCell.textContent = `${product.price.toFixed(2)} kr.`;
     tr.appendChild(priceCell);
 
     // Create and append the total price cell
     const totalPriceCell = document.createElement('td');
     totalPriceCell.setAttribute('id', `total-price-${product.id}`);
     totalPriceCell.textContent = `${(product.price * quantity).toFixed(2)} kr.`;
     tr.appendChild(totalPriceCell);

    // Delete Button
    const deleteCell = document.createElement('td');
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => deleteItem(product.id);
    deleteCell.appendChild(deleteBtn);
    tr.appendChild(deleteCell);

    return tr;
}

function adjustQuantity(productId, adjustment) {
    const cart = getCart();
    if (cart[productId]) {
        cart[productId].quantity += adjustment;

        if (cart[productId].quantity <= 0) {
            delete cart[productId];
            document.getElementById(`row-${productId}`).remove(); // Remove the row for this product
        } else {
            const quantityDisplay = document.getElementById(`quantity-${productId}`);
            if (quantityDisplay) {
                quantityDisplay.textContent = cart[productId].quantity; // Update the quantity in the DOM
            }
            const totalPriceDisplay = document.getElementById(`total-price-${productId}`);
            if (totalPriceDisplay) {
                totalPriceDisplay.textContent = `${(cart[productId].price * cart[productId].quantity).toFixed(2)} kr.`; // Update the total price in the DOM
            }
        }

        sessionStorage.setItem('cart', JSON.stringify(cart));
        updateCartTotal(); // Update the cart total
        updateCartCountDisplay(); // Update the cart count
    }
}


function deleteItem(productId) {
    const cart = getCart();
    delete cart[productId];
    sessionStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

function updateCartDisplay() {
    document.getElementById('cart-overview').innerHTML = ''; // Clear existing content
    displayCart();
    updateCartCountDisplay(); // Update the cart count
}

function updateLineItems() {
    const cart = getCart();
    lineItems = Object.keys(cart).map(productId => ({
        price: cart[productId].stripe_price_id,
        quantity: cart[productId].quantity,
    }));
}

function updateCartTotal() {
    const cart = getCart();
    let total = 0;
    Object.values(cart).forEach(item => {
        total += item.price * item.quantity;
    });

    const totalDisplay = document.getElementById('cart-total');
    if (totalDisplay) {
        totalDisplay.textContent = `Total: ${total.toFixed(2)} kr.`;
    } else {
        const newTotalDisplay = document.createElement('p');
        newTotalDisplay.setAttribute('id', 'cart-total');
        newTotalDisplay.textContent = `Total: ${total.toFixed(2)} kr.`;
        document.getElementById('cart-overview').appendChild(newTotalDisplay);
    }
}
