let currentProduct = null;

/* LOAD PRODUCTS */
async function loadProducts() {
  try {
    const res = await apiRequest("/products/get-product");
    renderProducts(res.data || []);
  } catch (err) {
    document.getElementById("productList").innerHTML =
      "<p>Failed to load products</p>";
  }
}

/* RENDER LIST */
function renderProducts(products) {
  let html = `
    <table border="1" width="100%">
      <tr>
        <th>Name</th>
        <th>Price</th>
        <th>Stock</th>
        <th>Info</th>
      </tr>
  `;

  products.forEach(p => {
    html += `
      <tr>
        <td>${p.name}</td>
        <td>₹${p.price}</td>
        <td>${p.stock}</td>
        <td>
          <button onclick='openViewModal(${JSON.stringify(p)})'>ℹ️</button>
        </td>
      </tr>
    `;
  });

  html += `</table>`;
  document.getElementById("productList").innerHTML = html;
}

/* CREATE MODAL */
function openCreateModal() {
  currentProduct = null;
  document.getElementById("modalTitle").innerText = "Create Product";
  document.getElementById("productId").value = "";
  document.getElementById("name").value = "";
  document.getElementById("price").value = "";
  document.getElementById("stock").value = "";
  document.getElementById("productModal").style.display = "block";
}

/* VIEW MODAL */
function openViewModal(product) {
  currentProduct = product;

  document.getElementById("viewContent").innerHTML = `
    <p><b>Name:</b> ${product.name}</p>
    <p><b>Price:</b> ₹${product.price}</p>
    <p><b>Stock:</b> ${product.stock}</p>
  `;

  document.getElementById("viewModal").style.display = "block";
}

/* EDIT FROM VIEW */
function editFromView() {
  closeViewModal();
  document.getElementById("modalTitle").innerText = "Edit Product";
  document.getElementById("productId").value = currentProduct._id;
  document.getElementById("name").value = currentProduct.name;
  document.getElementById("price").value = currentProduct.price;
  document.getElementById("stock").value = currentProduct.stock;
  document.getElementById("productModal").style.display = "block";
}

/* DELETE */
async function deleteFromView() {
  if (!confirm("Delete this product?")) return;

  try {
    await apiRequest(
      `/products/delete-product/${currentProduct._id}`,
      "DELETE"
    );
    closeViewModal();
    loadProducts();
  } catch (err) {
    alert("Failed to delete product");
  }
}

/* CREATE / UPDATE */
async function submitProduct() {
  const id = document.getElementById("productId").value;
  const payload = {
    name: document.getElementById("name").value,
    price: document.getElementById("price").value,
    stock: document.getElementById("stock").value
  };

  try {
    if (id) {
      await apiRequest(
        `/products/update-product/${id}`,
        "PUT",
        payload
      );
    } else {
      await apiRequest("/products/create", "POST", payload);
    }

    closeModal();
    loadProducts();
  } catch (err) {
    alert("Operation failed");
  }
}

/* MODAL HELPERS */
function closeModal() {
  document.getElementById("productModal").style.display = "none";
}

function closeViewModal() {
  document.getElementById("viewModal").style.display = "none";
}
