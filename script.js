const business = {
  whatsappNumber: "27824778567",
  email: "orders@mbandeniwater.co.za"
};

const cart = new Map();
const cartItems = document.querySelector("#cartItems");
const cartTotal = document.querySelector("#cartTotal");
const orderForm = document.querySelector("#orderForm");
const clearOrder = document.querySelector("#clearOrder");

document.querySelector("#year").textContent = new Date().getFullYear();

document.querySelectorAll(".add-button").forEach((button) => {
  button.addEventListener("click", () => {
    const name = button.dataset.name;
    const price = Number(button.dataset.price);
    const item = cart.get(name) || { name, price, quantity: 0 };
    item.quantity += 1;
    cart.set(name, item);
    renderCart();
  });
});

clearOrder.addEventListener("click", () => {
  cart.clear();
  orderForm.reset();
  renderCart();
});

orderForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (cart.size === 0) {
    alert("Please add at least one water product to your order.");
    return;
  }

  const lines = [...cart.values()].map((item) => {
    const amount = item.price > 0 ? `R${item.quantity * item.price}` : "Request quote";
    return `${item.quantity} x ${item.name} - ${amount}`;
  });
  const total = [...cart.values()].reduce((sum, item) => sum + item.price * item.quantity, 0);
  const message = [
    "Hello Mbandeni Mineral Water, I would like to place an order.",
    "",
    `Name: ${document.querySelector("#customerName").value}`,
    `Phone: ${document.querySelector("#customerPhone").value}`,
    `Address: ${document.querySelector("#customerAddress").value}`,
    "",
    "Order:",
    ...lines,
    `Total: R${total}`,
    "",
    `Notes: ${document.querySelector("#orderNotes").value || "None"}`
  ].join("\n");

  const whatsappUrl = `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(message)}`;
  const emailUrl = `mailto:${business.email}?subject=${encodeURIComponent("New Mbandeni Water Order")}&body=${encodeURIComponent(message)}`;

  const target = business.whatsappNumber ? whatsappUrl : emailUrl;
  window.location.href = target;
});

function renderCart() {
  cartItems.innerHTML = "";

  if (cart.size === 0) {
    cartItems.innerHTML = '<p class="cart-empty">Your order is empty. Add products above to begin.</p>';
    cartTotal.textContent = "R0";
    return;
  }

  let total = 0;

  cart.forEach((item) => {
    total += item.price * item.quantity;

    const line = document.createElement("div");
    line.className = "cart-line";
    line.innerHTML = `
      <div>
        <strong>${item.name}</strong>
        <div>${item.price > 0 ? `R${item.price} each` : "Request quote"}</div>
      </div>
      <div class="quantity-controls">
        <button type="button" aria-label="Remove one ${item.name}" data-action="decrease" data-name="${item.name}">-</button>
        <strong>${item.quantity}</strong>
        <button type="button" aria-label="Add one ${item.name}" data-action="increase" data-name="${item.name}">+</button>
      </div>
    `;
    cartItems.appendChild(line);
  });

  const hasQuoteItem = [...cart.values()].some((item) => item.price === 0);
  cartTotal.textContent = hasQuoteItem ? `R${total} + quote` : `R${total}`;
}

cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const item = cart.get(button.dataset.name);
  if (!item) return;

  if (button.dataset.action === "increase") {
    item.quantity += 1;
  } else {
    item.quantity -= 1;
  }

  if (item.quantity <= 0) {
    cart.delete(item.name);
  } else {
    cart.set(item.name, item);
  }

  renderCart();
});

renderCart();
