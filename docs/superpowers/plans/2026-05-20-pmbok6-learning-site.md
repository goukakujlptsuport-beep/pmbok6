# PMBOK 6 Learning Site — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static responsive learning website that displays Vietnamese PMBOK 6 chapters with cross-device progress sync, scroll memory, text highlighting, and inline notes via GitHub Gist.

**Architecture:** Single shell `index.html` + `app.js` + `style.css`. On chapter select, `app.js` fetches the chapter HTML, strips its `<head>` and its own `#sidebar`, injects the remaining content into `#content`, then restores scroll position and re-renders saved highlights. All state persists to a single GitHub Gist JSON file, with localStorage as offline fallback.

**Tech Stack:** Vanilla HTML/CSS/JS (ES2020, no build step), GitHub Gist REST API v3, localStorage, CSS custom properties, CSS Grid/Flexbox.

---

## File Map

| File | Responsibility |
|------|---------------|
| `index.html` | Shell: sidebar, toolbar, `#content` mount point |
| `style.css` | Shell styles only — sidebar, toolbar, responsive breakpoints, highlight marks, modals |
| `app.js` | All logic: routing, fetch+inject, progress, highlights, Gist sync |
| `chapters/*.html` | Source chapter files (copied from Downloads, not modified) |

---

## Task 1: Project scaffold + copy chapters

**Files:**
- Create: `index.html`
- Create: `style.css`
- Create: `app.js`
- Create: `chapters/` (copy 16 files)

- [ ] **Step 1: Create folder structure**

```bash
mkdir -p /Users/ts-trongtung.nguyen/Workspace/pmp/chapters
cp /Users/ts-trongtung.nguyen/Downloads/files/dich/*.html /Users/ts-trongtung.nguyen/Workspace/pmp/chapters/
ls /Users/ts-trongtung.nguyen/Workspace/pmp/chapters/
```

Expected: 16 `.html` files listed.

- [ ] **Step 2: Create `index.html` shell**

```html
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PMBOK® Guide 6 – Tiếng Việt</title>
  <link href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;1,400&family=Source+Sans+3:wght@300;400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
</head>
<body>

<!-- SIDEBAR -->
<aside id="sidebar">
  <div id="sidebar-header">
    <button id="sidebar-close" aria-label="Đóng menu">✕</button>
    <div class="book-label">PMBOK® Guide</div>
    <h2>Hướng Dẫn Quản Lý Dự Án</h2>
    <div class="edition">Lần xuất bản thứ 6 · Tiếng Việt</div>
  </div>
  <div id="progress-bar-wrap">
    <div id="progress-label">Tiến độ: <span id="progress-count">0</span>/16 chương</div>
    <div id="progress-bar"><div id="progress-fill"></div></div>
  </div>
  <nav id="chapter-nav"></nav>
  <div id="sidebar-footer">
    <button id="btn-gist-settings">⚙ Cài đặt Gist</button>
  </div>
</aside>

<!-- OVERLAY for mobile -->
<div id="sidebar-overlay"></div>

<!-- MAIN -->
<div id="main">
  <header id="toolbar">
    <button id="btn-hamburger" aria-label="Mở menu">☰</button>
    <span id="toolbar-chapter-title"></span>
    <div id="toolbar-right">
      <button id="btn-mark-done" title="Đánh dấu đã đọc xong">✓ Xong</button>
      <span id="sync-indicator" class="sync-saved">☁ Đã lưu</span>
    </div>
  </header>

  <div id="content-wrap">
    <div id="content"></div>
  </div>
</div>

<!-- HIGHLIGHT POPUP -->
<div id="highlight-popup" hidden>
  <button class="hl-color" data-color="yellow" title="Vàng">🟡</button>
  <button class="hl-color" data-color="green" title="Xanh">🟢</button>
  <button class="hl-color" data-color="red" title="Đỏ">🔴</button>
  <button id="hl-note-btn" title="Ghi chú">✏️</button>
  <button id="hl-delete-btn" hidden title="Xóa">🗑</button>
</div>

<!-- NOTE MODAL -->
<div id="note-modal" hidden>
  <div id="note-modal-box">
    <h3>Ghi chú</h3>
    <textarea id="note-textarea" rows="4" placeholder="Nhập ghi chú..."></textarea>
    <div id="note-modal-actions">
      <button id="note-cancel">Hủy</button>
      <button id="note-save">Lưu</button>
    </div>
  </div>
</div>

<!-- GIST SETUP MODAL -->
<div id="gist-modal" hidden>
  <div id="gist-modal-box">
    <h3>⚙ Kết nối GitHub Gist</h3>
    <ol>
      <li>Vào <strong>github.com → Settings → Developer Settings → Personal Access Tokens (classic)</strong></li>
      <li>Tạo token với quyền: <code>gist</code></li>
      <li>Dán token vào đây:</li>
    </ol>
    <input type="password" id="gist-token-input" placeholder="ghp_xxxxxxxxxxxx">
    <div id="gist-modal-actions">
      <button id="gist-connect">Kết nối</button>
      <button id="gist-offline">Bỏ qua — dùng offline</button>
    </div>
    <p id="gist-status"></p>
    <p class="gist-note">🔒 Token chỉ lưu trong localStorage, không gửi đi đâu ngoài api.github.com</p>
  </div>
</div>

<script src="app.js"></script>
</body>
</html>
```

