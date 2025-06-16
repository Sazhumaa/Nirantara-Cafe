// ========================================
// GLOBAL VARIABLES AND CONFIGURATION
// ========================================
let map
let currentMarker
let orderData = null
let selectedPaymentMethod = null

// Jakarta Barat areas
const jakartaBaratAreas = {
  "kebon-jeruk": { name: "Kebon Jeruk", lat: -6.1944, lng: 106.7833, address: "Kebon Jeruk, Jakarta Barat" },
  grogol: { name: "Grogol Petamburan", lat: -6.1667, lng: 106.7833, address: "Grogol Petamburan, Jakarta Barat" },
  "taman-sari": { name: "Taman Sari", lat: -6.1333, lng: 106.8167, address: "Taman Sari, Jakarta Barat" },
  cengkareng: { name: "Cengkareng", lat: -6.1333, lng: 106.7333, address: "Cengkareng, Jakarta Barat" },
}

// ========================================
// INITIALIZATION SYSTEM
// ========================================
document.addEventListener("DOMContentLoaded", () => {
  initMap()
  loadOrderData()
  setupEventListeners()
})

// ========================================
// ORDER DATA LOADING SYSTEM
// ========================================
function loadOrderData() {
  try {
    const storedOrder = localStorage.getItem("checkoutOrder")
    if (storedOrder) {
      orderData = JSON.parse(storedOrder)

      // Check if it's multiple items from cart or single item from buying page
      if (orderData.isMultipleItems) {
        displayMultipleOrderDetails()
      } else {
        displayOrderDetails()
      }

      displayPaymentBreakdown()
    } else {
      showOrderError()
    }
  } catch (error) {
    console.error("Error loading order data:", error)
    showOrderError()
  }
}

// ========================================
// ORDER DISPLAY SYSTEM
// ========================================
function displayOrderDetails() {
  if (!orderData) return

  const container = document.getElementById("order-product-card")
  const product = orderData.product

  container.innerHTML = `
        <div class="flex gap-4">
            <!-- Product Image -->
            <div class="w-20 h-20 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <img src="${product.gambar}" alt="${product.nama}" 
                     class="w-16 h-16 object-cover rounded-lg"
                     onerror="this.src='/placeholder.svg?height=64&width=64'">
            </div>
            
            <!-- Product Info -->
            <div class="flex-1">
                <h3 class="font-semibold text-base text-gray-900">${product.nama}</h3>
                <p class="text-sm text-gray-500">${product.deskripsi || "Deskripsi produk"}</p>
                <p class="text-sm text-gray-500">Lama pembuatan: ${product.lama_pembuatan}</p>
                <p class="font-semibold text-base mt-1 text-gray-900">Rp ${formatPrice(product.harga)}</p>
            </div>
            
            <!-- Quantity Controls -->
            <div class="flex items-center gap-3">
                <button onclick="updateQuantity(-1)" class="w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50 transition-colors">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </button>
                <span id="quantity-display" class="text-base font-medium w-8 text-center">${orderData.quantity}</span>
                <button onclick="updateQuantity(1)" class="w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50 transition-colors">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </button>
            </div>
        </div>
    `
}

function displayMultipleOrderDetails() {
  if (!orderData || !orderData.items) return

  const container = document.getElementById("order-product-card")

  container.innerHTML = `
    <div class="space-y-4">
      <h3 class="font-semibold text-lg text-gray-900 mb-4">Pesanan Anda (${orderData.items.length} item)</h3>
      ${orderData.items
        .map(
          (item, index) => `
        <div class="flex gap-4 p-4 bg-gray-50 rounded-lg">
          <!-- Product Image -->
          <div class="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <img src="${item.gambar}" alt="${item.nama}" 
                 class="w-14 h-14 object-cover rounded-lg"
                 onerror="this.src='/placeholder.svg?height=56&width=56'">
          </div>
          
          <!-- Product Info -->
          <div class="flex-1">
            <h4 class="font-semibold text-sm text-gray-900">${item.nama}</h4>
            <p class="text-xs text-gray-500">${item.deskripsi}</p>
            <p class="text-xs text-gray-500">Lama pembuatan: ${item.lama_pembuatan}</p>
            <div class="flex justify-between items-center mt-2">
              <p class="font-semibold text-sm text-gray-900">Rp ${formatPrice(item.harga)}</p>
              <span class="text-sm text-gray-600">Qty: ${item.quantity}</span>
            </div>
          </div>
        </div>
      `,
        )
        .join("")}
    </div>
  `
}

