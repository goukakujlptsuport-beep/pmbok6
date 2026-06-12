'use strict';
(async function () {
  const St  = PMP.Storage;
  const Eng = PMP.Engine;
  const Ren = PMP.Renderer;
  const Pr  = PMP.Practice;

  /* ═══════════════════════════════════════════════════════════
     ROUTER
  ═══════════════════════════════════════════════════════════ */
  const SCREENS = ['home','practice-setup','practice-session','practice-summary','bank','settings','dashboard'];
  const $ = id => document.getElementById(id);

  function showScreen(name) {
    if (!SCREENS.includes(name)) name = 'home';
    SCREENS.forEach(s => {
      const el = $(`screen-${s}`);
      if (el) el.classList.toggle('active', s === name);
    });
    document.querySelectorAll('.nav-link').forEach(a =>
      a.classList.toggle('active', a.dataset.screen === name));
    window.history.replaceState(null, '', `#/${name}`);
    // per-screen init
    if (name === 'home')           initHome();
    if (name === 'practice-setup') initPracticeSetup();
    if (name === 'bank')           initBank();
    if (name === 'settings')       initSettings();
  }

  window.addEventListener('hashchange', () => {
    showScreen(location.hash.replace('#/','') || 'home');
  });

  document.querySelectorAll('[data-screen]').forEach(el =>
    el.addEventListener('click', e => { e.preventDefault(); showScreen(el.dataset.screen); }));

  // sidebar toggle (mobile)
  $('menu-toggle')?.addEventListener('click', () =>
    $('app-sidebar')?.classList.toggle('open'));
  $('sidebar-overlay')?.addEventListener('click', () =>
    $('app-sidebar')?.classList.remove('open'));

  /* ═══════════════════════════════════════════════════════════
     HOME
  ═══════════════════════════════════════════════════════════ */
  async function initHome() {
    const questions = await St.getAllQuestions();
    const byDomain  = { people: 0, process: 0, business: 0 };
    questions.forEach(q => byDomain[q.domain] = (byDomain[q.domain]||0)+1);

    setText('stat-total',    questions.length);
    setText('stat-people',   byDomain.people);
    setText('stat-process',  byDomain.process);
    setText('stat-business', byDomain.business);

    const stats        = St.getStats();
    const totalAttempts = Object.values(stats.questions).reduce((s,q) => s+(q.attempts||0), 0);
    setText('stat-attempts', totalAttempts);

    const examReady = questions.length >= 180;
    const examBtn   = $('btn-start-exam');
    if (examBtn) {
      examBtn.disabled = !examReady;
      examBtn.title    = examReady
        ? 'Start 180-question PMP exam simulation'
        : `Need ${180 - questions.length} more questions (have ${questions.length}/180)`;
    }

    // bank coverage by task
    const taskCoverage = $('task-coverage');
    if (taskCoverage) {
      const byTask = {};
      questions.forEach(q => byTask[q.task] = (byTask[q.task]||0)+1);
      const lowTasks = Object.entries(St.TASK_NAMES)
        .filter(([id]) => (byTask[id]||0) < 10)
        .map(([id, name]) => `Task ${id} — ${name}: ${byTask[id]||0} questions`)
        .join('<br>');
      taskCoverage.innerHTML = lowTasks
        ? `<div class="coverage-warn">⚠ Tasks with < 10 questions:<br>${lowTasks}</div>`
        : `<div class="coverage-ok">✓ All 35 tasks have ≥ 10 questions.</div>`;
    }
  }

  /* ═══════════════════════════════════════════════════════════
     PRACTICE SETUP
  ═══════════════════════════════════════════════════════════ */
  async function initPracticeSetup() {
    const questions = await St.getAllQuestions();
    setText('ps-available', `${questions.length} questions in bank`);

    const domSel  = $('ps-domain');
    const taskSel = $('ps-task');

    function fillTasks() {
      const dom = domSel?.value || 'all';
      taskSel.innerHTML = '<option value="all">All Tasks</option>';
      Object.entries(St.TASK_NAMES).forEach(([id, name]) => {
        if (dom !== 'all') {
          const prefix = { people:'1.', process:'2.', business:'3.' }[dom];
          if (!id.startsWith(prefix)) return;
        }
        const o = document.createElement('option');
        o.value = id; o.textContent = `${id} — ${name}`;
        taskSel.appendChild(o);
      });
    }

    domSel?.addEventListener('change', fillTasks);
    fillTasks();

    // num-questions pill buttons
    document.querySelectorAll('.ps-num-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.ps-num-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const custom = $('ps-custom-wrap');
        if (custom) custom.style.display = btn.dataset.n === 'custom' ? 'flex' : 'none';
      });
    });
  }

  $('btn-start-practice')?.addEventListener('click', async () => {
    const activeBtn = document.querySelector('.ps-num-btn.active');
    const raw = activeBtn?.dataset.n === 'custom'
      ? parseInt($('ps-custom')?.value) || 20
      : parseInt(activeBtn?.dataset.n) || 20;

    const config = {
      numQuestions:   Math.max(1, Math.min(200, raw)),
      domainFilter:   $('ps-domain')?.value   || 'all',
      taskFilter:     $('ps-task')?.value     || 'all',
      approachFilter: $('ps-approach')?.value || 'all',
      poolFilter:     $('ps-pool')?.value     || 'all'
    };

    const result = await Pr.startSession(config);
    if (result.error) { showToast(result.error, 'error'); return; }

    showScreen('practice-session');
    renderPracticeQuestion();
  });

  /* ═══════════════════════════════════════════════════════════
     PRACTICE SESSION
  ═══════════════════════════════════════════════════════════ */
  let _currentCard = null;

  function renderPracticeQuestion() {
    const session = Pr.getSession();
    const q       = Pr.getCurrentQuestion();
    if (!q || !session) return;

    const idx   = session.currentIdx;
    const total = session.questions.length;
    const settings = St.getSettings();

    // progress
    setText('ps-q-num', `Question ${idx + 1} / ${total}`);
    const fill = $('ps-progress-fill');
    if (fill) fill.style.width = `${(idx / total) * 100}%`;

    // question id badge
    setText('ps-q-id', `${q.id} · Task ${q.task}`);

    // render
    const container = $('ps-q-container');
    container.innerHTML = '';
    _currentCard = Ren.renderQuestion(q, 'practice');
    container.appendChild(_currentCard);

    // enable Check when selection made
    const checkBtn = $('ps-check');
    checkBtn.disabled = true;
    checkBtn.style.display = 'inline-flex';
    $('ps-next').style.display    = 'none';
    $('ps-boost').style.display   = 'none';
    $('ps-boost').disabled        = false;
    $('ps-boost').textContent     = '⭐ More like this';
    $('ps-finish').style.display  = 'none';

    _currentCard.querySelectorAll('input').forEach(inp =>
      inp.addEventListener('change', () => {
        checkBtn.disabled = !Ren.getResponse(_currentCard);
      }));

    setupPracticeKeys(q);
  }

  function setupPracticeKeys(q) {
    document.onkeydown = e => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      // 1-6 → select option
      if ('123456'.includes(e.key)) {
        const i = +e.key - 1;
        if (q.type === 'single') {
          const r = _currentCard?.querySelectorAll('input[type=radio]');
          r?.[i]?.click();
        } else if (q.type === 'multiple') {
          const c = _currentCard?.querySelectorAll('input[type=checkbox]');
          c?.[i]?.click();
        }
      }
      // Enter → check / next
      if (e.key === 'Enter') {
        const chk = $('ps-check');
        const nxt = $('ps-next');
        const fin = $('ps-finish');
        if (chk && !chk.disabled && chk.style.display !== 'none') chk.click();
        else if (nxt && nxt.style.display !== 'none') nxt.click();
        else if (fin && fin.style.display !== 'none') fin.click();
      }
      // → / N → next
      if ((e.key === 'ArrowRight' || e.key === 'n' || e.key === 'N')) {
        const nxt = $('ps-next');
        if (nxt && nxt.style.display !== 'none') nxt.click();
      }
      // F → flag (practice: boost)
      if (e.key === 'f' || e.key === 'F') {
        const b = $('ps-boost');
        if (b && !b.disabled && b.style.display !== 'none') b.click();
      }
    };
  }

  $('ps-check')?.addEventListener('click', () => {
    if (!_currentCard) return;
    const q        = Pr.getCurrentQuestion();
    const response = Ren.getResponse(_currentCard);
    if (!response) return;

    const correct  = Pr.submitAnswer(response);
    const settings = St.getSettings();
    Ren.revealAnswer(_currentCard, q, response, settings);

    $('ps-check').style.display  = 'none';
    $('ps-boost').style.display  = 'inline-flex';

    if (Pr.isLastQuestion()) {
      $('ps-finish').style.display = 'inline-flex';
    } else {
      $('ps-next').style.display   = 'inline-flex';
    }
    // update live score
    const session = Pr.getSession();
    const done    = session.answers.length;
    const corr    = session.answers.filter(a => a.correct).length;
    setText('ps-live-score', `${corr} / ${done} correct`);
  });

  $('ps-next')?.addEventListener('click', () => {
    Pr.nextQuestion();
    renderPracticeQuestion();
  });

  $('ps-boost')?.addEventListener('click', () => {
    Pr.boostCurrentTask();
    $('ps-boost').textContent = '✓ Added to focus';
    $('ps-boost').disabled    = true;
  });

  $('ps-finish')?.addEventListener('click', finishSession);

  $('ps-quit')?.addEventListener('click', () => {
    const session = Pr.getSession();
    if (session?.answers.length) {
      if (!confirm('End session early? Your progress has been saved.')) return;
    }
    finishSession();
  });

  function finishSession() {
    document.onkeydown = null;
    const summary = Pr.getSessionSummary();
    Pr.endSession();
    renderSummary(summary);
    showScreen('practice-summary');
  }

  /* ═══════════════════════════════════════════════════════════
     PRACTICE SUMMARY
  ═══════════════════════════════════════════════════════════ */
  function renderSummary(s) {
    if (!s) return;
    const { total, correct, pct, totalTime, domainBreakdown, wrongAnswers } = s;
    const mins = (totalTime / 60) | 0, secs = totalTime % 60;

    setText('sum-score',   `${correct} / ${total}`);
    setText('sum-pct',     `${pct}%`);
    setText('sum-time',    `${mins}m ${secs}s`);

    // result circle color
    const circle = $('sum-circle');
    if (circle) {
      circle.className = 'sum-circle ' + (pct >= 78 ? 'above' : pct >= 65 ? 'target' : pct >= 50 ? 'below' : 'needs');
    }

    // verdict
    const verdict = $('sum-verdict');
    if (verdict) {
      verdict.textContent = pct >= 78 ? '🏆 Excellent' : pct >= 65 ? '✓ Good' : pct >= 50 ? '△ Passing range' : '✗ Keep practicing';
    }

    // domain breakdown
    const domEl = $('sum-domains');
    if (domEl) {
      domEl.innerHTML = Object.entries(domainBreakdown).map(([dom, d]) => {
        const p = d.total ? Math.round(d.correct/d.total*100) : 0;
        return `<div class="sum-dom-row">
          <span class="sum-dom-name dom-${dom}">${cap(dom)}</span>
          <span class="sum-dom-score">${d.correct}/${d.total}</span>
          <span class="sum-dom-pct">${p}%</span>
          <div class="sum-dom-bar"><div style="width:${p}%"></div></div>
        </div>`;
      }).join('');
    }

    // wrong answers
    const wrongEl = $('sum-wrong');
    if (wrongEl) {
      if (!wrongAnswers.length) {
        wrongEl.innerHTML = '<p class="sum-perfect">🎉 Perfect — no wrong answers!</p>';
      } else {
        const settings = St.getSettings();
        const lang     = settings.ui.lang;
        wrongEl.innerHTML = `<h4 class="sum-wrong-title">${wrongAnswers.length} wrong answer${wrongAnswers.length>1?'s':''}</h4>` +
          wrongAnswers.map(a => {
            const q = a.question; if (!q) return '';
            const exp     = (lang==='vi' && q.explanation_vi) ? q.explanation_vi : (q.explanation||'');
            const correct = q.correct.map(i => `${['A','B','C','D','E','F'][i]}. ${q.options[i]||''}`).join('; ');
            return `<details class="wrong-item">
              <summary class="wrong-q">${escHtml(q.question.substring(0,120))}${q.question.length>120?'…':''}</summary>
              <p class="wrong-correct">✓ ${escHtml(correct)}</p>
              ${exp ? `<p class="wrong-exp">${escHtml(exp)}</p>` : ''}
            </details>`;
          }).join('');
      }
    }
  }

  $('sum-practice-again')?.addEventListener('click', () => showScreen('practice-setup'));
  $('sum-home')?.addEventListener('click',          () => showScreen('home'));

  /* ═══════════════════════════════════════════════════════════
     QUESTION BANK
  ═══════════════════════════════════════════════════════════ */
  let _bankQuestions = [];

  async function initBank() {
    _bankQuestions = await St.getAllQuestions();
    renderBankList(_bankQuestions);
  }

  function renderBankList(questions) {
    setText('bank-count', `${questions.length} question${questions.length!==1?'s':''}`);
    const list = $('bank-list');
    if (!list) return;
    if (!questions.length) {
      list.innerHTML = '<p class="empty-state">No questions found. Import questions in Settings.</p>';
      return;
    }
    list.innerHTML = questions.map(q => `
      <div class="bank-row" data-qid="${escHtml(q.id)}">
        <div class="bank-meta">
          <span class="q-tag q-domain-${q.domain}">${cap(q.domain)}</span>
          <span class="q-tag q-task">Task ${q.task}</span>
          <span class="q-tag q-approach">${cap(q.approach)}</span>
          <span class="q-tag q-type">${q.type}</span>
        </div>
        <div class="bank-q-text">${escHtml(q.id)}: ${escHtml(q.question.substring(0,140))}${q.question.length>140?'…':''}</div>
      </div>`).join('');

    list.querySelectorAll('.bank-row').forEach(row =>
      row.addEventListener('click', () => {
        const q = _bankQuestions.find(x => x.id === row.dataset.qid);
        if (q) showQuestionModal(q);
      }));
  }

  // search + filter
  function bankFilter() {
    const text = ($('bank-search')?.value || '').toLowerCase();
    const dom  = $('bank-filter-dom')?.value || 'all';
    const filtered = _bankQuestions.filter(q => {
      if (dom !== 'all' && q.domain !== dom) return false;
      if (text && !q.question.toLowerCase().includes(text) && !q.id.toLowerCase().includes(text)) return false;
      return true;
    });
    renderBankList(filtered);
  }

  $('bank-search')?.addEventListener('input',  bankFilter);
  $('bank-filter-dom')?.addEventListener('change', bankFilter);

  function showQuestionModal(q) {
    const modal = $('q-modal');
    const body  = $('q-modal-body');
    if (!modal || !body) return;
    const stats = St.getQStat(q.id);
    body.innerHTML = `
      <div class="modal-q-header">
        <h3>${escHtml(q.id)}</h3>
        <div class="modal-meta">
          <span class="q-tag q-domain-${q.domain}">${cap(q.domain)}</span>
          <span class="q-tag">Task ${q.task} — ${escHtml(St.TASK_NAMES[q.task]||'')}</span>
          <span class="q-tag q-approach">${cap(q.approach)}</span>
          <span class="q-tag">Difficulty: ${q.difficulty||'?'}/5</span>
        </div>
        <div class="modal-stats">Attempts: ${stats.attempts} | WrongScore: ${stats.wrongScore.toFixed(2)} | Last seen: ${stats.lastSeen ? new Date(stats.lastSeen).toLocaleDateString() : 'Never'}</div>
      </div>
      <p class="modal-q-text">${escHtml(q.question)}</p>
      <ol class="modal-opts" type="A">
        ${(q.options||[]).map((o,i)=>`<li class="${q.correct?.includes(i)?'modal-correct':''}">${escHtml(o)}</li>`).join('')}
      </ol>
      <div class="modal-exp">
        <strong>Explanation:</strong> ${escHtml(q.explanation||'N/A')}
        ${q.explanation_vi ? `<br><strong>Tiếng Việt:</strong> ${escHtml(q.explanation_vi)}` : ''}
      </div>`;
    modal.classList.remove('hidden');
    modal.addEventListener('click', closeModalOnBackdrop, { once: true });
  }

  function closeModalOnBackdrop(e) {
    if (e.target === $('q-modal')) $('q-modal').classList.add('hidden');
  }
  $('q-modal-close')?.addEventListener('click', () => $('q-modal')?.classList.add('hidden'));

  /* ═══════════════════════════════════════════════════════════
     SETTINGS
  ═══════════════════════════════════════════════════════════ */
  function initSettings() {
    const settings = St.getSettings();

    // theme
    const themeToggle = $('setting-theme');
    if (themeToggle) {
      themeToggle.checked = settings.ui.theme === 'dark';
      themeToggle.onchange = () => {
        const dark = themeToggle.checked;
        document.body.classList.toggle('theme-dark',  dark);
        document.body.classList.toggle('theme-light', !dark);
        const s = St.getSettings(); s.ui.theme = dark ? 'dark' : 'light'; St.saveSettings(s);
      };
    }

    // language
    const langSel = $('setting-lang');
    if (langSel) {
      langSel.value    = settings.ui.lang || 'en';
      langSel.onchange = () => { const s = St.getSettings(); s.ui.lang = langSel.value; St.saveSettings(s); };
    }

    renderBoostSliders(settings);
  }

  function renderBoostSliders(settings) {
    // domain boosts
    const domWrap = $('boost-domains');
    if (domWrap) {
      domWrap.innerHTML = ['people','process','business'].map(d => {
        const val = +(settings.userBoost.domains[d] ?? 1).toFixed(2);
        return `<div class="boost-row">
          <label class="boost-label">${cap(d)}</label>
          <input type="range" min="0.25" max="5" step="0.25" value="${val}"
            class="boost-slider" data-type="domain" data-key="${d}">
          <span class="boost-val">${val.toFixed(2)}×</span>
        </div>`;
      }).join('');
    }
    // task boosts — show only non-default ones + add-task UI
    const taskWrap = $('boost-tasks');
    if (taskWrap) {
      const customTasks = Object.entries(settings.userBoost.tasks).filter(([,v])=>v!==1);
      taskWrap.innerHTML = customTasks.length
        ? customTasks.map(([taskId, val]) =>
            `<div class="boost-row">
              <label class="boost-label">${taskId} — ${St.TASK_NAMES[taskId]||''}</label>
              <input type="range" min="0.25" max="5" step="0.25" value="${val}"
                class="boost-slider" data-type="task" data-key="${taskId}">
              <span class="boost-val">${(+val).toFixed(2)}×</span>
              <button class="boost-reset" data-key="${taskId}" title="Reset to 1×">↺</button>
            </div>`).join('')
        : '<p class="empty-state">No custom task weights. Use "More like this" during practice or the slider below.</p>';

      // reset buttons
      taskWrap.querySelectorAll('.boost-reset').forEach(btn => {
        btn.addEventListener('click', () => {
          const s = St.getSettings();
          delete s.userBoost.tasks[btn.dataset.key];
          St.saveSettings(s);
          renderBoostSliders(s);
        });
      });
    }

    // attach slider listeners for domain sliders
    document.querySelectorAll('.boost-slider').forEach(slider => {
      slider.oninput = () => {
        const val = +slider.value;
        slider.nextElementSibling.textContent = val.toFixed(2) + '×';
        const s = St.getSettings();
        if (slider.dataset.type === 'domain') s.userBoost.domains[slider.dataset.key] = val;
        else                                  s.userBoost.tasks[slider.dataset.key]   = val;
        St.saveSettings(s);
      };
    });

    // task picker to add custom boost
    const taskPicker = $('boost-task-picker');
    const taskAdd    = $('boost-task-add');
    if (taskPicker && !taskPicker.options.length) {
      Object.entries(St.TASK_NAMES).forEach(([id, name]) => {
        const o = document.createElement('option'); o.value = id; o.textContent = `${id} — ${name}`; taskPicker.appendChild(o);
      });
    }
    taskAdd?.addEventListener('click', () => {
      const id = taskPicker?.value; if (!id) return;
      const s  = St.getSettings();
      if (!s.userBoost.tasks[id]) { s.userBoost.tasks[id] = 2.0; St.saveSettings(s); renderBoostSliders(s); }
    });
  }

  /* ── Import questions ─────────────────────────────────────── */
  $('btn-import-qs')?.addEventListener('click', () => $('file-import-qs')?.click());
  $('file-import-qs')?.addEventListener('change', async e => {
    const file = e.target.files[0]; if (!file) return;
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const arr  = Array.isArray(json) ? json : (json.questions || []);
      if (!arr.length) throw new Error('No questions found in file (expected a JSON array)');
      const result = await St.importQuestions(arr);
      showImportResult(result);
      e.target.value = '';
    } catch (err) { showToast(`Import error: ${err.message}`, 'error'); }
  });

  function showImportResult(r) {
    const el = $('import-result'); if (!el) return;
    el.className  = 'import-result';
    el.innerHTML  = `
      <div class="ir-summary">
        <span class="ir-added">✓ Added: ${r.added}</span>
        <span class="ir-dup">≈ Duplicates skipped: ${r.duplicates}</span>
        <span class="ir-invalid">✗ Invalid: ${r.invalid}</span>
      </div>
      ${r.errors.length ? `<details class="ir-errors"><summary>View errors</summary><ul>
        ${r.errors.map(e=>`<li><code>${escHtml(e.id)}</code>: ${escHtml(e.errors.join('; '))}</li>`).join('')}
      </ul></details>` : ''}`;
    el.style.display = 'block';
    if (r.added) initHome();
  }

  /* ── Export backup ───────────────────────────────────────── */
  $('btn-export')?.addEventListener('click', async () => {
    const data = await St.exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a    = document.createElement('a');
    a.href     = URL.createObjectURL(blob);
    a.download = `pmp-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click(); URL.revokeObjectURL(a.href);
  });

  /* ── Import backup ───────────────────────────────────────── */
  $('btn-import-bk')?.addEventListener('click', () => $('file-import-bk')?.click());
  $('file-import-bk')?.addEventListener('change', async e => {
    const file = e.target.files[0]; if (!file) return;
    if (!confirm('This will REPLACE all your questions, history, and settings. Continue?')) { e.target.value=''; return; }
    try {
      const backup = JSON.parse(await file.text());
      await St.importBackup(backup);
      showToast('Backup restored successfully!', 'ok');
      initHome(); initSettings(); e.target.value='';
    } catch (err) { showToast(`Restore error: ${err.message}`, 'error'); }
  });

  /* ── Reset ───────────────────────────────────────────────── */
  $('btn-reset')?.addEventListener('click', async () => {
    if (!confirm('Delete ALL questions, history, and settings? This cannot be undone.')) return;
    if (!confirm('Final confirmation: reset everything?')) return;
    await St.resetAll();
    showToast('All data reset.', 'ok');
    initHome();
  });

  /* ── Copy generation prompt ──────────────────────────────── */
  $('btn-copy-prompt')?.addEventListener('click', () => {
    const prompt = `You are a PMP exam item writer. Generate {N} exam questions for:
- ECO Task: {task_id} — {task_name}
- Approach: {predictive|agile|mixed}
- Difficulty mix: 20% easy, 60% medium, 20% hard
Requirements:
- Situational questions (realistic scenario → "What should the project manager do [first/next]?")
- PMI mindset: servant leadership, address root cause, collaborate before escalate, value delivery
- All 4 options plausible; distractors reflect common wrong mindsets
- No trivia/definition recall; no "all of the above"
- explanation: why correct AND why each distractor is wrong (English)
- explanation_vi: natural Vietnamese translation of explanation
- Output: single JSON array, no markdown fences, no commentary
- Schema: {"id":"PRC-9001","domain":"process","task":"2.1","approach":"agile","type":"single","question":"...","options":["...","...","...","..."],"correct":[1],"explanation":"...","explanation_vi":"...","difficulty":3,"tags":["..."]}
- IDs: use prefix {PPL|PRC|BIZ}-9xxx (app will renumber on import)`;
    navigator.clipboard.writeText(prompt)
      .then(() => { const b=$('btn-copy-prompt'); b.textContent='✓ Copied!'; setTimeout(()=>b.textContent='Copy Generation Prompt',2000); });
  });

  /* ═══════════════════════════════════════════════════════════
     UTILITIES
  ═══════════════════════════════════════════════════════════ */
  function setText(id, val) { const e = $(id); if (e) e.textContent = val; }
  function cap(s) { return s ? s[0].toUpperCase()+s.slice(1) : ''; }
  function escHtml(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  let _toastTimer;
  function showToast(msg, type='ok') {
    let t = $('toast');
    if (!t) { t = document.createElement('div'); t.id='toast'; document.body.appendChild(t); }
    t.textContent = msg;
    t.className   = `toast toast-${type} show`;
    clearTimeout(_toastTimer);
    _toastTimer = setTimeout(() => t.classList.remove('show'), 3500);
  }

  /* ═══════════════════════════════════════════════════════════
     BOOTSTRAP
  ═══════════════════════════════════════════════════════════ */
  async function boot() {
    // apply saved theme
    const settings = St.getSettings();
    document.body.classList.add(`theme-${settings.ui.theme||'light'}`);

    // seed questions if bank is small (empty or only has sample Qs)
    const existing = await St.getAllQuestions();
    if (existing.length < 200) {
      for (const url of ['data/sample-questions.json', 'data/all-questions.json']) {
        try {
          const res = await fetch(url);
          if (res.ok) {
            const qs    = await res.json();
            const result = await St.importQuestions(qs);
            if (result.added) console.log(`Seeded ${result.added} questions from ${url}.`);
          }
        } catch(e) { console.warn(`Could not load ${url}:`, e); }
      }
    }

    // initial route
    const hash = location.hash.replace('#/','') || 'home';
    showScreen(SCREENS.includes(hash) ? hash : 'home');
  }

  await boot();
})();
