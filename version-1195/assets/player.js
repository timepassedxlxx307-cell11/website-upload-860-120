
(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var players = Array.prototype.slice.call(document.querySelectorAll('.js-player'));

    players.forEach(function (player) {
      var video = player.querySelector('video');
      var cover = player.querySelector('.js-play');
      var triggers = Array.prototype.slice.call(document.querySelectorAll('.js-play-trigger'));
      var stream = player.getAttribute('data-stream');
      var hls = null;
      var initialized = false;

      if (!video || !stream) {
        return;
      }

      function playVideo() {
        var playPromise = video.play();

        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(function () {});
        }
      }

      function initVideo() {
        if (initialized) {
          playVideo();
          return;
        }

        initialized = true;
        player.classList.add('is-playing');

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = stream;
          video.addEventListener('loadedmetadata', playVideo, { once: true });
          playVideo();
          return;
        }

        if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });

          hls.loadSource(stream);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.MANIFEST_PARSED, playVideo);
          hls.on(window.Hls.Events.ERROR, function (event, data) {
            if (!data || !data.fatal || !hls) {
              return;
            }

            if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
              hls.startLoad();
              return;
            }

            if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
              hls.recoverMediaError();
              return;
            }

            hls.destroy();
          });
          return;
        }

        video.src = stream;
        video.addEventListener('loadedmetadata', playVideo, { once: true });
        playVideo();
      }

      if (cover) {
        cover.addEventListener('click', initVideo);
      }

      video.addEventListener('click', function () {
        if (video.paused) {
          initVideo();
        }
      });

      triggers.forEach(function (trigger) {
        trigger.addEventListener('click', initVideo);
      });
    });
  });
}());
