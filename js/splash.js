(function () {
  'use strict';

  var splash = document.getElementById('rf-splash');
  if (!splash) {
    try {
      document.documentElement.classList.remove('rf-splash-pending');
    } catch (e) {
      /* ignore */
    }
    return;
  }

  var reduceMotion = false;
  try {
    reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {
    /* ignore */
  }

  var minMs = reduceMotion ? 260 : 820;
  var maxMs = reduceMotion ? 900 : 2600;
  var started = performance.now();
  var finished = false;
  var scheduleStarted = false;

  function unlockHtml() {
    try {
      document.documentElement.classList.remove('rf-splash-pending');
    } catch (e) {
      /* ignore */
    }
    try {
      document.body.style.overflow = '';
    } catch (e2) {
      /* ignore */
    }
  }

  function dismiss() {
    if (finished) return;
    finished = true;
    splash.classList.add('rf-splash--done');
    splash.setAttribute('aria-busy', 'false');
    splash.setAttribute('aria-valuetext', 'Pronto');
    splash.setAttribute('aria-valuenow', '100');

    var onEnd = function (ev) {
      if (ev && ev.propertyName && ev.propertyName !== 'opacity') return;
      splash.removeEventListener('transitionend', onEnd);
      unlockHtml();
      try {
        if (!window.location.hash || window.location.hash === '#') {
          window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        }
      } catch (e3) {
        /* ignore */
      }
    };

    if (reduceMotion) {
      window.setTimeout(onEnd, 220);
    } else {
      splash.addEventListener('transitionend', onEnd);
      window.setTimeout(onEnd, 700);
    }
  }

  function scheduleDismiss() {
    if (scheduleStarted) return;
    scheduleStarted = true;
    var elapsed = performance.now() - started;
    var wait = Math.max(0, minMs - elapsed);
    window.setTimeout(dismiss, wait);
  }

  try {
    document.body.style.overflow = 'hidden';
  } catch (e) {
    /* ignore */
  }

  window.addEventListener('load', scheduleDismiss, { once: true });

  if (document.readyState === 'complete') {
    scheduleDismiss();
  }

  window.setTimeout(function () {
    if (!finished) dismiss();
  }, maxMs);
})();
