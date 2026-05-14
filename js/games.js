(function () {
  'use strict';

  function initTilt() {
    document.querySelectorAll('a.game-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var x = ((e.clientX - r.left) / r.width) * 100;
        var y = ((e.clientY - r.top) / r.height) * 100;
        card.style.setProperty('--gx', x + '%');
        card.style.setProperty('--gy', y + '%');
      });
    });
  }

  function initGamesCarousel() {
    var root = document.querySelector('[data-games-carousel]');
    if (!root) return;
    var viewport = root.querySelector('.games-carousel__viewport');
    var track = root.querySelector('.games-carousel__track');
    if (!viewport || !track) return;

    var originals = Array.prototype.slice.call(track.querySelectorAll('a.game-card'));
    if (originals.length < 2) return;

    var cfg = window.RF_CONFIG || {};
    var speed = Number(cfg.GAMES_CAROUSEL_SPEED_PX_PER_SEC);
    if (!isFinite(speed)) speed = 18;
    if (speed < 0) speed = 0;

    var reduceMotion = false;
    try {
      reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e0) {
      reduceMotion = false;
    }

    /** Clones + animação CSS translate(-50%) — não usa scrollLeft (evita falhas com lazy layout). */
    var useMarquee = speed > 0;
    if (!useMarquee) return;

    originals.forEach(function (node) {
      var c = node.cloneNode(true);
      c.setAttribute('tabindex', '-1');
      c.setAttribute('aria-hidden', 'true');
      track.appendChild(c);
    });

    root.classList.add('games-carousel--marquee');
    root.classList.add('games-carousel--out');

    function loopHalfWidth() {
      var w = track.scrollWidth || track.offsetWidth || 0;
      return w > 0 ? w * 0.5 : 0;
    }

    function applyMarqueeDuration() {
      var half = loopHalfWidth();
      if (half < 8) return;
      var sec = half / Math.max(speed, 0.5);
      if (reduceMotion) sec *= 1.75;
      sec = Math.max(12, Math.min(sec, 240));
      track.style.setProperty('--rf-games-marquee-dur', sec + 's');
    }

    function kickMeasure() {
      applyMarqueeDuration();
      window.requestAnimationFrame(function () {
        applyMarqueeDuration();
      });
    }

    kickMeasure();
    window.addEventListener('load', kickMeasure, { passive: true });

    if (typeof ResizeObserver !== 'undefined') {
      var ro = new ResizeObserver(function () {
        applyMarqueeDuration();
      });
      ro.observe(track);
    }

    var revealRaf = 0;
    function revealIfOnScreen() {
      if (revealRaf) return;
      revealRaf = window.requestAnimationFrame(function () {
        revealRaf = 0;
        try {
          var r = viewport.getBoundingClientRect();
          var h = window.innerHeight || 0;
          if (h > 0 && r.top < h && r.bottom > 0) root.classList.remove('games-carousel--out');
        } catch (e1) {
          /* ignore */
        }
      });
    }

    var io =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            function (entries) {
              var e = entries[0];
              var vis = Boolean(e && e.isIntersecting);
              root.classList.toggle('games-carousel--out', !vis);
            },
            { threshold: 0, rootMargin: '140px 0px 160px 0px' },
          )
        : null;
    if (io) io.observe(viewport);

    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(revealIfOnScreen);
    });
    window.setTimeout(revealIfOnScreen, 400);
    window.setTimeout(revealIfOnScreen, 1200);
    window.addEventListener('scroll', revealIfOnScreen, { passive: true });
  }

  window.RF_initGameCards = function () {
    initGamesCarousel();
    initTilt();
  };
})();
