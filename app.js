/* PMBOK6 app */

const CHAPTERS = [
  { id: '01_instruction',            num: 1,  title: 'Giới Thiệu' },
  { id: '02_environment',            num: 2,  title: 'Môi Trường Dự Án' },
  { id: '03_pm_role',                num: 3,  title: 'Vai Trò Của Người Quản Lý Dự Án' },
  { id: '04_integration_management', num: 4,  title: 'Quản Lý Tích Hợp Dự Án' },
  { id: '05_scope_management',       num: 5,  title: 'Quản Lý Phạm Vi Dự Án' },
  { id: '06_schedule_management',    num: 6,  title: 'Quản Lý Tiến Độ Dự Án' },
  { id: '07_cost_management',        num: 7,  title: 'Quản Lý Chi Phí Dự Án' },
  { id: '08_quality_management',     num: 8,  title: 'Quản Lý Chất Lượng Dự Án' },
  { id: '09_resource_management',    num: 9,  title: 'Quản Lý Nguồn Lực Dự Án' },
  { id: '10_communications_management', num: 10, title: 'Quản Lý Truyền Thông Dự Án' },
  { id: '11_risk_management',        num: 11, title: 'Quản Lý Rủi Ro Dự Án' },
  { id: '12_procurement_management', num: 12, title: 'Quản Lý Mua Sắm Dự Án' },
  { id: '13_stakeholder_management', num: 13, title: 'Quản Lý Các Bên Liên Quan' },
  { id: '14_standard_for_pm',        num: 14, title: 'Tiêu Chuẩn Quản Lý Dự Án' },
  { id: '15_appendices_glossary',    num: 15, title: 'Phụ Lục & Từ Điển Thuật Ngữ' },
  { id: '16_agile_practice_guide',   num: 16, title: 'Hướng Dẫn Thực Hành Agile' },
];

const TRANSLATED_IDS = new Set([
  '01_instruction', '02_environment', '03_pm_role',
  '04_integration_management', '05_scope_management',
  '06_schedule_management', '07_cost_management',
]);

// ── STATE ──
let state = {
  progress: {},
  highlights: {},
  lastChapter: CHAPTERS[0].id,
};
let gistConfig = null;
let currentChapterId = null;
let saveTimer = null;
let pendingHighlight = null;

const LS_KEY = 'pmbok6_progress';

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
  document.getElementById('progress-fill').style.width = (done / CHAPTERS.length * 100).toFixed(1) + '%';
}

// ── SIDEBAR MOBILE TOGGLE ──
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

// ── SCHEDULE SAVE ──
function scheduleSave() {
  clearTimeout(saveTimer);
  setSyncIndicator('saving');
  saveTimer = setTimeout(() => saveData(), 2000);
}

function setSyncIndicator(s) {
  const el = document.getElementById('sync-indicator');
  if (s === 'saved')  { el.className = 'sync-saved';  el.textContent = '☁ Đã lưu'; }
  if (s === 'saving') { el.className = 'sync-saving'; el.textContent = '⟳ Đang lưu...'; }
  if (s === 'error')  { el.className = 'sync-error';  el.textContent = '⚠ Lỗi sync'; }
}

