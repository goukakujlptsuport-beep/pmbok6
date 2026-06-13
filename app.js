/* PMBOK6 app — iframe architecture */

const CHAPTERS = (window.PMLibConfig ? window.PMLibConfig.getChapters('pmbok6') : []);
const TRANSLATED_IDS = new Set(CHAPTERS.map(ch => ch.id));

// ── STATE ──
let state = {
  progress:    {},  // { chapterId: { status, scrollPos } }
  highlights:  {},  // { chapterId: [{ id, xpath, startOffset, endOffset, color, note }] }
  lastChapter: CHAPTERS[0].id,
};
let currentChapterId  = null;
let saveTimer         = null;
let pendingHighlight  = null;  // { xpath, startOffset, endOffset } from iframe
let activeHighlightId   = null;   // hlId of mark being edited
let hlPanelTab          = 'chapter'; // 'chapter' | 'all'
let hlPanelFilter       = 'all';     // 'all' | 'yellow' | 'green' | 'red'
let pendingScrollHlId   = null;      // scroll to this highlight after chapter loads

const LS_KEY      = 'pmbok6_progress';

// ── HELPERS ──
function getProgress(id) {
  return state.progress[id] || { status: 'unread', scrollPos: 0 };
}

function statusIcon(id) {
  if (!TRANSLATED_IDS.has(id)) return '⚠';
  const s = getProgress(id).status;
  if (s === 'done')    return '✓';
  if (s === 'reading') return '●';
  return '○';
}

// ── SIDEBAR ──
function renderSidebar() {
  const nav = document.getElementById('chapter-nav');
  nav.innerHTML = '';
  let done = 0;
  CHAPTERS.forEach(ch => {
    const prog = getProgress(ch.id);
    if (prog.status === 'done') done++;
    const a = document.createElement('a');
    a.href = '#';
    a.dataset.id = ch.id;
    a.className = [
      'status-' + prog.status,
      !TRANSLATED_IDS.has(ch.id) ? 'status-placeholder' : '',
    ].join(' ').trim();
    a.innerHTML = `<span class="ch-icon">${statusIcon(ch.id)}</span><span class="ch-text">${ch.num}. ${ch.title}</span>`;
    a.addEventListener('click', e => {
      e.preventDefault();
      if (!TRANSLATED_IDS.has(ch.id)) return;
      loadChapter(ch.id);
      closeSidebar();
    });
    nav.appendChild(a);
  });
  document.getElementById('progress-count').textContent = done;
  document.getElementById('progress-fill').style.width =
    (done / CHAPTERS.length * 100).toFixed(1) + '%';
}

function openSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebar-overlay').classList.add('open');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('open');
}
document.getElementById('btn-hamburger').addEventListener('click', openSidebar);
document.getElementById('sidebar-close').addEventListener('click', closeSidebar);
document.getElementById('sidebar-overlay').addEventListener('click', closeSidebar);

// ── SYNC INDICATOR ──
function setSyncIndicator(s) {
  const el = document.getElementById('sync-indicator');
  if (s === 'saved')  { el.className = 'sync-saved';  el.textContent = '☁ Đã lưu'; }
  if (s === 'saving') { el.className = 'sync-saving'; el.textContent = '⟳ Đang lưu...'; }
  if (s === 'error')  { el.className = 'sync-error';  el.textContent = '⚠ Lỗi sync'; }
}
document.getElementById('sync-indicator').addEventListener('click', () => {
  if (document.getElementById('sync-indicator').classList.contains('sync-error')) scheduleSave();
});

// ── SAVE / LOAD ──
function scheduleSave() {
  clearTimeout(saveTimer);
  setSyncIndicator('saving');
  saveTimer = setTimeout(() => saveData(), 2000);
}

function loadFromLocalStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) Object.assign(state, JSON.parse(raw));
  } catch (_) {}
}

async function saveData() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
    setSyncIndicator('saved');
  } catch (_) {
    setSyncIndicator('error');
  }
}

