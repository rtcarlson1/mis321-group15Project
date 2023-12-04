let balance = 0.00;
let isAdmin = false;
const productUrl = "https://localhost:7051/api/Product";
const adminUrl = "https://localhost:7051/api/Admin";
 
// hides the Admin link on startup so you cant click unless logged in
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("admin-link").style.display = "none";
});
 
// change so that it can use admin login from database
// async function adminLogin() {
//     const email = document.getElementById("adminUsername").value;
//     const password = document.getElementById("adminPassword").value;
 
//     const loginData = {
//         email: email,
//         password: password
//     };
 
//     try {
//         const response = await fetch(adminUrl, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(loginData),
//         });
 
//         if (response.ok) {
//             const result = await response.json();
 
//             isAdmin = true;
//             localStorage.setItem("adminLoggedIn", "true");
//             alert("Admin login successful!");
 
//             // Close the modal and remove modal backdrop
//             const modal = document.getElementById("adminLoginModal");
//             modal.classList.remove("show");
//             modal.style.display = "none";
//             document.body.classList.remove("modal-open");
 
//             // Remove the modal backdrop
//             const modalBackdrop = document.querySelector(".modal-backdrop");
//             if (modalBackdrop) {
//                 modalBackdrop.parentElement.removeChild(modalBackdrop);
//             }
 
//             // Show the Admin link after a successful admin login
//             document.getElementById("admin-link").style.display = "block";
//         } else {
//             alert("Invalid credentials. Please try again.");
//         }
//     } catch (error) {
//         console.error('Error during admin login:', error);
//         alert('An error occurred during admin login. Please try again later.');
//     }
// }
 
function adminLogin() {
   
    const username = document.getElementById("adminUsername").value;
    const password = document.getElementById("adminPassword").value;
 
    if (username === "admin" && password === "adminpassword") {
        isAdmin = true;
        localStorage.setItem("adminLoggedIn", "true");
        alert("Admin login successful!");
 
        // Close the modal and remove modal backdrop
        const modal = document.getElementById("adminLoginModal");
        modal.classList.remove("show");
        modal.style.display = "none";
        document.body.classList.remove("modal-open");
       
        // Remove the modal backdrop
        const modalBackdrop = document.querySelector(".modal-backdrop");
        if (modalBackdrop) {
            modalBackdrop.parentElement.removeChild(modalBackdrop);
        }
 
        // Show the Admin link after a successful admin login
        document.getElementById("admin-link").style.display = "block";
    } else {
        alert("Invalid credentials. Please try again.");
    }
}
 
// Function to fetch products from the API and dynamically generate HTML elements
async function fetchProducts() {
    try {
        const response = await fetch(productUrl);
        const products = await response.json();
 
        // Reference the product container
        const productContainer = document.getElementById("product-container");
 
        // Loop through each product and create HTML elements
        products.forEach(product => {
            const colDiv = document.createElement("div");
            colDiv.classList.add("col-4");
 
            const itemDiv = document.createElement("div");
            itemDiv.classList.add("item");
 
            itemDiv.innerHTML = `
                <img src="${product.ImageURL}" alt="${product.Name}">
                <p>Name: ${product.Name}</p>
                <button class="btn btn-primary" onclick="purchaseItem('${product.Code}')">Buy</button>
            `;
 
            colDiv.appendChild(itemDiv);
            productContainer.appendChild(colDiv);
        });
 
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}
 
 
// Function to fetch product details by ID from the API
async function fetchProductDetails(productID) {
    try {
        const response = await fetch(productUrl + "${productID}");
        const product = await response.json();
 
        console.log('Product Details:', product);
    } catch (error) {
        console.error('Error fetching product details:', error);
    }
}
 
// Function to add money to the balance
async function addMoney() {
    const moneyInput = parseFloat(document.getElementById("money-input").value);
    if (!isNaN(moneyInput) && moneyInput > 0) {
        balance += moneyInput;
        updateBalanceDisplay();
        hideErrorMessage();
    } else {
        displayErrorMessage("Please enter a valid amount.");
    }
}

async function buyDorito()
{
    balance -= 2.50;
    updateBalanceDisplay();
    alert(`You have successfully purchased Doritos`);
}

async function buyReeces()
{
    balance -= 3.50;
    updateBalanceDisplay();
    alert(`You have successfully purchased Reese's Pieces`);
}
 
// Function to purchase an item
async function purchaseItem(productId) {
    //const selectedItem = document.getElementById("item-select").value;
 
    try {
        // Fetch product details
        const response = await fetch(productUrl + "/" + productId);
        const product = await response.json();
 
        if (balance >= product.Cost) {
            // Deduct the cost from the balance
            balance -= product.Cost;
 
            // Update the UI
            updateBalanceDisplay();
            hideErrorMessage();
 
            // Display a success message
            alert(`You have successfully purchased ${product.Name}`);
 
            // Send a request to the backend to mark the product as sold or update inventory
            await markProductAsSold(product.ProductID);
        } else {
            // Display an error message if the balance is insufficient
            displayErrorMessage("You don't have enough money to purchase this item.");
        }
    } catch (error) {
        console.error('Error purchasing item:', error);
    }
}
 
// Function to mark a product as sold (need to implement this on the admin page)
async function markProductAsSold(productID) {
    try {
        const response = await fetch(productUrl + productID, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ Sold: true }),
        });
 
        if (!response.ok) {
            throw new Error(`Failed to mark product as sold. Status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error marking product as sold:', error);
        // Handle errors, display an error message, etc.
    }
}
 
function displayErrorMessage(message) {
    const errorMessage = document.getElementById("error-message");
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
}
 
function hideErrorMessage() {
    const errorMessage = document.getElementById("error-message");
    errorMessage.style.display = "none";
}
 
// change so that they get pulled from database
// function getItemPrice(itemCode) {
//     // Define item prices based on their codes
//     const itemPrices = {
//         "A1": 1.00,
//         "A2": 1.50,
//         "A3": 1.25,
//         "B1": 2.00,
//         "B2": 2.00,
//         "B3": 2.00,
//         // Can add more here
//     };
 
//     // Return the price for the given item code, or 0 if the item code is not found
//     return itemPrices[itemCode] || 0.00;
// }
 
function updateBalanceDisplay() {
    const moneyDisplay = document.getElementById("money-display");
    moneyDisplay.innerHTML = `<p>Your Balance: $${balance.toFixed(2)}</p>`;
}