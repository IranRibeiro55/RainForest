(function () {
  'use strict';

  function animateCounter(el, target, prefix, suffix, signal) {
    var current = 0;
    var step = Math.max(target / 40, 1);
    var id = window.setInterval(function () {
      if (signal.aborted) {
        clearInterval(id);
        return;
      }
      current = Math.min(current + step, target);
      el.textContent = prefix + Math.round(current) + suffix;
      if (current >= target) clearInterval(id);
    }, 30);
  }

  window.RF_initStatCounters = function () {
    document.querySelectorAll('[data-stat-counter]').forEach(function (wrap) {
      var el = wrap.querySelector('.stat-num');
      if (!el || wrap.getAttribute('data-stat-variant') === 'text') return;
      var value = el.getAttribute('data-stat-value') || el.textContent.trim();
      var m = value.match(/^(\+?)(\d+)(.*)$/);
      if (!m) return;
      var prefix = m[1];
      var target = parseInt(m[2], 10);
      var suffix = m[3];
      if (isNaN(target)) return;

      var ac = new AbortController();
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (e) {
            if (!e.isIntersecting) return;
            el.textContent = prefix + '0' + suffix;
            animateCounter(el, target, prefix, suffix, ac.signal);
            io.disconnect();
          });
        },
        { root: null, threshold: 0.2 },
      );
      io.observe(wrap);
    });
  };
})();