// ── IFRAME BRIDGE SCRIPT ──
// Injected into each chapter iframe after load.
const BRIDGE_SCRIPT = `
(function() {
  if (window.__pmbok_bridge) return;
  window.__pmbok_bridge = true;

  const ORIGIN = window.parent.location.origin;

  // Hide chapter's own sidebar and fix main layout for reading
  document.querySelector('#sidebar')?.remove();
  const mainEl = document.querySelector('#main');
  if (mainEl) {
    // Switch body out of flex so margin:auto centering works
    document.body.style.display = 'block';
    // Center the reading column
    mainEl.style.marginLeft  = 'auto';
    mainEl.style.marginRight = 'auto';
    mainEl.style.maxWidth    = '780px';
    mainEl.style.width       = '100%';
    mainEl.style.padding     = '0 2.5rem 5rem';
    mainEl.style.boxSizing   = 'border-box';
  }

  // ── SCROLL TRACKING ──
  let scrollTimer;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      window.parent.postMessage({ type: 'scroll', pos: window.scrollY }, ORIGIN);
    }, 300);
  }, { passive: true });

  // ── XPATH UTILS ──
  function getXPath(node) {
    if (node.nodeType === 3) node = node.parentNode;
    const parts = [];
    while (node && node !== document.body) {
      let idx = 1, sib = node.previousSibling;
      while (sib) { if (sib.nodeName === node.nodeName) idx++; sib = sib.previousSibling; }
      parts.unshift(node.nodeName.toLowerCase() + '[' + idx + ']');
      node = node.parentNode;
    }
    return parts.join('/');
  }

  function resolveXPath(xpath) {
    try {
      return document.evaluate(xpath, document.body, null,
        XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    } catch (_) { return null; }
  }

  function findTextNodeAt(root, offset) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let pos = 0, node = walker.nextNode();
    while (node) {
      const len = node.textContent.length;
      if (pos + len > offset) return { node, localOffset: offset - pos };
      pos += len; node = walker.nextNode();
    }
    return null;
  }

  // ── HIGHLIGHT + READING STYLES ──
  const style = document.createElement('style');
  style.textContent =
    /* font smoothing & scroll */
    'html{scroll-behavior:smooth;}' +
    'body{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;}' +
    /* chapter hero: full-bleed within the 780px centered column */
    '.chapter-hero{margin-left:-2.5rem;margin-right:-2.5rem;padding-left:3rem;padding-right:3rem;}' +
    /* better paragraph spacing */
    'p{line-height:1.9;letter-spacing:0.01em;}' +
    /* term badges */
    '.term{background:rgba(201,168,76,0.1);padding:0 0.2em;border-radius:3px;}' +
    /* highlight marks */
    'mark.hl{border-radius:2px;cursor:pointer;padding:1px 0;}' +
    'mark.hl[data-color="yellow"]{background:rgba(255,241,118,0.75);}' +
    'mark.hl[data-color="green"]{background:rgba(165,214,167,0.75);}' +
    'mark.hl[data-color="red"]{background:rgba(239,154,154,0.75);}' +
    'mark.hl[data-note]:not([data-note=""]):after{content:"✏";font-size:.65rem;vertical-align:super;margin-left:2px;opacity:.7;}' +
    /* table of contents box */
    '#chapter-toc{background:linear-gradient(135deg,#f8f5ed 0%,#fdf8f0 100%);border:1px solid #d4c89a;border-radius:8px;padding:1rem 1.4rem;margin:1.5rem 0;box-shadow:0 2px 8px rgba(0,0,0,0.06);}' +
    '#chapter-toc .toc-title{font-weight:700;color:#1a2744;margin-bottom:0.8rem;font-size:0.9rem;letter-spacing:0.04em;text-transform:uppercase;}' +
    '#chapter-toc ul{list-style:none;margin:0;padding:0;}' +
    '#chapter-toc li{margin:0.25rem 0;line-height:1.4;}' +
    '#chapter-toc li.toc-h1{font-weight:600;}' +
    '#chapter-toc li.toc-h2{padding-left:1rem;}' +
    '#chapter-toc li.toc-h3{padding-left:2rem;font-size:0.88rem;}' +
    '#chapter-toc li.toc-h4{padding-left:3rem;font-size:0.83rem;color:#777;}' +
    '#chapter-toc a{color:#1a2744;text-decoration:none;transition:color 0.15s;}' +
    '#chapter-toc a:hover{color:#c9a84c;}';
  document.head.appendChild(style);

  // ── GET TEXT NODES IN RANGE ──
  function getTextNodesInRange(range) {
    const nodes = [];
    const walker = document.createTreeWalker(
      range.commonAncestorContainer.nodeType === 3 
        ? range.commonAncestorContainer.parentNode 
        : range.commonAncestorContainer,
      NodeFilter.SHOW_TEXT
    );
    let node;
    while ((node = walker.nextNode())) {
      if (range.intersectsNode(node)) {
        nodes.push(node);
      }
    }
    return nodes;
  }

  // ── HIGHLIGHT RANGE WITH MULTIPLE MARKS ──
  function highlightRange(range, hlId, color, note) {
    const textNodes = getTextNodesInRange(range);
    textNodes.forEach(textNode => {
      let start = 0;
      let end = textNode.textContent.length;
      
      if (textNode === range.startContainer) {
        start = range.startOffset;
      }
      if (textNode === range.endContainer) {
        end = range.endOffset;
      }
      
      if (start >= end || start >= textNode.textContent.length) return;
      
      const nodeRange = document.createRange();
      nodeRange.setStart(textNode, start);
      nodeRange.setEnd(textNode, Math.min(end, textNode.textContent.length));
      
      try {
        const mark = document.createElement('mark');
        mark.className = 'hl';
        mark.setAttribute('data-hl-id', hlId);
        mark.setAttribute('data-color', color);
        mark.setAttribute('data-note', note || '');
        nodeRange.surroundContents(mark);
      } catch (e) {
        // If surroundContents fails, try extractContents approach
        try {
          const contents = nodeRange.extractContents();
          const mark = document.createElement('mark');
          mark.className = 'hl';
          mark.setAttribute('data-hl-id', hlId);
          mark.setAttribute('data-color', color);
          mark.setAttribute('data-note', note || '');
          mark.appendChild(contents);
          nodeRange.insertNode(mark);
        } catch (_) {}
      }
    });
  }

  // ── CREATE MARK FROM HL DATA ──
  function createMark(hl) {
    try {
      // New format with startXPath and endXPath
      if (hl.startXPath && hl.endXPath) {
        const startEl = resolveXPath(hl.startXPath);
        const endEl = resolveXPath(hl.endXPath);
        if (!startEl || !endEl) return;
        
        const startInfo = startEl.nodeType === 3 
          ? { node: startEl, localOffset: hl.startOffset }
          : findTextNodeAt(startEl, hl.startOffset);
        const endInfo = endEl.nodeType === 3
          ? { node: endEl, localOffset: hl.endOffset }
          : findTextNodeAt(endEl, hl.endOffset);
        
        if (!startInfo || !endInfo) return;
        
        const range = document.createRange();
        range.setStart(startInfo.node, startInfo.localOffset);
        range.setEnd(endInfo.node, endInfo.localOffset);
        
        highlightRange(range, hl.id, hl.color, hl.note);
        return;
      }
      
      // Legacy format with single xpath
      const node = resolveXPath(hl.xpath);
      if (!node) return;
      let range;
      if (node.nodeType === 3) {
        range = document.createRange();
        range.setStart(node, hl.startOffset);
        range.setEnd(node, hl.endOffset);
      } else {
        const s = findTextNodeAt(node, hl.startOffset);
        const en = findTextNodeAt(node, hl.endOffset);
        if (!s || !en) return;
        range = document.createRange();
        range.setStart(s.node, s.localOffset);
        range.setEnd(en.node, en.localOffset);
      }
      highlightRange(range, hl.id, hl.color, hl.note);
    } catch (_) {}
  }

  // ── MESSAGES FROM PARENT ──
  window.addEventListener('message', e => {
    if (e.origin !== ORIGIN) return;
    const msg = e.data;
    if (msg.type === 'applyHighlights') {
      (msg.highlights || []).forEach(createMark);
    }
    if (msg.type === 'scrollTo') {
      window.scrollTo(0, msg.pos);
    }
    if (msg.type === 'scrollToHighlight') {
      const mark = document.querySelector('mark.hl[data-hl-id="' + msg.id + '"]');
      if (!mark) return;
      mark.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Flash effect
      mark.style.transition = 'outline 0.2s';
      mark.style.outline = '3px solid #c9a84c';
      setTimeout(() => { mark.style.outline = 'none'; }, 1500);
    }
    if (msg.type === 'deleteHighlight') {
      // Handle multiple marks with same id (multi-line highlights)
      const marks = document.querySelectorAll('mark.hl[data-hl-id="' + msg.id + '"]');
      marks.forEach(mark => {
        const p = mark.parentNode;
        while (mark.firstChild) p.insertBefore(mark.firstChild, mark);
        p.removeChild(mark); 
        p.normalize();
      });
    }
    if (msg.type === 'updateHighlight') {
      // Handle multiple marks with same id (multi-line highlights)
      const marks = document.querySelectorAll('mark.hl[data-hl-id="' + msg.id + '"]');
      marks.forEach(mark => {
        mark.setAttribute('data-color', msg.color);
        mark.setAttribute('data-note', msg.note || '');
      });
    }
    if (msg.type === 'createHighlightFromSelection') {
      // Apply highlight directly from current selection - more reliable
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.rangeCount) {
        window.parent.postMessage({ type: 'highlightFailed' }, ORIGIN);
        return;
      }
      const range = sel.getRangeAt(0);
      const selectedText = range.toString().trim();
      if (!selectedText) {
        window.parent.postMessage({ type: 'highlightFailed' }, ORIGIN);
        return;
      }
      
      // Apply highlight directly
      highlightRange(range, msg.id, msg.color, msg.note || '');
      sel.removeAllRanges();
      
      // Send back the data for storage (echo XPath so parent can persist positions)
      window.parent.postMessage({
        type: 'highlightCreated',
        id: msg.id,
        color: msg.color,
        note: msg.note || '',
        text: selectedText.substring(0, 500),
        startXPath: msg.startXPath,
        startOffset: msg.startOffset,
        endXPath: msg.endXPath,
        endOffset: msg.endOffset,
      }, ORIGIN);
    }

  });


  // ── BUILD TABLE OF CONTENTS ──
  function buildTOC() {
    const headings = document.querySelectorAll('h1, h2, h3, h4');
    if (headings.length < 3) return; // Not enough headings for TOC
    
    const toc = document.createElement('nav');
    toc.id = 'chapter-toc';
    toc.innerHTML = '<div class="toc-title">📑 Mục lục chương</div>';
    
    const list = document.createElement('ul');
    headings.forEach((h, idx) => {
      // Add id if missing
      if (!h.id) h.id = 'heading-' + idx;
      
      const li = document.createElement('li');
      li.className = 'toc-' + h.tagName.toLowerCase();
      const a = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = h.textContent.trim();
      a.addEventListener('click', e => {
        e.preventDefault();
        h.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      li.appendChild(a);
      list.appendChild(li);
    });
    
    toc.appendChild(list);
    
    // Insert after first h1 or at beginning
    const firstH1 = document.querySelector('h1');
    if (firstH1 && firstH1.nextSibling) {
      firstH1.parentNode.insertBefore(toc, firstH1.nextSibling);
    } else {
      document.body.insertBefore(toc, document.body.firstChild);
    }
  }
  
  // Build TOC on load
  setTimeout(buildTOC, 100);

  // ── HELPER: rect in parent viewport coords ──
  function toParentCoords(rect) {
    const fr = window.frameElement.getBoundingClientRect();
    return {
      top:    fr.top  + rect.top,
      bottom: fr.top  + rect.bottom,
      left:   fr.left + rect.left,
      width:  rect.width,
    };
  }

  // ── CLICK: dismiss popup or open highlight popup ──
  document.addEventListener('mousedown', () => {
    // Clicking anywhere in iframe should dismiss parent popup
    window.parent.postMessage({ type: 'iframeClick' }, ORIGIN);
  });

  document.addEventListener('click', e => {
    const mark = e.target.closest('mark.hl');
    if (!mark) return;
    e.stopPropagation();
    window.getSelection()?.removeAllRanges();
    window.parent.postMessage({
      type:  'highlightClicked',
      id:    mark.getAttribute('data-hl-id'),
      color: mark.getAttribute('data-color'),
      note:  mark.getAttribute('data-note') || '',
      ...toParentCoords(mark.getBoundingClientRect()),
    }, ORIGIN);
  });

  // ── SELECTION → SHOW POPUP ──
  function handleSelection() {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    if (!range || range.collapsed) return;

    // Get selected text for display in highlights list
    const selectedText = range.toString().trim();
    if (!selectedText) return;

    // Get XPath for both start and end containers
    const startXPath = getXPath(range.startContainer);
    const endXPath = getXPath(range.endContainer);
    
    // Calculate offsets relative to parent elements
    let startOffset = range.startOffset;
    let endOffset = range.endOffset;

    // Convert to element-relative offsets for start
    if (range.startContainer.nodeType === 3) {
      const parent = range.startContainer.parentNode;
      if (parent && parent !== document.body) {
        let pos = 0;
        const walker = document.createTreeWalker(parent, NodeFilter.SHOW_TEXT);
        let n = walker.nextNode();
        while (n) {
          if (n === range.startContainer) { startOffset = pos + range.startOffset; break; }
          pos += n.textContent.length; n = walker.nextNode();
        }
      }
    }
    
    // Convert to element-relative offsets for end
    if (range.endContainer.nodeType === 3) {
      const parent = range.endContainer.parentNode;
      if (parent && parent !== document.body) {
        let pos = 0;
        const walker = document.createTreeWalker(parent, NodeFilter.SHOW_TEXT);
        let n = walker.nextNode();
        while (n) {
          if (n === range.endContainer) { endOffset = pos + range.endOffset; break; }
          pos += n.textContent.length; n = walker.nextNode();
        }
      }
    }

    window.parent.postMessage({
      type: 'textSelected',
      startXPath, startOffset, 
      endXPath, endOffset,
      text: selectedText.substring(0, 500), // Limit text length
      ...toParentCoords(range.getBoundingClientRect()),
    }, ORIGIN);
  }

  document.addEventListener('mouseup', e => {
    // Small delay so iframeClick fires first (mousedown), then we show popup
    setTimeout(handleSelection, 10);
  });
  document.addEventListener('touchend', () => setTimeout(handleSelection, 50));

})();
`;

