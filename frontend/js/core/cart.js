let cart = [];

function addToCart(item) {
  const existing = cart.find(i => i.productId === item.productId);

  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cart.push(item);
  }
}

function getCart() {
  return cart;
}

function clearCart() {
  cart = [];
}

function getCartCount() {
  return cart.length;
}

function getCartTotal() {
  return cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
}