- [ ] **Step 3: Create empty `style.css` and `app.js`**

Create `style.css` with just a comment: `/* PMBOK6 shell styles */`
Create `app.js` with just a comment: `/* PMBOK6 app */`

- [ ] **Step 4: Verify files exist**

```bash
ls /Users/ts-trongtung.nguyen/Workspace/pmp/
```

Expected: `index.html  style.css  app.js  chapters/`

- [ ] **Step 5: Commit**

```bash
cd /Users/ts-trongtung.nguyen/Workspace/pmp
git init
git add index.html style.css app.js chapters/
git commit -m "feat: scaffold shell and copy 16 chapters"
```

---

## Task 2: Shell styles (responsive, 3 breakpoints)

**Files:**
- Modify: `style.css`

- [ ] **Step 1: Write full `style.css`**

```css
/* PMBOK6 shell styles */
:root {
  --navy: #1a2744;
  --gold: #c9a84c;
  --gold-light: #e8d5a3;
  --cream: #fdf8f0;
  --text: #2c2c2c;
  --text-light: #5a5a5a;
  --border: #d4c89a;
  --accent: #8b1a1a;
  --sidebar-w: 260px;
  --toolbar-h: 52px;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Source Sans 3', sans-serif;
  background: var(--cream);
  color: var(--text);
  min-height: 100vh;
}

/* ── SIDEBAR ── */
#sidebar {
  width: var(--sidebar-w);
  background: var(--navy);
  color: #ccd4e8;
  position: fixed;
  top: 0; left: 0; bottom: 0;
  overflow-y: auto;
  z-index: 200;
  display: flex;
  flex-direction: column;
  border-right: 3px solid var(--gold);
  transition: transform 0.25s ease;
}

#sidebar-close { display: none; }

#sidebar-header {
  background: linear-gradient(135deg, #0f1d3a 0%, #1a2744 100%);
  padding: 1.2rem 1.2rem 1rem;
  border-bottom: 2px solid var(--gold);
  flex-shrink: 0;
}
#sidebar-header .book-label {
  font-size: 0.62rem; font-weight: 700; letter-spacing: 0.2em;
  text-transform: uppercase; color: var(--gold); margin-bottom: 0.3rem;
}
#sidebar-header h2 { font-size: 0.9rem; font-weight: 700; color: #fff; line-height: 1.3; margin-bottom: 0.2rem; }
#sidebar-header .edition { font-size: 0.7rem; color: var(--gold-light); font-style: italic; }

#progress-bar-wrap { padding: 0.8rem 1.2rem; border-bottom: 1px solid rgba(255,255,255,0.08); flex-shrink: 0; }
#progress-label { font-size: 0.72rem; color: #8896b0; margin-bottom: 0.4rem; }
#progress-bar { height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden; }
#progress-fill { height: 100%; background: var(--gold); border-radius: 3px; transition: width 0.4s ease; width: 0%; }

#chapter-nav { flex: 1; overflow-y: auto; padding: 0.5rem 0; }
#chapter-nav a {
  display: flex; align-items: center; gap: 0.6rem;
  font-size: 0.8rem; color: #aab8d0; text-decoration: none;
  padding: 0.5rem 1.2rem; border-left: 3px solid transparent;
  line-height: 1.3; transition: background 0.15s, color 0.15s;
}
#chapter-nav a:hover, #chapter-nav a.active {
  color: #fff; background: rgba(201,168,76,0.12); border-left-color: var(--gold);
}
#chapter-nav a.status-done .ch-icon { color: #4caf50; }
#chapter-nav a.status-reading .ch-icon { color: var(--gold); }
#chapter-nav a.status-placeholder { opacity: 0.5; cursor: default; }
#chapter-nav .ch-icon { font-size: 0.8rem; flex-shrink: 0; width: 1rem; text-align: center; }
#chapter-nav .ch-text { flex: 1; }

#sidebar-footer { padding: 0.8rem 1.2rem; border-top: 1px solid rgba(255,255,255,0.08); flex-shrink: 0; }
#btn-gist-settings {
  width: 100%; background: transparent; border: 1px solid rgba(255,255,255,0.15);
  color: #8896b0; font-size: 0.75rem; padding: 0.5rem; border-radius: 4px; cursor: pointer;
}
#btn-gist-settings:hover { background: rgba(255,255,255,0.05); color: #fff; }

/* ── OVERLAY ── */
#sidebar-overlay {
  display: none; position: fixed; inset: 0;
  background: rgba(0,0,0,0.5); z-index: 190;
}

/* ── MAIN ── */
#main {
  margin-left: var(--sidebar-w);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ── TOOLBAR ── */
#toolbar {
  position: sticky; top: 0; z-index: 100;
  height: var(--toolbar-h);
  background: var(--navy);
  border-bottom: 2px solid var(--gold);
  display: flex; align-items: center; gap: 0.8rem;
  padding: 0 1.2rem;
}
#btn-hamburger {
  display: none; background: transparent; border: none;
  color: var(--gold); font-size: 1.3rem; cursor: pointer; padding: 0.2rem 0.4rem;
}
#toolbar-chapter-title {
  flex: 1; font-size: 0.82rem; color: var(--gold-light);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
#toolbar-right { display: flex; align-items: center; gap: 0.8rem; flex-shrink: 0; }
#btn-mark-done {
  background: transparent; border: 1px solid var(--gold);
  color: var(--gold); font-size: 0.75rem; padding: 0.3rem 0.7rem;
  border-radius: 4px; cursor: pointer; white-space: nowrap;
}
#btn-mark-done:hover { background: var(--gold); color: var(--navy); }
#btn-mark-done.is-done { background: #4caf50; border-color: #4caf50; color: #fff; }

#sync-indicator { font-size: 0.72rem; white-space: nowrap; }
#sync-indicator.sync-saved { color: #4caf50; }
#sync-indicator.sync-saving { color: #aab8d0; }
#sync-indicator.sync-error { color: #ef5350; cursor: pointer; }

/* ── CONTENT ── */
#content-wrap {
  flex: 1;
  padding: 0;
  max-width: 960px;
  width: 100%;
  margin: 0 auto;
}
#content { padding: 0 2.5rem 5rem; }

/* content inherits chapter's own styles — we only override the chapter's own #sidebar */
#content #sidebar { display: none !important; }
#content #main, #content body { margin: 0 !important; }

/* ── HIGHLIGHTS ── */
mark.hl {
  border-radius: 2px; cursor: pointer; padding: 1px 0;
  position: relative;
}
mark.hl[data-color="yellow"] { background: rgba(255,241,118,0.6); }
mark.hl[data-color="green"]  { background: rgba(165,214,167,0.6); }
mark.hl[data-color="red"]    { background: rgba(239,154,154,0.6); }
mark.hl[data-note]:not([data-note=""]):after {
  content: '✏';
  font-size: 0.65rem;
  vertical-align: super;
  margin-left: 2px;
  opacity: 0.7;
}

/* ── HIGHLIGHT POPUP ── */
#highlight-popup {
  position: fixed; z-index: 300;
  background: var(--navy); border: 1px solid var(--gold);
  border-radius: 8px; padding: 0.4rem 0.6rem;
  display: flex; gap: 0.3rem; align-items: center;
  box-shadow: 0 4px 16px rgba(0,0,0,0.3);
}
#highlight-popup button {
  background: transparent; border: none; cursor: pointer;
  font-size: 1.1rem; padding: 0.2rem; border-radius: 4px;
  min-width: 44px; min-height: 44px;
  display: flex; align-items: center; justify-content: center;
}
#highlight-popup button:hover { background: rgba(255,255,255,0.1); }

/* ── NOTE MODAL ── */
#note-modal {
  position: fixed; inset: 0; z-index: 400;
  background: rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center;
  padding: 1rem;
}
#note-modal[hidden] { display: none; }
#note-modal-box {
  background: #fff; border-radius: 10px;
  padding: 1.5rem; width: 100%; max-width: 420px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.25);
}
#note-modal-box h3 { font-size: 1rem; margin-bottom: 0.8rem; color: var(--navy); }
#note-textarea {
  width: 100%; border: 1px solid var(--border); border-radius: 6px;
  padding: 0.6rem; font-size: 0.9rem; resize: vertical; font-family: inherit;
}
#note-modal-actions { display: flex; justify-content: flex-end; gap: 0.6rem; margin-top: 0.8rem; }
#note-cancel { background: transparent; border: 1px solid #ccc; padding: 0.4rem 0.9rem; border-radius: 5px; cursor: pointer; }
#note-save { background: var(--navy); color: #fff; border: none; padding: 0.4rem 0.9rem; border-radius: 5px; cursor: pointer; }

/* ── GIST MODAL ── */
#gist-modal {
  position: fixed; inset: 0; z-index: 400;
  background: rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center;
  padding: 1rem;
}
#gist-modal[hidden] { display: none; }
#gist-modal-box {
  background: #fff; border-radius: 10px;
  padding: 1.5rem; width: 100%; max-width: 480px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.25);
}
#gist-modal-box h3 { font-size: 1rem; margin-bottom: 1rem; color: var(--navy); }
#gist-modal-box ol { margin: 0 0 1rem 1.2rem; font-size: 0.88rem; line-height: 1.7; }
#gist-modal-box code { background: #f0f0f0; padding: 0.1em 0.4em; border-radius: 3px; font-size: 0.85rem; }
#gist-token-input {
  width: 100%; border: 1px solid var(--border); border-radius: 6px;
  padding: 0.6rem; font-size: 0.9rem; font-family: monospace; margin-bottom: 0.8rem;
}
#gist-modal-actions { display: flex; gap: 0.6rem; flex-wrap: wrap; }
#gist-connect { background: var(--navy); color: #fff; border: none; padding: 0.5rem 1.1rem; border-radius: 5px; cursor: pointer; }
#gist-offline { background: transparent; border: 1px solid #ccc; padding: 0.5rem 1.1rem; border-radius: 5px; cursor: pointer; font-size: 0.85rem; }
#gist-status { margin-top: 0.6rem; font-size: 0.82rem; min-height: 1.2rem; }
#gist-status.error { color: #d32f2f; }
#gist-status.ok { color: #388e3c; }
.gist-note { font-size: 0.75rem; color: #888; margin-top: 0.6rem; }

/* ── PLACEHOLDER CHAPTER ── */
.chapter-placeholder {
  text-align: center; padding: 4rem 2rem;
  color: var(--text-light);
}
.chapter-placeholder .placeholder-icon { font-size: 3rem; margin-bottom: 1rem; }
.chapter-placeholder h2 { color: var(--navy); margin-bottom: 0.5rem; font-size: 1.3rem; }
.chapter-placeholder p { font-size: 0.9rem; }

/* ── TABLET (768–1024px) ── */
@media (max-width: 1024px) and (min-width: 768px) {
  :root { --sidebar-w: 64px; }
  #sidebar-header .book-label,
  #sidebar-header h2,
  #sidebar-header .edition,
  #progress-bar-wrap,
  #chapter-nav .ch-text,
  #sidebar-footer #btn-gist-settings { display: none; }
  #chapter-nav a { padding: 0.7rem; justify-content: center; }
  #chapter-nav .ch-icon { width: auto; font-size: 1rem; }
  #sidebar { overflow: visible; }
  #sidebar-header { padding: 0.8rem; text-align: center; }
}

/* ── MOBILE (< 768px) ── */
@media (max-width: 767px) {
  #sidebar {
    transform: translateX(-100%);
    width: 80vw; max-width: 300px;
  }
  #sidebar.open { transform: translateX(0); }
  #sidebar-overlay.open { display: block; }
  #sidebar-close {
    display: block; position: absolute; top: 0.8rem; right: 0.8rem;
    background: transparent; border: none; color: #aab8d0;
    font-size: 1.1rem; cursor: pointer; padding: 0.3rem;
  }
  #main { margin-left: 0; }
  #btn-hamburger { display: flex; }
  #content { padding: 0 1rem 4rem; }
  #toolbar-chapter-title { font-size: 0.75rem; }
}
```

