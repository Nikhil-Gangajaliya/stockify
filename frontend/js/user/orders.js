async function loadOrders() {
    try {
        const res = await apiRequest("/orders/my-orders");
        const orders = res.data || [];
        renderOrders(orders);
    } catch (error) {
        console.error("Error loading orders:", error);
        document.getElementById("myOrders").innerHTML =
            "<p>Failed to load orders</p>";
    }
}


function renderOrders(orders) {
  if (!Array.isArray(orders) || orders.length === 0) {
    document.getElementById("myOrders").innerHTML =
      "<p>No orders found</p>";
    return;
  }

  // ✅ remove cancelled orders
  const activeOrders = orders.filter(
    order => order.status !== "cancelled",
    order => order.status !== "rejected"
  );

  if (activeOrders.length === 0) {
    document.getElementById("myOrders").innerHTML =
      "<p>No active orders</p>";
    return;
  }

  let html = `
    <h3>My Orders</h3>
    <table border="1" width="100%">
      <tr>
        <th>Product</th>
        <th>Quantity</th>
        <th>Amount</th>
        <th>Status</th>
        <th>Date</th>
        <th>Action</th>
      </tr>
  `;

  activeOrders.forEach(order => {
    order.items.forEach(item => {
      html += `
        <tr>
          <td>${item.product?.name || "Deleted Product"}</td>
          <td>${item.quantity}</td>
          <td>₹${item.price * item.quantity}</td>
          <td>${order.status}</td>
          <td>${new Date(order.createdAt).toLocaleString()}</td>
          <td>
            ${
              order.status === "pending"
                ? `<button onclick="cancelOrder('${order._id}')">
                     Cancel
                   </button>`
                : "-"
            }
          </td>
        </tr>
      `;
    });
  });

  html += `</table>`;
  document.getElementById("myOrders").innerHTML = html;
}



async function cancelOrder(orderId) {
    const confirmCancel = confirm(
        "Are you sure you want to cancel this order?"
    );

    if (!confirmCancel) return;

    try {
        await apiRequest(`/orders/cancel-order/${orderId}`, "POST");

        alert("Order cancelled successfully!");
        loadOrders(); // refresh list
    } catch (error) {
        alert(error.message || "Failed to cancel order");
    }
}

