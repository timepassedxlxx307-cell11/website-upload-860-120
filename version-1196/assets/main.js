(function() {
  const header = document.getElementById("site-header");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");

  function updateHeader() {
    if (!header) {
      return;
    }

    if (window.scrollY > 30) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", function() {
      mobileMenu.classList.toggle("open");
    });
  }

  const hero = document.querySelector("[data-hero]");

  if (hero) {
    const slides = Array.from(hero.querySelectorAll("[data-hero-slide]"));
    const dots = Array.from(hero.querySelectorAll("[data-hero-dot]"));
    const posters = Array.from(hero.querySelectorAll("[data-hero-poster]"));
    let activeIndex = 0;

    function setHero(index) {
      activeIndex = (index + slides.length) % slides.length;

      slides.forEach(function(slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === activeIndex);
      });

      dots.forEach(function(dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === activeIndex);
      });

      posters.forEach(function(poster, posterIndex) {
        poster.classList.toggle("active", posterIndex === activeIndex);
      });
    }

    dots.forEach(function(dot, index) {
      dot.addEventListener("click", function() {
        setHero(index);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function() {
        setHero(activeIndex + 1);
      }, 5200);
    }
  }

  const filterInput = document.querySelector("[data-filter-input]");
  const filterList = document.querySelector("[data-filter-list]");

  if (filterInput && filterList) {
    const items = Array.from(filterList.querySelectorAll("[data-filter-card]"));
    const empty = filterList.querySelector("[data-empty-result]");
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q");

    if (query) {
      filterInput.value = query;
    }

    function applyFilter() {
      const value = filterInput.value.trim().toLowerCase();
      let visibleCount = 0;

      items.forEach(function(item) {
        const haystack = (item.getAttribute("data-search") || item.textContent || "").toLowerCase();
        const isVisible = !value || haystack.includes(value);
        item.style.display = isVisible ? "" : "none";

        if (isVisible) {
          visibleCount += 1;
        }
      });

      if (empty) {
        empty.classList.toggle("show", visibleCount === 0);
      }
    }

    filterInput.addEventListener("input", applyFilter);
    applyFilter();
  }
})();
