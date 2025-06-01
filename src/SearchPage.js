// ========================================
// KONFIGURASI API DAN PARAMETER
// ========================================
// URL endpoint API untuk mengambil data produk
const url_api = 'http://localhost:8000/produk';

// Ambil parameter query dari URL
const params = new URLSearchParams(window.location.search);
const query = params.get('query');

// ========================================
// SISTEM FETCH DAN FILTER PRODUK
// ========================================
// Fungsi: Mengambil data produk dari API dan memfilter berdasarkan query
// Fitur: Error handling, filter case-insensitive
async function fetchAndFilter() {
  try {
    // Fetch data produk dari API
    const res = await fetch(url_api);
    const data = await res.json();

    // Filter produk berdasarkan query pencarian
    const filtered = query
      ? data.filter(item =>
          // Filter berdasarkan nama produk (case-insensitive)
          item.nama_produk.toLowerCase().includes(query.toLowerCase())
        )
      : []; // Array kosong jika tidak ada query

    // Tampilkan hasil pencarian
    displaySearchResults(filtered);
  } catch (err) {
    // Handle error saat fetch gagal
    console.error('Error:', err);
    document.getElementById('search-results').innerHTML =
      '<p class="text-red-500">Gagal mengambil data produk.</p>';
  }
}

// ========================================
// SISTEM DISPLAY HASIL PENCARIAN
// ========================================
// Fungsi: Menampilkan produk hasil pencarian dalam format card
// Fitur: Layout responsif, tombol cart, link ke detail produk
function displaySearchResults(products) {
  // Ambil container untuk hasil pencarian
  const container = document.getElementById('search-results');
  const noResults = document.getElementById('no-results');
  container.innerHTML = ''; // Bersihkan container

  // Tampilkan pesan "tidak ada hasil" jika produk kosong
  if (products.length === 0) {
    noResults.style.display = 'block';
    return;
  }

  // Sembunyikan pesan "tidak ada hasil"
  noResults.style.display = 'none';

  // Loop untuk setiap produk hasil pencarian
  products.forEach(product => {
    // Buat elemen card untuk produk
    const card = document.createElement('div');
    card.className = 'bg-white p-4 rounded-xl shadow';

    // Generate HTML untuk card produk
    card.innerHTML = `
      <div class="relative">
        <!-- Tombol Add to Cart -->
        <button class="cart-btn absolute top-2 right-2 bg-green-200 hover:bg-green-300 rounded-2xl p-2 z-10 transition-colors duration-200" 
                aria-label="Add to cart" 
                data-product='${JSON.stringify(product)}'>
          <img src="image/shopping-cart.png" class="w-5 h-5 pointer-events-none" />
        </button>
        
        <!-- Link ke halaman detail produk -->
        <a href="Buying Page.html?name=${encodeURIComponent(product.nama_produk)}" class="block">
          <!-- Gambar Produk -->
          <img src="${product.gambar_produk}" alt="${product.nama_produk}" class="w-full h-40 object-contain mb-4 rounded-md">
          
          <!-- Estimasi Waktu -->
          <p class="text-xs text-gray-500 mb-1">21–25 min</p>
          
          <!-- Rating -->
          <div class="flex items-center text-yellow-500 text-sm mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="w-4 h-4 mr-1">
              <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.782 1.4 8.171L12 18.896l-7.334 3.868 1.4-8.171L.132 9.211l8.2-1.193z"/>
            </svg>
            <span class="font-semibold">${(product.rating || 4.2).toFixed(1)}</span>
            <span class="text-gray-600 text-xs ml-1">| ${product.review_count || 120} Rating</span>
          </div>
          
          <!-- Nama Produk -->
          <h2 class="text-sm font-semibold text-gray-800 truncate mb-1">${product.nama_produk}</h2>
          
          <!-- Harga Produk -->
          <p class="text-md font-bold text-gray-900">Rp ${Number(product.harga_produk).toLocaleString('id-ID')}</p>
        </a>
      </div>
    `;

    // Tambahkan card ke container
    container.appendChild(card);

    // ========================================
    // EVENT LISTENER TOMBOL CART
    // ========================================
    // Setup event listener untuk tombol cart pada setiap card
    const cartBtn = card.querySelector('.cart-btn');
    if (cartBtn) {
      cartBtn.addEventListener('click', e => {
        e.preventDefault(); // Cegah default action
        e.stopPropagation(); // Cegah event bubbling
        try {
          // Parse data produk dari attribute
          const product = JSON.parse(cartBtn.dataset.product);
          // Tambahkan ke cart
          tambahKeCart(product);
        } catch (err) {
          console.error('Gagal menambahkan ke cart:', err);
        }
      });
    }
  });
}

