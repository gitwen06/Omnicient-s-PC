document.addEventListener("DOMContentLoaded", function () {
  // Get query parameters
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get("orderId") || `ORD-${Math.floor(Math.random() * 1000000)}`;
  const shippingAddress = params.get("address") || "123 Placeholder Street, Manila City";

  // Extract product details from URL parameters
  const productName = params.get("name");
  const productImage = params.get("image");
  const productPrice = params.get("price");

  // Retrieve payment method from URL or set a default value
  const paymentMethod = params.get("payment-method") || "Cash on Delivery";

  // DOM elements
  const orderItemsContainer = document.getElementById("order-items");
  const subtotalElement = document.getElementById("subtotal");
  const taxElement = document.getElementById("tax");
  const totalElement = document.getElementById("total");

  let subtotal = 0;

  // Set Order ID and Shipping Address
  document.getElementById("order-id").textContent = orderId;
  document.getElementById("shipping-address").textContent = shippingAddress;

  // Set the payment method in the Payment Method section
  document.getElementById("payment-method").textContent = paymentMethod;

  // Render Order Items
  if (productName && productImage && productPrice) {
    const item = document.createElement("div");
    item.classList.add("order-item");
    item.innerHTML = `
      <img src="${productImage}" alt="${productName}" style="width: 50px; height: 50px; border-radius: 5px;">
      <span>${productName}</span>
      <span>${productPrice}</span>
    `;
    orderItemsContainer.appendChild(item);

    // Calculate subtotal
    subtotal += parseFloat(productPrice.replace(/[₱,]/g, ""));
  }

  // Calculate totals
  const tax = subtotal * 0.012; // 12% tax
  const shipping = 50;
  const total = subtotal + tax + shipping;

  // Update Order Summary
  subtotalElement.textContent = `₱${subtotal.toLocaleString()}`;
  taxElement.textContent = `₱${tax.toLocaleString()}`;
  totalElement.textContent = `₱${total.toLocaleString()}`;

  // Toggle the visibility of the navigation links
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("list-2");

  menuToggle.addEventListener("click", function () {
    navLinks.classList.toggle("active");
  });
});