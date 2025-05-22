//logika cartpage bang
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
