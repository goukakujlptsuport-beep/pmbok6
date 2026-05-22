/* PMBOK LMS — MongoDB Atlas Data API client + learning logic */

const LMS_CONFIG_KEY = 'pmbok_lms_config';
const LMS_CACHE_KEY  = 'pmbok_lms_cache';

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
      Atlas.upsert('user_progress',
        { userId: this._userId(), chapterId, sectionId },
        { userId: this._userId(), chapterId, sectionId, isLearned: nowLearned, updatedAt: new Date().toISOString() }
      ).catch(err => console.warn('Atlas sync failed:', err));
    }

    if (nowLearned) {
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
                          title="${h.textContent.trim()}">
                    <span class="lms-sec-check">${learned ? '☑' : '☐'}</span>
                    <span class="lms-sec-title">${h.textContent.trim().slice(0, 50)}</span>
                  </button>`;
        }).join('')}
      </div>
    `;
  },

  initPanel(chapterId) {
    // Wait for iframe to load then render
    const frame = document.getElementById('chapter-frame');
    if (!frame) return;
    const orig = frame.onload;
    frame.onload = (e) => {
      if (orig) orig.call(frame, e);
      setTimeout(() => this._renderPanel(chapterId), 300);
    };
    // If already loaded
    if (frame.contentDocument && frame.contentDocument.readyState === 'complete') {
      setTimeout(() => this._renderPanel(chapterId), 300);
    }
  },
};
