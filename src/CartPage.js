// logika cartpage bang
function tampilkanDetailProduk(produk) {
    document.getElementById('produk-gambar').src = produk.gambar_produk;
    document.getElementById('produk-nama').textContent = produk.nama_produk;
    document.getElementById('produk-deskripsi').textContent = produk.deskripsi;
    document.getElementById('produk-harga').textContent = `Rp ${Number(produk.harga_produk).toLocaleString('id-ID')}`;
    document.getElementById('produk-lama').textContent = produk.lama_pembuatan || '7-8 Menit';
}



document.addEventListener('DOMContentLoaded', () => {
  const cartCount = parseInt(localStorage.getItem('cartCount')) || 0;
  const cartCountElement = document.getElementById('cart-count');
  if (cartCountElement) {
    cartCountElement.textContent = cartCount;
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const cartContainer = document.getElementById('cart-container');
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

  if (cartItems.length === 0) {
    cartContainer.innerHTML = '<p class="text-gray-500">Keranjang kamu kosong.</p>';
    return;
  }

  cartItems.forEach(item => {
    const itemCard = document.createElement('div');
    itemCard.className = '';

    itemCard.innerHTML = `
    
<div class="flex justify-center items-center py-6">
  <div class="bg-white rounded-2xl shadow-md flex flex-col md:flex-row w-full max-w-3xl overflow-hidden p-4 md:p-6 gap-6">
    
    <!-- Kiri: Detail Produk -->
    <div class="flex-1 space-y-4">
      <div class="flex items-center gap-4">
        <div class="w-6 h-6 rounded-full border-2 border-green-600 flex items-center justify-center bg-green-50">
          <svg class="w-3.5 h-3.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8.5 8.5a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.086l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-800">${item.nama_produk}</h3>
      </div>
      <div class="text-sm text-gray-600 space-y-1">
        <p><span class="font-medium">Estimasi Pembuatan: </span> 5 menit</p>
        <p><span class="font-medium">Estimasi Pengiriman:</span> 7-12 menit</p>
      </div>
      <p class="text-lg font-bold text-green-600">Rp ${Number(item.harga_produk).toLocaleString('id-ID')}</p>
    </div>

    <!-- Kanan: Gambar & Counter -->
    <div class="flex flex-col items-center justify-center gap-4">
      <img src="${item.gambar_produk}" alt="${item.nama_produk}" class="rounded-xl w-28 h-28 object-cover shadow-sm border border-gray-100">
      <div class="flex items-center gap-3">
        <button class="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 text-red-600 text-lg font-bold hover:bg-red-200 decrement-btn">−</button>
        <span class="text-base font-semibold quantity">1</span>
        <button class="w-8 h-8 flex items-center justify-center rounded-full bg-green-100 text-green-600 text-lg font-bold hover:bg-green-200 increment-btn">+</button>
      </div>
    </div>
    
  </div>
</div>

    `;

    cartContainer.appendChild(itemCard);
  });
});



async function updateCartSummary() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

  try {
    const response = await fetch('http://localhost:8000/produk');
    const allProducts = await response.json(); // anggap ini array of produk

    let totalHarga = 0;
    let totalItem = 0;

    cartItems.forEach(cartItem => {
      const produk = allProducts.find(p => p.id === cartItem.id_produk); // sesuaikan key-nya

      if (produk) {
        const harga = Number(produk.harga);
        const jumlah = Number(cartItem.jumlah);

        if (!isNaN(harga) && !isNaN(jumlah)) {
          totalHarga += harga * jumlah;
          totalItem += jumlah;
        }
      }
    });

    document.getElementById('total-harga').textContent = `Rp ${totalHarga.toLocaleString('id-ID')}`;
    document.getElementById('checkout-count').textContent = totalItem;
  } catch (error) {
    console.error('Gagal mengambil produk dari API:', error);
  }
}
