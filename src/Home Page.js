
//   const container = document.getElementById('coffee-container');
//   const errorMessage = document.getElementById('error-message');

//   // fetch('https://fakestoreapi.com/products')
//   //   .then(response => {
//   //     if (!response.ok) throw new Error('Network response was not ok');
//   //     return response.json();
//   //   })
//   //   .then(data => {
//   //     data.forEach(item => {
//   //       const card = document.createElement('div');
//   //       card.className = 'bg-white p-4 rounded-2xl shadow hover:shadow-lg';

//   //       card.innerHTML = `
//   //         <img src="${item.image || 'https://via.placeholder.com/300x160?text=No+Image'}"
//   //              alt="${item.title}" class="rounded-lg mb-4 h-40 w-full object-cover">
//   //         <div class="text-gray-500 text-sm mb-1">${item.time || '20-25 min'}</div>
//   //         <div class="flex items-center gap-1 text-yellow-400 text-sm mb-2">
//   //           ⭐ ${item.rating.toFixed(1)} | ${item.ratingCount} Rating
//   //         </div>
//   //         <h4 class="text-lg font-bold mb-1">${item.title}</h4>
//   //         <p class="text-gray-700">Rp ${item.price.toLocaleString('id-ID')}</p>
//   //       `;

//   //       container.appendChild(card);
//   //     });
//   //   })
//   //   .catch(error => {
//   //     console.error('Fetch error:', error);
//   //     errorMessage.classList.remove('hidden');
//   //   });

//   // URL API
// const url_api = 'http://localhost:8000/produk'; // Ganti dengan URL API Anda

// // Fungsi untuk fetch data produk
// async function fetchProducts() {
//     try {
//         const response = await fetch(url_api);
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//         const products = await response.json();
//         displayProducts(products);
//     } catch (error) {
//         console.error('Ada masalah dengan fetch:', error);
//     }
// }

// // Fungsi untuk menampilkan produk di halaman
// function displayProducts(products) {
//     const productList = document.getElementById('product-list');
//     productList.innerHTML = ''; // Kosongkan daftar produk sebelumnya

//     products.forEach(product => {
//         const productDiv = document.createElement('div');
//         productDiv.className = 'product';
//         productDiv.innerHTML = `
//             <h2>${product.nama_produk}</h2>
//             <p>Kategori: ${product.kategori_produk}</p>
//             <p>Harga: Rp ${product.harga_produk}</p>
//             <img src="${product.gambar_produk}" alt="${product.nama_produk}" style="width:100px;height:auto;">
//         `;
//         productList.appendChild(productDiv);
//     });
// }

// // Panggil fungsi fetchProducts saat halaman dimuat
// window.onload = fetchProducts;



const url_api = 'http://localhost:8000/produk'; // Ganti dengan URL API Anda

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

function displayProducts(products) {
    const productList = document.getElementById('coffee-container');
    productList.innerHTML = ''; // Kosongkan daftar produk sebelumnya

    // Ambil hanya 6 produk pertama
    const limitedProducts = products.slice(0, 8);

    limitedProducts.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'bg-white rounded-xl shadow-md p-4 flex flex-col hover:shadow-lg transition-shadow duration-200';

        // Tambahkan link ke buying.html?id=xxx
        productDiv.innerHTML = `
            <a href="Buying Page.html?id=${product._id}" class="block">
                <img src="${product.gambar_produk}" alt="${product.nama_produk}" class="w-full h-40 object-contain mb-4 rounded-md">
                
                <p class="text-xs text-gray-500 mb-1">21–25 min</p>

                <div class="flex items-center text-yellow-500 text-sm mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="w-4 h-4 mr-1">
                        <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.782 1.4 8.171L12 18.896l-7.334 3.868 1.4-8.171L.132 9.211l8.2-1.193z"/>
                    </svg>
                    <span class="font-semibold">${(product.rating || 4.2).toFixed(1)}</span>
                    <span class="text-gray-600 text-xs ml-1">| ${product.review_count || 120} Rating</span>
                </div>

                <h2 class="text-sm font-semibold text-gray-800 truncate mb-1">${product.nama_produk}</h2>
                <p class="text-md font-bold text-gray-900">Rp ${Number(product.harga_produk).toLocaleString('id-ID')}</p>
            </a>
        `;

        productList.appendChild(productDiv);
    });
}


// ================================
// BAGIAN BUYING PAGE DETAIL PRODUK
// ================================

// Ambil ID dari URL
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

async function fetchProdukById(id) {
    try {
        const response = await fetch(`${url_api}/${id}`);
        if (!response.ok) throw new Error('Produk tidak ditemukan');

        const produk = await response.json();
        tampilkanDetailProduk(produk);
    } catch (err) {
        console.error(err);
        const container = document.getElementById('produk-container');
        if (container) {
            container.innerHTML = '<p class="text-red-500">Produk tidak ditemukan.</p>';
        }
    }
}

function tampilkanDetailProduk(produk) {
    document.getElementById('produk-gambar').src = produk.gambar_produk;
    document.getElementById('produk-nama').textContent = produk.nama_produk;
    document.getElementById('produk-deskripsi').textContent = produk.deskripsi;
    document.getElementById('produk-harga').textContent = `Rp ${Number(produk.harga_produk).toLocaleString('id-ID')}`;
    document.getElementById('produk-lama').textContent = produk.lama_pembuatan || '7-8 Menit';
}

// Panggil fungsi saat halaman dimuat (khusus BuyingPage)
if (id) {
    fetchProdukById(id);
}


