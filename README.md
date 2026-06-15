# PMLibrary — Thư Viện Học Tập PMP

Ứng dụng học PMP tiếng Việt — đọc sách, highlight, ghi chú, luyện thi. Chạy trên Oracle Cloud (Ubuntu ARM64).

**Production:** `http://138.2.6.44/`  
**Local:** `http://localhost:3000/`

---

## Nội dung

- [Kiến trúc](#kiến-trúc)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Chạy local](#chạy-local)
- [Deploy lên Oracle Cloud](#deploy-lên-oracle-cloud)
- [API Reference](#api-reference)
- [Tính năng](#tính-năng)

---

## Kiến trúc

```
Browser
  │
  ├── Nginx (port 80) ──► Hono Server (port 3000)
  │                              │
  │                              ├── Static files (HTML/JS/CSS)
  │                              ├── API /api/*
  │                              └── SQLite (server/data/pmp.db)
  │
  └── localStorage (highlights, settings)
       └── Sync ──► /api/highlights (server-wins merge)
```

**Stack:**
- **Backend:** Hono + TypeScript + Node.js 18, chạy qua `tsx`
- **Database:** SQLite via `better-sqlite3` + Drizzle ORM
- **Frontend:** Vanilla JS, HTML/CSS — không có build step
- **Reverse proxy:** Nginx
- **Process manager:** systemd (`pmp.service`)
- **CI/CD:** GitHub Actions (auto-deploy khi push main)

---

## Cấu trúc thư mục

```
pmp/
├── home.html                  # Trang thư viện chính
├── rita.html                  # Trang điều hướng Rita
├── rita-quiz.html             # Quiz luyện thi
├── dashboard.html             # Bảng tiến độ học
├── vocab.html                 # Học thuật ngữ PM
├── index.html                 # Redirect → home.html
├── font-settings.js           # Panel chọn font (dùng chung)
│
├── lib/
│   ├── highlight-system.js    # Highlight + sync + panel (dùng chung)
│   ├── books-config.js        # Config sách & chương
│   ├── progress.js            # Tracking tiến độ đọc
│   └── vocab-terms.js         # Dữ liệu 269 thuật ngữ PM
│
├── books/
│   ├── PMPExamPrep/           # Rita Mulcahy 11th Ed — 18 chương
│   │   ├── rita_chap01.html … rita_chap18.html
│   │   └── rita-enhance.js    # JS đặc thù cho Rita
│   └── pmbok6/                # PMBOK 6th Ed — 16 chương
│       └── 01_instruction.html … 16_agile_practice_guide.html
│
├── server/
│   ├── src/
│   │   ├── index.ts           # Entry point Hono app
│   │   ├── db/
│   │   │   ├── client.ts      # SQLite connection
│   │   │   ├── schema.ts      # Drizzle schema
│   │   │   └── migrate.ts     # Chạy migrations
│   │   ├── middleware/
│   │   │   └── cors.ts        # CORS cho dev
│   │   └── routes/
│   │       ├── highlights.ts  # GET/PUT/DELETE highlights
│   │       ├── progress.ts    # Tiến độ đọc theo chương
│   │       ├── study-log.ts   # Log thời gian học
│   │       ├── vocab.ts       # Từ vựng PM
│   │       ├── questions.ts   # Ngân hàng câu hỏi
│   │       ├── quiz-sessions.ts # Phiên luyện thi
│   │       ├── stats.ts       # Thống kê tổng hợp
│   │       └── kv.ts          # Key-value store (settings)
│   ├── data/
│   │   └── pmp.db             # SQLite database (gitignore)
│   ├── drizzle/migrations/    # SQL migrations
│   ├── package.json
│   └── tsconfig.json
│
├── .github/workflows/
│   └── deploy.yml             # Auto-deploy khi push main
│
└── docs/
    └── superpowers/
        └── specs/             # Architecture design docs
```

---

## Chạy local

**Yêu cầu:** Node.js v22 (dùng `.nvmrc`), macOS arm64

```bash
# 1. Dùng đúng Node version
cd server
nvm use   # hoặc: nvm install 22

# 2. Cài dependencies
npm install

# 3. Chạy dev server (hot reload)
npm run dev
```

Truy cập: `http://localhost:3000/`

> **Lưu ý môi trường:** Node.js trên Mac cần đúng architecture arm64.  
> Nếu gặp lỗi `better-sqlite3` module version mismatch, dùng:
> ```bash
> ~/.nvm/versions/node/v22.14.0/bin/node node_modules/.bin/tsx src/index.ts
> ```

---

## Deploy lên Oracle Cloud

**Server:** Oracle Cloud Always Free — Ubuntu 20.04 ARM64 (Ampere A1)  
**IP:** `138.2.6.44`  
**User:** `ubuntu`  
**SSH Key:** `~/Downloads/ssh-key-2025-03-29.key`

### Auto-deploy (GitHub Actions)

Mỗi khi push lên `main`, GitHub Actions tự động:
1. SSH vào server
2. `git pull` code mới
3. `npm install` nếu có dependency mới
4. Restart `pmp.service`

**Setup một lần:**
1. Lấy nội dung private key: `cat ~/Downloads/ssh-key-2025-03-29.key`
2. Vào GitHub → Settings → Secrets → Actions
3. Tạo secret `DEPLOY_SSH_KEY` với nội dung key đó

### Deploy thủ công (qua Oracle Cloud Shell)

```bash
# Vào cloud.oracle.com → Cloud Shell
ssh -i ~/ssh-key-2025-03-29.key ubuntu@138.2.6.44

# Trên server:
cd /opt/pmp && git pull
cd server && npm install
sudo systemctl restart pmp
sudo systemctl status pmp
```

### Kiểm tra server

```bash
# Health check
curl http://138.2.6.44/api/health
# → {"ok":true,"ts":...}

# Xem logs
sudo journalctl -u pmp -f

# Restart
sudo systemctl restart pmp
sudo systemctl restart nginx
```

### Cấu trúc server (Oracle VM)

```
/opt/pmp/              ← code clone từ GitHub
/etc/systemd/system/pmp.service   ← systemd service
/etc/nginx/sites-enabled/pmp      ← nginx config (proxy → :3000)
```

---

## API Reference

Base URL: `http://138.2.6.44/api` (production) hoặc `http://localhost:3000/api` (local)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/health` | Health check |
| GET | `/api/highlights?book=&chap=` | Lấy highlights theo chương |
| PUT | `/api/highlights` | Tạo/cập nhật 1 highlight |
| DELETE | `/api/highlights/:id` | Xóa highlight |
| GET | `/api/progress?book=` | Tiến độ đọc |
| PUT | `/api/progress` | Cập nhật tiến độ |
| GET | `/api/stats` | Thống kê tổng hợp |
| GET | `/api/kv/:key` | Lấy setting |
| PUT | `/api/kv/:key` | Lưu setting |

---

## Tính năng

### Sách
- **PMBOK 6th Edition** — 16 chương, tiếng Việt
- **Rita Mulcahy PMP Exam Prep 11th Ed** — 18 chương, song ngữ Việt-Anh

### Highlight & Ghi chú
- 3 màu: Vàng, Xanh, Đỏ
- Ghi chú inline trên từng highlight
- Sync tự động giữa các browser/tab (server-wins merge)
- Panel "Ghi Chú & Highlight" với **filter theo màu**
- Scroll-to-highlight khi click trong panel

### Luyện thi
- **Rita Quiz** — 20 câu/chương, 17 chương
- **PMP Exam Simulator** — 3 domain ECO, ưu tiên câu yếu
- **Học thuật ngữ** — 269 thuật ngữ PM, Flashcard + Quiz + Duyệt

### UX
- Dark/Light mode
- Chọn font (Merriweather, Source Sans, Georgia, Arial, Verdana, Tahoma)
- Song ngữ toggle (Việt/Anh)
- Lưu vị trí đọc tự động
- Responsive — dùng được trên điện thoại