// ── CHAPTER LOADING ──
function loadChapter(id) {
  currentChapterId = id;
  state.lastChapter = id;
  hidePopup();

  document.querySelectorAll('#chapter-nav a').forEach(a => {
    a.classList.toggle('active', a.dataset.id === id);
  });

  const ch = CHAPTERS.find(c => c.id === id) || CHAPTERS[0];
  document.getElementById('toolbar-chapter-title').textContent =
    `Chương ${ch.num} – ${ch.title}`;

  const frame = document.getElementById('chapter-frame');

  if (!TRANSLATED_IDS.has(id)) {
    frame.srcdoc = `<!DOCTYPE html><html lang="vi"><head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <style>
        body { font-family: sans-serif; display:flex; align-items:center;
               justify-content:center; min-height:100vh; margin:0;
               background:#fdf8f0; color:#5a5a5a; text-align:center; }
        h2 { color:#1a2744; margin-bottom:0.5rem; }
      </style></head><body>
      <div><div style="font-size:3rem;margin-bottom:1rem">🔄</div>
      <h2>Chương ${ch.num} – ${ch.title}</h2>
      <p>Chương này chưa được dịch sang tiếng Việt.</p></div>
      </body></html>`;
    // Update button state
    const prog = getProgress(id);
    const btn = document.getElementById('btn-mark-done');
    btn.textContent = prog.status === 'done' ? '✓ Đã xong' : '✓ Xong';
    btn.classList.toggle('is-done', prog.status === 'done');
    return;
  }

  // IMPORTANT: assign onload BEFORE setting src to avoid missing the event on cached loads
  frame.onload = () => {
    try {
      const iwin = frame.contentWindow;

      // Pre-reset sidebar margin; bridge script will set full reading-column layout
      const mainEl = iwin.document.querySelector('#main');
      if (mainEl) mainEl.style.marginLeft = '0';

      // Inject bridge script
      const script = iwin.document.createElement('script');
      script.textContent = BRIDGE_SCRIPT;
      iwin.document.body.appendChild(script);

      // Inject global font settings into iframe
      if (window.PMFontSettings) {
        const fs = PMFontSettings.load();
        if (fs.fontId || fs.sizeId) {
          const fontStyle = iwin.document.createElement('style');
          fontStyle.id = 'pmlib-font-inject';
          fontStyle.textContent = PMFontSettings.buildCSS(fs.fontId, fs.sizeId);
          iwin.document.head.appendChild(fontStyle);
        }
      }

      // Send saved highlights to iframe
      const highlights = state.highlights[id] || [];
      iwin.postMessage({ type: 'applyHighlights', highlights }, '*');

      // Restore scroll position (skip if navigating to a specific highlight)
      const prog = getProgress(id);
      if (pendingScrollHlId) {
        const scrollId = pendingScrollHlId;
        pendingScrollHlId = null;
        setTimeout(() => iwin.postMessage({ type: 'scrollToHighlight', id: scrollId }, '*'), 250);
      } else if (prog.scrollPos > 0) {
        iwin.postMessage({ type: 'scrollTo', pos: prog.scrollPos }, '*');
      }

      // Update mark-done button
      const btn = document.getElementById('btn-mark-done');
      btn.textContent = prog.status === 'done' ? '✓ Đã xong' : '✓ Xong';
      btn.classList.toggle('is-done', prog.status === 'done');

      // Transition unread → reading
      if (prog.status === 'unread') {
        state.progress[id] = { status: 'reading', scrollPos: 0 };
        renderSidebar();
        scheduleSave();
      }
    } catch (err) {
      console.warn('iframe bridge error:', err);
    }
  };

  // Set src AFTER onload handler is assigned
  frame.src = `books/pmbok6/${id}.html`;
}

