document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.nav-item').forEach(nav => {
        nav.classList.remove('active');
      });
      item.classList.add('active');
    });
  });
