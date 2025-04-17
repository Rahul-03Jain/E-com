// cart.js
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(product) {
  let cart = getCart();
  const index = cart.findIndex(item => item.id === product.id);
  if (index > -1) {
      cart[index].quantity += 1;
  } else {
      product.quantity = 1;
      cart.push(product);
  }
  saveCart(cart);
  alert("Added to cart!");
}

function removeFromCart(productId) {
  let cart = getCart().filter(item => item.id !== productId);
  saveCart(cart);
  displayCart();
}

function updateQuantity(productId, quantity) {
  let cart = getCart();
  const item = cart.find(item => item.id === productId);
  if (item) {
      item.quantity = quantity;
      saveCart(cart);
      displayCart();
  }
}

function displayCart() {
  const cart = getCart();
  const cartContainer = document.getElementById("cart-container");
  const totalEl = document.getElementById("total");
  cartContainer.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
      cartContainer.innerHTML = "<p>Your cart is empty.</p>";
      totalEl.textContent = "";
      return;
  }

  cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      cartContainer.innerHTML += `
          <div class="cart-item">
              <h4>${item.name}</h4>
              <p>₹${item.price} x 
                  <input type="number" value="${item.quantity}" min="1"
                         onchange="updateQuantity('${item.id}', this.value)">
              = ₹${itemTotal}</p>
              <button onclick="removeFromCart('${item.id}')">Remove</button>
          </div>
      `;
  });

  totalEl.textContent = `Total: ₹${total}`;
}
