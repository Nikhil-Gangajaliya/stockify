async function loadDashboard() {
  try {
    const [
      globalStats,
      storeStats,
      salesSummary,
      topProducts
    ] = await Promise.all([
      apiRequest("/dashboard/global-stats"),
      apiRequest("/dashboard/store-stats"),
      apiRequest("/dashboard/sales-summary"),
      apiRequest("/dashboard/top-products")
    ]);

    renderGlobalStats(globalStats.data);
    renderStoreStats(storeStats.data);
    renderSalesSummary(salesSummary.data);
    renderTopProducts(topProducts.data);

  } catch (err) {
    alert(err.message);
  }
}

function renderGlobalStats(data) {
  document.getElementById("stats").innerHTML = `
    <h3>Global Overview</h3>
    <ul>
      <li>Total Users: <b>${data.totalUsers}</b></li>
      <li>Total Stores: <b>${data.totalStores}</b></li>
      <li>Total Products: <b>${data.totalProducts}</b></li>
      <li>Total Orders: <b>${data.totalOrders}</b></li>
      <li>Total Revenue: <b>₹${data.totalRevenue.toLocaleString()}</b></li>
    </ul>
  `;
}

function renderStoreStats(data) {
  let html = `
    <h3>Store Stats</h3>
    <table border="1">
      <tr>
        <th>Store</th>
        <th>Orders</th>
        <th>Revenue</th>
      </tr>
  `;

  data.forEach(s => {
    html += `
      <tr>
        <td>${s.storeName}</td>
        <td>${s.totalOrders}</td>
        <td>₹${s.totalRevenue.toLocaleString()}</td>
      </tr>
    `;
  });

  html += `</table>`;
  document.getElementById("storeStats").innerHTML = html;
}

function renderSalesSummary(data) {
  let html = `<h3>Sales Summary</h3><ul>`;

  data.forEach(item => {
    const { year, month, day } = item._id;
    html += `
      <li>
        ${day}/${month}/${year} →
        Orders: ${item.totalOrders},
        Revenue: ₹${item.totalRevenue.toLocaleString()}
      </li>
    `;
  });

  html += `</ul>`;
  document.getElementById("salesStats").innerHTML = html;
}

function renderTopProducts(data) {
  let html = `<h3>Top Products</h3><ul>`;

  data.forEach(p => {
    html += `
      <li>
        ${p.name} — Sold: ${p.totalSold},
        Price: ₹${p.price},
        Revenue: ₹${p.totalRevenue.toLocaleString()}
      </li>
    `;
  });

  html += `</ul>`;
  document.getElementById("productStats").innerHTML = html;
}

async function profileDetails() {
  try {
    const getCurrentUser = await apiRequest("/users/current-user");

    randerGetCurrentUser(getCurrentUser.data);
  }
  catch (err) {
    alert(err.message);
  }
}

function randerGetCurrentUser(data) {
  document.getElementById("profile").innerHTML = `
    <h3>User Profile</h3>
    <ul>
      <li>Name: <b>${data.username}</b></li>
      <li>Email: <b>${data.email}</b></li>
      <li>Role: <b>${data.role}</b></li>
      <li>Joined On: <b>${new Date(data.createdAt).toLocaleDateString()}</b></li>
    </ul>
  `;
}
