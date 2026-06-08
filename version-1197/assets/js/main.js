(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {
    var hero = document.querySelector('.hero-carousel');
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
      var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
      var prev = hero.querySelector('.hero-arrow.prev');
      var next = hero.querySelector('.hero-arrow.next');
      var index = 0;
      var timer = null;

      function show(to) {
        if (!slides.length) {
          return;
        }
        index = (to + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle('is-active', i === index);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle('is-active', i === index);
        });
      }

      function start() {
        stop();
        timer = window.setInterval(function () {
          show(index + 1);
        }, 5000);
      }

      function stop() {
        if (timer) {
          window.clearInterval(timer);
          timer = null;
        }
      }

      if (prev) {
        prev.addEventListener('click', function () {
          show(index - 1);
          start();
        });
      }

      if (next) {
        next.addEventListener('click', function () {
          show(index + 1);
          start();
        });
      }

      dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
          show(i);
          start();
        });
      });

      hero.addEventListener('mouseenter', stop);
      hero.addEventListener('mouseleave', start);
      show(0);
      start();
    }

    var filterInput = document.querySelector('[data-filter-input]');
    var typeFilter = document.querySelector('[data-filter-type]');
    var yearFilter = document.querySelector('[data-filter-year]');
    var regionFilter = document.querySelector('[data-filter-region]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));

    function normalize(text) {
      return String(text || '').toLowerCase().trim();
    }

    function filterCards() {
      if (!cards.length) {
        return;
      }
      var keyword = normalize(filterInput && filterInput.value);
      var typeValue = normalize(typeFilter && typeFilter.value);
      var yearValue = normalize(yearFilter && yearFilter.value);
      var regionValue = normalize(regionFilter && regionFilter.value);
      cards.forEach(function (card) {
        var haystack = normalize(card.getAttribute('data-title') + ' ' + card.getAttribute('data-tags') + ' ' + card.getAttribute('data-genre'));
        var type = normalize(card.getAttribute('data-type'));
        var year = normalize(card.getAttribute('data-year'));
        var region = normalize(card.getAttribute('data-region'));
        var ok = true;
        if (keyword && haystack.indexOf(keyword) === -1) {
          ok = false;
        }
        if (typeValue && type.indexOf(typeValue) === -1) {
          ok = false;
        }
        if (yearValue && year.indexOf(yearValue) === -1) {
          ok = false;
        }
        if (regionValue && region.indexOf(regionValue) === -1) {
          ok = false;
        }
        card.style.display = ok ? '' : 'none';
      });
    }

    [filterInput, typeFilter, yearFilter, regionFilter].forEach(function (control) {
      if (control) {
        control.addEventListener('input', filterCards);
        control.addEventListener('change', filterCards);
      }
    });
  });
})();
