// cart-custom.js - Enhanced for full cart page functionality

// Cart Data Structure
const ShoppingCart = {
  items: [], // Will hold cart items
  
  // Add item to cart
  addItem: function(productId, name, price, quantity = 1, image = '') {
    // Check if item already exists in cart
    const existingItemIndex = this.items.findIndex(item => item.productId === productId);
    
    if (existingItemIndex !== -1) {
      // If item exists, increase quantity
      this.items[existingItemIndex].quantity += quantity;
    } else {
      // If item doesn't exist, add new item
      this.items.push({
        productId,
        name,
        price,
        quantity,
        image
      });
    }
    
    // Update cart display and save to localStorage
    this.updateCartDisplay();
    this.saveCart();
  },
  
  // Remove item from cart
  removeItem: function(productId) {
    this.items = this.items.filter(item => item.productId !== productId);
    this.updateCartDisplay();
    this.saveCart();
  },
  
  // Update item quantity
  updateQuantity: function(productId, quantity) {
    const itemIndex = this.items.findIndex(item => item.productId === productId);
    
    if (itemIndex !== -1) {
      if (quantity <= 0) {
        this.removeItem(productId);
      } else {
        this.items[itemIndex].quantity = quantity;
        this.updateCartDisplay();
        this.saveCart();
      }
    }
  },
  
  // Calculate cart total
  getTotal: function() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  },
  
  // Save cart to localStorage
  saveCart: function() {
    localStorage.setItem('shoppingCart', JSON.stringify(this.items));
  },
  
  // Load cart from localStorage
  loadCart: function() {
    const savedCart = localStorage.getItem('shoppingCart');
    if (savedCart) {
      this.items = JSON.parse(savedCart);
      this.updateCartDisplay();
    }
  },
  
  // Clear the entire cart
  clearCart: function() {
    this.items = [];
    this.updateCartDisplay();
    this.saveCart();
  },
  
  // Update cart display in UI (both mini-cart and cart page)
  updateCartDisplay: function() {
    // Update cart counter
    const cartCounter = document.getElementById('cart-counter');
    const itemCount = this.items.reduce((total, item) => total + item.quantity, 0);
    if (cartCounter) cartCounter.textContent = `(${itemCount})`;
    
    // Update mini-cart (on homepage)
    const miniCartItems = document.getElementById('cart-items');
    if (miniCartItems) {
      miniCartItems.innerHTML = '';
      
      if (this.items.length === 0) {
        miniCartItems.innerHTML = '<p>Your cart is empty</p>';
      } else {
        this.items.forEach(item => {
          const itemElement = document.createElement('div');
          itemElement.className = 'cart-item';
          itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
              <h4>${item.name}</h4>
              <p>$${item.price} x ${item.quantity}</p>
            </div>
            <div class="item-controls">
              <button data-action="decrease" data-product-id="${item.productId}">-</button>
              <span>${item.quantity}</span>
              <button data-action="increase" data-product-id="${item.productId}">+</button>
              <button data-action="remove" data-product-id="${item.productId}">×</button>
            </div>
          `;
          miniCartItems.appendChild(itemElement);
        });
      }
    }
    
    // Update cart page (if on cart page)
    const cartItemsFull = document.getElementById('cart-items-full');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const shippingCost = document.getElementById('shipping-cost');
    const taxAmount = document.getElementById('tax-amount');
    const cartTotal = document.getElementById('cart-total');
    
    if (cartItemsFull) {
      cartItemsFull.innerHTML = '';
      
      if (this.items.length === 0) {
        cartItemsFull.innerHTML = '<div class="empty-cart-message">Your cart is empty</div>';
        
        // Disable checkout button when cart is empty
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
          checkoutBtn.disabled = true;
          checkoutBtn.style.opacity = '0.5';
          checkoutBtn.style.cursor = 'not-allowed';
        }
      } else {
        // Enable checkout button
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
          checkoutBtn.disabled = false;
          checkoutBtn.style.opacity = '1';
          checkoutBtn.style.cursor = 'pointer';
        }
        
        this.items.forEach(item => {
          const itemElement = document.createElement('div');
          itemElement.className = 'cart-item';
          itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
              <h4>${item.name}</h4>
              <p>$${item.price} each</p>
            </div>
            <div class="item-controls">
              <button data-action="decrease" data-product-id="${item.productId}">-</button>
              <span>${item.quantity}</span>
              <button data-action="increase" data-product-id="${item.productId}">+</button>
              <button data-action="remove" data-product-id="${item.productId}">×</button>
            </div>
            <div class="item-total">
              $${(item.price * item.quantity).toFixed(2)}
            </div>
          `;
          cartItemsFull.appendChild(itemElement);
        });
        
        // Calculate and update totals
        const subtotal = parseFloat(this.getTotal());
        const shipping = subtotal > 50 ? 0 : 5.99;
        const tax = subtotal * 0.0825; // Assuming 8.25% tax rate
        const total = subtotal + shipping + tax;
        
        if (cartSubtotal) cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        if (shippingCost) shippingCost.textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
        if (taxAmount) taxAmount.textContent = `$${tax.toFixed(2)}`;
        if (cartTotal) cartTotal.textContent = `$${total.toFixed(2)}`;
      }
    }
  }
};

// Helper function to show notification
function showNotification(message) {
  // Remove any existing notifications
  const existingNotifications = document.querySelectorAll('.cart-notification');
  existingNotifications.forEach(notification => {
    document.body.removeChild(notification);
  });
  
  // Create and add new notification
  const notification = document.createElement('div');
  notification.className = 'cart-notification';
  notification.textContent = message;
  document.body.appendChild(notification);
  
  // Fade in
  setTimeout(() => {
    notification.classList.add('visible');
  }, 10);
  
  // Fade out and remove
  setTimeout(() => {
    notification.classList.remove('visible');
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 500);
  }, 2000);
}

// Event handlers for cart interactions
function setupCartEventListeners() {
  // Add to cart button listeners
  document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', function() {
      const productCard = this.closest('.product-card');
      const productId = productCard.dataset.productId;
      const name = productCard.querySelector('h3').textContent;
      const price = parseFloat(productCard.querySelector('.price').textContent.replace('$', ''));
      const image = productCard.querySelector('img').src;
      
      ShoppingCart.addItem(productId, name, price, 1, image);
      
      // Show added to cart notification
      showNotification(`${name} added to cart!`);
    });
  });
  
  // Cart item control listeners (for mini cart or cart page)
  document.addEventListener('click', function(e) {
    if (e.target.hasAttribute('data-action')) {
      const action = e.target.getAttribute('data-action');
      const productId = e.target.getAttribute('data-product-id');
      
      if (action === 'increase') {
        const item = ShoppingCart.items.find(item => item.productId === productId);
        ShoppingCart.updateQuantity(productId, item.quantity + 1);
      } else if (action === 'decrease') {
        const item = ShoppingCart.items.find(item => item.productId === productId);
        ShoppingCart.updateQuantity(productId, item.quantity - 1);
      } else if (action === 'remove') {
        const item = ShoppingCart.items.find(item => item.productId === productId);
        ShoppingCart.removeItem(productId);
        showNotification(`${item.name} removed from cart`);
      }
    }
  });
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function() {
  // Load cart from localStorage
  ShoppingCart.loadCart();
  
  // Setup event listeners
  setupCartEventListeners();
});