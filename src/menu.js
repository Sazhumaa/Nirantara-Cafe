// ========================================
// KONFIGURASI API DAN VARIABEL GLOBAL
// ========================================
const API_BASE_URL = "http://localhost:8000"
const url_api = `${API_BASE_URL}/produk`

// Elemen DOM
const productList = document.getElementById("coffee-container")
const navMenus = document.querySelectorAll(".nav-menu")
const searchInput = document.getElementById("search-input")

// ========================================
// SISTEM MANAJEMEN CART - SESUAI HOME PAGE
// ========================================

// Fungsi: Ambil data cart dari localStorage
function getCartItems() {
  return JSON.parse(localStorage.getItem("cartItems")) || []
}

// Fungsi: Simpan data cart ke localStorage
function saveCartItems(cartItems) {
  localStorage.setItem("cartItems", JSON.stringify(cartItems))
}

// Fungsi: Update counter cart di UI
function updateCartCount(newCount = null) {
  // Hitung ulang jika tidak diberikan explicit count
  const totalCount = newCount !== null ? newCount : getCartItems().reduce((sum, item) => sum + item.jumlah, 0)

  // Simpan ke localStorage
  localStorage.setItem("cartCount", totalCount)

  // Update semua elemen cart count di halaman
  const cartCountElements = document.querySelectorAll("#cart-count")
  cartCountElements.forEach((el) => {
    if (el) el.textContent = totalCount
  })
}

// Fungsi: Ambil jumlah item di cart
function getCartCount() {
  return Number.parseInt(localStorage.getItem("cartCount")) || 0
}

// Fungsi: Menambahkan produk ke keranjang - SAMA DENGAN HOME PAGE
function tambahKeCart(product) {
  // Ambil data cart dari localStorage
  const cartItems = getCartItems()

  // Cek apakah produk sudah ada di cart
  const existingIndex = cartItems.findIndex((item) => item.nama_produk === product.nama_produk)

  if (existingIndex > -1) {
    // Jika sudah ada, tambahkan quantity
    cartItems[existingIndex].jumlah += 1
  } else {
    // Jika belum ada, tambahkan item baru dengan struktur yang sama
    cartItems.push({
      nama_produk: product.nama_produk,
      harga_produk: product.harga_produk,
      gambar_produk: product.gambar_produk,
      jumlah: 1,
    })
  }

  // Simpan kembali ke localStorage
  saveCartItems(cartItems)

  // Hitung total item dan update counter
  const newCount = cartItems.reduce((sum, item) => sum + item.jumlah, 0)
  updateCartCount(newCount)

  // Show feedback notification
  showAddToCartFeedback(product.nama_produk)

  // Log untuk debugging
  console.log(`✓ ${product.nama_produk} ditambahkan ke keranjang`)
}


// ========================================
// SISTEM FETCH DAN DISPLAY PRODUK
// ========================================

// Fungsi: Fetch produk dari API dengan filter kategori
async function fetchProducts(kategori = "All") {
  try {
    const response = await fetch(url_api)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    // Filter berdasarkan kategori
    const filteredProducts = kategori === "All" ? data : data.filter((product) => product.kategori_produk === kategori)

    displayProducts(filteredProducts)
  } catch (error) {
    console.error("Error fetching products:", error)
    showErrorMessage()
  }
}

// Fungsi: Tampilkan produk di UI
function displayProducts(products) {
  if (!productList) return

  productList.innerHTML = "" // Bersihkan container

  if (products.length === 0) {
    productList.innerHTML = `
      <div class="col-span-full text-center py-8">
        <p class="text-gray-500">Tidak ada produk dalam kategori ini.</p>
      </div>
    `
    return
  }

  // Batasi tampilan maksimal 20 produk
  const displayedProducts = products.slice(0, 20)

  displayedProducts.forEach((product, index) => {
    const productDiv = document.createElement("div")
    productDiv.className =
      "bg-white rounded-xl shadow-md p-4 flex flex-col hover:shadow-lg transition-shadow duration-200 relative"

    const productId = `cart-icon-${index}`
    const encodedName = encodeURIComponent(product.nama_produk)

    productDiv.innerHTML = `
      <!-- Tombol Add to Cart -->
      <button id="${productId}" 
              aria-label="Add to cart"
              class="absolute top-2 right-2 bg-green-200 hover:bg-green-300 rounded-2xl p-2 z-10 transition-colors duration-200">
        <img src="image/shopping-cart.png" class="w-5 h-5 pointer-events-none" alt="Cart">
      </button>

      <!-- Link ke Halaman Detail Produk -->
      <a href="Buying Page.html?name=${encodedName}" class="block group">
        <!-- Gambar Produk -->
        <img src="${product.gambar_produk}" 
             alt="${product.nama_produk}" 
             class="w-full h-40 object-contain mb-4 rounded-md group-hover:scale-105 transition-transform"
             onerror="this.src='/placeholder.svg?height=160&width=160'">
        
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
          <h2 class="text-sm font-semibold text-gray-800 truncate mb-1 group-hover:text-green-600 transition-colors">
            ${product.nama_produk}
          </h2>
        </div>
        
        <!-- Harga Produk -->
        <p class="text-md font-bold text-gray-900">
          Rp ${Number(product.harga_produk).toLocaleString("id-ID")}
        </p>
      </a>
    `

    productList.appendChild(productDiv)

    // Event listener untuk tombol cart
    const cartButton = document.getElementById(productId)
    if (cartButton) {
      cartButton.addEventListener("click", (e) => {
        e.preventDefault()
        e.stopPropagation()
        tambahKeCart(product)
      })
    }
  })
}

