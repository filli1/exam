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

    animateProductToCart(product.id);
}

function animateProductToCart(productId) {
    var productElement = document.getElementById(`product${productId}`);
    var productImg = productElement.querySelector('img');
    var cartIcon = document.getElementById("cart-button");

    if (productImg && cartIcon) {
        var clone = productImg.cloneNode(true);
        var position = productImg.getBoundingClientRect(); // Position relative to viewport
        var cartPosition = cartIcon.getBoundingClientRect(); // Position relative to viewport

        // Clone's starting position (relative to viewport)
        clone.style.position = 'fixed';
        clone.style.left = `${position.left}px`;
        clone.style.top = `${position.top}px`;
        clone.style.width = `${position.width}px`;
        clone.style.height = `${position.height}px`;
        clone.style.zIndex = 1001; // Above the sticky navbar

        document.body.appendChild(clone);

        // Calculate the translation to center the image in the middle of the cart icon
        var translateX = cartPosition.left - position.left + (cartPosition.width / 2) - (position.width / 2);
        var translateY = cartPosition.top - position.top + (cartPosition.height / 2) - (position.height / 2);


        // Animate clone
        clone.animate([
            { transform: 'translate(0, 0) scale(1)' },
            { transform: `translate(${translateX}px, ${translateY}px) scale(0.3)`, opacity: 0 }
        ], {
            duration: 1000,
            easing: 'ease-in'
        }).finished.then(() => {
            clone.remove();
            jiggleCart();
        });
    }

    updateCartCountDisplay();
}

function jiggleCart() {
    var cartIcon = document.getElementById("cart-button");
    if (cartIcon) {
        cartIcon.classList.add('jiggle');

        // Remove the class after the animation completes
        setTimeout(() => {
            cartIcon.classList.remove('jiggle');
        }, 500); // Assuming jiggle animation duration is 500ms
    }
}


// Update cart count display on page load
document.addEventListener('DOMContentLoaded', updateCartCountDisplay);
