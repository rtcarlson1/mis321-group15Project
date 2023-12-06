const adminUrl = "https://localhost:7051/api/Admin";
const productUrl = "https://localhost:7051/api/Product";
const vendingmachineUrl = "https://localhost:7051/api/VendingMachine";
const purchaseeventUrl = "https://localhost:7051/api/PurchaseEvent";
 
let myAdmin = [];
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
                <li class="nav-item">
                  <a class="nav-link" href="./admin.html">Admin</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        </header>
 
        <div class="container">
            <h1>Vending Machine Admin</h1>
 
            <label for="vendingMachine">Select Vending Machine:</label>
            <select id="vendingMachine" class="form-select" onchange="loadProductList()">
                <option value="1">Machine 1</option>
                <option value="2">Machine 2</option>
                <option value="3">Machine 3</option>
                <!-- Add more vending machines as needed -->
            </select>
 
            <div class="row">
                <div class="col-md-6">
                    <h2>Machine Inventory</h2>
                    <table class="table" id="machineInventoryTable">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Product ID</th>
                                <th>Quantity</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Product list will be dynamically populated here -->
                        </tbody>
                    </table>
                </div>
            </div>
            <br>
            <button onclick="loadProductForm()" class="btn btn-primary">Add Product</button>
            <br>
            <br>
            <div class="row">
                <div class="col-md-6">
                    <h2>Sold Inventory</h2>
                    <table class="table" id="soldInventoryTable">
                    <thead>
                    <tr>
                        <th>Product</th>
                        <th>Product ID</th>
                        <th>Date</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Product list will be dynamically populated here -->
                </tbody>
                    </table>
                </div>
            </div>
        </div>
        <br>
        <div id="tableBody"></div>
 
 
        <!-- Container for dynamically loaded form -->
        <div id="productFormContainer"></div>
    `;
 
    document.getElementById('app').innerHTML = html;
    loadProductList();
   
}
 
async function loadProductList() {
    const vendIDString = document.getElementById('vendingMachine').value;
    const vendID = parseInt(vendIDString, 10);
 
    const products = await fetchProducts();
    const purchaseEvents = await fetchPurchaseEvents();
    const vendingMachines = await fetchVendingMachine();
   
    const machineTableBody = document.querySelector("#machineInventoryTable tbody");
    machineTableBody.innerHTML = ""; // Clear previous content
 
 
    
    
        products.forEach(product => {
            if(product.deleted == false)
            {
                let checkVend = false;
                if(product.vendID == vendID)
                {
                    checkVend = true;
                }
                if(checkVend == true)
                {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${product.name}</td>
                        <td>${product.productID}</td>
                        <td id="inventory-${product.productID}">${product.quantity}</td>
                        <td>
                            <button class="btn btn-danger" onclick="removeFromInventory('${product.productID}')">Remove</button>
                        </td>
                    `;
                    machineTableBody.appendChild(row);
                    console.log(product.name)

                    const soldTableBody = document.querySelector("#soldInventoryTable tbody");
                    soldTableBody.innerHTML = ""; // Clear previous content
                    
                    purchaseEvents.forEach(purchaseEvent => {
                        const row = document.createElement("tr");
                        let tempName = '';
                        let checkVend = false;
                        if(purchaseEvent.vendID == vendID)
                        {
                            checkVend = true;
                        }
                        if(checkVend == true)
                        {
                            console.log('VendID:', purchaseEvent)
                            console.log('Product ID:', product.productID);
                            console.log('Purchase EventProductID:', purchaseEvent.productID);
                            
                            
                            tempName = product.name;
                            console.log('Selected Sold Dates:', purchaseEvent.date);
                            console.log('Temp Name:', tempName);
                            row.innerHTML = `
                                <td>${tempName}</td>
                                <td>${product.productID}</td>
                                <td>${purchaseEvent.date}</td>
                                <td>${purchaseEvent.time}</td>
                            `;
                            soldTableBody.appendChild(row);
                            
                            
                            // console.log('Product Name:', product.name);
                           
                        }
                    });
                }

            }
        });
    
}
 
 
async function fetchPurchaseEvents() {
    try {
        const response = await fetch(`https://localhost:7051/api/PurchaseEvent`);
        const soldDates = await response.json();
        return soldDates;
    } catch (error) {
        console.error('Error fetching sold dates by productID:', error);
    }
}
 
// Function to fetch sold products based on vendID
async function fetchProducts() {
    try {
        const response = await fetch(`https://localhost:7051/api/Product`);
        const soldProducts = await response.json();
        return soldProducts;
    } catch (error) {
        console.error('Error fetching sold products by vendID:', error);
    }
}
 
