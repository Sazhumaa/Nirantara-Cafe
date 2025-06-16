// ========================================
// SISTEM INISIALISASI HALAMAN CART
// ========================================
// Fungsi: Inisialisasi halaman cart saat DOM siap
// Fitur: Load data cart, render item, dan update summary
document.addEventListener("DOMContentLoaded", () => {
  updateCartCountDisplay() // Update counter di icon cart
  renderCartItems() // Render semua item di keranjang
  updateCartSummary() // Update total harga dan jumlah item
})

// ========================================
// SISTEM DISPLAY COUNTER CART
// ========================================
// Fungsi: Menampilkan jumlah total item di icon cart
// Fitur: Menghitung total quantity dari semua item
function updateCartCountDisplay() {
  // Ambil data cart dari localStorage
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || []

  // Hitung total quantity dari semua item
  const totalCount = cartItems.reduce((total, item) => total + (item.jumlah || 1), 0)

  // Update tampilan counter di UI
  const cartCountEl = document.getElementById("cart-count")
  if (cartCountEl) cartCountEl.textContent = totalCount
}

// ========================================
// SISTEM RENDER ITEM CART
// ========================================
// Fungsi: Menampilkan semua item dalam keranjang
// Fitur: Layout responsif, checkbox selection, kontrol quantity
function renderCartItems() {
  // Ambil data cart dari localStorage - gunakan struktur yang sudah ada
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || []

  // Ambil container untuk item cart
  const container = document.getElementById("cart-container")
  container.innerHTML = "" // Bersihkan container

  // Jika cart kosong, tampilkan pesan
  if (cartItems.length === 0) {
    container.innerHTML = `
      <div class="text-center py-8">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z"></path>
          </svg>
        </div>
        <p class="text-gray-500 mb-2">Keranjang belanja kosong</p>
        <p class="text-sm text-gray-400">Tambahkan produk ke keranjang untuk melanjutkan</p>
      </div>
    `
    return
  }

  // Loop untuk setiap item di keranjang
  cartItems.forEach((item, index) => {
    // Default jumlah minimal 1
    const jumlah = item.jumlah || 1

    // Status checkbox (default: checked)
    const isChecked = item.selected !== false

    // Buat elemen untuk item cart
    const itemEl = document.createElement("div")
    itemEl.className = "flex justify-center items-center py-4"

    // Generate HTML untuk item cart - gunakan field names yang benar
    itemEl.innerHTML = `
      <div class="bg-white rounded-2xl shadow-md flex flex-col md:flex-row w-full max-w-3xl overflow-hidden p-4 md:p-6 gap-6 relative">
        <div class="flex-1 space-y-3 pl-8">
          <div class="flex items-center gap-3">
            <div class="w-6 h-6 flex">
              <!-- Checkbox untuk seleksi item -->
              <input type="checkbox" class="item-checkbox absolute top-7 left-4 w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500" ${isChecked ? "checked" : ""} data-index="${index}">
            </div>
            <!-- Nama Produk -->
            <h3 class="text-lg md:text-xl font-semibold text-gray-800">${item.nama_produk || item.nama || "Produk"}</h3>
          </div>
          <!-- Informasi Tambahan -->
          <p class="text-sm text-gray-600">Estimasi Pembuatan: 5 menit</p>
          <p class="text-sm text-gray-600">Estimasi Pengiriman: 25-30 menit</p>
          <!-- Harga Produk -->
          <p class="text-lg font-bold text-green-600">Rp ${Number(item.harga_produk || item.harga || 0).toLocaleString("id-ID")}</p>
        </div>
        <div class="flex flex-col items-center justify-center gap-4">
          <!-- Gambar Produk -->
          <img src="${item.gambar_produk || item.gambar || "/placeholder.svg?height=96&width=96"}" 
               alt="${item.nama_produk || item.nama || "Produk"}" 
               class="rounded-xl w-24 h-24 object-cover border shadow-sm"
               onerror="this.src='/placeholder.svg?height=96&width=96'">
          <!-- Kontrol Quantity -->
          <div class="flex items-center gap-3">
            <button class="decrement-btn w-8 h-8 bg-red-100 hover:bg-red-200 rounded-full text-red-600 text-lg font-bold">−</button>
            <span class="quantity text-base font-semibold">${jumlah}</span>
            <button class="increment-btn w-8 h-8 bg-green-100 hover:bg-green-200 rounded-full text-green-600 text-lg font-bold">+</button>
          </div>
        </div>
      </div>
    `

    // Tambahkan item ke container
    container.appendChild(itemEl)
  })

  // Setup event listeners untuk tombol dan checkbox
  attachQuantityListeners() // Listener untuk tombol +/-
  attachCheckboxListeners() // Listener untuk checkbox
}

