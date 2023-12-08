let balance = 0.00;
let isAdmin = false;

const adminUrl = "https://localhost:7051/api/Admin";
const productUrl = "https://localhost:7051/api/Product";
const vendingmachineUrl = "https://localhost:7051/api/VendingMachine";
const purchaseeventUrl = "https://localhost:7051/api/PurchaseEvent";
 
let adminData = [];
let myProduct = [];
let myPurchaseEvent = [];
 
async function handleOnLoad()
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
    <label for="vendingMachine">Select Vending Machine:</label>
    <select id="vendingMachine" class="form-select" onchange="loadProductInfo()">
    `;
 
    document.getElementById('app').innerHTML = html;
    const vendingMachines = await fetchVendingMachine();
   
    // Dynamically populate the select element with vending machine options
    const vendingMachineSelect = document.getElementById("vendingMachine");
    vendingMachines.forEach(machine => {
        const option = document.createElement("option");
        option.value = machine.vendID;
        option.textContent = "ID: " + machine.vendID + " Address: " + machine.address;
        vendingMachineSelect.appendChild(option);
    });
    loadProductInfo();
   
}
 
async function loadProductInfo() {
    const vendIDString = document.getElementById('vendingMachine').value;
    const vendID = parseInt(vendIDString, 10);
    try {
        const products = await fetchProducts();
 
        const productContainer = document.getElementById("product-container");
        productContainer.innerHTML = ""; // Clear previous content
 
        let rowDiv; // Variable to hold the current row
 
        console.log('my products', products)
 
        products.forEach((product, index) => {
            let checkVend = false;
            if(product.vendID == vendID)
            {
                checkVend = true;
            }
            if (product.quantity !== 0 && checkVend == true) {
                // Create a new row if the current row is not present
                if (!rowDiv) {
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
                    <button class="btn btn-primary" onclick="purchaseItemDigital('${product.productID}')">Buy with Credit</button>
                    <button class="btn btn-primary" onclick="purchaseItemCash('${product.productID}')">Buy with Cash</button>
                `;
 
                colDiv.appendChild(itemDiv);
                rowDiv.appendChild(colDiv);
 
                // Reset the rowDiv after every third product
                if ((index + 1) % 3 === 0) {
                    rowDiv = null;
                }
            }
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
        const vendingMachines = await response.json();
        return vendingMachines;
    } catch (error) {
        console.error('Error fetching products by vendID:', error);
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
                <button class="btn btn-primary" onclick="purchaseItem(${product.ProductID}${product.VendID})">Buy</button>
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
 
// Function to purchase an item
async function purchaseItemCash(productID, vendID) {
    //const selectedItem = document.getElementById("item-select").value;
 
    try {
        // Fetch product details
        const response = await fetch(productUrl + "/" + productID);
        const product = await response.json();
        const response2 = await fetch(productUrl + "/" + vendID);
        const vendingMachine = await response2.json();
        let change = 0.0
        change = balance - product.cost
        if (balance >= product.cost && change <= vendingMachine.moneyInMachine) {
            // Deduct the cost from the balance
            balance = 0;
            vendingMachine.moneyInMachine += product.cost;
            vendingMachine.moneyInMachine -= change;
            product.numSold++;
            product.quantity--;
 
            // Update the UI
            updateBalanceDisplay();
            hideErrorMessage();
 
            // Display a success message
            alert(`You have successfully purchased ${product.name}`);

            PurchaseEventAdd(product);
            markProductAsSold(product);
            VendEditMoney(vendingMachine, product);
 
        } else {
            // Display an error message if the balance is insufficient
            displayErrorMessage("You don't have enough money to purchase this item.");
        }
    } catch (error) {
        console.error('Error purchasing item:', error);
    }
}

async function purchaseItemDigital(productID, vendID) {
    //const selectedItem = document.getElementById("item-select").value;
 
    try {
        // Fetch product details
        const response = await fetch(productUrl + "/" + productID);
        const product = await response.json();
        if (balance >= product.cost) {
            // Deduct the cost from the balance
            product.numSold++;
            product.quantity--;
 
            // Update the UI
            updateBalanceDisplay();
            hideErrorMessage();
 
            // Display a success message
            alert(`You have successfully purchased ${product.name}`);

            PurchaseEventAdd(product);
            markProductAsSold(product);
 
        } else {
            // Display an error message if the balance is insufficient
            displayErrorMessage("You don't have enough money to purchase this item.");
        }
    } catch (error) {
        console.error('Error purchasing item:', error);
    }
}
 
async function PurchaseEventAdd(product) {
    const tempDate = new Date();
    let tempString = ""
    tempString = tempDate.getFullYear() + "-" + tempDate.getDate() + "-" + tempDate.getMonth() + " " + tempDate.getHours() + ":" + tempDate.getMinutes() + ":" + tempDate.getSeconds()
    let purchaseEvent = {
        Date: tempString,
        Deleted: false,
        VendID: product.vendID,
        ProductID: product.productID
    };
    console.log("What product am I adding?", purchaseEvent);
    console.log(purchaseEvent.Date)

    await fetch(purchaseeventUrl, {
        method: "POST",
        body: JSON.stringify(purchaseEvent),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });
 
}

async function VendEditMoney(vendingMachine, product) {
    vendingMachine.moneyInMachine -= product.cost;
    let newVendingMachine = {
        VendID: vendingMachine.vendID,
        Address: vendingMachine.address,
        ZipCode: vendingMachine.zipCode,
        Deleted: vendingMachine.deleted,
        AdminID: vendingMachine.adminID,
        MoneyInMachine: vendingMachine.moneyInMachine
 
    };
    await SaveVendingMachine(newVendingMachine)

    handleOnLoad()
 
}

async function SaveVendingMachine(vendingMachine) {
    if (vendingMachine.VendID) {
        // If exercise has an ID, it already exists in the API, update it
        const updateUrl = `${vendingmachineUrl}/${vendingMachine.VendID}`;
        await fetch(updateUrl, {
            method: "PUT", // Use PUT for updating
            body: JSON.stringify(vendingMachine),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
    } else {
        // If exercise has no ID, it's a new exercise, create it
        await fetch(vendingmachineUrl, {
            method: "POST",
            body: JSON.stringify(vendingMachine),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
    }
}

// Function to mark a product as sold (need to implement this on the admin page)
async function markProductAsSold(product) {
    let newProduct = {
        "productID": product.productID,
        "name": product.name,
        "quantity": product.quantity,
        "cost": product.cost,
        "numSold": product.numSold,
        "deleted": product.delted,
        "vendID": product.vendID,
        "imageURL": product.imageURL
      }
    try {
        const response = await fetch(productUrl + "/" + product.productID, {
            method: "PUT",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProduct)
        });
        console.log("Sold")
        if (!response.ok) {
            throw new Error(`Failed to mark product as sold. Status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error marking product as sold:', error);
        // Handle errors, display an error message, etc.
    }
    loadProductInfo();
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