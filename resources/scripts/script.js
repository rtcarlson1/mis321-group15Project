let balance = 0.00;
let isAdmin = false;

const adminUrl = "https://localhost:7051/api/Admin";
const productUrl = "https://localhost:7051/api/Product";
const vendingmachineUrl = "https://localhost:7051/api/VendingMachine";
const purchaseeventUrl = "https://localhost:7051/api/PurchaseEvent";
 
let adminData = [];
let myProduct = [];
let myPurchaseEvent = [];
 
function handleOnLoad()
{
    let html=`
    <header data-bs-theme="dark">
  <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark custom-navbar">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Title Town Vending</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarCollapse">
        <ul class="navbar-nav me-auto mb-2 mb-md-0">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="./index.html">Home</a>
          </li>
          <li class="admin-item" id="admin-link" style="display: none;">
            <a class="nav-link" href="./admin.html">Admin</a>
          </li>
        </ul>
        <button class="btn btn-secondary" type="button" data-bs-toggle="modal" data-bs-target="#adminLoginModal">
            Admin Login
        </button>
      </div>
    </div>
  </nav>
</header>
 
<!-- Admin Login -->
<div class="modal fade" id="adminLoginModal" tabindex="-1" aria-labelledby="adminLoginModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="adminLoginModalLabel">Admin Login</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form>
                    <div class="mb-3">
                        <label for="adminUsername" class="form-label">Username</label>
                        <input type="text" class="form-control" id="adminUsername">
                    </div>
                    <div class="mb-3">
                        <label for="adminPassword" class="form-label">Password</label>
                        <input type="password" class="form-control" id="adminPassword">
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" onclick="adminLogin()">Login</button>
            </div>
        </div>
    </div>
</div>
<br>
<br>
<br>
    <div class="container text-center" id="product-container">
            
    </div>
    <div class="container text-center" id="purchase-container"> 
        <div class="row">
            <div class="col-4">
                <div id="money-display">
                    <p>Your Balance: $0.00</p>
                </div>
                <div id="error-message" class="alert alert-danger" style="display: none;"></div>
                <!-- Add a form to select payment method -->
                <!-- <form>
                    <select id="payment-method" class="form-select">
                        <option>Please select a payment method:</option>
                        <option value="digital">Digital Payment</option>
                        <option value="cash">Cash Payment</option>
                    </select>
                </form> -->
                <!-- Add a div to display the input based on the selected method -->
                <!-- <div id="payment-input" style="display: none;">
                    <div class="mb-3">
                        <input type="number" id="digital-amount" class="form-control" placeholder="Enter digital payment amount">
                        <input type="number" id="cash-amount" class="form-control" placeholder="Enter cash payment amount" style="display: none;">
                    </div>
                </div> -->
                <button class="btn btn-primary" type="button" onclick="addMoney()">Add Money</button>
                <input type="number" id="money-input" class="form-control" placeholder="Enter amount">
            </div>
        </div>
    </div>
    `;
 
    document.getElementById('app').innerHTML = html;
    loadProductInfo();
   
}
 
async function loadProductInfo() {
    try {
        const products = await fetchProducts();

        const productContainer = document.getElementById("product-container");
        productContainer.innerHTML = ""; // Clear previous content

        let rowDiv; // Variable to hold the current row

        console.log('my products', products)

        products.forEach((product, index) => {
            // Create a new row for every third product
            if (index % 3 === 0) {
                rowDiv = document.createElement("div");
                rowDiv.classList.add("row");
                productContainer.appendChild(rowDiv);
            }

            // Create the item div for each product
            const colDiv = document.createElement("div");
            colDiv.classList.add("col-4");

            const itemDiv = document.createElement("div");
            itemDiv.classList.add("item");

            itemDiv.innerHTML = `
                <img src="${product.imageURL}" alt="${product.name}">
                <p>Name: ${product.name}</p>
                <p>Cost: $${product.cost.toFixed(2)}</p>
                <button class="btn btn-primary" onclick="purchaseItem('${product.productID}')">Buy</button>
            `;

            colDiv.appendChild(itemDiv);
            rowDiv.appendChild(colDiv);
        });

    } catch (error) {
        console.error('Error fetching products:', error);
    }
}


async function fetchProducts() {
    try {
        const response = await fetch(productUrl);
        const Products = await response.json();
        return Products;
    } catch (error) {
        console.error('Error fetching Products:', error);
    }
}

async function fetchAdmins(email, password) {
    try {
        const response = await fetch(`${adminUrl}?email=${email}&password=${password}`);
        const admins = await response.json();
        return admins;
    } catch (error) {
        console.error('Error fetching admins:', error);
        throw error; // Re-throw the error to handle it in the calling function
    }
}


async function fetchPurchaseEvents() {
    try {
        const response = await fetch(purchaseeventUrl);
        const PurchaseEvents = await response.json();
        return PurchaseEvents;
    } catch (error) {
        console.error('Error fetching Purchase Events:', error);
    }
}

async function fetchVendingMachine() {
    try {
        const response = await fetch(vendingmachineUrl);
        const VendingMachines = await response.json();
        return VendingMachines;
    } catch (error) {
        console.error('Error fetching Vending Machines:', error);
    }
}


document.addEventListener("DOMContentLoaded", function() {
    if(isAdmin){
        const yesAdmin = true
        const adminLink = document.getElementById("admin-link");
        adminLink.style.display = yesAdmin ? "block" : "none";
    };
    
});



async function adminLogin() {
    const email = document.getElementById("adminUsername").value;
    const password = document.getElementById("adminPassword").value;

    try {
        const adminData = await fetchAdmins(email, password);
        console.log('My admins', adminData);

        if (adminData.length > 0) {
            const isAdminMatch = adminData.some(admin => admin.email === email && admin.password === password);

            if (isAdminMatch) {
                isAdmin = true;
                localStorage.setItem("adminLoggedIn", "true");
                alert("Admin login successful!");

                const modal = document.getElementById("adminLoginModal");
                modal.classList.remove("show");
                modal.style.display = "none";
                document.body.classList.remove("modal-open");

                // Remove the modal backdrop
                const modalBackdrop = document.querySelector(".modal-backdrop");
                if (modalBackdrop) {
                    modalBackdrop.parentElement.removeChild(modalBackdrop);
                }
                document.getElementById("admin-link").style.display = "block";
            } else {
                alert("Invalid credentials. Please try again.");
            }
        } else {
            alert("Invalid credentials. Please try again.");
        }
    } catch (error) {
        console.error('Error during admin login:', error);
        alert("Error during admin login. Please try again later.");
    }
}

 
// Function to fetch products from the API and dynamically generate HTML elements
async function displayProducts() {
    try {
        const response = await fetch(productUrl);
        const products = await response.json();
 
        const productContainer = document.getElementById("product-container");
 
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
// async function fetchProductDetails(productID) {
//     try {
//         const response = await fetch(productUrl + "${productID}");
//         const product = await response.json();
 
//         console.log('Product Details:', product);
//     } catch (error) {
//         console.error('Error fetching product details:', error);
//     }
// }


//-----------------------------------------------What we are working on now--------------------------------------
 
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
 
 
function updateBalanceDisplay() {
    const moneyDisplay = document.getElementById("money-display");
    moneyDisplay.innerHTML = `<p>Your Balance: $${balance.toFixed(2)}</p>`;
}