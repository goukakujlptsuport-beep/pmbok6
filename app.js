/* PMBOK6 app — iframe architecture */

const CHAPTERS = [
  { id: '01_instruction',               num: 1,  title: 'Giới Thiệu' },
  { id: '02_environment',               num: 2,  title: 'Môi Trường Dự Án' },
  { id: '03_pm_role',                   num: 3,  title: 'Vai Trò Của Người Quản Lý Dự Án' },
  { id: '04_integration_management',    num: 4,  title: 'Quản Lý Tích Hợp Dự Án' },
  { id: '05_scope_management',          num: 5,  title: 'Quản Lý Phạm Vi Dự Án' },
  { id: '06_schedule_management',       num: 6,  title: 'Quản Lý Tiến Độ Dự Án' },
  { id: '07_cost_management',           num: 7,  title: 'Quản Lý Chi Phí Dự Án' },
  { id: '08_quality_management',        num: 8,  title: 'Quản Lý Chất Lượng Dự Án' },
  { id: '09_resource_management',       num: 9,  title: 'Quản Lý Nguồn Lực Dự Án' },
  { id: '10_communications_management', num: 10, title: 'Quản Lý Truyền Thông Dự Án' },
  { id: '11_risk_management',           num: 11, title: 'Quản Lý Rủi Ro Dự Án' },
  { id: '12_procurement_management',    num: 12, title: 'Quản Lý Mua Sắm Dự Án' },
  { id: '13_stakeholder_management',    num: 13, title: 'Quản Lý Các Bên Liên Quan' },
  { id: '14_standard_for_pm',           num: 14, title: 'Tiêu Chuẩn Quản Lý Dự Án' },
  { id: '15_appendices_glossary',       num: 15, title: 'Phụ Lục & Từ Điển Thuật Ngữ' },
  { id: '16_agile_practice_guide',      num: 16, title: 'Hướng Dẫn Thực Hành Agile' },
];

const TRANSLATED_IDS = new Set([
  '01_instruction', '02_environment', '03_pm_role',
  '04_integration_management', '05_scope_management',
  '06_schedule_management', '07_cost_management',
  '08_quality_management', '09_resource_management',
  '10_communications_management', '11_risk_management',
  '12_procurement_management', '13_stakeholder_management',
  '14_standard_for_pm', '15_appendices_glossary',
  '16_agile_practice_guide',
]);

// ── STATE ──
let state = {
  progress:    {},  // { chapterId: { status, scrollPos } }
  highlights:  {},  // { chapterId: [{ id, xpath, startOffset, endOffset, color, note }] }
  lastChapter: CHAPTERS[0].id,
};
let gistConfig        = null;
let currentChapterId  = null;
let saveTimer         = null;
let pendingHighlight  = null;  // { xpath, startOffset, endOffset } from iframe
let activeHighlightId = null;  // hlId of mark being edited

const LS_KEY      = 'pmbok6_progress';
const LS_GIST_KEY = 'pmbok6_gist';
const GIST_FILE   = 'pmbok6-progress.json';

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
  } catch (_) {
    setSyncIndicator('error');
    return;
  }
  if (gistConfig?.token && gistConfig?.gistId) {
    try {
      await saveToGist();
      setSyncIndicator('saved');
    } catch (_) {
      setSyncIndicator('error');
    }
  } else {
    setSyncIndicator('saved');
  }
}

