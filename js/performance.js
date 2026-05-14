(function () {
  'use strict';

  function computePerformanceMode() {
    if (typeof window === 'undefined') return 'full';
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var coarsePointer = window.matchMedia('(pointer: coarse)').matches;
    var narrowViewport = window.innerWidth <= 1024;
    var commonDesktopViewport = window.innerWidth <= 1600;
    var nav = navigator;
    var deviceMemory = nav.deviceMemory != null ? nav.deviceMemory : 8;
    var hardwareConcurrency = nav.hardwareConcurrency != null ? nav.hardwareConcurrency : 8;
    var lowHardware = deviceMemory <= 4 || hardwareConcurrency <= 4;
    var mediumHardware = deviceMemory <= 8 || hardwareConcurrency <= 8;
    return reducedMotion ||
      lowHardware ||
      mediumHardware ||
      (coarsePointer && narrowViewport) ||
      commonDesktopViewport
      ? 'lite'
      : 'full';
  }

  window.RF_computePerformanceMode = computePerformanceMode;
  window.RF_isLitePerformanceMode = function () {
    return computePerformanceMode() === 'lite';
  };

  window.RF_initPerformanceAndScrollVars = function () {
    var root = document.documentElement;
    var reducedMotionMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    var pointerMq = window.matchMedia('(pointer: coarse)');

    function sync() {
      var mode = computePerformanceMode();
      root.dataset.performance = mode;
      if (mode === 'lite') {
        root.style.setProperty('--scroll-y', '0px');
      }
      document.querySelectorAll('[data-atmo-full-only]').forEach(function (el) {
        el.style.display = mode === 'lite' ? 'none' : '';
      });
    }

    sync();
    window.addEventListener('resize', sync, { passive: true });
    reducedMotionMq.addEventListener('change', sync);
    pointerMq.addEventListener('change', sync);
  };

  window.RF_initScrollYVar = function () {
    var root = document.documentElement;
    var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    var raf = 0;

    function enabled() {
      return !mq.matches && !window.RF_isLitePerformanceMode();
    }

    function onScroll() {
      if (!enabled()) return;
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = 0;
        root.style.setProperty('--scroll-y', window.scrollY + 'px');
      });
    }

    function bindScroll() {
      window.removeEventListener('scroll', onScroll);
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    function sync() {
      if (!enabled()) {
        window.removeEventListener('scroll', onScroll);
        root.style.setProperty('--scroll-y', '0px');
      } else {
        bindScroll();
      }
    }

    mq.addEventListener('change', sync);
    window.addEventListener('resize', sync, { passive: true });
    sync();
  };
})();
