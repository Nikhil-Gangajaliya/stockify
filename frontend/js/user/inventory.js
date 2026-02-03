async function loadInventory() {
  try {
    const res = await apiRequest("/inventory/my-inventory");
    renderInventory(res.data);
  } catch (error) {
    console.error("Error loading inventory:", error);
    document.getElementById("inventory").innerHTML =
      "<p>Failed to load inventory</p>";
  }
}


function renderInventory(inventory) {
  if (!Array.isArray(inventory) || inventory.length === 0) {
    document.getElementById("inventory").innerHTML =
      "<p>No inventory found</p>";
    return;
  }

  let html = `
    <h3>My Inventory</h3>
    <table border="1" width="100%">
      <tr>
        <th>Product</th>
        <th>Price</th>
        <th>Available Stock</th>
        <th>Reduce Stock</th>
        <th>Action</th>
      </tr>
  `;

  inventory.forEach(item => {
    const productName = item.product?.name || "Deleted Product";
    const price = item.product?.price ?? "-";
    const stock = item.stock ?? 0;

    html += `
      <tr>
        <td>${productName}</td>
        <td>${price !== "-" ? `₹${price}` : "-"}</td>
        <td>${stock}</td>
        <td>
          <input
            type="number"
            min="1"
            max="${stock}"
            id="reduce-${item.product?._id}"
            style="width:60px"
          />
        </td>
        <td>
          <button
            onclick="reduceStock('${item.product?._id}', ${stock})"
            ${stock === 0 ? "disabled" : ""}
          >
            Reduce
          </button>
        </td>
      </tr>
    `;
  });

  html += `</table>`;
  document.getElementById("inventory").innerHTML = html;
}

async function reduceStock(productId, availableStock) {
  const input = document.getElementById(`reduce-${productId}`);
  const quantity = parseInt(input.value);

  if (!quantity || quantity <= 0) {
    alert("Enter a valid quantity");
    return;
  }

  if (quantity > availableStock) {
    alert("Quantity exceeds available stock");
    return;
  }

  const confirmReduce = confirm(
    `Reduce stock by ${quantity}?`
  );

  if (!confirmReduce) return;

  try {
    await apiRequest(
      `/inventory/reduce-stock/${productId}`,
      "POST",
      { quantity }
    );

    alert("Stock reduced successfully");
    loadInventory(); // refresh inventory
  } catch (error) {
    alert(error.message || "Failed to reduce stock");
  }
}

