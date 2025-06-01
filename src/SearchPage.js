
  const url_api = 'http://localhost:8000/produk';
  const params = new URLSearchParams(window.location.search);
  const query = params.get('query');

  // Ambil data produk dari API dan filter
  async function fetchAndFilter() {
    try {
      const res = await fetch(url_api);
      const data = await res.json();

      const filtered = query
        ? data.filter(item =>
            item.nama_produk.toLowerCase().includes(query.toLowerCase())
          )
        : [];

      displaySearchResults(filtered);
    } catch (err) {
      console.error('Error:', err);
      document.getElementById('search-results').innerHTML =
        '<p class="text-red-500">Gagal mengambil data produk.</p>';
    }
  }

  // Tampilkan produk hasil pencarian
  function displaySearchResults(products) {
    const container = document.getElementById('search-results');
    const noResults = document.getElementById('no-results');
    container.innerHTML = '';

    if (products.length === 0) {
      noResults.style.display = 'block';
      return;
    }

    noResults.style.display = 'none';

    products.forEach(product => {
      const card = document.createElement('div');
      card.className = 'bg-white p-4 rounded-xl shadow';

      card.innerHTML = `
        <div class="relative">
          <button class="cart-btn absolute top-2 right-2 bg-green-200 hover:bg-green-300 rounded-2xl p-2 z-10 transition-colors duration-200" 
                  aria-label="Add to cart" 
                  data-product='${JSON.stringify(product)}'>
            <img src="image/shopping-cart.png" class="w-5 h-5 pointer-events-none" />
          </button>
          <a href="Buying Page.html?name=${encodeURIComponent(product.nama_produk)}" class="block">
            <img src="${product.gambar_produk}" alt="${product.nama_produk}" class="w-full h-40 object-contain mb-4 rounded-md">
            <p class="text-xs text-gray-500 mb-1">21–25 min</p>
            <div class="flex items-center text-yellow-500 text-sm mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="w-4 h-4 mr-1">
                <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.782 1.4 8.171L12 18.896l-7.334 3.868 1.4-8.171L.132 9.211l8.2-1.193z"/>
              </svg>
              <span class="font-semibold">${(product.rating || 4.2).toFixed(1)}</span>
              <span class="text-gray-600 text-xs ml-1">| ${product.review_count || 120} Rating</span>
            </div>
            <h2 class="text-sm font-semibold text-gray-800 truncate mb-1">${product.nama_produk}</h2>
            <p class="text-md font-bold text-gray-900">Rp ${Number(product.harga_produk).toLocaleString('id-ID')}</p>
          </a>
        </div>
      `;

      container.appendChild(card);

      const cartBtn = card.querySelector('.cart-btn');
      if (cartBtn) {
        cartBtn.addEventListener('click', e => {
          e.preventDefault();
          e.stopPropagation();
          try {
            const product = JSON.parse(cartBtn.dataset.product);
            tambahKeCart(product);
          } catch (err) {
            console.error('Gagal menambahkan ke cart:', err);
          }
        });
      }
    });
  }

  // =======================
  // Fungsi Keranjang
  // =======================

  function getCartItems() {
    return JSON.parse(localStorage.getItem('cartItems')) || [];
  }

  function saveCartItems(items) {
    localStorage.setItem('cartItems', JSON.stringify(items));
  }

  function updateCartCount() {
    const total = getCartItems().reduce((sum, item) => sum + item.jumlah, 0);
    const badges = document.querySelectorAll('#cart-count');
    badges.forEach(el => (el.textContent = total));
  }

  function tambahKeCart(product) {
    const cartItems = getCartItems();
    const i = cartItems.findIndex(item => item.nama_produk === product.nama_produk);

    if (i > -1) {
      cartItems[i].jumlah += 1;
    } else {
      cartItems.push({
        nama_produk: product.nama_produk,
        harga_produk: product.harga_produk,
        gambar_produk: product.gambar_produk,
        jumlah: 1
      });
    }

    saveCartItems(cartItems);
    updateCartCount();
    console.log(`✓ ${product.nama_produk} ditambahkan ke keranjang`);
  }

  // =======================
  // Inisialisasi saat halaman siap
  // =======================

  document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();

    if (query) {
      fetchAndFilter();
    } else {
      document.getElementById('search-results').innerHTML =
        '<p class="text-gray-600">Masukkan kata kunci pencarian.</p>';
    }
  });

  // =======================
  // Event listener input pencarian (ENTER)
  // =======================

  document.getElementById('search-input').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const query = e.target.value.trim();
      if (query !== '') {
        window.location.href = `SearchPage.html?query=${encodeURIComponent(query)}`;
      }
    }
  });