// ── LOCALSTORAGE ──
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
  if (gistConfig && gistConfig.token && gistConfig.gistId) {
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

// ── CHAPTER LOADING ──
async function loadChapter(id) {
  currentChapterId = id;
  state.lastChapter = id;

  document.querySelectorAll('#chapter-nav a').forEach(a => {
    a.classList.toggle('active', a.dataset.id === id);
  });

  const ch = CHAPTERS.find(c => c.id === id) || CHAPTERS[0];
  document.getElementById('toolbar-chapter-title').textContent =
    `Chương ${ch.num} – ${ch.title}`;

  const content = document.getElementById('content');
  content.innerHTML = '<p style="padding:2rem;color:#888">Đang tải...</p>';

  if (!TRANSLATED_IDS.has(id)) {
    content.innerHTML = `
      <div class="chapter-placeholder">
        <div class="placeholder-icon">🔄</div>
        <h2>Chương ${ch.num} – ${ch.title}</h2>
        <p>Chương này chưa được dịch sang tiếng Việt.</p>
      </div>`;
    return;
  }

  try {
    const res = await fetch(`chapters/${id}.html`);
    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    doc.querySelector('#sidebar')?.remove();

    const main = doc.querySelector('#main') || doc.body;
    content.innerHTML = main.innerHTML;

    const prog = getProgress(id);
    const wrap = document.getElementById('content-wrap');
    wrap.scrollTop = prog.scrollPos > 0 ? prog.scrollPos : 0;

    const btn = document.getElementById('btn-mark-done');
    btn.textContent = prog.status === 'done' ? '✓ Đã xong' : '✓ Xong';
    btn.classList.toggle('is-done', prog.status === 'done');

    if (prog.status === 'unread') {
      state.progress[id] = { status: 'reading', scrollPos: 0 };
      renderSidebar();
      scheduleSave();
    }

    applyHighlights(id);

  } catch (err) {
    const errMsg = document.createElement('p');
    errMsg.style.cssText = 'padding:2rem;color:#d32f2f';
    errMsg.textContent = `Lỗi tải chương: ${err.message}`;
    content.innerHTML = '';
    content.appendChild(errMsg);
  }
}

// Scroll tracking
document.getElementById('content-wrap').addEventListener('scroll', () => {
  if (!currentChapterId) return;
  const pos = document.getElementById('content-wrap').scrollTop;
  if (!state.progress[currentChapterId]) {
    state.progress[currentChapterId] = { status: 'reading', scrollPos: 0 };
  }
  state.progress[currentChapterId].scrollPos = pos;
  scheduleSave();
}, { passive: true });

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

// ── XPATH UTILITIES ──
function getXPath(node) {
  if (node.nodeType === Node.TEXT_NODE) node = node.parentNode;
  const parts = [];
  const root = document.getElementById('content');
  while (node && node !== root) {
    let idx = 1;
    let sib = node.previousSibling;
    while (sib) { if (sib.nodeName === node.nodeName) idx++; sib = sib.previousSibling; }
    parts.unshift(`${node.nodeName.toLowerCase()}[${idx}]`);
    node = node.parentNode;
  }
  return parts.join('/');
}

function resolveXPath(xpath) {
  try {
    const result = document.evaluate(
      xpath, document.getElementById('content'),
      null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
    );
    return result.singleNodeValue;
  } catch (_) { return null; }
}

// ── HIGHLIGHT POPUP ──
const popup = document.getElementById('highlight-popup');
let activeHighlightEl = null;
let noteTargetHighlight = null;   // existing mark being edited
let noteTargetPending = null;     // pending range for new highlight

document.addEventListener('mouseup', handleSelectionEnd);
document.addEventListener('touchend', handleSelectionEnd);

function handleSelectionEnd() {
  const sel = window.getSelection();
  if (!sel || sel.isCollapsed || !sel.rangeCount) {
    hidePopup();
    return;
  }
  const range = sel.getRangeAt(0);
  const content = document.getElementById('content');
  if (!content.contains(range.commonAncestorContainer)) {
    hidePopup();
    return;
  }
  activeHighlightEl = null;
  document.getElementById('hl-delete-btn').hidden = true;
  pendingHighlight = { range, color: null, note: '' };
  positionPopup(range);
}

document.querySelectorAll('.hl-color').forEach(btn => {
  btn.addEventListener('click', () => {
    if (activeHighlightEl) {
      activeHighlightEl.dataset.color = btn.dataset.color;
      saveHighlightFromEl(activeHighlightEl);
      hidePopup();
    } else if (pendingHighlight && pendingHighlight.range) {
      applyNewHighlight(pendingHighlight.range, btn.dataset.color, '');
      hidePopup();
    }
  });
});

document.getElementById('hl-note-btn').addEventListener('click', () => {
  noteTargetHighlight = activeHighlightEl;
  noteTargetPending = pendingHighlight;
  const existing = noteTargetHighlight ? (noteTargetHighlight.dataset.note || '') : '';
  document.getElementById('note-textarea').value = existing;
  document.getElementById('note-modal').hidden = false;
  hidePopup();
});

document.getElementById('hl-delete-btn').addEventListener('click', () => {
  if (!activeHighlightEl) return;
  const hlId = activeHighlightEl.dataset.hlId;
  const parent = activeHighlightEl.parentNode;
  while (activeHighlightEl.firstChild) parent.insertBefore(activeHighlightEl.firstChild, activeHighlightEl);
  parent.removeChild(activeHighlightEl);
  parent.normalize();
  if (state.highlights[currentChapterId]) {
    state.highlights[currentChapterId] = state.highlights[currentChapterId].filter(h => h.id !== hlId);
  }
  hidePopup();
  scheduleSave();
});

document.getElementById('content').addEventListener('click', e => {
  const mark = e.target.closest('mark.hl');
  if (!mark) return;
  window.getSelection()?.removeAllRanges();
  activeHighlightEl = mark;
  pendingHighlight = null;
  document.getElementById('hl-delete-btn').hidden = false;
  positionPopupAtEl(mark);
});

function positionPopup(range) {
  const rect = range.getBoundingClientRect();
  popup.hidden = false;
  const top = rect.top - popup.offsetHeight - 8;
  popup.style.top  = (top < 8 ? rect.bottom + 8 : top) + 'px';
  popup.style.left = Math.max(8, rect.left + rect.width / 2 - popup.offsetWidth / 2) + 'px';
}

function positionPopupAtEl(el) {
  const rect = el.getBoundingClientRect();
  popup.hidden = false;
  const top = rect.top - popup.offsetHeight - 8;
  popup.style.top  = (top < 8 ? rect.bottom + 8 : top) + 'px';
  popup.style.left = Math.max(8, rect.left + rect.width / 2 - popup.offsetWidth / 2) + 'px';
}

function hidePopup() {
  popup.hidden = true;
  pendingHighlight = null;
  activeHighlightEl = null;
}

document.addEventListener('mousedown', e => {
  if (!popup.hidden && !popup.contains(e.target)) hidePopup();
});

// ── APPLY / SAVE HIGHLIGHTS ──
function generateId() {
  return 'h_' + Math.random().toString(36).slice(2, 9);
}

function applyNewHighlight(range, color, note) {
  if (!currentChapterId) return;
  const id = generateId();
  const xpath = getXPath(range.startContainer);

  // Compute element-relative character offsets for restoring across reloads
  let startOffset = range.startOffset;
  let endOffset = range.endOffset;
  if (range.startContainer.nodeType === Node.TEXT_NODE) {
    const parent = range.startContainer.parentNode;
    const root = document.getElementById('content');
    if (parent !== root) {
      const walker = document.createTreeWalker(parent, NodeFilter.SHOW_TEXT);
      let pos = 0;
      let node = walker.nextNode();
      while (node) {
        if (node === range.startContainer) { startOffset = pos + range.startOffset; break; }
        pos += node.textContent.length;
        node = walker.nextNode();
      }
      pos = 0;
      const walker2 = document.createTreeWalker(parent, NodeFilter.SHOW_TEXT);
      node = walker2.nextNode();
      while (node) {
        if (node === range.endContainer) { endOffset = pos + range.endOffset; break; }
        pos += node.textContent.length;
        node = walker2.nextNode();
      }
    }
  }

  const mark = document.createElement('mark');
  mark.className = 'hl';
  mark.dataset.color = color;
  mark.dataset.note = note;
  mark.dataset.hlId = id;
  try {
    range.surroundContents(mark);
  } catch (_) {
    return;
  }
  window.getSelection()?.removeAllRanges();

  if (!state.highlights[currentChapterId]) state.highlights[currentChapterId] = [];
  state.highlights[currentChapterId].push({ id, xpath, startOffset, endOffset, color, note });
  scheduleSave();
}

function saveHighlightFromEl(el) {
  const hlId = el.dataset.hlId;
  if (!state.highlights[currentChapterId]) return;
  const hl = state.highlights[currentChapterId].find(h => h.id === hlId);
  if (hl) {
    hl.color = el.dataset.color;
    hl.note = el.dataset.note || '';
    scheduleSave();
  }
}

function findTextNodeAt(root, offset) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let pos = 0;
  let node = walker.nextNode();
  while (node) {
    const len = node.textContent.length;
    if (pos + len > offset) return { node, localOffset: offset - pos };
    pos += len;
    node = walker.nextNode();
  }
  return null;
}

