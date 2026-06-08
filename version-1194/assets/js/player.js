(() => {
  const players = document.querySelectorAll('.player-wrap');

  players.forEach((wrap) => {
    const video = wrap.querySelector('video');
    const cover = wrap.querySelector('.player-cover');
    const stream = wrap.dataset.stream;
    let loaded = false;

    const load = () => {
      if (!video || !stream || loaded) {
        return;
      }

      loaded = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else if (window.Hls && window.Hls.isSupported()) {
        const hls = new window.Hls({ enableWorker: true });
        hls.loadSource(stream);
        hls.attachMedia(video);
      } else {
        video.src = stream;
      }
    };

    const play = () => {
      load();
      if (cover) {
        cover.classList.add('hidden');
      }
      const promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(() => {});
      }
    };

    if (cover) {
      cover.addEventListener('click', play);
    }

    if (video) {
      video.addEventListener('click', () => {
        if (video.paused) {
          play();
        }
      });
      video.addEventListener('play', load, { once: true });
    }
  });
})();
