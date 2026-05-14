(function () {
  'use strict';

  var STORAGE_KEY = 'rf_lang';
  var SITE_NAME = 'Rain Forest';
  var SITE_URL = 'https://rainforestgames.com.br/';
  var SOCIAL_IMAGE =
    'https://static.wixstatic.com/media/9b669c_517c6a9d0add44b38a5e3ec90370f344~mv2.png/v1/fill/w_656,h_438,al_c,q_85,usm_0.66_1.00_0.01,quality_auto/Rainforest_logo_main%20(1).png';

  function flattenMessages(node, prefix, out) {
    prefix = prefix || '';
    out = out || {};
    if (node == null || typeof node !== 'object' || Array.isArray(node)) return out;
    Object.keys(node).forEach(function (k) {
      var key = prefix ? prefix + '.' + k : k;
      var v = node[k];
      if (v != null && typeof v === 'object' && !Array.isArray(v)) {
        flattenMessages(v, key, out);
      } else if (typeof v === 'string') {
        out[key] = v;
      }
    });
    return out;
  }

  function getStoredLang() {
    var v = localStorage.getItem(STORAGE_KEY);
    if (!v) return null;
    if (v === 'pt-BR' || v === 'pt') return 'pt';
    if (v === 'en') return 'en';
    if (v === 'es') return 'es';
    return null;
  }

  function detectBrowserLang() {
    var list = []
      .concat(navigator.languages || [])
      .concat([navigator.language || 'pt'])
      .filter(Boolean);
    for (var i = 0; i < list.length; i++) {
      var c = String(list[i]).toLowerCase();
      if (c.startsWith('pt')) return 'pt';
      if (c.startsWith('es')) return 'es';
      if (c.startsWith('en')) return 'en';
    }
    return 'pt';
  }

  function htmlLangAttr(lang) {
    if (lang === 'pt') return 'pt-BR';
    if (lang === 'es') return 'es';
    return 'en';
  }

  var flatPacks = { pt: {}, en: {}, es: {} };
  var currentLang = 'pt';

  function rebuildFlatPacks() {
    var raw = window.RF_TRANSLATIONS;
    if (!raw) return;
    flatPacks.pt = flattenMessages(raw.pt);
    flatPacks.en = flattenMessages(raw.en);
    flatPacks.es = flattenMessages(raw.es);
  }

  function t(key) {
    var pack = flatPacks[currentLang] || flatPacks.pt;
    var fb = flatPacks.pt;
    return pack[key] != null ? pack[key] : fb[key] != null ? fb[key] : '';
  }

  function upsertMeta(selector, attrs, content) {
    var el = document.head.querySelector(selector);
    if (!el) {
      el = document.createElement('meta');
      Object.keys(attrs).forEach(function (k) {
        el.setAttribute(k, attrs[k]);
      });
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  }

  function upsertLink(selector, attrs) {
    var el = document.head.querySelector(selector);
    if (!el) {
      el = document.createElement('link');
      document.head.appendChild(el);
    }
    Object.keys(attrs).forEach(function (k) {
      el.setAttribute(k, attrs[k]);
    });
  }

  function upsertJsonLd(id, payload) {
    var el = document.head.querySelector('script[data-seo-id="' + id + '"]');
    if (!el) {
      el = document.createElement('script');
      el.type = 'application/ld+json';
      el.dataset.seoId = id;
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(payload);
  }

  function updateMetaAndSeo(lang) {
    var root = window.RF_TRANSLATIONS[lang];
    if (!root || !root.meta) return;
    var meta = root.meta;
    if (meta.title) document.title = meta.title;
    if (!meta.description) return;

    var canonicalUrl = SITE_URL;
    try {
      var origin = window.location.origin;
      var pathname = window.location.pathname;
      if (origin && origin !== 'null') canonicalUrl = origin + pathname;
    } catch (e) {
      /* ignore */
    }

    upsertMeta('meta[name="description"]', { name: 'description' }, meta.description);
    upsertMeta('meta[name="robots"]', { name: 'robots' }, 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1');
    upsertMeta('meta[name="author"]', { name: 'author' }, SITE_NAME);
    upsertMeta('meta[name="theme-color"]', { name: 'theme-color' }, '#04110c');
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name' }, SITE_NAME);
    upsertMeta('meta[property="og:type"]', { property: 'og:type' }, 'website');
    upsertMeta('meta[property="og:locale"]', { property: 'og:locale' }, htmlLangAttr(lang).replace('-', '_'));
    upsertMeta('meta[property="og:title"]', { property: 'og:title' }, meta.title);
    upsertMeta('meta[property="og:description"]', { property: 'og:description' }, meta.description);
    upsertMeta('meta[property="og:url"]', { property: 'og:url' }, canonicalUrl);
    upsertMeta('meta[property="og:image"]', { property: 'og:image' }, SOCIAL_IMAGE);
    upsertMeta('meta[property="og:image:alt"]', { property: 'og:image:alt' }, SITE_NAME + ' logo');
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card' }, 'summary_large_image');
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title' }, meta.title);
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description' }, meta.description);
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image' }, SOCIAL_IMAGE);
    upsertLink('link[rel="canonical"]', { rel: 'canonical', href: canonicalUrl });
    upsertJsonLd('site', {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': SITE_URL + '#organization',
          name: SITE_NAME,
          url: SITE_URL,
          logo: SOCIAL_IMAGE,
          email: 'contato@rainforestgames.com.br',
          description: meta.description,
        },
        {
          '@type': 'WebSite',
          '@id': SITE_URL + '#website',
          url: SITE_URL,
          name: SITE_NAME,
          inLanguage: htmlLangAttr(lang),
          description: meta.description,
          publisher: { '@id': SITE_URL + '#organization' },
        },
      ],
    });
  }

  function applyDomStrings() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (key) el.textContent = t(key);
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      if (key) el.innerHTML = t(key);
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      var spec = el.getAttribute('data-i18n-attr');
      if (!spec) return;
      var parts = spec.split('|');
      if (parts.length === 2) {
        var attr = parts[0].trim();
        var key = parts[1].trim();
        if (t(key)) el.setAttribute(attr, t(key));
      }
    });
  }

  function setLang(next) {
    if (next !== 'pt' && next !== 'en' && next !== 'es') return;
    localStorage.setItem(STORAGE_KEY, next);
    currentLang = next;
    document.documentElement.lang = htmlLangAttr(next);
    updateMetaAndSeo(next);
    applyDomStrings();
    window.dispatchEvent(new CustomEvent('rf:langchange', { detail: { lang: next } }));
  }

  function initI18n() {
    rebuildFlatPacks();
    currentLang = getStoredLang() || detectBrowserLang();
    document.documentElement.lang = htmlLangAttr(currentLang);
    updateMetaAndSeo(currentLang);
    applyDomStrings();
  }

  window.RF_I18N = {
    STORAGE_KEY: STORAGE_KEY,
    init: initI18n,
    setLang: setLang,
    getLang: function () {
      return currentLang;
    },
    t: t,
    applyDomStrings: applyDomStrings,
    rebuildFlatPacks: rebuildFlatPacks,
  };
})();
