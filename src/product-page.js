// ========================================
// GLOBAL VARIABLES AND CONFIGURATION
// ========================================
let products = []
let selectedProduct = null
let currentQuantity = 1

// API Configuration
const API_BASE_URL = "http://localhost:8000"

// ========================================
// INITIALIZATION SYSTEM
// ========================================
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount(getCartCount())
  fetchProductFromParams()
  loadRekomendasiProduk()
  setupEventListeners()
  loadUserProfileInOtherPage()
})

// ========================================
// PRODUCT FETCHING SYSTEM FROM URL PARAMS
// ========================================
async function fetchProductFromParams() {
  const urlParams = new URLSearchParams(window.location.search)
  const idParam = urlParams.get("id")
  const nameParam = urlParams.get("name")
  const deskripsiParam = urlParams.get("deskripsi")
  const komposisiParam = urlParams.get("komposisi")

  try {
    const response = await fetch(`${API_BASE_URL}/produk`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    products = await response.json()
    let produk = null

    // Search product based on available parameters
    if (idParam) {
      produk = products.find((p) => p.id == idParam)
    } else if (nameParam) {
      produk = products.find(
        (p) =>
          p.nama_produk?.toLowerCase() === nameParam.toLowerCase() || p.nama?.toLowerCase() === nameParam.toLowerCase(),
      )
    } else if (deskripsiParam) {
      produk = products.find(
        (p) =>
          p.deskripsi_produk?.toLowerCase() === deskripsiParam.toLowerCase() ||
          p.deskripsi?.toLowerCase() === deskripsiParam.toLowerCase(),
      )
    } else if (komposisiParam) {
      produk = products.find(
        (p) =>
          p.komposisi_produk?.toLowerCase() === komposisiParam.toLowerCase() ||
          p.komposisi?.toLowerCase() === komposisiParam.toLowerCase(),
      )
    } else {
      // If no params, show first product
      produk = products[0]
    }

    if (produk) {
      selectedProduct = produk
      displayProduct(produk)
    } else {
      showError("Produk tidak ditemukan")
    }
  } catch (error) {
    console.error("Gagal memuat produk:", error)
    showError("Gagal memuat produk dari server")
  }
}

// ========================================
// PRODUCT DISPLAY SYSTEM
// ========================================
function displayProduct(product) {
  const container = document.getElementById("product-container")

  // Normalize product data
  const productData = {
    id: product.id,
    nama: product.nama_produk || product.nama || "Nama Produk",
    deskripsi: product.deskripsi_produk || product.deskripsi || "Deskripsi produk",
    harga: product.harga_produk || product.harga || 0,
    gambar: product.gambar_produk || product.gambar || "/placeholder.svg?height=200&width=200",
    komposisi: product.komposisi_produk || product.komposisi || "Komposisi tidak tersedia",
    lama_pembuatan: product.lama_pembuatan || "5-7 menit",
    rating: product.rating || 4.5,
  }

  container.innerHTML = `
        <div class="flex justify-center items-center bg-gray-100">
            <div class="bg-white rounded-2xl shadow-xl flex flex-col md:flex-row w-full max-w-7xl overflow-hidden">
                <!-- Product Image -->
                <div class="md:w-1/2 bg-white p-6 flex justify-center items-center">
                    <img src="${productData.gambar}" alt="${productData.nama}" 
                         class="max-w-full h-auto rounded-xl"
                         onerror="this.src='/placeholder.svg?height=300&width=300'">
                </div>
                
                <!-- Product Info -->
                <div class="md:w-1/2 p-6 flex flex-col justify-between">
                    <div>
                        <!-- Product Name -->
                        <h2 class="text-2xl font-bold mb-2">${productData.nama}</h2>
                        
                        <!-- Rating -->
                        <div class="flex space-x-1 my-2 text-yellow-500 text-xl">★★★★★</div>
                        
                        <!-- Price -->
                        <p class="text-2xl text-yellow-600 font-bold">
                            Rp <span id="total-harga">${formatPrice(productData.harga)}</span>
                        </p>
                        
                        <!-- Additional Info -->
                        <p class="text-sm text-gray-500 mb-2">Lama Pembuatan: ${productData.lama_pembuatan}</p>
                        
                        <!-- Features -->
                        <ul class="text-sm text-gray-600 space-y-1 mb-4">
                            <li>🎁 Gratis ongkir ke seluruh Jakarta Barat</li>
                            <li>🚚 Estimasi kirim: 25-30 menit</li>
                            <li class="text-green-600">🔥 Promo terbatas hari ini!</li>
                        </ul>
                        
                        <!-- Quantity Control -->
                        <div class="flex items-center space-x-3 mb-4">
                            <span class="font-semibold">Kuantitas</span>
                            <div class="flex items-center border rounded px-3 py-1">
                                <button class="text-lg font-bold px-2" id="decrement">-</button>
                                <span class="px-2" id="quantity">1</span>
                                <button class="text-lg font-bold px-2" id="increment">+</button>
                            </div>
                        </div>
                        
                        <!-- Action Buttons -->
                        <div class="flex space-x-3 mt-4">
                            <!-- Buy Now Button -->
                            <button id="beliBtn" class="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold">
                                Beli Sekarang
                            </button>
                            
                            <!-- Add to Cart Button -->
                            <button id="add-to-cart" class="bg-green-500 hover:bg-green-600 p-2 rounded-lg">
                                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z"></path>
                                </svg>
                            </button>
                            
                            <!-- Wishlist Button -->
                            <button class="bg-green-500 hover:bg-green-600 p-2 rounded-lg">
                                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `

  // Update description and composition sections
  updateProductTabs(productData)

  // Setup quantity controls
  setupQuantityControls(productData.harga)

  // Setup action buttons
  setupActionButtons(product)
}

// ========================================
// QUANTITY CONTROL SYSTEM
// ========================================
function setupQuantityControls(hargaSatuan) {
  const quantitySpan = document.getElementById("quantity")
  const incrementBtn = document.getElementById("increment")
  const decrementBtn = document.getElementById("decrement")
  const totalHargaEl = document.getElementById("total-harga")

  currentQuantity = 1

  function updateTotalHarga() {
    const total = hargaSatuan * currentQuantity
    totalHargaEl.textContent = formatPrice(total)
  }

  incrementBtn.addEventListener("click", () => {
    currentQuantity++
    quantitySpan.textContent = currentQuantity
    updateTotalHarga()
  })

  decrementBtn.addEventListener("click", () => {
    if (currentQuantity > 1) {
      currentQuantity--
      quantitySpan.textContent = currentQuantity
      updateTotalHarga()
    }
  })
}

// ========================================
// ACTION BUTTONS SYSTEM
// ========================================
function setupActionButtons(product) {
  // Buy Now Button - Transfer to checkout page
  document.getElementById("beliBtn").addEventListener("click", () => {
    transferToCheckout(product)
  })

  // Add to Cart Button
  document.getElementById("add-to-cart").addEventListener("click", () => {
    addToCart(product, currentQuantity)
  })
}

// ========================================
// CHECKOUT TRANSFER SYSTEM
// ========================================
function transferToCheckout(product) {
  // Prepare order data for checkout page
  const orderData = {
    product: {
      id: product.id,
      nama: product.nama_produk || product.nama,
      deskripsi: product.deskripsi_produk || product.deskripsi,
      harga: product.harga_produk || product.harga,
      gambar: product.gambar_produk || product.gambar,
      lama_pembuatan: product.lama_pembuatan || "5-7 menit",
    },
    quantity: currentQuantity,
    itemTotal: (product.harga_produk || product.harga) * currentQuantity,
    deliveryFee: 5000,
    paymentFee: 1000,
    timestamp: new Date().toISOString(),
  }

  // Calculate total
  orderData.totalAmount = orderData.itemTotal + orderData.deliveryFee + orderData.paymentFee

  // Store order data in localStorage
  localStorage.setItem("checkoutOrder", JSON.stringify(orderData))

  // Show loading feedback briefly
  const button = document.getElementById("beliBtn")
  const originalText = button.textContent
  button.textContent = "Memproses..."
  button.disabled = true

  // Redirect to checkout page after short delay
  setTimeout(() => {
    window.location.href = "checkout-page.html"
  }, 800)
}

// ========================================
// CART MANAGEMENT SYSTEM
// ========================================
function addToCart(product, quantity = 1) {
  const item = {
    id: product.id,
    nama_produk: product.nama_produk || product.nama,
    harga_produk: product.harga_produk || product.harga,
    gambar_produk: product.gambar_produk || product.gambar,
    jumlah: quantity,
  }

  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || []
  const existing = cartItems.find((i) => i.id === item.id)

  if (existing) {
    existing.jumlah += quantity
  } else {
    cartItems.push(item)
  }

  localStorage.setItem("cartItems", JSON.stringify(cartItems))

  const totalItems = cartItems.reduce((sum, i) => sum + i.jumlah, 0)
  updateCartCount(totalItems)

  // Show feedback
  showAddToCartFeedback(item.nama_produk)
}

function showAddToCartFeedback(productName) {
  const notification = document.createElement("div")
  notification.className =
    "fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-opacity"
  notification.textContent = `${productName} ditambahkan ke keranjang`

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.style.opacity = "0"
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 2000)
}

