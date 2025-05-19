// Aktifkan navigasi
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(nav => {
      nav.classList.remove('active');
    });
    item.classList.add('active');
  });
});

const url_api = 'http://localhost:8000/produk';

// Ambil ID produk dari URL
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

// Ambil detail produk berdasarkan ID
async function fetchProdukById(id) {
  try {
    const response = await fetch(`${url_api}/${id}`);
    if (!response.ok) throw new Error('Produk tidak ditemukan');
    const produk = await response.json();
    tampilkanDetailProduk(produk);
  } catch (error) {
    console.error(error);
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
  document.getElementById('produk-lama').textContent = produk.lama_pembuatan || '7–8 Menit';
}

// Ambil 6 rekomendasi produk
async function fetchRekomendasiProduk() {
  try {
    const response = await fetch(url_api);
    if (!response.ok) {
      throw new Error('Gagal fetch data');
    }

    const products = await response.json();
    const rekomendasi = products.filter(p => p._id !== id).slice(0, 6); // Hindari produk yang sedang dibuka
    tampilkanRekomendasiProduk(rekomendasi);
  } catch (error) {
    console.error('Error saat fetch produk:', error);
  }
}

function tampilkanRekomendasiProduk(products) {
  const container = document.getElementById('rekomendasi-container');
  container.innerHTML = ''; // Bersihkan konten sebelumnya

  products.forEach(product => {
    const card = document.createElement('a');
    card.href = `buying.html?id=${product._id}`;
    card.className = 'block bg-white p-4 rounded-2xl shadow hover:shadow-lg mb-10 transition';

    card.innerHTML = `
      <img src="${product.gambar_produk}" alt="${product.nama_produk}" class="rounded-lg mb-4 h-40 w-full object-cover">
      <div class="text-gray-500 text-sm mb-1">21-25 min</div>
      <div class="flex items-center gap-1 text-yellow-400 text-sm mb-2">⭐ ${(product.rating || 4.5).toFixed(1)} | ${product.review_count || '1k'} Rating</div>
      <h4 class="text-lg font-bold mb-1">${product.nama_produk}</h4>
      <p class="text-gray-700">Rp ${Number(product.harga_produk).toLocaleString('id-ID')}</p>
    `;

    container.appendChild(card);
  });
}

// Jalankan saat halaman selesai dimuat
window.addEventListener('DOMContentLoaded', () => {
  if (id) {
    fetchProdukById(id);
  }
  fetchRekomendasiProduk();
});
