# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Vietnamese PMBOK® Guide 6 Learning & Exam Preparation Platform — a static single-page web application hosted on GitHub Pages. It has two main components:

- **PMBOK Reader** (`index.html` + `app.js`): Interactive Vietnamese translation reader with progress tracking, text highlighting, and inline notes.
- **PMP Exam Simulator** (`pmp-exam/`): Question bank and practice/exam session system with intelligent adaptive question selection.

**Tech stack**: Vanilla HTML/CSS/JS only. No build step, no framework, no TypeScript. One Node.js dependency (`jsdom`) used only by the text-extraction utility script.

## Running Locally

```bash
# Serve the static site from the repo root
python -m http.server 8000
# Then open http://localhost:8000/
```

No install or build step is needed for the main app. To use the utility script:

```bash
npm install   # installs jsdom
node scripts/extract-chapter-text.js
```

To generate audio (requires Python + `gtts`):

```bash
python3 scripts/generate-audio.py
```

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which assembles a `_site/` directory (copying `index.html`, `style.css`, `app.js`, `home.html`, `rita-quiz.html`, `books/`, `chapters/`, `pmp-exam/`) and deploys to GitHub Pages. The workflow does **not** copy `scripts/`, `docs/`, `data/`, or `node_modules/`.

## Architecture: PMBOK Reader (`app.js`)

The reader uses an **iframe + postMessage bridge** pattern:
1. The shell (`index.html`) renders the sidebar and chrome.
2. Chapter content from `books/pmbok6/{id}.html` is fetched and injected into an `<iframe>` along with a bridge script.
3. The bridge script handles user text selection and fires `postMessage` events back to the shell.
4. The shell processes those events to create, edit, or delete highlights.

**State** lives in a single `state` object (in-memory), persisted to `localStorage` under the key `pmbok6_progress` on a 2-second debounce after any change:

```js
state = {
  progress:   { chapterId: { status: 'unread'|'reading'|'done', scrollPos: 0 } },
  highlights: { chapterId: [{ id, xpath, startOffset, endOffset, color, note }] },
  lastChapter: 'chapter_id'
}
```

Highlights are anchored with **XPath + character offsets** so they survive minor DOM changes. The `CHAPTERS` array (16 entries) and `TRANSLATED_IDS` set in `app.js` are the source of truth for which chapters exist and which have Vietnamese translations.

## Architecture: PMP Exam Simulator (`pmp-exam/`)

Multi-screen SPA with **hash-based routing** (`#home`, `#practice-setup`, `#practice-session`, `#practice-summary`, `#bank`, `#settings`, `#dashboard`). All modules attach to `window.PMP.*`.

### Module responsibilities

| File | Role |
|------|------|
| `js/app.js` | Router, screen rendering, event handlers |
| `js/engine.js` | Pure functions: `computePriority`, `sampleQuestions`, `sampleExamQuestions`, `computeScoreReport` |
| `js/storage.js` | IndexedDB wrapper (`pmp_simulator` DB, stores: `pmp_questions`, `pmp_attempts`, `pmp_exam_sessions`) + in-memory stats via `localStorage` |
| `js/practice.js` | Session lifecycle: start, next/prev question, submit answer |
| `js/ui/question-renderer.js` | DOM rendering for individual questions |

### Question sampling algorithm (engine.js)

`sampleQuestions()` implements **Efraimidis–Spirakis weighted reservoir sampling**. Each question gets a random key `= random^(1/priority)`, sorted descending. Priority (`computePriority`) factors:
- `wrongScore`: wrong answers accumulate; correct answers decay it by 50%
- Recency: answered < 1 day ago → 0.2×; > 14 days → 1.3×
- User boosts per domain/task (clamped 0.25–5×)
- Novelty: never-attempted questions get 1.2×

A **40% task cap** (`ceil(n * 0.4)`) prevents over-sampling from any single PMI task. Exam mode (`sampleExamQuestions`) uses fixed quotas: People 76, Process 90, Business 14, with ~50/50 predictive/agile split per domain.

### Question schema

```json
{
  "id": "PPL-0001",
  "domain": "people",
  "task": "1.1",
  "approach": "agile|predictive|hybrid",
  "type": "single|multiple|matching|hotspot|fill",
  "question": "...",
  "options": ["A", "B", "C", "D"],
  "correct": [1],
  "explanation": "...",
  "explanation_vi": "...",
  "difficulty": 2,
  "tags": ["conflict-resolution"]
}
```

Question files live in `pmp-exam/data/questions/` (45 JSON files, ~905 questions total). Files named `batch_*.json` are chapter-based batches; files named `t_{domain}_{task}.json` (e.g., `t_1_1.json`) are organized by PMI task. The `pmp-exam/data/all-questions.json` is a merge container that is populated at runtime from all individual files.

### PMI Domain/Task mapping

- **People** (domain `1.*`): tasks 1.1–1.14
- **Process** (domain `2.*`): tasks 2.1–2.17
- **Business** (domain `3.*`): tasks 3.1–3.4

`TASK_DOMAIN_MAP` and `TASK_NAMES` in `storage.js` are the canonical references.

## Content Structure

- `books/pmbok6/` — 36 HTML files, one per PMBOK6 chapter/section (Vietnamese)
- `books/PMPExamPrep/` — Rita Mulcahy exam prep reference HTML files
- `chapters/` — Markdown versions of chapters (18 `.md` files); `chap12.html` is a rendered sample

## Key Conventions

- **Vietnamese-first UI**: All user-facing labels, chapter titles, progress states, and score ratings are in Vietnamese. Exam question content is in English with Vietnamese explanations (`explanation_vi`).
- **No modules / no bundler**: Scripts are loaded via `<script>` tags in order. The exam simulator uses the IIFE pattern `(function(G){ ... })(window)` and exports to `window.PMP.*`.
- **No linter or formatter is configured**. The codebase uses `'use strict'` at the top of each JS file.
- **Storage**: The reader uses `localStorage`; the exam simulator uses `IndexedDB` (via `storage.js`) for questions and attempts, and `localStorage` for aggregated stats.
- **Score pass threshold**: 65% overall. Domain ratings: ≥78% = "Above Target", ≥65% = "Target", ≥50% = "Below Target", <50% = "Needs Improvement".
