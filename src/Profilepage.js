// ========================================
// DATA DEFAULT PROFIL
// ========================================
// Data profil default yang digunakan saat tidak ada data tersimpan
// atau saat user melakukan reset profil
const defaultData = {
  firstName: "Suisei",
  lastName: "Hoshimachi", 
  email: "suiseihoshimachi@gmail.com",
  birthDate: "22 Maret",
  profileImage: "image/Suiseiii pp.jpg"
};

// ========================================
// DATA PROFIL SAAT INI
// ========================================
// Menyimpan data profil yang sedang aktif di memori
// Diinisialisasi dengan data default
let currentProfileData = { ...defaultData };

// ========================================
// SISTEM LOAD DATA PROFIL
// ========================================
// Fungsi: Memuat data profil dari localStorage
// Fitur: Error handling, fallback ke data default
function loadProfileData() {
  const savedData = localStorage.getItem('userProfile');
  if (savedData) {
    try {
      // Parse data dari localStorage
      currentProfileData = JSON.parse(savedData);
      console.log('Profile data loaded from localStorage:', currentProfileData);
    } catch (error) {
      // Handle error parsing data
      console.error('Error parsing saved profile data:', error);
      // Fallback ke data default jika terjadi error
      currentProfileData = { ...defaultData };
    }
  }
  // Update tampilan profil di UI
  updateProfileDisplay();
}

// ========================================
// SISTEM SAVE DATA PROFIL
// ========================================
// Fungsi: Menyimpan data profil ke localStorage
function saveProfileData() {
  // Simpan data profil ke localStorage
  localStorage.setItem('userProfile', JSON.stringify(currentProfileData));
  console.log('Profile data saved to localStorage:', currentProfileData);
}

// ========================================
// UTILITY FUNCTION: CEK KEBERADAAN DATA PROFIL
// ========================================
// Fungsi: Mengecek apakah ada data profil tersimpan di localStorage
function hasProfileData() {
  return localStorage.getItem('userProfile') !== null;
}

// ========================================
// UTILITY FUNCTION: AMBIL DATA PROFIL
// ========================================
// Fungsi: Mengambil data profil dari localStorage
// Fitur: Fallback ke data default jika tidak ada data tersimpan
function getProfileData() {
  const savedData = localStorage.getItem('userProfile');
  return savedData ? JSON.parse(savedData) : defaultData;
}

// ========================================
// SISTEM UPDATE TAMPILAN PROFIL
// ========================================
// Fungsi: Memperbarui tampilan profil di UI
// Fitur: Update semua field, reset mode edit, disable tombol save
function updateProfileDisplay() {
  // Update nilai semua field
  document.querySelector('[data-field="firstName"]').value = currentProfileData.firstName;
  document.querySelector('[data-field="lastName"]').value = currentProfileData.lastName;
  document.querySelector('[data-field="email"]').value = currentProfileData.email;
  document.querySelector('[data-field="birthDate"]').value = currentProfileData.birthDate;
  document.getElementById('profileImage').src = currentProfileData.profileImage;
  
  // Reset semua field ke readonly (non-edit mode)
  const inputs = document.querySelectorAll('input[data-field]');
  inputs.forEach(input => {
    input.readOnly = true;
    input.classList.remove('bg-white', 'border-green-500');
    input.closest('.flex').classList.remove('border-green-500');
  });
  
  // Disable dan sembunyikan tombol save
  const saveBtn = document.getElementById('saveBtn');
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.style.display = 'none';
  }
}

