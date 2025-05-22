// Ambil referensi elemen
const addToCartButton = document.getElementById('add-to-cart');
const cartCountSpan = document.getElementById('cart-count');

// Fungsi untuk update tampilan jumlah keranjang
function updateCartCount() {
  const currentCount = parseInt(localStorage.getItem('cartCount')) || 0;
  if (cartCountSpan) {
    cartCountSpan.textContent = currentCount;
  }
}

// Fungsi untuk menambah ke cart
function addToCart() {
  let currentCount = parseInt(localStorage.getItem('cartCount')) || 0;
  currentCount += 1;
  localStorage.setItem('cartCount', currentCount);
  updateCartCount();
}

// Pasang listener jika tombol ada
if (addToCartButton) {
  addToCartButton.addEventListener('click', addToCart);
}

// Update tampilan saat halaman dibuka
document.addEventListener('DOMContentLoaded', updateCartCount);

document.addEventListener("DOMContentLoaded", () => {
  localStorage.setItem("cartCount", 0);

  const cartCountSpan = document.getElementById("cart-count");
  if (cartCountSpan) {
    cartCountSpan.textContent = 0;
  }
});
