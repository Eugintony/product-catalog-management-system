let products = JSON.parse(localStorage.getItem("products")) || [];

displayProducts();
updateDashboard();

function saveToLocalStorage() {
    localStorage.setItem("products", JSON.stringify(products));
}

function saveProduct() {

    let id = document.getElementById("productId").value;
    let name = document.getElementById("name").value.trim();
    let category = document.getElementById("category").value.trim();
    let price = Number(document.getElementById("price").value);
    let stock = Number(document.getElementById("stock").value);
    let brand = document.getElementById("brand").value.trim();

    if (!name || !category || !price || !stock || !brand) {
        alert("Fill all fields");
        return;
    }
      if (price <= 0 || stock < 0) {
        alert("Price must be greater than 0, and Stock cannot be negative!");
        return; // Stops the function from saving bad data
    }

    if (id) {
        let product = products.find(p => p.id == id);

        product.name = name;
        product.category = category;
        product.price = price;
        product.stock = stock;
        product.brand = brand;

        showMessage("Product Updated Successfully");
    }
    else {
        let newProduct = {
            id: Date.now(),
            name,
            category,
            price,
            stock,
            brand
        };

        products.push(newProduct);

        showMessage("Product Added Successfully");
    }

    saveToLocalStorage();
    displayProducts();
    updateDashboard();
    clearForm();
}

function displayProducts(list = products) {

    let table = document.getElementById("productTable");

    table.innerHTML = "";

    if (list.length === 0) {
        table.innerHTML =
        `<tr>
            <td colspan="7">No Products Found</td>
        </tr>`;
    }

    list.forEach(product => {

        table.innerHTML +=`
        <tr>
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${product.price}</td>
            <td>${product.stock}</td>
            <td>${product.brand}</td>

            <td>
                <button class="edit"
                onclick="editProduct(${product.id})">
                Edit
                </button>

                <button class="delete"
                onclick="deleteProduct(${product.id})">
                Delete
                </button>
            </td>
        </tr>`;
    });
}

function editProduct(id) {

    let product = products.find(p => p.id === id);
    document.getElementById("productId").value = product.id;
    document.getElementById("name").value = product.name;
    document.getElementById("category").value = product.category;
    document.getElementById("price").value = product.price;
    document.getElementById("stock").value = product.stock;
    document.getElementById("brand").value = product.brand;

}

function deleteProduct(id) {

    products = products.filter(p => p.id !== id);

    saveToLocalStorage();
    displayProducts();
    updateDashboard();

    showMessage("Product Deleted Successfully");
}

function clearForm() {

    document.getElementById("productId").value = "";
    document.getElementById("name").value = "";
    document.getElementById("category").value = "";
    document.getElementById("price").value = "";
    document.getElementById("stock").value = "";
    document.getElementById("brand").value = "";
}

function applyFilters() {

    let search = document.getElementById("search").value.toLowerCase();

    let category =
    document.getElementById("filterCategory").value.toLowerCase();

    let minPrice =
    Number(document.getElementById("minPrice").value) || 0;

    let maxPrice =
    Number(document.getElementById("maxPrice").value) || Infinity;

    let sortOption =
    document.getElementById("sortOption").value;

    let filtered = products.filter(product =>
        product.name.toLowerCase().includes(search) &&
        product.category.toLowerCase().includes(category) &&
        product.price >= minPrice &&
        product.price <= maxPrice
    );

    if (sortOption === "low") {
        filtered.sort((a,b)=>a.price-b.price);
    }

    if (sortOption === "high") {
        filtered.sort((a,b)=>b.price-a.price);
    }

    if (sortOption === "az") {
        filtered.sort((a,b)=>
            a.name.toLowerCase(b.name)
        );
    }

    document.getElementById("count").innerText =
    `Products Found: ${filtered.length}`;

    displayProducts(filtered);
}

function updateDashboard() {

    document.getElementById("totalProducts").innerText =
    `${products.length}`;

    let inventoryValue =
    products.reduce((sum,p)=>
    sum + (p.price * p.stock),0);

    document.getElementById("inventoryValue").innerText =
    `₹${inventoryValue.toLocaleString()}`;

    if(products.length>0){

        let expensive =
        [...products].sort((a,b)=>b.price-a.price)[0];

        let cheap =
        [...products].sort((a,b)=>a.price-b.price)[0];

        document.getElementById("mostExpensive").innerText =
        `${expensive.name} · ₹${expensive.price}`;

        document.getElementById("leastExpensive").innerText =
        `${cheap.name} · ₹${cheap.price}`;
    }
    else{
        document.getElementById("mostExpensive").innerText =
        "No products yet";

        document.getElementById("leastExpensive").innerText =
        "No products yet";
    }

    let categoryCount = {};

    products.forEach(product => {

        categoryCount[product.category] =
        (categoryCount[product.category] || 0) + 1;
    });

    let result = "<h3>Category Count</h3>";

    for(let category in categoryCount){
        result += `<p>${category}: ${categoryCount[category]}</p>`;
    }

    document.getElementById("categoryStats").innerHTML = result;
}

function showMessage(msg){

    document.getElementById("message").innerText = msg;

    setTimeout(()=>{
        document.getElementById("message").innerText="";
    },2000);
}