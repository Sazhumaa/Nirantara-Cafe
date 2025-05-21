// Aktifkan navigasi
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(nav => {
      nav.classList.remove('active');
    });
    item.classList.add('active');
  });
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

// Function to display a single product in card format
function displayProduct(product) {
    const container = document.getElementById('product-container');
    container.innerHTML = ''; // Clear previous content

    const productCard = `
        <section class="bg-white mx-4 md:mx-10 p-6 rounded-xl shadow-lg mt-5">
            <div class="grid md:grid-cols-3 gap-6">
                <div class="flex justify-center">
                    <img src="${product.gambar_produk}" alt="${product.nama_produk}" class="w-full max-w-xs h-auto rounded-xl object-cover p-10 mb-10" />
                </div>
                <div>
                    <h2 class="text-2xl font-bold mb-2">${product.nama_produk}</h2>
                    <p class="text-sm mb-2">Bahan: ${product.kategori_produk}<br>
                    Komposisi: ${product.lama_pembuatan}</p>

                    <div class="flex space-x-1 my-2">
                        <span class="text-yellow-400 text-xl">★★★★★</span>
                    </div>

                    <p class="text-yellow-600 text-2xl font-bold">Rp ${product.harga_produk}</p>
                    <p class="text-sm text-gray-500">Lama Pembuatan: ${product.lama_pembuatan}</p>

                    <div class="flex items-center mt-4 space-x-2">
                        <span class="font-semibold">Kuantitas</span>
                        <div class="flex items-center border rounded px-2 py-1 space-x-2">
                            <button class="text-xl">-</button>
                            <span>1</span>
                            <button class="text-xl">+</button>
                        </div> 
                      </div>

                        <div class=" w-52 bg-green-500 rounded-2xl p-3 mt-7 text-center hover:bg-green-400">
                          <button class=" text-center text-white text-2xl font-bold"> Beli sekarang </button>
                        </div>

                </div>
            </div>
        </section>
    `;
    container.innerHTML = productCard; // Append the product card to the container
}

// Call the fetchAllProducts function to load products on page load
fetchAllProducts();
