(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function initHero() {
        var slider = document.querySelector("[data-slider]");
        if (!slider) {
            return;
        }
        var slides = Array.prototype.slice.call(slider.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-dot]"));
        var current = 0;
        var timer = null;
        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle("active", i === current);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle("active", i === current);
            });
        }
        function next() {
            show(current + 1);
        }
        function start() {
            stop();
            timer = window.setInterval(next, 5000);
        }
        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }
        var prev = slider.querySelector("[data-prev]");
        var nextButton = slider.querySelector("[data-next]");
        if (prev) {
            prev.addEventListener("click", function () {
                show(current - 1);
                start();
            });
        }
        if (nextButton) {
            nextButton.addEventListener("click", function () {
                show(current + 1);
                start();
            });
        }
        dots.forEach(function (dot, i) {
            dot.addEventListener("click", function () {
                show(i);
                start();
            });
        });
        slider.addEventListener("mouseenter", stop);
        slider.addEventListener("mouseleave", start);
        show(0);
        start();
    }

    function initFilters() {
        document.querySelectorAll("[data-filter-panel]").forEach(function (panel) {
            var input = panel.querySelector("[data-filter-input]");
            var cards = Array.prototype.slice.call(panel.querySelectorAll(".movie-card, .rank-item"));
            var buttons = Array.prototype.slice.call(panel.querySelectorAll(".filter-buttons button"));
            var state = { text: "", year: "", type: "" };
            var params = new URLSearchParams(window.location.search);
            if (params.get("q") && input) {
                input.value = params.get("q");
                state.text = input.value.trim().toLowerCase();
            }
            function apply() {
                cards.forEach(function (card) {
                    var haystack = [
                        card.getAttribute("data-title") || "",
                        card.getAttribute("data-tags") || "",
                        card.getAttribute("data-genre") || "",
                        card.getAttribute("data-year") || "",
                        card.getAttribute("data-type") || "",
                        card.textContent || ""
                    ].join(" ").toLowerCase();
                    var matchText = !state.text || haystack.indexOf(state.text) >= 0;
                    var matchYear = !state.year || (card.getAttribute("data-year") || "") === state.year;
                    var matchType = !state.type || (card.getAttribute("data-type") || "") === state.type;
                    card.classList.toggle("is-hidden", !(matchText && matchYear && matchType));
                });
            }
            if (input) {
                input.addEventListener("input", function () {
                    state.text = input.value.trim().toLowerCase();
                    apply();
                });
            }
            buttons.forEach(function (button) {
                button.addEventListener("click", function () {
                    var clear = button.hasAttribute("data-clear");
                    if (clear) {
                        state.year = "";
                        state.type = "";
                        buttons.forEach(function (b) {
                            b.classList.toggle("active", b.hasAttribute("data-clear"));
                        });
                    } else {
                        if (button.hasAttribute("data-year")) {
                            state.year = button.getAttribute("data-year");
                        }
                        if (button.hasAttribute("data-type")) {
                            state.type = button.getAttribute("data-type");
                        }
                        buttons.forEach(function (b) {
                            if (b.hasAttribute("data-clear")) {
                                b.classList.remove("active");
                            }
                        });
                        button.classList.toggle("active");
                    }
                    apply();
                });
            });
            apply();
        });
    }

    function attachSource(video, source) {
        if (!video || !source) {
            return Promise.resolve();
        }
        if (video.getAttribute("src")) {
            return Promise.resolve();
        }
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = source;
            return Promise.resolve();
        }
        if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({ maxBufferLength: 30 });
            hls.loadSource(source);
            hls.attachMedia(video);
            video._hls = hls;
            return Promise.resolve();
        }
        video.src = source;
        return Promise.resolve();
    }

    function initPlayers() {
        document.querySelectorAll(".player-box").forEach(function (box) {
            var video = box.querySelector("video");
            var button = box.querySelector(".play-layer");
            var source = box.getAttribute("data-video");
            var started = false;
            function start() {
                attachSource(video, source).then(function () {
                    if (button) {
                        button.classList.add("hidden");
                    }
                    started = true;
                    var playRequest = video.play();
                    if (playRequest && typeof playRequest.catch === "function") {
                        playRequest.catch(function () {});
                    }
                });
            }
            if (button) {
                button.addEventListener("click", start);
            }
            if (video) {
                video.addEventListener("click", function () {
                    if (!started || video.paused) {
                        start();
                    } else {
                        video.pause();
                    }
                });
                video.addEventListener("play", function () {
                    if (button) {
                        button.classList.add("hidden");
                    }
                });
                video.addEventListener("pause", function () {
                    if (button && video.currentTime === 0) {
                        button.classList.remove("hidden");
                    }
                });
            }
        });
    }

    ready(function () {
        initHero();
        initFilters();
        initPlayers();
    });
})();
