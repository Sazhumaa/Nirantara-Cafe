// Ambil referensi elemen
const addToCartButton = document.getElementById('add-to-cart');
const cartCountSpan = document.getElementById('cart-count');

// Fungsi untuk update tampilan jumlah keranjang
function updateCartCount() {
  const currentCount = parseInt(localStorage.getItem('cartCount')) || 0;
  if (cartCountSpan) {
    cartCountSpan.textContent = currentCount;
  }
}

// Fungsi untuk menambah ke cart
function addToCart() {
  let currentCount = parseInt(localStorage.getItem('cartCount')) || 0;
  currentCount += 1;
  localStorage.setItem('cartCount', currentCount);
  updateCartCount();
}

// Pasang listener jika tombol ada
if (addToCartButton) {
  addToCartButton.addEventListener('click', addToCart);
}

// Update tampilan saat halaman dibuka
document.addEventListener('DOMContentLoaded', updateCartCount);

document.addEventListener("DOMContentLoaded", () => {
  localStorage.setItem("cartCount", 0);

  const cartCountSpan = document.getElementById("cart-count");
  if (cartCountSpan) {
    cartCountSpan.textContent = 0;
  }
});


// const url_api = 'http://localhost:8000/produk';

// // Ambil ID produk dari URL
// const urlParams = new URLSearchParams(window.location.search);
// const id = urlParams.get('id');

// // Ambil detail produk berdasarkan ID
// async function fetchProdukById(id) {
//   try {
//     const response = await fetch(`${url_api}/${id}`);
//     if (!response.ok) throw new Error('Produk tidak ditemukan');
//     const produk = await response.json();
//     tampilkanDetailProduk(produk);
//   } catch (error) {
//     console.error(error);
//     const container = document.getElementById('produk-container');
//     if (container) {
//       container.innerHTML = '<p class="text-red-500">Produk tidak ditemukan.</p>';
//     }
//   }
// }

// function tampilkanDetailProduk(produk) {
//   document.getElementById('produk-gambar').src = produk.gambar_produk;
//   document.getElementById('produk-nama').textContent = produk.nama_produk;
//   document.getElementById('produk-deskripsi').textContent = produk.deskripsi;
//   document.getElementById('produk-harga').textContent = `Rp ${Number(produk.harga_produk).toLocaleString('id-ID')}`;
//   document.getElementById('produk-lama').textContent = produk.lama_pembuatan || '7–8 Menit';
// }

// // Ambil 6 rekomendasi produk
// async function fetchRekomendasiProduk() {
//   try {
//     const response = await fetch(url_api);
//     if (!response.ok) {
//       throw new Error('Gagal fetch data');
//     }

//     const products = await response.json();
//     const rekomendasi = products.filter(p => p._id !== id).slice(0, 6); // Hindari produk yang sedang dibuka
//     tampilkanRekomendasiProduk(rekomendasi);
//   } catch (error) {
//     console.error('Error saat fetch produk:', error);
//   }
// }

// function tampilkanRekomendasiProduk(products) {
//   const container = document.getElementById('rekomendasi-container');
//   container.innerHTML = ''; // Bersihkan konten sebelumnya

//   products.forEach(product => {
//     const card = document.createElement('a');
//     card.href = `buying.html?id=${product._id}`;
//     card.className = 'block bg-white p-4 rounded-2xl shadow hover:shadow-lg mb-10 transition';

//     card.innerHTML = `
//       <img src="${product.gambar_produk}" alt="${product.nama_produk}" class="rounded-lg mb-4 h-40 w-full object-cover">
//       <div class="text-gray-500 text-sm mb-1">21-25 min</div>
//       <div class="flex items-center gap-1 text-yellow-400 text-sm mb-2">⭐ ${(product.rating || 4.5).toFixed(1)} | ${product.review_count || '1k'} Rating</div>
//       <h4 class="text-lg font-bold mb-1">${product.nama_produk}</h4>
//       <p class="text-gray-700">Rp ${Number(product.harga_produk).toLocaleString('id-ID')}</p>
//     `;

//     container.appendChild(card);
//   });
// }

// // Jalankan saat halaman selesai dimuat
// window.addEventListener('DOMContentLoaded', () => {
//   if (id) {
//     fetchProdukById(id);
//   }
//   fetchRekomendasiProduk();
// });

// script.js

// script.js

// Function to fetch product data from the API
// Function to display products in card format
// Buying Page.js

// Buying Page.js

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
        <p class="mb-1 text-sm"><span class="font-semibold">Bahan:</span> ${product.kategori_produk}</p>
        <p class="mb-1 text-sm"><span class="font-semibold">Komposisi:</span> ${product.lama_pembuatan}</p>

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
        <button class="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold">Beli Sekarang</button>

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
  cartItems.push(product);
  localStorage.setItem('cartItems', JSON.stringify(cartItems));

  const newCount = cartItems.length;
  updateCartCount(newCount);
  console.log('Produk ditambahkan ke cart:', product.nama_produk);
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

