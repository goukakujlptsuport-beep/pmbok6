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
  localStorage.setItem(LS_KEY, JSON.stringify(state));
  setSyncIndicator('saved');
}

// ── CHAPTER LOADING ──
async function loadChapter(id) {
  currentChapterId = id;
  state.lastChapter = id;

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
    content.innerHTML = `<p style="padding:2rem;color:#d32f2f">Lỗi tải chương: ${err.message}</p>`;
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

// ── HIGHLIGHTS (stubs — filled in Task 6) ──
function applyHighlights(chapterId) {
  // implemented in Task 6
}

// ── BOOT ──
document.addEventListener('DOMContentLoaded', async () => {
  loadFromLocalStorage();
  renderSidebar();
  loadChapter(state.lastChapter);
});
