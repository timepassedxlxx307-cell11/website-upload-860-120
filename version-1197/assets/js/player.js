(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {
    var players = Array.prototype.slice.call(document.querySelectorAll('.video-player'));
    players.forEach(function (player) {
      var video = player.querySelector('video');
      var playButton = player.querySelector('.play-button');
      var playSmall = player.querySelector('[data-player-play]');
      var muteButton = player.querySelector('[data-player-mute]');
      var fullButton = player.querySelector('[data-player-full]');
      var progress = player.querySelector('.progress-value');
      var bar = player.querySelector('.progress-bar');
      var url = player.getAttribute('data-video');
      var instance = null;

      if (!video || !url) {
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        instance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        instance.loadSource(url);
        instance.attachMedia(video);
        instance.on(window.Hls.Events.ERROR, function (event, data) {
          if (!data || !data.fatal) {
            return;
          }
          if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
            instance.startLoad();
          } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
            instance.recoverMediaError();
          } else {
            instance.destroy();
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
      }

      function playOrPause() {
        if (video.paused) {
          player.classList.add('is-started');
          video.play().catch(function () {});
        } else {
          video.pause();
        }
      }

      function updateButtons() {
        var text = video.paused ? '▶' : 'Ⅱ';
        if (playSmall) {
          playSmall.textContent = text;
        }
      }

      player.addEventListener('click', function (event) {
        if (event.target.closest('.player-control') || event.target.closest('.progress-bar')) {
          return;
        }
        playOrPause();
      });

      if (playButton) {
        playButton.addEventListener('click', function (event) {
          event.stopPropagation();
          playOrPause();
        });
      }

      if (playSmall) {
        playSmall.addEventListener('click', function (event) {
          event.stopPropagation();
          playOrPause();
        });
      }

      if (muteButton) {
        muteButton.addEventListener('click', function (event) {
          event.stopPropagation();
          video.muted = !video.muted;
          muteButton.textContent = video.muted ? '静' : '声';
        });
      }

      if (fullButton) {
        fullButton.addEventListener('click', function (event) {
          event.stopPropagation();
          if (document.fullscreenElement) {
            document.exitFullscreen().catch(function () {});
          } else {
            player.requestFullscreen().catch(function () {});
          }
        });
      }

      if (bar) {
        bar.addEventListener('click', function (event) {
          event.stopPropagation();
          if (!video.duration) {
            return;
          }
          var rect = bar.getBoundingClientRect();
          var ratio = (event.clientX - rect.left) / rect.width;
          video.currentTime = Math.max(0, Math.min(1, ratio)) * video.duration;
        });
      }

      video.addEventListener('play', updateButtons);
      video.addEventListener('pause', updateButtons);
      video.addEventListener('timeupdate', function () {
        if (progress && video.duration) {
          progress.style.width = (video.currentTime / video.duration * 100) + '%';
        }
      });
      updateButtons();
    });
  });
})();