function applyHighlights(chapterId) {
  const list = state.highlights[chapterId];
  if (!list || list.length === 0) return;
  list.forEach(hl => {
    try {
      const node = resolveXPath(hl.xpath);
      if (!node) return;
      if (node.nodeType === Node.TEXT_NODE) {
        const range = document.createRange();
        range.setStart(node, hl.startOffset);
        range.setEnd(node, hl.endOffset);
        const mark = document.createElement('mark');
        mark.className = 'hl';
        mark.dataset.color = hl.color;
        mark.dataset.note = hl.note || '';
        mark.dataset.hlId = hl.id;
        range.surroundContents(mark);
      } else {
        const start = findTextNodeAt(node, hl.startOffset);
        const end = findTextNodeAt(node, hl.endOffset);
        if (!start || !end) return;
        const range = document.createRange();
        range.setStart(start.node, start.localOffset);
        range.setEnd(end.node, end.localOffset);
        const mark = document.createElement('mark');
        mark.className = 'hl';
        mark.dataset.color = hl.color;
        mark.dataset.note = hl.note || '';
        mark.dataset.hlId = hl.id;
        range.surroundContents(mark);
      }
    } catch (_) {
      // skip broken highlights silently
    }
  });
}

// ── NOTE MODAL ──
document.getElementById('note-cancel').addEventListener('click', () => {
  noteTargetHighlight = null;
  noteTargetPending = null;
  document.getElementById('note-modal').hidden = true;
});

