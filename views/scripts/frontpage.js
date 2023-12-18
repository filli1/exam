document.addEventListener('DOMContentLoaded', async function() {
    //Fetch the products from the server
    const products = await fetch('/products/all')
    .then(response => response.json())
    //For the first 3 products in the array create a product element on the frontpage
    Object.keys(products).slice(0, 3).forEach(key => {
        addProductElement(products[key]);
    });
    
})

//ADD PRODUCT HTML
function addProductElement(product) {
    // Create a new div element
    var newDiv = document.createElement("div");
    newDiv.id = `product${product.id}`;
    newDiv.className = "product-frontpage";

    // Create the inner HTML for the new div (excluding the button)
    var innerHTML = `
        <img src="${product.image}" alt="${product.name}" />
        <div class="product-desc">
            <h1>${product.name}</h1>
            <p>${product.description}</p>
            <p>${product.price.toFixed(2)} kr.</p>
        </div>
    `;

    // Set the inner HTML of the new div
    newDiv.innerHTML = innerHTML;

    // Create the button element
    var button = document.createElement("button");
    button.className = "add-to-cart-btn";
    button.textContent = "Add to Cart";
    
    // Attach an event listener to the button
    button.addEventListener("click", function() {
        addToCartFunction(product);
    });

    // Append the button to the new div
    newDiv.querySelector('.product-desc').appendChild(button);

    // Append the new div to the div with id 'frontpage-productview'
    var frontPageProductView = document.getElementById("frontpage-productview");
    if (frontPageProductView) {
        frontPageProductView.appendChild(newDiv);
    } else {
        console.error("Element with id 'frontpage-productview' not found.");
    }
}