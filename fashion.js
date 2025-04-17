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
  