// ── MESSAGES FROM IFRAME ──
window.addEventListener('message', e => {
  if (e.source !== document.getElementById('chapter-frame').contentWindow) return;
  const msg = e.data;

  if (msg.type === 'scroll') {
    if (!currentChapterId) return;
    if (!state.progress[currentChapterId]) {
      state.progress[currentChapterId] = { status: 'reading', scrollPos: 0 };
    }
    state.progress[currentChapterId].scrollPos = msg.pos;
    scheduleSave();
  }

  if (msg.type === 'textSelected') {
    pendingHighlight = { 
      startXPath: msg.startXPath, 
      startOffset: msg.startOffset, 
      endXPath: msg.endXPath,
      endOffset: msg.endOffset,
      text: msg.text
    };
    activeHighlightId = null;
    document.getElementById('hl-delete-btn').hidden = true;
    positionPopupAt(msg);
  }

  if (msg.type === 'iframeClick') {
    // Mousedown inside iframe — dismiss popup unless user is mid-selection
    // We hide it here; textSelected message (from mouseup) will re-show if text selected
    hidePopup();
  }

  if (msg.type === 'highlightClicked') {
    activeHighlightId = msg.id;
    pendingHighlight = null;
    document.getElementById('hl-delete-btn').hidden = false;
    positionPopupAt(msg);
  }

  if (msg.type === 'highlightCreated') {
    const hlData = {
      id: msg.id, color: msg.color, note: msg.note, text: msg.text,
      startXPath: msg.startXPath, startOffset: msg.startOffset,
      endXPath: msg.endXPath, endOffset: msg.endOffset,
      createdAt: Date.now(),
    };
    if (!state.highlights[currentChapterId]) state.highlights[currentChapterId] = [];
    state.highlights[currentChapterId].push(hlData);
    scheduleSave();
    renderHighlightsList();
    updateHlAllBadge();
  }

  if (msg.type === 'highlightFailed') {
    console.warn('Highlight creation failed - selection may have been lost');
  }

});

