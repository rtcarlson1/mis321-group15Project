const adminUrl = "https://localhost:7051/api/Admin";
const productUrl = "https://localhost:7051/api/Product";
const vendingmachineUrl = "https://localhost:7051/api/VendingMachine";
const purchaseeventUrl = "https://localhost:7051/api/PurchaseEvent";
 
let myAdmin = [];
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
            <br>
            <label for="vendingMachine">Select Vending Machine:</label>
            <select id="vendingMachine" class="form-select" onchange="loadProductList()">
       
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
            <button onclick="loadProductEditType()" class="btn btn-primary">Edit Type</button>
            <button onclick="loadProductEditQuantity()" class="btn btn-primary">Edit Quantity</button>
            <button onclick="loadProductEditCost()" class="btn btn-primary">Edit Cost</button>
            <button onclick="loadProductEditMoney()" class="btn btn-primary">Edit Money</button>
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
    const vendingMachines = await fetchVendingMachine();
   
    // Dynamically populate the select element with vending machine options
    const vendingMachineSelect = document.getElementById("vendingMachine");
    vendingMachines.forEach(machine => {
        const option = document.createElement("option");
        option.value = machine.vendID;
        option.textContent = "ID: " + machine.vendID + " Address: " + machine.address + " Money In Machine: $" + machine.moneyInMachine;
        vendingMachineSelect.appendChild(option);
    });
    loadProductList();
   
}
 
async function loadProductList() {
    const vendIDString = document.getElementById('vendingMachine').value;
    const vendID = parseInt(vendIDString, 10);
 
    const products = await fetchProducts();
    const purchaseEvents = await fetchPurchaseEvents();
 
    // Clear previous content
    clearTable("#machineInventoryTable tbody");
    clearTable("#soldInventoryTable tbody");
 
    loadProductsTable(products, vendID);
    loadSoldProductsTable(products, purchaseEvents, vendID);
}
 
function clearTable(tableSelector) {
    const tableBody = document.querySelector(tableSelector);
    tableBody.innerHTML = "";
}
 
function loadProductsTable(products, vendID) {
    const machineTableBody = document.querySelector("#machineInventoryTable tbody");
 
    products.forEach(product => {
        if (product.deleted == false && product.vendID == vendID) {
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
            console.log(product.name);
        }
    });
}
 
