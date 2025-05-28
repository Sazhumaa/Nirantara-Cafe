// Aktifkan navigasi
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(nav => {
      nav.classList.remove('active');
    });
    item.classList.add('active');
  });
});

// Ambil dan tampilkan produk berdasarkan parameter di URL
async function fetchProductFromParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const idParam = urlParams.get("id");
  const nameParam = urlParams.get("name");
  const deskripsiParam = urlParams.get("deskripsi");
  const komposisiParam = urlParams.get("komposisi");

  if (!idParam && !nameParam && !deskripsiParam && !komposisiParam) {
document.getElementById("nama-produk").textContent = produk.nama_produk || "Tanpa Nama";

// Gunakan innerHTML supaya bisa di-style dengan Tailwind
document.getElementById("deskripsi").innerHTML = produk.deskripsi_produk
  ? `<div class="text-gray-700 text-sm leading-relaxed ">${produk.deskripsi_produk}</div>`
  : `<div class="text-red-500 text-sm">Deskripsi tidak tersedia.</div>`;

document.getElementById("komposisi").innerHTML = produk.komposisi_produk
  ? `<ul class="list-disc list-inside text-gray-700 text-sm space-y-1">${produk.komposisi_produk}</ul>`
  : `<div class="text-red-500 text-sm">Komposisi tidak tersedia.</div>`;

  }

  try {
    const response = await fetch("http://localhost:8000/produk");
    const products = await response.json();

    let produk = null;

    if (idParam) {
      produk = products.find(p => p.id == idParam);
    } else if (nameParam) {
      produk = products.find(p => p.nama_produk?.toLowerCase() === nameParam.toLowerCase());
    } else if (deskripsiParam) {
      produk = products.find(p => p.deskripsi_produk?.toLowerCase() === deskripsiParam.toLowerCase());
    } else if (komposisiParam) {
      produk = products.find(p => p.komposisi_produk?.toLowerCase() === komposisiParam.toLowerCase());
    }

    if (produk) {
      displayProduct(produk);
      document.getElementById("deskripsi").innerHTML = produk.deskripsi_produk
        ? `<div class="text-gray-700 text-sm leading-relaxed text-center">${produk.deskripsi_produk}</div>`
        : `<div class="text-red-500 text-sm text-center">Deskripsi tidak tersedia.</div>`;

document.getElementById("komposisi").innerHTML = produk.komposisi_produk
  ? `<ul class="list-disc list-inside text-gray-700 text-sm space-y-1 text-center">${produk.komposisi_produk}</ul>`
  : `<div class="text-red-500 text-sm text-center">Komposisi tidak tersedia.</div>`;
    } else {
      document.getElementById("nama-produk").textContent = "Produk tidak ditemukan.";
      document.getElementById("deskripsi").textContent = "Produk tidak ditemukan.";
      document.getElementById("komposisi").textContent = "";
    }
  } catch (error) {
    console.error("Gagal memuat produk:", error);
    document.getElementById("nama-produk").textContent = "Gagal memuat produk.";
    document.getElementById("deskripsi").textContent = "Gagal memuat data.";
    document.getElementById("komposisi").textContent = "Gagal memuat data.";
  }
}

