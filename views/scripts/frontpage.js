document.addEventListener('DOMContentLoaded', async function() {
    //Fetch the products from the server
    const products = await fetch('/products/all')
    .then(response => response.json())
    //For each product in the array create a product element on the frontpage
    for(product in products) {
        addProductElement(products[product]);
    }
    
})

//ADD PRODUCT HTML
function addProductElement(product) {
    // Create a new div element
    var newDiv = document.createElement("div");
    newDiv.id = `product${product.id}`;
    newDiv.className = "product-frontpage";

    // Create the inner HTML for the new div
    var innerHTML = `
        <img src="${product.image}" alt="${product.name}" />
        <div class="product-desc">
            <h1>${product.name}</h1>
            <p>Joe's Classic Bread, Vegan Pesto, Avocado, Chicken, Tomato</p>
            <p>${product.price.toFixed(2)} kr.</p>
        </div>
    `;

    // Set the inner HTML of the new div
    newDiv.innerHTML = innerHTML;

    // Append the new div to the div with id 'frontpage-productview'
    var frontPageProductView = document.getElementById("frontpage-productview");
    if(frontPageProductView) {
        frontPageProductView.appendChild(newDiv);
    } else {
        console.error("Element with id 'frontpage-productview' not found.");
    }
}