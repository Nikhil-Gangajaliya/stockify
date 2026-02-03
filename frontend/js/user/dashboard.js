async function loadDashboard() {
    try {
        const [
            currentUser,
            userDashboard,
            recentOrders,
            orderStatusSummary
        ] = await Promise.all([
            apiRequest("/users/current-user"),
            apiRequest("/dashboard/dashboard-stats"),
            apiRequest("/dashboard/recent-orders"),
            apiRequest("/dashboard/order-summary")
        ]);

        randerGetCurrentUser(currentUser.data);
        renderUserDashboard(userDashboard.data);
        renderRecentOrders(recentOrders.data);
        renderOrderStatusSummary(orderStatusSummary.data);
    }
    catch (err) {
        alert(err.message);
    }
}

function randerGetCurrentUser(data) {
    const store = data.store || {};

    document.getElementById("profile").innerHTML = `
    <h3>User Profile</h3>
    <ul>
      <li>Name: <b>${data.username}</b></li>
      <li>Email: <b>${data.email}</b></li>
      <li>Role: <b>${data.role}</b></li>
      <li>Store: <b>${store.storeName || "-"}</b></li>
      <li>Phone: <b>${store.phone || "-"}</b></li>
      <li>Address: <b>${store.address || "-"}</b></li>
      <li>Joined On: <b>${new Date(data.createdAt).toLocaleDateString()}</b></li>
    </ul>
  `;
}

function renderUserDashboard(data) {
    document.getElementById("dashboardStats").innerHTML = `
    <h3>Dashboard</h3>
    <ul>
      <li>Total Orders: <b>${data.totalOrders}</b></li>
      <li>Delivered Orders: <b>${data.deliveredOrders}</b></li>
      <li>Pending Orders: <b>${data.pendingOrders}</b></li>
      <li>Total Spent: <b>${data.totalSpent}</b></li>
    </ul>`
}

function renderRecentOrders(data) {
  if (!Array.isArray(data) || data.length === 0) {
    document.getElementById("recentOrders").innerHTML =
      "<p>No recent orders</p>";
    return;
  }

  // ✅ filter cancelled orders
  const recentOrders = data.filter(
    order => order.status !== "cancelled",
    order => order.status !== "rejected"
  );

  if (recentOrders.length === 0) {
    document.getElementById("recentOrders").innerHTML =
      "<p>No recent orders</p>";
    return;
  }

  let html = `
    <h3>Recent Orders</h3>
    <table border="1" width="100%">
      <tr>
        <th>Product</th>
        <th>Quantity</th>
        <th>Amount</th>
        <th>Status</th>
        <th>Date</th>
      </tr>
  `;

  recentOrders.forEach(order => {
    order.items.forEach(item => {
      html += `
        <tr>
          <td>${item.product?.name || "Deleted Product"}</td>
          <td>${item.quantity}</td>
          <td>₹${item.price * item.quantity}</td>
          <td>${order.status}</td>
          <td>${new Date(order.createdAt).toLocaleString()}</td>
        </tr>
      `;
    });
  });

  html += `</table>`;
  document.getElementById("recentOrders").innerHTML = html;
}


function renderOrderStatusSummary(data) {
    let html = `<h3>Orders</h3><ul>`;

    data.forEach(item => {
        html += `
        <li> ${item._id} - <b>${item.count}</li>
    `;
    });

    html += `</ul>`;
    document.getElementById("orderStats").innerHTML = html;
}



