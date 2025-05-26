// Aktifkan navigasi
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(nav => {
      nav.classList.remove('active');
    });
    item.classList.add('active');
  });
});

async function fetchAllProducts() {
    try {
        const response = await fetch('http://localhost:8000/produk'); // Fetch all products
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const products = await response.json();
        const productName = getProductNameFromUrl();
        const filteredProducts = products.filter(product => product.nama_produk.toLowerCase() === productName.toLowerCase());
        
        if (filteredProducts.length > 0) {
            displayProduct(filteredProducts[0]); // Display the first matching product
        } else {
            console.error('Product not found');
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Function to get the product name from the URL
function getProductNameFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('name');
}

function displayProduct(product) {
  const container = document.getElementById('product-container');
  container.innerHTML = ''; // Clear previous content

  const productCard = `
    <!-- isi sama seperti sebelumnya -->
    <button id="add-to-cart" class="bg-green-500 hover:bg-green-600 p-2 rounded-lg">
      <img src="image/shopping-cart-Puth.png" alt="Cart" class="w-6 h-6" />
    </button>
    <!-- lanjutannya -->
  `;

  container.innerHTML = productCard;

  // 🟢 Tambahkan event listener SETELAH elemen dimasukkan ke DOM
  const addToCartBtn = document.getElementById('add-to-cart');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      const currentCount = getCartCount();
      const newCount = currentCount + 1;
      updateCartCount(newCount);
      console.log('Item ditambahkan ke cart');
    });
  }
}


function displayProduct(product) {
  const container = document.getElementById('product-container');
  container.innerHTML = ''; // Clear previous content
  

  const productCard = `
  <div class="flex justify-center items-center  bg-gray-100 ">
  <div class="bg-white rounded-2xl shadow-xl flex flex-col md:flex-row w-full max-w-7xl overflow-hidden">
    
    <!-- Container Gambar -->
    <div class="md:w-1/2 bg-white p-6 flex justify-center items-center">
      <img src="${product.gambar_produk}" alt="${product.nama_produk}" class="max-w-full h-auto rounded-xl">
    </div>

    <!-- Container Detail & Pembelian -->
    <div class="md:w-1/2 p-6 flex flex-col justify-between">
      <div>
        <h2 class="text-2xl font-bold mb-2">${product.nama_produk}</h2>

        <!-- Rating -->
        <div class="flex space-x-1 my-2 text-yellow-500 text-xl">
          ★★★★★
        </div>

        <!-- Harga -->
        <p class="text-2xl text-yellow-600 font-bold"> Rp <span id="total-harga">${product.harga_produk}</span> </p>
        <p class="text-sm text-gray-500 mb-2">Lama Pembuatan: ${product.lama_pembuatan}</p>

        <!-- Info tambahan -->
        <ul class="text-sm text-gray-600 space-y-1 mb-4">
          <li>🎁 Gratis ongkir ke seluruh Indonesia</li>
          <li>🚚 Estimasi kirim: 1-2 hari</li>
          <li class="text-green-600">🔥 Promo terbatas hari ini!</li>
        </ul>

        <!-- Kuantitas -->
        <div class="flex items-center space-x-3 mb-4">
          <span class="font-semibold">Kuantitas</span>
          <div class="flex items-center border rounded px-3 py-1">
            <button class="text-lg font-bold px-2" id="decrement">-</button>
            <span class="px-2" id="quantity">1</span>
            <button class="text-lg font-bold px-2" id="increment">+</button>
          </div>
        </div>


      <!-- Tombol Aksi -->
      <div class="flex space-x-3 mt-4">
<button id="beliBtn" class="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold">
  Beli Sekarang
</button>

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
  `;
  container.innerHTML = productCard;


  
const quantitySpan = document.getElementById("quantity");
const incrementBtn = document.getElementById("increment");
const decrementBtn = document.getElementById("decrement");
const totalHargaEl = document.getElementById("total-harga");

// Inisialisasi harga dan kuantitas
let quantity = parseInt(quantitySpan.textContent);
const hargaSatuan = product.harga_produk;

// Fungsi update harga total
function updateTotalHarga() {
  totalHargaEl.textContent = (hargaSatuan * quantity).toLocaleString('id-ID');
}

// Event listener tunggal (tidak dobel)
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


//Pop up pembayaran
document.getElementById('beliBtn').addEventListener('click', () => {
  const popupContainer = document.getElementById('popupContainer');

  popupContainer.innerHTML = `
<div id="popupSuccess" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
  <div class="bg-white rounded-xl shadow-lg p-6 text-center max-w-sm w-full">
    <img src="image/checklist.png" alt="" class="w-20 h-auto object-center mb-3 mx-auto">
    <h2 class="text-xl font-bold text-green-600 mb-2">Pembayaran Berhasil!</h2>
    <p class="text-gray-700 mb-4">Terima kasih telah melakukan pembelian.</p>
    <button id="closePopup" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold">
      Tutup
    </button>
  </div>
</div>
  `;

  // Tambahkan event untuk tombol tutup
  document.getElementById('closePopup').addEventListener('click', () => {
    popupContainer.innerHTML = ''; // Hapus popup
  });

  // Tutup juga jika klik di luar konten popup
  document.getElementById('popupSuccess').addEventListener('click', (e) => {
    if (e.target.id === 'popupSuccess') {
      popupContainer.innerHTML = '';
    }
  });
});



  // 🟢 Tambahkan event listener SETELAH elemen dimasukkan ke DOM
  const addToCartBtn = document.getElementById('add-to-cart');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      const currentCount = getCartCount();
      const newCount = currentCount + 1;
      updateCartCount(newCount);
      console.log('Item ditambahkan ke cart');
    });
    
    // Pastikan dipanggil saat tombol diklik