- [ ] **Step 2: Verify by opening index.html in browser**

Open `file:///Users/ts-trongtung.nguyen/Workspace/pmp/index.html` — should show dark navy shell with empty sidebar and content area.

- [ ] **Step 3: Commit**

```bash
git add style.css
git commit -m "feat: add responsive shell styles (mobile/tablet/desktop)"
```

---

## Task 3: Chapter metadata config + sidebar rendering

**Files:**
- Modify: `app.js`

- [ ] **Step 1: Add chapter config and sidebar render to `app.js`**

```js
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

// Chapters whose HTML body has real content (detect by file size > 10 lines)
const TRANSLATED_IDS = new Set([
  '01_instruction', '02_environment', '03_pm_role',
  '04_integration_management', '05_scope_management',
  '06_schedule_management', '07_cost_management',
]);

// ── STATE ──
let state = {
  progress: {},   // { chapterId: { status: 'unread'|'reading'|'done', scrollPos: 0 } }
  highlights: {}, // { chapterId: [{ id, xpath, startOffset, endOffset, color, note }] }
  lastChapter: CHAPTERS[0].id,
};
let gistConfig = null; // { token, gistId } or null
let currentChapterId = null;
let saveTimer = null;
let pendingHighlight = null; // selection being colored

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

document.addEventListener('DOMContentLoaded', () => {
  renderSidebar();
});
```

