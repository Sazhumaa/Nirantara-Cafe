const navMenus = document.querySelectorAll('.nav-menu');

navMenus.forEach(menu => {
    menu.addEventListener('click', () => {
        navMenus.forEach(item => item.classList.remove('bg-[#D9D9D9]'));
        menu.classList.add('bg-[#D9D9D9]');
    });
});
