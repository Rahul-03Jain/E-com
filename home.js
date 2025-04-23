document.addEventListener('DOMContentLoaded', function () {
    const nightModeToggle = document.getElementById('nightModeToggle');
  
    // Apply stored preference on load
    if (localStorage.getItem('nightMode') === 'true') {
      document.body.classList.add('night-mode');
      updateButtonAppearance(true);
    }
  
    if (nightModeToggle) {
      nightModeToggle.addEventListener('click', function () {
        const isNight = !document.body.classList.contains('night-mode');
  
        if (isNight) {
          document.body.classList.add('night-mode');
        } else {
          document.body.classList.remove('night-mode');
        }
  
        localStorage.setItem('nightMode', isNight);
        updateButtonAppearance(isNight);
      });
    }
  
    function updateButtonAppearance(isNightMode) {
      const icon = nightModeToggle.querySelector('.icon');
      const text = nightModeToggle.querySelector('.text');
  
      if (isNightMode) {
        if (icon) icon.textContent = '🌙';
        if (text) text.textContent = 'Dark Mode';
      } else {
        if (icon) icon.textContent = '☀️';
        if (text) text.textContent = 'Light Mode';
      }
    }
  
    // Set the initial state of the toggle
    updateButtonAppearance(document.body.classList.contains('night-mode'));
  });
  function addToCart(item) {
    const cart = JSON.parse(localStorage.getItem('quickmartCart')) || [];
  
    // Check if item already exists
    const existingIndex = cart.findIndex(cartItem => cartItem.id === item.id);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      item.quantity = 1;
      cart.push(item);
    }
  
    localStorage.setItem('quickmartCart', JSON.stringify(cart));
  
    // Update cart count in header
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
      cartCount.textContent = cart.reduce((sum, i) => sum + i.quantity, 0);
    }
  
    alert(`${item.name} added to cart!`);
  }  