- [ ] **Step 2: Open index.html in browser**

Should see 16 chapters in sidebar: ✓/●/○/⚠ icons, progress bar at 0%.

- [ ] **Step 3: Commit**

```bash
git add app.js
git commit -m "feat: render chapter sidebar with status icons and progress bar"
```

---

## Task 4: Chapter loading (fetch + inject)

**Files:**
- Modify: `app.js` (append to existing code)

- [ ] **Step 1: Add `loadChapter` function**

Append to `app.js`:

```js
// ── CHAPTER LOADING ──
async function loadChapter(id) {
  currentChapterId = id;
  state.lastChapter = id;

  // Mark active in sidebar
  document.querySelectorAll('#chapter-nav a').forEach(a => {
    a.classList.toggle('active', a.dataset.id === id);
  });

  const ch = CHAPTERS.find(c => c.id === id);
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

    // Remove the chapter's own sidebar (it has its own nav)
    doc.querySelector('#sidebar')?.remove();

    // Get main content — prefer #main, fallback to body
    const main = doc.querySelector('#main') || doc.body;
    content.innerHTML = main.innerHTML;

    // Restore scroll
    const prog = getProgress(id);
    if (prog.scrollPos > 0) {
      document.getElementById('content-wrap').scrollTop = prog.scrollPos;
    } else {
      document.getElementById('content-wrap').scrollTop = 0;
    }

    // Update done button state
    const btn = document.getElementById('btn-mark-done');
    btn.textContent = prog.status === 'done' ? '✓ Đã xong' : '✓ Xong';
    btn.classList.toggle('is-done', prog.status === 'done');

    // Update status to 'reading' if was 'unread'
    if (prog.status === 'unread') {
      state.progress[id] = { status: 'reading', scrollPos: 0 };
      renderSidebar();
      scheduleSave();
    }

    // Re-apply highlights
    applyHighlights(id);

  } catch (err) {
    content.innerHTML = `<p style="padding:2rem;color:#d32f2f">Lỗi tải chương: ${err.message}</p>`;
  }
}
```

