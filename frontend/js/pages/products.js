async function loadProducts() {
  try {
    const res = await apiRequest("/products/get-product");
    console.log("Products API:", res);

    // IMPORTANT FIX: res.data is already array
    randerGetAllProducts(res.data);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

function randerGetAllProducts(data) {
  if (!Array.isArray(data)) {
    console.error("Expected array, got:", data);
    return;
  }

  let html = `
    <h3>All Products</h3>
    <table border="1" width="100%">
      <tr>
        <th>Name</th>
        <th>Price</th>
        <th>Stock</th>
        <th>Quantity</th>
        <th>Action</th>
      </tr>
  `;

  data.forEach(product => {
    html += `
     <tr>
  <td>${product.name}</td>
  <td>₹${product.price}</td>
  <td>${product.stock}</td>

  <td>
    <button
      onclick="changeQty('${product._id}', -1)"
      ${product.stock < 1 ? "disabled" : ""}
    >-</button>

    <span id="qty-${product._id}">1</span>

    <button
      onclick="changeQty('${product._id}', 1)"
      ${product.stock < 1 ? "disabled" : ""}
    >+</button>
  </td>

  <td>
    <button
      id="addBtn-${product._id}"
      onclick='handleAdd(${JSON.stringify(product)})'
      ${product.stock < 1 ? "disabled" : ""}
    >
      ${product.stock < 1 ? "Out of Stock" : "Add"}
    </button>
  </td>
</tr>


    `;
  });

  html += `
    </table>

    <button
      id="placeOrderBtn"
      onclick="openCheckout()"
      style="display:none; margin-top:15px"
    >
      Place Order
    </button>
  `;

  document.getElementById("allProducts").innerHTML = html;
}

function changeQty(id, delta) {
  const el = document.getElementById(`qty-${id}`);
  let qty = parseInt(el.innerText);
  qty = Math.max(1, qty + delta);
  el.innerText = qty;
  const addBtn = document.getElementById(`addBtn-${productId}`);
  if (product.stock <= 0) {
    addBtn.disabled = true;
  } else {
    addBtn.disabled = false;
  }

}

function handleAdd(product) {
  const qty = parseInt(
    document.getElementById(`qty-${product._id}`).innerText
  );

  addToCart({
    productId: product._id,
    name: product.name,
    price: product.price,
    quantity: qty
  });

  updatePlaceOrderButton();
}

function updatePlaceOrderButton() {
  const btn = document.getElementById("placeOrderBtn");

  if (getCartCount() > 0) {
    btn.style.display = "block";
    btn.innerText = `Place Order (${getCartCount()} items)`;
  } else {
    btn.style.display = "none";
  }
}
