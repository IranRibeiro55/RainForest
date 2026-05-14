(function () {
  'use strict';

  var DIFF_KEYS = ['diff.i1', 'diff.i2', 'diff.i3', 'diff.i4', 'diff.i5'];
  var PROJECTS_TOTAL = 35;
  var AUTO_STEP_MS = 3200;
  var MANUAL_PAUSE_MS = 5200;

  function splitDiffCopy(html) {
    var compact = String(html).replace(/\s+/g, ' ').trim();
    var match = compact.match(/<strong>(.*?)<\/strong><br\s*\/?>(.*)/i);
    function stripTags(value) {
      return value.replace(/<[^>]+>/g, '').trim();
    }
    return {
      title: stripTags(match ? match[1] : compact),
      body: stripTags(match ? match[2] : compact),
    };
  }

  window.RF_initWhyRainForest = function () {
    var section = document.getElementById('diferencial');
    if (!section) return;

    var statRef = section.querySelector('.diff-stat-body');
    var resumeAutoRef = null;
    var reduceMotionRef = false;
    var liteModeRef = false;
    var activeIndex = 0;
    var countProgress = 0;
    var isReady = false;
    var isAutoPaused = false;
    var isInViewport = false;
    var autoTimer = null;

    var itemRefs = Array.prototype.slice.call(section.querySelectorAll('.diff-item'));

    function syncMotion() {
      reduceMotionRef = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      restartAuto();
    }

    function syncLite() {
      liteModeRef = window.RF_isLitePerformanceMode();
      restartAuto();
    }

    function clearAuto() {
      if (autoTimer) {
        clearInterval(autoTimer);
        autoTimer = null;
      }
    }

    function restartAuto() {
      clearAuto();
      if (!isReady || isAutoPaused || reduceMotionRef || !isInViewport || liteModeRef) return;
      autoTimer = window.setInterval(function () {
        activeIndex = (activeIndex + 1) % DIFF_KEYS.length;
        renderActive({ scrollItem: true });
      }, AUTO_STEP_MS);
    }

    function pauseAutoplay(duration) {
      duration = duration == null ? MANUAL_PAUSE_MS : duration;
      if (reduceMotionRef) return;
      isAutoPaused = true;
      clearAuto();
      if (resumeAutoRef) window.clearTimeout(resumeAutoRef);
      resumeAutoRef = window.setTimeout(function () {
        isAutoPaused = false;
        resumeAutoRef = null;
        restartAuto();
      }, duration);
    }

    function activateIndex(index, pauseMs) {
      activeIndex = index;
      pauseAutoplay(pauseMs == null ? MANUAL_PAUSE_MS : pauseMs);
      renderActive({ scrollItem: true });
    }

    function updateStatOnly() {
      var projectsCount = Math.round(PROJECTS_TOTAL * countProgress);
      var numEl = section.querySelector('.diff-big-number');
      if (numEl) {
        numEl.innerHTML =
          projectsCount + '<span class="diff-big-suffix" aria-hidden="true">+</span>';
      }
      var fill = section.querySelector('.diff-loading-line__fill');
      if (fill) {
        fill.style.width = Math.max(18, Math.round(countProgress * 100)) + '%';
      }
    }

    /**
     * @param {{ scrollItem?: boolean }} [opts]
     * scrollItem: só true quando o índice ativo muda (utilizador / autoplay). Nunca durante o
     * rAF do contador — scrollIntoView(smooth) em loop empilha scroll e “puxa” a página toda.
     */
    function renderActive(opts) {
      opts = opts || {};
      var scrollItem = Boolean(opts.scrollItem);
      itemRefs.forEach(function (li, index) {
        li.classList.toggle('is-active', index === activeIndex);
        var btn = li.querySelector('.diff-item-button');
        if (btn) btn.setAttribute('aria-pressed', index === activeIndex ? 'true' : 'false');
      });
      var node = itemRefs[activeIndex];
      if (node && isInViewport && scrollItem) {
        node.scrollIntoView({
          block: 'nearest',
          behavior: reduceMotionRef ? 'auto' : 'smooth',
        });
      }
      updateStatOnly();
    }

    function refreshCopy() {
      DIFF_KEYS.forEach(function (key, index) {
        var html = window.RF_I18N.t(key);
        var copy = splitDiffCopy(html);
        var btn = section.querySelector('.diff-item-button[data-diff-index="' + index + '"]');
        if (!btn) return;
        var titleEl = btn.querySelector('.diff-item-title');
        var bodyEl = btn.querySelector('.diff-item-body');
        if (titleEl) titleEl.textContent = copy.title;
        if (bodyEl) bodyEl.textContent = copy.body;
        var nodeEl = btn.querySelector('.diff-item-node');
        if (nodeEl) nodeEl.textContent = 'node ' + String(index + 1).padStart(2, '0');
      });
      var cap = section.querySelector('.diff-caption');
      if (cap) cap.textContent = window.RF_I18N.t('diff.statCaption');
    }

    section.querySelectorAll('.diff-item-button').forEach(function (btn) {
      var index = parseInt(btn.getAttribute('data-diff-index'), 10);
      btn.addEventListener('mouseenter', function () {
        activateIndex(index, 3600);
      });
      btn.addEventListener('focus', function () {
        activateIndex(index);
      });
      btn.addEventListener('click', function () {
        activateIndex(index);
      });
    });

    syncMotion();
    syncLite();
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', syncMotion);
    window.addEventListener('resize', syncLite, { passive: true });

    if (statRef) {
      var readyObserver = new IntersectionObserver(
        function (entries) {
          var entry = entries[0];
          if (!entry || !entry.isIntersecting || isReady) return;
          isReady = true;
          readyObserver.disconnect();
          if (reduceMotionRef) {
            countProgress = 1;
            renderActive({ scrollItem: false });
            restartAuto();
            return;
          }
          var start = 0;
          var duration = 1700;
          function tick(time) {
            if (!start) start = time;
            var elapsed = Math.min((time - start) / duration, 1);
            countProgress = 1 - Math.pow(1 - elapsed, 3);
            updateStatOnly();
            if (elapsed < 1) requestAnimationFrame(tick);
            else restartAuto();
          }
          requestAnimationFrame(tick);
        },
        { threshold: 0.35 },
      );
      readyObserver.observe(statRef);
    }

    var sectionObserver = new IntersectionObserver(
      function (entries) {
        var entry = entries[0];
        isInViewport = Boolean(entry && entry.isIntersecting);
        restartAuto();
      },
      { threshold: 0.2 },
    );
    sectionObserver.observe(section);

    window.addEventListener('rf:langchange', refreshCopy);

    refreshCopy();
    renderActive({ scrollItem: false });
  };
})();
