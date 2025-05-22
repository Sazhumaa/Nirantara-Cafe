  // Menampilkan cart count dari localStorage
  document.addEventListener('DOMContentLoaded', () => {
    const count = parseInt(localStorage.getItem('cartCount')) || 0;
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
      cartCountElement.textContent = count;
    }
  });