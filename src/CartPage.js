// ========================================
// SISTEM INISIALISASI HALAMAN CART
// ========================================
// Fungsi: Inisialisasi halaman cart saat DOM siap
// Fitur: Load data cart, render item, dan update summary
document.addEventListener('DOMContentLoaded', () => {
  updateCartCountDisplay(); // Update counter di icon cart
  renderCartItems();        // Render semua item di keranjang
  updateCartSummary();      // Update total harga dan jumlah item
});

// ========================================
// SISTEM DISPLAY COUNTER CART
// ========================================
// Fungsi: Menampilkan jumlah total item di icon cart
// Fitur: Menghitung total quantity dari semua item
function updateCartCountDisplay() {
  // Ambil data cart dari localStorage
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  
  // Hitung total quantity dari semua item
  const totalCount = cartItems.reduce((total, item) => total + (item.jumlah || 1), 0);
  
  // Update tampilan counter di UI
  const cartCountEl = document.getElementById('cart-count');
  if (cartCountEl) cartCountEl.textContent = totalCount;
}

// ========================================
// SISTEM RENDER ITEM CART
// ========================================
// Fungsi: Menampilkan semua item dalam keranjang
// Fitur: Layout responsif, checkbox selection, kontrol quantity
function renderCartItems() {
  // Ambil data cart dari localStorage
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  
  // Ambil container untuk item cart
  const container = document.getElementById('cart-container');
  container.innerHTML = ''; // Bersihkan container

  // Loop untuk setiap item di keranjang
  cartItems.forEach((item, index) => {
    // Default jumlah minimal 1
    const jumlah = item.jumlah || 1;
    
    // Status checkbox (default: checked)
    const isChecked = item.selected !== false;

    // Buat elemen untuk item cart
    const itemEl = document.createElement('div');
    itemEl.className = 'flex justify-center items-center py-4';
    
    // Generate HTML untuk item cart
    itemEl.innerHTML = `
      <div class="bg-white rounded-2xl shadow-md flex flex-col md:flex-row w-full max-w-3xl overflow-hidden p-4 md:p-6 gap-6 relative">
        <div class="flex-1 space-y-3 pl-8">
          <div class="flex items-center gap-3">
            <div class="w-6 h-6 rounded-full border-2 border-green-600 flex items-center justify-center bg-green-50">
              <!-- Checkbox untuk seleksi item -->
              <input type="checkbox" class="item-checkbox absolute top-4 left-4 w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500" ${isChecked ? 'checked' : ''} data-index="${index}">
            </div>
            <!-- Nama Produk -->
            <h3 class="text-lg md:text-xl font-semibold text-gray-800">${item.nama_produk}</h3>
          </div>
          <!-- Informasi Tambahan -->
          <p class="text-sm text-gray-600">Estimasi Pembuatan: 5 menit</p>
          <p class="text-sm text-gray-600">Estimasi Pengiriman: 7-12 menit</p>
          <!-- Harga Produk -->
          <p class="text-lg font-bold text-green-600">Rp ${Number(item.harga_produk).toLocaleString('id-ID')}</p>
        </div>
        <div class="flex flex-col items-center justify-center gap-4">
          <!-- Gambar Produk -->
          <img src="${item.gambar_produk}" alt="${item.nama_produk}" class="rounded-xl w-24 h-24 object-cover border shadow-sm">
          <!-- Kontrol Quantity -->
          <div class="flex items-center gap-3">
            <button class="decrement-btn w-8 h-8 bg-red-100 hover:bg-red-200 rounded-full text-red-600 text-lg font-bold">−</button>
            <span class="quantity text-base font-semibold">${jumlah}</span>
            <button class="increment-btn w-8 h-8 bg-green-100 hover:bg-green-200 rounded-full text-green-600 text-lg font-bold">+</button>
          </div>
        </div>
      </div>
    `;
    
    // Tambahkan item ke container
    container.appendChild(itemEl);
  });

  // Setup event listeners untuk tombol dan checkbox
  attachQuantityListeners();  // Listener untuk tombol +/-
  attachCheckboxListeners();  // Listener untuk checkbox
}

// ========================================
// SISTEM CHECKBOX SELECTION
// ========================================
// Fungsi: Mengelola event listener untuk checkbox item
// Fitur: Seleksi/deseleksi item untuk checkout
function attachCheckboxListeners() {
  // Ambil semua checkbox
  document.querySelectorAll('.item-checkbox').forEach(checkbox => {
    // Tambahkan event listener untuk perubahan status
    checkbox.addEventListener('change', (e) => {
      // Ambil index item dari attribute data-index
      const index = parseInt(e.target.getAttribute('data-index'));
      
      // Ambil data cart dari localStorage
      const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

      // Update status selected pada item
      if (cartItems[index]) {
        cartItems[index].selected = e.target.checked;
        
        // Simpan kembali ke localStorage
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        
        // Update total harga dan jumlah item
        updateCartSummary();
      }
    });
  });
}

// ========================================
// SISTEM KONTROL QUANTITY
// ========================================
// Fungsi: Mengelola event listener untuk tombol quantity
// Fitur: Increment/decrement quantity item
function attachQuantityListeners() {
  // Ambil semua tombol increment dan decrement
  const incrementButtons = document.querySelectorAll('.increment-btn');
  const decrementButtons = document.querySelectorAll('.decrement-btn');

  // Tambahkan event listener untuk tombol increment
  incrementButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => updateItemQuantity(index, 1)); // Tambah 1
  });

  // Tambahkan event listener untuk tombol decrement
  decrementButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => updateItemQuantity(index, -1)); // Kurang 1
  });
}