// ========================================
// SISTEM DETEKSI PERUBAHAN
// ========================================
// Fungsi: Mengecek apakah ada perubahan pada data profil
// Fitur: Enable/disable tombol save berdasarkan perubahan
function checkIfChanged() {
  let changed = false;
  
  // Cek perubahan pada field teks
  for (const key in currentProfileData) {
    if (key !== "profileImage") {
      const currentValue = document.querySelector(`[data-field="${key}"]`).value.trim();
      if (currentValue !== currentProfileData[key]) {
        changed = true;
        break;
      }
    }
  }
  
  // Cek perubahan gambar profil
  if (!changed) {
    const currentImage = document.getElementById("profileImage").src;
    if (currentImage !== currentProfileData.profileImage) {
      changed = true;
    }
  }
  
  // Enable/disable tombol save berdasarkan perubahan
  const saveBtn = document.getElementById("saveBtn");
  if (saveBtn) {
    saveBtn.disabled = !changed;
  }
}

// ========================================
// SISTEM TOGGLE EDIT MODE (SEMUA FIELD)
// ========================================
// Fungsi: Mengaktifkan/menonaktifkan mode edit untuk semua field
// Fitur: Visual feedback, toggle tombol edit/save
function toggleEditAll() {
  const fields = ['firstName', 'lastName', 'email', 'birthDate'];
  const editBtn = document.getElementById('editBtn');
  const saveBtn = document.getElementById('saveBtn');
  
  // Cek apakah sedang dalam mode edit
  const isInEditMode = !document.querySelector('[data-field="firstName"]').readOnly;
  
  if (!isInEditMode) {
    // Masuk ke mode edit untuk semua field
    fields.forEach(field => {
      const input = document.querySelector(`[data-field="${field}"]`);
      input.readOnly = false;
      input.classList.add('bg-white');
      const container = input.closest('.flex');
      container.classList.add('border-green-500');
      container.classList.remove('border-blue-500', 'border-pink-400', 'border-purple-400');
    });
    
    // Ubah tampilan tombol
    if (editBtn) editBtn.style.display = 'none';
    if (saveBtn) {
      saveBtn.style.display = 'inline-block';
      saveBtn.disabled = false;
    }
    
    // Tampilkan notifikasi
    showNotification('Mode edit aktif untuk semua field', 'info');
  } else {
    // Jika sudah dalam mode edit, simpan perubahan
    saveAll();
  }
  
  // Cek perubahan untuk enable/disable tombol save
  checkIfChanged();
}

// ========================================
// SISTEM TOGGLE EDIT MODE (SINGLE FIELD)
// ========================================
// Fungsi: Mengaktifkan/menonaktifkan mode edit untuk satu field
// Fitur: Visual feedback, auto focus, auto select
function toggleEditMode(field) {
  const input = document.querySelector(`[data-field="${field}"]`);
  const container = input.closest('.flex');
  
  if (input.readOnly) {
    // Masuk ke mode edit
    input.readOnly = false;
    input.classList.add('bg-white');
    container.classList.add('border-green-500');
    container.classList.remove('border-blue-500', 'border-pink-400', 'border-purple-400');
    input.focus();
    input.select();
    
    // Tampilkan notifikasi
    showNotification(`Mode edit aktif untuk ${getFieldDisplayName(field)}`, 'info');
  } else {
    // Keluar dari mode edit
    input.readOnly = true;
    input.classList.remove('bg-white');
    container.classList.remove('border-green-500');
    
    // Kembalikan border color sesuai field
    const borderColors = {
      firstName: 'border-blue-500',
      lastName: 'border-blue-500', 
      email: 'border-pink-400',
      birthDate: 'border-purple-400'
    };
    container.classList.add(borderColors[field]);
  }
  
  // Cek perubahan untuk enable/disable tombol save
  checkIfChanged();
}

// ========================================
// SISTEM HANDLE EDIT CLICK
// ========================================
// Fungsi: Menangani klik pada tombol edit
// Fitur: Toggle mode edit atau buka file picker
function handleEditClick() {
  const isInEditMode = !document.querySelector('[data-field="firstName"]').readOnly;
  
  if (!isInEditMode) {
    // Jika belum dalam mode edit, aktifkan mode edit
    toggleEditAll();
  } else {
    // Jika sudah dalam mode edit, buka file picker untuk upload gambar
    document.getElementById('fileInput').click();
  }
}

