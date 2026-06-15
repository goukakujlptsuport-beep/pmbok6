/* font-settings.js
 * Global font & display settings for the entire PMLib project.
 * Works in: PMBOK6 reader (parent), Rita chapter pages (standalone),
 *           home.html, dashboard.html.
 *
 * Public API: window.PMFontSettings
 *   .load()                   → {fontId, sizeId, bilingualOff}
 *   .save(s)                  → void
 *   .buildCSS(fontId,sizeId)  → CSS string
 *   .apply(s?, doc?)          → void  — inject/update <style id="pmlib-font-inject">
 *   .update(fontId, sizeId)   → saved settings + fires 'pmlib-font-change' event
 *   .buildPanel(anchor, opts) → builds Aa panel near anchor element
 *   .FONTS / .SIZES           → option arrays
 */
(function (global) {
  'use strict';

  var LS_KEY       = 'pmlib_font_v1';
  var CHANGE_EVENT = 'pmlib-font-change';

  var FONTS = [
    { id: 'merriweather', label: 'Merriweather',  css: "'Merriweather', Georgia, serif" },
    { id: 'sourcesans',   label: 'Source Sans 3', css: "'Source Sans 3', Arial, sans-serif" },
    { id: 'georgia',      label: 'Georgia',       css: "Georgia, 'Times New Roman', serif" },
    { id: 'arial',        label: 'Arial',         css: "Arial, Helvetica, sans-serif" },
    { id: 'verdana',      label: 'Verdana',       css: "Verdana, Geneva, sans-serif" },
    { id: 'tahoma',       label: 'Tahoma',        css: "Tahoma, Geneva, sans-serif" },
  ];

  var SIZES = [
    { id: 'xs', label: 'XS', scale: 0.82 },
    { id: 'sm', label: 'S',  scale: 0.91 },
    { id: 'md', label: 'M',  scale: 1.00 },
    { id: 'lg', label: 'L',  scale: 1.12 },
    { id: 'xl', label: 'XL', scale: 1.25 },
  ];

  // ── helpers ──────────────────────────────────────────────────────────────────
  function load() {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); }
    catch (e) { return {}; }
  }

  function save(s) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(s)); } catch (e) {}
  }

  function getStyleEl(doc) {
    doc = doc || document;
    var el = doc.getElementById('pmlib-font-inject');
    if (!el) {
      el = doc.createElement('style');
      el.id = 'pmlib-font-inject';
      (doc.head || doc.body).appendChild(el);
    }
    return el;
  }

  function buildCSS(fontId, sizeId) {
    var font = null, size = null;
    FONTS.forEach(function (f) { if (f.id === fontId) font = f; });
    SIZES.forEach(function (z) { if (z.id === sizeId) size = z; });
    font = font || FONTS[0];
    size = size || SIZES[2];
    var ff = font.css;
    var sc = size.scale;
    return [
      /* chapter body text */
      '#main p,#main li,#main td,#main blockquote{font-family:' + ff + '!important;font-size:calc(0.94rem*' + sc + ')!important;}',
      '#main h2,#main h3,#main h4,#main h5{font-family:' + ff + '!important;}',
      '#main ul.content-list li,#main ol.content-list li{font-family:' + ff + '!important;font-size:calc(0.92rem*' + sc + ')!important;}',
      '.chapter-hero h1,.chapter-hero h2{font-family:' + ff + '!important;}',
      /* callouts / tables */
      '.callout p,.callout li{font-family:' + ff + '!important;font-size:calc(0.90rem*' + sc + ')!important;}',
      'table td,table th{font-family:' + ff + '!important;}',
    ].join('\n');
  }

  function apply(s, doc) {
    var settings = s || load();
    if (!settings.fontId && !settings.sizeId) return;
    getStyleEl(doc).textContent = buildCSS(settings.fontId, settings.sizeId);
  }

  function update(fontId, sizeId) {
    var s = load();
    if (fontId !== undefined) s.fontId = fontId;
    if (sizeId !== undefined) s.sizeId = sizeId;
    save(s);
    apply(s, document);
    try {
      global.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: s }));
    } catch (e) {
      var ev = document.createEvent('CustomEvent');
      ev.initCustomEvent(CHANGE_EVENT, true, false, s);
      global.dispatchEvent(ev);
    }
    return s;
  }

  // ── panel builder ─────────────────────────────────────────────────────────────
  // opts: { side: 'left'|'right'|'bottom', dark: bool }
  function buildPanel(anchorEl, opts) {
    opts = opts || {};
    var panelId = 'pmlib-font-panel';
    var existing = document.getElementById(panelId);
    if (existing) { existing.remove(); }

    var s = load();
    var curFont = s.fontId || 'merriweather';
    var curSize = s.sizeId || 'md';

    var isDark = document.documentElement.getAttribute('data-theme') === 'dark' || opts.dark;
    var bg  = isDark ? '#1a2436' : '#fff';
    var txt = isDark ? '#dde4f0' : '#2c2c2c';
    var sub = isDark ? '#8ca3cc' : '#666';

    var panel = document.createElement('div');
    panel.id = panelId;
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Cài đặt font chữ');

    /* ── Position ─────────────────────────────────────────────── */
    var rect = anchorEl.getBoundingClientRect();
    var side = opts.side || 'bottom';
    var panelH = 340; // estimated panel height
    var panelW = 272;
    var vw = global.innerWidth, vh = global.innerHeight;
    var posStyle = 'position:fixed;z-index:9500;width:' + panelW + 'px;';
    if (side === 'bottom') {
      var leftPos = Math.max(4, Math.min(rect.left, vw - panelW - 4));
      if (rect.bottom + 6 + panelH <= vh) {
        posStyle += 'top:' + (rect.bottom + 6) + 'px;left:' + leftPos + 'px;';
      } else {
        posStyle += 'bottom:' + (vh - rect.top + 6) + 'px;left:' + leftPos + 'px;';
      }
    } else if (side === 'left') {
      var topPos = Math.min(rect.top, vh - panelH - 4);
      posStyle += 'top:' + Math.max(4, topPos) + 'px;right:' + (vw - rect.left + 6) + 'px;';
    } else {
      var topPos2 = Math.min(rect.top, vh - panelH - 4);
      posStyle += 'top:' + Math.max(4, topPos2) + 'px;left:' + (rect.right + 6) + 'px;';
    }

    panel.style.cssText = posStyle +
      'background:' + bg + ';' +
      'border:2px solid var(--gold,#c9a84c);border-radius:10px;' +
      'padding:1rem;box-shadow:0 8px 32px rgba(0,0,0,.25);';

    /* ── Header ───────────────────────────────────────────────── */
    var hdr = document.createElement('div');
    hdr.style.cssText = "font-family:'Source Sans 3',sans-serif;font-size:.68rem;font-weight:700;" +
      'letter-spacing:.12em;text-transform:uppercase;color:var(--gold,#c9a84c);' +
      'margin-bottom:.75rem;padding-bottom:.4rem;border-bottom:1px solid rgba(201,168,76,.25);' +
      'display:flex;align-items:center;justify-content:space-between;';
    hdr.innerHTML = '<span>Font Chữ / Display</span>';

    var closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&#x2715;';
    closeBtn.style.cssText = 'background:none;border:none;cursor:pointer;font-size:.9rem;' +
      'color:' + sub + ';padding:.1rem .25rem;border-radius:3px;line-height:1;';
    closeBtn.onclick = function () { panel.remove(); };
    hdr.appendChild(closeBtn);
    panel.appendChild(hdr);

    /* ── Font Family ──────────────────────────────────────────── */
    var ffLabel = document.createElement('div');
    ffLabel.style.cssText = "font-family:'Source Sans 3',sans-serif;font-size:.62rem;font-weight:600;" +
      'color:' + sub + ';text-transform:uppercase;letter-spacing:.08em;margin-bottom:.35rem;';
    ffLabel.textContent = 'Kiểu chữ (Font Family)';
    panel.appendChild(ffLabel);

    var fontList = document.createElement('div');
    fontList.id = 'pmlib-font-list';
    fontList.style.cssText = 'display:flex;flex-direction:column;gap:.25rem;margin-bottom:.7rem;';
    panel.appendChild(fontList);

    FONTS.forEach(function (f) {
      var row = document.createElement('button');
      row.dataset.fid = f.id;
      var active = f.id === curFont;
      row.style.cssText =
        'display:flex;align-items:center;gap:.5rem;padding:.3rem .55rem;border-radius:5px;' +
        'cursor:pointer;text-align:left;width:100%;transition:all .15s;' +
        'border:1px solid ' + (active ? 'var(--gold,#c9a84c)' : 'rgba(201,168,76,.22)') + ';' +
        'background:' + (active ? 'rgba(201,168,76,.12)' : 'transparent') + ';';
      row.innerHTML =
        '<span style="font-family:' + f.css + ';font-size:.95rem;min-width:20px;color:' + txt + '">Aa</span>' +
        '<span style="font-family:\'Source Sans 3\',sans-serif;font-size:.76rem;color:' + txt + '">' + f.label + '</span>';
      row.addEventListener('click', function () {
        update(f.id, undefined);
        fontList.querySelectorAll('button').forEach(function (b) {
          var a = b.dataset.fid === f.id;
          b.style.borderColor = a ? 'var(--gold,#c9a84c)' : 'rgba(201,168,76,.22)';
          b.style.background  = a ? 'rgba(201,168,76,.12)' : 'transparent';
        });
      });
      fontList.appendChild(row);
    });

    /* ── Font Size ────────────────────────────────────────────── */
    var fsLabel = document.createElement('div');
    fsLabel.style.cssText = ffLabel.style.cssText + 'margin-bottom:.35rem;';
    fsLabel.textContent = 'Cỡ chữ (Font Size)';
    panel.appendChild(fsLabel);

    var sizeRow = document.createElement('div');
    sizeRow.id = 'pmlib-size-row';
    sizeRow.style.cssText = 'display:flex;gap:.3rem;margin-bottom:.65rem;';
    panel.appendChild(sizeRow);

    SIZES.forEach(function (z) {
      var b = document.createElement('button');
      b.dataset.sid = z.id;
      var active = z.id === curSize;
      b.style.cssText =
        'flex:1;padding:.28rem .1rem;border-radius:5px;cursor:pointer;text-align:center;' +
        "font-family:'Source Sans 3',sans-serif;font-size:.78rem;font-weight:700;" +
        'transition:all .15s;' +
        'border:1px solid ' + (active ? 'var(--gold,#c9a84c)' : 'rgba(201,168,76,.22)') + ';' +
        'background:' + (active ? 'rgba(201,168,76,.12)' : 'transparent') + ';' +
        'color:' + (active ? 'var(--gold,#c9a84c)' : sub) + ';';
      b.textContent = z.label;
      b.addEventListener('click', function () {
        update(undefined, z.id);
        sizeRow.querySelectorAll('button').forEach(function (b2) {
          var a = b2.dataset.sid === z.id;
          b2.style.borderColor = a ? 'var(--gold,#c9a84c)' : 'rgba(201,168,76,.22)';
          b2.style.background  = a ? 'rgba(201,168,76,.12)' : 'transparent';
          b2.style.color       = a ? 'var(--gold,#c9a84c)' : sub;
        });
      });
      sizeRow.appendChild(b);
    });

    /* ── Footer note ─────────────────────────────────────────── */
    var foot = document.createElement('div');
    foot.style.cssText = "font-size:.62rem;color:" + sub + ";text-align:center;" +
      "font-family:'Source Sans 3',sans-serif;border-top:1px solid rgba(201,168,76,.2);" +
      'padding-top:.5rem;font-style:italic;';
    foot.textContent = 'Áp dụng cho toàn bộ thư viện · Lưu tự động';
    panel.appendChild(foot);

    document.body.appendChild(panel);

    /* ── Auto-close on outside click ─────────────────────────── */
    function outsideClick(e) {
      if (!panel.contains(e.target) && e.target !== anchorEl) {
        panel.remove();
        document.removeEventListener('click', outsideClick, true);
      }
    }
    setTimeout(function () {
      document.addEventListener('click', outsideClick, true);
    }, 0);

    /* ── Keep colours in sync with dark-mode toggle ───────────── */
    var mo = new MutationObserver(function () {
      var dark2 = document.documentElement.getAttribute('data-theme') === 'dark';
      panel.style.background = dark2 ? '#1a2436' : '#fff';
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    panel._mo = mo;

    return panel;
  }

  // ── Public API ────────────────────────────────────────────────────────────────
  var PMFontSettings = {
    LS_KEY: LS_KEY,
    CHANGE_EVENT: CHANGE_EVENT,
    FONTS: FONTS,
    SIZES: SIZES,
    load: load,
    save: save,
    buildCSS: buildCSS,
    apply: apply,
    update: update,
    buildPanel: buildPanel,
    getStyleEl: getStyleEl,
  };

  global.PMFontSettings = PMFontSettings;

  // ── Auto-apply saved settings on this page ────────────────────────────────────
  var saved = load();
  if (saved.fontId || saved.sizeId) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () { apply(saved); });
    } else {
      apply(saved);
    }
  }

}(window));
