// Fungsi untuk menampilkan detail produk (jika digunakan di halaman lain)
function tampilkanDetailProduk(produk) {
  document.getElementById('produk-gambar').src = produk.gambar_produk;
  document.getElementById('produk-nama').textContent = produk.nama_produk;
  document.getElementById('produk-deskripsi').textContent = produk.deskripsi;
  document.getElementById('produk-harga').textContent = `Rp ${Number(produk.harga_produk).toLocaleString('id-ID')}`;
  document.getElementById('produk-lama').textContent = produk.lama_pembuatan || '7-8 Menit';
}

// Panggil semua fungsi saat halaman siap
document.addEventListener('DOMContentLoaded', () => {
  updateCartCountDisplay();
  renderCartItems();
  updateCartSummary();
});

// Menampilkan jumlah item di icon cart
function updateCartCountDisplay() {
  const cartCount = parseInt(localStorage.getItem('cartCount')) || 0;
  const cartCountElement = document.getElementById('cart-count');
  if (cartCountElement) {
    cartCountElement.textContent = cartCount;
  }
}

// Render isi keranjang dari localStorage
function renderCartItems() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const container = document.getElementById('cart-container');
  container.innerHTML = '';

  cartItems.forEach((item, index) => {
    const jumlah = item.jumlah || 1; // fallback ke 1 kalau undefined

    const itemHTML = `
<div class="flex justify-center items-center py-4">
  <div class="bg-white rounded-2xl shadow-md flex flex-col md:flex-row w-full max-w-3xl overflow-hidden p-4 md:p-6 gap-6">
    
    <!-- Kiri: Info Produk -->
    <div class="flex-1 space-y-3">
      <div class="flex items-center gap-3">
        <div class="w-6 h-6 rounded-full border-2 border-green-600 flex items-center justify-center bg-green-50">
          <svg class="w-3.5 h-3.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8.5 8.5a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.086l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
        </div>
        <h3 class="text-lg md:text-xl font-semibold text-gray-800">${item.nama_produk}</h3>
      </div>

      <div class="text-sm text-gray-600 space-y-1">
        <p><span class="font-medium">Estimasi Pembuatan:</span> 5 menit</p>
        <p><span class="font-medium">Estimasi Pengiriman:</span> 7-12 menit</p>
      </div>

      <p class="text-lg font-bold text-green-600">Rp ${Number(item.harga_produk).toLocaleString('id-ID')}</p>
    </div>

    <!-- Kanan: Gambar & Qty -->
    <div class="flex flex-col items-center justify-center gap-4">
      <img src="${item.gambar_produk}" alt="${item.nama_produk}" class="rounded-xl w-24 h-24 object-cover shadow-sm border border-gray-100">
      <div class="flex items-center gap-3">
        <button class="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 text-red-600 text-lg font-bold hover:bg-red-200 decrement-btn">−</button>
        <span class="text-base font-semibold quantity">${item.jumlah}</span>
        <button class="w-8 h-8 flex items-center justify-center rounded-full bg-green-100 text-green-600 text-lg font-bold hover:bg-green-200 increment-btn">+</button>
      </div>
    </div>

  </div>
</div>

    `;

    container.innerHTML += itemHTML;
  });

  attachQuantityListeners(); // Pasang tombol +/- lagi
}

document.addEventListener('DOMContentLoaded', () => {
  renderCartItems();
  updateCartSummary(); // Total harga dan jumlah item
});


// Event listener tombol increment/decrement
function attachQuantityListeners() {
  document.querySelectorAll('.increment-btn').forEach((btn, index) => {
    btn.addEventListener('click', () => updateItemQuantity(index, 1));
  });

  document.querySelectorAll('.decrement-btn').forEach((btn, index) => {
    btn.addEventListener('click', () => updateItemQuantity(index, -1));
  });
}

// Update jumlah item per produk (dan simpan ulang ke localStorage)
function updateItemQuantity(index, delta) {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

  if (cartItems[index]) {
    cartItems[index].jumlah += delta;

    if (cartItems[index].jumlah <= 0) {
      cartItems.splice(index, 1);
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    localStorage.setItem('cartCount', getTotalItemCount(cartItems));

    // Refresh halaman biar UI update semua
    location.reload();
  }
}

// Hitung total item dari semua produk di cart
function getTotalItemCount(cartItems) {
  return cartItems.reduce((total, item) => total + item.jumlah, 0);
}

// Update tampilan total harga dan jumlah item di checkout
function updateCartSummary() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

  let totalHarga = 0;
  let totalItem = 0;

  cartItems.forEach(item => {
    const harga = Number(item.harga_produk);
    const jumlah = Number(item.jumlah);

    if (!isNaN(harga) && !isNaN(jumlah)) {
      totalHarga += harga * jumlah;
      totalItem += jumlah;
    }
  });

  // Pastikan elemen ini ada di HTML-mu
  const totalHargaEl = document.getElementById('total-harga');
  const checkoutCountEl = document.getElementById('checkout-count');

  if (totalHargaEl) {
    totalHargaEl.textContent = `Rp ${totalHarga.toLocaleString('id-ID')}`;
  }

  if (checkoutCountEl) {
    checkoutCountEl.textContent = totalItem;
  }
}
