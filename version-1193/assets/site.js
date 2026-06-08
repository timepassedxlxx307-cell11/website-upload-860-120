
(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  function text(value) {
    return String(value || '').replace(/[&<>"]/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;'
      }[char];
    });
  }

  ready(function () {
    var menuButton = document.querySelector('[data-menu-button]');
    var mobileNav = document.querySelector('[data-mobile-nav]');
    if (menuButton && mobileNav) {
      menuButton.addEventListener('click', function () {
        mobileNav.classList.toggle('open');
      });
    }

    var hero = document.querySelector('[data-hero]');
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
      var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
      var current = 0;
      var showSlide = function (index) {
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle('active', i === current);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle('active', i === current);
        });
      };
      dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
          showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
        });
      });
      if (slides.length > 1) {
        setInterval(function () {
          showSlide(current + 1);
        }, 5200);
      }
    }

    Array.prototype.slice.call(document.querySelectorAll('.filter-input')).forEach(function (input) {
      var section = input.closest('.filter-section') || document;
      var cards = Array.prototype.slice.call(section.querySelectorAll('.movie-card'));
      input.addEventListener('input', function () {
        var query = input.value.trim().toLowerCase();
        cards.forEach(function (card) {
          var keywords = (card.getAttribute('data-keywords') || '').toLowerCase();
          card.classList.toggle('is-hidden', query && keywords.indexOf(query) === -1);
        });
      });
    });

    var searchInput = document.querySelector('.site-search-input');
    var searchPanel = document.getElementById('searchResults');
    var catalog = window.MovieCatalog || [];
    if (searchInput && searchPanel && catalog.length) {
      var renderSearch = function () {
        var query = searchInput.value.trim().toLowerCase();
        if (!query) {
          searchPanel.classList.remove('show');
          searchPanel.innerHTML = '';
          return;
        }
        var matches = catalog.filter(function (item) {
          return String(item.text || '').toLowerCase().indexOf(query) !== -1;
        }).slice(0, 12);
        if (!matches.length) {
          searchPanel.classList.add('show');
          searchPanel.innerHTML = '<div class="search-result-item"><div></div><div><strong>未找到匹配影片</strong><span>请尝试输入片名、年份、地区或类型</span></div></div>';
          return;
        }
        searchPanel.classList.add('show');
        searchPanel.innerHTML = matches.map(function (item) {
          return '<a class="search-result-item" href="' + text(item.url) + '"><img src="' + text(item.cover) + '" alt="' + text(item.title) + '"><div><strong>' + text(item.title) + '</strong><span>' + text(item.year) + ' · ' + text(item.region) + ' · ' + text(item.type) + '</span></div></a>';
        }).join('');
      };
      searchInput.addEventListener('input', renderSearch);
      document.addEventListener('click', function (event) {
        if (!searchPanel.contains(event.target) && event.target !== searchInput) {
          searchPanel.classList.remove('show');
        }
      });
    }

    var playerShell = document.querySelector('[data-player-shell]');
    if (playerShell) {
      var video = playerShell.querySelector('video');
      var button = playerShell.querySelector('[data-play-button]');
      var started = false;
      var startPlayer = function () {
        if (!video || started) {
          if (video) {
            video.play().catch(function () {});
          }
          return;
        }
        started = true;
        var stream = video.getAttribute('data-stream') || '';
        if (button) {
          button.classList.add('hidden');
        }
        if (window.Hls && window.Hls.isSupported() && stream) {
          var hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(stream);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
            video.play().catch(function () {});
          });
        } else if (stream) {
          video.src = stream;
          video.play().catch(function () {});
        }
      };
      if (button) {
        button.addEventListener('click', startPlayer);
      }
      playerShell.addEventListener('click', function (event) {
        if (event.target === playerShell || event.target === video) {
          startPlayer();
        }
      });
    }
  });
})();
