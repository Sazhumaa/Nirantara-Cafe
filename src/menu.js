const navMenus = document.querySelectorAll('.nav-menu');
const productList = document.getElementById('coffee-container');
const url_api = 'http://localhost:8000/produk';

// Fungsi utama untuk ambil data dan tampilkan produk
async function fetchProducts(kategoriFilter = 'all') {
  try {
    const response = await fetch(url_api);
    if (!response.ok) throw new Error('Network response was not ok');
    
    const products = await response.json();

    // Filter jika kategori bukan "all"
    const filtered = kategoriFilter.toLowerCase() === 'all'
      ? products
      : products.filter(p => p.kategori_produk === kategoriFilter);

    displayProducts(filtered);
  } catch (error) {
    console.error('Ada masalah dengan fetch:', error);
    document.getElementById('error-message')?.classList.remove('hidden');
  }
}

// Tampilkan daftar produk ke dalam DOM
function displayProducts(products) {
  productList.innerHTML = ''; // Kosongkan dulu

  if (products.length === 0) {
    productList.innerHTML = "<p class='text-center col-span-full'>Tidak ada produk dalam kategori ini.</p>";
    return;
  }

  products.forEach(product => {
    const productDiv = document.createElement('div');
    productDiv.className = 'bg-white rounded-xl shadow-md p-4 flex flex-col hover:shadow-lg transition-shadow duration-200';

    productDiv.innerHTML = `
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
    `;

    productList.appendChild(productDiv);
  });
}

// Atur tombol filter kategori
navMenus.forEach(menu => {
  menu.addEventListener('click', () => {
    // Atur warna aktif
    navMenus.forEach(item => item.classList.remove('bg-[#D9D9D9]'));
    menu.classList.add('bg-[#D9D9D9]');

    // Ambil nama kategori dari tombol
    const kategori = menu.getAttribute('data-kategori');

    // Jalankan filter produk
    fetchProducts(kategori);
  });
});

// Panggil pertama kali untuk semua produk
window.onload = () => fetchProducts();