- [ ] **Step 2: Make `#content-wrap` scrollable, add scroll listener**

Add to `style.css`:

```css
#content-wrap {
  flex: 1;
  overflow-y: auto;
  height: calc(100vh - var(--toolbar-h));
}
```

Append to `app.js`:

```js
// Track scroll position
document.getElementById('content-wrap').addEventListener('scroll', () => {
  if (!currentChapterId) return;
  const pos = document.getElementById('content-wrap').scrollTop;
  if (!state.progress[currentChapterId]) {
    state.progress[currentChapterId] = { status: 'reading', scrollPos: 0 };
  }
  state.progress[currentChapterId].scrollPos = pos;
  scheduleSave();
}, { passive: true });
```

- [ ] **Step 3: Add `scheduleSave` stub and boot**

Append to `app.js`:

```js
function scheduleSave() {
  clearTimeout(saveTimer);
  setSyncIndicator('saving');
  saveTimer = setTimeout(() => saveData(), 2000);
}

function setSyncIndicator(state) {
  const el = document.getElementById('sync-indicator');
  if (state === 'saved')  { el.className = 'sync-saved';  el.textContent = '☁ Đã lưu'; }
  if (state === 'saving') { el.className = 'sync-saving'; el.textContent = '⟳ Đang lưu...'; }
  if (state === 'error')  { el.className = 'sync-error';  el.textContent = '⚠ Lỗi sync'; }
}

async function saveData() {
  setSyncIndicator('saved'); // placeholder until Gist task
}

// ── BOOT ──
document.addEventListener('DOMContentLoaded', async () => {
  renderSidebar();
  loadChapter(state.lastChapter);
});
```

Note: Remove the earlier `DOMContentLoaded` listener that only called `renderSidebar()` — replace with this one.

- [ ] **Step 4: Test in browser**

Open `index.html`. Click Chương 1 → should inject PMBOK content, hiding the chapter's own sidebar. Click Chương 6 → should show placeholder. Scroll down → after 2s sync indicator shows "Đã lưu".

- [ ] **Step 5: Commit**

```bash
git add app.js style.css
git commit -m "feat: fetch and inject chapter content with scroll tracking"
```

---

## Task 5: Mark chapter done + localStorage persistence

**Files:**
- Modify: `app.js`

- [ ] **Step 1: Add mark-done button handler**

Append to `app.js`:

```js
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
```

- [ ] **Step 2: Add localStorage load/save**

Replace the `saveData` stub and add `loadData`. Replace the `saveData` function:

