# PMBOK 6 Vietnamese Learning Site — Design Spec

**Date:** 2026-05-20  
**Status:** Approved

---

## 1. Overview

A static learning website for reading the Vietnamese translation of PMBOK® Guide 6th Edition, with full progress tracking, scroll position memory, text highlighting, inline notes, and cross-device sync via GitHub Gist. Deployed to GitHub Pages or Netlify.

---

## 2. Architecture

### File Structure

```
pmp/
├── index.html          ← Single shell page
├── app.js              ← All app logic
├── style.css           ← Shell styles only
└── chapters/           ← 16 HTML files copied from Downloads/files/dich/
    ├── 01_instruction.html
    ├── 02_environment.html
    ├── 03_pm_role.html
    ├── 04_integration_management.html
    ├── 05_scope_management.html
    ├── 06_schedule_management.html   ← placeholder (not yet translated)
    ├── 07_cost_management.html
    ├── 08_quality_management.html    ← placeholder
    ├── 09_resource_management.html   ← placeholder
    ├── 10_communications_management.html ← placeholder
    ├── 11_risk_management.html       ← placeholder
    ├── 12_procurement_management.html ← placeholder
    ├── 13_stakeholder_management.html ← placeholder
    ├── 14_standard_for_pm.html       ← placeholder
    ├── 15_appendices_glossary.html   ← placeholder
    └── 16_agile_practice_guide.html  ← placeholder
```

### Approach: Wrapper Shell + Content Injection

`index.html` is a persistent shell containing sidebar, toolbar, and a `#content` div. When the user selects a chapter, `app.js` fetches the chapter HTML, extracts the `<body>` content, injects it into `#content`, then re-applies saved scroll position and highlights. Everything runs on the same origin — no cross-origin restrictions.

### Data Flow

```
User opens index.html
  → app.js loads { token, gistId } from localStorage
  → if token exists: fetch pmbok6-progress.json from Gist
  → navigate to lastChapter (or first chapter)
  → inject chapter HTML into #content
  → restore scrollPos
  → re-render saved highlights

User scrolls
  → debounce 2s → update progress.scrollPos in memory → auto-save to Gist

User selects text
  → show highlight popup
  → user picks color / adds note
  → inject highlight span into DOM → save to Gist

User marks chapter complete
  → status = "done" → sidebar icon updates → progress bar updates → save to Gist
```

---

## 3. Data Model

Single JSON file in GitHub Gist named `pmbok6-progress.json`:

```json
{
  "lastChapter": "02_environment",
  "progress": {
    "01_instruction": {
      "status": "done",
      "scrollPos": 0
    },
    "02_environment": {
      "status": "reading",
      "scrollPos": 3420
    }
  },
  "highlights": {
    "01_instruction": [
      {
        "id": "h_abc123",
        "xpath": "/html/body/div[2]/p[5]",
        "startOffset": 12,
        "endOffset": 47,
        "color": "yellow",
        "note": "Ghi chú của tôi"
      }
    ]
  }
}
```

**Chapter status values:** `"unread"` | `"reading"` | `"done"`

**Highlight anchoring:** XPath + character offsets. On chapter load, app walks the DOM, finds the text node via XPath, wraps the range in a `<mark>` span with the saved color and note as a `data-note` attribute.

---

## 4. UI Layout

### Shell Layout