// ========================================
// PAYMENT BREAKDOWN SYSTEM
// ========================================
function displayPaymentBreakdown() {
  if (!orderData) return

  const container = document.getElementById("payment-breakdown")

  if (orderData.isMultipleItems) {
    // Multiple items breakdown
    container.innerHTML = `
      <div class="flex justify-between">
          <span class="text-gray-600">Subtotal (${orderData.totalQuantity} item)</span>
          <span class="text-gray-900">Rp ${formatPrice(orderData.itemTotal)}</span>
      </div>
      <div class="flex justify-between">
          <span class="text-gray-600">Biaya Pengiriman</span>
          <span class="text-gray-900">Rp ${formatPrice(orderData.deliveryFee)}</span>
      </div>
      <div class="flex justify-between">
          <span class="text-gray-600">Biaya Pembayaran</span>
          <span class="text-gray-900">Rp ${formatPrice(orderData.paymentFee)}</span>
      </div>
      <div class="flex justify-between border-t border-gray-200 pt-3">
          <span class="text-gray-600">Total Pembayaran</span>
          <span class="text-gray-900 font-semibold">Rp ${formatPrice(orderData.totalAmount)}</span>
      </div>
    `
  } else {
    // Single item breakdown (existing logic)
    container.innerHTML = `
      <div class="flex justify-between">
          <span class="text-gray-600">Harga (${orderData.quantity}x)</span>
          <span class="text-gray-900">Rp ${formatPrice(orderData.itemTotal)}</span>
      </div>
      <div class="flex justify-between">
          <span class="text-gray-600">Biaya Pengiriman</span>
          <span class="text-gray-900">Rp ${formatPrice(orderData.deliveryFee)}</span>
      </div>
      <div class="flex justify-between">
          <span class="text-gray-600">Biaya Pembayaran</span>
          <span class="text-gray-900">Rp ${formatPrice(orderData.paymentFee)}</span>
      </div>
      <div class="flex justify-between border-t border-gray-200 pt-3">
          <span class="text-gray-600">Total Pembayaran</span>
          <span class="text-gray-900 font-semibold">Rp ${formatPrice(orderData.totalAmount)}</span>
      </div>
    `
  }

  // Update final total
  document.getElementById("final-total").textContent = `Rp ${formatPrice(orderData.totalAmount)}`
}

// ========================================
// QUANTITY UPDATE SYSTEM
// ========================================
function updateQuantity(change) {
  if (!orderData) return

  const newQuantity = orderData.quantity + change
  if (newQuantity < 1) return

  // Update order data
  orderData.quantity = newQuantity
  orderData.itemTotal = orderData.product.harga * newQuantity
  orderData.totalAmount = orderData.itemTotal + orderData.deliveryFee + orderData.paymentFee

  // Update localStorage
  localStorage.setItem("checkoutOrder", JSON.stringify(orderData))

  // Update display
  document.getElementById("quantity-display").textContent = newQuantity
  displayPaymentBreakdown()
}

// ========================================
// PAYMENT METHOD SELECTION SYSTEM
// ========================================
function setupEventListeners() {
  // Payment method selection
  document.querySelectorAll(".payment-method").forEach((method) => {
    method.addEventListener("click", function () {
      // Remove previous selections
      document.querySelectorAll(".payment-method").forEach((m) => {
        m.classList.remove("ring-2", "ring-custom-green", "bg-green-50")
      })

      // Add selection to current method
      this.classList.add("ring-2", "ring-custom-green", "bg-green-50")

      // Check the radio button
      const radio = this.querySelector('input[type="radio"]')
      if (radio) {
        radio.checked = true
        selectedPaymentMethod = radio.value
      }
    })
  })

  // Process payment button
  document.getElementById("process-payment").addEventListener("click", processPayment)

  // Address search enter key
  const addressSearch = document.getElementById("address-search")
  if (addressSearch) {
    addressSearch.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        searchAddress()
      }
    })
  }
}

