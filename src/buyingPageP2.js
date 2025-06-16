        let map;
        let currentMarker;

        // Jakarta Barat areas with coordinates
        const jakartaBaratAreas = {
            'kebon-jeruk': {
                name: 'Kebon Jeruk',
                lat: -6.1944,
                lng: 106.7833,
                address: 'Kebon Jeruk, Jakarta Barat'
            },
            'grogol': {
                name: 'Grogol Petamburan',
                lat: -6.1667,
                lng: 106.7833,
                address: 'Grogol Petamburan, Jakarta Barat'
            },
            'taman-sari': {
                name: 'Taman Sari',
                lat: -6.1333,
                lng: 106.8167,
                address: 'Taman Sari, Jakarta Barat'
            },
            'cengkareng': {
                name: 'Cengkareng',
                lat: -6.1333,
                lng: 106.7333,
                address: 'Cengkareng, Jakarta Barat'
            }
        };

        // Initialize map centered on Jakarta Barat
        function initMap() {
            // Center of Jakarta Barat
            const jakartaBaratCenter = [-6.1667, 106.7833];
            
            map = L.map('map').setView(jakartaBaratCenter, 12);
            
            // Add OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);
            
            // Add Jakarta Barat restaurants and cafes
            addJakartaBaratRestaurants();
            
            // Set default delivery location
            setDeliveryLocation(-6.1944, 106.7833, 'Jl. Raya Cikarang Cibarusah, Cikarang Selatan', 'Kebon Jeruk, Jakarta Barat');
            
            // Hide loading
            setTimeout(() => {
                document.getElementById('loading').style.display = 'none';
            }, 1000);
        }

        // Add restaurants and cafes in Jakarta Barat
        function addJakartaBaratRestaurants() {
            const restaurants = [
                // Kebon Jeruk area
                { name: 'Starbucks Kebon Jeruk', lat: -6.1944, lng: 106.7833, type: 'cafe', area: 'Kebon Jeruk' },
                { name: 'KFC Kebon Jeruk', lat: -6.1950, lng: 106.7840, type: 'fastfood', area: 'Kebon Jeruk' },
                { name: 'Pizza Hut Kebon Jeruk', lat: -6.1938, lng: 106.7825, type: 'restaurant', area: 'Kebon Jeruk' },
                
                // Grogol area
                { name: 'McDonald\'s Grogol', lat: -6.1667, lng: 106.7833, type: 'fastfood', area: 'Grogol' },
                { name: 'Cafe Tujuh Belas', lat: -6.1670, lng: 106.7840, type: 'cafe', area: 'Grogol' },
                { name: 'Warung Padang Sederhana', lat: -6.1660, lng: 106.7820, type: 'restaurant', area: 'Grogol' },
                
                // Taman Sari area
                { name: 'Kopi Kenangan Taman Sari', lat: -6.1333, lng: 106.8167, type: 'cafe', area: 'Taman Sari' },
                { name: 'Bakmi GM Taman Sari', lat: -6.1340, lng: 106.8170, type: 'restaurant', area: 'Taman Sari' },
                { name: 'Burger King Taman Sari', lat: -6.1325, lng: 106.8160, type: 'fastfood', area: 'Taman Sari' },
                
                // Cengkareng area
                { name: 'Janji Jiwa Cengkareng', lat: -6.1333, lng: 106.7333, type: 'cafe', area: 'Cengkareng' },
                { name: 'Ayam Geprek Bensu', lat: -6.1340, lng: 106.7340, type: 'restaurant', area: 'Cengkareng' },
                { name: 'Domino\'s Pizza Cengkareng', lat: -6.1325, lng: 106.7325, type: 'fastfood', area: 'Cengkareng' },
                
                // Additional popular spots
                { name: 'Sate Khas Senayan', lat: -6.1800, lng: 106.7900, type: 'restaurant', area: 'Jakarta Barat' },
                { name: 'Chatime Central Park', lat: -6.1750, lng: 106.7920, type: 'cafe', area: 'Jakarta Barat' },
                { name: 'Yoshinoya Central Park', lat: -6.1760, lng: 106.7910, type: 'restaurant', area: 'Jakarta Barat' }
            ];

            restaurants.forEach(restaurant => {
                const color = restaurant.type === 'cafe' ? '#8B5CF6' : 
                             restaurant.type === 'restaurant' ? '#EF4444' : '#F59E0B';
                
                L.marker([restaurant.lat, restaurant.lng], {
                    icon: L.divIcon({
                        className: 'restaurant-marker',
                        html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></div>`,
                        iconSize: [16, 16],
                        iconAnchor: [8, 8]
                    })
                }).addTo(map).bindPopup(`
                    <div class="text-center">
                        <strong>${restaurant.name}</strong><br>
                        <small>${restaurant.area}</small><br>
                        <span class="text-xs text-gray-500">${restaurant.type}</span>
                    </div>
                `);
            });
        }

        // Go to specific area
        function goToArea(areaKey) {
            const area = jakartaBaratAreas[areaKey];
            if (area) {
                map.setView([area.lat, area.lng], 15);
                setDeliveryLocation(area.lat, area.lng, area.address, area.name);
            }
        }

        // Set delivery location
        function setDeliveryLocation(lat, lng, address, area) {
            // Remove existing marker
            if (currentMarker) {
                map.removeLayer(currentMarker);
            }
            
            // Add new delivery marker
            currentMarker = L.marker([lat, lng], {
                icon: L.divIcon({
                    className: 'delivery-marker',
                    html: '<div style="background-color: #00C851; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
                    iconSize: [20, 20],
                    iconAnchor: [10, 10]
                })
            }).addTo(map).bindPopup(`
                <div class="text-center">
                    <strong>Lokasi Pengiriman</strong><br>
                    <small>${address}</small>
                </div>
            `);
            
            // Update address display
            document.getElementById('current-address').textContent = address;
            document.getElementById('coordinates').textContent = area;
        }

        // Search address function (limited to Jakarta Barat)
        async function searchAddress() {
            const query = document.getElementById('address-search').value;
            if (!query) return;

            try {
                const searchQuery = `${query}, Jakarta Barat, Indonesia`;
                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5&bounded=1&viewbox=106.7,6.2,106.9,6.1`);
                const data = await response.json();
                
                if (data && data.length > 0) {
                    const result = data[0];
                    const lat = parseFloat(result.lat);
                    const lng = parseFloat(result.lon);
                    
                    // Update map view
                    map.setView([lat, lng], 16);
                    
                    // Set as delivery location
                    setDeliveryLocation(lat, lng, result.display_name, 'Jakarta Barat');
                } else {
                    alert('Alamat tidak ditemukan di Jakarta Barat. Silakan coba alamat lain.');
                }
            } catch (error) {
                console.error('Error searching address:', error);
                alert('Terjadi kesalahan saat mencari alamat.');
            }
        }

        // Add enter key support for search
        document.getElementById('address-search').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchAddress();
            }
        });

        // Initialize map when page loads
        document.addEventListener('DOMContentLoaded', function() {
            initMap();
        });