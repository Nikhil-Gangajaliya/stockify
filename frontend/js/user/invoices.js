// Load logged-in user's invoices
async function loadInvoices() {
  try {
    const res = await apiRequest("/invoices/my-invoices");
    renderInvoices(res.data || []);
  } catch (error) {
    console.error("Error loading invoices:", error);
    document.getElementById("allInvoices").innerHTML =
      "<p>Failed to load invoices</p>";
  }
}

function renderInvoices(invoices) {
  if (!Array.isArray(invoices) || invoices.length === 0) {
    document.getElementById("allInvoices").innerHTML =
      "<p>No Invoice found</p>";
    return;
  }

  let html = `
    <h3>My Invoices</h3>
    <table border="1" width="100%">
      <tr>
        <th>Invoice Number</th>
        <th>Date</th>
        <th>Amount</th>
        <th>Action</th>
      </tr>
  `;

  invoices.forEach(inv => {
    html += `
      <tr>
        <td>${inv.invoiceNumber}</td>
        <td>${new Date(inv.createdAt).toLocaleDateString()}</td>
        <td>₹${inv.amount}</td>
        <td>
          <button onclick="openInvoice('${inv._id}')">View</button>
        </td>
      </tr>
    `;
  });

  html += `</table>`;
  document.getElementById("allInvoices").innerHTML = html;
}

// Redirect to invoice view page
function openInvoice(invoiceId) {
  window.location.href = `invoice-view.html?invoiceId=${invoiceId}`;
}
