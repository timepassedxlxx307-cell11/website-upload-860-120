(() => {
  const toggle = document.querySelector('[data-menu-toggle]');
  const panel = document.querySelector('[data-mobile-panel]');

  if (toggle && panel) {
    toggle.addEventListener('click', () => {
      panel.classList.toggle('open');
    });
  }

  document.querySelectorAll('.js-search-form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      const input = form.querySelector('input[name="q"]');
      if (!input || !input.value.trim()) {
        event.preventDefault();
        window.location.href = './search.html';
      }
    });
  });

  const slides = Array.from(document.querySelectorAll('[data-hero-slide]'));
  const dots = Array.from(document.querySelectorAll('[data-hero-dot]'));
  const prev = document.querySelector('[data-hero-prev]');
  const next = document.querySelector('[data-hero-next]');
  let current = 0;
  let timer = null;

  const setSlide = (index) => {
    if (!slides.length) {
      return;
    }
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('active', slideIndex === current);
    });
    dots.forEach((dot, dotIndex) => {
      dot.setAttribute('aria-selected', dotIndex === current ? 'true' : 'false');
    });
  };

  const startHero = () => {
    if (timer) {
      window.clearInterval(timer);
    }
    if (slides.length > 1) {
      timer = window.setInterval(() => setSlide(current + 1), 5200);
    }
  };

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      setSlide(index);
      startHero();
    });
  });

  if (prev) {
    prev.addEventListener('click', () => {
      setSlide(current - 1);
      startHero();
    });
  }

  if (next) {
    next.addEventListener('click', () => {
      setSlide(current + 1);
      startHero();
    });
  }

  setSlide(0);
  startHero();

  const searchableLists = Array.from(document.querySelectorAll('[data-searchable-list]'));
  const filterForms = Array.from(document.querySelectorAll('.js-local-filter, .js-page-search'));
  const filterBars = Array.from(document.querySelectorAll('[data-filter-bar]'));
  const emptyState = document.querySelector('[data-empty-state]');
  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get('q') || '';
  let activeFilter = '';

  const normalize = (value) => String(value || '').trim().toLowerCase();

  const setInputs = (value) => {
    filterForms.forEach((form) => {
      const input = form.querySelector('input[type="search"]');
      if (input) {
        input.value = value;
      }
    });
  };

  const applyFilter = () => {
    const input = filterForms.map((form) => form.querySelector('input[type="search"]')).find(Boolean);
    const query = normalize(input ? input.value : initialQuery);
    let visible = 0;

    searchableLists.forEach((list) => {
      list.querySelectorAll('.movie-card').forEach((card) => {
        const haystack = normalize([
          card.dataset.title,
          card.dataset.region,
          card.dataset.type,
          card.dataset.year,
          card.dataset.tags
        ].join(' '));
        const queryMatch = !query || haystack.includes(query);
        const filterMatch = !activeFilter || haystack.includes(normalize(activeFilter));
        const show = queryMatch && filterMatch;
        card.hidden = !show;
        if (show) {
          visible += 1;
        }
      });
    });

    if (emptyState) {
      emptyState.hidden = visible !== 0;
    }
  };

  if (initialQuery) {
    setInputs(initialQuery);
  }

  filterForms.forEach((form) => {
    form.addEventListener('submit', (event) => {
      if (form.classList.contains('js-local-filter') || form.classList.contains('js-page-search')) {
        event.preventDefault();
        applyFilter();
      }
    });
    const input = form.querySelector('input[type="search"]');
    if (input) {
      input.addEventListener('input', applyFilter);
    }
  });

  filterBars.forEach((bar) => {
    bar.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-filter-value]');
      if (!button) {
        return;
      }
      activeFilter = button.dataset.filterValue || '';
      bar.querySelectorAll('button').forEach((item) => item.classList.toggle('active', item === button));
      applyFilter();
    });
  });

  applyFilter();

  const backTop = document.querySelector('[data-back-top]');
  if (backTop) {
    window.addEventListener('scroll', () => {
      backTop.classList.toggle('visible', window.scrollY > 520);
    });
    backTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();