addToCartBtn.addEventListener('click', () => {
  tambahKeCart(product);
});
  }
}


function tambahKeCart(product) {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

  const quantity = parseInt(document.getElementById("quantity").textContent) || 1;

  const item = {
    nama_produk: product.nama_produk,
    harga_produk: product.harga_produk,
    gambar_produk: product.gambar_produk,
    jumlah: quantity
  };

  cartItems.push(item);
  localStorage.setItem('cartItems', JSON.stringify(cartItems));

  const newCount = cartItems.reduce((sum, i) => sum + i.jumlah, 0);
  updateCartCount(newCount);
}

// Call the fetchAllProducts function to load products on page load
fetchAllProducts();

  function getCartCount() {
    return parseInt(localStorage.getItem('cartCount')) || 0;
  }

  // Fungsi untuk set jumlah cart ke localStorage dan update UI
  function updateCartCount(newCount) {
    localStorage.setItem('cartCount', newCount);
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
      cartCountElement.textContent = newCount;
    }
  }

  // Saat halaman dimuat, update tampilan jumlah cart
  document.addEventListener('DOMContentLoaded', () => {
    updateCartCount(getCartCount());
  });


  // Navigasi Tab Deskripsi & Komposisi
// Tab Switching
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

// Cek apakah ID ada
if (!productId) {
  console.error("ID produk tidak ditemukan di URL.");
  document.getElementById("deskripsi").textContent = "ID produk tidak ditemukan.";
  document.getElementById("komposisi").textContent = "ID produk tidak ditemukan.";
} else {
  fetch("http://localhost:8000/produk")
    .then((res) => res.json())
    .then((data) => {
      console.log("Data dari API:", data); // Debug: tampilkan data lengkap

      // Pastikan data adalah array dan id cocok
      const produk = data.find((item) => String(item.id) === String(productId));

      if (produk) {
        // Isi deskripsi dan komposisi
        document.getElementById("deskripsi").textContent =
          produk.deskripsi_produk || "Deskripsi tidak tersedia.";
        document.getElementById("komposisi").textContent =
          produk.komposisi_produk || "Komposisi tidak tersedia.";
      } else {
        document.getElementById("deskripsi").textContent = "Produk tidak ditemukan.";
        document.getElementById("komposisi").textContent = "";
      }
    })
    .catch((err) => {
      console.error("Gagal memuat produk:", err);
      document.getElementById("deskripsi").textContent = "Gagal memuat data.";
      document.getElementById("komposisi").textContent = "Gagal memuat data.";
    });
}
