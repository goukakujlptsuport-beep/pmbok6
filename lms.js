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