```js
const LS_KEY = 'pmbok6_progress';

function loadFromLocalStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) Object.assign(state, JSON.parse(raw));
  } catch (_) {}
}

async function saveData() {
  // Always save to localStorage as fallback
  localStorage.setItem(LS_KEY, JSON.stringify(state));
  setSyncIndicator('saved');
}
```

- [ ] **Step 3: Call `loadFromLocalStorage` before boot**

In the `DOMContentLoaded` handler, add `loadFromLocalStorage()` as the first line:

```js
document.addEventListener('DOMContentLoaded', async () => {
  loadFromLocalStorage();
  renderSidebar();
  loadChapter(state.lastChapter);
});
```

- [ ] **Step 4: Test persistence**

Open chapter 1 in browser → scroll down → mark as done → refresh page → chapter 1 should still be marked done and scroll position restored.

- [ ] **Step 5: Commit**

```bash
git add app.js
git commit -m "feat: mark chapter done and persist state to localStorage"
```

---

## Task 6: Text highlighting + inline notes

**Files:**
- Modify: `app.js`

- [ ] **Step 1: Add XPath utility functions**

Append to `app.js`:

```js
// ── XPATH UTILITIES ──
function getXPath(node) {
  if (node.nodeType === Node.TEXT_NODE) node = node.parentNode;
  const parts = [];
  while (node && node !== document.getElementById('content')) {
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
```

- [ ] **Step 2: Add highlight popup logic**

Append to `app.js`:

```js
// ── HIGHLIGHT POPUP ──
const popup = document.getElementById('highlight-popup');
let activeHighlightEl = null; // mark element being edited

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
      // Edit existing highlight color
      activeHighlightEl.dataset.color = btn.dataset.color;
      saveHighlightFromEl(activeHighlightEl);
      hidePopup();
    } else if (pendingHighlight?.range) {
      applyNewHighlight(pendingHighlight.range, btn.dataset.color, '');
      hidePopup();
    }
  });
});

document.getElementById('hl-note-btn').addEventListener('click', () => {
  const existing = activeHighlightEl?.dataset.note || '';
  document.getElementById('note-textarea').value = existing;
  document.getElementById('note-modal').hidden = false;
  hidePopup();
});

document.getElementById('hl-delete-btn').addEventListener('click', () => {
  if (!activeHighlightEl) return;
  const id = activeHighlightEl.dataset.hlId;
  // Unwrap mark
  const parent = activeHighlightEl.parentNode;
  while (activeHighlightEl.firstChild) parent.insertBefore(activeHighlightEl.firstChild, activeHighlightEl);
  parent.removeChild(activeHighlightEl);
  parent.normalize();
  // Remove from state
  if (state.highlights[currentChapterId]) {
    state.highlights[currentChapterId] = state.highlights[currentChapterId].filter(h => h.id !== id);
  }
  hidePopup();
  scheduleSave();
});

// Click on existing highlight
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
  popup.style.top  = (rect.top + window.scrollY - popup.offsetHeight - 8) + 'px';
  popup.style.left = Math.max(8, rect.left + rect.width / 2 - popup.offsetWidth / 2) + 'px';
}

function positionPopupAtEl(el) {
  const rect = el.getBoundingClientRect();
  popup.hidden = false;
  popup.style.top  = (rect.top + window.scrollY - popup.offsetHeight - 8) + 'px';
  popup.style.left = Math.max(8, rect.left + rect.width / 2 - popup.offsetWidth / 2) + 'px';
}

function hidePopup() {
  popup.hidden = true;
  pendingHighlight = null;
  activeHighlightEl = null;
}

document.addEventListener('mousedown', e => {
  if (!popup.contains(e.target)) hidePopup();
});
```

- [ ] **Step 3: Add `applyNewHighlight` and `saveHighlightFromEl`**

Append to `app.js`:

```js
function generateId() {
  return 'h_' + Math.random().toString(36).slice(2, 9);
}

function applyNewHighlight(range, color, note) {
  if (!currentChapterId) return;
  const id = generateId();

  // Serialize position before modifying DOM
  const xpath = getXPath(range.startContainer);
  const startOffset = range.startOffset;
  const endOffset = range.endOffset;

  // Wrap selection in <mark>
  const mark = document.createElement('mark');
  mark.className = 'hl';
  mark.dataset.color = color;
  mark.dataset.note = note;
  mark.dataset.hlId = id;
  try {
    range.surroundContents(mark);
  } catch (_) {
    // surroundContents fails on cross-element selections — skip silently
    return;
  }
  window.getSelection()?.removeAllRanges();

  // Save to state
  if (!state.highlights[currentChapterId]) state.highlights[currentChapterId] = [];
  state.highlights[currentChapterId].push({ id, xpath, startOffset, endOffset, color, note });
  scheduleSave();
}

function saveHighlightFromEl(el) {
  const id = el.dataset.hlId;
  if (!state.highlights[currentChapterId]) return;
  const hl = state.highlights[currentChapterId].find(h => h.id === id);
  if (hl) {
    hl.color = el.dataset.color;
    hl.note = el.dataset.note || '';
    scheduleSave();
  }
}
```

