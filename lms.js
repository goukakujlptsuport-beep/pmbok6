/* PMBOK LMS — MongoDB Atlas Data API client + learning logic */

const LMS_CONFIG_KEY  = 'pmbok_lms_config';
const LMS_CACHE_KEY   = 'pmbok_lms_cache';
const REVIEW_CACHE_KEY = 'pmbok_lms_reviews';

// ── ATLAS CLIENT ──
const Atlas = {
  _cfg: null,

  config() {
    if (!this._cfg) this._cfg = JSON.parse(localStorage.getItem(LMS_CONFIG_KEY) || 'null');
    return this._cfg;
  },

  saveConfig(cfg) {
    if (!cfg || !cfg.appId || !cfg.apiKey) throw new Error('Invalid Atlas config: appId and apiKey required');
    this._cfg = cfg;
    localStorage.setItem(LMS_CONFIG_KEY, JSON.stringify(cfg));
  },

  isConfigured() {
    const c = this.config();
    return !!(c && c.appId && c.apiKey);
  },

  async request(action, collection, body) {
    const c = this.config();
    if (!c) throw new Error('Atlas not configured');
    const url = `https://data.mongodb-api.com/app/${c.appId}/endpoint/data/v1/action/${action}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': c.apiKey,
      },
      body: JSON.stringify({
        dataSource: 'mongodb-atlas',
        database: 'pmbok_lms',
        collection,
        ...body,
      }),
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(`Atlas ${action} failed: ${res.status} – ${errBody.error || 'unknown'}`);
    }
    return res.json();
  },

  async upsert(collection, filter, update) {
    return this.request('updateOne', collection, {
      filter,
      update: { $set: update },
      upsert: true,
    });
  },

  async find(collection, filter) {
    const r = await this.request('find', collection, { filter });
    return r.documents || [];
  },
};

/*
 * ── BROWSER VERIFICATION (manual step) ──
 * After configuring Atlas credentials, test the connection in the browser console:
 *
 *   Atlas.saveConfig({ appId: '<your-app-id>', apiKey: '<your-api-key>' });
 *   Atlas.find('test', {}).then(console.log).catch(console.error);
 *
 * Expected: an empty array [] logged to console, no errors.
 */

// ── LOCAL CACHE HELPERS ──
function cacheGet(key) {
  try { return JSON.parse(localStorage.getItem(key) || '{}'); } catch { return {}; }
}
function cacheSet(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}
function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

// ── PROGRESS TRACKER ──
const ProgressTracker = {
  _cache: null,

  _load() {
    if (!this._cache) this._cache = cacheGet(LMS_CACHE_KEY);
    return this._cache;
  },

  _save() {
    cacheSet(LMS_CACHE_KEY, this._cache);
  },

  _userId() {
    let id = localStorage.getItem('pmbok_lms_uid');
    if (!id) { id = 'u_' + Math.random().toString(36).slice(2, 11); localStorage.setItem('pmbok_lms_uid', id); }
    return id;
  },

  isLearned(chapterId, sectionId) {
    const cache = this._load();
    return !!(cache[chapterId] && cache[chapterId][sectionId]);
  },

  async toggle(chapterId, sectionId) {
    const cache = this._load();
    if (!cache[chapterId]) cache[chapterId] = {};
    const nowLearned = !cache[chapterId][sectionId];
    if (nowLearned) {
      cache[chapterId][sectionId] = { learnedAt: new Date().toISOString() };
    } else {
      delete cache[chapterId][sectionId];
    }
    this._save();
    this._renderPanel(chapterId);

    if (Atlas.isConfigured()) {
      const uid = this._userId();
      Atlas.upsert('user_progress',
        { userId: uid, chapterId, sectionId },
        { userId: uid, chapterId, sectionId, isLearned: nowLearned, updatedAt: new Date().toISOString() }
      ).catch(err => console.warn('Atlas sync failed:', err));
    }

    if (nowLearned && typeof ReviewSystem !== 'undefined') {
      await ReviewSystem.scheduleReview(chapterId, sectionId);
    }
    return nowLearned;
  },

  getStats(chapterId, sectionIds) {
    const cache = this._load();
    const learned = sectionIds.filter(id => cache[chapterId] && cache[chapterId][id]).length;
    return { learned, total: sectionIds.length, percent: sectionIds.length ? Math.round(learned / sectionIds.length * 100) : 0 };
  },

  _renderPanel(chapterId) {
    const panel = document.getElementById('lms-progress-panel');
    if (!panel) return;

    const frame = document.getElementById('chapter-frame');
    if (!frame || !frame.contentDocument) return;
    const headings = Array.from(frame.contentDocument.querySelectorAll('h2, h3'));

    const sectionIds = headings.map((h, i) => h.id || `s${i}`);
    const stats = this.getStats(chapterId, sectionIds);

    panel.innerHTML = `
      <div class="lms-panel-header">
        <span class="lms-panel-title">Tiến độ chương</span>
        <span class="lms-pct">${stats.percent}%</span>
      </div>
      <div class="lms-bar"><div class="lms-bar-fill" style="width:${stats.percent}%"></div></div>
      <div class="lms-section-list">
        ${headings.map((h, i) => {
          const sid = h.id || `s${i}`;
          const learned = this.isLearned(chapterId, sid);
          return `<button class="lms-sec-btn ${learned ? 'learned' : ''}"
                          onclick="ProgressTracker.toggle('${chapterId}', '${sid}')"
                          title="${escHtml(h.textContent.trim())}">
                    <span class="lms-sec-check">${learned ? '☑' : '☐'}</span>
                    <span class="lms-sec-title">${escHtml(h.textContent.trim().slice(0, 50))}</span>
                  </button>`;
        }).join('')}
      </div>
    `;
  },

  initPanel(chapterId) {
    const frame = document.getElementById('chapter-frame');
    if (!frame) return;
    frame.addEventListener('load', () => {
      setTimeout(() => this._renderPanel(chapterId), 300);
    }, { once: true });
  },
};

// ── REVIEW SYSTEM (SM-2) ──

const ReviewSystem = {
  _cache: null,

  _load() {
    if (!this._cache) this._cache = cacheGet(REVIEW_CACHE_KEY);
    return this._cache;
  },

  _save() {
    cacheSet(REVIEW_CACHE_KEY, this._cache);
  },

  _key(chapterId, sectionId) {
    return `${chapterId}::${sectionId}`;
  },

  async scheduleReview(chapterId, sectionId) {
    const cache = this._load();
    const key = this._key(chapterId, sectionId);
    if (!cache[key]) {
      const nextReview = new Date();
      nextReview.setDate(nextReview.getDate() + 1);
      cache[key] = {
        chapterId,
        sectionId,
        nextReview: nextReview.toISOString(),
        interval: 1,
        reviewCount: 0,
      };
      this._save();
    }

    if (Atlas.isConfigured()) {
      Atlas.upsert('review_schedule',
        { userId: ProgressTracker._userId(), chapterId, sectionId },
        { ...cache[key], userId: ProgressTracker._userId() }
      ).catch(err => console.warn('Atlas review sync failed:', err));
    }

    this.updateBadge();
  },

  async markReviewed(chapterId, sectionId, difficulty) {
    const cache = this._load();
    const key = this._key(chapterId, sectionId);
    const item = cache[key];
    if (!item) return;

    const intervals = { easy: [7, 14, 30, 60], ok: [3, 7, 14, 30], hard: [1, 1, 3, 7] };
    const idx = Math.min(item.reviewCount, 3);
    const days = intervals[difficulty][idx];

    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + days);

    cache[key] = {
      ...item,
      nextReview: nextReview.toISOString(),
      interval: days,
      reviewCount: item.reviewCount + 1,
      lastDifficulty: difficulty,
    };
    this._save();

    if (Atlas.isConfigured()) {
      Atlas.upsert('review_schedule',
        { userId: ProgressTracker._userId(), chapterId, sectionId },
        { ...cache[key], userId: ProgressTracker._userId() }
      ).catch(err => console.warn('Atlas review sync failed:', err));
    }

    this.renderPanel();
    this.updateBadge();
  },

  getDueToday() {
    const cache = this._load();
    const now = new Date();
    return Object.values(cache).filter(item => new Date(item.nextReview) <= now);
  },

  updateBadge() {
    const due = this.getDueToday();
    const badge = document.getElementById('lms-review-badge');
    const countEl = document.getElementById('lms-review-count');
    if (!badge) return;
    if (due.length > 0) {
      badge.style.display = 'block';
      if (countEl) countEl.textContent = due.length;
    } else {
      badge.style.display = 'none';
    }
  },

  togglePanel() {
    const panel = document.getElementById('lms-review-panel');
    if (!panel) return;
    const isVisible = panel.style.display === 'block';
    if (!isVisible) this.renderPanel();
    panel.style.display = isVisible ? 'none' : 'block';
  },

  renderPanel() {
    const list = document.getElementById('lms-review-list');
    if (!list) return;
    const due = this.getDueToday();

    if (due.length === 0) {
      list.innerHTML = '<p style="color:#5a9e5a;text-align:center">✓ Không có phần nào cần ôn tập hôm nay!</p>';
      return;
    }

    list.innerHTML = due.map(item => {
      const frame = document.getElementById('chapter-frame');
      let title = `${item.chapterId} — ${item.sectionId}`;
      if (frame && frame.contentDocument) {
        const el = frame.contentDocument.getElementById(item.sectionId);
        if (el) title = el.textContent.trim().slice(0, 60);
      }
      const intervals = { easy: [7, 14, 30, 60], ok: [3, 7, 14, 30], hard: [1, 1, 3, 7] };
      const idx = Math.min(item.reviewCount || 0, 3);
      const dEasy = intervals.easy[idx];
      const dOk   = intervals.ok[idx];
      const dHard = intervals.hard[idx];
      return `
        <div class="lms-review-item">
          <div class="lms-review-item-title">${escHtml(title)}</div>
          <div class="lms-review-btns">
            <button class="easy"  onclick="ReviewSystem.markReviewed('${escHtml(item.chapterId)}','${escHtml(item.sectionId)}','easy')">Dễ (${dEasy}d)</button>
            <button class="ok"    onclick="ReviewSystem.markReviewed('${escHtml(item.chapterId)}','${escHtml(item.sectionId)}','ok')">OK (${dOk}d)</button>
            <button class="hard"  onclick="ReviewSystem.markReviewed('${escHtml(item.chapterId)}','${escHtml(item.sectionId)}','hard')">Khó (${dHard}d)</button>
          </div>
        </div>`;
    }).join('');
  },

  init() {
    this.updateBadge();
  },
};

// ── BOOT ──
document.addEventListener('DOMContentLoaded', () => {
  ReviewSystem.init();
});