```
┌──────────────────────────────────────────────────────────────┐
│ SIDEBAR (260px, fixed left)  │ TOOLBAR (fixed top, ~48px)    │
│                              │ [Highlight ▼] [Sync ☁ Đã lưu]│
│ 📚 PMBOK® Guide 6            ├───────────────────────────────│
│ ─────────────────────        │                               │
│ Tiến độ: 3/16 chương         │  CONTENT AREA (scrollable)    │
│ ████░░░░░░░ 19%              │                               │
│                              │  Chapter HTML injected here.  │
│ ✓ Chương 1 – Giới Thiệu      │  Original chapter styles      │
│ ● Chương 2 – Môi Trường      │  preserved. Highlight spans   │
│ ○ Chương 3 – Vai Trò PM      │  overlaid on top.             │
│ ○ Chương 4 – Tích Hợp        │                               │
│ ○ Chương 5 – Phạm Vi         │  On text selection → popup:   │
│ ⚠ Chương 6 – Tiến Độ         │  [🟡][🟢][🔴][✏️ Ghi chú]   │
│   (chưa có bản dịch)         │                               │
│ ○ Chương 7 – Chi Phí         │  [✓ Đánh dấu đã đọc xong]    │
│ ...                          │  (button at bottom of chapter)│
│                              │                               │
│ ─────────────────────        │                               │
│ ⚙ Cài đặt Gist               │                               │
└──────────────────────────────┴───────────────────────────────┘
```

### Sidebar Chapter Status Icons

| Icon | Color  | Meaning                        |
|------|--------|--------------------------------|
| ✓    | Green  | Done (user marked complete)    |
| ●    | Yellow | Reading (has saved scrollPos)  |
| ○    | Gray   | Unread                         |
| ⚠    | Gray   | Not yet translated (placeholder)|

### Highlight Colors

3 colors: yellow (`#fff176`), green (`#a5d6a7`), red (`#ef9a9a`).

### Sync Indicator (toolbar right)

- `☁ Đã lưu` — green
- `⟳ Đang lưu...` — gray spinning
- `⚠ Lỗi sync` — red, clickable to retry

---

## 5. GitHub Gist Setup Flow

### First Visit (no token)

A modal is shown:

```
┌──────────────────────────────────────────────────────┐
│  ⚙ Kết nối GitHub Gist để sync tiến độ              │
│                                                      │
│  1. Vào github.com → Settings → Developer Settings  │
│     → Personal Access Tokens (classic)              │
│  2. Tạo token với quyền: gist                       │
│  3. Dán token vào đây:                              │
│                                                      │
│  [________________________________]  [Kết nối]       │
│                                                      │
│  🔒 Token chỉ lưu trong localStorage của bạn,       │
│     không gửi đi đâu ngoài api.github.com           │
│                                                      │
│  [Bỏ qua — dùng offline, không sync]                │
└──────────────────────────────────────────────────────┘
```

### Token Verification Flow

1. `GET https://api.github.com/gists` with `Authorization: Bearer <token>`
2. Search for gist with file named `pmbok6-progress.json`
3. If found: load that gist's data as initial state
4. If not found: `POST /gists` to create new gist → save `gistId` to localStorage
5. Save `{ token, gistId }` to localStorage — subsequent visits skip the modal

### Offline Mode

- All data stored in localStorage key `pmbok6_progress`
- Toolbar shows `💾 Offline` badge
- Export button: downloads `pmbok6-progress.json`
- Import button: file picker to load a JSON backup

---

## 6. Key Behaviors

- **Auto-save debounce:** 2 seconds after last scroll or highlight action
- **Chapter load:** fetch → extract `<body>` innerHTML → inject → restore scroll → re-render highlights
- **Placeholder chapters:** show a "Chương này chưa được dịch" banner instead of empty content
- **Highlight persistence:** uses XPath + character offsets; if DOM structure changes (chapter updated), app skips broken highlights silently without crashing
- **Responsive — Mobile (< 768px):**
  - Sidebar hidden by default, toggled by hamburger button (top-left)
  - Sidebar slides in as full-width overlay with dark backdrop
  - Toolbar icons collapse to icon-only (no text labels)
  - Highlight popup sticks above thumb (touch-friendly 44px tap targets)
  - "Mark complete" button always visible at bottom of content (sticky)
- **Responsive — Tablet (768px–1024px):**
  - Sidebar collapses to 60px icon rail (chapter numbers only), expands on hover/tap
  - Content area takes remaining width
- **Responsive — Desktop (> 1024px):**
  - Full 260px sidebar always visible
  - Content area max-width 900px, centered

---

## 7. Out of Scope

- Quiz / flashcard features
- Search across chapters
- User accounts / authentication beyond GitHub token
- PDF export
