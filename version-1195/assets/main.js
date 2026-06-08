
(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var toggle = document.querySelector('[data-mobile-toggle]');
    var panel = document.querySelector('[data-mobile-panel]');

    if (toggle && panel) {
      toggle.addEventListener('click', function () {
        panel.classList.toggle('is-open');
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var current = 0;

    function activateSlide(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        activateSlide(index);
      });
    });

    if (slides.length > 1) {
      activateSlide(0);
      setInterval(function () {
        activateSlide(current + 1);
      }, 5200);
    }

    var scopes = Array.prototype.slice.call(document.querySelectorAll('[data-filter-scope]'));

    scopes.forEach(function (scope) {
      var input = scope.querySelector('[data-card-filter]');
      var type = scope.querySelector('[data-type-filter]');
      var region = scope.querySelector('[data-region-filter]');
      var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-movie-id]'));
      var count = scope.querySelector('[data-result-count]');
      var params = new URLSearchParams(window.location.search);
      var query = params.get('q') || '';

      if (input && input.hasAttribute('data-query-init')) {
        input.value = query;
      }

      function normalize(value) {
        return String(value || '').trim().toLowerCase();
      }

      function apply() {
        var keyword = normalize(input ? input.value : '');
        var typeValue = type ? type.value : '';
        var regionValue = region ? region.value : '';
        var visible = 0;

        cards.forEach(function (card) {
          var text = normalize(card.getAttribute('data-search'));
          var cardType = card.getAttribute('data-type') || '';
          var cardRegion = card.getAttribute('data-region') || '';
          var matched = true;

          if (keyword && text.indexOf(keyword) === -1) {
            matched = false;
          }

          if (typeValue && cardType !== typeValue) {
            matched = false;
          }

          if (regionValue && cardRegion !== regionValue) {
            matched = false;
          }

          card.classList.toggle('is-hidden', !matched);

          if (matched) {
            visible += 1;
          }
        });

        if (count) {
          count.textContent = '当前显示 ' + visible + ' 部';
        }
      }

      if (input) {
        input.addEventListener('input', apply);
      }

      if (type) {
        type.addEventListener('change', apply);
      }

      if (region) {
        region.addEventListener('change', apply);
      }

      apply();
    });
  });
}());
