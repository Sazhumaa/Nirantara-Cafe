    const url_api = 'http://localhost:8000/produk';
    const params = new URLSearchParams(window.location.search);
    const query = params.get('query');

    async function fetchAndFilter() {
      try {
        const res = await fetch(url_api);
        const data = await res.json();

        const filtered = data.filter(item =>
          item.nama_produk.toLowerCase().includes(query.toLowerCase())
        );

        displaySearchResults(filtered);
      } catch (err) {
        console.error('Error:', err);
        document.getElementById('search-results').innerHTML =
          '<p class="text-red-500">Gagal mengambil data produk.</p>';
      }
    }

    function displaySearchResults(products) {
      const container = document.getElementById('search-results');
      const noResults = document.getElementById('no-results');
      container.innerHTML = '';

      if (products.length === 0) {
        noResults.style.display = 'block';
        return;
      }

    noResults.style.display = 'none';

  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'bg-white p-4 rounded-xl shadow';

        card.innerHTML = `
            <a href="Buying Page.html?name=${encodeURIComponent(product.nama_produk)}" class="block">
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
    container.appendChild(card);
  });
}

    if (query) {
      fetchAndFilter();
    } else {
      document.getElementById('search-results').innerHTML =
        '<p class="text-gray-600">Masukkan kata kunci pencarian.</p>';
    }