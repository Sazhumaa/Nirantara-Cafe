
const defaultData = {
  firstName: "Suisei",
  lastName: "Hoshimachi", 
  email: "suiseihoshimachi@gmail.com",
  birthDate: "22 Maret",
  profileImage: "image/Suiseiii pp.jpg"
};


let currentProfileData = { ...defaultData };


function loadProfileData() {
  const savedData = localStorage.getItem('userProfile');
  if (savedData) {
    try {
      currentProfileData = JSON.parse(savedData);
      console.log('Profile data loaded from localStorage:', currentProfileData);
    } catch (error) {
      console.error('Error parsing saved profile data:', error);
      currentProfileData = { ...defaultData };
    }
  }
  updateProfileDisplay();
}


function saveProfileData() {
  localStorage.setItem('userProfile', JSON.stringify(currentProfileData));
  console.log('Profile data saved to localStorage:', currentProfileData);
}


function hasProfileData() {
  return localStorage.getItem('userProfile') !== null;
}


function getProfileData() {
  const savedData = localStorage.getItem('userProfile');
  return savedData ? JSON.parse(savedData) : defaultData;
}


function updateProfileDisplay() {
  // Update nilai semua field
  document.querySelector('[data-field="firstName"]').value = currentProfileData.firstName;
  document.querySelector('[data-field="lastName"]').value = currentProfileData.lastName;
  document.querySelector('[data-field="email"]').value = currentProfileData.email;
  document.querySelector('[data-field="birthDate"]').value = currentProfileData.birthDate;
  document.getElementById('profileImage').src = currentProfileData.profileImage;
  
  // Reset semua field ke readonly
  const inputs = document.querySelectorAll('input[data-field]');
  inputs.forEach(input => {
    input.readOnly = true;
    input.classList.remove('bg-white', 'border-green-500');
    input.closest('.flex').classList.remove('border-green-500');
  });
  
  // Disable save button
  const saveBtn = document.getElementById('saveBtn');
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.style.display = 'none';
  }
}


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
  
  const saveBtn = document.getElementById("saveBtn");
  if (saveBtn) {
    saveBtn.disabled = !changed;
  }
}

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
    
    showNotification('Mode edit aktif untuk semua field', 'info');
  } else {
    // Jika sudah dalam mode edit, simpan perubahan
    saveAll();
  }
  
  checkIfChanged();
}


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
  
  checkIfChanged();
}


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
  
  // Simpan perubahan
  fields.forEach(field => {
    const input = document.querySelector(`[data-field="${field}"]`);
    const newValue = input.value.trim();
    
    if (currentProfileData[field] !== newValue) {
      currentProfileData[field] = newValue;
      hasChanges = true;
    }
    
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
  
  showNotification("Profil berhasil disimpan! 💾", 'success');
}


function resetProfile() {
  if (confirm("Apakah Anda yakin ingin mereset profil ke pengaturan default?")) {
    currentProfileData = { ...defaultData };
    updateProfileDisplay();
    saveProfileData();
    showNotification("Profil berhasil direset! 🔄", 'success');
  }
}

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
    
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById("profileImage").src = e.target.result;
      checkIfChanged();
      showNotification("Gambar profil berhasil diubah! Klik Save untuk menyimpan.", 'info');
    };
    reader.readAsDataURL(file);
  }
}


function validateField(field, value) {
  switch(field) {
    case 'firstName':
    case 'lastName':
      if (value.length < 2) {
        showNotification(`${getFieldDisplayName(field)} harus minimal 2 karakter`, 'error');
        return false;
      }
      if (!/^[a-zA-Z\s]+$/.test(value)) {
        showNotification(`${getFieldDisplayName(field)} hanya boleh mengandung huruf`, 'error');
        return false;
      }
      break;
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        showNotification('Format email tidak valid', 'error');
        return false;
      }
      break;
    case 'birthDate':
      if (value.length < 3) {
        showNotification('Tanggal lahir tidak valid', 'error');
        return false;
      }
      break;
  }
  return true;
}


function getFieldDisplayName(field) {
  const displayNames = {
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    birthDate: 'Tanggal Lahir'
  };
  return displayNames[field] || field;
}


function showNotification(message, type = 'info') {
  // Hapus notifikasi yang ada
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  const notification = document.createElement('div');
  const typeColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  };
  
  notification.className = `notification fixed top-4 right-4 ${typeColors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50`;
  notification.innerHTML = `
    <div class="flex items-center space-x-2">
      <span>${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
      <span>${message}</span>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Auto remove setelah 3 detik
  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

window.onload = function() {
  // Load data profil dari localStorage
  loadProfileData();
  
  // Inisialisasi tombol
  const saveBtn = document.getElementById('saveBtn');
  if (saveBtn) {
    saveBtn.style.display = 'none'; // Sembunyikan tombol save di awal
  }
  
  // Tambahkan event listener ke semua input
  const inputs = document.querySelectorAll("input[data-field]");
  inputs.forEach(input => {
    input.addEventListener("input", checkIfChanged);
    
    // Event listener untuk Enter dan Escape
    input.addEventListener("keydown", function(e) {
      if (e.key === 'Enter' && !input.readOnly) {
        saveAll(); // Simpan semua perubahan
      } else if (e.key === 'Escape' && !input.readOnly) {
        // Cancel edit - kembalikan nilai asli
        input.value = currentProfileData[input.getAttribute('data-field')];
        saveAll(); // Keluar dari mode edit
      }
    });
  });
  
  // Keyboard shortcut untuk save (Ctrl+S)
  document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      const saveBtn = document.getElementById('saveBtn');
      if (saveBtn && !saveBtn.disabled && saveBtn.style.display !== 'none') {
        saveAll();
      }
    }
  });
  
  // Welcome message
  setTimeout(() => {
    showNotification('Profil berhasil dimuat! 👋', 'success');
  }, 500);
};


window.ProfileManager = {
  hasProfileData,
  getProfileData,
  defaultData
};