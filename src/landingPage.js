document.addEventListener("DOMContentLoaded", function () {
    const scrollContainer = document.getElementById("cultureScroll");
    const scrollLeft = document.getElementById("scrollLeft");
    const scrollRight = document.getElementById("scrollRight");

    const scrollAmount = 250;

    function scrollByX(val) {
      if (scrollContainer) {
        scrollContainer.scrollBy({ left: val, behavior: 'smooth' });
      }
    }

    scrollLeft?.addEventListener("click", () => scrollByX(-scrollAmount));
    scrollRight?.addEventListener("click", () => scrollByX(scrollAmount));
  });

        // Mobile menu toggle functionality
        const menuToggle = document.getElementById('menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        const menuIcon = document.getElementById('menu-icon');
        const closeIcon = document.getElementById('close-icon');
        const mobileLinks = document.querySelectorAll('.mobile-link');

        let isMenuOpen = false;

        // Toggle menu function
        function toggleMenu() {
            isMenuOpen = !isMenuOpen;
            
            if (isMenuOpen) {
                mobileMenu.classList.remove('menu-hidden');
                mobileMenu.classList.add('menu-visible');
                menuIcon.classList.add('hidden');
                closeIcon.classList.remove('hidden');
            } else {
                mobileMenu.classList.remove('menu-visible');
                mobileMenu.classList.add('menu-hidden');
                menuIcon.classList.remove('hidden');
                closeIcon.classList.add('hidden');
            }
        }

        // Event listeners
        menuToggle.addEventListener('click', toggleMenu);

        // Close menu when clicking on mobile links
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (isMenuOpen) {
                    toggleMenu();
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (isMenuOpen && !menuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
                toggleMenu();
            }
        });

        // Close menu on window resize (when switching to desktop)
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768 && isMenuOpen) {
                toggleMenu();
            }
        });

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

