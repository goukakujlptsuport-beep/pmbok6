'use strict';
/**
 * question-renderer.js — Renders question DOM elements.
 * Supports: single, multiple. (matching/hotspot/fill stubs for Phase 4)
 */
(function (G) {
  const LETTERS = ['A','B','C','D','E','F'];

  /* ── Render question card ──────────────────────────────────── */
  function renderQuestion(q, mode) {
    const card = el('div', 'q-card');
    card.dataset.qid  = q.id;
    card.dataset.type = q.type;

    // metadata strip
    const meta = el('div', 'q-meta');
    meta.innerHTML =
      `<span class="q-tag q-domain-${q.domain}">${cap(q.domain)}</span>` +
      `<span class="q-tag q-task">Task ${q.task}</span>` +
      `<span class="q-tag q-approach">${cap(q.approach)}</span>` +
      (q.difficulty ? `<span class="q-tag q-diff">${'★'.repeat(q.difficulty)}${'☆'.repeat(5-q.difficulty)}</span>` : '');
    card.appendChild(meta);

    // question text
    const body = el('div', 'q-body');
    body.textContent = q.question;
    card.appendChild(body);

    // options
    const opts = el('div', 'q-opts');
    if (q.type === 'single')   _renderSingle(q, opts);
    else if (q.type === 'multiple') _renderMultiple(q, opts);
    else {
      const stub = el('p', 'q-stub');
      stub.textContent = `[Question type "${q.type}" not yet supported in this version]`;
      opts.appendChild(stub);
    }
    card.appendChild(opts);

    // explanation area — hidden until revealed
    const exp = el('div', 'q-exp-area hidden');
    card.appendChild(exp);

    return card;
  }

  function _renderSingle(q, container) {
    q.options.forEach((text, i) => {
      const row  = el('label', 'opt-row');
      row.dataset.idx = i;
      const inp  = document.createElement('input');
      inp.type   = 'radio'; inp.name = `q_${q.id}`; inp.value = i;
      const key  = el('span', 'opt-key'); key.textContent = LETTERS[i];
      const txt  = el('span', 'opt-text'); txt.textContent = text;
      const stk  = _strikeBtn();
      row.append(inp, key, txt, stk);
      container.appendChild(row);
    });
    _initStrike(container);
  }

  function _renderMultiple(q, container) {
    const needed = q.correct.length;
    const info = el('div', 'q-multi-info');
    info.textContent = `Select ${needed} answer${needed > 1 ? 's' : ''}.`;
    container.appendChild(info);

    const boxes = [];
    q.options.forEach((text, i) => {
      const row  = el('label', 'opt-row');
      row.dataset.idx = i;
      const inp  = document.createElement('input');
      inp.type   = 'checkbox'; inp.name = `q_${q.id}`; inp.value = i;
      boxes.push(inp);
      const key  = el('span', 'opt-key'); key.textContent = LETTERS[i];
      const txt  = el('span', 'opt-text'); txt.textContent = text;
      const stk  = _strikeBtn();
      row.append(inp, key, txt, stk);
      container.appendChild(row);
    });

    // enforce max selections
    boxes.forEach(b => b.addEventListener('change', () => {
      const checked = boxes.filter(x => x.checked);
      if (checked.length > needed) b.checked = false;
    }));
    _initStrike(container);
  }

  function _strikeBtn() {
    const btn = el('button', 'strike-btn');
    btn.type = 'button'; btn.title = 'Cross out this option';
    btn.textContent = '–';
    btn.addEventListener('click', e => {
      e.preventDefault(); e.stopPropagation();
      btn.closest('.opt-row').classList.toggle('struck');
    });
    return btn;
  }

  function _initStrike(container) {
    // right-click on option row also toggles strike
    container.querySelectorAll('.opt-row').forEach(row => {
      row.addEventListener('contextmenu', e => {
        e.preventDefault();
        row.classList.toggle('struck');
      });
    });
  }

  /* ── Read user response ────────────────────────────────────── */
  function getResponse(card) {
    if (!card) return null;
    const type = card.dataset.type;
    if (type === 'single') {
      const inp = card.querySelector('input[type=radio]:checked');
      return inp ? [parseInt(inp.value)] : null;
    }
    if (type === 'multiple') {
      const checked = [...card.querySelectorAll('input[type=checkbox]:checked')];
      return checked.length ? checked.map(c => parseInt(c.value)).sort((a,b)=>a-b) : null;
    }
    return null;
  }

  /* ── Check correctness ──────────────────────────────────────── */
  function isCorrect(q, response) {
    if (!response) return false;
    const a = [...q.correct].sort((a,b)=>a-b);
    const b = [...response].sort((a,b)=>a-b);
    return a.length === b.length && a.every((v,i) => v === b[i]);
  }

  /* ── Reveal answer ─────────────────────────────────────────── */
  function revealAnswer(card, q, response, settings) {
    const lang   = settings?.ui?.lang || 'en';
    const right  = isCorrect(q, response);
    const resp   = response || [];

    // mark option rows
    card.querySelectorAll('.opt-row').forEach(row => {
      const idx = parseInt(row.dataset.idx);
      const inp = row.querySelector('input');
      if (inp) inp.disabled = true;
      row.classList.add('locked');
      if (q.correct.includes(idx))  row.classList.add('opt-correct');
      else if (resp.includes(idx))  row.classList.add('opt-wrong');
    });
    // disable strike buttons
    card.querySelectorAll('.strike-btn').forEach(b => b.disabled = true);

    // explanation
    const expArea = card.querySelector('.q-exp-area');
    expArea.classList.remove('hidden');
    expArea.classList.toggle('exp-right', right);
    expArea.classList.toggle('exp-wrong', !right);

    const expText = (lang === 'vi' && q.explanation_vi) ? q.explanation_vi : (q.explanation || '');
    const altText = (lang === 'vi' && q.explanation)    ? q.explanation    : (q.explanation_vi || '');
    const altLang = lang === 'vi' ? 'EN' : 'VI';
    const altContent = altText ? `<details class="exp-alt"><summary>Show ${altLang}</summary><p>${esc(altText)}</p></details>` : '';

    expArea.innerHTML =
      `<div class="exp-verdict ${right ? 'v-right':'v-wrong'}">${right ? '✓ Correct' : '✗ Incorrect'}</div>` +
      `<p class="exp-text">${esc(expText)}</p>` +
      altContent;

    return right;
  }

  /* ── Lock all inputs ────────────────────────────────────────── */
  function lockQuestion(card) {
    card.querySelectorAll('input').forEach(i => i.disabled = true);
    card.querySelectorAll('.opt-row').forEach(r => r.classList.add('locked'));
    card.querySelectorAll('.strike-btn').forEach(b => b.disabled = true);
  }

  /* ── Utility ────────────────────────────────────────────────── */
  function el(tag, cls) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    return e;
  }
  function cap(s) { return s ? s[0].toUpperCase() + s.slice(1) : ''; }
  function esc(s) {
    return String(s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  G.PMP = G.PMP || {};
  G.PMP.Renderer = { renderQuestion, getResponse, isCorrect, revealAnswer, lockQuestion };
})(window);