// Function to fetch products based on vendID
async function fetchVendingMachine() {
    try {
        const response = await fetch(`https://localhost:7051/api/VendingMachine`);
        const products = await response.json();
        return products;
    } catch (error) {
        console.error('Error fetching products by vendID:', error);
    }
}
 
 
// Function to load the product form dynamically
function loadProductForm() {
    let formHtml = `
        <form onsubmit="return false">
            <label for="name">Product:</label><br>
            <input type="text" id="name" name="name"><br>
            <label for="quantity">Quantity:</label><br>
            <input type="number" id="quantity" name="quantity"><br>
            <label for="cost">Cost:</label><br>
            <input type="number" id="cost" name="cost"><br>
            <label for="vendid">VendID:</label><br>
            <input type="vendid" id="vendid" name="vendid"><br><br>
            <button onclick="ProductAdd()" class="btn btn-primary">Submit</button>
        </form>
    `;
 
    // Display the form in the container
    document.getElementById('productFormContainer').innerHTML = formHtml;
}
 
function loadSoldProductForm() {
    let formHtml = `
        <form onsubmit="return false">
            <label for="date">Date:</label><br>
            <input type="text" id="date" name="date"><br>
            <label for="time">Time:</label><br>
            <input type="text" id="time" name="time"><br>
            <label for="productid">ProductID:</label><br>
            <input type="number" id="productid" name="productid"><br><br>
            <button onclick="SoldProductAdd()" class="btn btn-primary">Submit</button>
        </form>
    `;
 
    // Display the form in the container
    document.getElementById('productFormContainer').innerHTML = formHtml;
    loadProductList();
}
 
 
// Call the function when the page loads
window.onload = handleOnLoad;
 
 
async function ProductAdd() {
    let product = {
        Quantity: document.getElementById('quantity').value,
        Cost: document.getElementById('cost').value,
        Name: document.getElementById('name').value,
        Sold: false,
        Deleted: false,
        VendID: document.getElementById('vendid').value,
 
 
    };
    console.log("What product am I adding?", product);
    myProduct.push(product);
    await SaveProduct(product)
    document.getElementById('quantity').value = '';
    document.getElementById('cost').value = '';
    document.getElementById('name').value = '';
    document.getElementById('vendid').value = '';
 
}
 
async function SoldProductAdd() {
    let soldproduct = {
        Date: document.getElementById('date').value,
        Time: document.getElementById('time').value,
        ProductID: document.getElementById('productid').value,
        Deleted: false,
       
 
 
    };
    console.log("What product was sold?", soldproduct);
    myPurchaseEvent.push(soldproduct);
    await SaveSoldProduct(soldproduct)
    document.getElementById('date').value = '';
    document.getElementById('time').value = '';
    document.getElementById('productid').value = '';
   
 
}
 
async function removeFromInventory(id) {
    id--
    try {
        const myProduct = await getItemInventory();
        myProduct.forEach(product => {
            if(product.productID == id)
            {
                product.deleted = true;
            }
        });
        // document.querySelector(`#inventory-${productId}`).textContent = product.quantity;
        // await SaveProduct(myProduct[id]);
        console.log(myProduct[id])
        deleteProduct(myProduct[id]);
    } catch (error) {
        console.error('Error removing from product:', error);
    }
}
 
async function removeFromSoldInventory(id) {
    try {
        const myProduct = await getItemInventory();
        const producttodelete = myProduct.find((product) => product.id === id);
        producttodelete.deleted = true;
        // document.querySelector(`#inventory-${productId}`).textContent = product.quantity;
        await SaveProduct(myProduct);
    } catch (error) {
        console.error('Error removing from product:', error);
    }
}
 
async function getItemInventory() {
    try {
        let response = await fetch(productUrl); // Replace with your actual API endpoint
        myProduct = await response.json();
        return myProduct;
    } catch (error) {
        console.error('Error fetching item inventory from API:', error);
    }
}
 
async function SaveProduct(product) {
    console.log("what exercise am I saving", product);
    if (product.ProductID) {
        // If exercise has an ID, it already exists in the API, update it
        const updateUrl = `${productUrl}/${product.ProductID}`;
        await fetch(updateUrl, {
            method: "PUT", // Use PUT for updating
            body: JSON.stringify(product),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
    } else {
        // If exercise has no ID, it's a new exercise, create it
        await fetch(productUrl, {
            method: "POST",
            body: JSON.stringify(product),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
    }
 
   
}

async function deleteProduct(product)
{
    const putUrl = "https://localhost:7051/api/Product/" + product.productID;
    console.log(product.productID)
    product.deleted = true;
    console.log(product)
    await fetch(putUrl, {
        method: "PUT",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
    })
    .then((response)=>{
        console.log(response)
    })
    loadProductList();
}
 
async function SaveSoldProduct(soldproduct) {
    console.log("what exercise am I saving", soldproduct);
    if (soldproduct.id) {
        // If exercise has an ID, it already exists in the API, update it
        const updateUrl = `${purchaseeventUrl}/${soldproduct.id}`;
        await fetch(updateUrl, {
            method: "PUT", // Use PUT for updating
            body: JSON.stringify(soldproduct),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
    } else {
        // If exercise has no ID, it's a new exercise, create it
        await fetch(purchaseeventUrl, {
            method: "POST",
            body: JSON.stringify(soldproduct),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
    }
 
   
 
}