// Fungsi: Tampilkan pesan error
function showErrorMessage() {
  if (productList) {
    productList.innerHTML = `
      <div class="col-span-full text-center py-8">
        <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <p class="text-red-500 mb-2">Gagal memuat produk</p>
        <p class="text-xs text-gray-500 mb-3">Pastikan server berjalan di ${API_BASE_URL}</p>
        <button onclick="fetchProducts('All')" class="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600">
          Coba Lagi
        </button>
      </div>
    `
  }
}

// ========================================
// SISTEM FILTER KATEGORI
// ========================================

// Setup event listeners untuk menu kategori
function setupCategoryFilters() {
  navMenus.forEach((menu) => {
    menu.addEventListener("click", () => {
      // Remove active class dari semua menu
      navMenus.forEach((m) => m.classList.remove("bg-[#D9D9D9]", "active"))

      // Add active class ke menu yang diklik
      menu.classList.add("bg-[#D9D9D9]", "active")

      // Fetch produk berdasarkan kategori
      const kategori = menu.getAttribute("data-kategori") || "All"
      fetchProducts(kategori)
    })
  })
}

// ========================================
// SISTEM SEARCH
// ========================================

// Setup search functionality
function setupSearch() {
  if (searchInput) {
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault()

        const query = e.target.value.trim()
        if (query !== "") {
          // Redirect ke halaman search dengan query parameter
          window.location.href = `SearchPage.html?query=${encodeURIComponent(query)}`
        }
      }
    })
  }
}

// ========================================
// SISTEM MANAJEMEN PROFIL USER
// ========================================

// Fungsi: Load profil user dari localStorage
function loadUserProfile() {
  let profileData = null
  try {
    const savedProfile = localStorage.getItem("userProfile")
    if (savedProfile) {
      profileData = JSON.parse(savedProfile)
    }
  } catch (error) {
    console.error("Error loading profile:", error)
  }

  if (profileData) {
    updateUserDisplay(profileData)
  } else {
    useDefaultProfile()
  }
}

// Fungsi: Update tampilan user di UI
function updateUserDisplay(profileData) {
  // Update gambar profil di navbar
  const profileImgElement = document.getElementById("navProfileImage")
  if (profileImgElement && profileData.profileImage) {
    profileImgElement.src = profileData.profileImage
  }

  // Update nama user jika ada elemen untuk itu
  const userNameElement = document.querySelector(".user-name")
  if (userNameElement) {
    userNameElement.textContent = `${profileData.firstName} ${profileData.lastName}`
  }
}

// Fungsi: Gunakan profil default
function useDefaultProfile() {
  const defaultData = {
    firstName: "Suisei",
    lastName: "Hoshimachi",
    email: "suiseihoshimachi@gmail.com",
    birthDate: "22 Maret",
    profileImage: "image/Suiseiii pp.jpg",
  }

  updateUserDisplay(defaultData)
}

// ========================================
// SISTEM SINKRONISASI REAL-TIME
// ========================================

// Listen untuk perubahan localStorage dari tab lain
window.addEventListener("storage", (e) => {
  if (e.key === "userProfile") {
    console.log("Profile updated in another tab")
    loadUserProfile()
  } else if (e.key === "cartItems" || e.key === "cartCount") {
    console.log("Cart updated in another tab")
    updateCartCount()
  }
})

// ========================================
// INISIALISASI HALAMAN
// ========================================

// Setup semua functionality saat DOM ready
document.addEventListener("DOMContentLoaded", () => {
  // Load data awal
  updateCartCount() // Sync cart count dari localStorage
  loadUserProfile() // Load profil user

  // Setup event listeners
  setupCategoryFilters() // Setup filter kategori
  setupSearch() // Setup search functionality

  // Fetch dan tampilkan produk awal (semua kategori)
  fetchProducts("All")

  console.log("Menu page initialized successfully")
})

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Fungsi: Format harga ke format Indonesia
function formatPrice(price) {
  return new Intl.NumberFormat("id-ID").format(price)
}

// Fungsi: Cek apakah user sudah setup profil
function isProfileSetup() {
  return localStorage.getItem("userProfile") !== null
}

// Fungsi: Get current user profile
function getCurrentUserProfile() {
  const savedProfile = localStorage.getItem("userProfile")
  return savedProfile ? JSON.parse(savedProfile) : null
}

// ========================================
// GLOBAL EXPORTS (untuk debugging)
// ========================================
window.fetchProducts = fetchProducts
window.tambahKeCart = tambahKeCart
window.updateCartCount = updateCartCount
