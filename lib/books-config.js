/* lib/books-config.js — Single source of truth for all books & chapters.
 * Exposes window.PMLibConfig.
 * To add a new book: add one entry to BOOKS + one array to CHAPTERS.
 */
(function () {
  'use strict';

  var BOOKS = [
    {
      id:       'pmbok6',
      title:    'PMBOK® Guide',
      edition:  'Lần xuất bản thứ 6',
      lang:     '🇻🇳 Tiếng Việt',
      desc:     'Hướng dẫn kiến thức quản lý dự án chuẩn quốc tế của PMI — 16 chương đã dịch đầy đủ.',
      status:   'available',
      url:      'reader.html?book=pmbok6&chap=01_instruction',
      dashLink: 'reader.html?book=pmbok6&chap=01_instruction',
      isbn:     '9781628251845',
      gradient: 'linear-gradient(160deg,#0f1d3a 0%,#1a3060 100%)',
      icon:     '📘',
      lsKey:    'pmbok6_progress',
      hlKeyPrefix: 'pmbok6_hl_',
    },
    {
      id:       'rita',
      title:    'PMP® Exam Prep',
      edition:  'Rita Mulcahy · 11th Ed. 2023',
      lang:     '🇻🇳 Tiếng Việt',
      desc:     'Bộ giáo trình luyện thi PMP nổi tiếng nhất thế giới của Rita Mulcahy — 18 chương dịch đầy đủ sang tiếng Việt.',
      status:   'available',
      url:      'rita.html',
      dashLink: 'rita.html?list',
      isbn:     '9781932735680',
      gradient: 'linear-gradient(160deg,#4a1505 0%,#c0390a 100%)',
      icon:     '📕',
      lsKey:    'rita_reading',
      hlKeyPrefix: 'rita_hl_', // per-chapter highlights: hlKeyPrefix + chapter.hlSuffix
    },
    {
      id:       'pmbok7',
      title:    'PMBOK® Guide',
      edition:  '7th Edition',
      lang:     '🌐 Đang chuẩn bị',
      desc:     'Phiên bản mới nhất — tiếp cận dựa trên nguyên tắc (principle-based), không theo quy trình.',
      status:   'coming-soon',
      url:      null,
      dashLink: null,
      isbn:     '9781628256659',
      gradient: 'linear-gradient(160deg,#0c2340 0%,#1565c0 100%)',
      icon:     '📗',
      lsKey:    null,
      hlKeyPrefix: null,
    },
    {
      id:       'agile',
      title:    'Agile Practice Guide',
      edition:  'PMI & Agile Alliance · 2017',
      lang:     '🌐 Đang chuẩn bị',
      desc:     'Hướng dẫn thực hành Agile chính thức của PMI — Agile, Scrum, Kanban và hybrid lifecycle.',
      status:   'coming-soon',
      url:      null,
      dashLink: null,
      isbn:     '9781628253993',
      gradient: 'linear-gradient(160deg,#0a2e14 0%,#1a7a2e 100%)',
      icon:     '📙',
      lsKey:    null,
      hlKeyPrefix: null,
    },
  ];

  var CHAPTERS = {
    pmbok6: [
      { id: '01_instruction',               num: 1,  title: 'Giới Thiệu',                         hlSuffix: '01_instruction' },
      { id: '02_environment',               num: 2,  title: 'Môi Trường Dự Án',                   hlSuffix: '02_environment' },
      { id: '03_pm_role',                   num: 3,  title: 'Vai Trò Của Người Quản Lý Dự Án',    hlSuffix: '03_pm_role' },
      { id: '04_integration_management',    num: 4,  title: 'Quản Lý Tích Hợp Dự Án',            hlSuffix: '04_integration_management' },
      { id: '05_scope_management',          num: 5,  title: 'Quản Lý Phạm Vi Dự Án',             hlSuffix: '05_scope_management' },
      { id: '06_schedule_management',       num: 6,  title: 'Quản Lý Tiến Độ Dự Án',             hlSuffix: '06_schedule_management' },
      { id: '07_cost_management',           num: 7,  title: 'Quản Lý Chi Phí Dự Án',             hlSuffix: '07_cost_management' },
      { id: '08_quality_management',        num: 8,  title: 'Quản Lý Chất Lượng Dự Án',          hlSuffix: '08_quality_management' },
      { id: '09_resource_management',       num: 9,  title: 'Quản Lý Nguồn Lực Dự Án',           hlSuffix: '09_resource_management' },
      { id: '10_communications_management', num: 10, title: 'Quản Lý Truyền Thông Dự Án',         hlSuffix: '10_communications_management' },
      { id: '11_risk_management',           num: 11, title: 'Quản Lý Rủi Ro Dự Án',              hlSuffix: '11_risk_management' },
      { id: '12_procurement_management',    num: 12, title: 'Quản Lý Mua Sắm Dự Án',             hlSuffix: '12_procurement_management' },
      { id: '13_stakeholder_management',    num: 13, title: 'Quản Lý Các Bên Liên Quan',         hlSuffix: '13_stakeholder_management' },
      { id: '14_standard_for_pm',           num: 14, title: 'Tiêu Chuẩn Quản Lý Dự Án',          hlSuffix: '14_standard_for_pm' },
      { id: '15_appendices_glossary',       num: 15, title: 'Phụ Lục & Từ Điển Thuật Ngữ',       hlSuffix: '15_appendices_glossary' },
      { id: '16_agile_practice_guide',      num: 16, title: 'Hướng Dẫn Thực Hành Agile',          hlSuffix: '16_agile_practice_guide' },
    ],
    rita: [
      { id: 'rita_chap01', num: 1,  title: 'Mẹo Ôn Thi PMP®',         titleEn: 'Tricks of the Trade for Studying',       hlSuffix: '01', quizId: null },
      { id: 'rita_chap02', num: 2,  title: 'Tài Liệu Tham Khảo',       titleEn: 'PMP Exam References in Context',         hlSuffix: '02', quizId: 'rita_02' },
      { id: 'rita_chap03', num: 3,  title: 'Nền Tảng Quản Lý Dự Án',   titleEn: 'Project Management Framework',           hlSuffix: '03', quizId: 'rita_03' },
      { id: 'rita_chap04', num: 4,  title: 'Tích Hợp',                  titleEn: 'Integration',                            hlSuffix: '04', quizId: 'rita_04' },
      { id: 'rita_chap05', num: 5,  title: 'Kỹ Năng Lãnh Đạo',         titleEn: 'Leadership',                             hlSuffix: '05', quizId: 'rita_05' },
      { id: 'rita_chap06', num: 6,  title: 'Xây Dựng Nhóm',            titleEn: 'Teams',                                  hlSuffix: '06', quizId: 'rita_06' },
      { id: 'rita_chap07', num: 7,  title: 'Phạm Vi Dự Án',            titleEn: 'Scope',                                  hlSuffix: '07', quizId: 'rita_07' },
      { id: 'rita_chap08', num: 8,  title: 'Tiến Độ & Ngân Sách',      titleEn: 'Schedule and Cost',                      hlSuffix: '08', quizId: 'rita_08' },
      { id: 'rita_chap10', num: 10, title: 'Chất Lượng Sản Phẩm',      titleEn: 'Quality',                                hlSuffix: '10', quizId: 'rita_10' },
      { id: 'rita_chap11', num: 11, title: 'Truyền Thông',              titleEn: 'Communications and Stakeholders',        hlSuffix: '11', quizId: 'rita_11' },
      { id: 'rita_chap12', num: 12, title: 'Rủi Ro & Vấn Đề',          titleEn: 'Risk and Issues',                        hlSuffix: '12', quizId: 'rita_12' },
      { id: 'rita_chap13', num: 13, title: 'Mua Sắm',                   titleEn: 'Procurement',                            hlSuffix: '13', quizId: 'rita_13' },
      { id: 'rita_chap14', num: 14, title: 'Các Bên Liên Quan',         titleEn: 'Stakeholder Management',                 hlSuffix: '14', quizId: 'rita_14' },
      { id: 'rita_chap15', num: 15, title: 'Tuân Thủ & Giá Trị',       titleEn: 'Compliance and Values',                  hlSuffix: '15', quizId: 'rita_15' },
      { id: 'rita_chap16', num: 16, title: 'Mẹo Vượt Qua Kỳ Thi',      titleEn: 'Passing the PMP Exam',                   hlSuffix: '16', quizId: 'rita_16' },
      { id: 'rita_chap17', num: 17, title: 'Các Phương Pháp Agile',     titleEn: 'Agile and Hybrid Approaches',            hlSuffix: '17', quizId: 'rita_17' },
      { id: 'rita_chap18', num: 18, title: 'Hướng Dẫn PMBOK',           titleEn: 'PMBOK Guide and the PM Standard',        hlSuffix: '18', quizId: 'rita_18' },
    ],
  };

  // ── LS key registry ──────────────────────────────────────────────────────────
  var KEYS = {
    font:        'pmlib_font_v1',
    vocab:       'pmlib_vocab_v1',
    pmbok6:      'pmbok6_progress',
    ritaReading: 'rita_reading',
    ritaQuiz:    'rita_quiz_scores',
    ritaHL: function (hlSuffix) { return 'rita_hl_' + hlSuffix; },
  };

  // ── Public API ───────────────────────────────────────────────────────────────
  window.PMLibConfig = {
    books:    BOOKS,
    chapters: CHAPTERS,
    keys:     KEYS,

    getBook: function (id) {
      for (var i = 0; i < BOOKS.length; i++) {
        if (BOOKS[i].id === id) return BOOKS[i];
      }
      return null;
    },

    getChapters: function (bookId) {
      return CHAPTERS[bookId] || [];
    },
  };
})();