// ── POPUP POSITIONING ──
function positionPopupAt(coords) {
  const popup = document.getElementById('highlight-popup');
  popup.hidden = false;
  const popH = popup.offsetHeight || 52;
  const popW = popup.offsetWidth  || 220;
  const top = coords.top - popH - 8;
  popup.style.top  = (top < 8 ? coords.bottom + 8 : top) + 'px';
  popup.style.left = Math.max(8, Math.min(
    coords.left + coords.width / 2 - popW / 2,
    window.innerWidth - popW - 8
  )) + 'px';
}

function hidePopup() {
  document.getElementById('highlight-popup').hidden = true;
  pendingHighlight  = null;
  activeHighlightId = null;
}

// Close popup when clicking in parent page (outside popup)
document.addEventListener('mousedown', e => {
  const popup = document.getElementById('highlight-popup');
  if (!popup.hidden && !popup.contains(e.target)) hidePopup();
});
document.addEventListener('touchstart', e => {
  const popup = document.getElementById('highlight-popup');
  if (!popup.hidden && !popup.contains(e.target)) hidePopup();
}, { passive: true });

// ── POPUP BUTTONS ──
function generateId() {
  return 'h_' + Math.random().toString(36).slice(2, 9);
}

document.querySelectorAll('.hl-color').forEach(btn => {
  btn.addEventListener('click', () => {
    const color = btn.dataset.color;
    if (activeHighlightId) {
      // Update color of existing highlight
      const hl = (state.highlights[currentChapterId] || []).find(h => h.id === activeHighlightId);
      if (hl) {
        hl.color = color;
        document.getElementById('chapter-frame').contentWindow
          .postMessage({ type: 'updateHighlight', id: activeHighlightId, color, note: hl.note || '' }, '*');
        scheduleSave();
        renderHighlightsList();
      }
      hidePopup();
    } else if (pendingHighlight) {
      // Use new reliable approach: let iframe apply highlight from current selection
      const id = generateId();
      document.getElementById('chapter-frame').contentWindow
        .postMessage({
          type: 'createHighlightFromSelection', id, color, note: '',
          startXPath: pendingHighlight.startXPath,
          startOffset: pendingHighlight.startOffset,
          endXPath: pendingHighlight.endXPath,
          endOffset: pendingHighlight.endOffset,
        }, '*');
      hidePopup();
    }
  });
});

document.getElementById('hl-delete-btn').addEventListener('click', () => {
  if (!activeHighlightId) return;
  state.highlights[currentChapterId] = (state.highlights[currentChapterId] || [])
    .filter(h => h.id !== activeHighlightId);
  document.getElementById('chapter-frame').contentWindow
    .postMessage({ type: 'deleteHighlight', id: activeHighlightId }, '*');
  scheduleSave();
  renderHighlightsList();
  updateHlAllBadge();
  hidePopup();
});

document.getElementById('hl-close-btn').addEventListener('click', () => hidePopup());

// ── NOTE MODAL ──
let noteTargetId = null;
let noteTargetPending = null;

document.getElementById('hl-note-btn').addEventListener('click', () => {
  if (activeHighlightId) {
    const hl = (state.highlights[currentChapterId] || []).find(h => h.id === activeHighlightId);
    noteTargetId = activeHighlightId;
    noteTargetPending = null;
    document.getElementById('note-textarea').value = hl?.note || '';
    document.getElementById('note-modal').hidden = false;
    hidePopup();
  } else if (pendingHighlight) {
    // Create highlight first (yellow), then open note modal
    const id = generateId();
    noteTargetId = id; // Will be used when note is saved
    noteTargetPending = null;
    document.getElementById('note-textarea').value = '';
    document.getElementById('chapter-frame').contentWindow
      .postMessage({
        type: 'createHighlightFromSelection', id, color: 'yellow', note: '',
        startXPath: pendingHighlight.startXPath,
        startOffset: pendingHighlight.startOffset,
        endXPath: pendingHighlight.endXPath,
        endOffset: pendingHighlight.endOffset,
      }, '*');
    document.getElementById('note-modal').hidden = false;
    hidePopup();
  } else { return; }
});

document.getElementById('note-cancel').addEventListener('click', () => {
  noteTargetId = null;
  noteTargetPending = null;
  document.getElementById('note-modal').hidden = true;
});

document.getElementById('note-save').addEventListener('click', () => {
  const note = document.getElementById('note-textarea').value.trim();
  const iwin = document.getElementById('chapter-frame').contentWindow;

  if (noteTargetId) {
    const hl = (state.highlights[currentChapterId] || []).find(h => h.id === noteTargetId);
    if (hl) {
      hl.note = note;
      iwin.postMessage({ type: 'updateHighlight', id: noteTargetId, color: hl.color, note }, '*');
      scheduleSave();
      renderHighlightsList();
    }
  }

  noteTargetId = null;
  noteTargetPending = null;
  document.getElementById('note-modal').hidden = true;
});

// ── MARK DONE ──
document.getElementById('btn-mark-done').addEventListener('click', () => {
  if (!currentChapterId) return;
  const prog = getProgress(currentChapterId);
  const newStatus = prog.status === 'done' ? 'reading' : 'done';
  state.progress[currentChapterId] = { ...prog, status: newStatus };
  const btn = document.getElementById('btn-mark-done');
  btn.textContent = newStatus === 'done' ? '✓ Đã xong' : '✓ Xong';
  btn.classList.toggle('is-done', newStatus === 'done');
  renderSidebar();
  scheduleSave();
});