// ========================================
// PAYMENT PROCESSING SYSTEM
// ========================================
async function processPayment() {
  if (!orderData) {
    showValidationError("Data pesanan tidak ditemukan")
    return
  }

  if (!selectedPaymentMethod) {
    showValidationError("Silakan pilih metode pembayaran")
    return
  }

  try {
    // Get delivery address
    const deliveryAddress = document.getElementById("current-address").textContent

    // Create final order object
    const finalOrder = {
      ...orderData,
      paymentMethod: selectedPaymentMethod,
      deliveryAddress: deliveryAddress,
      orderStatus: "confirmed",
      orderTime: new Date().toISOString(),
    }

    // Show loading state
    const button = document.getElementById("process-payment")
    const originalText = button.textContent
    button.textContent = "Memproses..."
    button.disabled = true

    // Simulate API call with proper delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Here you would typically send the order to your backend
    console.log("Final Order:", finalOrder)

    // Reset button first
    button.textContent = originalText
    button.disabled = false

    // Show success modal
    showOrderSuccessModal(finalOrder)

    // Clear order data from localStorage
    localStorage.removeItem("checkoutOrder")

    // Clear cart items if this was a cart checkout
    if (orderData.isMultipleItems) {
      // Remove processed items from cart
      const cartItems = JSON.parse(localStorage.getItem("cartItems")) || []
      const remainingItems = cartItems.filter((item) => item.selected === false)
      localStorage.setItem("cartItems", JSON.stringify(remainingItems))

      // Update cart count
      const newCartCount = remainingItems.reduce((sum, item) => sum + (item.jumlah || 1), 0)
      localStorage.setItem("cartCount", newCartCount)
    }
  } catch (error) {
    console.error("Error processing payment:", error)

    // Reset button
    const button = document.getElementById("process-payment")
    button.textContent = "Beli Sekarang"
    button.disabled = false

    showValidationError("Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi.")
  }
}

// ========================================
// ORDER SUCCESS MODAL SYSTEM
// ========================================
function showOrderSuccessModal(finalOrder) {
  // Populate order details
  const orderDetails = document.getElementById("orderDetails")

  if (finalOrder.isMultipleItems) {
    // Multiple items success modal
    orderDetails.innerHTML = `
      <div class="text-left space-y-2">
          <p><strong>Jumlah Item:</strong> ${finalOrder.items.length} produk</p>
          <p><strong>Total Quantity:</strong> ${finalOrder.totalQuantity}</p>
          <p><strong>Total:</strong> Rp ${formatPrice(finalOrder.totalAmount)}</p>
          <p><strong>Pembayaran:</strong> ${finalOrder.paymentMethod.toUpperCase()}</p>
          <p><strong>Alamat:</strong> ${finalOrder.deliveryAddress}</p>
          <p><strong>Estimasi:</strong> 25-30 menit</p>
          <div class="mt-3 p-2 bg-gray-50 rounded">
            <p class="text-sm font-medium">Item yang dipesan:</p>
            ${finalOrder.items
              .map(
                (item) => `
              <p class="text-xs text-gray-600">• ${item.nama} (${item.quantity}x)</p>
            `,
              )
              .join("")}
          </div>
      </div>
    `
  } else {
    // Single item success modal (existing logic)
    orderDetails.innerHTML = `
      <div class="text-left space-y-2">
          <p><strong>Produk:</strong> ${finalOrder.product.nama}</p>
          <p><strong>Jumlah:</strong> ${finalOrder.quantity}</p>
          <p><strong>Total:</strong> Rp ${formatPrice(finalOrder.totalAmount)}</p>
          <p><strong>Pembayaran:</strong> ${finalOrder.paymentMethod.toUpperCase()}</p>
          <p><strong>Alamat:</strong> ${finalOrder.deliveryAddress}</p>
          <p><strong>Estimasi:</strong> 25-30 menit</p>
      </div>
    `
  }

  // Show the modal by removing hidden class
  const modal = document.getElementById("orderSuccessModal")
  modal.classList.remove("hidden")
}

