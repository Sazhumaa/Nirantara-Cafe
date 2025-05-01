// main.js
async function fetchProducts() {
    try {
      const response = await fetch('https://fakestoreapi.com/products');
      const products = await response.json();
      
      // Target kontainer
      const menuContainer = document.getElementById('menu-container');
  
      // Clear isi kontainer
      menuContainer.innerHTML = '';
  
      // Buat kartu produk
      products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'bg-white p-4 rounded-2xl shadow hover:shadow-lg';
  
        card.innerHTML = `
          <img src="${product.image}" alt="${product.title}" class="rounded-lg mb-4 h-40 w-full object-cover">
          <div class="text-gray-500 text-sm mb-1">21-25 min</div>
          <div class="flex items-center gap-1 text-yellow-400 text-sm mb-2">
            ⭐ ${product.rating.rate} | ${product.rating.count} Rating
          </div>
          <h4 class="text-lg font-bold mb-1">${truncateText(product.title, 20)}</h4>
          <p class="text-gray-700">Rp ${(product.price * 15000).toLocaleString('id-ID')}</p>
        `;
        
        menuContainer.appendChild(card);
      });
  
    } catch (error) {
      console.error('Gagal memuat produk:', error);
    }
  }
  
  // Membatasi panjang judul
  function truncateText(text, maxLength) {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  }
  
  fetchProducts();
  