- [ ] **Step 4: Add `applyHighlights` (re-render on chapter load)**

Append to `app.js`:

```js
function applyHighlights(chapterId) {
  const list = state.highlights[chapterId];
  if (!list || list.length === 0) return;
  list.forEach(hl => {
    try {
      const node = resolveXPath(hl.xpath);
      if (!node) return;
      // Find the text node child
      const textNode = node.nodeType === Node.TEXT_NODE ? node : node.firstChild;
      if (!textNode || textNode.nodeType !== Node.TEXT_NODE) return;
      const range = document.createRange();
      range.setStart(textNode, hl.startOffset);
      range.setEnd(textNode, hl.endOffset);
      const mark = document.createElement('mark');
      mark.className = 'hl';
      mark.dataset.color = hl.color;
      mark.dataset.note = hl.note || '';
      mark.dataset.hlId = hl.id;
      range.surroundContents(mark);
    } catch (_) {
      // Silently skip broken highlights (e.g., if chapter HTML changed)
    }
  });
}
```

- [ ] **Step 5: Add note modal save handler**

Append to `app.js`:

```js
// ── NOTE MODAL ──
document.getElementById('note-cancel').addEventListener('click', () => {
  document.getElementById('note-modal').hidden = true;
});

document.getElementById('note-save').addEventListener('click', () => {
  const note = document.getElementById('note-textarea').value.trim();
  if (activeHighlightEl) {
    activeHighlightEl.dataset.note = note;
    saveHighlightFromEl(activeHighlightEl);
  } else if (pendingHighlight?.range) {
    applyNewHighlight(pendingHighlight.range, 'yellow', note);
  }
  document.getElementById('note-modal').hidden = true;
});
```

- [ ] **Step 6: Test in browser**

Open Chapter 1 → select a sentence → popup appears → click 🟡 → yellow highlight applied. Click the highlight → popup with delete button. Click ✏️ → type note → save → small ✏ indicator appears after highlight.

- [ ] **Step 7: Commit**

```bash
git add app.js
git commit -m "feat: text highlighting with 3 colors and inline notes"
```

---

## Task 7: GitHub Gist sync

**Files:**
- Modify: `app.js`

- [ ] **Step 1: Add Gist API functions**

Append to `app.js`:

```js
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
  // List user's gists and find one with our file
  const gists = await gistRequest('GET', '/gists');
  const found = gists.find(g => g.files && g.files[GIST_FILENAME]);
  if (found) {
    saveGistConfig({ ...gistConfig, gistId: found.id });
    return found.id;
  }
  // Create new
  const created = await gistRequest('POST', '/gists', {
    description: 'PMBOK 6 learning progress',
    public: false,
    files: { [GIST_FILENAME]: { content: JSON.stringify(state, null, 2) } },
  });
  saveGistConfig({ ...gistConfig, gistId: created.id });
  return created.id;
}

async function loadFromGist() {
  if (!gistConfig?.token || !gistConfig?.gistId) return;
  try {
    const data = await gistRequest('GET', `/gists/${gistConfig.gistId}`);
    const content = data.files[GIST_FILENAME]?.content;
    if (content) Object.assign(state, JSON.parse(content));
  } catch (_) {}
}

async function saveToGist() {
  if (!gistConfig?.token || !gistConfig?.gistId) return;
  await gistRequest('PATCH', `/gists/${gistConfig.gistId}`, {
    files: { [GIST_FILENAME]: { content: JSON.stringify(state, null, 2) } },
  });
}
```

- [ ] **Step 2: Update `saveData` to use Gist when configured**

Replace existing `saveData` function:

```js
async function saveData() {
  localStorage.setItem(LS_KEY, JSON.stringify(state));
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
```

- [ ] **Step 3: Add Gist setup modal handlers**

Append to `app.js`:

```js
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
  const status = document.getElementById('gist-status');
  status.textContent = 'Đang kiểm tra token...';
  status.className = '';
  try {
    gistConfig = { token, gistId: null };
    // Verify token
    await gistRequest('GET', '/gists');
    // Find or create gist
    await findOrCreateGist();
    // Load remote state
    await loadFromGist();
    saveGistConfig(gistConfig);
    status.textContent = '✓ Kết nối thành công!';
    status.className = 'ok';
    renderSidebar();
    setTimeout(() => { document.getElementById('gist-modal').hidden = true; }, 1200);
  } catch (err) {
    status.textContent = 'Lỗi: ' + err.message;
    status.className = 'error';
    gistConfig = null;
  }
});
```

