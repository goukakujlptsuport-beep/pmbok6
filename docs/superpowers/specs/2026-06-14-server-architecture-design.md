# PMP Study App — Server Architecture Design

**Ngày:** 2026-06-14  
**Mục tiêu:** Chuyển từ static GitHub Pages sang TypeScript server chạy local → Oracle Cloud  
**Người dùng:** 1 người (solo)  
**Lý do chính:** Thay thế GitHub API sync bằng database thực sự

---

## 1. Tech Stack

| Layer | Công nghệ | Lý do |
|-------|-----------|-------|
| Runtime | Node.js 20 | Stable LTS, tương thích Oracle Cloud |
| Language | TypeScript | Type-safe, refactor an toàn, IDE support tốt |
| Framework | Hono | Nhẹ nhất, TypeScript-first, dễ port lên edge sau |
| ORM | Drizzle ORM | Type-safe, nhẹ, migration tốt, works với SQLite |
| Database | SQLite (better-sqlite3) | Single file, zero config, đủ cho solo user |
| Dev runner | tsx watch | Chạy TypeScript trực tiếp, không cần compile |
| Process manager | pm2 | Quản lý process trên Oracle Cloud |
| Reverse proxy | nginx | HTTPS, static cache, port 80/443 |

---

## 2. Cấu trúc Project

```
pmp/
├── server/                          ← MỚI: TypeScript backend
│   ├── src/
│   │   ├── index.ts                 ← Hono app entry point + static serve
│   │   ├── db/
│   │   │   ├── schema.ts            ← Drizzle schema (9 bảng)
│   │   │   ├── client.ts            ← SQLite connection singleton
│   │   │   ├── migrate.ts           ← Run migrations
│   │   │   └── seed.ts              ← Import vocab-terms.js + questions vào DB
│   │   ├── routes/
│   │   │   ├── highlights.ts        ← /api/highlights
│   │   │   ├── progress.ts          ← /api/progress
│   │   │   ├── study-log.ts         ← /api/study-log
│   │   │   ├── questions.ts         ← /api/questions
│   │   │   ├── quiz-sessions.ts     ← /api/quiz-sessions
│   │   │   ├── vocab.ts             ← /api/vocab
│   │   │   ├── stats.ts             ← /api/stats
│   │   │   └── ai.ts                ← /api/ai (Phase 2)
│   │   └── middleware/
│   │       └── cors.ts              ← CORS cho dev (localhost:3000)
│   ├── data/
│   │   └── pmp.db                   ← SQLite file (gitignore)
│   ├── drizzle/
│   │   └── migrations/              ← Auto-generated SQL migrations
│   ├── .env                         ← PORT, DB_PATH, ANTHROPIC_API_KEY
│   ├── package.json
│   └── tsconfig.json
│
├── books/                           ← KHÔNG ĐỔI
├── home.html                        ← KHÔNG ĐỔI
├── lib/                             ← KHÔNG ĐỔI
└── ...                              ← Tất cả HTML/CSS/JS hiện tại giữ nguyên
```

**Nguyên tắc:** Server serve static files từ thư mục `pmp/` root.  
`http://localhost:3000/books/PMPExamPrep/rita_chap01.html` hoạt động như cũ.  
Không cần đổi bất kỳ link nào trong HTML hiện tại.

---

## 3. Database Schema (9 bảng)

### 3.1 Highlights
```typescript
highlights {
  id           TEXT  PRIMARY KEY     // XPath-based ID (giữ nguyên format cũ)
  book         TEXT  NOT NULL        // 'rita' | 'pmbok'
  chap         TEXT  NOT NULL        // '01', '02', ...
  color        TEXT  NOT NULL        // 'yellow' | 'green' | 'red'
  note         TEXT                  // nullable
  text         TEXT                  // nội dung được highlight
  sxp          TEXT  NOT NULL        // start xpath
  so           INT   NOT NULL        // start offset
  exp          TEXT  NOT NULL        // end xpath
  eo           INT   NOT NULL        // end offset
  created_at   INT   NOT NULL
  updated_at   INT   NOT NULL
}
```

