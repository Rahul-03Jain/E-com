document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.getElementById('nightModeToggle');
  
    toggle.addEventListener('click', function () {
      document.body.classList.toggle('night-mode');
  
      const icon = this.querySelector('.icon');
      const text = this.querySelector('.text');
  
      if (document.body.classList.contains('night-mode')) {
        icon.textContent = '🌙';
        text.textContent = 'Dark Mode';
      } else {
        icon.textContent = '☀️';
        text.textContent = 'Light Mode';
      }
  
      localStorage.setItem('nightMode', document.body.classList.contains('night-mode'));
    });
  
    // On load, apply saved preference
    if (localStorage.getItem('nightMode') === 'true') {
      document.body.classList.add('night-mode');
      toggle.querySelector('.icon').textContent = '🌙';
      toggle.querySelector('.text').textContent = 'Dark Mode';
    }
  });
  