- [ ] **Step 4: Add `sync-error` retry handler**

Append to `app.js`:

```js
document.getElementById('sync-indicator').addEventListener('click', () => {
  if (document.getElementById('sync-indicator').classList.contains('sync-error')) {
    scheduleSave();
  }
});
```

- [ ] **Step 5: Update boot to load Gist config and remote state**

Update `DOMContentLoaded` handler:

```js
document.addEventListener('DOMContentLoaded', async () => {
  loadFromLocalStorage();
  loadGistConfig();
  if (gistConfig?.token && gistConfig?.gistId) {
    setSyncIndicator('saving');
    await loadFromGist();
    setSyncIndicator('saved');
  } else if (!gistConfig) {
    // First visit — show Gist setup modal
    document.getElementById('gist-modal').hidden = false;
  }
  renderSidebar();
  loadChapter(state.lastChapter);
});
```

- [ ] **Step 6: Test Gist sync**

1. Open in browser, enter GitHub token → should connect and show "✓ Kết nối thành công!"
2. Mark a chapter done → after 2s, open github.com/gists → find `pmbok6-progress.json` → should contain updated data
3. Open same URL in another browser/device → progress should be restored

- [ ] **Step 7: Commit**

```bash
git add app.js
git commit -m "feat: GitHub Gist sync for cross-device progress and highlights"
```

---

## Task 8: Offline export/import + final polish

**Files:**
- Modify: `index.html` (add export/import buttons to gist modal)
- Modify: `app.js`
- Modify: `style.css`

- [ ] **Step 1: Add export/import buttons to `index.html` gist modal**

In `#gist-modal-box`, after `#gist-modal-actions` div, add:

```html
<hr style="margin: 1rem 0; border-color: #eee;">
<p style="font-size:0.82rem;color:#666;margin-bottom:0.5rem">Sao lưu thủ công:</p>
<div style="display:flex;gap:0.5rem">
  <button id="btn-export">⬇ Xuất JSON</button>
  <label id="btn-import-label">⬆ Nhập JSON<input type="file" id="import-file" accept=".json" hidden></label>
</div>
```

- [ ] **Step 2: Add export/import handlers to `app.js`**

Append to `app.js`:

```js
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
```

- [ ] **Step 3: Add import label styles to `style.css`**

```css
#btn-export, #btn-import-label {
  background: transparent; border: 1px solid #ccc;
  padding: 0.4rem 0.8rem; border-radius: 5px;
  cursor: pointer; font-size: 0.82rem; font-family: inherit;
}
#btn-export:hover, #btn-import-label:hover { background: #f5f5f5; }
```

- [ ] **Step 4: Final test checklist**

Run through these scenarios in browser:

- [ ] Load chapter 1 → content displays correctly, chapter's own sidebar hidden
- [ ] Scroll down chapter 1 → refresh → scroll position restored
- [ ] Mark chapter 2 done → sidebar shows ✓ green, progress bar updates
- [ ] Highlight text in yellow → reload page → highlight persists
- [ ] Add note to highlight → ✏ indicator shows → click highlight → note visible in textarea
- [ ] Delete a highlight → text back to normal
- [ ] Click ⚠ chapter 6 → placeholder "chưa được dịch" shown
- [ ] Mobile: hamburger button shows → tap opens sidebar overlay → tap outside closes
- [ ] Tablet: sidebar shows as 64px icon rail
- [ ] Export JSON → file downloads → clear localStorage → import JSON → progress restored

- [ ] **Step 5: Final commit**

```bash
git add index.html app.js style.css
git commit -m "feat: export/import backup and complete PMBOK6 learning site"
```

---

## Self-Review

**Spec coverage check:**

| Spec requirement | Task |
|---|---|
| Wrapper shell + inject content | Task 4 |
| Sidebar with chapter status icons | Task 3 |
| Progress bar | Task 3 |
| Scroll position memory | Task 4 |
| Mark chapter done | Task 5 |
| localStorage persistence | Task 5 |
| Text highlighting (3 colors) | Task 6 |
| Inline notes | Task 6 |
| Highlight persistence across reloads | Task 6 (applyHighlights) |
| GitHub Gist sync | Task 7 |
| First-visit Gist setup modal | Task 7 |
| Offline mode (no sync) | Task 7 |
| Export/import JSON backup | Task 8 |
| Sync indicator (saved/saving/error) | Task 4+7 |
| Responsive mobile (< 768px) | Task 2 |
| Responsive tablet (768–1024px) | Task 2 |
| Responsive desktop | Task 2 |
| Placeholder chapters | Task 4 |

All spec requirements covered. ✓
