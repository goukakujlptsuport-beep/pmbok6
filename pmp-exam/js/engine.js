'use strict';
/**
 * engine.js — Pure functions for priority, sampling, scoring.
 * All functions take their inputs as parameters → easily testable.
 */
(function (G) {
  const Storage = () => G.PMP.Storage; // lazy ref

  /* ── Priority formula ──────────────────────────────────────── */
  /**
   * @param {object} q        - question object (needs .id, .domain, .task)
   * @param {object} qStat    - {attempts, wrongScore, lastSeen}
   * @param {object} settings - {userBoost: {domains, tasks}}
   * @returns {number} priority score > 0
   */
  function computePriority(q, qStat, settings) {
    const { wrongScore = 0, lastSeen = 0, attempts = 0 } = qStat || {};

    let p = 1.0;

    // wrongFactor: sai nhiều → ưu tiên cao
    p *= (1 + 0.8 * Math.max(0, wrongScore));

    // recencyFactor: vừa làm → giảm; lâu không gặp → tăng nhẹ
    const daysSince = lastSeen === 0 ? 999 : (Date.now() - lastSeen) / 86_400_000;
    if      (daysSince < 1)  p *= 0.2;
    else if (daysSince < 3)  p *= 0.6;
    else if (daysSince < 14) p *= 1.0;
    else                     p *= 1.3;

    // boostDomain
    const db = settings?.userBoost?.domains?.[q.domain] ?? 1.0;
    p *= Math.min(5, Math.max(0.25, db));

    // boostTask
    const tb = settings?.userBoost?.tasks?.[q.task] ?? 1.0;
    p *= Math.min(5, Math.max(0.25, tb));

    // noveltyFactor: chưa từng làm → ưu tiên nhẹ
    if (attempts === 0) p *= 1.2;

    return Math.max(p, 0.001);
  }

  /* ── Weighted sampling (Efraimidis–Spirakis) ──────────────── */
  /**
   * @param {object[]} pool      - questions to sample from
   * @param {number}   n         - how many to pick
   * @param {object}   settings  - for priority
   * @param {object}   [opts]
   * @param {boolean}  [opts.applyTaskCap=true]  - cap 40% per task
   * @param {object}   [opts.qStats]  - pre-loaded stats map {qid: stat}
   * @returns {object[]} selected questions
   */
  function sampleQuestions(pool, n, settings, opts = {}) {
    if (!pool.length || n <= 0) return [];
    n = Math.min(n, pool.length);
    const { applyTaskCap = true, qStats = {} } = opts;
    const st = Storage();

    const keyed = pool.map(q => {
      const stat = qStats[q.id] || st.getQStat(q.id);
      const key  = Math.pow(Math.random(), 1 / computePriority(q, stat, settings));
      return { q, key };
    }).sort((a, b) => b.key - a.key);

    if (!applyTaskCap) return keyed.slice(0, n).map(x => x.q);

    // cap: no more than ceil(40% of n) from same task
    const maxPerTask = Math.ceil(n * 0.4);
    const taskCounts = {};
    const selected   = [];
    const overflow   = [];

    for (const item of keyed) {
      const t = item.q.task;
      taskCounts[t] = taskCounts[t] || 0;
      if (taskCounts[t] < maxPerTask) {
        selected.push(item.q);
        taskCounts[t]++;
        if (selected.length >= n) break;
      } else {
        overflow.push(item);
      }
    }
    // fill remaining from overflow if needed
    for (const item of overflow) {
      if (selected.length >= n) break;
      selected.push(item.q);
    }
    return selected.slice(0, n);
  }

  /* ── Exam simulation sampling (objective, no personal bias) ── */
  /**
   * Quota: People 76, Process 90, Business 14 (~50/50 approach).
   */
  function sampleExamQuestions(allQuestions) {
    const targets = { people: 76, process: 90, business: 14 };
    const result  = [];

    for (const [domain, quota] of Object.entries(targets)) {
      const pool = allQuestions.filter(q => q.domain === domain);
      if (!pool.length) continue;

      const pred     = shuffleArray(pool.filter(q => q.approach === 'predictive'));
      const agilePl  = shuffleArray(pool.filter(q => q.approach !== 'predictive'));
      const half     = Math.round(quota / 2);
      const selPred  = pred.slice(0, Math.min(half, pred.length));
      const remaining = quota - selPred.length;
      const selAgile = agilePl.slice(0, Math.min(remaining, agilePl.length));
      const combined = [...selPred, ...selAgile];

      if (combined.length < quota) {
        const used  = new Set(combined.map(q => q.id));
        const extra = shuffleArray(pool.filter(q => !used.has(q.id)));
        combined.push(...extra.slice(0, quota - combined.length));
      }
      result.push(...combined.slice(0, quota));
    }
    return shuffleArray(result);
  }

  function shuffleArray(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /* ── Answer update (practice mode — immediate) ─────────────── */
  function onAnswer(qid, isCorrect, timeSec, mode) {
    const st    = Storage();
    const stats = st.getStats();
    if (!stats.questions[qid])
      stats.questions[qid] = { attempts: 0, wrongScore: 0, lastSeen: 0 };

    const qs = stats.questions[qid];
    qs.attempts++;
    qs.lastSeen  = Date.now();
    qs.wrongScore = isCorrect
      ? Math.max(0, qs.wrongScore * 0.5 - 0.25)
      : qs.wrongScore + 1;

    // update task aggregate
    const task = null; // caller can pass if needed
    st.saveStats(stats);
    st.appendAttempt({ qid, ts: Date.now(), correct: isCorrect, timeSec, mode });
  }

  /** Batch update after exam mode — does NOT append mid-exam */
  function onAnswerBatch(answers) {
    const st    = Storage();
    const stats = st.getStats();
    for (const { qid, isCorrect, timeSec } of answers) {
      if (!stats.questions[qid])
        stats.questions[qid] = { attempts: 0, wrongScore: 0, lastSeen: 0 };
      const qs   = stats.questions[qid];
      qs.attempts++;
      qs.lastSeen   = Date.now();
      qs.wrongScore = isCorrect
        ? Math.max(0, qs.wrongScore * 0.5 - 0.25)
        : qs.wrongScore + 1;
      st.appendAttempt({ qid, ts: Date.now(), correct: isCorrect, timeSec, mode: 'exam' });
    }
    st.saveStats(stats);
  }

  /* ── Score report ───────────────────────────────────────────── */
  function domainRating(pct) {
    if (pct >= 78) return 'Above Target';
    if (pct >= 65) return 'Target';
    if (pct >= 50) return 'Below Target';
    return 'Needs Improvement';
  }

  function computeScoreReport(questions, answers) {
    const qMap   = new Map(questions.map(q => [q.id, q]));
    const dStats = { people: { c:0, t:0 }, process: { c:0, t:0 }, business: { c:0, t:0 } };
    const aStats = { predictive: { c:0, t:0 }, agile: { c:0, t:0 } };
    let correct  = 0;

    for (const ans of answers) {
      const q = qMap.get(ans.qid); if (!q) continue;
      if (ans.correct) correct++;
      if (dStats[q.domain]) { dStats[q.domain].t++; if (ans.correct) dStats[q.domain].c++; }
      const app = q.approach === 'hybrid' ? 'agile' : q.approach;
      if (aStats[app]) { aStats[app].t++; if (ans.correct) aStats[app].c++; }
    }

    const total = answers.length;
    const pct   = total > 0 ? Math.round(correct / total * 100) : 0;

    const domains = {};
    for (const [k, v] of Object.entries(dStats)) {
      const p = v.t > 0 ? Math.round(v.c / v.t * 100) : 0;
      domains[k] = { correct: v.c, total: v.t, pct: p, rating: domainRating(p) };
    }
    const approaches = {};
    for (const [k, v] of Object.entries(aStats)) {
      const p = v.t > 0 ? Math.round(v.c / v.t * 100) : 0;
      approaches[k] = { correct: v.c, total: v.t, pct: p };
    }

    return { total, correct, pct, pass: pct >= 65, domains, approaches };
  }

  /* ── Export ─────────────────────────────────────────────────── */
  G.PMP = G.PMP || {};
  G.PMP.Engine = {
    computePriority, sampleQuestions, sampleExamQuestions,
    onAnswer, onAnswerBatch, computeScoreReport,
    shuffleArray, domainRating
  };
})(window);