### 3.2 KV Store (settings, misc)
```typescript
kv_store {
  key          TEXT  PRIMARY KEY     // e.g. 'rita_theme', 'font_size'
  value        TEXT  NOT NULL        // JSON string
  updated_at   INT   NOT NULL
}
```
Dùng cho: theme, font settings, bất kỳ setting nào không cần query phức tạp.

### 3.3 Reading Progress
```typescript
reading_progress {
  book         TEXT  NOT NULL        // 'rita' | 'pmbok'
  chap         TEXT  NOT NULL        // '01', '02', ...
  status       TEXT  NOT NULL        // 'not_started' | 'in_progress' | 'completed'
  scroll_pct   REAL  DEFAULT 0       // 0–100
  time_spent   INT   DEFAULT 0       // giây đã đọc
  last_read    INT                   // unix timestamp

  PRIMARY KEY (book, chap)
}
```

### 3.4 Study Log
```typescript
study_log {
  id           TEXT  PRIMARY KEY
  type         TEXT  NOT NULL        // 'reading' | 'quiz' | 'vocab' | 'exam'
  book         TEXT                  // 'rita' | 'pmbok' | null
  chap         TEXT                  // chapter ref | null
  duration_s   INT   NOT NULL        // thời gian (giây)
  date         TEXT  NOT NULL        // 'YYYY-MM-DD' — group theo ngày
  created_at   INT   NOT NULL
}
```

### 3.5 Questions
```typescript
questions {
  id           TEXT  PRIMARY KEY     // 'rita-ch01-q01', 'exam-q001'
  source       TEXT  NOT NULL        // 'rita' | 'pmbok' | 'custom'
  chap         TEXT                  // chapter reference
  type         TEXT  NOT NULL        // 'mc' | 'essay'
  content      TEXT  NOT NULL        // JSON: {
                                     //   question: string,
                                     //   options?: string[],   // mc only
                                     //   answer: string | number,
                                     //   explanation_vi: string,
                                     //   explanation_en: string
                                     // }
  difficulty   INT   DEFAULT 3       // 1–5 (static, import time)
  tags         TEXT                  // JSON array: ['agile', 'scope', ...]
  created_at   INT   NOT NULL
}
```

### 3.6 Quiz Sessions
```typescript
quiz_sessions {
  id           TEXT  PRIMARY KEY
  mode         TEXT  NOT NULL        // 'practice' | 'exam' | 'review'
  source       TEXT                  // 'rita' | 'pmbok' | 'mixed'
  chap         TEXT                  // null = tất cả chương
  total        INT   NOT NULL
  correct      INT   NOT NULL
  duration_s   INT                   // thời gian làm bài (giây)
  started_at   INT   NOT NULL
  finished_at  INT                   // null nếu bỏ dở
}
```

### 3.7 Question Stats
```typescript
question_stats {
  question_id  TEXT  NOT NULL
  session_id   TEXT  NOT NULL
  answered_at  INT   NOT NULL
  correct      INT   NOT NULL        // 0 | 1
  time_ms      INT                   // thời gian suy nghĩ (ms)

  PRIMARY KEY (question_id, session_id)
}
```
Query "câu yếu": `GROUP BY question_id → AVG(correct) ASC`

### 3.8 SRS Cards (Spaced Repetition)
```typescript
srs_cards {
  item_id      TEXT  PRIMARY KEY     // question_id hoặc vocab term id
  item_type    TEXT  NOT NULL        // 'question' | 'vocab'
  ease         REAL  DEFAULT 2.5     // SM-2 ease factor
  interval     INT   DEFAULT 1       // ngày đến lần review tiếp
  repetitions  INT   DEFAULT 0       // số lần đã review
  next_review  INT   NOT NULL        // unix timestamp
  last_score   INT                   // 0–5 (SM-2 quality)
  updated_at   INT   NOT NULL
}
```

