'use strict';
/**
 * practice.js — Practice mode session logic.
 */
(function (G) {
  let _session = null;

  /* ── Build session ─────────────────────────────────────────── */
  async function startSession(config) {
    const { numQuestions, domainFilter, taskFilter, approachFilter, poolFilter } = config;
    const St   = G.PMP.Storage;
    const Eng  = G.PMP.Engine;

    const settings = St.getSettings();

    // build filter
    const filter = {};
    if (domainFilter   && domainFilter   !== 'all') filter.domain   = domainFilter;
    if (taskFilter     && taskFilter     !== 'all') filter.task     = taskFilter;
    if (approachFilter && approachFilter !== 'all') filter.approach = approachFilter;
    if (poolFilter === 'unseen')    filter.unseen    = true;
    if (poolFilter === 'wrong')     filter.wrongOnly = true;

    const pool = await St.getQuestions(filter);
    if (!pool.length) return { error: 'No questions match your current filters. Try broadening the selection.' };

    const questions = Eng.sampleQuestions(pool, Math.min(numQuestions, pool.length), settings);
    if (!questions.length) return { error: 'Could not select questions. Please import questions first.' };

    _session = {
      id:                Date.now().toString(),
      config,
      questions,
      currentIdx:        0,
      answers:           [],
      startTime:         Date.now(),
      questionStartTime: Date.now()
    };

    return { ok: true };
  }

  /* ── Navigation ────────────────────────────────────────────── */
  const getSession         = () => _session;
  const getCurrentQuestion = () => _session ? _session.questions[_session.currentIdx] : null;
  const isLastQuestion     = () => _session && _session.currentIdx >= _session.questions.length - 1;

  function nextQuestion() {
    if (!_session) return false;
    _session.currentIdx++;
    _session.questionStartTime = Date.now();
    return _session.currentIdx < _session.questions.length;
  }

  /* ── Submit answer ─────────────────────────────────────────── */
  function submitAnswer(response) {
    const q      = getCurrentQuestion();
    if (!q) return null;
    const timeSec = Math.round((Date.now() - _session.questionStartTime) / 1000);
    const correct = G.PMP.Renderer.isCorrect(q, response);

    _session.answers.push({ qid: q.id, response, correct, timeSec });

    // update stats immediately (practice mode)
    G.PMP.Engine.onAnswer(q.id, correct, timeSec, 'practice');

    return correct;
  }

  /* ── "More like this" → boost task ────────────────────────── */
  function boostCurrentTask() {
    const q = getCurrentQuestion();
    if (!q) return;
    const St       = G.PMP.Storage;
    const settings = St.getSettings();
    const cur      = settings.userBoost.tasks[q.task] ?? 1.0;
    settings.userBoost.tasks[q.task] = +(Math.min(5, cur + 0.5)).toFixed(2);
    St.saveSettings(settings);
  }

  /* ── Session summary ───────────────────────────────────────── */
  function getSessionSummary() {
    if (!_session) return null;
    const { questions, answers, startTime } = _session;
    const totalTime = Math.round((Date.now() - startTime) / 1000);
    const total     = answers.length;
    const correct   = answers.filter(a => a.correct).length;
    const pct       = total > 0 ? Math.round(correct / total * 100) : 0;

    const domainBreakdown = {};
    const taskBreakdown   = {};
    for (const ans of answers) {
      const q = questions.find(q => q.id === ans.qid);
      if (!q) continue;
      domainBreakdown[q.domain] = domainBreakdown[q.domain] || { correct: 0, total: 0 };
      domainBreakdown[q.domain].total++;
      if (ans.correct) domainBreakdown[q.domain].correct++;

      taskBreakdown[q.task] = taskBreakdown[q.task] || { correct: 0, total: 0, name: G.PMP.Storage.TASK_NAMES[q.task] || '' };
      taskBreakdown[q.task].total++;
      if (ans.correct) taskBreakdown[q.task].correct++;
    }

    const wrongAnswers = answers
      .filter(a => !a.correct)
      .map(a => ({ ...a, question: questions.find(q => q.id === a.qid) }));

    return { total, correct, pct, totalTime, domainBreakdown, taskBreakdown, wrongAnswers };
  }

  function endSession() { _session = null; }

  G.PMP = G.PMP || {};
  G.PMP.Practice = {
    startSession, getSession, getCurrentQuestion,
    isLastQuestion, nextQuestion, submitAnswer,
    boostCurrentTask, getSessionSummary, endSession
  };
})(window);
