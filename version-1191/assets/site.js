export function initPage() {
  initMenus();
  initHeroSlider();
  initGlobalSearch();
  initCardFilters();
}

function initMenus() {
  const toggle = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-mobile-nav]');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    nav.classList.toggle('hidden');
  });
}

function initHeroSlider() {
  const slider = document.querySelector('[data-hero-slider]');
  if (!slider) return;
  const slides = Array.from(slider.querySelectorAll('[data-hero-slide]'));
  const dots = Array.from(slider.querySelectorAll('[data-hero-dot]'));
  const prev = slider.querySelector('[data-hero-prev]');
  const next = slider.querySelector('[data-hero-next]');
  if (!slides.length) return;
  let current = 0;
  let timer = null;
  const show = (index) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === current));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
  };
  const start = () => {
    stop();
    timer = window.setInterval(() => show(current + 1), 5200);
  };
  const stop = () => {
    if (timer) window.clearInterval(timer);
  };
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      show(index);
      start();
    });
  });
  if (prev) prev.addEventListener('click', () => { show(current - 1); start(); });
  if (next) next.addEventListener('click', () => { show(current + 1); start(); });
  slider.addEventListener('mouseenter', stop);
  slider.addEventListener('mouseleave', start);
  start();
}

function initGlobalSearch() {
  const blocks = Array.from(document.querySelectorAll('[data-global-search]'));
  const index = Array.isArray(window.movieSearchIndex) ? window.movieSearchIndex : [];
  if (!blocks.length || !index.length) return;
  blocks.forEach((block) => {
    const input = block.querySelector('input');
    const panel = block.querySelector('[data-search-results]');
    if (!input || !panel) return;
    input.addEventListener('input', () => {
      const query = input.value.trim().toLowerCase();
      if (!query) {
        panel.innerHTML = '';
        panel.classList.remove('open');
        return;
      }
      const results = index.filter((item) => {
        const text = [item.title, item.year, item.region, item.type, item.genre, item.line, ...(item.tags || [])].join(' ').toLowerCase();
        return text.includes(query);
      }).slice(0, 10);
      panel.innerHTML = results.map((item) => `
        <a class="search-result-item" href="${escapeAttr(item.url)}">
          <img src="${escapeAttr(item.cover)}" alt="${escapeAttr(item.title)}">
          <span>
            <b>${escapeHtml(item.title)}</b>
            <small>${escapeHtml(item.year)} · ${escapeHtml(item.region)} · ${escapeHtml(item.type)}</small>
          </span>
        </a>
      `).join('');
      panel.classList.toggle('open', results.length > 0);
    });
  });
  document.addEventListener('click', (event) => {
    blocks.forEach((block) => {
      if (!block.contains(event.target)) {
        const panel = block.querySelector('[data-search-results]');
        if (panel) panel.classList.remove('open');
      }
    });
  });
}

function initCardFilters() {
  const inputs = Array.from(document.querySelectorAll('[data-card-filter]'));
  if (!inputs.length) return;
  inputs.forEach((input) => {
    const scope = input.closest('main') || document;
    const cards = Array.from(scope.querySelectorAll('[data-filter-card]'));
    input.addEventListener('input', () => {
      const query = input.value.trim().toLowerCase();
      cards.forEach((card) => {
        const text = [card.dataset.title, card.dataset.region, card.dataset.type, card.dataset.year, card.dataset.genre, card.dataset.tags, card.textContent].join(' ').toLowerCase();
        card.style.display = !query || text.includes(query) ? '' : 'none';
      });
    });
  });
}

export async function initMoviePlayer(url) {
  const video = document.querySelector('[data-video-player]');
  const shell = document.querySelector('[data-player-shell]');
  const cover = document.querySelector('[data-play-cover]');
  const button = document.querySelector('[data-play-button]');
  if (!video || !url) return;
  let ready = false;
  let hls = null;
  const attach = async () => {
    if (ready) return;
    ready = true;
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
      return;
    }
    try {
      const module = await import('./video-player-dru42stk.js');
      const Hls = module.H;
      if (Hls && Hls.isSupported()) {
        hls = new Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(url);
        hls.attachMedia(video);
      } else {
        video.src = url;
      }
    } catch (error) {
      video.src = url;
    }
  };
  const play = async () => {
    await attach();
    if (shell) shell.classList.add('is-playing');
    if (cover) cover.classList.add('hidden');
    try {
      await video.play();
    } catch (error) {}
  };
  if (button) button.addEventListener('click', play);
  if (cover) cover.addEventListener('click', play);
  video.addEventListener('click', () => {
    if (!ready) play();
  });
  window.addEventListener('pagehide', () => {
    if (hls && typeof hls.destroy === 'function') hls.destroy();
  });
}

function escapeHtml(value) {
  return String(value || '').replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char]));
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/'/g, '&#39;');
}
