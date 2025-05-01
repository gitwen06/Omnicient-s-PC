document.addEventListener("DOMContentLoaded", () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartTab = document.querySelector(".cartTab .listCart");
  const cartCount = document.getElementById("cart-count");
  const totalPriceElement = document.createElement("div");
  totalPriceElement.classList.add("total-price");
  document.querySelector(".cartTab").appendChild(totalPriceElement);

  // Update cart count and total price on page load
  updateCartCount();
  renderCartItems();

  // Add event listeners to "Add to Cart" buttons
  document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      const productCard = event.target.closest(".product-card");
      const product = {
        name: productCard.querySelector("h3").textContent,
        price: parseFloat(
          productCard.querySelector("p").textContent.replace(/[₱,]/g, "")
        ),
        img: productCard.querySelector("img").src,
        quantity: 1,
      };

      addToCart(product);
    });
  });

  // Add product to cart
  function addToCart(product) {
    const existingProduct = cart.find((item) => item.name === product.name);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
  }

  // Update cart count
  function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
  }

  // Render cart items in the cart tab
  function renderCartItems() {
    cartTab.innerHTML = ""; // Clear existing items

    cart.forEach((item, index) => {
      const cartItem = document.createElement("div");
      cartItem.classList.add("item");

      cartItem.innerHTML = `
        <div class="image">
          <img src="${item.img}" alt="${item.name}">
        </div>
        <div class="name">${item.name}</div>
        <div class="totalPrice">₱${(item.price * item.quantity).toLocaleString()}</div>
        <div class="quantity">
          <span class="minus" data-index="${index}"><</span>
          <span>${item.quantity}</span>
          <span class="plus" data-index="${index}">></span>
        </div>
        <button class="discard" data-index="${index}">Discard</button>
      `;

      cartTab.appendChild(cartItem);
    });

    // Add event listeners for quantity buttons
    document.querySelectorAll(".minus").forEach((button) => {
      button.addEventListener("click", (event) => {
        const index = event.target.dataset.index;
        if (cart[index].quantity > 1) {
          cart[index].quantity -= 1;
        } else {
          cart.splice(index, 1); // Remove item if quantity is 0
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
        renderCartItems();
      });
    });

    document.querySelectorAll(".plus").forEach((button) => {
      button.addEventListener("click", (event) => {
        const index = event.target.dataset.index;
        cart[index].quantity += 1;
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
        renderCartItems();
      });
    });

    // Add event listeners for discard buttons
    document.querySelectorAll(".discard").forEach((button) => {
      button.addEventListener("click", (event) => {
        const index = event.target.dataset.index;
        cart.splice(index, 1); // Remove the item from the cart
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
        renderCartItems();
      });
    });

    // Update total price
    updateTotalPrice();
  }

  // Update total price
  function updateTotalPrice() {
    const totalPrice = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    totalPriceElement.textContent = `Total Price: ₱${totalPrice.toLocaleString()}`;
  }

  // Close cart tab
  document.querySelector(".cartTab .close").addEventListener("click", () => {
    document.body.classList.remove("showCart");
  });

  // Open cart tab
  document.querySelector(".nav-cart").addEventListener("click", () => {
    document.body.classList.add("showCart");
  });

  // Checkout button functionality
  const checkOutButton = document.querySelector(".checkOut");

  if (checkOutButton) {
    checkOutButton.addEventListener("click", () => {
      // Show confirmation dialog
      if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
      }

      // Show confirmation dialog
      const confirmationDialog = document.createElement("div");
      confirmationDialog.classList.add("confirmation-dialog");
      confirmationDialog.innerHTML = `
        <div class="dialog-content">
          <h2>Confirm Your Purchase</h2>
          <form id="checkout-form">
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" required>
            <label for="email">Email Address:</label>
            <input type="email" id="email" name="email" required>
            <label for="address">Shipping Address:</label>
            <textarea id="address" name="address" required></textarea>
            <label for="payment">Payment Method:</label>
            <select id="payment" name="payment" required>
              <option value="credit_card">Credit Card</option>
              <option value="paypal">PayPal</option>
              <option value="cash_on_delivery">Cash on Delivery</option>
            </select>
            <div id="payment-details" style="display: none; margin-top: 20px;">
              <div id="credit-card-fields" style="display: none;">
                <label for="card-number">Card Number:</label>
                <input type="text" id="card-number" name="card-number" placeholder="Enter your card number">
                <label for="expiry-date">Expiry Date:</label>
                <input type="text" id="expiry-date" name="expiry-date" placeholder="MM/YY">
                <label for="cvv">CVV:</label>
                <input type="text" id="cvv" name="cvv" placeholder="Enter CVV">
              </div>
              <div id="paypal-fields" style="display: none;">
                <p>You will be redirected to PayPal to complete your purchase.</p>
              </div>
              <div id="cod-fields" style="display: none;">
                <p>Cash on Delivery selected. Please ensure the shipping address is correct.</p>
              </div>
            </div>
            <button type="submit" class="confirm-btn">Confirm Purchase</button>
            <button type="button" class="cancel-btn">Cancel</button>
          </form>
        </div>
      `;
      document.body.appendChild(confirmationDialog);

      // Payment method selection logic
      const paymentSelect = document.getElementById("payment");
      const paymentDetails = document.getElementById("payment-details");
      const creditCardFields = document.getElementById("credit-card-fields");
      const paypalFields = document.getElementById("paypal-fields");
      const codFields = document.getElementById("cod-fields");

      // Function to update payment fields based on the selected payment method
      function updatePaymentFields() {
        paymentDetails.style.display = "block";
        creditCardFields.style.display = "none";
        paypalFields.style.display = "none";
        codFields.style.display = "none";

        if (paymentSelect.value === "credit_card") {
          creditCardFields.style.display = "block";
        } else if (paymentSelect.value === "paypal") {
          paypalFields.style.display = "block";
        } else if (paymentSelect.value === "cash_on_delivery") {
          codFields.style.display = "block";
        }
      }

      // Listen for changes in the payment method dropdown
      paymentSelect.addEventListener("change", updatePaymentFields);

      // Trigger the update function immediately to handle the default selection
      updatePaymentFields();

      // Handle form submission
      document.getElementById("checkout-form").addEventListener("submit", (e) => {
        e.preventDefault();
        alert("Thank you for your purchase!");
        localStorage.removeItem("cart");
        location.reload();
      });

      // Handle cancel button
      document.querySelector(".cancel-btn").addEventListener("click", () => {
        confirmationDialog.remove();
      });
    });
  } else {
    console.error("Check Out button not found!");
  }
});