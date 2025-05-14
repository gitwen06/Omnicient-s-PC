import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const auth = getAuth();
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartTab = document.querySelector(".cartTab .listCart");
  const cartCount = document.getElementById("cart-count");
  const totalPriceElement = document.createElement("div");
  const loggedInUser = localStorage.getItem("loggedInUser");
  totalPriceElement.classList.add("total-price");
  document.querySelector(".cartTab").appendChild(totalPriceElement);

  // Update cart count and total price on page load
  updateCartCount();
  renderCartItems();

  // Add event listeners to "Add to Cart" buttons
  document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      // Check if the user is logged in
      onAuthStateChanged(auth, (user) => {
        if (loggedInUser) {
          // User is logged in, proceed to add to cart
          const productCard = event.target.closest(".product-card");
          const product = {
            name: productCard.querySelector("h3").textContent,
            price: parseFloat(
              productCard.querySelector("p").textContent.replace(/[₱,]/g, "")
            ),
            img: productCard.querySelector("img").src,
            quantity: 1,
          };

          // Show confirmation pop-up
          showConfirmationPopup(product);
        } else {
          // User is not logged in, show an alert or redirect to login
          alert("You must be logged in to add items to the cart.");
          window.location.href = "Login.html"; // Redirect to login page
        }
      });
    });
  });

  // Function to show the confirmation pop-up
  function showConfirmationPopup(product) {
    const modal = document.createElement("div");
    modal.classList.add("confirmation-modal");

    modal.innerHTML = `
      <div class="modal-content">
        <h2>Confirm Add to Cart</h2>
        <p>Do you want to add <strong>${product.name}</strong> to your cart?</p>
        <div class="modal-actions">
          <button class="confirm-btn">Yes</button>
          <button class="cancel-btn">No</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector(".confirm-btn").addEventListener("click", () => {
      addToCart(product);
      closeModal(modal);
    });

    modal.querySelector(".cancel-btn").addEventListener("click", () => {
      closeModal(modal);
    });
  }

  // Function to close the modal
  function closeModal(modal) {
    document.body.removeChild(modal);
  }

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
          <span class="minus" data-index="${index}">-</span>
          <span>${item.quantity}</span>
          <span class="plus" data-index="${index}">+</span>
        </div>
        <button class="discard" data-index="${index}">Remove</button>
      `;

      cartTab.appendChild(cartItem);
    });

    // Add event listeners for quantity buttons
    document.querySelectorAll(".minus").forEach((button) => {
      button.addEventListener("click", (event) => {
        const index = event.target.dataset.index;
        if (cart[index].quantity > 1) {
          cart[index].quantity -= 1;
        }
        else {
          alert("Minimum quantity is 1");
          return;
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
    document.body.classList.toggle("showCart");
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
            <select id="payment-method" name="payment-method" required>
              <option value="cash-on-delivery">Cash on Delivery</option>
            </select> 
            <button type="submit" class="confirm-btn">Confirm Purchase</button>
            <button type="button" class="cancel-btn">Cancel</button>
          </form>
        </div>
      `;
      document.body.appendChild(confirmationDialog);

      // Autofill name and email fields
      const db = getFirestore();
      onAuthStateChanged(auth, async (user) => {
        if (loggedInUser) {
          // Try to get username from Firestore
          try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
              document.getElementById("name").value = userDoc.data().username || "";
              document.getElementById("email").value = user.email || "";
            }
          } catch (e) {
            // fallback: leave name blank if not found
          }
        }
      });

      // Handle form submission
      document.getElementById("checkout-form").addEventListener("submit", (e) => {
        if (loggedInUser) {
          e.preventDefault();

          // Get user input values
          const userName = document.getElementById("name").value;
          const userEmail = document.getElementById("email").value;
          const userAddress = document.getElementById("address").value;

          // Generate a random order ID
          const orderId = `ORD-${Math.floor(Math.random() * 1000000)}`;

          // Serialize the cart data
          const serializedCart = encodeURIComponent(JSON.stringify(cart));

          // Build the URL for Tracking.html
          const trackingUrl = `Tracking.html?orderId=${orderId}&name=${encodeURIComponent(userName)}&email=${encodeURIComponent(userEmail)}&address=${encodeURIComponent(userAddress)}&products=${serializedCart}`;

          // Clear the cart
          localStorage.removeItem("cart");
          cart.length = 0; // Reset the cart array

          // Redirect to Tracking.html
          window.location.href = trackingUrl;
        }
        else {
          alert("You must be logged in to complete the purchase.");
          window.location.href = "Login.html"; // Redirect to login page
        }
      });

      // Handle cancel button
      document.querySelector(".cancel-btn").addEventListener("click", () => {
        confirmationDialog.remove();
      });
    });
  } else {
  console.error("Check Out button not found!");
}

// Menu toggle functionality
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("list-1");

// Toggle the visibility of the navigation links
menuToggle.addEventListener("click", function () {
  navLinks.classList.toggle("active");
});

// Pop-up navigation menu functionality
const popupNav = document.getElementById("popup-nav");
const closePopup = document.getElementById("close-popup");

// Show the pop-up navigation menu
menuToggle.addEventListener("click", function () {
  popupNav.classList.add("active");
});

// Close the pop-up navigation menu
closePopup.addEventListener("click", function () {
  popupNav.classList.remove("active");
});
});