// ── IFRAME BRIDGE SCRIPT ──
// Injected into each chapter iframe after load.
const BRIDGE_SCRIPT = `
(function() {
  if (window.__pmbok_bridge) return;
  window.__pmbok_bridge = true;

  const ORIGIN = window.parent.location.origin;

  // Hide chapter's own sidebar and fix main layout
  document.querySelector('#sidebar')?.remove();
  const mainEl = document.querySelector('#main');
  if (mainEl) { mainEl.style.marginLeft = '0'; mainEl.style.maxWidth = '100%'; }

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

  // ── HIGHLIGHT STYLES ──
  const style = document.createElement('style');
  style.textContent =
    'mark.hl{border-radius:2px;cursor:pointer;padding:1px 0;}' +
    'mark.hl[data-color="yellow"]{background:rgba(255,241,118,0.75);}' +
    'mark.hl[data-color="green"]{background:rgba(165,214,167,0.75);}' +
    'mark.hl[data-color="red"]{background:rgba(239,154,154,0.75);}' +
    'mark.hl[data-note]:not([data-note=""]):after{content:"✏";font-size:.65rem;vertical-align:super;margin-left:2px;opacity:.7;}' +
    '#chapter-toc{background:linear-gradient(135deg,#f8f5ed 0%,#fdf8f0 100%);border:1px solid #d4c89a;border-radius:8px;padding:1rem 1.2rem;margin:1.5rem 0;box-shadow:0 2px 8px rgba(0,0,0,0.06);}' +
    '#chapter-toc .toc-title{font-weight:600;color:#1a2744;margin-bottom:0.8rem;font-size:0.95rem;}' +
    '#chapter-toc ul{list-style:none;margin:0;padding:0;}' +
    '#chapter-toc li{margin:0.3rem 0;}' +
    '#chapter-toc li.toc-h1{font-weight:600;}' +
    '#chapter-toc li.toc-h2{padding-left:1rem;}' +
    '#chapter-toc li.toc-h3{padding-left:2rem;font-size:0.9rem;}' +
    '#chapter-toc li.toc-h4{padding-left:3rem;font-size:0.85rem;color:#666;}' +
    '#chapter-toc a{color:#1a2744;text-decoration:none;transition:color 0.15s;}' +
    '#chapter-toc a:hover{color:#c9a84c;text-decoration:underline;}';
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
      
      // Send back the data for storage
      window.parent.postMessage({
        type: 'highlightCreated',
        id: msg.id,
        color: msg.color,
        note: msg.note || '',
        text: selectedText.substring(0, 500),
      }, ORIGIN);
    }

    // ── AUDIO: get readable text from chapter ──
    if (msg.type === 'getText') {
      // Collect text from paragraphs, headings, list items — skip nav/toc
      const skip = new Set(['SCRIPT','STYLE','NAV','#chapter-toc']);
      const blocks = [];
      document.querySelectorAll('h1,h2,h3,h4,p,li,td').forEach(el => {
        if (el.closest('#sidebar') || el.closest('#chapter-toc') || el.closest('nav')) return;
        const t = el.textContent.trim();
        if (t.length > 10) blocks.push(t);
      });
      window.parent.postMessage({ type: 'chapterText', blocks }, ORIGIN);
    }

    // ── AUDIO: highlight current sentence being read ──
    if (msg.type === 'highlightSentence') {
      // Remove previous audio highlight
      document.querySelectorAll('.audio-reading').forEach(el => el.classList.remove('audio-reading'));
      if (!msg.text) return;
      // Find element containing this text and highlight it
      const els = document.querySelectorAll('p,h1,h2,h3,h4,li,td');
      for (const el of els) {
        if (el.textContent.includes(msg.text.slice(0, 30))) {
          el.classList.add('audio-reading');
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          break;
        }
      }
    }

    if (msg.type === 'clearAudioHighlight') {
      document.querySelectorAll('.audio-reading').forEach(el => el.classList.remove('audio-reading'));
    }
  });

  // ── AUDIO HIGHLIGHT STYLE ──
  const audioStyle = document.createElement('style');
  audioStyle.textContent = '.audio-reading{background:rgba(201,168,76,0.2);border-left:3px solid #c9a84c;padding-left:6px;transition:background 0.3s;}';
  document.head.appendChild(audioStyle);

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
  // Reset audio when switching chapter
  if (audioPlayer) {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    clearAudioHighlight();
  }
  currentAudioPath = null;

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

      // Fix chapter layout: chapter HTML has margin-left:260px for its own sidebar.
      // We removed the sidebar, so reset the margin so content fills the iframe.
      const mainEl = iwin.document.querySelector('#main');
      if (mainEl) mainEl.style.marginLeft = '0';

      // Inject bridge script
      const script = iwin.document.createElement('script');
      script.textContent = BRIDGE_SCRIPT;
      iwin.document.body.appendChild(script);

      // Send saved highlights to iframe
      const highlights = state.highlights[id] || [];
      iwin.postMessage({ type: 'applyHighlights', highlights }, '*');

      // Restore scroll position
      const prog = getProgress(id);
      if (prog.scrollPos > 0) {
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
  // LMS: init progress panel for this chapter
  if (typeof ProgressTracker !== 'undefined') {
    ProgressTracker.initPanel(id);
  }
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
    // Save highlight data from iframe
    const hlData = { id: msg.id, color: msg.color, note: msg.note, text: msg.text };
    if (!state.highlights[currentChapterId]) state.highlights[currentChapterId] = [];
    state.highlights[currentChapterId].push(hlData);
    scheduleSave();
    renderHighlightsList();
  }

  if (msg.type === 'highlightFailed') {
    console.warn('Highlight creation failed - selection may have been lost');
  }

  if (msg.type === 'chapterText') {
    onChapterText(msg.blocks || []);
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
        .postMessage({ type: 'createHighlightFromSelection', id, color, note: '' }, '*');
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
      .postMessage({ type: 'createHighlightFromSelection', id, color: 'yellow', note: '' }, '*');
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
function formatHighlightText(text) {
  if (!text) return 'Đoạn văn đã highlight';
  // Get first meaningful line and clean up
  const lines = text.split(/[\n\r]+/).filter(l => l.trim());
  const firstLine = lines[0] || text;
  // Truncate if too long
  const maxLen = 120;
  if (firstLine.length > maxLen) {
    return firstLine.substring(0, maxLen).trim() + '...';
  }
  return firstLine.trim() + (lines.length > 1 ? '...' : '');
}

function renderHighlightsList() {
  const list = document.getElementById('highlights-list');
  const highlights = state.highlights[currentChapterId] || [];
  
  if (highlights.length === 0) {
    list.innerHTML = '';
    return;
  }
  
  list.innerHTML = highlights.map(hl => `
    <div class="hl-item" data-id="${hl.id}" data-color="${hl.color}">
      <div class="hl-item-text">"${escapeHtml(formatHighlightText(hl.text))}"</div>
      ${hl.note ? `<div class="hl-item-note">📝 ${escapeHtml(hl.note)}</div>` : ''}
      <div class="hl-item-actions">
        <button class="hl-goto" data-id="${hl.id}">📍 Đi đến</button>
        <button class="hl-edit" data-id="${hl.id}">✏️ Ghi chú</button>
        <button class="hl-remove" data-id="${hl.id}">🗑</button>
      </div>
    </div>
  `).join('');
  
  // Event listeners for actions
  list.querySelectorAll('.hl-goto').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      scrollToHighlight(btn.dataset.id);
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
      deleteHighlight(btn.dataset.id);
    });
  });
  
  // Click on item to go to highlight
  list.querySelectorAll('.hl-item').forEach(item => {
    item.addEventListener('click', () => {
      scrollToHighlight(item.dataset.id);
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
  state.highlights[currentChapterId] = (state.highlights[currentChapterId] || [])
    .filter(h => h.id !== hlId);
  document.getElementById('chapter-frame').contentWindow
    .postMessage({ type: 'deleteHighlight', id: hlId }, '*');
  scheduleSave();
  renderHighlightsList();
}

document.getElementById('btn-highlights').addEventListener('click', () => {
  const panel = document.getElementById('highlights-panel');
  panel.hidden = !panel.hidden;
  if (!panel.hidden) {
    renderHighlightsList();
  }
});

document.getElementById('highlights-panel-close').addEventListener('click', () => {
  document.getElementById('highlights-panel').hidden = true;
});

// ── GIST SYNC ──
function loadGistConfig() {
  try {
    const raw = localStorage.getItem(LS_GIST_KEY);
    if (raw) gistConfig = JSON.parse(raw);
  } catch (_) {}
}

function saveGistConfig(cfg) {
  gistConfig = cfg;
  localStorage.setItem(LS_GIST_KEY, JSON.stringify(cfg));
}

async function gistRequest(method, path, body) {
  const res = await fetch('https://api.github.com' + path, {
    method,
    headers: {
      'Authorization': 'Bearer ' + gistConfig.token,
      'Accept': 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  return res.json();
}

async function findOrCreateGist() {
  const gists = await gistRequest('GET', '/gists');
  const found = gists.find(g => g.files?.[GIST_FILE]);
  if (found) { saveGistConfig({ ...gistConfig, gistId: found.id }); return found.id; }
  const created = await gistRequest('POST', '/gists', {
    description: 'PMBOK 6 learning progress',
    public: false,
    files: { [GIST_FILE]: { content: JSON.stringify(state, null, 2) } },
  });
  saveGistConfig({ ...gistConfig, gistId: created.id });
  return created.id;
}

async function loadFromGist() {
  if (!gistConfig?.token || !gistConfig?.gistId) return;
  try {
    const data = await gistRequest('GET', `/gists/${gistConfig.gistId}`);
    const content = data.files?.[GIST_FILE]?.content;
    if (content) Object.assign(state, JSON.parse(content));
  } catch (err) {
    console.warn('loadFromGist failed:', err.message);
    setSyncIndicator('error');
  }
}

async function saveToGist() {
  if (!gistConfig?.token || !gistConfig?.gistId) return;
  await gistRequest('PATCH', `/gists/${gistConfig.gistId}`, {
    files: { [GIST_FILE]: { content: JSON.stringify(state, null, 2) } },
  });
}

// ── GIST MODAL ──
document.getElementById('btn-gist-settings').addEventListener('click', () => {
  document.getElementById('gist-modal').hidden = false;
});
document.getElementById('gist-offline').addEventListener('click', () => {
  document.getElementById('gist-modal').hidden = true;
});
document.getElementById('gist-connect').addEventListener('click', async () => {
  const token = document.getElementById('gist-token-input').value.trim();
  if (!token) return;
  const statusEl = document.getElementById('gist-status');
  statusEl.textContent = 'Đang kiểm tra token...';
  statusEl.className = '';
  try {
    gistConfig = { token, gistId: null };
    await findOrCreateGist();
    await loadFromGist();
    saveGistConfig(gistConfig);
    statusEl.textContent = '✓ Kết nối thành công!';
    statusEl.className = 'ok';
    renderSidebar();
    loadChapter(state.lastChapter);
    setTimeout(() => { document.getElementById('gist-modal').hidden = true; }, 1200);
  } catch (err) {
    statusEl.textContent = 'Lỗi: ' + err.message;
    statusEl.className = 'error';
    gistConfig = null;
  }
});

// ── AUDIO / TTS ──
const audioBar    = document.getElementById('audio-bar');
const audioPlay   = document.getElementById('audio-play');
const audioStop   = document.getElementById('audio-stop');
const audioStatus = document.getElementById('audio-status');
const audioSpeed  = document.getElementById('audio-speed');
const audioClose  = document.getElementById('audio-close');
const btnAudio    = document.getElementById('btn-audio');

// Pre-generated audio player state
let audioPlayer = null;
let currentAudioPath = null;
let audioHighlightedElement = null;
let audioMetadata = {};

function initAudioPlayer() {
  if (!audioPlayer) {
    audioPlayer = new Audio();
    audioPlayer.addEventListener('play', onAudioPlay);
    audioPlayer.addEventListener('pause', onAudioPause);
    audioPlayer.addEventListener('ended', onAudioEnded);
    audioPlayer.addEventListener('timeupdate', onAudioTimeUpdate);
  }
}

function toggleAudioPlayback() {
  if (!audioPlayer) initAudioPlayer();

  if (!currentAudioPath) {
    currentAudioPath = 'audio/' + currentChapterId + '.mp3';
    audioPlayer.src = currentAudioPath;
    loadAudioMetadata();
  }

  if (audioPlayer.paused) {
    audioPlayer.play().catch(err => {
      audioStatus.textContent = 'Lỗi: không thể phát âm thanh';
      console.error('Playback failed:', err);
    });
  } else {
    audioPlayer.pause();
  }
}

function stopAudio() {
  if (!audioPlayer) return;
  audioPlayer.pause();
  audioPlayer.currentTime = 0;
  clearAudioHighlight();
}

function changeAudioSpeed(e) {
  if (!audioPlayer) return;
  audioPlayer.playbackRate = parseFloat(e.target.value);
}

function closeAudioBar() {
  stopAudio();
  audioBar.hidden = true;
  btnAudio.classList.remove('active');
}

function onAudioPlay() {
  audioPlay.classList.add('playing');
  audioPlay.textContent = '⏸';
}

function onAudioPause() {
  audioPlay.classList.remove('playing');
  audioPlay.textContent = '▶';
}

function onAudioEnded() {
  audioPlay.classList.remove('playing');
  audioPlay.textContent = '▶';
  clearAudioHighlight();
  audioStatus.textContent = 'Đã đọc xong ✓';
}

function onAudioTimeUpdate() {
  updateAudioStatus();
  syncAudioHighlight();
}

function updateAudioStatus() {
  if (!audioPlayer) return;
  const current = formatTime(audioPlayer.currentTime);
  const duration = formatTime(audioPlayer.duration || 0);
  audioStatus.textContent = `${current} / ${duration}`;
}

function formatTime(seconds) {
  if (!isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function syncAudioHighlight() {
  if (!audioPlayer || !audioMetadata[currentChapterId]) return;

  const metadata = audioMetadata[currentChapterId];
  const estimatedDuration = metadata.estimated_duration_sec;
  const progress = audioPlayer.currentTime / (audioPlayer.duration || estimatedDuration);

  const frame = document.getElementById('chapter-frame');
  if (!frame || !frame.contentDocument) return;

  const paragraphs = frame.contentDocument.querySelectorAll('p');
  const targetIdx = Math.floor(progress * paragraphs.length);

  if (targetIdx >= 0 && targetIdx < paragraphs.length) {
    const para = paragraphs[targetIdx];
    if (audioHighlightedElement) {
      audioHighlightedElement.style.backgroundColor = '';
    }
    para.style.backgroundColor = 'rgba(201, 168, 76, 0.2)';
    audioHighlightedElement = para;
  }
}

function clearAudioHighlight() {
  if (audioHighlightedElement) {
    audioHighlightedElement.style.backgroundColor = '';
    audioHighlightedElement = null;
  }
}

async function loadAudioMetadata() {
  try {
    const response = await fetch('audio-metadata/' + currentChapterId + '.json');
    if (response.ok) {
      audioMetadata[currentChapterId] = await response.json();
    }
  } catch (err) {
    console.warn('Audio metadata not found for ' + currentChapterId);
  }
}

// Audio bar event listeners
audioPlay.addEventListener('click', toggleAudioPlayback);
audioStop.addEventListener('click', () => {
  stopAudio();
  audioStatus.textContent = 'Đã dừng';
});
audioClose.addEventListener('click', closeAudioBar);
audioSpeed.addEventListener('change', changeAudioSpeed);

// Open audio bar button
btnAudio.addEventListener('click', () => {
  audioBar.hidden = false;
  btnAudio.classList.add('active');
  if (!audioPlayer) initAudioPlayer();
});

// ── EXPORT / IMPORT ──
document.getElementById('btn-export').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'pmbok6-progress.json'; a.click();
  URL.revokeObjectURL(url);
});

document.getElementById('import-file').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      Object.assign(state, JSON.parse(ev.target.result));
      localStorage.setItem(LS_KEY, JSON.stringify(state));
      renderSidebar();
      loadChapter(state.lastChapter);
      document.getElementById('gist-modal').hidden = true;
    } catch (_) {
      alert('File JSON không hợp lệ.');
    }
  };
  reader.readAsText(file);
});

// ── BOOT ──
document.addEventListener('DOMContentLoaded', async () => {
  loadFromLocalStorage();
  loadGistConfig();
  if (gistConfig?.token && gistConfig?.gistId) {
    setSyncIndicator('saving');
    await loadFromGist();
    setSyncIndicator('saved');
  } else if (!gistConfig) {
    document.getElementById('gist-modal').hidden = false;
  }
  renderSidebar();
  loadChapter(state.lastChapter);
});
