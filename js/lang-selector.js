(function () {
  'use strict';

  window.RF_initLanguageSelector = function () {
    var root = document.querySelector('.lang-switch');
    if (!root) return;

    var trigger = root.querySelector('.lang-trigger');
    var menu = root.querySelector('.lang-menu');
    var open = false;

    function setOpen(v) {
      open = v;
      root.classList.toggle('is-open', open);
      if (trigger) trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    function syncLabels() {
      var lang = window.RF_I18N.getLang();
      var codeEl = root.querySelector('.lang-trigger__code');
      if (codeEl) codeEl.textContent = lang.toUpperCase();
      var short = { pt: 'Brasil', en: 'USA', es: 'España' };
      var lbl = root.querySelector('.lang-trigger__label');
      if (lbl) lbl.textContent = short[lang] || lang;
      if (trigger) trigger.setAttribute('aria-label', window.RF_I18N.t('a11y.language'));
      root.querySelectorAll('.lang-option').forEach(function (btn) {
        var code = btn.getAttribute('data-lang');
        btn.style.display = code === lang ? 'none' : '';
      });
      root.querySelectorAll('.lang-trigger__flag-svg[data-trigger-flag]').forEach(function (wrap) {
        var code = wrap.getAttribute('data-trigger-flag');
        if (code === lang) wrap.removeAttribute('hidden');
        else wrap.setAttribute('hidden', '');
      });
    }

    if (trigger) {
      trigger.addEventListener('click', function () {
        setOpen(!open);
      });
    }

    root.querySelectorAll('.lang-option').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var code = btn.getAttribute('data-lang');
        if (code === 'pt' || code === 'en' || code === 'es') {
          window.RF_I18N.setLang(code);
          setOpen(false);
          syncLabels();
        }
      });
    });

    document.addEventListener('mousedown', function (ev) {
      if (!open) return;
      if (root.contains(ev.target)) return;
      setOpen(false);
    });

    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape') setOpen(false);
    });

    window.addEventListener('rf:langchange', syncLabels);
    syncLabels();
  };
})();
