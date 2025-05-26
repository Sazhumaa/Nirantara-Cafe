/* ========= menu.js ========= */

/* ----------------------------------
   1. VARIABEL DOM & URL API
---------------------------------- */
const url_api      = 'http://localhost:8000/produk';
const productList  = document.getElementById('coffee-container');   // grid produk
const navMenus     = document.querySelectorAll('.nav-menu');        // tombol kategori
const searchInput  = document.getElementById('search-input');       // input search

/* ----------------------------------
   2. UTILITAS CART  (cartItems & cartCount)
---------------------------------- */
function getCartItems()  {
  return JSON.parse(localStorage.getItem('cartItems')) || [];
}

function saveCartItems(arr) {
  localStorage.setItem('cartItems', JSON.stringify(arr));
}

function updateCartCount (count = null) {
  // hitung ulang kalau tidak dikirim explicit
  const total = count !== null ? count :
    getCartItems().reduce((sum, i) => sum + i.jumlah, 0);

  const badgeEls = document.querySelectorAll('#cart-count');
  badgeEls.forEach(el => el.textContent = total);
}

/* ----------------------------------
   3. MENAMBAH ITEM KE CART
---------------------------------- */
function tambahKeCart (product) {
  const cartItems = getCartItems();
  const i         = cartItems.findIndex(it => it.nama_produk === product.nama_produk);

  if (i > -1) {
    cartItems[i].jumlah += 1;
  } else {
    cartItems.push({
      nama_produk  : product.nama_produk,
      harga_produk : product.harga_produk,
      gambar_produk: product.gambar_produk,
      jumlah       : 1
    });
  }

  saveCartItems(cartItems);
  updateCartCount(cartItems.reduce((s, it)=>s+it.jumlah,0));
  console.log(`✓ ${product.nama_produk} ditambahkan ke keranjang`);
}

/* ----------------------------------
   4. AMBIL DATA PRODUK & TAMPILKAN
---------------------------------- */
async function fetchProducts (kategori = 'All') {
  try {
    const res  = await fetch(url_api);
    const data = await res.json();

    const list = kategori === 'All'
      ? data
      : data.filter(p => p.kategori_produk === kategori);

    displayProducts(list);
  } catch (err) {
    console.error('Fetch error:', err);
    document.getElementById('error-message')?.classList.remove('hidden');
  }
}

function displayProducts (products) {
  if (!productList) return;
  productList.innerHTML = '';

  if (products.length === 0) {
    productList.innerHTML =
      "<p class='text-center col-span-full'>Tidak ada produk dalam kategori ini.</p>";
    return;
  }

  // contoh batasi 8 produk pertama (opsional)
  const shown = products.slice(0,20);

  shown.forEach((product, idx) => {
    const productId   = `cart-icon-${idx}`;
    const encodedName = encodeURIComponent(product.nama_produk);

    const div = document.createElement('div');
    div.className =
      'bg-white rounded-xl shadow-md p-4 flex flex-col hover:shadow-lg transition-shadow duration-200 relative';

    div.innerHTML = `
      <!-- Tombol cart -->
      <button id="${productId}"
              aria-label="Add to cart"
              class="absolute top-2 right-2 bg-green-200 rounded-2xl p-2 z-10">
        <img src="image/shopping-cart.png" class="w-5 h-5 pointer-events-none">
      </button>

      <!-- Link ke Halaman Detail -->
      <a href="Buying Page.html?name=${encodedName}" class="block">
        <img src="${product.gambar_produk}" alt="${product.nama_produk}" class="w-full h-40 object-contain mb-4 rounded-md">
        <p class="text-xs text-gray-500 mb-1">21–25 min</p>
        <div class="flex items-center text-yellow-500 text-sm mb-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="w-4 h-4 mr-1">
            <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.782 1.4 8.171L12 18.896l-7.334 3.868 1.4-8.171L.132 9.211l8.2-1.193z"/>
          </svg>
          <span class="font-semibold">${(product.rating || 4.2).toFixed(1)}</span>
          <span class="text-gray-600 text-xs ml-1">| ${product.review_count || 120} Rating</span>
        </div>
        <div class="flex justify-between items-center">
          <h2 class="text-sm font-semibold text-gray-800 truncate mb-1">${product.nama_produk}</h2>
        </div>
        <p class="text-md font-bold text-gray-900">Rp ${Number(product.harga_produk).toLocaleString('id-ID')}</p>
      </a>

    `;

    productList.appendChild(div);

    // pasang event tombol cart
    div.querySelector(`#${productId}`)
       .addEventListener('click', e => {
         e.preventDefault();
         e.stopPropagation();
         tambahKeCart(product);
       });
  });
}

/* ----------------------------------
   5. FILTER KATEGORI NAV
---------------------------------- */
navMenus.forEach(menu => {
  menu.addEventListener('click', () => {
    navMenus.forEach(m => m.classList.remove('bg-[#D9D9D9]'));
    menu.classList.add('bg-[#D9D9D9]');
    fetchProducts(menu.getAttribute('data-kategori') || 'All');
  });
});

/* ----------------------------------
   6. SEARCH (ENTER)
---------------------------------- */
searchInput?.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    const q = e.target.value.trim();
    if (q) window.location.href = `SearchPage.html?query=${encodeURIComponent(q)}`;
  }
});

/* ----------------------------------
   7. INISIALISASI SAAT LOAD
---------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();      // sinkron badge
  fetchProducts('All');   // tampilkan produk awal
});