// ── HIGHLIGHTS PANEL ──
const HIGHLIGHT_COLORS = {
  yellow: { label: 'Định nghĩa', bg: 'rgba(255,241,118,0.85)', fg: '#5a4000' },
  green:  { label: 'Quan trọng', bg: 'rgba(165,214,167,0.85)', fg: '#1b5e20' },
  red:    { label: 'Ghi nhớ',    bg: 'rgba(239,154,154,0.85)', fg: '#7f0000' },
};

function colorLabel(color) {
  const c = HIGHLIGHT_COLORS[color] || { label: color, bg: '#eee', fg: '#333' };
  return `<span class="hl-color-label ${color}">${c.label}</span>`;
}

function formatHighlightText(text) {
  if (!text) return 'Đoạn văn đã highlight';
  const lines = text.split(/[\n\r]+/).filter(l => l.trim());
  const firstLine = lines[0] || text;
  if (firstLine.length > 120) return firstLine.substring(0, 120).trim() + '...';
  return firstLine.trim() + (lines.length > 1 ? '...' : '');
}

function updateHlAllBadge() {
  const total = Object.values(state.highlights).reduce((s, arr) => s + arr.length, 0);
  const badge = document.getElementById('hl-all-badge');
  if (badge) badge.textContent = total > 0 ? total : '';
}

function renderHighlightsList() {
  if (hlPanelTab === 'all') { renderAllHighlights(); return; }
  const list = document.getElementById('highlights-list');
  let highlights = state.highlights[currentChapterId] || [];
  if (hlPanelFilter !== 'all') highlights = highlights.filter(h => h.color === hlPanelFilter);

  if (highlights.length === 0) {
    list.innerHTML = `<div class="hl-empty">${hlPanelFilter !== 'all'
      ? 'Không có highlight nào trong mục này.'
      : 'Chưa có highlight nào trong chương này.'}</div>`;
    return;
  }

  list.innerHTML = highlights.map(hl => `
    <div class="hl-item" data-id="${hl.id}" data-color="${hl.color}">
      ${colorLabel(hl.color)}
      <div class="hl-item-text">"${escapeHtml(formatHighlightText(hl.text))}"</div>
      ${hl.note ? `<div class="hl-item-note">📝 ${escapeHtml(hl.note)}</div>` : ''}
      <div class="hl-item-actions">
        <button class="hl-goto" data-id="${hl.id}">📍 Đi đến</button>
        <button class="hl-edit" data-id="${hl.id}">✏️ Ghi chú</button>
        <button class="hl-remove" data-id="${hl.id}">🗑</button>
      </div>
    </div>
  `).join('');

  attachHlItemListeners(list);
}

function renderAllHighlights() {
  const list = document.getElementById('highlights-list');
  const groups = [];
  CHAPTERS.forEach(ch => {
    let hls = state.highlights[ch.id] || [];
    if (hlPanelFilter !== 'all') hls = hls.filter(h => h.color === hlPanelFilter);
    if (hls.length > 0) groups.push({ ch, hls });
  });

  if (groups.length === 0) {
    list.innerHTML = `<div class="hl-empty">Chưa có highlight nào${hlPanelFilter !== 'all' ? ' trong mục này' : ''}.</div>`;
    return;
  }

  list.innerHTML = groups.map(({ ch, hls }) => `
    <div class="hl-chapter-group">
      <div class="hl-chapter-group-title">Chương ${ch.num} – ${ch.title}</div>
      ${hls.map(hl => `
        <div class="hl-item" data-id="${hl.id}" data-color="${hl.color}" data-chapter="${ch.id}">
          ${colorLabel(hl.color)}
          <div class="hl-item-text">"${escapeHtml(formatHighlightText(hl.text))}"</div>
          ${hl.note ? `<div class="hl-item-note">📝 ${escapeHtml(hl.note)}</div>` : ''}
          <div class="hl-item-actions">
            <button class="hl-goto" data-id="${hl.id}" data-chapter="${ch.id}">📍 Đi đến</button>
            <button class="hl-remove" data-id="${hl.id}" data-chapter="${ch.id}">🗑</button>
          </div>
        </div>
      `).join('')}
    </div>
  `).join('');

  attachHlItemListeners(list);
}

function attachHlItemListeners(list) {
  list.querySelectorAll('.hl-goto').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const chId = btn.dataset.chapter;
      if (chId && chId !== currentChapterId) {
        pendingScrollHlId = btn.dataset.id;
        loadChapter(chId);
      } else {
        scrollToHighlight(btn.dataset.id);
      }
    });
  });

  list.querySelectorAll('.hl-edit').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      editHighlightNote(btn.dataset.id);
    });
  });

  list.querySelectorAll('.hl-remove').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      deleteHighlightFromChapter(btn.dataset.chapter || currentChapterId, btn.dataset.id);
    });
  });

  list.querySelectorAll('.hl-item').forEach(item => {
    item.addEventListener('click', () => {
      const chId = item.dataset.chapter;
      if (chId && chId !== currentChapterId) {
        pendingScrollHlId = item.dataset.id;
        loadChapter(chId);
      } else {
        scrollToHighlight(item.dataset.id);
      }
    });
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function scrollToHighlight(hlId) {
  const iwin = document.getElementById('chapter-frame').contentWindow;
  iwin.postMessage({ type: 'scrollToHighlight', id: hlId }, '*');
}

function editHighlightNote(hlId) {
  const hl = (state.highlights[currentChapterId] || []).find(h => h.id === hlId);
  if (!hl) return;
  noteTargetId = hlId;
  noteTargetPending = null;
  document.getElementById('note-textarea').value = hl.note || '';
  document.getElementById('note-modal').hidden = false;
}

function deleteHighlight(hlId) {
  deleteHighlightFromChapter(currentChapterId, hlId);
}

function deleteHighlightFromChapter(chId, hlId) {
  state.highlights[chId] = (state.highlights[chId] || []).filter(h => h.id !== hlId);
  if (chId === currentChapterId) {
    document.getElementById('chapter-frame').contentWindow
      .postMessage({ type: 'deleteHighlight', id: hlId }, '*');
  }
  scheduleSave();
  renderHighlightsList();
  updateHlAllBadge();
}

document.getElementById('btn-highlights').addEventListener('click', () => {
  const panel = document.getElementById('highlights-panel');
  panel.hidden = !panel.hidden;
  if (!panel.hidden) {
    updateHlAllBadge();
    renderHighlightsList();
  }
});

document.getElementById('highlights-panel-close').addEventListener('click', () => {
  document.getElementById('highlights-panel').hidden = true;
});

document.querySelectorAll('.hl-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    hlPanelTab = btn.dataset.tab;
    document.querySelectorAll('.hl-tab').forEach(b => b.classList.toggle('active', b === btn));
    renderHighlightsList();
  });
});

