
  const container = document.getElementById('coffee-container');
  const errorMessage = document.getElementById('error-message');

  fetch('https://fakestoreapi.com/products')
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(data => {
      data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'bg-white p-4 rounded-2xl shadow hover:shadow-lg';

        card.innerHTML = `
          <img src="${item.image || 'https://via.placeholder.com/300x160?text=No+Image'}"
               alt="${item.title}" class="rounded-lg mb-4 h-40 w-full object-cover">
          <div class="text-gray-500 text-sm mb-1">${item.time || '20-25 min'}</div>
          <div class="flex items-center gap-1 text-yellow-400 text-sm mb-2">
            ⭐ ${item.rating.toFixed(1)} | ${item.ratingCount} Rating
          </div>
          <h4 class="text-lg font-bold mb-1">${item.title}</h4>
          <p class="text-gray-700">Rp ${item.price.toLocaleString('id-ID')}</p>
        `;

        container.appendChild(card);
      });
    })
    .catch(error => {
      console.error('Fetch error:', error);
      errorMessage.classList.remove('hidden');
    });

