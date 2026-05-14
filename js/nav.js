(function () {
  'use strict';

  window.RF_initNavbar = function () {
    var nav = document.querySelector('.site-nav');
    if (!nav) return;

    var panel = document.getElementById('primary-nav');
    var burger = document.querySelector('.nav-burger');
    var menuOpen = false;

    function onScroll() {
      nav.classList.toggle('is-scrolled', window.scrollY > 60);
    }

    function closeMenu() {
      menuOpen = false;
      if (panel) panel.classList.remove('is-open');
      if (burger) {
        burger.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        burger.setAttribute('aria-label', window.RF_I18N.t('a11y.burgerOpen'));
      }
      document.body.style.overflow = '';
    }

    function openMenuToggle() {
      menuOpen = !menuOpen;
      if (panel) panel.classList.toggle('is-open', menuOpen);
      if (burger) {
        burger.classList.toggle('is-open', menuOpen);
        burger.setAttribute('aria-expanded', menuOpen ? 'true' : 'false');
        burger.setAttribute(
          'aria-label',
          menuOpen ? window.RF_I18N.t('a11y.burgerClose') : window.RF_I18N.t('a11y.burgerOpen'),
        );
      }
      document.body.style.overflow = menuOpen ? 'hidden' : '';
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) closeMenu();
    });

    if (burger) {
      burger.addEventListener('click', openMenuToggle);
    }

    document.querySelectorAll('a.hash-link[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var href = a.getAttribute('href');
        if (!href || href[0] !== '#') return;
        e.preventDefault();
        closeMenu();
        var target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    window.addEventListener('rf:langchange', function () {
      if (burger && !menuOpen) {
        burger.setAttribute('aria-label', window.RF_I18N.t('a11y.burgerOpen'));
      }
    });
  };

  window.RF_initBackToTop = function () {
    var btn = document.querySelector('.back-to-top');
    if (!btn) return;
    var launchTimeout = null;

    function onScroll() {
      btn.classList.toggle('is-visible', window.scrollY > 520);
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    btn.addEventListener('click', function () {
      var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (launchTimeout) clearTimeout(launchTimeout);
      btn.classList.add('is-launching');
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      launchTimeout = setTimeout(function () {
        btn.classList.remove('is-launching');
        launchTimeout = null;
      }, reduceMotion ? 120 : 900);
    });

    window.addEventListener('rf:langchange', function () {
      btn.setAttribute('aria-label', window.RF_I18N.t('a11y.backToTop'));
    });
  };
})();
