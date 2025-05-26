const url_api = 'http://localhost:8000/produk';

async function fetchProducts() {
  try {
    const response = await fetch(url_api);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const products = await response.json();
    displayProducts(products);
  } catch (error) {
    console.error('Ada masalah ama fetchnya:', error);
    document.getElementById('error-message').classList.remove('hidden');
  }
}

window.onload = fetchProducts;

// Function to display products in card format
function displayProducts(products) {
  const productList = document.getElementById('coffee-container');
  productList.innerHTML = '';

  const limitedProducts = products.slice(0, 8);

  limitedProducts.forEach((product, index) => {
    const productDiv = document.createElement('div');
    productDiv.className = 'bg-white rounded-xl shadow-md p-4 flex flex-col hover:shadow-lg transition-shadow duration-200 relative';

    const productId = `cart-icon-${index}`;
    const encodedName = encodeURIComponent(product.nama_produk);

    productDiv.innerHTML = `
      <!-- Tombol keranjang berada di luar <a> -->
      <button class="absolute top-2 right-2 bg-green-200 rounded-2xl p-2 z-10" id="${productId}" aria-label="Add to cart">
        <img src="image/shopping-cart.png" class="w-5 h-5 pointer-events-none" />
      </button>

      <!-- Link ke Buying Page -->
      <a href="Buying Page.html?name=${encodedName}" class="block">
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

    productList.appendChild(productDiv);

    // Event listener untuk tombol keranjang
    const cartBtn = document.getElementById(productId);
    if (cartBtn) {
      cartBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Hindari bubbling ke <a>
        e.preventDefault();  // Hindari klik default
        tambahKeCart(product);
      });
    }
  });
}


function tambahKeCart(product) {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

  // Cek apakah produk sudah ada di cart
  const existingIndex = cartItems.findIndex(item => item.nama_produk === product.nama_produk);

  if (existingIndex > -1) {
    cartItems[existingIndex].jumlah += 1;
  } else {
    cartItems.push({
      nama_produk: product.nama_produk,
      harga_produk: product.harga_produk,
      gambar_produk: product.gambar_produk,
      jumlah: 1
    });
  }

  localStorage.setItem('cartItems', JSON.stringify(cartItems));

  const newCount = cartItems.reduce((sum, item) => sum + item.jumlah, 0);
  updateCartCount(newCount);
  console.log(`Produk ${product.nama_produk} ditambahkan ke keranjang.`);
}

function updateCartCount(newCount) {
  localStorage.setItem('cartCount', newCount);
  const cartCountElement = document.getElementById('cart-count');
  if (cartCountElement) {
    cartCountElement.textContent = newCount;
  }
}

function getCartCount() {
  return parseInt(localStorage.getItem('cartCount')) || 0;
}

// Update cart count saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount(getCartCount());
});

// Search 
document.getElementById('search-input').addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    const query = e.target.value.trim();
    if (query !== '') {
      window.location.href = `SearchPage.html?query=${encodeURIComponent(query)}`;
    }
  }
});