function closeOrderModal() {
  const modal = document.getElementById("orderSuccessModal")
  modal.classList.add("hidden")

  // Redirect to home page or order tracking page after short delay
  setTimeout(() => {
    window.location.href = "Home Page.html"
  }, 500)
}

// ========================================
// ERROR HANDLING SYSTEM
// ========================================
function showOrderError() {
  const container = document.getElementById("order-product-card")
  container.innerHTML = `
        <div class="text-center py-8">
            <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            </div>
            <p class="text-sm text-gray-600 mb-2">Data pesanan tidak ditemukan</p>
            <p class="text-xs text-gray-500 mb-3">Silakan kembali ke halaman produk</p>
            <button onclick="window.location.href='Buying Page.html'" class="px-4 py-2 bg-custom-green text-white rounded-lg text-sm hover:bg-green-600">
                Kembali ke Produk
            </button>
        </div>
    `
}

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
// MAP FUNCTIONALITY
// ========================================
function initMap() {
  const jakartaBaratCenter = [-6.1667, 106.7833]
  let L = window.L
  if (typeof leaflet !== "undefined") {
    L = leaflet
  } else {
    L = window.L
  }
  map = L.map("map").setView(jakartaBaratCenter, 12)

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map)

  addJakartaBaratRestaurants()
  setDeliveryLocation(-6.1944, 106.7833, "Jl. Raya Cikarang Cibarusah, Cikarang Selatan", "Kebon Jeruk, Jakarta Barat")

  setTimeout(() => {
    document.getElementById("loading").style.display = "none"
  }, 1000)
}

function addJakartaBaratRestaurants() {
  const restaurants = [
    { name: "Starbucks Kebon Jeruk", lat: -6.1944, lng: 106.7833, type: "cafe" },
    { name: "KFC Kebon Jeruk", lat: -6.195, lng: 106.784, type: "fastfood" },
    { name: "Pizza Hut Kebon Jeruk", lat: -6.1938, lng: 106.7825, type: "restaurant" },
    { name: "McDonald's Grogol", lat: -6.1667, lng: 106.7833, type: "fastfood" },
    { name: "Cafe Tujuh Belas", lat: -6.167, lng: 106.784, type: "cafe" },
  ]

  const L = window.L

  restaurants.forEach((restaurant) => {
    const color = restaurant.type === "cafe" ? "#8B5CF6" : restaurant.type === "restaurant" ? "#EF4444" : "#F59E0B"

    L.marker([restaurant.lat, restaurant.lng], {
      icon: L.divIcon({
        className: "restaurant-marker",
        html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      }),
    })
      .addTo(map)
      .bindPopup(restaurant.name)
  })
}

function goToArea(areaKey) {
  const area = jakartaBaratAreas[areaKey]
  if (area) {
    map.setView([area.lat, area.lng], 15)
    setDeliveryLocation(area.lat, area.lng, area.address, area.name)
  }
}

function setDeliveryLocation(lat, lng, address, area) {
  if (currentMarker) {
    map.removeLayer(currentMarker)
  }

  currentMarker = L.marker([lat, lng], {
    icon: L.divIcon({
      className: "delivery-marker",
      html: '<div style="background-color: #10B981; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    }),
  }).addTo(map)

  document.getElementById("current-address").textContent = address
  document.getElementById("coordinates").textContent = area
}

async function searchAddress() {
  const query = document.getElementById("address-search").value
  if (!query) return

  try {
    const searchQuery = `${query}, Jakarta Barat, Indonesia`
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`,
    )
    const data = await response.json()

    if (data && data.length > 0) {
      const result = data[0]
      const lat = Number.parseFloat(result.lat)
      const lng = Number.parseFloat(result.lon)

      map.setView([lat, lng], 16)
      setDeliveryLocation(lat, lng, result.display_name, "Jakarta Barat")
    } else {
      alert("Alamat tidak ditemukan di Jakarta Barat.")
    }
  } catch (error) {
    console.error("Error searching address:", error)
  }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================
function formatPrice(price) {
  return new Intl.NumberFormat("id-ID").format(price)
}

// ========================================
// GLOBAL FUNCTION EXPORTS
// ========================================
window.updateQuantity = updateQuantity
window.goToArea = goToArea
window.searchAddress = searchAddress
window.closeOrderModal = closeOrderModal