function updateCartCount(newCount) {
  localStorage.setItem("cartCount", newCount)
  const el = document.getElementById("cart-count")
  if (el) el.textContent = newCount
}

function getCartCount() {
  return Number.parseInt(localStorage.getItem("cartCount")) || 0
}

// ========================================
// PRODUCT TABS SYSTEM
// ========================================
function updateProductTabs(productData) {
  document.getElementById("nama-produk").textContent = productData.nama

  document.getElementById("deskripsi").innerHTML = productData.deskripsi
    ? `<div class="text-gray-700 text-sm leading-relaxed">${productData.deskripsi}</div>`
    : `<div class="text-red-500 text-sm">Deskripsi tidak tersedia.</div>`

  document.getElementById("komposisi").innerHTML = productData.komposisi
    ? `<div class="text-gray-700 text-sm leading-relaxed">${productData.komposisi}</div>`
    : `<div class="text-red-500 text-sm">Komposisi tidak tersedia.</div>`
}

// ========================================
// PRODUCT RECOMMENDATIONS SYSTEM
// ========================================
async function loadRekomendasiProduk() {
  try {
    const response = await fetch(`${API_BASE_URL}/produk`)
    const data = await response.json()
    const container = document.getElementById("rekomendasi-produk")
    container.innerHTML = ""

    const rekomendasi = data.slice(0, 8)

    rekomendasi.forEach((product) => {
      const productDiv = document.createElement("div")
      productDiv.className =
        "bg-white rounded-2xl shadow-md relative w-[250px] flex-shrink-0 hover:shadow-xl mx-1 my-2 p-3 transition-shadow"

      const encodedName = encodeURIComponent(product.nama_produk || product.nama)
      const productName = product.nama_produk || product.nama || "Produk"
      const productPrice = product.harga_produk || product.harga || 0
      const productImage = product.gambar_produk || product.gambar || "/placeholder.svg?height=200&width=200"

      productDiv.innerHTML = `
                <button 
                    class="cart-btn absolute top-2 right-2 bg-green-200 hover:bg-green-300 rounded-full p-2 z-10 transition-colors duration-200 shadow-sm" 
                    aria-label="Add to cart" 
                    data-product='${JSON.stringify(product)}'>
                    <svg class="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z"></path>
                    </svg>
                </button>

                <a href="?name=${encodedName}" class="block group">
                    <div class="overflow-hidden rounded-xl mb-3">
                        <img 
                            src="${productImage}" 
                            alt="${productName}" 
                            class="w-full h-44 object-cover group-hover:scale-105 transition-transform"
                            onerror="this.src='/placeholder.svg?height=200&width=200'"
                        />
                    </div>

                    <p class="text-[11px] text-gray-500 mb-1">25–30 min</p>

                    <div class="flex items-center text-yellow-500 text-sm mb-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="w-4 h-4 mr-1">
                            <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.782 1.4 8.171L12 18.896l-7.334 3.868 1.4-8.171L.132 9.211l8.2-1.193z"/>
                        </svg>
                        <span class="font-semibold">${(product.rating || 4.5).toFixed(1)}</span>
                        <span class="text-gray-600 text-xs ml-1">| ${product.review_count || 120} Rating</span>
                    </div>

                    <h2 class="text-sm font-semibold text-gray-800 mb-1 leading-snug line-clamp-2">${productName}</h2>

                    <p class="text-md font-bold text-gray-900">Rp ${formatPrice(productPrice)}</p>
                </a>
            `

      container.appendChild(productDiv)
    })

    // Setup cart buttons for recommendations
    const cartButtons = container.querySelectorAll(".cart-btn")
    cartButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault()
        e.stopPropagation()

        const productData = JSON.parse(button.getAttribute("data-product"))
        addToCart(productData, 1)
      })
    })
  } catch (error) {
    console.error("Gagal memuat rekomendasi produk:", error)
  }
}

