// checkout.js - Handles the checkout process
document.addEventListener('DOMContentLoaded', function() {
    // Get page elements
    const checkoutBtn = document.getElementById('checkout-btn');
    const checkoutForm = document.getElementById('checkout-form');
    const cartContainer = document.querySelector('.cart-container');
    const backToCartBtn = document.getElementById('back-to-cart');
    const placeOrderBtn = document.getElementById('place-order');
    const checkoutSection = document.getElementById('checkout-section');
    const cartSection = document.getElementById('cart-section');
    const orderSummary = document.getElementById('order-summary');
    const subtotalEl = document.getElementById('subtotal');
    const taxEl = document.getElementById('tax');
    const shippingEl = document.getElementById('shipping');
    const totalEl = document.getElementById('total');
    const formErrorMessages = document.getElementById('form-error-messages');
    const orderConfirmation = document.getElementById('order-confirmation');
    const orderConfirmationDetails = document.getElementById('order-confirmation-details');
    
    // Cart data will be stored here
    let cartItems = [];
    let orderDetails = {
      subtotal: 0,
      tax: 0,
      shipping: 5.99,
      total: 0
    };
    
    // Initialize - load cart from localStorage
    initCart();
    
    // Add event listeners
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', proceedToCheckout);
    }
    
    if (backToCartBtn) {
      backToCartBtn.addEventListener('click', goBackToCart);
    }
    
    if (placeOrderBtn) {
      placeOrderBtn.addEventListener('click', submitOrder);
    }
    
    if (checkoutForm) {
      checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        validateAndSubmitForm();
      });
    }
    
    // Initialize cart from localStorage
    function initCart() {
      const savedCart = localStorage.getItem('cartItems');
      if (savedCart) {
        cartItems = JSON.parse(savedCart);
        updateCartDisplay();
        calculateOrderTotals();
      } else {
        cartItems = [];
        updateEmptyCartMessage();
      }
    }
    
    // Update cart display
    function updateCartDisplay() {
      if (cartContainer) {
        if (cartItems.length === 0) {
          updateEmptyCartMessage();
          return;
        }
        
        let cartHTML = '<ul class="cart-items">';
        cartItems.forEach((item, index) => {
          cartHTML += `
            <li class="cart-item" data-id="₹{item.id}">
              <div class="item-image">
                <img src="${item.image}" alt="${item.name}">
              </div>
              <div class="item-details">
                <h3>${item.name}</h3>
                <p class="item-price">$${item.price.toFixed(2)}</p>
                <div class="quantity-controls">
                  <button class="quantity-btn decrease" data-index="${index}">-</button>
                  <span class="quantity">${item.quantity}</span>
                  <button class="quantity-btn increase" data-index="${index}">+</button>
                </div>
              </div>
              <button class="remove-item" data-index="${index}">Remove</button>
            </li>
          `;
        });
        cartHTML += '</ul>';
        
        cartContainer.innerHTML = cartHTML;
        
        // Add event listeners for quantity controls and remove buttons
        document.querySelectorAll('.quantity-btn.decrease').forEach(btn => {
          btn.addEventListener('click', decreaseQuantity);
        });
        
        document.querySelectorAll('.quantity-btn.increase').forEach(btn => {
          btn.addEventListener('click', increaseQuantity);
        });
        
        document.querySelectorAll('.remove-item').forEach(btn => {
          btn.addEventListener('click', removeCartItem);
        });
        
        if (checkoutBtn) {
          checkoutBtn.disabled = false;
        }
      }
      
      // Also update the order summary if it exists
      updateOrderSummary();
    }
    
    // Show empty cart message
    function updateEmptyCartMessage() {
      if (cartContainer) {
        cartContainer.innerHTML = '<div class="empty-cart"><p>Your cart is empty</p><a href="products.html" class="continue-shopping">Continue Shopping</a></div>';
      }
      
      if (checkoutBtn) {
        checkoutBtn.disabled = true;
      }
    }
    
    // Decrease item quantity
    function decreaseQuantity(e) {
      const index = parseInt(e.target.dataset.index);
      if (cartItems[index].quantity > 1) {
        cartItems[index].quantity--;
      } else {
        removeCartItem(e);
        return;
      }
      
      saveCart();
      updateCartDisplay();
      calculateOrderTotals();
    }
    
    // Increase item quantity
    function increaseQuantity(e) {
      const index = parseInt(e.target.dataset.index);
      cartItems[index].quantity++;
      
      saveCart();
      updateCartDisplay();
      calculateOrderTotals();
    }
    
    // Remove item from cart
    function removeCartItem(e) {
      const index = parseInt(e.target.dataset.index);
      cartItems.splice(index, 1);
      
      saveCart();
      updateCartDisplay();
      calculateOrderTotals();
      
      if (cartItems.length === 0) {
        updateEmptyCartMessage();
      }
    }
    
    // Save cart to localStorage
    function saveCart() {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
    
    // Calculate order totals
    function calculateOrderTotals() {
      orderDetails.subtotal = cartItems.reduce((total, item) => {
        return total + (item.price * item.quantity);
      }, 0);
      
      orderDetails.tax = orderDetails.subtotal * 0.0825; // 8.25% tax rate
      orderDetails.total = orderDetails.subtotal + orderDetails.tax + orderDetails.shipping;
      
      updateOrderSummary();
    }
    
    // Update order summary display
    function updateOrderSummary() {
      if (subtotalEl) {
        subtotalEl.textContent = `$${orderDetails.subtotal.toFixed(2)}`;
      }
      
      if (taxEl) {
        taxEl.textContent = `$${orderDetails.tax.toFixed(2)}`;
      }
      
      if (shippingEl) {
        shippingEl.textContent = `$${orderDetails.shipping.toFixed(2)}`;
      }
      
      if (totalEl) {
        totalEl.textContent = `$${orderDetails.total.toFixed(2)}`;
      }
    }
    
    // Show checkout form
    function proceedToCheckout() {
      if (cartItems.length === 0) {
        alert('Your cart is empty. Add items before checkout.');
        return;
      }
      
      // Hide cart section, show checkout section
      if (cartSection) {
        cartSection.classList.add('hidden');
      }
      
      if (checkoutSection) {
        checkoutSection.classList.remove('hidden');
      }
      
      // Update order summary
      updateOrderSummary();
    }
    
    // Go back to cart
    function goBackToCart() {
      if (cartSection) {
        cartSection.classList.remove('hidden');
      }
      
      if (checkoutSection) {
        checkoutSection.classList.add('hidden');
      }
    }
    
    // Validate and submit the form
    function validateAndSubmitForm() {
      // Reset error messages
      if (formErrorMessages) {
        formErrorMessages.innerHTML = '';
      }
      
      let isValid = true;
      let errors = [];
      
      // Get form fields
      const firstName = document.getElementById('first-name')?.value.trim();
      const lastName = document.getElementById('last-name')?.value.trim();
      const email = document.getElementById('email')?.value.trim();
      const address = document.getElementById('address')?.value.trim();
      const city = document.getElementById('city')?.value.trim();
      const state = document.getElementById('state')?.value.trim();
      const zipcode = document.getElementById('zipcode')?.value.trim();
      const cardNumber = document.getElementById('card-number')?.value.trim();
      const cardExpiry = document.getElementById('card-expiry')?.value.trim();
      const cardCvv = document.getElementById('card-cvv')?.value.trim();
      
      // Validate required fields
      if (!firstName) {
        isValid = false;
        errors.push('First name is required');
      }
      
      if (!lastName) {
        isValid = false;
        errors.push('Last name is required');
      }
      
      if (!email) {
        isValid = false;
        errors.push('Email is required');
      } else if (!isValidEmail(email)) {
        isValid = false;
        errors.push('Please enter a valid email address');
      }
      
      if (!address) {
        isValid = false;
        errors.push('Address is required');
      }
      
      if (!city) {
        isValid = false;
        errors.push('City is required');
      }
      
      if (!state) {
        isValid = false;
        errors.push('State is required');
      }
      
      if (!zipcode) {
        isValid = false;
        errors.push('Zip code is required');
      } else if (!isValidZipcode(zipcode)) {
        isValid = false;
        errors.push('Please enter a valid zip code');
      }
      
      if (!cardNumber) {
        isValid = false;
        errors.push('Card number is required');
      } else if (!isValidCardNumber(cardNumber)) {
        isValid = false;
        errors.push('Please enter a valid card number');
      }
      
      if (!cardExpiry) {
        isValid = false;
        errors.push('Card expiration date is required');
      } else if (!isValidCardExpiry(cardExpiry)) {
        isValid = false;
        errors.push('Please enter a valid expiration date (MM/YY)');
      }
      
      if (!cardCvv) {
        isValid = false;
        errors.push('CVV is required');
      } else if (!isValidCvv(cardCvv)) {
        isValid = false;
        errors.push('Please enter a valid CVV (3-4 digits)');
      }
      
      // Display error messages if any
      if (!isValid && formErrorMessages) {
        let errorHTML = '<ul class="error-list">';
        errors.forEach(error => {
          errorHTML += `<li>${error}</li>`;
        });
        errorHTML += '</ul>';
        formErrorMessages.innerHTML = errorHTML;
        formErrorMessages.classList.remove('hidden');
        
        // Scroll to errors
        formErrorMessages.scrollIntoView({ behavior: 'smooth' });
        return false;
      }
      
      // If everything is valid, submit the order
      submitOrder();
      return true;
    }
    
    // Submit the order
    function submitOrder() {
      // In a real application, you would send the order details to a server
      // Here we'll simulate a successful order
      
      // Create order object
      const order = {
        id: generateOrderId(),
        items: [...cartItems],
        customer: {
          firstName: document.getElementById('first-name')?.value.trim(),
          lastName: document.getElementById('last-name')?.value.trim(),
          email: document.getElementById('email')?.value.trim(),
          address: document.getElementById('address')?.value.trim(),
          city: document.getElementById('city')?.value.trim(),
          state: document.getElementById('state')?.value.trim(),
          zipcode: document.getElementById('zipcode')?.value.trim()
        },
        payment: {
          cardNumber: maskCardNumber(document.getElementById('card-number')?.value.trim()),
          cardExpiry: document.getElementById('card-expiry')?.value.trim()
        },
        orderDetails: {...orderDetails},
        orderDate: new Date().toISOString()
      };
      
      // Simulate API call delay
      showLoadingState();
      
      setTimeout(() => {
        // Clear the cart
        cartItems = [];
        saveCart();
        
        // Show order confirmation
        hideLoadingState();
        showOrderConfirmation(order);
        
        // Save order to order history (localStorage)
        saveOrderToHistory(order);
      }, 1500);
    }
    
    // Show loading state
    function showLoadingState() {
      if (placeOrderBtn) {
        placeOrderBtn.disabled = true;
        placeOrderBtn.textContent = 'Processing...';
      }
      
      // Optional: Add a loading overlay
      const loadingOverlay = document.createElement('div');
      loadingOverlay.className = 'loading-overlay';
      loadingOverlay.innerHTML = '<div class="spinner"></div>';
      document.body.appendChild(loadingOverlay);
    }
    
    // Hide loading state
    function hideLoadingState() {
      if (placeOrderBtn) {
        placeOrderBtn.disabled = false;
        placeOrderBtn.textContent = 'Place Order';
      }
      
      // Remove loading overlay if it exists
      const loadingOverlay = document.querySelector('.loading-overlay');
      if (loadingOverlay) {
        document.body.removeChild(loadingOverlay);
      }
    }
    
    // Show order confirmation
    function showOrderConfirmation(order) {
      if (checkoutSection) {
        checkoutSection.classList.add('hidden');
      }
      
      if (orderConfirmation) {
        orderConfirmation.classList.remove('hidden');
      }
      
      if (orderConfirmationDetails) {
        let detailsHTML = `
          <h3>Order #${order.id} Confirmation</h3>
          <p>Thank you for your order, ${order.customer.firstName}!</p>
          <p>We've sent a confirmation email to ${order.customer.email}</p>
          
          <div class="confirmation-details">
            <div class="shipping-info">
              <h4>Shipping Address</h4>
              <p>${order.customer.firstName} ${order.customer.lastName}</p>
              <p>${order.customer.address}</p>
              <p>${order.customer.city}, ${order.customer.state} ${order.customer.zipcode}</p>
            </div>
            
            <div class="payment-info">
              <h4>Payment Information</h4>
              <p>Card: ${order.payment.cardNumber}</p>
              <p>Expiration: ${order.payment.cardExpiry}</p>
            </div>
          </div>
          
          <div class="order-items">
            <h4>Order Items</h4>
            <ul>
        `;
        
        order.items.forEach(item => {
          detailsHTML += `
            <li>
              <span>${item.name} x ${item.quantity}</span>
              <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </li>
          `;
        });
        
        detailsHTML += `
            </ul>
          </div>
          
          <div class="order-summary">
            <div class="summary-line">
              <span>Subtotal:</span>
              <span>$${order.orderDetails.subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-line">
              <span>Tax:</span>
              <span>$${order.orderDetails.tax.toFixed(2)}</span>
            </div>
            <div class="summary-line">
              <span>Shipping:</span>
              <span>$${order.orderDetails.shipping.toFixed(2)}</span>
            </div>
            <div class="summary-line total">
              <span>Total:</span>
              <span>$${order.orderDetails.total.toFixed(2)}</span>
            </div>
          </div>
          
          <div class="confirmation-actions">
            <a href="index.html" class="button">Continue Shopping</a>
          </div>
        `;
        
        orderConfirmationDetails.innerHTML = detailsHTML;
      }
    }
    
    // Save order to order history in localStorage
    function saveOrderToHistory(order) {
      let orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
      orderHistory.push(order);
      localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
    }
    
    // Helper functions
    function generateOrderId() {
      return 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }
    
    function maskCardNumber(cardNumber) {
      if (!cardNumber) return '';
      // Remove all non-digit characters
      cardNumber = cardNumber.replace(/\D/g, '');
      return '**** **** **** ' + cardNumber.slice(-4);
    }
    
    function isValidEmail(email) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    }
    
    function isValidZipcode(zipcode) {
      const regex = /^\d{5}(-\d{4})?$/;
      return regex.test(zipcode);
    }
    
    function isValidCardNumber(cardNumber) {
      // Remove all non-digit characters
      cardNumber = cardNumber.replace(/\D/g, '');
      // Check if the number is between 13-19 digits
      return cardNumber.length >= 13 && cardNumber.length <= 19;
    }
    
    function isValidCardExpiry(expiry) {
      const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
      if (!regex.test(expiry)) return false;
      
      // Check if the date is in the future
      const [month, year] = expiry.split('/');
      const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
      const currentDate = new Date();
      
      return expiryDate > currentDate;
    }
    
    function isValidCvv(cvv) {
      // CVV should be 3-4 digits
      const regex = /^\d{3,4}$/;
      return regex.test(cvv);
    }
  });