document.querySelectorAll('.hl-filter').forEach(btn => {
  btn.addEventListener('click', () => {
    hlPanelFilter = btn.dataset.color;
    document.querySelectorAll('.hl-filter').forEach(b => b.classList.toggle('active', b === btn));
    renderHighlightsList();
  });
});

// ── PRINT BUTTON ──
document.getElementById('btn-print').addEventListener('click', () => {
  if (!currentChapterId) return;
  const frame = document.getElementById('chapter-frame');
  if (!frame || !frame.contentDocument) return;

  const iframeDoc = frame.contentDocument;
  const printWindow = window.open('', '', 'width=1000,height=800');
  const printDoc = printWindow.document;

  const clonedBody = iframeDoc.body.cloneNode(true);

  clonedBody.querySelector('#sidebar')?.remove();
  clonedBody.querySelector('#chapter-toc')?.remove();
  clonedBody.querySelectorAll('nav').forEach(nav => nav.remove());

  const styles = iframeDoc.querySelectorAll('style, link[rel="stylesheet"]');
  const styleHtml = Array.from(styles).map(s => s.outerHTML).join('');

  const ch = CHAPTERS.find(c => c.id === currentChapterId) || {};
  const title = `Chương ${ch.num} – ${ch.title}`;

  printDoc.write(`
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      ${styleHtml}
      <style>
        body { margin: 0; padding: 20px; }
        #main { margin-left: 0 !important; max-width: 100% !important; }
        mark { background: yellow; }
        @media print {
          body { margin: 0; padding: 10mm; }
        }
      </style>
    </head>
    <body>
      ${clonedBody.innerHTML}
    </body>
    </html>
  `);
  printDoc.close();

  setTimeout(() => {
    printWindow.print();
  }, 300);
});

// ── GIST SYNC (DISABLED - using localStorage only) ──

// ── AUDIO / TTS (DISABLED) ──


// ── QUIZ ENGINE ──
let quizState = null;
// quizState = { chapterId, questions, current, answers, startTime }

function chapterNumStr(id) {
  const n = String(CHAPTERS.find(c => c.id === id)?.num || '').padStart(2, '0');
  return n;
}

document.getElementById('btn-quiz').addEventListener('click', () => {
  if (!currentChapterId) return;
  startQuiz(currentChapterId);
});

async function startQuiz(chapterId) {
  const ch = CHAPTERS.find(c => c.id === chapterId);
  if (!ch) return;
  const num = chapterNumStr(chapterId);
  let data;
  try {
    const res = await fetch(`books/pmbok6/quiz/ch${num}.json`);
    if (!res.ok) throw new Error('not found');
    data = await res.json();
  } catch (_) {
    alert(`Câu hỏi cho Chương ${ch.num} chưa sẵn sàng. Vui lòng thử lại sau.`);
    return;
  }

  const questions = (data.questions || []).sort(() => Math.random() - 0.5).slice(0, 25);
  if (!questions.length) { alert('Không có câu hỏi cho chương này.'); return; }

  quizState = { chapterId, questions, current: 0, answers: [], startTime: Date.now() };

  document.getElementById('quiz-head-title').textContent = `📝 Quiz — Ch.${ch.num} ${ch.title}`;
  document.getElementById('quiz-head-sub').textContent = `${questions.length} câu hỏi · PMP Exam Style`;
  document.getElementById('quiz-q-screen').hidden = false;
  document.getElementById('quiz-r-screen').hidden = true;
  document.getElementById('quiz-overlay').hidden = false;
  document.body.style.overflow = 'hidden';

  showQuizQuestion(0);
}

function showQuizQuestion(idx) {
  const { questions } = quizState;
  const q = questions[idx];
  quizState.current = idx;

  const total = questions.length;
  const pct = (idx / total * 100).toFixed(0);
  document.getElementById('quiz-bar').style.width = pct + '%';
  document.getElementById('quiz-q-num-badge').textContent = `Câu ${idx + 1} / ${total}`;

  const correct = quizState.answers.filter(a => a.correct).length;
  const answered = quizState.answers.length;
  document.getElementById('quiz-score-live').textContent = answered > 0
    ? `${correct}/${answered} đúng`
    : '';

  document.getElementById('quiz-q-body').textContent = q.q;
  document.getElementById('quiz-exp').hidden = true;
  document.getElementById('quiz-btn-next').hidden = true;
  document.getElementById('quiz-btn-end').hidden = true;

  const opts = document.getElementById('quiz-opts');
  opts.innerHTML = ['A','B','C','D'].map(letter => `
    <button class="opt-card" data-letter="${letter}">
      <span class="opt-letter">${letter}</span>
      <span class="opt-text">${escapeHtml(q.opts[letter] || '')}</span>
    </button>
  `).join('');

  opts.querySelectorAll('.opt-card').forEach(btn => {
    btn.addEventListener('click', () => selectQuizAnswer(btn.dataset.letter));
  });
}

