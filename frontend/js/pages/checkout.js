function openCheckout() {
  const items = getCart();
  const summary = document.getElementById("checkoutItems");
  summary.innerHTML = "";

  items.forEach(item => {
    summary.innerHTML += `
      <p>
        ${item.name} × ${item.quantity}
        = ₹${item.price * item.quantity}
      </p>
    `;
  });

  document.getElementById("checkoutTotal").innerText =
    getCartTotal();

  document.getElementById("checkoutModal").style.display = "block";
}

function closeCheckout() {
  document.getElementById("checkoutModal").style.display = "none";
}

async function confirmOrder() {
  try {
    const payload = {
      items: getCart().map(i => ({
        productId: i.productId,
        quantity: i.quantity
      }))
    };

    await apiRequest("/orders/create-order", "POST", payload);

    alert("Order placed successfully!");
    clearCart();
    closeCheckout();
  } catch (err) {
    alert(err.message);
  }
}
