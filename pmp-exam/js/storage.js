'use strict';
(function (G) {
  /* ── Constants ─────────────────────────────────────────────── */
  const DB_NAME    = 'pmp_simulator';
  const DB_VERSION = 1;

  const DOMAINS   = ['people', 'process', 'business'];
  const TYPES     = ['single', 'multiple', 'matching', 'hotspot', 'fill'];
  const APPROACHES = ['predictive', 'agile', 'hybrid'];

  const TASK_DOMAIN_MAP = {
    '1.1':'people','1.2':'people','1.3':'people','1.4':'people',
    '1.5':'people','1.6':'people','1.7':'people','1.8':'people',
    '1.9':'people','1.10':'people','1.11':'people','1.12':'people',
    '1.13':'people','1.14':'people',
    '2.1':'process','2.2':'process','2.3':'process','2.4':'process',
    '2.5':'process','2.6':'process','2.7':'process','2.8':'process',
    '2.9':'process','2.10':'process','2.11':'process','2.12':'process',
    '2.13':'process','2.14':'process','2.15':'process','2.16':'process',
    '2.17':'process',
    '3.1':'business','3.2':'business','3.3':'business','3.4':'business'
  };

  const TASK_NAMES = {
    '1.1':'Manage conflict','1.2':'Lead a team',
    '1.3':'Support team performance','1.4':'Empower team members and stakeholders',
    '1.5':'Ensure team members/stakeholders are adequately trained',
    '1.6':'Build a team','1.7':'Address and remove impediments, obstacles, and blockers',
    '1.8':'Negotiate project agreements','1.9':'Collaborate with stakeholders',
    '1.10':'Build shared understanding','1.11':'Engage and support virtual teams',
    '1.12':'Define team ground rules','1.13':'Mentor relevant stakeholders',
    '1.14':'Promote team performance through emotional intelligence',
    '2.1':'Execute project with urgency required to deliver business value',
    '2.2':'Manage communications','2.3':'Assess and manage risks',
    '2.4':'Engage stakeholders','2.5':'Plan and manage budget and resources',
    '2.6':'Plan and manage schedule','2.7':'Plan and manage quality of products/deliverables',
    '2.8':'Plan and manage scope','2.9':'Integrate project planning activities',
    '2.10':'Manage project changes','2.11':'Plan and manage procurement',
    '2.12':'Manage project artifacts',
    '2.13':'Determine appropriate project methodology/methods and practices',
    '2.14':'Establish project governance structure',
    '2.15':'Manage project issues','2.16':'Ensure knowledge transfer for project continuity',
    '2.17':'Plan and manage project/phase closure or transitions',
    '3.1':'Plan and manage project compliance',
    '3.2':'Evaluate and deliver project benefits and value',
    '3.3':'Evaluate and address external business environment changes for impact on scope',
    '3.4':'Support organizational change'
  };

  /* ── IndexedDB ─────────────────────────────────────────────── */
  let _db = null;

  function openDB() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = e => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('pmp_questions'))
          db.createObjectStore('pmp_questions', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('pmp_attempts'))
          db.createObjectStore('pmp_attempts', { autoIncrement: true });
        if (!db.objectStoreNames.contains('pmp_exam_sessions'))
          db.createObjectStore('pmp_exam_sessions', { keyPath: 'examId' });
      };
      req.onsuccess  = e => resolve(e.target.result);
      req.onerror    = e => reject(e.target.error);
    });
  }

  async function getDB() {
    if (!_db) _db = await openDB();
    return _db;
  }

  function txGet(store, key) {
    return getDB().then(db => new Promise((res, rej) => {
      const r = db.transaction(store, 'readonly').objectStore(store).get(key);
      r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
    }));
  }

  function txGetAll(store) {
    return getDB().then(db => new Promise((res, rej) => {
      const r = db.transaction(store, 'readonly').objectStore(store).getAll();
      r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
    }));
  }

  function txPut(store, value) {
    return getDB().then(db => new Promise((res, rej) => {
      const r = db.transaction(store, 'readwrite').objectStore(store).put(value);
      r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
    }));
  }

  function txDelete(store, key) {
    return getDB().then(db => new Promise((res, rej) => {
      const r = db.transaction(store, 'readwrite').objectStore(store).delete(key);
      r.onsuccess = () => res(); r.onerror = () => rej(r.error);
    }));
  }

  /* ── Questions ─────────────────────────────────────────────── */
  async function getAllQuestions() { return txGetAll('pmp_questions'); }

  async function getQuestions(filter = {}) {
    const all = await getAllQuestions();
    return all.filter(q => {
      if (filter.domain && q.domain !== filter.domain) return false;
      if (filter.task   && q.task   !== filter.task)   return false;
      if (filter.type   && q.type   !== filter.type)   return false;
      if (filter.approach) {
        if (filter.approach === 'agile'      && q.approach === 'predictive') return false;
        if (filter.approach === 'predictive' && q.approach !== 'predictive') return false;
      }
      if (filter.unseen) {
        const s = getQStat(q.id);
        if (s.attempts > 0) return false;
      }
      if (filter.wrongOnly) {
        const s = getQStat(q.id);
        if (!s || s.wrongScore <= 0) return false;
      }
      return true;
    });
  }

  const putQuestion    = q   => txPut('pmp_questions', q);
  const deleteQuestion = id  => txDelete('pmp_questions', id);

  /* ── Attempts ──────────────────────────────────────────────── */
  function appendAttempt(attempt) {
    return getDB().then(db => new Promise((res, rej) => {
      const r = db.transaction('pmp_attempts', 'readwrite').objectStore('pmp_attempts').add(attempt);
      r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
    }));
  }
  const getAllAttempts = () => txGetAll('pmp_attempts');

  /* ── Exam Sessions ─────────────────────────────────────────── */
  const getSession     = examId  => txGet('pmp_exam_sessions', examId);
  const putSession     = session => txPut('pmp_exam_sessions', session);
  const getAllSessions  = ()     => txGetAll('pmp_exam_sessions');

  /* ── localStorage helpers ──────────────────────────────────── */
  function getStats() {
    try { return JSON.parse(localStorage.getItem('pmp_stats')) || { questions: {}, tasks: {} }; }
    catch { return { questions: {}, tasks: {} }; }
  }
  function saveStats(s) { localStorage.setItem('pmp_stats', JSON.stringify(s)); }

  function getQStat(qid) {
    return getStats().questions[qid] || { attempts: 0, wrongScore: 0, lastSeen: 0 };
  }
  function saveQStat(qid, stat) {
    const s = getStats(); s.questions[qid] = stat; saveStats(s);
  }

  function getSettings() {
    try { return JSON.parse(localStorage.getItem('pmp_settings')) || _defaultSettings(); }
    catch { return _defaultSettings(); }
  }
  function saveSettings(s) { localStorage.setItem('pmp_settings', JSON.stringify(s)); }
  function _defaultSettings() {
    return { userBoost: { domains: {}, tasks: {} }, ui: { lang: 'en', theme: 'light' } };
  }

  /* ── Validation ────────────────────────────────────────────── */
  function hashQuestion(text) {
    const n = text.toLowerCase().replace(/\s+/g, ' ').trim();
    let h = 5381;
    for (let i = 0; i < n.length; i++) { h = ((h << 5) + h) + n.charCodeAt(i); h |= 0; }
    return h.toString(16);
  }

  function validateQuestion(q, existingIds, existingHashes) {
    const errs = [];
    const req = ['id','domain','task','approach','type','question','options','correct'];
    for (const f of req) if (q[f] == null) errs.push(`Missing field: ${f}`);
    if (errs.length) return errs;

    if (!DOMAINS.includes(q.domain))    errs.push(`Invalid domain: ${q.domain}`);
    if (!TYPES.includes(q.type))        errs.push(`Invalid type: ${q.type}`);
    if (!APPROACHES.includes(q.approach)) errs.push(`Invalid approach: ${q.approach}`);

    const expDomain = TASK_DOMAIN_MAP[q.task];
    if (!expDomain)               errs.push(`Unknown task: ${q.task}`);
    else if (expDomain !== q.domain) errs.push(`Task ${q.task} belongs to '${expDomain}', not '${q.domain}'`);

    if (typeof q.question !== 'string' || q.question.length < 40)
      errs.push(`Question text too short (< 40 chars)`);

    if (q.type === 'single') {
      if (!Array.isArray(q.options) || q.options.length !== 4) errs.push('Single: must have exactly 4 options');
      if (!Array.isArray(q.correct) || q.correct.length !== 1) errs.push('Single: must have exactly 1 correct answer');
    } else if (q.type === 'multiple') {
      if (!Array.isArray(q.options) || q.options.length < 5)   errs.push('Multiple: must have ≥ 5 options');
      if (!Array.isArray(q.correct) || q.correct.length < 2)   errs.push('Multiple: must have ≥ 2 correct answers');
      if (Array.isArray(q.correct) && Array.isArray(q.options)) {
        for (const i of q.correct) if (i < 0 || i >= q.options.length)
          errs.push(`Correct index ${i} out of range`);
      }
    }
    if (errs.length) return errs;

    if (existingHashes.has(hashQuestion(q.question))) return ['DUPLICATE'];
    return null;
  }

  /* ── Import questions ──────────────────────────────────────── */
  async function importQuestions(arr) {
    const existing = await getAllQuestions();
    const existingIds    = new Set(existing.map(q => q.id));
    const existingHashes = new Set(existing.map(q => hashQuestion(q.question)));

    const prefix = { people: 'PPL', process: 'PRC', business: 'BIZ' };
    const maxNum  = pre => Math.max(0, ...existing.filter(q => q.id.startsWith(pre)).map(q => parseInt(q.id.split('-')[1]) || 0));
    const counters = { PPL: maxNum('PPL'), PRC: maxNum('PRC'), BIZ: maxNum('BIZ') };

    const results = { added: 0, duplicates: 0, invalid: 0, errors: [] };
    const toAdd   = [];

    for (const raw of arr) {
      const errs = validateQuestion(raw, existingIds, existingHashes);
      if (errs) {
        if (errs[0] === 'DUPLICATE') { results.duplicates++; continue; }
        results.invalid++;
        results.errors.push({ id: raw.id || '?', errors: errs });
        continue;
      }
      const pre    = prefix[raw.domain];
      const newId  = `${pre}-${String(++counters[pre]).padStart(4, '0')}`;
      const q      = { ...raw, id: newId };
      existingHashes.add(hashQuestion(q.question));
      existingIds.add(newId);
      toAdd.push(q);
      results.added++;
    }

    if (toAdd.length) {
      const db = await getDB();
      await new Promise((res, rej) => {
        const tx = db.transaction('pmp_questions', 'readwrite');
        const st = tx.objectStore('pmp_questions');
        toAdd.forEach(q => st.put(q));
        tx.oncomplete = res; tx.onerror = () => rej(tx.error);
      });
    }
    return results;
  }

  /* ── Export / Import backup ────────────────────────────────── */
  async function exportAll() {
    const [questions, attempts, sessions] = await Promise.all([
      getAllQuestions(), getAllAttempts(), getAllSessions()
    ]);
    return { version: '1.0', exportedAt: new Date().toISOString(),
      questions, attempts, examSessions: sessions,
      stats: getStats(), settings: getSettings() };
  }

  async function importBackup(backup) {
    const db = await getDB();
    await new Promise((res, rej) => {
      const tx = db.transaction(['pmp_questions','pmp_attempts','pmp_exam_sessions'], 'readwrite');
      tx.objectStore('pmp_questions').clear();
      tx.objectStore('pmp_attempts').clear();
      tx.objectStore('pmp_exam_sessions').clear();
      tx.oncomplete = res; tx.onerror = () => rej(tx.error);
    });
    await new Promise((res, rej) => {
      const tx = db.transaction(['pmp_questions','pmp_attempts','pmp_exam_sessions'], 'readwrite');
      const qs = tx.objectStore('pmp_questions');
      const as = tx.objectStore('pmp_attempts');
      const ss = tx.objectStore('pmp_exam_sessions');
      (backup.questions    || []).forEach(q => qs.put(q));
      (backup.attempts     || []).forEach(a => as.add(a));
      (backup.examSessions || []).forEach(s => ss.put(s));
      tx.oncomplete = res; tx.onerror = () => rej(tx.error);
    });
    if (backup.stats)    saveStats(backup.stats);
    if (backup.settings) saveSettings(backup.settings);
  }

  async function resetAll() {
    const db = await getDB();
    await new Promise((res, rej) => {
      const tx = db.transaction(['pmp_questions','pmp_attempts','pmp_exam_sessions'], 'readwrite');
      tx.objectStore('pmp_questions').clear();
      tx.objectStore('pmp_attempts').clear();
      tx.objectStore('pmp_exam_sessions').clear();
      tx.oncomplete = res; tx.onerror = () => rej(tx.error);
    });
    localStorage.removeItem('pmp_stats');
    localStorage.removeItem('pmp_settings');
  }

  /* ── Export namespace ──────────────────────────────────────── */
  G.PMP = G.PMP || {};
  G.PMP.Storage = {
    getDB, getAllQuestions, getQuestions, putQuestion, deleteQuestion,
    appendAttempt, getAllAttempts,
    getSession, putSession, getAllSessions,
    getStats, saveStats, getQStat, saveQStat,
    getSettings, saveSettings,
    importQuestions, exportAll, importBackup, resetAll,
    validateQuestion, hashQuestion,
    TASK_DOMAIN_MAP, TASK_NAMES, DOMAINS, TYPES, APPROACHES
  };
})(window);
