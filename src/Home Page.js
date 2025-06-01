// ========================================
// KONFIGURASI API
// ========================================
// URL endpoint API untuk mengambil data produk
const url_api = 'http://localhost:8000/produk';

// ========================================
// SISTEM FETCH PRODUK DARI API
// ========================================
// Fungsi: Mengambil data produk dari API
// Fitur: Error handling dan tampilan error message
async function fetchProducts() {
  try {
    // Fetch data dari API
    const response = await fetch(url_api);
    
    // Validasi response
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    // Parse response JSON
    const products = await response.json();
    
    // Tampilkan produk di UI
    displayProducts(products);
  } catch (error) {
    // Handle error saat fetch gagal
    console.error('Ada masalah ama fetchnya:', error);
    
    // Tampilkan pesan error di UI
    document.getElementById('error-message').classList.remove('hidden');
  }
}

// ========================================
// INISIALISASI HALAMAN
// ========================================
// Load produk saat halaman dimuat
window.onload = fetchProducts;

// ========================================
// SISTEM DISPLAY PRODUK
// ========================================
// Fungsi: Menampilkan produk dalam format card
// Fitur: Layout responsif, tombol cart, link ke detail produk
function displayProducts(products) {
  // Ambil container untuk produk
  const productList = document.getElementById('coffee-container');
  productList.innerHTML = ''; // Bersihkan container

  // Batasi jumlah produk yang ditampilkan (8 produk)
  const limitedProducts = products.slice(0, 8);

  // Loop untuk setiap produk
  limitedProducts.forEach((product, index) => {
    // Buat elemen div untuk produk
    const productDiv = document.createElement('div');
    
    // Styling untuk card produk
    productDiv.className = 'bg-white rounded-xl shadow-md p-4 flex flex-col hover:shadow-lg transition-shadow duration-200 relative';

    // Generate ID unik untuk tombol cart
    const productId = `cart-icon-${index}`;
    
    // Encode nama produk untuk URL yang aman
    const encodedName = encodeURIComponent(product.nama_produk);

    // Generate HTML untuk card produk
    productDiv.innerHTML = `
      <!-- Tombol keranjang berada di luar <a> -->
      <button class="absolute top-2 right-2 bg-green-200 rounded-2xl p-2 z-10" id="${productId}" aria-label="Add to cart">
        <img src="image/shopping-cart.png" class="w-5 h-5 pointer-events-none" />
      </button>

      <!-- Link ke Buying Page -->
      <a href="Buying Page.html?name=${encodedName}" class="block">
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
        <div class="flex justify-between items-center">
          <h2 class="text-sm font-semibold text-gray-800 truncate mb-1">${product.nama_produk}</h2>
        </div>
        
        <!-- Harga Produk -->
        <p class="text-md font-bold text-gray-900">Rp ${Number(product.harga_produk).toLocaleString('id-ID')}</p>
      </a>
    `;

    // Tambahkan card ke container
    productList.appendChild(productDiv);

    // ========================================
    // EVENT LISTENER TOMBOL CART
    // ========================================
    // Event listener untuk tombol keranjang
    const cartBtn = document.getElementById(productId);
    if (cartBtn) {
      cartBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Hindari bubbling ke <a>
        e.preventDefault();  // Hindari klik default
        tambahKeCart(product); // Tambahkan produk ke cart
      });
    }
  });
}

// ========================================
// SISTEM MANAJEMEN CART
// ========================================
// Fungsi: Menambahkan produk ke keranjang belanja
// Fitur: Menggabungkan item yang sama, update counter keranjang
function tambahKeCart(product) {
  // Ambil data cart dari localStorage
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

  // Cek apakah produk sudah ada di cart
  const existingIndex = cartItems.findIndex(item => item.nama_produk === product.nama_produk);

  if (existingIndex > -1) {
    // Jika sudah ada, tambahkan quantity
    cartItems[existingIndex].jumlah += 1;
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
  localStorage.setItem('cartItems', JSON.stringify(cartItems));

  // Hitung total item di cart
  const newCount = cartItems.reduce((sum, item) => sum + item.jumlah, 0);
  
  // Update counter cart di UI
  updateCartCount(newCount);
  
  // Log untuk debugging
  console.log(`Produk ${product.nama_produk} ditambahkan ke keranjang.`);
}

// ========================================
// SISTEM UPDATE COUNTER CART
// ========================================
// Fungsi: Update tampilan counter cart di UI
function updateCartCount(newCount) {
  // Simpan count ke localStorage
  localStorage.setItem('cartCount', newCount);
  
  // Update tampilan counter di UI
  const cartCountElement = document.getElementById('cart-count');
  if (cartCountElement) {
    cartCountElement.textContent = newCount;
  }
}

// ========================================
// UTILITY FUNCTION CART
// ========================================
// Fungsi: Ambil jumlah item di cart dari localStorage
function getCartCount() {
  return parseInt(localStorage.getItem('cartCount')) || 0;
}

// ========================================
// INISIALISASI COUNTER CART
// ========================================
// Update cart count saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount(getCartCount());
});

// ========================================
// SISTEM SEARCH
// ========================================
// Fungsi: Implementasi search dengan redirect ke halaman hasil
// Fitur: Pencarian dengan parameter query di URL
document.getElementById('search-input').addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    e.preventDefault(); // Hindari submit form default
    
    // Ambil query search
    const query = e.target.value.trim();
    
    // Redirect ke halaman search jika query tidak kosong
    if (query !== '') {
      window.location.href = `SearchPage.html?query=${encodeURIComponent(query)}`;
    }
  }
});

// ========================================
// SISTEM MANAJEMEN PROFIL USER
// ========================================
// Fungsi: Memuat dan menampilkan data profil user di halaman
// Fitur: Sinkronisasi profil antar halaman, fallback ke data default
function loadUserProfileInOtherPage() {
    // Cek apakah ada data profil tersimpan di localStorage
    const savedProfile = localStorage.getItem('userProfile');
    
    if (savedProfile) {
        try {
            // Parse data profil
            const profileData = JSON.parse(savedProfile);
            
            // Update elemen-elemen yang menampilkan info user
            updateUserDisplay(profileData);
            
            // Log untuk debugging
            console.log('Profile loaded:', profileData);
        } catch (error) {
            // Handle error parsing data profil
            console.error('Error loading profile:', error);
            
            // Gunakan data default jika ada error
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
    // Data profil default
    const defaultData = {
        firstName: "Suisei",
        lastName: "Hoshimachi",
        email: "suiseihoshimachi@gmail.com",
        birthDate: "22 Maret",
        profileImage: "image/Suiseiii pp.jpg"
    };
    
    // Update tampilan dengan data default
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