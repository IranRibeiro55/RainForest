(function () {
  'use strict';

  window.RF_initRevealSections = function () {
    document.querySelectorAll('.reveal').forEach(function (el) {
      var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var compactViewport = window.matchMedia('(max-width: 1080px)').matches;
      if (reduceMotion || compactViewport) {
        el.classList.add('visible');
        return;
      }
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (e) {
            if (!e.isIntersecting) return;
            e.target.classList.add('visible');
            io.unobserve(e.target);
          });
        },
        { threshold: 0.08, rootMargin: '0px 0px -6% 0px' },
      );
      io.observe(el);
    });
  };
})();