// ========================================
// SISTEM SAVE PROFIL
// ========================================
// Fungsi: Menyimpan semua perubahan profil
// Fitur: Validasi input, visual feedback, notifikasi
function saveAll() {
  const fields = ['firstName', 'lastName', 'email', 'birthDate'];
  let hasChanges = false;
  
  // Validasi input sebelum menyimpan
  for (const field of fields) {
    const input = document.querySelector(`[data-field="${field}"]`);
    const value = input.value.trim();
    
    if (!validateField(field, value)) {
      return; // Stop jika ada validasi yang gagal
    }
  }
  
  // Simpan perubahan untuk setiap field
  fields.forEach(field => {
    const input = document.querySelector(`[data-field="${field}"]`);
    const newValue = input.value.trim();
    
    // Update data jika ada perubahan
    if (currentProfileData[field] !== newValue) {
      currentProfileData[field] = newValue;
      hasChanges = true;
    }
    
    // Reset field ke readonly mode
    input.readOnly = true;
    input.classList.remove('bg-white');
    
    // Kembalikan border color
    const container = input.closest('.flex');
    container.classList.remove('border-green-500');
    const borderColors = {
      firstName: 'border-blue-500',
      lastName: 'border-blue-500',
      email: 'border-pink-400', 
      birthDate: 'border-purple-400'
    };
    container.classList.add(borderColors[field]);
  });
  
  // Simpan gambar profil jika ada perubahan
  const currentImage = document.getElementById("profileImage").src;
  if (currentProfileData.profileImage !== currentImage) {
    currentProfileData.profileImage = currentImage;
    hasChanges = true;
  }
  
  // Simpan ke localStorage
  saveProfileData();
  
  // Kembalikan tampilan tombol
  const editBtn = document.getElementById('editBtn');
  const saveBtn = document.getElementById('saveBtn');
  if (editBtn) editBtn.style.display = 'inline-block';
  if (saveBtn) saveBtn.style.display = 'none';
  
  // Tampilkan notifikasi sukses
  showNotification("Profil berhasil disimpan! 💾", 'success');
}

// ========================================
// SISTEM RESET PROFIL
// ========================================
// Fungsi: Mereset profil ke pengaturan default
// Fitur: Konfirmasi user, notifikasi
function resetProfile() {
  if (confirm("Apakah Anda yakin ingin mereset profil ke pengaturan default?")) {
    // Reset data ke default
    currentProfileData = { ...defaultData };
    // Update tampilan
    updateProfileDisplay();
    // Simpan ke localStorage
    saveProfileData();
    // Tampilkan notifikasi
    showNotification("Profil berhasil direset! 🔄", 'success');
  }
}

// ========================================
// SISTEM CHANGE PROFILE IMAGE
// ========================================
// Fungsi: Mengganti gambar profil
// Fitur: Validasi file, preview image, notifikasi
function changeProfileImage(event) {
  const file = event.target.files[0];
  if (file) {
    // Validasi ukuran file (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showNotification("Ukuran file terlalu besar. Maksimal 5MB.", 'error');
      return;
    }
    
    // Validasi tipe file
    if (!file.type.startsWith('image/')) {
      showNotification("File harus berupa gambar.", 'error');
      return;
    }
    
    // Baca file sebagai Data URL
    const reader = new FileReader();
    reader.onload = function(e) {
      // Update tampilan gambar profil
      document.getElementById("profileImage").src = e.target.result;
      // Cek perubahan untuk enable/disable tombol save
      checkIfChanged();
      // Tampilkan notifikasi
      showNotification("Gambar profil berhasil diubah! Klik Save untuk menyimpan.", 'info');
    };
    reader.readAsDataURL(file);
  }
}

