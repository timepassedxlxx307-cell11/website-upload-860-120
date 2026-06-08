(function () {
  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  var toggle = document.querySelector("[data-mobile-toggle]");
  var nav = document.querySelector("[data-site-nav]");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var opened = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", opened ? "true" : "false");
    });
  }

  document.querySelectorAll("img").forEach(function (image) {
    image.addEventListener("error", function () {
      image.style.opacity = "0";
    }, { once: true });
  });

  var cards = Array.prototype.slice.call(document.querySelectorAll("[data-movie-card]"));
  var activeFilter = "all";

  function applyFilters() {
    var queryInputs = Array.prototype.slice.call(document.querySelectorAll("[data-search-input]"));
    var query = queryInputs.map(function (input) {
      return normalize(input.value);
    }).filter(Boolean).join(" ");

    cards.forEach(function (card) {
      var searchText = normalize(card.getAttribute("data-search"));
      var keys = normalize(card.getAttribute("data-filter-keys"));
      var matchesSearch = !query || searchText.indexOf(query) !== -1;
      var matchesFilter = activeFilter === "all" || keys.indexOf(normalize(activeFilter)) !== -1;
      card.classList.toggle("is-hidden", !(matchesSearch && matchesFilter));
    });
  }

  document.querySelectorAll("[data-search-input]").forEach(function (input) {
    input.addEventListener("input", applyFilters);
  });

  document.querySelectorAll("[data-filter]").forEach(function (button) {
    button.addEventListener("click", function () {
      activeFilter = button.getAttribute("data-filter") || "all";
      document.querySelectorAll("[data-filter]").forEach(function (item) {
        item.classList.toggle("is-active", item === button);
      });
      applyFilters();
    });
  });

  document.querySelectorAll(".hero-search").forEach(function (form) {
    form.addEventListener("submit", function () {
      setTimeout(applyFilters, 0);
    });
  });

  var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
  var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
  var prev = document.querySelector("[data-hero-prev]");
  var next = document.querySelector("[data-hero-next]");
  var current = 0;
  var timer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    current = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle("is-active", slideIndex === current);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle("is-active", dotIndex === current);
    });
  }

  function startHero() {
    if (timer) {
      clearInterval(timer);
    }

    if (slides.length > 1) {
      timer = setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }
  }

  if (prev) {
    prev.addEventListener("click", function () {
      showSlide(current - 1);
      startHero();
    });
  }

  if (next) {
    next.addEventListener("click", function () {
      showSlide(current + 1);
      startHero();
    });
  }

  dots.forEach(function (dot) {
    dot.addEventListener("click", function () {
      showSlide(Number(dot.getAttribute("data-hero-dot") || 0));
      startHero();
    });
  });

  showSlide(0);
  startHero();
})();