// ========================================
// SISTEM CHECKBOX SELECTION
// ========================================
// Fungsi: Mengelola event listener untuk checkbox item
// Fitur: Seleksi/deseleksi item untuk checkout
function attachCheckboxListeners() {
  // Ambil semua checkbox
  document.querySelectorAll(".item-checkbox").forEach((checkbox) => {
    // Tambahkan event listener untuk perubahan status
    checkbox.addEventListener("change", (e) => {
      // Ambil index item dari attribute data-index
      const index = Number.parseInt(e.target.getAttribute("data-index"))

      // Ambil data cart dari localStorage
      const cartItems = JSON.parse(localStorage.getItem("cartItems")) || []

      // Update status selected pada item
      if (cartItems[index]) {
        cartItems[index].selected = e.target.checked

        // Simpan kembali ke localStorage
        localStorage.setItem("cartItems", JSON.stringify(cartItems))

        // Update total harga dan jumlah item
        updateCartSummary()
      }
    })
  })
}

// ========================================
// SISTEM KONTROL QUANTITY
// ========================================
// Fungsi: Mengelola event listener untuk tombol quantity
// Fitur: Increment/decrement quantity item
function attachQuantityListeners() {
  // Ambil semua tombol increment dan decrement
  const incrementButtons = document.querySelectorAll(".increment-btn")
  const decrementButtons = document.querySelectorAll(".decrement-btn")

  // Tambahkan event listener untuk tombol increment
  incrementButtons.forEach((btn, index) => {
    btn.addEventListener("click", () => updateItemQuantity(index, 1)) // Tambah 1
  })

  // Tambahkan event listener untuk tombol decrement
  decrementButtons.forEach((btn, index) => {
    btn.addEventListener("click", () => updateItemQuantity(index, -1)) // Kurang 1
  })
}

// ========================================
// SISTEM UPDATE QUANTITY ITEM
// ========================================
// Fungsi: Update jumlah item di localStorage
// Fitur: Increment/decrement quantity, hapus item jika quantity 0
function updateItemQuantity(index, delta) {
  // Ambil data cart dari localStorage
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || []

  // Update quantity jika item ada
  if (cartItems[index]) {
    // Tambah/kurang quantity sesuai delta
    cartItems[index].jumlah = (cartItems[index].jumlah || 1) + delta

    // Hapus item jika quantity <= 0
    if (cartItems[index].jumlah <= 0) {
      cartItems.splice(index, 1)
    }

    // Simpan kembali ke localStorage
    localStorage.setItem("cartItems", JSON.stringify(cartItems))

    // Update UI
    updateCartCountDisplay() // Update counter di icon cart
    renderCartItems() // Re-render semua item
    updateCartSummary() // Update total harga dan jumlah
  }
}

// ========================================
// SISTEM KALKULASI CART SUMMARY
// ========================================
// Fungsi: Menghitung dan menampilkan total harga dan jumlah item
// Fitur: Hanya menghitung item yang terseleksi (checked)
function updateCartSummary() {
  // Ambil data cart dari localStorage
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || []

  // Inisialisasi total
  let totalHarga = 0
  let totalItem = 0

  // Hitung total harga dan jumlah item yang terseleksi
  cartItems.forEach((item) => {
    // Hanya hitung item yang terseleksi (checkbox checked)
    if (item.selected !== false) {
      const jumlah = item.jumlah || 1
      const harga = Number.parseFloat(item.harga_produk || item.harga || 0)

      // Tambahkan ke total
      totalHarga += harga * jumlah
      totalItem += jumlah
    }
  })

  // Update tampilan total di UI
  const totalHargaEl = document.getElementById("total-harga")
  const checkoutCountEl = document.getElementById("checkout-count")

  // Update total harga dengan format currency
  if (totalHargaEl) totalHargaEl.textContent = `Rp ${totalHarga.toLocaleString("id-ID")}`

  // Update jumlah item untuk checkout
  if (checkoutCountEl) checkoutCountEl.textContent = totalItem
}

