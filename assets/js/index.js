import { config } from './config.js'; 


async function addToCart(productId, qty = 1) {
  try {
    const response = await fetch(
      `${config.API_BASE_URL}/carts/add?productId=${productId}&qty=${qty}`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (!response.ok) throw new Error("Failed to add to cart");

    const data = await response.json();
    console.log("🛒 Cart updated:", data);

    // ✅ store guest_id if backend returns it
    if (data?.guest_id) {
      guestId = data.guest_id;
      console.log("🎯 Guest ID saved:", guestId);
    }

    return data;
    
  } catch (err) {
    console.error("❌ Error adding to cart:", err);
  }
}