function loadSoldProductsTable(products, purchaseEvents, vendID) {
    const soldTableBody = document.querySelector("#soldInventoryTable tbody");
 
    purchaseEvents.forEach(purchaseEvent => {
        console.log('Products:', products);
        console.log('Purchase Events:', purchaseEvents);
        // let tempname = '';
        if (purchaseEvent.vendID == vendID) {
            const associatedProduct = products.find(p => p.productID === purchaseEvent.productID);
            const productName = associatedProduct ? associatedProduct.name : 'Unknown Product';
 
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${productName}</td>
                <td>${purchaseEvent.productID}</td>
                <td>${purchaseEvent.date}</td>
            `;
            soldTableBody.appendChild(row);
           
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
        const response = await fetch(vendingmachineUrl);
        const vendingMachines = await response.json();
        return vendingMachines;
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
 
function loadProductEditQuantity() {
    let formHtml = `
        <form onsubmit="return false">
            <label for="productID">ProductID:</label><br>
            <input type="number" id="productID" name="productID"><br>
            <label for="quantity">Quantity:</label><br>
            <input type="number" id="quantity" name="quantity"><br>
            <button onclick="ProductEditQuantity(productID.value)" class="btn btn-primary">Submit</button>
        </form>
    `;
 
    // Display the form in the container
    document.getElementById('productFormContainer').innerHTML = formHtml;
}
 
function loadProductEditCost() {
    let formHtml = `
        <form onsubmit="return false">
            <label for="productID">ProductID:</label><br>
            <input type="number" id="productID" name="productID"><br>
            <label for="cost">Cost:</label><br>
            <input type="number" id="cost" name="cost"><br>
            <button onclick="ProductEditCost(productID.value)" class="btn btn-primary">Submit</button>
        </form>
    `;
 
    // Display the form in the container
    document.getElementById('productFormContainer').innerHTML = formHtml;
}
 
function loadProductEditMoney() {
    let formHtml = `
        <form onsubmit="return false">
            <label for="money">Money:</label><br>
            <input type="number" id="money" name="money"><br>
            <button onclick="ProductEditMoney(vendingMachine.value)" class="btn btn-primary">Submit</button>
        </form>
    `;
 
    // Display the form in the container
    document.getElementById('productFormContainer').innerHTML = formHtml;
}
 
function loadProductEditType() {
    let formHtml = `
        <form onsubmit="return false">
            <label for="productID">ProductID:</label><br>
            <input type="number" id="productID" name="productID"><br>
            <label for="name">Name:</label><br>
            <input type="text" id="name" name="name"><br>
            <label for="imageURL">Image URL:</label><br>
            <input type="text" id="imageURL" name="imageURL"><br>
            <button onclick="ProductEditType(productID.value)" class="btn btn-primary">Submit</button>
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
        NumSold: 0,
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
 
async function ProductEditQuantity(productID) {
    const response = await fetch(productUrl + "/" + productID);
    const product = await response.json();
    console.log(product)
    let newProduct = {
        ProductID: document.getElementById('productID').value,
        Name: product.name,
        Quantity: document.getElementById('quantity').value,
        Cost: product.cost,
        NumSold: product.numSold,
        Deleted: product.deleted,
        VendID: product.vendID,
        ImageURL: product.imageURL
 
    };
    console.log("What product am I editing?", product);
    await SaveProduct(newProduct)
    document.getElementById('productID').value = '';
    document.getElementById('quantity').value = '';
 
    loadProductList()
 
}
 
async function ProductEditCost(productID) {
    const response = await fetch(productUrl + "/" + productID);
    const product = await response.json();
    console.log(product)
    let newProduct = {
        ProductID: document.getElementById('productID').value,
        Name: product.name,
        Quantity: product.quantity,
        Cost: document.getElementById('cost').value,
        NumSold: product.numSold,
        Deleted: product.deleted,
        VendID: product.vendID,
        ImageURL: product.imageURL
 
    };
    console.log("What product am I editing?", product);
    await SaveProduct(newProduct)
    document.getElementById('productID').value = '';
    document.getElementById('cost').value = '';
 
    loadProductList()
 
}
 
async function ProductEditMoney(vendID) {
    const response = await fetch(vendingmachineUrl + "/" + vendID);
    const vendingMachine = await response.json();
    let newVendingMachine = {
        VendID: vendingMachine.vendID,
        Address: vendingMachine.address,
        ZipCode: vendingMachine.zipCode,
        Deleted: vendingMachine.deleted,
        AdminID: vendingMachine.adminID,
        MoneyInMachine: document.getElementById('money').value
 
    };
    await SaveVendingMachine(newVendingMachine)
    document.getElementById('money').value = '';
 
    handleOnLoad()
 
}
 
async function ProductEditType(productID) {
    const response = await fetch(productUrl + "/" + productID);
    const product = await response.json();
    console.log(product)
    let newProduct = {
        ProductID: document.getElementById('productID').value,
        Name: document.getElementById('name').value,
        Quantity: product.quantity,
        Cost: product.cost,
        NumSold: product.numSold,
        Deleted: product.deleted,
        VendID: product.vendID,
        ImageURL: document.getElementById('imageURL').value
 
    };
    console.log("What product am I editing?", product);
    await SaveProduct(newProduct)
    document.getElementById('productID').value = '';
    document.getElementById('name').value = '';
    document.getElementById('imageURL').value = '';
 
    loadProductList()
 
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
        console.log(product)
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