// ========================================
// SISTEM CHECKOUT - TRANSFER TO CHECKOUT PAGE
// ========================================
// Fungsi: Transfer selected items ke checkout page
function transferCartToCheckout() {
  // Ambil data cart dari localStorage
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || []

  // Filter item yang terseleksi (checkbox checked)
  const selectedItems = cartItems.filter((item) => item.selected !== false)

  // Validasi: minimal 1 item terseleksi
  if (selectedItems.length === 0) {
    showValidationError("Pilih produk terlebih dahulu sebelum checkout.")
    return
  }

  // Prepare multiple items order data for checkout page
  const orderData = {
    items: selectedItems.map((item) => ({
      id: item.id || Date.now() + Math.random(), // Generate ID if not exists
      nama: item.nama_produk || item.nama || "Produk",
      deskripsi: item.deskripsi_produk || item.deskripsi || "Deskripsi produk",
      harga: Number.parseInt(item.harga_produk || item.harga || 0),
      gambar: item.gambar_produk || item.gambar || "/placeholder.svg?height=64&width=64",
      quantity: item.jumlah || 1,
      lama_pembuatan: "5-7 menit",
    })),
    isMultipleItems: true, // Flag to indicate multiple items
    totalQuantity: selectedItems.reduce((sum, item) => sum + (item.jumlah || 1), 0),
    itemTotal: selectedItems.reduce(
      (sum, item) => sum + Number.parseInt(item.harga_produk || item.harga || 0) * (item.jumlah || 1),
      0,
    ),
    deliveryFee: 5000,
    paymentFee: 1000,
    timestamp: new Date().toISOString(),
  }

  // Calculate total
  orderData.totalAmount = orderData.itemTotal + orderData.deliveryFee + orderData.paymentFee

  // Store order data in localStorage
  localStorage.setItem("checkoutOrder", JSON.stringify(orderData))

  // Show loading feedback
  const button = document.getElementById("checkout-btn")
  if (button) {
    const originalText = button.textContent
    button.textContent = "Memproses..."
    button.disabled = true

    // Redirect to checkout page after short delay
    setTimeout(() => {
      window.location.href = "checkout-page.html"
    }, 800)
  }
}

// ========================================
// SISTEM CHECKOUT BUTTON EVENT
// ========================================
// Event listener untuk tombol checkout
document.addEventListener("DOMContentLoaded", () => {
  const checkoutBtn = document.getElementById("checkout-btn")
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", transferCartToCheckout)
  }
})

// ========================================
// VALIDATION ERROR SYSTEM
// ========================================
function showValidationError(message) {
  // Create error notification
  const notification = document.createElement("div")
  notification.className =
    "fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-opacity"
  notification.innerHTML = `
    <div class="flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>${message}</span>
    </div>
  `

  document.body.appendChild(notification)

  // Auto remove after 4 seconds
  setTimeout(() => {
    notification.style.opacity = "0"
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification)
      }
    }, 300)
  }, 4000)
}

// ========================================
// SISTEM LOAD PROFIL USER
// ========================================
// Fungsi: Load dan tampilkan gambar profil user dari localStorage
// Fitur: Sinkronisasi gambar profil antar halaman
document.addEventListener("DOMContentLoaded", () => {
  // Cek apakah ada data profil tersimpan
  const savedProfile = localStorage.getItem("userProfile")
  if (savedProfile) {
    try {
      // Parse data profil
      const profileData = JSON.parse(savedProfile)

      // Update gambar profil di navbar jika ada
      if (profileData.profileImage) {
        const profileImgElement = document.getElementById("navProfileImage")
        if (profileImgElement) {
          profileImgElement.src = profileData.profileImage
        }
      }
    } catch (e) {
      // Handle error parsing data profil
      console.error("Gagal memuat gambar profil dari localStorage:", e)
    }
  }
})