// ========================================
// EVENT LISTENERS SETUP
// ========================================
function setupEventListeners() {
  // Tab navigation
  document.getElementById("tab-deskripsi").addEventListener("click", () => {
    document.getElementById("deskripsi").classList.remove("hidden")
    document.getElementById("komposisi").classList.add("hidden")
    document.getElementById("tab-deskripsi").classList.add("text-blue-600", "border-b-2", "border-blue-600")
    document.getElementById("tab-komposisi").classList.remove("text-blue-600", "border-b-2", "border-blue-600")
    document.getElementById("tab-komposisi").classList.add("text-gray-500")
  })

  document.getElementById("tab-komposisi").addEventListener("click", () => {
    document.getElementById("komposisi").classList.remove("hidden")
    document.getElementById("deskripsi").classList.add("hidden")
    document.getElementById("tab-komposisi").classList.add("text-blue-600", "border-b-2", "border-blue-600")
    document.getElementById("tab-deskripsi").classList.remove("text-blue-600", "border-b-2", "border-blue-600")
    document.getElementById("tab-deskripsi").classList.add("text-gray-500")
  })
}

// ========================================
// USER PROFILE MANAGEMENT
// ========================================
function loadUserProfileInOtherPage() {
  let profileData = null
  try {
    const savedProfile = localStorage.getItem("userProfile")
    if (savedProfile) {
      profileData = JSON.parse(savedProfile)
    }
  } catch (error) {
    console.error("Error loading profile:", error)
  }

  if (!profileData) {
    profileData = {
      firstName: "User",
      lastName: "",
      email: "user@example.com",
      profileImage: "/placeholder.svg?height=40&width=40",
    }
  }
  updateUserDisplay(profileData)
}

function updateUserDisplay(profileData) {
  const profileImgElement = document.getElementById("navProfileImage")
  if (profileImgElement && profileData.profileImage) {
    profileImgElement.src = profileData.profileImage
  }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================
function formatPrice(price) {
  return new Intl.NumberFormat("id-ID").format(price)
}

function showError(message) {
  const container = document.getElementById("product-container")
  container.innerHTML = `
        <div class="text-center py-8">
            <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            </div>
            <p class="text-sm text-gray-600 mb-2">${message}</p>
            <button onclick="fetchProductFromParams()" class="px-4 py-2 bg-custom-green text-white rounded-lg text-sm hover:bg-green-600">
                Coba Lagi
            </button>
        </div>
    `
}

function toggleCart() {
  console.log("Cart toggled - implement cart page navigation")
}

// ========================================
// GLOBAL FUNCTION EXPORTS
// ========================================
window.fetchProductFromParams = fetchProductFromParams
window.toggleCart = toggleCart
