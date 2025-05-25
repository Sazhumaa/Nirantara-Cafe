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
        card.className = 'bg-white p-4 rounded shadow';

        card.innerHTML = `
          <a href="Buying Page.html?name=${encodeURIComponent(product.nama_produk)}">
            <img src="${product.gambar_produk}" class="w-full h-40 object-cover rounded mb-2" />
            <h3 class="font-semibold">${product.nama_produk}</h3>
            <p>Rp ${Number(product.harga_produk).toLocaleString('id-ID')}</p>
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