### 3.9 Vocab Terms
```typescript
vocab_terms {
  id           TEXT  PRIMARY KEY     // 'wbs', 'critical-path', ...
  en           TEXT  NOT NULL        // English term
  vi           TEXT  NOT NULL        // Thuật ngữ tiếng Việt
  desc_vi      TEXT                  // Mô tả tiếng Việt
  desc_en      TEXT                  // Description in English
  example_vi   TEXT                  // Ví dụ tiếng Việt
  example_en   TEXT                  // Example in English
  category     TEXT                  // 'schedule' | 'scope' | 'risk' | 'quality' | ...
  difficulty   INT   DEFAULT 3       // 1–5
}
```
**Quan hệ:** `vocab_terms.id` → `srs_cards.item_id` khi `item_type = 'vocab'`

---

## 4. API Routes

```
── Highlights ──────────────────────────────────────────────────
GET    /api/highlights?book=rita&chap=01    load highlights 1 chương
PUT    /api/highlights/:id                  upsert highlight
DELETE /api/highlights/:id                  xóa highlight

── Reading Progress ────────────────────────────────────────────
GET    /api/progress/:book                  tất cả chapters của 1 cuốn
PUT    /api/progress/:book/:chap            update scroll%, status, +time_spent

── Study Log ───────────────────────────────────────────────────
POST   /api/study-log                       ghi 1 activity (reading/quiz/vocab)

── Questions ───────────────────────────────────────────────────
GET    /api/questions?source=rita&chap=01   câu hỏi theo nguồn/chương
GET    /api/questions/weak?limit=20         câu yếu nhất (accuracy thấp nhất)
GET    /api/questions/due?limit=20          câu đến hạn SRS review

── Quiz Sessions ───────────────────────────────────────────────
POST   /api/quiz-sessions                   tạo session mới
PATCH  /api/quiz-sessions/:id               update (thêm answers, finish)
GET    /api/quiz-sessions?limit=10          lịch sử gần nhất

── Question Stats ──────────────────────────────────────────────
POST   /api/question-stats                  ghi 1 câu trả lời

── Vocab ───────────────────────────────────────────────────────
GET    /api/vocab?category=scope&limit=50   danh sách thuật ngữ
GET    /api/vocab/due?limit=20              thuật ngữ đến hạn SRS review
POST   /api/vocab/srs/:id                   update SRS state sau khi review

── Dashboard ───────────────────────────────────────────────────
GET    /api/stats                           tổng hợp cho dashboard:
                                            - streak hiện tại (ngày)
                                            - % đọc Rita / PMBOK
                                            - quiz accuracy 7 ngày gần nhất
                                            - vocab progress
                                            - study time hôm nay

── AI — Phase 2 ────────────────────────────────────────────────
POST   /api/ai/explain                      giải thích khái niệm (SSE streaming)
POST   /api/ai/quiz                         tạo câu hỏi từ nội dung chương

── System ──────────────────────────────────────────────────────
GET    /api/health                          { ok: true, db: 'connected' }
GET    /*                                   serve static files từ pmp/ root
```

---

## 5. Frontend Migration (tối thiểu)

**Phase 1:** Chỉ thay đổi sync logic trong 17 Rita chapters.

**Trước (GitHub API):**
```javascript
// Mỗi chapter đang gọi:
fetch('https://api.github.com/repos/goukakujlptsuport-beep/pmbok6/contents/data/rita_highlights.json', {
  method: 'PUT',
  headers: { Authorization: 'token ghp_...' },
  body: JSON.stringify({ content: btoa(JSON.stringify(data)) })
})
```

**Sau (local server):**
```javascript
// Thay bằng:
fetch('/api/highlights?book=rita&chap=' + CHAP_NUM)   // GET
fetch('/api/highlights/' + id, { method: 'PUT', body: JSON.stringify(hl) })   // upsert
fetch('/api/highlights/' + id, { method: 'DELETE' })   // xóa
```

**Cách thực hiện:** Python script tương tự `inject_sync.py` đã làm — sửa 17 files cùng lúc.  
Không cần đụng vào PMBOK chapters hay bất kỳ HTML khác.

---

## 6. Local Dev Setup

