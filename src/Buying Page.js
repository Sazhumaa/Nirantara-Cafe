// ========================================
// SISTEM NAVIGASI AKTIF
// ========================================
// Fungsi: Mengelola status aktif pada item navigasi
// Fitur: Menambah/menghapus class 'active' saat item diklik

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    // Hapus class 'active' dari semua item navigasi
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    // Tambahkan class 'active' ke item yang diklik
    item.classList.add('active');
  });
});

// ========================================
// SISTEM FETCH PRODUK DARI PARAMETER URL
// ========================================
// Fungsi: Mengambil data produk berdasarkan parameter URL (id, name, deskripsi, komposisi)
// Fitur: Mendukung pencarian produk dengan berbagai parameter
async function fetchProductFromParams() {
  // Ambil parameter dari URL
  const urlParams = new URLSearchParams(window.location.search);
  const idParam = urlParams.get("id");           // Parameter ID produk
  const nameParam = urlParams.get("name");       // Parameter nama produk
  const deskripsiParam = urlParams.get("deskripsi"); // Parameter deskripsi
  const komposisiParam = urlParams.get("komposisi"); // Parameter komposisi

  try {
    // Fetch data produk dari API
    const response = await fetch("http://localhost:8000/produk");
    const products = await response.json();

    let produk = null;
    
    // Cari produk berdasarkan parameter yang tersedia
    if (idParam) {
      // Pencarian berdasarkan ID
      produk = products.find(p => p.id == idParam);
    } else if (nameParam) {
      // Pencarian berdasarkan nama (case insensitive)
      produk = products.find(p => p.nama_produk?.toLowerCase() === nameParam.toLowerCase());
    } else if (deskripsiParam) {
      // Pencarian berdasarkan deskripsi (case insensitive)
      produk = products.find(p => p.deskripsi_produk?.toLowerCase() === deskripsiParam.toLowerCase());
    } else if (komposisiParam) {
      // Pencarian berdasarkan komposisi (case insensitive)
      produk = products.find(p => p.komposisi_produk?.toLowerCase() === komposisiParam.toLowerCase());
    }

    // Tampilkan produk jika ditemukan, atau tampilkan pesan error
    if (produk) {
      displayProduct(produk);
    } else {
      // Tampilkan pesan error jika produk tidak ditemukan
      document.getElementById("nama-produk").textContent = "Produk tidak ditemukan.";
      document.getElementById("deskripsi").textContent = "Produk tidak ditemukan.";
      document.getElementById("komposisi").textContent = "";
    }
  } catch (error) {
    // Handle error saat fetch gagal
    console.error("Gagal memuat produk:", error);
    document.getElementById("nama-produk").textContent = "Gagal memuat produk.";
    document.getElementById("deskripsi").textContent = "Gagal memuat data.";
    document.getElementById("komposisi").textContent = "Gagal memuat data.";
  }
}

