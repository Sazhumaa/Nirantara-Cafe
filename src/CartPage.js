// Saat DOM siap
document.addEventListener('DOMContentLoaded', () => {
  updateCartCountDisplay();
  renderCartItems();
  updateCartSummary();
});

// Menampilkan jumlah item di icon cart
function updateCartCountDisplay() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const totalCount = cartItems.reduce((total, item) => total + (item.jumlah || 1), 0);
  const cartCountEl = document.getElementById('cart-count');
  if (cartCountEl) cartCountEl.textContent = totalCount;
}

// Render semua item dalam keranjang
function renderCartItems() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const container = document.getElementById('cart-container');
  container.innerHTML = '';

  cartItems.forEach((item, index) => {
    const jumlah = item.jumlah || 1;
    const isChecked = item.selected !== false; // default: true

    const itemEl = document.createElement('div');
    itemEl.className = 'flex justify-center items-center py-4';
    itemEl.innerHTML = `
      <div class="bg-white rounded-2xl shadow-md flex flex-col md:flex-row w-full max-w-3xl overflow-hidden p-4 md:p-6 gap-6 relative">
        <div class="flex-1 space-y-3 pl-8">
          <div class="flex items-center gap-3">
            <div class="w-6 h-6 rounded-full border-2 border-green-600 flex items-center justify-center bg-green-50">
                    <!-- Checkbox -->
        <input type="checkbox" class="item-checkbox absolute top-4 left-4 w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500" ${isChecked ? 'checked' : ''} data-index="${index}">
            </div>
            <h3 class="text-lg md:text-xl font-semibold text-gray-800">${item.nama_produk}</h3>
          </div>
          <p class="text-sm text-gray-600">Estimasi Pembuatan: 5 menit</p>
          <p class="text-sm text-gray-600">Estimasi Pengiriman: 7-12 menit</p>
          <p class="text-lg font-bold text-green-600">Rp ${Number(item.harga_produk).toLocaleString('id-ID')}</p>
        </div>
        <div class="flex flex-col items-center justify-center gap-4">
          <img src="${item.gambar_produk}" alt="${item.nama_produk}" class="rounded-xl w-24 h-24 object-cover border shadow-sm">
          <div class="flex items-center gap-3">
            <button class="decrement-btn w-8 h-8 bg-red-100 hover:bg-red-200 rounded-full text-red-600 text-lg font-bold">−</button>
            <span class="quantity text-base font-semibold">${jumlah}</span>
            <button class="increment-btn w-8 h-8 bg-green-100 hover:bg-green-200 rounded-full text-green-600 text-lg font-bold">+</button>
          </div>
        </div>
      </div>
    `;
    container.appendChild(itemEl);
  });

  attachQuantityListeners();
  attachCheckboxListeners();
}

function attachCheckboxListeners() {
  document.querySelectorAll('.item-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const index = parseInt(e.target.getAttribute('data-index'));
      const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

      if (cartItems[index]) {
        cartItems[index].selected = e.target.checked;
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCartSummary();
      }
    });
  });
}


// Menambahkan event listener untuk tombol +/-
function attachQuantityListeners() {
  const incrementButtons = document.querySelectorAll('.increment-btn');
  const decrementButtons = document.querySelectorAll('.decrement-btn');

  incrementButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => updateItemQuantity(index, 1));
  });

  decrementButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => updateItemQuantity(index, -1));
  });
}

// Update jumlah item di localStorage
function updateItemQuantity(index, delta) {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

  if (cartItems[index]) {
    cartItems[index].jumlah = (cartItems[index].jumlah || 1) + delta;
    if (cartItems[index].jumlah <= 0) {
      cartItems.splice(index, 1);
    }
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartCountDisplay();
    renderCartItems();
    updateCartSummary();
  }
}

// Menampilkan total harga dan total item
function updateCartSummary() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  let totalHarga = 0;
  let totalItem = 0;

  cartItems.forEach(item => {
    if (item.selected !== false) {
      const jumlah = item.jumlah || 1;
      const harga = parseFloat(item.harga_produk) || 0;
      totalHarga += harga * jumlah;
      totalItem += jumlah;
    }
  });

  const totalHargaEl = document.getElementById('total-harga');
  const checkoutCountEl = document.getElementById('checkout-count');

  if (totalHargaEl) totalHargaEl.textContent = `Rp ${totalHarga.toLocaleString('id-ID')}`;
  if (checkoutCountEl) checkoutCountEl.textContent = totalItem;
}


// Tombol Checkout
document.getElementById('checkout-btn').addEventListener('click', () => {
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

  const selectedItems = cartItems.filter(item => item.selected !== false);
  if (selectedItems.length === 0) {
    alert('Pilih produk terlebih dahulu sebelum checkout.');
    return;
  }

  cartItems = cartItems.filter(item => item.selected === false);
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  localStorage.setItem('cartCount', cartItems.reduce((total, item) => total + (item.jumlah || 1), 0));

  updateCartCountDisplay();
  renderCartItems();
  updateCartSummary();

  // Show popup
  const popup = document.createElement('div');
  popup.innerHTML = `
    <div id="popupSuccess" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="bg-white rounded-xl shadow-lg p-6 text-center max-w-sm w-full">
        <img src="image/checklist.png" alt="" class="w-20 h-auto mx-auto mb-3">
        <h2 class="text-xl font-bold text-green-600 mb-2">Pembayaran Berhasil!</h2>
        <p class="text-gray-700 mb-4">Terima kasih telah melakukan pembelian.</p>
        <button id="closePopup" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold">
          Tutup
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(popup);

  document.getElementById('closePopup').addEventListener('click', () => popup.remove());
  document.getElementById('popupSuccess').addEventListener('click', (e) => {
    if (e.target.id === 'popupSuccess') popup.remove();
  });
});
