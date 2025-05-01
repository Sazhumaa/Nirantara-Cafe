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