function selectQuizAnswer(selected) {
  const { questions, current } = quizState;
  const q = questions[current];
  const correct = selected === q.ans;

  quizState.answers[current] = { selected, correct, qId: q.id };

  // Style all option cards
  document.querySelectorAll('.opt-card').forEach(btn => {
    btn.disabled = true;
    const letter = btn.dataset.letter;
    if (letter === q.ans) {
      btn.classList.add(correct && letter === selected ? 'opt-correct' : 'opt-reveal');
    } else if (letter === selected && !correct) {
      btn.classList.add('opt-wrong');
    }
  });

  // Show explanation
  if (q.exp) {
    const expEl = document.getElementById('quiz-exp');
    expEl.textContent = q.exp;
    expEl.hidden = false;
  }

  // Show next/end button
  const isLast = current === questions.length - 1;
  document.getElementById('quiz-btn-next').hidden = isLast;
  document.getElementById('quiz-btn-end').hidden = !isLast;

  // Update live score
  const correctCount = quizState.answers.filter(a => a.correct).length;
  document.getElementById('quiz-score-live').textContent = `${correctCount}/${quizState.answers.length} đúng`;
}

document.getElementById('quiz-btn-next').addEventListener('click', () => {
  showQuizQuestion(quizState.current + 1);
});

document.getElementById('quiz-btn-end').addEventListener('click', showQuizResults);

function showQuizResults() {
  const { questions, answers, chapterId } = quizState;
  const total = questions.length;
  const correct = answers.filter(a => a.correct).length;
  const pct = Math.round(correct / total * 100);

  // Save to history
  if (!state.quizHistory) state.quizHistory = {};
  if (!state.quizHistory[chapterId]) state.quizHistory[chapterId] = [];
  state.quizHistory[chapterId].push({ correct, total, pct, date: Date.now() });
  scheduleSave();

  document.getElementById('quiz-bar').style.width = '100%';
  document.getElementById('quiz-q-screen').hidden = true;
  document.getElementById('quiz-r-screen').hidden = false;

  document.getElementById('quiz-r-score').textContent = `${correct}/${total}`;
  document.getElementById('quiz-r-pct').textContent = `${pct}%`;

  let band, bandClass;
  if (pct >= 71)      { band = '✅ Đạt chuẩn PMP'; bandClass = 'grade-pass'; }
  else if (pct >= 55) { band = '⚠️ Cần ôn thêm';  bandClass = 'grade-ok'; }
  else                { band = '❌ Cần học lại';   bandClass = 'grade-fail'; }

  document.getElementById('quiz-r-band').innerHTML =
    `<span class="${bandClass}">${band}</span>`;
  document.getElementById('quiz-r-stats').innerHTML =
    `<span class="rs-correct">✓ ${correct} đúng</span>
     <span class="rs-wrong">✗ ${total - correct} sai</span>`;

  // Wrong answers review
  const wrong = answers.map((a, i) => ({ ...a, q: questions[i] })).filter(a => !a.correct);
  const reviewEl = document.getElementById('quiz-r-review');
  if (!wrong.length) {
    reviewEl.innerHTML = '<div class="rw-perfect">🎉 Hoàn hảo! Bạn trả lời đúng tất cả!</div>';
  } else {
    reviewEl.innerHTML = `
      <div class="rw-title">Câu trả lời sai (${wrong.length})</div>
      ${wrong.map(w => `
        <div class="rw-item">
          <div class="rw-q">${escapeHtml(w.q.q)}</div>
          <div class="rw-ans">
            <span class="rw-wrong-ans">Bạn chọn: ${w.selected} – ${escapeHtml(w.q.opts[w.selected] || '')}</span>
          </div>
          <div class="rw-ans">
            <span class="rw-right-ans">Đáp án: ${w.q.ans} – ${escapeHtml(w.q.opts[w.q.ans] || '')}</span>
          </div>
          ${w.q.exp ? `<div class="rw-exp">${escapeHtml(w.q.exp)}</div>` : ''}
        </div>
      `).join('')}
    `;
  }
}

function closeQuiz() {
  document.getElementById('quiz-overlay').hidden = true;
  document.body.style.overflow = '';
  quizState = null;
}

document.getElementById('quiz-x').addEventListener('click', closeQuiz);
document.getElementById('quiz-btn-close2').addEventListener('click', closeQuiz);
document.getElementById('quiz-btn-retry').addEventListener('click', () => {
  const chId = quizState?.chapterId;
  closeQuiz();
  if (chId) startQuiz(chId);
});
document.getElementById('quiz-overlay').addEventListener('click', e => {
  if (e.target === document.getElementById('quiz-overlay')) closeQuiz();
});

// ── FONT SETTINGS ──
document.getElementById('btn-font').addEventListener('click', function (e) {
  e.stopPropagation();
  const existing = document.getElementById('pmlib-font-panel');
  if (existing) { existing.remove(); return; }
  if (window.PMFontSettings) {
    PMFontSettings.buildPanel(e.currentTarget, { side: 'bottom' });
  }
});

// When font settings change, re-inject CSS into the current iframe
window.addEventListener('pmlib-font-change', function (e) {
  const frame = document.getElementById('chapter-frame');
  if (!frame || !frame.contentDocument) return;
  try {
    let styleEl = frame.contentDocument.getElementById('pmlib-font-inject');
    if (!styleEl) {
      styleEl = frame.contentDocument.createElement('style');
      styleEl.id = 'pmlib-font-inject';
      frame.contentDocument.head.appendChild(styleEl);
    }
    styleEl.textContent = PMFontSettings.buildCSS(e.detail.fontId, e.detail.sizeId);
  } catch (err) { /* cross-origin guard */ }
});

// ── BOOT ──
document.addEventListener('DOMContentLoaded', () => {
  loadFromLocalStorage();
  renderSidebar();
  loadChapter(state.lastChapter);
});
