(function () {
  var video = document.getElementById("movie-player");
  var button = document.querySelector("[data-play-button]");
  var status = document.querySelector("[data-player-status]");
  var hlsInstance = null;

  if (!video || !button) {
    return;
  }

  var streamUrl = video.getAttribute("data-stream") || "";

  function setStatus(message) {
    if (status) {
      status.textContent = message;
    }
  }

  function attachStream() {
    return new Promise(function (resolve) {
      if (!streamUrl) {
        setStatus("暂时无法播放，请稍后重试");
        resolve();
        return;
      }

      if (video.currentSrc || video.getAttribute("src")) {
        resolve();
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false
        });

        hlsInstance.loadSource(streamUrl);
        hlsInstance.attachMedia(video);
        hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
          resolve();
        });
        hlsInstance.on(window.Hls.Events.ERROR, function (_, data) {
          if (data && data.fatal) {
            setStatus("暂时无法播放，请稍后重试");
          }
        });

        setTimeout(resolve, 1200);
        return;
      }

      video.src = streamUrl;
      resolve();
    });
  }

  function beginPlay() {
    setStatus("正在加载影片");

    attachStream().then(function () {
      button.classList.add("is-hidden");
      video.controls = true;
      var playPromise = video.play();

      if (playPromise && typeof playPromise.then === "function") {
        playPromise.then(function () {
          setStatus("正在播放");
        }).catch(function () {
          button.classList.remove("is-hidden");
          setStatus("点击开始观看");
        });
      }
    });
  }

  button.addEventListener("click", beginPlay);
  video.addEventListener("click", function () {
    if (video.paused) {
      beginPlay();
    }
  });
  window.addEventListener("beforeunload", function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
})();