// ========================================
// SISTEM MANAJEMEN KERANJANG BELANJA
// ========================================

// Fungsi: Mengambil data cart dari localStorage
// Return: Array item cart atau array kosong
function getCartItems() {
  return JSON.parse(localStorage.getItem('cartItems')) || [];
}

// Fungsi: Menyimpan data cart ke localStorage
// Parameter: items - array item cart
function saveCartItems(items) {
  localStorage.setItem('cartItems', JSON.stringify(items));
}

// ========================================
// SISTEM UPDATE COUNTER CART
// ========================================
// Fungsi: Update tampilan counter cart di semua elemen
// Fitur: Menghitung total quantity dari semua item
function updateCartCount() {
  // Hitung total quantity dari semua item di cart
  const total = getCartItems().reduce((sum, item) => sum + item.jumlah, 0);
  
  // Update semua elemen dengan ID 'cart-count'
  const badges = document.querySelectorAll('#cart-count');
  badges.forEach(el => (el.textContent = total));
}

// ========================================
// SISTEM TAMBAH KE CART
// ========================================
// Fungsi: Menambahkan produk ke keranjang belanja
// Fitur: Menggabungkan item yang sama, update counter
function tambahKeCart(product) {
  // Ambil data cart saat ini
  const cartItems = getCartItems();
  
  // Cari apakah produk sudah ada di cart
  const i = cartItems.findIndex(item => item.nama_produk === product.nama_produk);

  if (i > -1) {
    // Jika sudah ada, tambahkan quantity
    cartItems[i].jumlah += 1;
  } else {
    // Jika belum ada, tambahkan item baru
    cartItems.push({
      nama_produk: product.nama_produk,
      harga_produk: product.harga_produk,
      gambar_produk: product.gambar_produk,
      jumlah: 1
    });
  }

  // Simpan kembali ke localStorage
  saveCartItems(cartItems);
  
  // Update counter cart di UI
  updateCartCount();
  
  // Log untuk debugging
  console.log(`✓ ${product.nama_produk} ditambahkan ke keranjang`);
}

// ========================================
// SISTEM INISIALISASI HALAMAN
// ========================================
// Event Listener: Inisialisasi saat DOM selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
  // Update counter cart dari localStorage
  updateCartCount();

  // Cek apakah ada query pencarian
  if (query) {
    // Jika ada query, fetch dan filter produk
    fetchAndFilter();
  } else {
    // Jika tidak ada query, tampilkan pesan
    document.getElementById('search-results').innerHTML =
      '<p class="text-gray-600">Masukkan kata kunci pencarian.</p>';
  }
});

// ========================================
// SISTEM PENCARIAN ULANG
// ========================================
// Event Listener: Handle pencarian ulang dengan tombol Enter
// Fitur: Redirect ke halaman search dengan query baru
document.getElementById('search-input').addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    e.preventDefault(); // Cegah submit form default
    
    // Ambil query baru dari input
    const query = e.target.value.trim();
    
    // Redirect ke halaman search dengan query baru jika tidak kosong
    if (query !== '') {
      window.location.href = `SearchPage.html?query=${encodeURIComponent(query)}`;
    }
  }
});