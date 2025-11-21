import { CONFIG } from './config.js';

let guestId = null; // frontend tracking (optional)
console.log("🚀 Config loaded:", CONFIG);

// Add product to cart
async function addToCart(productId, qty = 1) {
  try {
    const response = await fetch(`${CONFIG.API_URL}/cart/add?productId=${productId}&qty=${qty}`, {
      method: "POST",
      credentials: "include", // ✅ send cookies
    });

    if (!response.ok) throw new Error("Failed to add to cart");

    const data = await response.json();
    console.log("🛒 Cart updated:", data);

    // save guestId locally for frontend tracking
    if (data?.guest_id) guestId = data.guest_id;

    updateCartUI(data);
    return data;
  } catch (err) {
    console.error("❌ Error adding to cart:", err);
    alert("Failed to add item to cart. Please try again.");
  }
}

// Example: dynamically update cart counter
function updateCartUI(cartData) {
  const cartCountElem = document.querySelector('#cart-count');
  if (cartCountElem && cartData?.items?.length !== undefined) {
    cartCountElem.textContent = cartData.items.length;
  }
}

// Attach buttons
function initAddToCartButtons() {
  const buttons = document.querySelectorAll('.add-to-cart1');
  buttons.forEach(button => {
    button.addEventListener('click', async () => {
      const productId = parseInt(button.dataset.productId) || 1;
      const qty = parseInt(button.dataset.qty) || 1;

      button.disabled = true;
      await addToCart(productId, qty);
      button.disabled = false;

      // optional modal
      const modalId = button.dataset.bsTarget || '#exampleModal-Cart';
      const modalElem = document.querySelector(modalId);
      if (modalElem) new bootstrap.Modal(modalElem).show();
    });
  });
}

// Init
document.addEventListener('DOMContentLoaded', initAddToCartButtons);
