import { config } from './config.js'; 

async function getAllProduct() {
  try {
    const response = await fetch(`${config.API_BASE_URL}/products`, {
      method: "GET", 
      headers: { "Content-Type": "application/json" }
    });

    if (!response.ok) throw new Error("Network error");

    const data = await response.json();
    return data;

  } catch (err) {
    console.error("Error fetching products:", err);
  }
}

let productsList = []; 

async function loadProducts() {
  const products = await getAllProduct(); 

  if (products && Array.isArray(products)) {
    productsList = products;
    console.log("✅ Products loaded successfully!");
    console.log(productsList);
  } else {
    console.error("No products found or invalid response.");
  }
}

async function addToCart(productId, qty = 1) {
  try {
    const response = await fetch(`${config.API_BASE_URL}/cart/add?productId=${productId}&qty=${qty}`, {
      method: "POST",
      credentials: "include", // keep cookie session
    });

    if (!response.ok) throw new Error("Failed to add to cart");
    const data = await response.json();
    console.log("🛒 Cart updated:", data);
    return data;
  } catch (err) {
    console.error("Error adding to cart:", err);
  }
}

async function Electronics() {
  await loadProducts();

  const iphone16 = productsList[0];
  if (!iphone16) {
    console.error("❌ No products available.");
    return;
  }

  const { id: iphone16Id, name, description, price } = iphone16;

  console.log("📦 Product:", iphone16Id, name, description, price);

  // Update DOM
  const priceElement = document.querySelector('.product .price .new');
  if (priceElement) priceElement.textContent = `$${price}`;

  const titleElement = document.querySelector('.product .title a');
  if (titleElement) titleElement.textContent = name;

  const categoryElement = document.querySelector('.product .category a');
  if (categoryElement) categoryElement.textContent = "ELECTRONICS";

  const productElement = document.querySelector('.product');
  if (productElement) productElement.setAttribute('data-product-id', iphone16Id);

  // ✅ Add to cart button logic
  const addButtons = document.querySelectorAll(".add-to-cart");
  addButtons.forEach(button => {
    button.addEventListener("click", async (e) => {
      const productElement = e.target.closest(".product");
      const productId = productElement?.getAttribute("data-product-id");

      if (!productId) {
        console.error("❌ No product ID found for button click.");
        return;
      }

      console.log("🛒 Adding product:", productId);
      const result = await addToCart(productId, 1);

      if (result) {
        alert("✅ Product added to cart!");
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", Electronics);
