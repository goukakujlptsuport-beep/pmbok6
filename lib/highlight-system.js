// ── HIGHLIGHT + SERVER SYNC — shared for Rita & PMBOK ───────────────────
// Auto-detects book (rita / pmbok6) and chapter from URL.
// Rita:  /books/PMPExamPrep/rita_chapXX.html
// PMBOK: /books/pmbok6/XX_name.html
(function () {
  'use strict';

  // ── BOOK / CHAPTER DETECTION ─────────────────────────
  var path = location.pathname;
  var book, chap, ALL_CHAPS, READ_KEY;

  var urlParams = new URLSearchParams(location.search);
  var paramBook = urlParams.get('book');
  var paramChap = urlParams.get('chap');

  if (paramBook && paramChap) {
    book = paramBook;
    var match = paramChap.match(/(\d+)/);
    chap = match ? ('0' + parseInt(match[1])).slice(-2) : null;
    if (book === 'rita') {
      ALL_CHAPS = ['01','02','03','04','05','06','07','08','10','11','12','13','14','15','16','17','18'];
      READ_KEY  = 'rita_reading';
    } else if (book === 'pmbok6') {
      ALL_CHAPS = ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16'];
      READ_KEY  = 'pmbok_reading';
    }
  } else if (path.match(/rita_chap(\d+)/)) {
    book = 'rita';
    var rm = path.match(/rita_chap(\d+)/);
    chap = ('0' + parseInt(rm[1])).slice(-2);
    ALL_CHAPS = ['01','02','03','04','05','06','07','08','10','11','12','13','14','15','16','17','18'];
    READ_KEY  = 'rita_reading';
  } else if (path.match(/\/books\/pmbok6\//)) {
    book = 'pmbok6';
    var pm = path.match(/\/(\d+)_[^/]+\.html/);
    chap = pm ? ('0' + parseInt(pm[1])).slice(-2) : null;
    ALL_CHAPS = ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16'];
    READ_KEY  = 'pmbok_reading';
  } else {
    return;
  }

  if (!chap) return;

  var HL_KEY = book + '_hl_' + chap;

  // ── INJECT CSS (once per page) ───────────────────────
  if (!document.getElementById('hl-system-css')) {
    var css = document.createElement('style');
    css.id = 'hl-system-css';
    css.textContent = [
      /* highlights */
      'mark.hl{border-radius:2px;cursor:pointer;padding:1px 0;background:transparent}',
      'mark.hl[data-color=yellow]{background:rgba(255,241,118,.75)}',
      'mark.hl[data-color=green]{background:rgba(165,214,167,.75)}',
      'mark.hl[data-color=red]{background:rgba(239,154,154,.75)}',
      'mark.hl::after{display:none}',
      'mark.hl[data-note]:not([data-note=""])::after{content:"✏";font-size:.6rem;vertical-align:super;margin-left:1px;opacity:.65;display:inline}',
      /* popup */
      '#hl-popup{position:fixed;z-index:9999;background:#1a2744;border:1px solid rgba(201,168,76,.5);border-radius:8px;padding:.45rem .6rem;display:flex;align-items:center;gap:.35rem;box-shadow:0 4px 20px rgba(0,0,0,.4)}',
      '#hl-popup.hidden{display:none!important}',
      '.hl-color-btn{width:24px;height:24px;border-radius:50%;border:2px solid rgba(255,255,255,.25);cursor:pointer;transition:transform .15s,border-color .15s;flex-shrink:0}',
      '.hl-color-btn:hover{transform:scale(1.2);border-color:rgba(255,255,255,.7)}',
      '.hl-color-btn[data-color=yellow]{background:#fff176}',
      '.hl-color-btn[data-color=green]{background:#a5d6a7}',
      '.hl-color-btn[data-color=red]{background:#ef9a9a}',
      '.hl-sep{width:1px;height:20px;background:rgba(255,255,255,.2);margin:0 .1rem}',
      '.hl-note-btn{background:none;border:none;color:rgba(255,255,255,.7);font-size:.9rem;cursor:pointer;padding:.1rem .25rem;border-radius:4px;line-height:1;transition:color .15s}',
      '.hl-note-btn:hover{color:#fff;background:rgba(255,255,255,.1)}',
      '.hl-del-btn{background:none;border:none;color:rgba(239,154,154,.8);font-size:.85rem;cursor:pointer;padding:.1rem .25rem;border-radius:4px;line-height:1;transition:color .15s}',
      '.hl-del-btn:hover{color:#ef9a9a;background:rgba(239,154,154,.12)}',
      /* note modal */
      '#hl-note-modal{position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center}',
      '#hl-note-modal.hidden{display:none!important}',
      '#hl-note-box{background:#fff;border-radius:10px;padding:1.4rem;width:min(420px,90vw);box-shadow:0 8px 32px rgba(0,0,0,.25)}',
      '#hl-note-box h3{font-size:.95rem;color:#1a2744;margin-bottom:.7rem;font-family:\'Merriweather\',serif}',
      '#hl-note-ta{width:100%;border:1px solid #d4c89a;border-radius:6px;padding:.6rem .8rem;font-size:.88rem;font-family:\'Source Sans 3\',sans-serif;resize:vertical;min-height:80px;color:#2c2c2c;outline:none}',
      '#hl-note-ta:focus{border-color:#c9a84c;box-shadow:0 0 0 2px rgba(201,168,76,.25)}',
      '.hl-note-actions{display:flex;justify-content:flex-end;gap:.6rem;margin-top:.8rem}',
      '.hl-note-cancel{background:transparent;border:1px solid #ccc;padding:.4rem .9rem;border-radius:5px;cursor:pointer;font-size:.83rem}',
      '.hl-note-save{background:#1a2744;color:#fff;border:none;padding:.4rem .9rem;border-radius:5px;cursor:pointer;font-size:.83rem}',
      /* panel */
      '#hl-panel{position:fixed;top:0;right:0;bottom:0;width:300px;background:#fff;border-left:3px solid #c9a84c;z-index:500;display:flex;flex-direction:column;box-shadow:-4px 0 20px rgba(0,0,0,.15);transform:translateX(100%);transition:transform .25s}',
      '#hl-panel.open{transform:translateX(0)}',
      '#hl-panel-hdr{background:#1a2744;padding:1rem 1.2rem;display:flex;align-items:center;justify-content:space-between;border-bottom:2px solid #c9a84c}',
      '#hl-panel-hdr h3{font-size:.88rem;color:#fff;font-family:\'Source Sans 3\',sans-serif;font-weight:700;letter-spacing:.05em}',
      '#hl-panel-close{background:none;border:none;color:rgba(255,255,255,.7);font-size:1.2rem;cursor:pointer;padding:.2rem;line-height:1}',
      '#hl-panel-close:hover{color:#fff}',
      '#hl-panel-list{flex:1;overflow-y:auto;padding:.6rem}',
      '#hl-panel-list:empty::before{content:"Chưa có highlight nào.";font-size:.82rem;color:#999;display:block;padding:.8rem;text-align:center;font-style:italic}',
      /* filter bar */
      '#hl-filter-bar{display:flex;gap:.35rem;padding:.55rem .8rem;border-bottom:1px solid rgba(255,255,255,.07);flex-shrink:0}',
      '.hl-filter-btn{flex:1;border:1px solid rgba(255,255,255,.15);background:transparent;color:#8899bb;font-size:.72rem;font-family:\'Source Sans 3\',sans-serif;font-weight:600;padding:.3rem .4rem;border-radius:5px;cursor:pointer;transition:all .15s;white-space:nowrap}',
      '.hl-filter-btn:hover{border-color:rgba(201,168,76,.5);color:#c9a84c}',
      '.hl-filter-btn.active{color:#1a2744;border-color:transparent}',
      '.hl-filter-btn.active[data-filter=all]{background:#c9a84c}',
      '.hl-filter-btn.active[data-filter=yellow]{background:#fdd835;color:#5a4000}',
      '.hl-filter-btn.active[data-filter=green]{background:#66bb6a;color:#1a3a1a}',
      '.hl-filter-btn.active[data-filter=red]{background:#ef5350;color:#fff}',
      '.hl-item{padding:.65rem .8rem;border-radius:6px;margin-bottom:.5rem;border-left:4px solid #ddd;background:#fafafa;cursor:pointer;transition:background .15s}',
      '.hl-item:hover{background:#f0f0f0}',
      '.hl-item[data-color=yellow]{border-left-color:#fdd835}',
      '.hl-item[data-color=green]{border-left-color:#66bb6a}',
      '.hl-item[data-color=red]{border-left-color:#ef5350}',
      '.hl-item-text{font-size:.8rem;color:#2c2c2c;line-height:1.5;margin-bottom:.3rem;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}',
      '.hl-item-note{font-size:.75rem;color:#666;font-style:italic;margin-bottom:.3rem}',
      '.hl-item-del{float:right;background:none;border:none;color:#bbb;cursor:pointer;font-size:.8rem;padding:.1rem .3rem;border-radius:3px;line-height:1}',
      '.hl-item-del:hover{color:#ef5350;background:rgba(239,83,80,.08)}',
      /* sidebar buttons */
      '#hl-sidebar-btn{display:flex;align-items:center;justify-content:space-between;padding:.5rem 1.2rem;font-family:\'Source Sans 3\',sans-serif;font-size:.75rem;color:#c9a84c;cursor:pointer;border-top:1px solid rgba(255,255,255,.07);transition:background .15s;background:none;border-left:none;border-right:none;border-bottom:none;width:100%;text-align:left}',
      '#hl-sidebar-btn:hover{background:rgba(201,168,76,.1)}',
      '#hl-badge{background:rgba(201,168,76,.2);color:#c9a84c;font-size:.65rem;font-weight:700;padding:.1rem .4rem;border-radius:10px;min-width:18px;text-align:center}',
      '#sync-btn{display:flex;align-items:center;justify-content:space-between;padding:.5rem 1.2rem;font-family:\'Source Sans 3\',sans-serif;font-size:.75rem;color:#8899bb;cursor:pointer;border-top:1px solid rgba(255,255,255,.07);transition:background .15s,color .15s;background:none;border-left:none;border-right:none;border-bottom:none;width:100%;text-align:left}',
      '#sync-btn:hover{background:rgba(201,168,76,.08);color:#c9a84c}',
      '#sync-btn[data-state=ok]{color:#4caf50}',
      '#sync-btn[data-state=syncing]{color:#c9a84c}',
      '#sync-btn[data-state=err]{color:#ef5350}',
      /* dark mode */
      'html[data-theme=dark] #hl-note-box{background:#1a2436;border:1px solid #253048}',
      'html[data-theme=dark] #hl-note-box h3{color:#e8d5a3}',
      'html[data-theme=dark] #hl-note-ta{background:#0f1520;border-color:#253048;color:#dde4f0}',
      'html[data-theme=dark] #hl-panel{background:#131c2b;border-left-color:#c9a84c}',
      'html[data-theme=dark] .hl-item{background:#1a2436;border-bottom:1px solid #1e2d45}',
      'html[data-theme=dark] .hl-item:hover{background:#1e2d45}',
      'html[data-theme=dark] .hl-item-text{color:#dde4f0}',
      'html[data-theme=dark] .hl-item-note{color:#8899bb}',
      'html[data-theme=dark] .hl-note-cancel{border-color:#253048;color:#dde4f0;background:#1a2436}',
      'html[data-theme=dark] .hl-note-save{background:#c9a84c;color:#0a0f1a}',
      /* ── MOBILE ─────────────────────────────────────────── */
      /* bottom bar */
      '#hl-mobile-bar{display:none;position:fixed;bottom:0;left:0;right:0;z-index:600;background:#1a2744;border-top:2px solid #c9a84c;align-items:center;padding:0 8px;gap:5px;height:54px;padding-bottom:env(safe-area-inset-bottom,0)}',
      '@media(max-width:860px){#hl-mobile-bar{display:flex}#main,#pmlib-main{padding-bottom:70px!important}}',
      '#hl-mob-chap{flex:1;background:rgba(255,255,255,.07);border:1px solid rgba(201,168,76,.3);color:#c9a84c;border-radius:8px;height:38px;font-size:.78rem;font-family:\'Source Sans 3\',sans-serif;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:.3rem;white-space:nowrap}',
      '#hl-mob-apply{flex:0;width:42px;background:rgba(255,255,255,.07);border:1px solid rgba(201,168,76,.3);color:#c9a84c;border-radius:8px;height:38px;font-size:1.1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .15s,border-color .2s}',
      '#hl-mob-apply.has-sel{background:rgba(201,168,76,.25);border-color:#c9a84c;box-shadow:0 0 0 2px rgba(201,168,76,.35)}',
      '#hl-mob-apply:active{background:rgba(201,168,76,.35)}',
      '#hl-mob-list{flex:1;background:rgba(201,168,76,.1);border:1px solid rgba(201,168,76,.4);color:#c9a84c;border-radius:8px;height:38px;font-size:.78rem;font-family:\'Source Sans 3\',sans-serif;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:.3rem;white-space:nowrap}',
      '#hl-mob-list-badge{background:rgba(201,168,76,.25);color:#c9a84c;font-size:.65rem;font-weight:700;padding:.1rem .35rem;border-radius:10px;min-width:18px;text-align:center}',
      '#hl-mob-nav{display:flex;gap:4px;flex-shrink:0}',
      '#hl-mob-prev,#hl-mob-next{display:flex;align-items:center;justify-content:center;width:42px;height:38px;background:rgba(255,255,255,.07);border:1px solid rgba(201,168,76,.25);color:#8899bb;border-radius:8px;font-size:1rem;text-decoration:none;cursor:pointer;flex-shrink:0}',
      '#hl-mob-prev:active,#hl-mob-next:active{background:rgba(201,168,76,.15);color:#c9a84c}',
      '#hl-mob-prev.mob-disabled,#hl-mob-next.mob-disabled{opacity:.3;pointer-events:none}',
      /* panel → bottom sheet on mobile */
      '@media(max-width:860px){#hl-panel{top:auto!important;left:0!important;right:0!important;bottom:0!important;width:100%!important;height:75vh!important;border-left:none!important;border-top:3px solid #c9a84c!important;border-radius:16px 16px 0 0;transform:translateY(100%)!important;transition:transform .3s cubic-bezier(.4,0,.2,1)!important;box-shadow:0 -4px 32px rgba(0,0,0,.35)!important}}',
      '@media(max-width:860px){#hl-panel.open{transform:translateY(0)!important}}',
      /* bigger popup buttons on mobile */
      '@media(max-width:860px){.hl-color-btn{width:38px!important;height:38px!important}.hl-note-btn,.hl-del-btn{font-size:1.1rem!important;padding:.4rem .55rem!important}.hl-sep{height:26px!important}}',
      /* backdrop */
      '#hl-backdrop{display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:499;touch-action:none}',
      '@media(max-width:900px){#hl-backdrop.on{display:block}}',
      /* PMBOK sidebar override — force show via mob-sb-open class when no menu-btn exists */
      '@media(max-width:900px){#sidebar.mob-sb-open{display:block!important;position:fixed;top:0;left:0;height:100vh;z-index:600;overflow-y:auto;width:280px;background:#1a2744;padding-bottom:80px;box-shadow:4px 0 24px rgba(0,0,0,.5)}}',
      /* ── PRINT ──────────────────────────────────────────── */
      '@media print{#sidebar,#hl-mobile-bar,#menu-btn,#back-top,#hl-popup,#hl-panel,#hl-note-modal,#hl-backdrop,#print-btn,#theme-btn,#sync-btn,#hl-sidebar-btn,#font-settings-btn{display:none!important}#main,#pmlib-main{margin-left:0!important;padding:1rem 2rem!important;max-width:none!important}body{background:#fff!important}mark.hl[data-color=yellow]{background:rgba(255,241,118,.6)!important}mark.hl[data-color=green]{background:rgba(165,214,167,.6)!important}mark.hl[data-color=red]{background:rgba(239,154,154,.6)!important}}',
      /* print button in sidebar */
      '#print-btn{position:absolute;bottom:.55rem;right:.7rem;background:none;border:none;color:rgba(255,255,255,.45);font-size:1rem;cursor:pointer;padding:.2rem .3rem;border-radius:4px;line-height:1;transition:color .15s}',
      '#print-btn:hover{color:#c9a84c}',
    ].join('\n');
    document.head.appendChild(css);
  }

  // ── HIGHLIGHT / NOTES SYSTEM ─────────────────────────
  (function () {
    var mainEl = document.getElementById('main');
    if (!mainEl) return;

    function loadHL() { try { return JSON.parse(localStorage.getItem(HL_KEY) || '[]'); } catch (e) { return []; } }
    function saveHL(arr) { localStorage.setItem(HL_KEY, JSON.stringify(arr)); if (window.__hlSyncTrigger) window.__hlSyncTrigger(); }
    function genId() { return 'h' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

    // ── XPATH HELPERS ──
    function getXPath(node) {
      if (!node || node === mainEl) return '.';
      var parts = [], cur = node.nodeType === 3 ? node.parentNode : node;
      while (cur && cur !== mainEl && cur !== document.body) {
        var tag = cur.tagName.toLowerCase(), idx = 1, sib = cur.previousElementSibling;
        while (sib) { if (sib.tagName && sib.tagName.toLowerCase() === tag) idx++; sib = sib.previousElementSibling; }
        parts.unshift(tag + '[' + idx + ']');
        cur = cur.parentElement;
      }
      return parts.join('/');
    }
    function resolveXPath(xpath) {
      if (!mainEl || xpath === '.') return mainEl;
      try {
        var r = document.evaluate('.//' + xpath, mainEl, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        return r.singleNodeValue;
      } catch (e) { return null; }
    }
    function findTextAt(el, offset) {
      var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null), count = 0, node;
      while ((node = walker.nextNode())) {
        var len = node.textContent.length;
        if (count + len >= offset) return { node: node, localOffset: offset - count };
        count += len;
      }
      return null;
    }

    // ── APPLY / REMOVE / UPDATE MARKS ──
    function applyMark(hl) {
      try {
        var sEl = resolveXPath(hl.sxp), eEl = resolveXPath(hl.exp);
        if (!sEl || !eEl) return false;
        var sInfo = sEl.nodeType === 3 ? { node: sEl, localOffset: hl.so } : findTextAt(sEl, hl.so);
        var eInfo = eEl.nodeType === 3 ? { node: eEl, localOffset: hl.eo } : findTextAt(eEl, hl.eo);
        if (!sInfo || !eInfo) return false;
        var range = document.createRange();
        range.setStart(sInfo.node, sInfo.localOffset);
        range.setEnd(eInfo.node, eInfo.localOffset);
        applyRange(range, hl.id, hl.color, hl.note || '');
        return true;
      } catch (e) { return false; }
    }
    function applyRange(range, hlId, color, note) {
      var walker = document.createTreeWalker(
        range.commonAncestorContainer.nodeType === 3 ? range.commonAncestorContainer.parentNode : range.commonAncestorContainer,
        NodeFilter.SHOW_TEXT, null
      );
      var nodes = [], node;
      while ((node = walker.nextNode())) { if (range.intersectsNode(node)) nodes.push(node); }
      nodes.forEach(function (tn) {
        var s = tn === range.startContainer ? range.startOffset : 0;
        var e = tn === range.endContainer ? range.endOffset : tn.textContent.length;
        if (s >= e) return;
        var nr = document.createRange();
        nr.setStart(tn, s); nr.setEnd(tn, Math.min(e, tn.textContent.length));
        try {
          var mk = document.createElement('mark');
          mk.className = 'hl'; mk.setAttribute('data-hl-id', hlId);
          mk.setAttribute('data-color', color); mk.setAttribute('data-note', note);
          nr.surroundContents(mk);
        } catch (err) {
          try {
            var c = nr.extractContents(), mk2 = document.createElement('mark');
            mk2.className = 'hl'; mk2.setAttribute('data-hl-id', hlId);
            mk2.setAttribute('data-color', color); mk2.setAttribute('data-note', note);
            mk2.appendChild(c); nr.insertNode(mk2);
          } catch (_) {}
        }
      });
    }
    function removeMarks(hlId) {
      document.querySelectorAll('mark.hl[data-hl-id="' + hlId + '"]').forEach(function (mk) {
        var p = mk.parentNode; while (mk.firstChild) p.insertBefore(mk.firstChild, mk); p.removeChild(mk); p.normalize();
      });
    }
    function updateMarks(hlId, color, note) {
      document.querySelectorAll('mark.hl[data-hl-id="' + hlId + '"]').forEach(function (mk) {
        mk.setAttribute('data-color', color); mk.setAttribute('data-note', note);
      });
    }

    // ── RESTORE ON LOAD ──
    loadHL().forEach(applyMark);

    // ── EXPOSE RE-APPLY ──
    window.__ritaReapplyMarks = window.__hlReapplyMarks = function () {
      document.querySelectorAll('mark.hl').forEach(function (mk) {
        var p = mk.parentNode; while (mk.firstChild) p.insertBefore(mk.firstChild, mk); p.removeChild(mk); p.normalize();
      });
      loadHL().forEach(applyMark);
      updateBadge();
      renderPanelIfOpen();
    };

    // ── SIDEBAR BUTTON ──
    function updateBadge() {
      var n = loadHL().length;
      var badge = document.getElementById('hl-badge');
      if (badge) badge.textContent = n || '0';
      var mobBadge = document.getElementById('hl-mob-list-badge');
      if (mobBadge) mobBadge.textContent = n || '0';
    }
    var hlBtn = document.createElement('button');
    hlBtn.id = 'hl-sidebar-btn';
    hlBtn.innerHTML = '<span>✏ Ghi chú & Highlight</span><span id="hl-badge">0</span>';
    hlBtn.addEventListener('click', function () { openPanel(); });
    var sidebarNavBottom = document.getElementById('sidebar-nav');
    if (sidebarNavBottom) sidebarNavBottom.parentNode.insertBefore(hlBtn, sidebarNavBottom);
    else { var sb = document.getElementById('sidebar'); if (sb) sb.appendChild(hlBtn); }
    updateBadge();

    // ── PANEL ──
    var activeFilter = 'all';
    var panel = document.createElement('div');
    panel.id = 'hl-panel';
    panel.innerHTML = ''
      + '<div id="hl-panel-hdr"><h3>✏ Ghi Chú & Highlight</h3><button id="hl-panel-close">×</button></div>'
      + '<div id="hl-filter-bar">'
      +   '<button class="hl-filter-btn active" data-filter="all">Tất cả</button>'
      +   '<button class="hl-filter-btn" data-filter="yellow">🟡 Vàng</button>'
      +   '<button class="hl-filter-btn" data-filter="green">🟢 Xanh</button>'
      +   '<button class="hl-filter-btn" data-filter="red">🔴 Đỏ</button>'
      + '</div>'
      + '<div id="hl-panel-list"></div>';
    document.body.appendChild(panel);
    document.getElementById('hl-panel-close').addEventListener('click', closePanel);

    // ── BACKDROP (mobile) ──
    var backdrop = document.createElement('div');
    backdrop.id = 'hl-backdrop';
    document.body.appendChild(backdrop);
    backdrop.addEventListener('click', function () {
      closePanel();
      var sb = document.getElementById('sidebar');
      if (sb) sb.classList.remove('mob-sb-open');
    });

    // ── PRINT BUTTON ──
    (function () {
      var hdr = document.getElementById('sidebar-header');
      if (!hdr) return;
      var btn = document.createElement('button');
      btn.id = 'print-btn';
      btn.title = 'In trang / Xuất PDF';
      btn.textContent = '🖨';
      btn.addEventListener('click', function () { window.print(); });
      hdr.appendChild(btn);
    }());

    // ── THEME TOGGLE (PMBOK only — RITA has its own in inline script) ──
    (function () {
      if (document.getElementById('theme-btn')) return;
      var hdr = document.getElementById('sidebar-header');
      if (!hdr) return;
      var THEME_KEY = 'pmp_theme';
      var btn = document.createElement('button');
      btn.id = 'theme-btn';
      var cur = document.documentElement.getAttribute('data-theme') || localStorage.getItem(THEME_KEY) || 'light';
      document.documentElement.setAttribute('data-theme', cur);
      btn.textContent = cur === 'dark' ? '☀' : '🌙';
      btn.title = 'Giao diện sáng / tối';
      btn.addEventListener('click', function () {
        var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem(THEME_KEY, next);
        btn.textContent = next === 'dark' ? '☀' : '🌙';
      });
      hdr.appendChild(btn);
    }());

    // ── MOBILE BOTTOM BAR ──
    (function () {
      var bar = document.createElement('div');
      bar.id = 'hl-mobile-bar';
      // Resolve prev/next from sidebar-nav anchors
      var prevHref = '', nextHref = '';
      document.querySelectorAll('#sidebar-nav a').forEach(function (a) {
        var t = a.textContent.trim();
        if (/^←/.test(t) || /←\s*Ch/.test(t)) prevHref = a.href;
        if (/→$/.test(t) || /Ch.+→/.test(t)) nextHref = a.href;
      });
      var hlCount = loadHL().length;
      bar.innerHTML =
        '<button id="hl-mob-chap">≡ Chương</button>'
        + '<button id="hl-mob-apply" title="Highlight văn bản đã chọn">✏</button>'
        + '<button id="hl-mob-list">☰ <span id="hl-mob-list-badge">' + hlCount + '</span></button>'
        + '<div id="hl-mob-nav">'
        + '<a id="hl-mob-prev" href="' + (prevHref || '#') + '"' + (prevHref ? '' : ' class="mob-disabled"') + '>←</a>'
        + '<a id="hl-mob-next" href="' + (nextHref || '#') + '"' + (nextHref ? '' : ' class="mob-disabled"') + '>→</a>'
        + '</div>';
      document.body.appendChild(bar);

      document.getElementById('hl-mob-chap').addEventListener('click', function (e) {
        e.stopPropagation();
        var sb = document.getElementById('sidebar');
        var mb = document.getElementById('menu-btn');
        if (mb) {
          sb.classList.toggle('open');
        } else if (sb) {
          var isOpen = sb.classList.toggle('mob-sb-open');
          if (isOpen) backdrop.classList.add('on');
          else backdrop.classList.remove('on');
        }
      });

      document.getElementById('hl-mob-apply').addEventListener('click', function () {
        var ss = savedSel;
        savedSel = null;
        clearTimeout(_savedSelClearTimer);
        document.getElementById('hl-mob-apply').classList.remove('has-sel');
        if (!ss) return; // no saved selection — button stays inactive, nothing to do
        pendingRange = ss.range;
        pendingXP = ss.xp;
        currentHlId = null;
        popup.querySelector('.hl-del-action').style.display = 'none';
        // Position popup centered above bottom bar
        popup.classList.remove('hidden');
        var pw = popup.offsetWidth || 220;
        popup.style.top = 'auto';
        popup.style.bottom = '62px';
        popup.style.left = Math.max(8, Math.round((window.innerWidth - pw) / 2)) + 'px';
      });

      document.getElementById('hl-mob-list').addEventListener('click', function () { openPanel(); });
    }());

    panel.querySelectorAll('.hl-filter-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        activeFilter = btn.getAttribute('data-filter');
        panel.querySelectorAll('.hl-filter-btn').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        renderPanel();
      });
    });

    function openPanel() { renderPanel(); panel.classList.add('open'); backdrop.classList.add('on'); }
    function closePanel() { panel.classList.remove('open'); backdrop.classList.remove('on'); }
    function renderPanel() {
      var list = document.getElementById('hl-panel-list');
      var all = loadHL();
      var hls = activeFilter === 'all' ? all : all.filter(function (h) { return h.color === activeFilter; });
      var counts = { yellow: 0, green: 0, red: 0 };
      all.forEach(function (h) { if (counts[h.color] !== undefined) counts[h.color]++; });
      // Update filter badge counts
      panel.querySelectorAll('.hl-filter-btn').forEach(function (btn) {
        var f = btn.getAttribute('data-filter');
        if (f === 'all') { btn.textContent = 'Tất cả (' + all.length + ')'; }
        else if (f === 'yellow') { btn.textContent = '🟡 Vàng (' + counts.yellow + ')'; }
        else if (f === 'green')  { btn.textContent = '🟢 Xanh (' + counts.green + ')'; }
        else if (f === 'red')    { btn.textContent = '🔴 Đỏ ('  + counts.red + ')'; }
        if (f === activeFilter) btn.classList.add('active'); else btn.classList.remove('active');
      });
      list.innerHTML = '';
      if (!hls.length) { list.innerHTML = ''; return; }
      hls.forEach(function (hl) {
        var item = document.createElement('div');
        item.className = 'hl-item'; item.setAttribute('data-color', hl.color);
        item.innerHTML = '<button class="hl-item-del" data-id="' + hl.id + '">🗑</button>'
          + '<div class="hl-item-text">' + escHtml(hl.text || '') + '</div>'
          + (hl.note ? '<div class="hl-item-note">✏ ' + escHtml(hl.note) + '</div>' : '');
        item.addEventListener('click', function (e) {
          if (e.target.classList.contains('hl-item-del')) return;
          var mk = document.querySelector('mark.hl[data-hl-id="' + hl.id + '"]');
          if (mk) { mk.scrollIntoView({ behavior: 'smooth', block: 'center' }); flashMark(hl.id); }
          closePanel();
        });
        item.querySelector('.hl-item-del').addEventListener('click', function (e) {
          e.stopPropagation(); deleteHL(hl.id); renderPanel();
        });
        list.appendChild(item);
      });
    }
    function renderPanelIfOpen() { if (panel.classList.contains('open')) renderPanel(); }

    // ── POPUP ──
    var popup = document.createElement('div');
    popup.id = 'hl-popup'; popup.className = 'hidden';
    popup.innerHTML =
      '<button class="hl-color-btn" data-color="yellow" title="Vàng"></button>'
      + '<button class="hl-color-btn" data-color="green" title="Xanh"></button>'
      + '<button class="hl-color-btn" data-color="red" title="Đỏ"></button>'
      + '<div class="hl-sep"></div>'
      + '<button class="hl-note-btn" title="Thêm ghi chú">✏</button>'
      + '<button class="hl-del-btn hl-del-action" title="Xóa">🗑</button>';
    document.body.appendChild(popup);

    var currentHlId = null, pendingRange = null, pendingXP = null;
    function positionPopup(rect) {
      // popup is position:fixed — all coords are viewport-relative (no scrollY)
      var pw = popup.offsetWidth || 200, ph = popup.offsetHeight || 40;
      var top = rect.top - ph - 10;
      if (top < 8) top = rect.bottom + 10;
      var left = rect.left + (rect.width - pw) / 2;
      left = Math.max(8, Math.min(left, window.innerWidth - pw - 8));
      popup.style.top = top + 'px'; popup.style.left = left + 'px';
    }
    function showPopup(rect, hlId) {
      currentHlId = hlId || null;
      popup.querySelector('.hl-del-action').style.display = hlId ? '' : 'none';
      popup.classList.remove('hidden');
      positionPopup(rect);
    }
    function hidePopup() { popup.classList.add('hidden'); popup.style.bottom = ''; popup.style.top = ''; pendingRange = null; pendingXP = null; currentHlId = null; }

    popup.querySelectorAll('.hl-color-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var color = btn.getAttribute('data-color');
        if (currentHlId) {
          var hls = loadHL(), idx = hls.findIndex(function (h) { return h.id === currentHlId; });
          if (idx >= 0) { hls[idx].color = color; saveHL(hls); }
          updateMarks(currentHlId, color, hls[idx] ? hls[idx].note || '' : '');
          updateBadge(); renderPanelIfOpen();
        } else if (pendingRange && pendingXP) {
          var id = genId(), text = pendingRange.toString().substring(0, 500);
          applyRange(pendingRange, id, color, '');
          pendingRange.collapse();
          window.getSelection() && window.getSelection().removeAllRanges();
          var hls2 = loadHL();
          var newHl = { id: id, color: color, note: '', text: text, sxp: pendingXP.sxp, so: pendingXP.so, exp: pendingXP.exp, eo: pendingXP.eo };
          hls2.push(newHl);
          saveHL(hls2); updateBadge(); renderPanelIfOpen();
          // Push to server immediately so other browsers get it on next poll
          if (window.__hlPushOne) window.__hlPushOne(newHl);
        }
        hidePopup();
      });
    });

    popup.querySelector('.hl-note-btn').addEventListener('click', function () {
      var id = currentHlId, existing = '';
      if (id) { var hls = loadHL(); var h = hls.find(function (x) { return x.id === id; }); if (h) existing = h.note || ''; }
      hidePopup(); openNoteModal(id, existing);
    });
    popup.querySelector('.hl-del-action').addEventListener('click', function () {
      if (currentHlId) deleteHL(currentHlId);
      hidePopup();
    });

    // ── NOTE MODAL ──
    var noteModal = document.createElement('div');
    noteModal.id = 'hl-note-modal'; noteModal.className = 'hidden';
    noteModal.innerHTML = '<div id="hl-note-box">'
      + '<h3>✏ Ghi chú</h3>'
      + '<textarea id="hl-note-ta" placeholder="Nhập ghi chú..."></textarea>'
      + '<div class="hl-note-actions">'
      + '<button class="hl-note-cancel">Hủy</button>'
      + '<button class="hl-note-save">Lưu</button>'
      + '</div></div>';
    document.body.appendChild(noteModal);
    var _noteTargetId = null;
    function openNoteModal(hlId, existing) {
      _noteTargetId = hlId;
      document.getElementById('hl-note-ta').value = existing || '';
      noteModal.classList.remove('hidden');
      setTimeout(function () { document.getElementById('hl-note-ta').focus(); }, 50);
    }
    noteModal.querySelector('.hl-note-cancel').addEventListener('click', function () { noteModal.classList.add('hidden'); });
    noteModal.querySelector('.hl-note-save').addEventListener('click', function () {
      var note = document.getElementById('hl-note-ta').value.trim();
      if (_noteTargetId) {
        var hls = loadHL(), idx = hls.findIndex(function (h) { return h.id === _noteTargetId; });
        if (idx >= 0) { hls[idx].note = note; saveHL(hls); updateMarks(_noteTargetId, hls[idx].color, note); updateBadge(); renderPanelIfOpen(); }
      }
      noteModal.classList.add('hidden');
    });
    noteModal.addEventListener('click', function (e) { if (e.target === noteModal) noteModal.classList.add('hidden'); });

    // ── DELETE ──
    function deleteHL(id) {
      removeMarks(id);
      var hls = loadHL().filter(function (h) { return h.id !== id; });
      saveHL(hls);
      fetch('/api/highlights/' + id, { method: 'DELETE' }).catch(function () {});
      updateBadge(); renderPanelIfOpen();
    }

    // ── SELECTION HANDLER ──
    function processSelForPopup() {
      if (!popup.classList.contains('hidden')) return;
      var sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.rangeCount) { hidePopup(); return; }
      var range = sel.getRangeAt(0), text = range.toString().trim();
      if (!text || text.length < 2) { hidePopup(); return; }
      if (!mainEl || !mainEl.contains(range.commonAncestorContainer)) { hidePopup(); return; }
      var sNode = range.startContainer, eNode = range.endContainer;
      var sParent = sNode.nodeType === 3 ? sNode.parentNode : sNode;
      var eParent = eNode.nodeType === 3 ? eNode.parentNode : eNode;
      var sxp = getXPath(sParent), exp = getXPath(eParent);
      var so = 0, eo = 0;
      var w = document.createTreeWalker(sParent, NodeFilter.SHOW_TEXT, null), n;
      while ((n = w.nextNode())) { if (n === sNode) { so += range.startOffset; break; } so += n.textContent.length; }
      var w2 = document.createTreeWalker(eParent, NodeFilter.SHOW_TEXT, null);
      while ((n = w2.nextNode())) { if (n === eNode) { eo += range.endOffset; break; } eo += n.textContent.length; }
      pendingRange = range.cloneRange(); pendingXP = { sxp: sxp, so: so, exp: exp, eo: eo };
      currentHlId = null;
      var rect = range.getBoundingClientRect();
      showPopup(rect);
    }

    // Desktop: mousedown hides popup so new selection can re-trigger it
    document.addEventListener('mousedown', function (e) {
      if (popup.contains(e.target) || noteModal.contains(e.target) || panel.contains(e.target)) return;
      hidePopup();
    });

    // Desktop: mouseup
    document.addEventListener('mouseup', function (e) {
      if (popup.contains(e.target) || noteModal.contains(e.target) || panel.contains(e.target)) return;
      setTimeout(processSelForPopup, 10);
    });

    // Save selection state on every change — used by the ✏ apply button on mobile.
    // We delay clearing so iOS tap-on-button doesn't wipe savedSel before click fires.
    var savedSel = null, _savedSelClearTimer = null;
    document.addEventListener('selectionchange', function () {
      var sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.rangeCount) {
        clearTimeout(_savedSelClearTimer);
        _savedSelClearTimer = setTimeout(function () {
          savedSel = null;
          var applyBtn = document.getElementById('hl-mob-apply');
          if (applyBtn) applyBtn.classList.remove('has-sel');
        }, 400);
        return;
      }
      clearTimeout(_savedSelClearTimer);
      var range = sel.getRangeAt(0);
      var text = range.toString().trim();
      if (!text || text.length < 2) return;
      if (!mainEl || !mainEl.contains(range.commonAncestorContainer)) return;
      var sNode = range.startContainer, eNode = range.endContainer;
      var sParent = sNode.nodeType === 3 ? sNode.parentNode : sNode;
      var eParent = eNode.nodeType === 3 ? eNode.parentNode : eNode;
      var sxp = getXPath(sParent), exp = getXPath(eParent);
      var so = 0, eo = 0;
      var w = document.createTreeWalker(sParent, NodeFilter.SHOW_TEXT, null), n;
      while ((n = w.nextNode())) { if (n === sNode) { so += range.startOffset; break; } so += n.textContent.length; }
      var w2 = document.createTreeWalker(eParent, NodeFilter.SHOW_TEXT, null);
      while ((n = w2.nextNode())) { if (n === eNode) { eo += range.endOffset; break; } eo += n.textContent.length; }
      savedSel = { range: range.cloneRange(), xp: { sxp: sxp, so: so, exp: exp, eo: eo } };
      var applyBtn = document.getElementById('hl-mob-apply');
      if (applyBtn) applyBtn.classList.add('has-sel');
    });

    document.addEventListener('click', function (e) {
      if (popup.contains(e.target) || noteModal.contains(e.target) || panel.contains(e.target)) return;
      var mk = e.target.closest('mark.hl');
      if (!mk) { var sel = window.getSelection(); if (!sel || sel.isCollapsed) hidePopup(); return; }
      e.stopPropagation();
      var hlId = mk.getAttribute('data-hl-id');
      var rect = mk.getBoundingClientRect();
      currentHlId = hlId; pendingRange = null; pendingXP = null;
      showPopup(rect, hlId);
    });

    function flashMark(hlId) {
      document.querySelectorAll('mark.hl[data-hl-id="' + hlId + '"]').forEach(function (mk) {
        mk.style.transition = 'outline .2s'; mk.style.outline = '3px solid #c9a84c';
        setTimeout(function () { mk.style.outline = 'none'; }, 1500);
      });
    }
    function escHtml(s) {
      return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
  })();

  // ── SERVER SYNC v4 ────────────────────────────────────
  (function () {
    var API_HL   = '/api/highlights';
    var API_PROG = '/api/progress';
    var hlPushTimer = null, pushing = false;

    // Track IDs created locally that haven't been server-confirmed yet.
    // These are kept during merge even if server doesn't have them.
    var localOnly = new Set();

    // ── SYNC STATUS BUTTON ──
    var btn = document.createElement('button');
    btn.id = 'sync-btn'; btn.dataset.state = 'syncing';
    btn.innerHTML = '<span>☁ Sync</span><span id="sync-status-text">Đang kết nối…</span>';
    btn.title = 'Đồng bộ highlight & vị trí đọc — nhấn để sync ngay';
    btn.addEventListener('click', function () { initSync(); });
    var sidebarNavEl = document.getElementById('sidebar-nav');
    if (sidebarNavEl) sidebarNavEl.parentNode.insertBefore(btn, sidebarNavEl);
    else { var sb2 = document.getElementById('sidebar'); if (sb2) sb2.appendChild(btn); }
    var statusText = document.getElementById('sync-status-text');
    function setStatus(state, msg) { btn.dataset.state = state; if (statusText) statusText.textContent = msg; }

    // ── STORAGE HELPERS ──
    function getLocal(c) { try { return JSON.parse(localStorage.getItem(book + '_hl_' + c) || '[]'); } catch (e) { return []; } }
    function getAllLocal() {
      var all = {};
      ALL_CHAPS.forEach(function (n) { var v = getLocal(n); if (v.length) all[n] = v; });
      return all;
    }

    // ── PUSH ONE HIGHLIGHT IMMEDIATELY ──
    // Called right after creating a new highlight so other browsers get it fast.
    function pushOneHL(hl) {
      localOnly.add(hl.id);
      fetch(API_HL, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: hl.id, book: book, chap: chap, color: hl.color,
          note: hl.note || null, text: hl.text || null, sxp: hl.sxp, so: hl.so, exp: hl.exp, eo: hl.eo })
      }).then(function (r) { if (r.ok) localOnly.delete(hl.id); }).catch(function () {});
    }
    window.__hlPushOne = pushOneHL;

    // ── PUSH ALL TO SERVER (for color/note updates) ──
    window.__hlSyncTrigger = window.__ritaSyncTrigger = function () {
      clearTimeout(hlPushTimer);
      hlPushTimer = setTimeout(pushAll, 1500);
    };

    async function pushAll() {
      if (pushing) return;
      pushing = true; setStatus('syncing', '⟳ Đang sync…');
      var all = getAllLocal(), ok = 0, fail = 0;
      for (var c of Object.keys(all)) {
        for (var hl of all[c]) {
          try {
            var r = await fetch(API_HL, {
              method: 'PUT', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: hl.id, book: book, chap: c, color: hl.color,
                note: hl.note || null, text: hl.text || null, sxp: hl.sxp, so: hl.so, exp: hl.exp, eo: hl.eo })
            });
            if (r.ok) ok++; else fail++;
          } catch (e) { fail++; }
        }
      }
      setStatus(fail > 0 ? 'err' : 'ok', fail > 0 ? ('✗ ' + fail + ' lỗi / ' + ok + ' OK') : ('✓ Đã sync (' + ok + ' HL)'));
      pushing = false;
    }

    // ── SCROLL POSITION → SERVER ──
    var scrollSaveTimer;
    window.addEventListener('scroll', function () {
      clearTimeout(scrollSaveTimer);
      scrollSaveTimer = setTimeout(function () {
        var dH = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        var pct = dH > 0 ? Math.round(window.scrollY / dH * 100) : 0;
        fetch(API_PROG, { method: 'PUT', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ book: book, chap: chap, scrollPct: pct }) }).catch(function () {});
      }, 2000);
    }, { passive: true });

    // ── MERGE remote + local ──
    // Server is always source of truth. Local items are only kept if they are
    // still pending server confirmation (in localOnly). This ensures deletions
    // made in another browser propagate correctly on the next poll.
    function mergeAndApply(remote, local) {
      var byId = {};
      remote.forEach(function (h) {
        byId[h.id] = { id: h.id, color: h.color, note: h.note || '', text: h.hlText || '',
                       sxp: h.sxp, so: h.so, exp: h.exp, eo: h.eo };
      });
      // Only keep local-only items that haven't been confirmed by server yet
      local.forEach(function (h) { if (localOnly.has(h.id)) byId[h.id] = h; });
      var merged = Object.values(byId);
      var mergedStr = JSON.stringify(merged);
      if (mergedStr !== JSON.stringify(local)) {
        localStorage.setItem(HL_KEY, mergedStr);
        var reapply = window.__hlReapplyMarks || window.__ritaReapplyMarks;
        if (typeof reapply === 'function') reapply();
      }
      return merged;
    }

    async function fetchAndMerge() {
      var hResp = await fetch(API_HL + '?book=' + book + '&chap=' + chap);
      if (!hResp.ok) throw new Error('HTTP ' + hResp.status);
      var hData = await hResp.json();
      return mergeAndApply(hData.highlights || [], getLocal(chap));
    }

    // ── FULL INIT ──
    async function initSync() {
      setStatus('syncing', '⟳ Đang tải…');
      try {
        // Push local highlights to server first (migration from pre-server era).
        // Await all pushes so server is fully up-to-date before we fetch.
        var local = getLocal(chap);
        if (local.length > 0) {
          await Promise.all(local.map(function (hl) {
            if (localOnly.has(hl.id)) return Promise.resolve();
            localOnly.add(hl.id);
            return fetch(API_HL, { method: 'PUT', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: hl.id, book: book, chap: chap, color: hl.color,
                note: hl.note || null, text: hl.text || null, sxp: hl.sxp, so: hl.so, exp: hl.exp, eo: hl.eo })
            }).then(function (r) { if (r.ok) localOnly.delete(hl.id); }).catch(function () {});
          }));
        }

        // Fetch authoritative data from server
        var merged = await fetchAndMerge();
        setStatus('ok', '✓ Sync OK (' + merged.length + ' HL)');

        // Always restore scroll from server (cross-browser sync)
        var pResp = await fetch(API_PROG + '?book=' + book);
        if (pResp.ok) {
          var pData = await pResp.json();
          var chapP = (pData.progress || []).find(function (p) { return p.chap === chap; });
          if (chapP && chapP.scrollPct > 0 && window.scrollY < 50) {
            var docH = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            var target = Math.round(chapP.scrollPct / 100 * docH);
            if (target > 200) window.scrollTo(0, target);
          }
        }
      } catch (e) {
        setStatus('err', '✗ ' + e.message.slice(0, 28));
        console.warn('[sync]', e);
      }
    }

    // ── POLLING every 30s ──
    setInterval(function () {
      if (document.visibilityState !== 'hidden') {
        fetchAndMerge().then(function (merged) {
          setStatus('ok', '✓ Sync OK (' + merged.length + ' HL)');
        }).catch(function () {});
      }
    }, 30000);

    initSync();
  })();

})();
