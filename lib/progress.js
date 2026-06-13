/* lib/progress.js — Unified progress read API across all books.
 * Exposes window.PMProgress.
 * Requires lib/books-config.js to be loaded first.
 */
(function () {
  'use strict';

  function safeJSON(str, fallback) {
    try { return JSON.parse(str || 'null') || fallback; } catch (e) { return fallback; }
  }

  // ── PMBOK6 ───────────────────────────────────────────────────────────────────
  function loadPmbok6Raw() {
    return safeJSON(localStorage.getItem('pmbok6_progress'), { progress: {}, highlights: {}, lastChapter: '' });
  }

  function getPmbok6Progress() {
    var cfg   = window.PMLibConfig;
    var data  = loadPmbok6Raw();
    var chaps = cfg.getChapters('pmbok6');
    var prog  = data.progress || {};
    var done    = 0;
    var reading = 0;
    chaps.forEach(function (ch) {
      var s = (prog[ch.id] || {}).status;
      if (s === 'done')    done++;
      if (s === 'reading') reading++;
    });
    return {
      done:       done,
      reading:    reading,
      total:      chaps.length,
      lastChap:   data.lastChapter || null,
      hlCount:    countPmbok6HL(data),
    };
  }

  function countPmbok6HL(data) {
    var total = 0;
    var hls = data.highlights || {};
    Object.keys(hls).forEach(function (k) { total += (hls[k] || []).length; });
    return total;
  }

  function getPmbok6ChapterStatus(chapId) {
    var data = loadPmbok6Raw();
    return ((data.progress || {})[chapId] || {}).status || 'unread';
  }

  function getPmbok6AllHighlights() {
    var data = loadPmbok6Raw();
    var out  = [];
    var hls  = data.highlights || {};
    Object.keys(hls).forEach(function (k) { (hls[k] || []).forEach(function (h) { out.push(h); }); });
    return out;
  }

  // ── RITA ─────────────────────────────────────────────────────────────────────
  function loadRitaRaw() {
    return safeJSON(localStorage.getItem('rita_reading'), {});
  }

  function getRitaProgress() {
    var cfg   = window.PMLibConfig;
    var chaps = cfg.getChapters('rita');
    var rd    = loadRitaRaw();
    var lastChap = rd.lastChap || null;

    var visited = 0;
    var hlTotal = 0;
    chaps.forEach(function (ch) {
      var hls = safeJSON(localStorage.getItem('rita_hl_' + ch.hlSuffix), []);
      if (hls.length > 0) { visited++; hlTotal += hls.length; }
    });
    if (lastChap && visited === 0) visited = 1;

    return {
      done:     0,
      reading:  visited,
      total:    chaps.length,
      lastChap: lastChap,
      hlCount:  hlTotal,
    };
  }

  function getRitaChapterStatus(chapId) {
    var cfg  = window.PMLibConfig;
    var chap = null;
    cfg.getChapters('rita').forEach(function (c) { if (c.id === chapId) chap = c; });
    if (!chap) return 'unread';
    var rd  = loadRitaRaw();
    var hls = safeJSON(localStorage.getItem('rita_hl_' + chap.hlSuffix), []);
    if (hls.length > 0) return 'reading';
    if ((rd.lastChap || '') === chapId) return 'reading';
    return 'unread';
  }

  function getRitaAllHighlights() {
    var cfg  = window.PMLibConfig;
    var out  = [];
    cfg.getChapters('rita').forEach(function (ch) {
      var hls = safeJSON(localStorage.getItem('rita_hl_' + ch.hlSuffix), []);
      hls.forEach(function (h) { out.push(h); });
    });
    return out;
  }

  // ── PUBLIC API ────────────────────────────────────────────────────────────────
  window.PMProgress = {

    // Returns { done, reading, total, lastChap, hlCount }
    getBookProgress: function (bookId) {
      if (bookId === 'pmbok6') return getPmbok6Progress();
      if (bookId === 'rita')   return getRitaProgress();
      return { done: 0, reading: 0, total: 0, lastChap: null, hlCount: 0 };
    },

    // Returns 'done' | 'reading' | 'unread'
    getChapterStatus: function (bookId, chapId) {
      if (bookId === 'pmbok6') return getPmbok6ChapterStatus(chapId);
      if (bookId === 'rita')   return getRitaChapterStatus(chapId);
      return 'unread';
    },

    // Returns last-read chapter ID or null
    getLastChap: function (bookId) {
      if (bookId === 'pmbok6') return loadPmbok6Raw().lastChapter || null;
      if (bookId === 'rita')   return loadRitaRaw().lastChap || null;
      return null;
    },

    // Returns flat array of all highlight objects for a book
    getAllHighlights: function (bookId) {
      if (bookId === 'pmbok6') return getPmbok6AllHighlights();
      if (bookId === 'rita')   return getRitaAllHighlights();
      return [];
    },

    // Returns { yellow, green, red, total, notes } across all supplied bookIds
    countHighlightsByColor: function (bookIds) {
      var counts = { yellow: 0, green: 0, red: 0, total: 0, notes: 0 };
      bookIds.forEach(function (bid) {
        var hls = window.PMProgress.getAllHighlights(bid);
        hls.forEach(function (h) {
          counts.total++;
          if (h.color === 'yellow') counts.yellow++;
          else if (h.color === 'green') counts.green++;
          else if (h.color === 'red') counts.red++;
          if (h.note && h.note.trim()) counts.notes++;
        });
      });
      return counts;
    },
  };
})();
