// Navigasi aktif
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    item.classList.add('active');
  });
});

async function fetchProductFromParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const idParam = urlParams.get("id");
  const nameParam = urlParams.get("name");
  const deskripsiParam = urlParams.get("deskripsi");
  const komposisiParam = urlParams.get("komposisi");

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
  container.innerHTML = `
    <div class="flex justify-center items-center bg-gray-100">
      <div class="bg-white rounded-2xl shadow-xl flex flex-col md:flex-row w-full max-w-7xl overflow-hidden">
        <div class="md:w-1/2 bg-white p-6 flex justify-center items-center">
          <img src="${product.gambar_produk}" alt="${product.nama_produk}" class="max-w-full h-auto rounded-xl">
        </div>
        <div class="md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <h2 class="text-2xl font-bold mb-2" id="nama-produk">${product.nama_produk}</h2>
            <div class="flex space-x-1 my-2 text-yellow-500 text-xl">★★★★★</div>
            <p class="text-2xl text-yellow-600 font-bold">Rp <span id="total-harga">${product.harga_produk}</span></p>
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

  document.getElementById("deskripsi").innerHTML = product.deskripsi_produk
    ? `<div class="text-gray-700 text-sm leading-relaxed text-center">${product.deskripsi_produk}</div>`
    : `<div class="text-red-500 text-sm text-center">Deskripsi tidak tersedia.</div>`;

  document.getElementById("komposisi").innerHTML = product.komposisi_produk
    ? `<ul class="list-disc list-inside text-gray-700 text-sm space-y-1 text-center">${product.komposisi_produk}</ul>`
    : `<div class="text-red-500 text-sm text-center">Komposisi tidak tersedia.</div>`;

  const quantitySpan = document.getElementById("quantity");
  const incrementBtn = document.getElementById("increment");
  const decrementBtn = document.getElementById("decrement");
  const totalHargaEl = document.getElementById("total-harga");
  let quantity = 1;
  const hargaSatuan = parseInt(product.harga_produk);

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

  document.getElementById("beliBtn").addEventListener("click", () => {
    const popupContainer = document.getElementById("popupContainer");
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
    document.getElementById("closePopup").addEventListener("click", () => {
      popupContainer.innerHTML = '';
    });
    document.getElementById("popupSuccess").addEventListener("click", e => {
      if (e.target.id === "popupSuccess") {
        popupContainer.innerHTML = '';
      }
    });
  });

  document.getElementById("add-to-cart").addEventListener("click", () => {
    addToCart(product, quantity);
  });
}

// Fungsi untuk menambahkan item ke cart
function addToCart(product, quantity = 1) {
  const item = {
    nama_produk: product.nama_produk,
    harga_produk: product.harga_produk,
    gambar_produk: product.gambar_produk,
    jumlah: quantity
  };

  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  const existing = cartItems.find(i => i.nama_produk === item.nama_produk);
  
  if (existing) {
    existing.jumlah += quantity;
  } else {
    cartItems.push(item);
  }

  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  const totalItems = cartItems.reduce((sum, i) => sum + i.jumlah, 0);
  updateCartCount(totalItems);
  
  // Tampilkan notifikasi berhasil ditambahkan
  showAddToCartNotification(product.nama_produk);
}

// Fungsi untuk menampilkan notifikasi
function showAddToCartNotification(productName) {
  const notification = document.createElement('div');
  notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300';
  notification.innerHTML = `
    <div class="flex items-center space-x-2">
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
      </svg>
      <span>${productName} ditambahkan ke keranjang!</span>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Hapus notifikasi setelah 3 detik
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

function updateCartCount(newCount) {
  localStorage.setItem('cartCount', newCount);
  const el = document.getElementById('cart-count');
  if (el) el.textContent = newCount;
}

function getCartCount() {
  return parseInt(localStorage.getItem('cartCount')) || 0;
}

async function loadRekomendasiProduk() {
  try {
    const response = await fetch("http://localhost:8000/produk");
    const data = await response.json();
    const container = document.getElementById("rekomendasi-produk");
    container.innerHTML = "";

    const rekomendasi = data.slice(0, 5);
    rekomendasi.forEach(product => {
      const productDiv = document.createElement("div");
      productDiv.className = "bg-white rounded-2xl shadow-md relative w-[180px] flex-shrink-0";

      const encodedName = encodeURIComponent(product.nama_produk);
      productDiv.innerHTML = `
        <button class="cart-btn absolute top-2 right-2 bg-green-200 hover:bg-green-300 rounded-2xl p-2 z-10 transition-colors duration-200" aria-label="Add to cart" data-product='${JSON.stringify(product)}'>
          <img src="image/shopping-cart.png" class="w-5 h-5 pointer-events-none" />
        </button>
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
          <h2 class="text-sm font-semibold text-gray-800 truncate mb-1">${product.nama_produk}</h2>
          <p class="text-md font-bold text-gray-900">Rp ${Number(product.harga_produk).toLocaleString('id-ID')}</p>
        </a>
      `;
      
      container.appendChild(productDiv);
    });

    // Tambahkan event listener untuk semua tombol cart di rekomendasi
    const cartButtons = container.querySelectorAll('.cart-btn');
    cartButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const productData = JSON.parse(button.getAttribute('data-product'));
        addToCart(productData, 1);
      });
    });

  } catch (error) {
    console.error("Gagal memuat rekomendasi produk:", error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartCount(getCartCount());
  fetchProductFromParams();
  loadRekomendasiProduk();

  // Tab Navigasi
  document.getElementById('tab-deskripsi').addEventListener('click', () => {
    document.getElementById('deskripsi').classList.remove('hidden');
    document.getElementById('komposisi').classList.add('hidden');
  });

  document.getElementById('tab-komposisi').addEventListener('click', () => {
    document.getElementById('komposisi').classList.remove('hidden');
    document.getElementById('deskripsi').classList.add('hidden');
  });
});