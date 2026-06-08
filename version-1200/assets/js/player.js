(function () {
  window.initPlayer = function (src) {
    var shell = document.querySelector('[data-player-shell]');
    var video = document.querySelector('[data-player-video]');
    var overlay = document.querySelector('[data-player-overlay]');
    var button = document.querySelector('[data-player-button]');
    var message = document.querySelector('[data-player-message]');
    var playerReady = false;

    if (!shell || !video || !src) {
      return;
    }

    function setMessage(text) {
      if (!message) {
        return;
      }

      message.textContent = text;
      message.classList.add('is-visible');
    }

    function prepare() {
      if (playerReady) {
        return;
      }

      playerReady = true;

      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });

        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal) {
            setMessage('视频暂时无法播放，请刷新重试');
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
      } else {
        setMessage('视频暂时无法播放，请刷新重试');
      }
    }

    function start() {
      prepare();

      var playRequest = video.play();

      if (playRequest && typeof playRequest.then === 'function') {
        playRequest.catch(function () {
          setMessage('点击播放器继续观看');
        });
      }
    }

    shell.addEventListener('click', function (event) {
      if (event.target === video && !video.paused) {
        return;
      }

      start();
    });

    if (button) {
      button.addEventListener('click', function (event) {
        event.stopPropagation();
        start();
      });
    }

    video.addEventListener('play', function () {
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
    });

    video.addEventListener('pause', function () {
      if (overlay) {
        overlay.classList.remove('is-hidden');
      }
    });

    video.addEventListener('error', function () {
      setMessage('视频暂时无法播放，请刷新重试');
    });
  };

  function bootPlayer() {
    var video = document.querySelector('[data-player-video]');

    if (video) {
      window.initPlayer(video.getAttribute('data-stream'));
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootPlayer);
  } else {
    bootPlayer();
  }
})();