```bash
# 1. Khởi tạo (1 lần)
cd pmp/server
npm install
cp .env.example .env          # điền PORT=3000, DB_PATH=./data/pmp.db
npm run db:migrate             # tạo pmp.db + schema
npm run db:seed                # import vocab + questions từ JS files hiện tại

# 2. Chạy hàng ngày
npm run dev
# → http://localhost:3000           (app đầy đủ)
# → http://localhost:3000/api/health (kiểm tra server)

# 3. Xem data (optional)
npm run db:studio
# → Drizzle Studio tại http://local.drizzle.studio
```

**package.json scripts:**
```json
{
  "scripts": {
    "dev":        "tsx watch src/index.ts",
    "build":      "tsc --outDir dist",
    "start":      "node dist/index.js",
    "db:migrate": "drizzle-kit migrate",
    "db:seed":    "tsx src/db/seed.ts",
    "db:studio":  "drizzle-kit studio"
  }
}
```

**.env:**
```
PORT=3000
DB_PATH=./data/pmp.db
ANTHROPIC_API_KEY=           # để trống cho Phase 1
```

---

## 7. Triển khai Oracle Cloud (sau)

Khi bạn cung cấp thông tin server, tôi sẽ setup:

```
1. SSH vào server
2. Cài Node.js 20 + pm2 + nginx
3. Clone repo / copy files
4. npm run build
5. Cấu hình pm2: pm2 start dist/index.js --name pmp
6. Cấu hình nginx: reverse proxy port 3000 → 80/443
7. (Optional) SSL với Let's Encrypt
```

---

## 8. Phases Triển Khai

### Phase 1 — Server + Sync (~2 ngày)
- [ ] Init `server/` với Hono + Drizzle + SQLite
- [ ] Tạo 9 bảng + migrations
- [ ] Seed script: import vocab-terms.js + questions vào DB
- [ ] Route highlights (GET/PUT/DELETE)
- [ ] Route progress (GET/PUT)
- [ ] Static file serving (serve pmp/ root)
- [ ] Python script: thay GitHub API → `/api/highlights` trong 17 Rita chapters
- [ ] Test: highlight trên Rita chapter → lưu vào SQLite → reload lại còn không

### Phase 2 — AI Explain (~1 ngày)
- [ ] Route `POST /api/ai/explain` — nhận `{text, context}`, stream response từ Claude API
- [ ] Frontend: thêm button "Hỏi AI" khi bôi đen text trong reader
- [ ] SSE streaming response hiển thị trong sidebar

### Phase 3 — Dashboard & Analytics (ongoing)
- [ ] Route `GET /api/stats` — aggregate data từ study_log, quiz_sessions, reading_progress
- [ ] Cập nhật dashboard.html để gọi `/api/stats` thay vì đọc localStorage
- [ ] Route study-log: tự động ghi thời gian đọc (ping mỗi 30s khi tab active)

### Phase 4 — Migrate Frontend (ongoing)
- [ ] PMBOK chapters: thay highlight sync → `/api/highlights?book=pmbok`
- [ ] Vocab: gọi `/api/vocab` thay vì load vocab-terms.js
- [ ] Quiz/Exam: gọi `/api/questions`, ghi `/api/quiz-sessions` + `/api/question-stats`
- [ ] Progress: gọi `/api/progress` thay vì localStorage

---

## 9. Các Quyết Định Thiết Kế Quan Trọng

| Quyết định | Lý do |
|-----------|-------|
| SQLite thay vì PostgreSQL | Solo user, single file, zero config, đủ mạnh |
| Hono thay vì Express | TypeScript-first, nhẹ hơn, dễ port sau |
| Server serve static files | Không cần 2 server (API + static), URL không đổi |
| Giữ localStorage làm cache | Offline support, tốc độ UI nhanh hơn |
| tsx watch cho dev | Không cần compile step, hot reload nhanh |
| Relative API paths (/api/*) | Code frontend không đổi khi deploy từ local → cloud |
| Drizzle ORM | Type-safe, migration tốt, SQL gần gũi, không magic |

---

## 10. Không Làm (Scope Boundary)

- Không có authentication (solo user)
- Không có WebSocket / realtime (không cần)
- Không migrate sang React/Vue (giữ HTML chapters)
- Không Docker (pm2 đủ cho Oracle Cloud free tier)
- Không test suite (Phase 1 — thêm sau nếu cần)
