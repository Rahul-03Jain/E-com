document.addEventListener('DOMContentLoaded', function() {
  const nightModeToggle = document.getElementById('nightModeToggle');
  
  // Apply initial state from localStorage
  if (localStorage.getItem('nightMode') === 'true') {
    document.body.classList.add('night-mode');
    updateButtonAppearance(true);
  }
  
  if (nightModeToggle) {
    nightModeToggle.addEventListener('click', function() {
      // Toggle night mode class on body
      const willBeNightMode = !document.body.classList.contains('night-mode');
      
      // Apply or remove the class
      if (willBeNightMode) {
        document.body.classList.add('night-mode');
      } else {
        document.body.classList.remove('night-mode');
      }
      
      // Save state to localStorage
      localStorage.setItem('nightMode', willBeNightMode);
      
      // Update button text and icon
      updateButtonAppearance(willBeNightMode);
    });
  }
  
  // Function to update button appearance
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
  
  // Initialize button appearance based on current state
  updateButtonAppearance(document.body.classList.contains('night-mode'));
});