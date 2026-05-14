(function () {
  'use strict';

  var publishCtaLangBound = false;

  function scrollToHash() {
    var raw = window.location.hash.replace(/^#/, '');
    if (raw.length > 0) {
      var id = decodeURIComponent(raw);
      var el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'auto', block: 'start' });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }

  window.RF_initPublishCta = function () {
    var href = window.RF_resolvePublishHref();
    var wrap = document.querySelector('.cta-publish-wrap');
    if (!wrap) return;
    var tip = window.RF_I18N.t('a11y.publishDisabled');
    wrap.innerHTML = '';
    if (href) {
      var a = document.createElement('a');
      a.href = href;
      a.className = 'btn-primary';
      a.style.cssText = 'display:inline-block;font-size:17px;padding:18px 56px;';
      if (/^https?:\/\//i.test(href)) {
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
      }
      a.setAttribute('data-i18n', 'cta.btn');
      a.textContent = window.RF_I18N.t('cta.btn');
      wrap.appendChild(a);
    } else {
      var span = document.createElement('span');
      span.className = 'btn-primary';
      span.style.cssText = 'display:inline-block;opacity:0.5;pointer-events:none;';
      span.title = tip;
      span.setAttribute('role', 'note');
      span.setAttribute('data-i18n', 'cta.btn');
      span.textContent = window.RF_I18N.t('cta.btn');
      wrap.appendChild(span);
    }
    if (!publishCtaLangBound) {
      publishCtaLangBound = true;
      window.addEventListener('rf:langchange', function () {
        var w = document.querySelector('.cta-publish-wrap');
        if (!w) return;
        var el = w.querySelector('[data-i18n="cta.btn"]');
        if (el) el.textContent = window.RF_I18N.t('cta.btn');
      });
    }
  };

  window.RF_initMain = function () {
    try {
      if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    } catch (e) {
      /* ignore */
    }

    try {
      var h = window.location.hash || '';
      if (!h || h === '#') {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }
    } catch (e2) {
      /* ignore */
    }

    if (!window.RF_TRANSLATIONS) {
      console.error('RF_TRANSLATIONS em falta — inclui data/translations.js antes de i18n.js.');
      return;
    }

    window.RF_I18N.init();
    window.RF_initPerformanceAndScrollVars();
    window.RF_initScrollYVar();
    window.RF_initRevealSections();
    window.RF_initNavbar();
    window.RF_initLanguageSelector();
    window.RF_initStatCounters();
    window.RF_initGameCards();
    window.RF_initWhyRainForest();
    window.RF_initProcessSection();
    window.RF_initBackToTop();
    window.RF_initPublishCta();

    scrollToHash();
    window.addEventListener('hashchange', scrollToHash);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.RF_initMain);
  } else {
    window.RF_initMain();
  }
})();
