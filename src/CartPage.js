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
    itemCard.className = 'flex items-center gap-4 bg-white p-4 rounded shadow mb-4';

    itemCard.innerHTML = `
      <img src="${item.gambar_produk}" alt="${item.nama_produk}" class="w-20 h-20 object-cover rounded">
      <div class="flex-1">
        <h4 class="font-semibold text-lg">${item.nama_produk}</h4>
        <p class="text-sm text-gray-500">Rp ${Number(item.harga_produk).toLocaleString('id-ID')}</p>
        <p class="text-xs text-gray-400">${item.lama_pembuatan || '7-8 Menit'}</p>
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
