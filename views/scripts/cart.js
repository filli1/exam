document.addEventListener('DOMContentLoaded', () => {
   displayCart() ;
});


//Cart should only be displayed if user is logged in
//Check if user is logged in by checking if cookie exists

function checkCookie() {
    const userAuth = getCookie('userAuth');
    if (userAuth) {
        return true;
    }
    else {
        return false;
    }
}

function getCart() {
    var cart = sessionStorage.getItem('cart');
    return cart ? JSON.parse(cart) : {};
}

function displayCart() {
    const cart = getCart();
    const cartOverview = document.getElementById('cart-overview');

    // Create a table element
    const cartTable = document.createElement('table');
    cartOverview.appendChild(cartTable);

    // Optionally, create and append a header row to the table
    const headerRow = document.createElement('tr');
    ['Image', 'Name', 'Quantity', 'Price', 'Total'].forEach(text => {
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
                const productElement = createProductElement(product, cart[productId].quantity);
                cartTable.appendChild(productElement);
            })
            .catch(error => console.error('Error fetching product:', error));
    });
}

function createProductElement(product, quantity) {
    // Create a table row
    const tr = document.createElement('tr');
    
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
    quantityCell.textContent = quantity;
    tr.appendChild(quantityCell);

    // Create and append the price cell
    const priceCell = document.createElement('td');
    priceCell.textContent = `${product.price.toFixed(2)} kr.`;
    tr.appendChild(priceCell);

    // Create and append the total price cell
    const totalPriceCell = document.createElement('td');
    totalPriceCell.textContent = `${(product.price * quantity).toFixed(2)} kr.`;
    tr.appendChild(totalPriceCell);

    return tr;
}
