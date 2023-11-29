function getCart() {
    var cart = sessionStorage.getItem('cart');
    if (cart === null) {
        return {};
    } else {
        return JSON.parse(cart);
    }
}

function getCartCount() {
    // Retrieve the cart count from session storage or set it to 0 if it doesn't exist
    var cartCount = sessionStorage.getItem('cartCount');
    if (cartCount === null) {
        cartCount = 0;
        sessionStorage.setItem('cartCount', cartCount);
    } else {
        cartCount = parseInt(cartCount, 10); // Convert the retrieved string to an integer
    }
    return cartCount;
}

function updateCartCountDisplay() {
    var cart = getCart();
    var totalCount = 0;
    for (var id in cart) {
        totalCount += cart[id].quantity;
    }

    var cartCountElement = document.getElementById("cart-count");
    if (cartCountElement) {
        cartCountElement.textContent = totalCount;
    } else {
        console.error("Cart count element not found.");
    }
}


function addToCartFunction(product) {
    var cart = getCart();
    
    if (cart[product.id]) {
        cart[product.id].quantity += 1; // Increase quantity if product already exists
    } else {
        cart[product.id] = { quantity: 1, name: product.name, price: product.price }; // Add new product
    }

    sessionStorage.setItem('cart', JSON.stringify(cart)); // Store updated cart

    updateCartCountDisplay();
}

// Update cart count display on page load
document.addEventListener('DOMContentLoaded', updateCartCountDisplay);
