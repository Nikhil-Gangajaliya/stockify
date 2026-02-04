function getInvoiceIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("invoiceId");
}

async function loadInvoiceFromURL() {
  const invoiceId = getInvoiceIdFromURL();

  if (!invoiceId) {
    document.getElementById("invoiceView").innerHTML =
      "<p>Invoice ID missing</p>";
    return;
  }

  try {
    const res = await apiRequest(`/invoices/invoice-details/${invoiceId}`);
    renderInvoiceDetails(res.data);
  } catch (error) {
    console.error(error);
    document.getElementById("invoiceView").innerHTML =
      "<p>Failed to load invoice details</p>";
  }
}

function renderInvoiceDetails(invoice) {
  let html = `
    <h2>Invoice</h2>

    <p><strong>Invoice No:</strong> ${invoice.invoiceNumber}</p>
    <p><strong>Date:</strong> ${new Date(invoice.invoiceDate).toLocaleString()}</p>

    <hr />

    <h3>Seller</h3>
    <p><strong>${invoice.seller.storeName}</strong></p>
    <p>${invoice.seller.address}</p>
    <p>${invoice.seller.phone}</p>

    <hr />

    <h3>Buyer</h3>
    <p><strong>${invoice.buyer.storeName}</strong></p>
    <p>${invoice.buyer.address}</p>
    <p>${invoice.buyer.contact}</p>

    <hr />

    <h3>Items</h3>
    <table border="1" width="100%">
      <tr>
        <th>Product</th>
        <th>Qty</th>
        <th>Price</th>
        <th>Total</th>
      </tr>
  `;

  invoice.items.forEach(item => {
    html += `
      <tr>
        <td>${item.product}</td>
        <td>${item.quantity}</td>
        <td>₹${item.price}</td>
        <td>₹${item.total}</td>
      </tr>
    `;
  });

  html += `
    </table>

    <h3 style="text-align:right">
      Grand Total: ₹${invoice.amount}
    </h3>

    <!-- Future buttons -->
    <!-- <button onclick="printInvoice()">Print</button> -->
    <!-- <button onclick="exportInvoice()">Export PDF</button> -->
  `;

  document.getElementById("invoiceView").innerHTML = html;
}