document.getElementById('note-save').addEventListener('click', () => {
  const note = document.getElementById('note-textarea').value.trim();
  if (noteTargetHighlight) {
    noteTargetHighlight.dataset.note = note;
    saveHighlightFromEl(noteTargetHighlight);
  } else if (noteTargetPending && noteTargetPending.range) {
    applyNewHighlight(noteTargetPending.range, 'yellow', note);
  }
  noteTargetHighlight = null;
  noteTargetPending = null;
  document.getElementById('note-modal').hidden = true;
});

// ── GIST SYNC ──
const GIST_FILENAME = 'pmbok6-progress.json';
const LS_GIST_KEY = 'pmbok6_gist';

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
  const found = gists.find(g => g.files && g.files[GIST_FILENAME]);
  if (found) {
    saveGistConfig({ ...gistConfig, gistId: found.id });
    return found.id;
  }
  const created = await gistRequest('POST', '/gists', {
    description: 'PMBOK 6 learning progress',
    public: false,
    files: { [GIST_FILENAME]: { content: JSON.stringify(state, null, 2) } },
  });
  saveGistConfig({ ...gistConfig, gistId: created.id });
  return created.id;
}

async function loadFromGist() {
  if (!gistConfig || !gistConfig.token || !gistConfig.gistId) return;
  try {
    const data = await gistRequest('GET', `/gists/${gistConfig.gistId}`);
    const content = data.files[GIST_FILENAME] && data.files[GIST_FILENAME].content;
    if (content) Object.assign(state, JSON.parse(content));
  } catch (_) {}
}

async function saveToGist() {
  if (!gistConfig || !gistConfig.token || !gistConfig.gistId) return;
  await gistRequest('PATCH', `/gists/${gistConfig.gistId}`, {
    files: { [GIST_FILENAME]: { content: JSON.stringify(state, null, 2) } },
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
    await gistRequest('GET', '/gists');
    await findOrCreateGist();
    await loadFromGist();
    saveGistConfig(gistConfig);
    statusEl.textContent = '✓ Kết nối thành công!';
    statusEl.className = 'ok';
    renderSidebar();
    setTimeout(() => { document.getElementById('gist-modal').hidden = true; }, 1200);
  } catch (err) {
    statusEl.textContent = 'Lỗi: ' + err.message;
    statusEl.className = 'error';
    gistConfig = null;
  }
});

document.getElementById('sync-indicator').addEventListener('click', () => {
  if (document.getElementById('sync-indicator').classList.contains('sync-error')) {
    scheduleSave();
  }
});

// ── EXPORT / IMPORT ──
document.getElementById('btn-export').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'pmbok6-progress.json';
  a.click();
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
  if (gistConfig && gistConfig.token && gistConfig.gistId) {
    setSyncIndicator('saving');
    await loadFromGist();
    setSyncIndicator('saved');
  } else if (!gistConfig) {
    document.getElementById('gist-modal').hidden = false;
  }
  renderSidebar();
  loadChapter(state.lastChapter);
});