// ========================================
// SISTEM TAMPILAN PRODUK DETAIL
// ========================================
// Fungsi: Menampilkan detail produk lengkap dengan kontrol interaktif
// Fitur: Layout responsif, kontrol quantity, tombol aksi, kalkulasi harga
function displayProduct(product) {
  const container = document.getElementById('product-container');
  
  // Generate HTML untuk tampilan produk detail
  container.innerHTML = `
    <div class="flex justify-center items-center bg-gray-100">
      <div class="bg-white rounded-2xl shadow-xl flex flex-col md:flex-row w-full max-w-7xl overflow-hidden">
        <!-- Bagian Gambar Produk -->
        <div class="md:w-1/2 bg-white p-6 flex justify-center items-center">
          <img src="${product.gambar_produk}" alt="${product.nama_produk}" class="max-w-full h-auto rounded-xl">
        </div>
        
        <!-- Bagian Informasi Produk -->
        <div class="md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <!-- Nama Produk -->
            <h2 class="text-2xl font-bold mb-2" id="nama-produk">${product.nama_produk}</h2>
            
            <!-- Rating Bintang -->
            <div class="flex space-x-1 my-2 text-yellow-500 text-xl">★★★★★</div>
            
            <!-- Harga Produk (akan diupdate berdasarkan quantity) -->
            <p class="text-2xl text-yellow-600 font-bold">Rp <span id="total-harga">${product.harga_produk}</span></p>
            
            <!-- Informasi Tambahan -->
            <p class="text-sm text-gray-500 mb-2">Lama Pembuatan: ${product.lama_pembuatan}</p>
            
            <!-- Fitur Promo dan Pengiriman -->
            <ul class="text-sm text-gray-600 space-y-1 mb-4">
              <li>🎁 Gratis ongkir ke seluruh Indonesia</li>
              <li>🚚 Estimasi kirim: 1-2 hari</li>
              <li class="text-green-600">🔥 Promo terbatas hari ini!</li>
            </ul>
            
            <!-- Kontrol Quantity -->
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
              <!-- Tombol Beli Sekarang -->
              <a href="buyingPageP2.html">
              <button id="beliBtn" class="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold" >Beli Sekarang</button>
              </a>
              <!-- Tombol Tambah ke Keranjang -->
              <button id="add-to-cart" class="bg-green-500 hover:bg-green-600 p-2 rounded-lg">
                <img src="image/shopping-cart-Puth.png" alt="Cart" class="w-6 h-6" />
              </button>
              
              <!-- Tombol Wishlist -->
              <button class="bg-green-500 hover:bg-green-600 p-2 rounded-lg">
                <img src="image/wishlist-Putih.png" alt="Wishlist" class="w-6 h-6">
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // ========================================
  // SISTEM TAMPILAN DESKRIPSI DAN KOMPOSISI
  // ========================================
  // Fungsi: Menampilkan deskripsi produk dengan fallback jika tidak ada data
  document.getElementById("deskripsi").innerHTML = product.deskripsi_produk
    ? `<div class="text-gray-700 text-sm leading-relaxed text-center">${product.deskripsi_produk}</div>`
    : `<div class="text-red-500 text-sm text-center">Deskripsi tidak tersedia.</div>`;

  // Fungsi: Menampilkan komposisi produk dengan fallback jika tidak ada data
  document.getElementById("komposisi").innerHTML = product.komposisi_produk
    ? `<ul class="list-disc list-inside text-gray-700 text-sm space-y-1 text-center">${product.komposisi_produk}</ul>`
    : `<div class="text-red-500 text-sm text-center">Komposisi tidak tersedia.</div>`;

  // ========================================
  // SISTEM KONTROL QUANTITY DAN KALKULASI HARGA
  // ========================================
  // Inisialisasi elemen dan variabel untuk kontrol quantity
  const quantitySpan = document.getElementById("quantity");
  const incrementBtn = document.getElementById("increment");
  const decrementBtn = document.getElementById("decrement");
  const totalHargaEl = document.getElementById("total-harga");
  let quantity = 1; // Quantity default
  const hargaSatuan = parseInt(product.harga_produk); // Harga per unit

  // Fungsi: Update total harga berdasarkan quantity
  function updateTotalHarga() {
    totalHargaEl.textContent = (hargaSatuan * quantity).toLocaleString('id-ID');
  }

  // Event Listener: Tombol increment quantity
  incrementBtn.addEventListener("click", () => {
    quantity++; // Tambah quantity
    quantitySpan.textContent = quantity; // Update tampilan
    updateTotalHarga(); // Update total harga
  });

  // Event Listener: Tombol decrement quantity (minimum 1)
  decrementBtn.addEventListener("click", () => {
    if (quantity > 1) {
      quantity--; // Kurangi quantity
      quantitySpan.textContent = quantity; // Update tampilan
      updateTotalHarga(); // Update total harga
    }
  });

  // ========================================
  // EVENT LISTENER TAMBAH KE KERANJANG
  // ========================================
  // Event Listener: Tombol "Tambah ke Keranjang"
  document.getElementById("add-to-cart").addEventListener("click", () => {
    addToCart(product, quantity); // Panggil fungsi addToCart dengan quantity saat ini
  });
}

// ========================================
// SISTEM MANAJEMEN KERANJANG BELANJA
// ========================================
// Fungsi: Menambahkan item ke keranjang belanja di localStorage
// Fitur: Menggabungkan item yang sama, update counter keranjang
function addToCart(product, quantity = 1) {
  // Buat object item untuk keranjang
  const item = {
    nama_produk: product.nama_produk,
    harga_produk: product.harga_produk,
    gambar_produk: product.gambar_produk,
    jumlah: quantity
  };

  // Ambil data keranjang dari localStorage
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  
  // Cek apakah item sudah ada di keranjang
  const existing = cartItems.find(i => i.nama_produk === item.nama_produk);
  
  if (existing) {
    // Jika sudah ada, tambahkan quantity
    existing.jumlah += quantity;
  } else {
    // Jika belum ada, tambahkan item baru
    cartItems.push(item);
  }

  // Simpan kembali ke localStorage
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  
  // Update counter keranjang
  const totalItems = cartItems.reduce((sum, i) => sum + i.jumlah, 0);
  updateCartCount(totalItems);
}

// ========================================
// SISTEM UPDATE COUNTER KERANJANG
// ========================================
// Fungsi: Update tampilan counter keranjang di UI
function updateCartCount(newCount) {
  localStorage.setItem('cartCount', newCount); // Simpan count ke localStorage
  const el = document.getElementById('cart-count');
  if (el) el.textContent = newCount; // Update tampilan counter
}

// Fungsi: Ambil jumlah item di keranjang dari localStorage
function getCartCount() {
  return parseInt(localStorage.getItem('cartCount')) || 0;
}

// ========================================
// SISTEM REKOMENDASI PRODUK
// ========================================
// Fungsi: Memuat dan menampilkan produk rekomendasi
// Fitur: Carousel produk, tombol add to cart, link ke detail produk
async function loadRekomendasiProduk() {
  try {
    // Fetch data produk dari API
    const response = await fetch("http://localhost:8000/produk");
    const data = await response.json();
    const container = document.getElementById("rekomendasi-produk");
    container.innerHTML = ""; // Bersihkan container

    // Ambil 4 produk pertama untuk rekomendasi
    const rekomendasi = data.slice(0, 4);
    
    rekomendasi.forEach(product => {
      const productDiv = document.createElement("div");
      // Styling untuk card produk rekomendasi
      productDiv.className = "bg-white rounded-2xl shadow-md relative w-[250px] flex-shrink-0 hover:shadow-xl mx-1 my-2 p-3";

      // Encode nama produk untuk URL yang aman
      const encodedName = encodeURIComponent(product.nama_produk);

      // Generate HTML untuk card produk rekomendasi
      productDiv.innerHTML = `
        <!-- Tombol Add to Cart -->
        <button 
          class="cart-btn absolute top-2 right-2 bg-green-200  rounded-full p-2 z-10 transition-colors duration-200 shadow-sm" 
          aria-label="Add to cart" 
          data-product='${JSON.stringify(product)}'>
          <img src="image/shopping-cart.png" class="w-5 h-5 pointer-events-none" />
        </button>

        <!-- Link ke halaman detail produk -->
        <a href="Buying Page.html?name=${encodedName}" class="block group">
          <!-- Gambar Produk -->
          <div class="overflow-hidden rounded-xl mb-3">
            <img 
              src="${product.gambar_produk}" 
              alt="${product.nama_produk}" 
              class="w-full h-44  "
            />
          </div>

          <!-- Estimasi Waktu -->
          <p class="text-[11px] text-gray-500 mb-1">21–25 min</p>

          <!-- Rating -->
          <div class="flex items-center text-yellow-500 text-sm mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="w-4 h-4 mr-1">
              <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.782 1.4 8.171L12 18.896l-7.334 3.868 1.4-8.171L.132 9.211l8.2-1.193z"/>
            </svg>
            <span class="font-semibold">${(product.rating || 4.2).toFixed(1)}</span>
            <span class="text-gray-600 text-xs ml-1">| ${product.review_count || 120} Rating</span>
          </div>

          <!-- Nama Produk -->
          <h2 class="text-sm font-semibold text-gray-800 mb-1 leading-snug line-clamp-2">${product.nama_produk}</h2>

          <!-- Harga Produk -->
          <p class="text-md font-bold text-gray-900">Rp ${Number(product.harga_produk).toLocaleString('id-ID')}</p>
        </a>
      `;
      
      container.appendChild(productDiv);
    });

    // ========================================
    // EVENT LISTENER UNTUK TOMBOL CART REKOMENDASI
    // ========================================
    // Tambahkan event listener untuk semua tombol cart di section rekomendasi
    const cartButtons = container.querySelectorAll('.cart-btn');
    cartButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault(); // Cegah default action
        e.stopPropagation(); // Cegah event bubbling
        
        // Ambil data produk dari attribute
        const productData = JSON.parse(button.getAttribute('data-product'));
        addToCart(productData, 1); // Tambahkan ke keranjang dengan quantity 1
      });
    });

  } catch (error) {
    console.error("Gagal memuat rekomendasi produk:", error);
  }
}

// ========================================
// SISTEM INISIALISASI HALAMAN
// ========================================
// Event Listener: Inisialisasi saat DOM selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
  // Update counter keranjang dari localStorage
  updateCartCount(getCartCount());
  
  // Fetch dan tampilkan produk berdasarkan parameter URL
  fetchProductFromParams();
  
  // Load produk rekomendasi
  loadRekomendasiProduk();

  // ========================================
  // SISTEM NAVIGASI TAB (DESKRIPSI/KOMPOSISI)
  // ========================================
  // Event Listener: Tab Deskripsi
  document.getElementById('tab-deskripsi').addEventListener('click', () => {
    document.getElementById('deskripsi').classList.remove('hidden'); // Tampilkan deskripsi
    document.getElementById('komposisi').classList.add('hidden');    // Sembunyikan komposisi
  });

  // Event Listener: Tab Komposisi
  document.getElementById('tab-komposisi').addEventListener('click', () => {
    document.getElementById('komposisi').classList.remove('hidden'); // Tampilkan komposisi
    document.getElementById('deskripsi').classList.add('hidden');    // Sembunyikan deskripsi
  });
});

// ========================================
// SISTEM MANAJEMEN PROFIL USER
// ========================================
// Fungsi: Memuat dan menampilkan data profil user di halaman lain
// Fitur: Sinkronisasi profil antar halaman, fallback ke data default
function loadUserProfileInOtherPage() {
    // Cek apakah ada data profil tersimpan di localStorage
    const savedProfile = localStorage.getItem('userProfile');
    
    if (savedProfile) {
        try {
            const profileData = JSON.parse(savedProfile);
            
            // Update elemen-elemen yang menampilkan info user
            updateUserDisplay(profileData);
            
            console.log('Profile loaded:', profileData);
        } catch (error) {
            console.error('Error loading profile:', error);
            // Gunakan data default jika ada error parsing
            useDefaultProfile();
        }
    } else {
        // Gunakan data default jika belum ada profil tersimpan
        useDefaultProfile();
    }
}

// ========================================
// SISTEM UPDATE TAMPILAN PROFIL USER
// ========================================
// Fungsi: Update tampilan user di berbagai elemen halaman
function updateUserDisplay(profileData) {
    // Update nama user di header/navbar
    const userNameElement = document.querySelector('.user-name');
    if (userNameElement) {
        userNameElement.textContent = `${profileData.firstName} ${profileData.lastName}`;
    }
    
    // Update foto profil di header/navbar
    const userAvatarElement = document.querySelector('.user-avatar');
    if (userAvatarElement) {
        userAvatarElement.src = profileData.profileImage;
    }
    
    // Update email di footer atau info section
    const userEmailElement = document.querySelector('.user-email');
    if (userEmailElement) {
        userEmailElement.textContent = profileData.email;
    }
    
    // Update welcome message
    const welcomeElement = document.querySelector('.welcome-message');
    if (welcomeElement) {
        welcomeElement.textContent = `Welcome back, ${profileData.firstName}!`;
    }
}

// ========================================
// SISTEM DATA PROFIL DEFAULT
// ========================================
// Fungsi: Gunakan data profil default jika tidak ada data tersimpan
function useDefaultProfile() {
    const defaultData = {
        firstName: "Suisei",
        lastName: "Hoshimachi",
        email: "suiseihoshimachi@gmail.com",
        birthDate: "22 Maret",
        profileImage: "image/Suiseiii pp.jpg"
    };
    
    updateUserDisplay(defaultData);
}

// ========================================
// SISTEM SINKRONISASI PROFIL REAL-TIME
// ========================================
// Event Listener: Listen untuk perubahan localStorage dari tab lain
// Fitur: Sinkronisasi real-time antar tab browser
window.addEventListener('storage', function(e) {
    if (e.key === 'userProfile') {
        console.log('Profile updated in another tab');
        loadUserProfileInOtherPage(); // Reload profil jika ada perubahan
    }
});

// ========================================
// INISIALISASI SISTEM PROFIL
// ========================================
// Event Listener: Panggil fungsi load profil saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    loadUserProfileInOtherPage();
});

// ========================================
// UTILITY FUNCTIONS UNTUK PROFIL
// ========================================
// Fungsi utility: Mendapatkan data profil saat ini
function getCurrentUserProfile() {
    const savedProfile = localStorage.getItem('userProfile');
    return savedProfile ? JSON.parse(savedProfile) : null;
}

// Fungsi utility: Mengecek apakah user sudah setup profil
function isProfileSetup() {
    return localStorage.getItem('userProfile') !== null;
}

// ========================================
// SISTEM UPDATE GAMBAR PROFIL NAVBAR
// ========================================
// Event Listener: Update gambar profil di navbar saat halaman dimuat
// Fitur: Sinkronisasi gambar profil dari localStorage ke elemen navbar
document.addEventListener('DOMContentLoaded', function () {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      try {
        const profileData = JSON.parse(savedProfile);
        if (profileData.profileImage) {
          // Update gambar profil di navbar
          const profileImgElement = document.getElementById('navProfileImage');
          if (profileImgElement) {
            profileImgElement.src = profileData.profileImage;
          }
        }
      } catch (e) {
        console.error('Gagal memuat gambar profil dari localStorage:', e);
      }
    }
});