// ========================================
// SISTEM UPDATE QUANTITY ITEM
// ========================================
// Fungsi: Update jumlah item di localStorage
// Fitur: Increment/decrement quantity, hapus item jika quantity 0
function updateItemQuantity(index, delta) {
  // Ambil data cart dari localStorage
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

  // Update quantity jika item ada
  if (cartItems[index]) {
    // Tambah/kurang quantity sesuai delta
    cartItems[index].jumlah = (cartItems[index].jumlah || 1) + delta;
    
    // Hapus item jika quantity <= 0
    if (cartItems[index].jumlah <= 0) {
      cartItems.splice(index, 1);
    }
    
    // Simpan kembali ke localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    // Update UI
    updateCartCountDisplay(); // Update counter di icon cart
    renderCartItems();        // Re-render semua item
    updateCartSummary();      // Update total harga dan jumlah
  }
}

// ========================================
// SISTEM KALKULASI CART SUMMARY
// ========================================
// Fungsi: Menghitung dan menampilkan total harga dan jumlah item
// Fitur: Hanya menghitung item yang terseleksi (checked)
function updateCartSummary() {
  // Ambil data cart dari localStorage
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  
  // Inisialisasi total
  let totalHarga = 0;
  let totalItem = 0;

  // Hitung total harga dan jumlah item yang terseleksi
  cartItems.forEach(item => {
    // Hanya hitung item yang terseleksi (checkbox checked)
    if (item.selected !== false) {
      const jumlah = item.jumlah || 1;
      const harga = parseFloat(item.harga_produk) || 0;
      
      // Tambahkan ke total
      totalHarga += harga * jumlah;
      totalItem += jumlah;
    }
  });

  // Update tampilan total di UI
  const totalHargaEl = document.getElementById('total-harga');
  const checkoutCountEl = document.getElementById('checkout-count');

  // Update total harga dengan format currency
  if (totalHargaEl) totalHargaEl.textContent = `Rp ${totalHarga.toLocaleString('id-ID')}`;
  
  // Update jumlah item untuk checkout
  if (checkoutCountEl) checkoutCountEl.textContent = totalItem;
}

// ========================================
// SISTEM CHECKOUT
// ========================================
// Fungsi: Proses checkout untuk item yang terseleksi
// Fitur: Validasi item, hapus item dari cart, tampilkan popup sukses
document.getElementById('checkout-btn').addEventListener('click', () => {
  // Ambil data cart dari localStorage
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

  // Filter item yang terseleksi (checkbox checked)
  const selectedItems = cartItems.filter(item => item.selected !== false);
  
  // Validasi: minimal 1 item terseleksi
  if (selectedItems.length === 0) {
    alert('Pilih produk terlebih dahulu sebelum checkout.');
    return;
  }

  // Hapus item yang sudah di-checkout dari cart
  // Simpan hanya item yang tidak terseleksi
  cartItems = cartItems.filter(item => item.selected === false);
  
  // Update localStorage
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  
  // Update cart count
  localStorage.setItem('cartCount', cartItems.reduce((total, item) => total + (item.jumlah || 1), 0));

  // Update UI
  updateCartCountDisplay();
  renderCartItems();
  updateCartSummary();

  // ========================================
  // SISTEM POPUP SUKSES CHECKOUT
  // ========================================
  // Tampilkan popup sukses
  const popup = document.createElement('div');
  popup.innerHTML = `
    <div id="popupSuccess" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="bg-white rounded-xl shadow-lg p-6 text-center max-w-sm w-full">
        <!-- Icon Success -->
        <img src="image/checklist.png" alt="" class="w-20 h-auto mx-auto mb-3">
        
        <!-- Pesan Success -->
        <h2 class="text-xl font-bold text-green-600 mb-2">Pembayaran Berhasil!</h2>
        <p class="text-gray-700 mb-4">Terima kasih telah melakukan pembelian.</p>
        
        <!-- Tombol Tutup -->
        <button id="closePopup" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold">
          Tutup
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(popup);

  // Event listener untuk tombol tutup
  document.getElementById('closePopup').addEventListener('click', () => popup.remove());
  
  // Event listener untuk klik di luar popup
  document.getElementById('popupSuccess').addEventListener('click', (e) => {
    if (e.target.id === 'popupSuccess') popup.remove();
  });
});

// ========================================
// SISTEM LOAD PROFIL USER
// ========================================
// Fungsi: Load dan tampilkan gambar profil user dari localStorage
// Fitur: Sinkronisasi gambar profil antar halaman
document.addEventListener('DOMContentLoaded', function () {
    // Cek apakah ada data profil tersimpan
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      try {
        // Parse data profil
        const profileData = JSON.parse(savedProfile);
        
        // Update gambar profil di navbar jika ada
        if (profileData.profileImage) {
          const profileImgElement = document.getElementById('navProfileImage');
          if (profileImgElement) {
            profileImgElement.src = profileData.profileImage;
          }
        }
      } catch (e) {
        // Handle error parsing data profil
        console.error('Gagal memuat gambar profil dari localStorage:', e);
      }
    }
});