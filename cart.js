function displayCartItems() { 
    const cart = JSON.parse(localStorage.getItem('quickmartCart')) || [];
    const cartCount = document.getElementById('cart-count');
    const itemsCount = document.getElementById('items-count');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartWithItems = document.getElementById('cart-with-items');
    const cartItemsContainer = document.getElementById('cart-items-container');
  
    cartCount.textContent = cart.length;
    itemsCount.textContent = cart.length;
  
    if (cart.length === 0) {
      emptyCartMessage.style.display = 'block';
      cartWithItems.style.display = 'none';
      return;
    } else {
      emptyCartMessage.style.display = 'none';
      cartWithItems.style.display = 'block';
    }
  
    cartItemsContainer.innerHTML = '';
    let subtotal = 0;
  
    cart.forEach((item, index) => {
      subtotal += item.price * item.quantity;
  
      const cartItemElement = document.createElement('div');
      cartItemElement.className = 'cart-item';
      cartItemElement.innerHTML = `
        <img src="/api/placeholder/400/320" alt="${item.name}">
        <div class="item-details">
          <h3 class="item-title">${item.name}</h3>
          <div class="item-price">₹${item.price.toFixed(2)}</div>
          <p>In Stock</p>
          <div class="item-actions">
            <div class="quantity-selector">
              <button onclick="updateQuantity(${index}, -1)">-</button>
              <input type="text" value="${item.quantity}" readonly>
              <button onclick="updateQuantity(${index}, 1)">+</button>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
          </div>
        </div>
      `;
      cartItemsContainer.appendChild(cartItemElement);
    });
  
    const taxRate = 0.05;
    const tax = subtotal * taxRate;
    const shipping = subtotal > 0 ? 49.99 : 0;
    const total = subtotal + tax + shipping;
  
    document.getElementById('subtotal').textContent = `₹${subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `₹${tax.toFixed(2)}`;
    document.getElementById('shipping').textContent = `₹${shipping.toFixed(2)}`;
    document.getElementById('total').textContent = `₹${total.toFixed(2)}`;
}
  
function updateQuantity(index, change) {
    const cart = JSON.parse(localStorage.getItem('quickmartCart')) || [];
    if (cart[index]) {
      cart[index].quantity += change;
      if (cart[index].quantity < 1) {
        cart[index].quantity = 1;
      }
      localStorage.setItem('quickmartCart', JSON.stringify(cart));
      displayCartItems();
    }
}
  
function removeFromCart(index) {
    const cart = JSON.parse(localStorage.getItem('quickmartCart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('quickmartCart', JSON.stringify(cart));
    displayCartItems();
}
  
// Run on page load
window.addEventListener('DOMContentLoaded', () => {
    displayCartItems();
});