function displayProduct(product) {
  const container = document.getElementById('product-container');
  container.innerHTML = '';

  const productCard = `
  <div class="flex justify-center items-center bg-gray-100">
    <div class="bg-white rounded-2xl shadow-xl flex flex-col md:flex-row w-full max-w-7xl overflow-hidden">
      <div class="md:w-1/2 bg-white p-6 flex justify-center items-center">
        <img src="${product.gambar_produk}" alt="${product.nama_produk}" class="max-w-full h-auto rounded-xl">
      </div>
      <div class="md:w-1/2 p-6 flex flex-col justify-between">
        <div>
          <h2 class="text-2xl font-bold mb-2">${product.nama_produk}</h2>
          <div class="flex space-x-1 my-2 text-yellow-500 text-xl">★★★★★</div>
          <p class="text-2xl text-yellow-600 font-bold"> Rp <span id="total-harga">${product.harga_produk}</span> </p>
          <p class="text-sm text-gray-500 mb-2">Lama Pembuatan: ${product.lama_pembuatan}</p>
          <ul class="text-sm text-gray-600 space-y-1 mb-4">
            <li>🎁 Gratis ongkir ke seluruh Indonesia</li>
            <li>🚚 Estimasi kirim: 1-2 hari</li>
            <li class="text-green-600">🔥 Promo terbatas hari ini!</li>
          </ul>
          <div class="flex items-center space-x-3 mb-4">
            <span class="font-semibold">Kuantitas</span>
            <div class="flex items-center border rounded px-3 py-1">
              <button class="text-lg font-bold px-2" id="decrement">-</button>
              <span class="px-2" id="quantity">1</span>
              <button class="text-lg font-bold px-2" id="increment">+</button>
            </div>
          </div>
          <div class="flex space-x-3 mt-4">
            <button id="beliBtn" class="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold">Beli Sekarang</button>
            <button id="add-to-cart" class="bg-green-500 hover:bg-green-600 p-2 rounded-lg">
              <img src="image/shopping-cart-Puth.png" alt="Cart" class="w-6 h-6" />
            </button>
            <button class="bg-green-500 hover:bg-green-600 p-2 rounded-lg">
              <img src="image/wishlist-Putih.png" alt="Wishlist" class="w-6 h-6">
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  `;
  container.innerHTML = productCard;

  const quantitySpan = document.getElementById("quantity");
  const incrementBtn = document.getElementById("increment");
  const decrementBtn = document.getElementById("decrement");
  const totalHargaEl = document.getElementById("total-harga");

  let quantity = parseInt(quantitySpan.textContent);
  const hargaSatuan = product.harga_produk;

  function updateTotalHarga() {
    totalHargaEl.textContent = (hargaSatuan * quantity).toLocaleString('id-ID');
  }

  incrementBtn.addEventListener("click", () => {
    quantity++;
    quantitySpan.textContent = quantity;
    updateTotalHarga();
  });

  decrementBtn.addEventListener("click", () => {
    if (quantity > 1) {
      quantity--;
      quantitySpan.textContent = quantity;
      updateTotalHarga();
    }
  });

  document.getElementById('beliBtn').addEventListener('click', () => {
    const popupContainer = document.getElementById('popupContainer');
    popupContainer.innerHTML = `
      <div id="popupSuccess" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="bg-white rounded-xl shadow-lg p-6 text-center max-w-sm w-full">
          <img src="image/checklist.png" alt="" class="w-20 h-auto object-center mb-3 mx-auto">
          <h2 class="text-xl font-bold text-green-600 mb-2">Pembayaran Berhasil!</h2>
          <p class="text-gray-700 mb-4">Terima kasih telah melakukan pembelian.</p>
          <button id="closePopup" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold">Tutup</button>
        </div>
      </div>
    `;
    document.getElementById('closePopup').addEventListener('click', () => {
      popupContainer.innerHTML = '';
    });
    document.getElementById('popupSuccess').addEventListener('click', (e) => {
      if (e.target.id === 'popupSuccess') {
        popupContainer.innerHTML = '';
      }
    });
  });

  const addToCartBtn = document.getElementById('add-to-cart');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      tambahKeCart(product);
    });
  }
}

function tambahKeCart(product) {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const quantity = parseInt(document.getElementById("quantity").textContent) || 1;

  const existingIndex = cartItems.findIndex(item => item.nama_produk === product.nama_produk);

  if (existingIndex !== -1) {
    // Produk sudah ada di cart, tambahkan jumlah
    cartItems[existingIndex].jumlah += quantity;
  } else {
    // Produk belum ada di cart, tambahkan baru
    const item = {
      nama_produk: product.nama_produk,
      harga_produk: product.harga_produk,
      gambar_produk: product.gambar_produk,
      jumlah: quantity
    };
    cartItems.push(item);
  }

  localStorage.setItem('cartItems', JSON.stringify(cartItems));

  const newCount = cartItems.reduce((sum, i) => sum + i.jumlah, 0);
  updateCartCount(newCount);
}


function getCartCount() {
  return parseInt(localStorage.getItem('cartCount')) || 0;
}

function updateCartCount(newCount) {
  localStorage.setItem('cartCount', newCount);
  const cartCountElement = document.getElementById('cart-count');
  if (cartCountElement) {
    cartCountElement.textContent = newCount;
  }
}

// Saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount(getCartCount());
  fetchProductFromParams(); // ✅ panggil yang sudah digabung
});

// Navigasi Tab Deskripsi & Komposisi
document.getElementById('tab-deskripsi').addEventListener('click', () => {
  document.getElementById('deskripsi').classList.remove('hidden');
  document.getElementById('komposisi').classList.add('hidden');
});

document.getElementById('tab-komposisi').addEventListener('click', () => {
  document.getElementById('komposisi').classList.remove('hidden');
  document.getElementById('deskripsi').classList.add('hidden');
});

// JS
async function loadRekomendasiProduk() {
  try {
    const response = await fetch("http://localhost:8000/produk");
    const data = await response.json();

    const container = document.getElementById("rekomendasi-produk");
    container.innerHTML = "";

    const rekomendasi = data.slice(0, 5); // Atau gunakan acak: data.sort(() => 0.5 - Math.random()).slice(0, 5)

    rekomendasi.forEach((product) => {
      const productDiv = document.createElement("div");
      productDiv.className = "bg-white rounded-2xl shadow-md relative w-[180px] flex-shrink-0";

      const encodedName = encodeURIComponent(product.nama_produk);
      const productId = product.id;

      productDiv.innerHTML = `
        <!-- Tombol keranjang -->
        <button class="absolute top-2 right-2 bg-green-200 rounded-2xl p-2 z-10" id="${productId}" aria-label="Add to cart">
          <img src="image/shopping-cart.png" class="w-5 h-5 pointer-events-none" />
        </button>

        <!-- Link ke Buying Page -->
        <a href="Buying Page.html?name=${encodedName}" class="block p-3">
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

      container.appendChild(productDiv);
    });

  } catch (error) {
    console.error("Gagal memuat rekomendasi produk:", error);
  }
}

loadRekomendasiProduk();
