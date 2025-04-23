document.addEventListener('DOMContentLoaded', function () {
    const nightModeToggle = document.getElementById('nightModeToggle');
    if (localStorage.getItem('nightMode') === 'true') {
      document.body.classList.add('dark-mode');
      updateButtonAppearance(true);
    }
    if (nightModeToggle) {
      nightModeToggle.addEventListener('click', function () {
        const willBeNightMode = !document.body.classList.contains('dark-mode');
        if (willBeNightMode) {
          document.body.classList.add('dark-mode');
        } else {
          document.body.classList.remove('dark-mode');
        }
        localStorage.setItem('nightMode', willBeNightMode);
        updateButtonAppearance(willBeNightMode);
      });
    }
    function updateButtonAppearance(isNightMode) {
      const button = document.getElementById('nightModeToggle');
      if (!button) return;
      const iconElement = button.querySelector('.icon');
      const textElement = button.querySelector('.text');
      if (isNightMode) {
        if (iconElement) iconElement.textContent = '🌙';
        if (textElement) textElement.textContent = 'Dark Mode';
      } else {
        if (iconElement) iconElement.textContent = '☀️';
        if (textElement) textElement.textContent = 'Light Mode';
      }
    }
    updateButtonAppearance(document.body.classList.contains('dark-mode'));
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