// ========================================
// SISTEM VALIDASI FIELD
// ========================================
// Fungsi: Memvalidasi nilai field profil
// Fitur: Validasi khusus per field, notifikasi error
function validateField(field, value) {
  switch(field) {
    case 'firstName':
    case 'lastName':
      // Validasi panjang minimal
      if (value.length < 2) {
        showNotification(`${getFieldDisplayName(field)} harus minimal 2 karakter`, 'error');
        return false;
      }
      // Validasi hanya huruf dan spasi
      if (!/^[a-zA-Z\s]+$/.test(value)) {
        showNotification(`${getFieldDisplayName(field)} hanya boleh mengandung huruf`, 'error');
        return false;
      }
      break;
    case 'email':
      // Validasi format email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        showNotification('Format email tidak valid', 'error');
        return false;
      }
      break;
    case 'birthDate':
      // Validasi panjang minimal
      if (value.length < 3) {
        showNotification('Tanggal lahir tidak valid', 'error');
        return false;
      }
      break;
  }
  return true;
}

// ========================================
// UTILITY FUNCTION: GET FIELD DISPLAY NAME
// ========================================
// Fungsi: Mendapatkan nama tampilan untuk field
function getFieldDisplayName(field) {
  const displayNames = {
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    birthDate: 'Tanggal Lahir'
  };
  return displayNames[field] || field;
}

// ========================================
// SISTEM NOTIFIKASI
// ========================================
// Fungsi: Menampilkan notifikasi
// Fitur: Warna berbeda per tipe, auto-dismiss, animasi
function showNotification(message, type = 'info') {
  // Hapus notifikasi yang ada
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // Buat elemen notifikasi
  const notification = document.createElement('div');
  
  // Set warna berdasarkan tipe notifikasi
  const typeColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  };
  
  // Set class dan style notifikasi
  notification.className = `notification fixed top-4 right-4 ${typeColors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50`;
  
  // Set konten notifikasi dengan icon sesuai tipe
  notification.innerHTML = `
    <div class="flex items-center space-x-2">
      <span>${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
      <span>${message}</span>
    </div>
  `;
  
  // Tambahkan ke DOM
  document.body.appendChild(notification);
  
  // Auto remove setelah 3 detik dengan animasi fade-out
  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// ========================================
// SISTEM INISIALISASI HALAMAN
// ========================================
// Fungsi: Inisialisasi halaman profil saat load
// Fitur: Load data, setup event listeners, keyboard shortcuts
window.onload = function() {
  // Load data profil dari localStorage
  loadProfileData();
  
  // Inisialisasi tombol save (hidden by default)
  const saveBtn = document.getElementById('saveBtn');
  if (saveBtn) {
    saveBtn.style.display = 'none'; // Sembunyikan tombol save di awal
  }
  
  // Tambahkan event listener ke semua input
  const inputs = document.querySelectorAll("input[data-field]");
  inputs.forEach(input => {
    // Deteksi perubahan untuk enable/disable tombol save
    input.addEventListener("input", checkIfChanged);
    
    // Event listener untuk keyboard shortcuts
    input.addEventListener("keydown", function(e) {
      if (e.key === 'Enter' && !input.readOnly) {
        saveAll(); // Simpan semua perubahan dengan Enter
      } else if (e.key === 'Escape' && !input.readOnly) {
        // Cancel edit - kembalikan nilai asli dengan Escape
        input.value = currentProfileData[input.getAttribute('data-field')];
        saveAll(); // Keluar dari mode edit
      }
    });
  });
  
  // Keyboard shortcut untuk save (Ctrl+S)
  document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault(); // Prevent browser save dialog
      const saveBtn = document.getElementById('saveBtn');
      if (saveBtn && !saveBtn.disabled && saveBtn.style.display !== 'none') {
        saveAll(); // Simpan perubahan
      }
    }
  });
  
  // Welcome message dengan delay
  setTimeout(() => {
    showNotification('Profil berhasil dimuat! 👋', 'success');
  }, 500);
};

// ========================================
// EXPORT PROFILE MANAGER API
// ========================================
// Expose API untuk digunakan oleh halaman lain
window.ProfileManager = {
  hasProfileData,
  getProfileData,
  defaultData
};