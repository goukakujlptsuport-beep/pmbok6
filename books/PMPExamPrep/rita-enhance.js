/* rita-enhance.js
 * Bilingual term annotations + Font settings panel for Rita PMP chapters
 * Runs after page load so it doesn't interfere with highlight restoration.
 */
(function () {
  'use strict';

  // ─── BILINGUAL DICTIONARY ────────────────────────────────────────────────────
  // Sorted longest-first (most specific first) to prevent partial replacements.
  // Format: [Vietnamese term, English equivalent]
  var TERMS = [
    // ── Long / specific phrases ───────────────────────────────────────────────
    ['Phân tích bên liên quan', 'Stakeholder Analysis'],
    ['Sổ đăng ký bên liên quan', 'Stakeholder Register'],
    ['Kế hoạch quản lý dự án', 'Project Management Plan'],
    ['Kế hoạch quản lý thay đổi', 'Change Management Plan'],
    ['Kế hoạch quản lý phạm vi', 'Scope Management Plan'],
    ['Kế hoạch quản lý lịch trình', 'Schedule Management Plan'],
    ['Kế hoạch quản lý chi phí', 'Cost Management Plan'],
    ['Kế hoạch quản lý chất lượng', 'Quality Management Plan'],
    ['Kế hoạch quản lý nguồn lực', 'Resource Management Plan'],
    ['Kế hoạch quản lý truyền thông', 'Communications Management Plan'],
    ['Kế hoạch quản lý rủi ro', 'Risk Management Plan'],
    ['Kế hoạch quản lý mua sắm', 'Procurement Management Plan'],
    ['Kế hoạch tham gia bên liên quan', 'Stakeholder Engagement Plan'],
    ['Cấu trúc phân chia công việc', 'WBS – Work Breakdown Structure'],
    ['Ban kiểm soát thay đổi', 'Change Control Board (CCB)'],
    ['Kế hoạch ứng phó rủi ro', 'Risk Response Plan'],
    ['Chỉ số hiệu suất chi phí', 'CPI – Cost Performance Index'],
    ['Chỉ số hiệu suất lịch trình', 'SPI – Schedule Performance Index'],
    ['Phân tích nguyên nhân gốc rễ', 'Root Cause Analysis (RCA)'],
    ['Tiêu chí chấp nhận', 'Acceptance Criteria'],
    ['Quản lý xung đột', 'Conflict Management'],
    ['Kiểm soát thay đổi', 'Change Control'],
    ['Quản lý thay đổi', 'Change Management'],
    ['Yêu cầu thay đổi', 'Change Request'],
    ['Nhật ký giả định', 'Assumption Log'],
    ['Nhật ký rủi ro', 'Risk Register'],
    ['Sổ đăng ký rủi ro', 'Risk Register'],
    ['Nhật ký vấn đề', 'Issue Log'],
    ['Kế hoạch truyền thông', 'Communications Plan'],
    ['Sản phẩm bàn giao', 'Deliverable'],
    ['Mốc quan trọng', 'Milestone'],
    ['Nhóm quy trình', 'Process Group'],
    ['Đường cơ sở lịch trình', 'Schedule Baseline'],
    ['Đường cơ sở ngân sách', 'Cost Baseline'],
    ['Đường cơ sở phạm vi', 'Scope Baseline'],
    ['Cơ sở lịch trình', 'Schedule Baseline'],
    ['Cơ sở ngân sách', 'Cost Baseline'],
    ['Cơ sở phạm vi', 'Scope Baseline'],
    ['Đường cơ sở đo lường hiệu suất', 'Performance Measurement Baseline'],
    ['Điều lệ dự án', 'Project Charter'],
    ['Người quản lý dự án', 'Project Manager'],
    ['Quản lý dự án', 'Project Management'],
    ['Nhóm dự án', 'Project Team'],
    ['Nhà tài trợ dự án', 'Project Sponsor'],
    ['Nhà tài trợ', 'Sponsor'],
    ['Bộ phận PMO', 'PMO – Project Management Office'],
    ['Văn phòng quản lý dự án', 'Project Management Office (PMO)'],
    ['Nhóm Scrum', 'Scrum Team'],
    ['Chủ sở hữu sản phẩm', 'Product Owner'],
    ['Tồn đọng sản phẩm', 'Product Backlog'],
    ['Tồn đọng Sprint', 'Sprint Backlog'],
    ['Phương pháp Agile', 'Agile Methodology'],
    ['Phương pháp hỗn hợp', 'Hybrid Approach'],
    ['Phương pháp thác nước', 'Waterfall Methodology'],
    ['Đường găng', 'Critical Path'],
    ['Phương pháp đường găng', 'Critical Path Method (CPM)'],
    ['Sơ đồ Gantt', 'Gantt Chart'],
    ['Sơ đồ mạng', 'Network Diagram'],
    ['Dự phòng quản lý', 'Management Reserve'],
    ['Dự phòng dự phòng', 'Contingency Reserve'],
    ['Đảm bảo chất lượng', 'Quality Assurance (QA)'],
    ['Kiểm soát chất lượng', 'Quality Control (QC)'],
    ['Quản lý chất lượng', 'Quality Management'],
    ['Phân tích SWOT', 'SWOT Analysis'],
    ['Giá trị kiếm được', 'Earned Value (EV)'],
    ['Quản lý giá trị kiếm được', 'Earned Value Management (EVM)'],
    ['Yêu cầu đề xuất', 'RFP – Request for Proposal'],
    ['Yêu cầu báo giá', 'RFQ – Request for Quotation'],
    ['Bài học kinh nghiệm', 'Lessons Learned'],
    ['Phát triển nhóm', 'Team Development'],
    ['Văn hóa tổ chức', 'Organizational Culture'],
    ['Cơ cấu tổ chức', 'Organizational Structure'],
    ['Tổ chức ma trận', 'Matrix Organization'],
    ['Tổ chức theo dự án', 'Projectized Organization'],
    ['Tổ chức chức năng', 'Functional Organization'],
    ['Ma trận trách nhiệm', 'Responsibility Assignment Matrix (RACI)'],
    ['Quản trị dự án', 'Project Governance'],
    ['Đóng dự án', 'Project Closure'],
    ['Hoàn thành dự án', 'Project Completion'],
    ['Lưu trữ dự án', 'Project Archive'],
    ['Tổng kết dự án', 'Project Review'],
    ['Tránh rủi ro', 'Risk Avoidance'],
    ['Giảm thiểu rủi ro', 'Risk Mitigation'],
    ['Chấp nhận rủi ro', 'Risk Acceptance'],
    ['Chuyển giao rủi ro', 'Risk Transfer'],
    ['Nhận diện rủi ro', 'Risk Identification'],
    ['Phân tích rủi ro', 'Risk Analysis'],
    ['Rủi ro tích cực', 'Positive Risk (Opportunity)'],
    ['Rủi ro tiêu cực', 'Negative Risk (Threat)'],
    ['Khai thác cơ hội', 'Exploit Opportunity'],
    ['Tăng cường cơ hội', 'Enhance Opportunity'],
    ['Chia sẻ cơ hội', 'Share Opportunity'],
    ['Đánh giá rủi ro', 'Risk Assessment'],
    ['Hành động khắc phục', 'Corrective Action'],
    ['Hành động phòng ngừa', 'Preventive Action'],
    ['Sửa chữa lỗi', 'Defect Repair'],
    ['Phân rã công việc', 'Work Decomposition'],
    ['Gói công việc', 'Work Package'],
    ['Hệ thống ủy quyền công việc', 'Work Authorization System'],
    ['Quản lý kiến thức', 'Knowledge Management'],
    ['Kiến thức tường minh', 'Explicit Knowledge'],
    ['Kiến thức ẩn', 'Tacit Knowledge'],
    ['Giao tiếp thẩm thấu', 'Osmotic Communication'],
    ['Thu thập yêu cầu', 'Requirements Collection'],
    ['Tài liệu yêu cầu', 'Requirements Documentation'],
    ['Ma trận theo dõi yêu cầu', 'Requirements Traceability Matrix'],
    ['Phân tích chi phí-lợi ích', 'Cost-Benefit Analysis'],
    ['Phân tích điểm hòa vốn', 'Break-Even Analysis'],
    ['Tỷ suất hoàn vốn nội bộ', 'IRR – Internal Rate of Return'],
    ['Giá trị hiện tại ròng', 'NPV – Net Present Value'],
    ['Giai đoạn khởi tạo', 'Initiating Process Group'],
    ['Giai đoạn lập kế hoạch', 'Planning Process Group'],
    ['Giai đoạn thực hiện', 'Executing Process Group'],
    ['Giai đoạn kiểm soát', 'Monitoring & Controlling Process Group'],
    ['Giai đoạn kết thúc', 'Closing Process Group'],
    ['Vòng lặp Sprint', 'Sprint'],
    ['Cuộc họp khởi động', 'Kickoff Meeting'],
    ['Lập kế hoạch lặp', 'Iteration Planning'],
    ['Sơ đồ phân rã công việc', 'WBS – Work Breakdown Structure'],
    ['Phân tích giá trị kiếm được', 'Earned Value Analysis'],
    ['Ước tính đến hoàn thành', 'ETC – Estimate to Complete'],
    ['Ước tính lúc hoàn thành', 'EAC – Estimate at Completion'],
    ['Chi phí thực tế', 'AC – Actual Cost'],
    ['Giá trị kế hoạch', 'PV – Planned Value'],
    ['Ngân sách hoàn thành', 'BAC – Budget at Completion'],
    ['Sai lệch lịch trình', 'SV – Schedule Variance'],
    ['Sai lệch chi phí', 'CV – Cost Variance'],
    ['Danh sách hoạt động', 'Activity List'],
    ['Sắp xếp thứ tự hoạt động', 'Activity Sequencing'],
    ['Ước tính thời gian hoạt động', 'Activity Duration Estimating'],
    ['Ước tính nguồn lực hoạt động', 'Activity Resource Estimating'],
    ['Lịch trình dự án', 'Project Schedule'],
    ['Phân tích kịch bản', 'Scenario Analysis'],
    ['Phân tích Monte Carlo', 'Monte Carlo Analysis'],
    ['Cây quyết định', 'Decision Tree'],
    ['Sơ đồ nguyên nhân-kết quả', 'Cause-and-Effect Diagram (Fishbone)'],
    ['Sơ đồ xương cá', 'Fishbone Diagram'],
    ['Kiểm soát chi phí', 'Cost Control'],
    ['Kiểm soát lịch trình', 'Schedule Control'],
    ['Kiểm soát phạm vi', 'Scope Control'],
    ['Mô tả phạm vi dự án', 'Project Scope Statement'],
    ['Định nghĩa phạm vi', 'Scope Definition'],
    ['Xác nhận phạm vi', 'Scope Validation'],
    ['Mở rộng phạm vi', 'Scope Creep'],
    ['Phân tích bên liên quan', 'Stakeholder Analysis'],
    ['Tham gia bên liên quan', 'Stakeholder Engagement'],
    ['Quản lý bên liên quan', 'Stakeholder Management'],
    ['Ma trận quyền lực/quan tâm', 'Power/Interest Grid'],
    ['Hợp đồng giá cố định', 'Fixed-Price Contract (FP)'],
    ['Hợp đồng chi phí cộng', 'Cost-Plus Contract (CP)'],
    ['Hợp đồng thời gian và vật liệu', 'Time and Material Contract (T&M)'],
    ['Phát biểu công việc', 'Statement of Work (SOW)'],
    ['Tài liệu mua sắm', 'Procurement Documents'],
    ['Quản lý hợp đồng', 'Contract Management'],
    ['Đóng mua sắm', 'Procurement Closure'],
    ['Kiểm toán mua sắm', 'Procurement Audit'],
    ['Quản lý thời gian dự án', 'Project Time Management'],
    ['Quản lý chi phí dự án', 'Project Cost Management'],
    ['Quản lý rủi ro dự án', 'Project Risk Management'],
    ['Quản lý mua sắm dự án', 'Project Procurement Management'],
    ['Quản lý phạm vi dự án', 'Project Scope Management'],
    ['Quản lý tích hợp dự án', 'Project Integration Management'],
    ['Quản lý truyền thông dự án', 'Project Communications Management'],
    ['Quản lý chất lượng dự án', 'Project Quality Management'],
    ['Quản lý nguồn lực dự án', 'Project Resource Management'],
    ['Phân bổ nguồn lực', 'Resource Allocation'],
    ['San bằng nguồn lực', 'Resource Leveling'],
    ['Lịch nguồn lực', 'Resource Calendar'],
    ['Năng lực nhóm', 'Team Competency'],
    ['Xây dựng nhóm', 'Team Building'],
    ['Nhóm tự tổ chức', 'Self-Organizing Team'],
    ['Kỹ năng giao tiếp', 'Communication Skills'],
    ['Kỹ năng lãnh đạo', 'Leadership Skills'],
    ['Kỹ năng thương lượng', 'Negotiation Skills'],
    ['Phong cách lãnh đạo', 'Leadership Style'],
    ['Lãnh đạo phục vụ', 'Servant Leader'],
    ['Lãnh đạo tình huống', 'Situational Leadership'],
    ['Thúc đẩy nhóm', 'Team Motivation'],
    ['Đánh giá hiệu suất', 'Performance Review'],
    ['Báo cáo hiệu suất', 'Performance Report'],
    ['Thông tin hiệu suất công việc', 'Work Performance Information'],
    ['Dữ liệu hiệu suất công việc', 'Work Performance Data'],
    ['Báo cáo công việc dự án', 'Project Work Report'],
    ['Kiểm soát và giám sát', 'Monitoring and Controlling'],
    ['Giám sát và kiểm soát', 'Monitoring and Controlling'],
    ['Chỉ đạo và quản lý', 'Directing and Managing'],
    ['Phát triển điều lệ', 'Develop Charter'],
    ['Tạo điều lệ', 'Create Charter'],
    ['Nhóm lập kế hoạch', 'Planning Team'],
    ['Cuộc họp đánh giá', 'Review Meeting'],
    ['Phiên retrospective', 'Retrospective'],
    ['Cải tiến quy trình', 'Process Improvement'],
    ['Điều chỉnh quy trình', 'Process Tailoring'],
    ['Đề cương nội dung kỳ thi', 'Exam Content Outline (ECO)'],
    // ── Shorter phrases ────────────────────────────────────────────────────────
    ['Bên liên quan', 'Stakeholder'],
    ['Phạm vi dự án', 'Project Scope'],
    ['Phạm vi sản phẩm', 'Product Scope'],
    ['Nhật ký giả định', 'Assumption Log'],
    ['Nhóm tích hợp', 'Integration Team'],
    ['Kiến thức nền', 'Body of Knowledge'],
    ['Nhà cung cấp', 'Vendor / Supplier'],
    ['Chủ hợp đồng', 'Contractor'],
    ['Danh sách kiểm tra', 'Checklist'],
    ['Lịch trình chính', 'Master Schedule'],
    ['Tình huống giả định', 'What-If Scenario'],
    ['Phương pháp Kanban', 'Kanban Method'],
    ['Phương pháp XP', 'Extreme Programming (XP)'],
    ['Phương pháp Scrum', 'Scrum Framework'],
    ['Vòng đời dự án', 'Project Life Cycle'],
    // ── Single important words ─────────────────────────────────────────────────
    ['Phạm vi', 'Scope'],
    ['Lịch trình', 'Schedule'],
    ['Ngân sách', 'Budget'],
    ['Truyền thông', 'Communication'],
    ['Mua sắm', 'Procurement'],
    ['Chất lượng', 'Quality'],
    ['Tích hợp', 'Integration'],
    ['Nguồn lực', 'Resource'],
    ['Rủi ro', 'Risk'],
    ['Giả định', 'Assumption'],
    ['Ràng buộc', 'Constraint'],
    ['Hợp đồng', 'Contract'],
    ['Đàm phán', 'Negotiation'],
    ['Kiểm tra', 'Inspection'],
    ['Giai đoạn', 'Phase'],
    ['Cột mốc', 'Milestone'],
  ];

  // Sort by Vietnamese term length descending (longest = most specific first)
  TERMS.sort(function (a, b) { return b[0].length - a[0].length; });

  // ─── BILINGUAL ANNOTATION ─────────────────────────────────────────────────────
  function injectAnnotationCSS() {
    if (document.getElementById('rita-bilingual-css')) return;
    var s = document.createElement('style');
    s.id = 'rita-bilingual-css';
    s.textContent = [
      '.blt-en{',
      '  font-size:.78em;color:#888;font-style:italic;',
      "  font-family:'Source Sans 3',Arial,sans-serif;",
      '  white-space:normal;font-weight:normal;',
      '}',
      'html[data-theme=dark] .blt-en{color:#8ca3cc;}',
    ].join('');
    document.head.appendChild(s);
  }

  function buildAnnotationRegex() {
    function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
    var pat = TERMS.map(function (t) { return esc(t[0]); }).join('|');
    // 'i' flag: case-insensitive (handles "Điều lệ" and "điều lệ" equally)
    return new RegExp('(' + pat + ')', 'gi');
  }

  // Build a lookup map: Vietnamese → English (case-insensitive key normalised to lower)
  function buildTermMap() {
    var m = {};
    TERMS.forEach(function (t) { m[t[0].toLowerCase()] = { vi: t[0], en: t[1] }; });
    return m;
  }

  var _re = null;
  var _map = null;

  function annotateNode(textNode) {
    if (!_re) { _re = buildAnnotationRegex(); _map = buildTermMap(); }
    var text = textNode.textContent;
    _re.lastIndex = 0;
    if (!_re.test(text)) return;

    _re.lastIndex = 0;
    var frag = document.createDocumentFragment();
    var last = 0, m;

    while ((m = _re.exec(text)) !== null) {
      if (m.index > last) {
        frag.appendChild(document.createTextNode(text.slice(last, m.index)));
      }
      var viTerm = m[0];
      var entry = _map[viTerm.toLowerCase()];
      if (entry) {
        var outer = document.createElement('span');
        outer.textContent = viTerm; // preserve original capitalisation
        var enSpan = document.createElement('span');
        enSpan.className = 'blt-en';
        enSpan.textContent = ' (' + entry.en + ')';
        outer.appendChild(enSpan);
        frag.appendChild(outer);
      } else {
        frag.appendChild(document.createTextNode(viTerm));
      }
      last = m.index + viTerm.length;
    }
    if (last < text.length) {
      frag.appendChild(document.createTextNode(text.slice(last)));
    }

    if (frag.childNodes.length > 1 || (frag.firstChild && frag.firstChild.nodeType !== 3)) {
      textNode.parentNode.replaceChild(frag, textNode);
    }
  }

  // Tags whose text content we never touch
  var SKIP_TAGS = { SCRIPT: 1, STYLE: 1, MARK: 1, CODE: 1, PRE: 1, A: 1, INPUT: 1, TEXTAREA: 1 };
  // Class names that signal already-annotated content
  var SKIP_CLASSES = { 'blt-en': 1 };

  function annotateSubtree(root) {
    // Build a list of text nodes first, then modify
    var textNodes = [];

    function walk(node) {
      if (node.nodeType === 3) { // TEXT_NODE
        if (node.textContent.trim()) textNodes.push(node);
        return;
      }
      if (node.nodeType !== 1) return; // skip non-elements
      var tag = node.tagName;
      if (SKIP_TAGS[tag]) return;
      var cls = node.className || '';
      if (typeof cls === 'string') {
        var parts = cls.split(' ');
        for (var i = 0; i < parts.length; i++) {
          if (SKIP_CLASSES[parts[i]]) return;
        }
      }
      var child = node.firstChild;
      while (child) {
        var next = child.nextSibling; // save before potential DOM change
        walk(child);
        child = next;
      }
    }

    walk(root);

    // Now annotate (backwards-safe since we already collected all nodes)
    textNodes.forEach(annotateNode);
  }

  function runAnnotation() {
    var main = document.getElementById('main');
    if (!main) return;
    injectAnnotationCSS();
    annotateSubtree(main);
  }

  // ─── FONT SETTINGS ────────────────────────────────────────────────────────────
  var LS_KEY = 'rita_font_v2';

  var FONT_OPTIONS = [
    { id: 'merriweather', label: 'Merriweather',   css: "'Merriweather', Georgia, serif" },
    { id: 'sourcesans',   label: 'Source Sans 3',  css: "'Source Sans 3', Arial, sans-serif" },
    { id: 'georgia',      label: 'Georgia',         css: "Georgia, 'Times New Roman', serif" },
    { id: 'arial',        label: 'Arial',           css: "Arial, Helvetica, sans-serif" },
    { id: 'verdana',      label: 'Verdana',         css: "Verdana, Geneva, sans-serif" },
    { id: 'tahoma',       label: 'Tahoma',          css: "Tahoma, Geneva, sans-serif" },
  ];

  var SIZE_OPTIONS = [
    { id: 'xs', label: 'XS', scale: 0.82 },
    { id: 'sm', label: 'S',  scale: 0.91 },
    { id: 'md', label: 'M',  scale: 1.00 },
    { id: 'lg', label: 'L',  scale: 1.12 },
    { id: 'xl', label: 'XL', scale: 1.25 },
  ];

  function loadSettings() {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); }
    catch (e) { return {}; }
  }

  function saveSettings(s) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(s)); } catch (e) {}
  }

  function getStyleEl() {
    var el = document.getElementById('rita-font-inject');
    if (!el) {
      el = document.createElement('style');
      el.id = 'rita-font-inject';
      document.head.appendChild(el);
    }
    return el;
  }

  function applySettings(s) {
    var fontOpt = null, sizeOpt = null;
    FONT_OPTIONS.forEach(function (f) { if (f.id === s.fontId) fontOpt = f; });
    SIZE_OPTIONS.forEach(function (z) { if (z.id === s.sizeId) sizeOpt = z; });
    fontOpt = fontOpt || FONT_OPTIONS[0];
    sizeOpt = sizeOpt || SIZE_OPTIONS[2];

    var scale = sizeOpt.scale;
    var ff = fontOpt.css;
    getStyleEl().textContent =
      '#main p,#main li,#main td,#main blockquote{' +
        'font-family:' + ff + '!important;' +
        'font-size:calc(0.94rem * ' + scale + ')!important;' +
      '}' +
      '#main h3,#main h4,#main h5{' +
        'font-family:' + ff + '!important;' +
      '}' +
      '#main ul.content-list li,#main ol.content-list li{' +
        'font-family:' + ff + '!important;' +
        'font-size:calc(0.92rem * ' + scale + ')!important;' +
      '}';
  }

  // ─── FONT PANEL UI ───────────────────────────────────────────────────────────
  function buildFontPanel() {
    var sidebar = document.getElementById('sidebar');
    if (!sidebar || document.getElementById('rita-font-btn')) return;

    var s = loadSettings();
    var curFont = s.fontId || 'merriweather';
    var curSize = s.sizeId || 'md';

    // ── Toggle button ──────────────────────────────────────────────────────────
    var btn = document.createElement('button');
    btn.id = 'rita-font-btn';
    btn.title = 'Cài đặt font chữ / Font Settings';
    btn.style.cssText =
      'display:flex;align-items:center;justify-content:space-between;' +
      "padding:.5rem 1.2rem;font-family:'Source Sans 3',sans-serif;font-size:.75rem;" +
      'color:var(--gold);cursor:pointer;border-top:1px solid rgba(255,255,255,.07);' +
      'background:none;border-left:none;border-right:none;border-bottom:none;' +
      'width:100%;text-align:left;transition:background .15s;';
    btn.innerHTML =
      '<span style="display:flex;align-items:center;gap:.5rem">' +
        '<span style="font-size:1rem;line-height:1">Aa</span>' +
        '<span>Font chữ</span>' +
      '</span>' +
      '<span style="font-size:.65rem;opacity:.55">&#9660;</span>';

    // Insert before sidebar-nav (bottom nav) if present, else append
    var navEl = document.getElementById('sidebar-nav');
    if (navEl) {
      sidebar.insertBefore(btn, navEl);
    } else {
      sidebar.appendChild(btn);
    }

    // ── Panel ──────────────────────────────────────────────────────────────────
    var panel = document.createElement('div');
    panel.id = 'rita-font-panel';

    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    function panelBg() { return document.documentElement.getAttribute('data-theme') === 'dark' ? '#1a2436' : '#fff'; }
    function panelText() { return document.documentElement.getAttribute('data-theme') === 'dark' ? '#dde4f0' : '#2c2c2c'; }
    function borderCol() { return 'var(--gold)'; }

    // Position: right side of sidebar on desktop, bottom-left on mobile
    var isMobile = window.innerWidth <= 860;
    var panelLeft = isMobile ? '8px' : '268px';
    panel.style.cssText =
      'position:fixed;bottom:70px;left:' + panelLeft + ';z-index:650;' +
      'background:' + panelBg() + ';' +
      'border:2px solid var(--gold);border-radius:' + (isMobile ? '10px' : '0 10px 10px 0') + ';' +
      'padding:1.1rem 1rem 1rem;width:260px;' +
      'box-shadow:4px 4px 24px rgba(0,0,0,.25);' +
      'display:none;';

    panel.innerHTML =
      '<div style="' +
        "font-family:'Source Sans 3',sans-serif;font-size:.7rem;font-weight:700;" +
        'letter-spacing:.12em;text-transform:uppercase;color:var(--gold);' +
        'margin-bottom:.85rem;padding-bottom:.4rem;border-bottom:1px solid rgba(201,168,76,.3);' +
      '">Cài đặt font / Font Settings</div>' +

      '<div style="margin-bottom:.8rem;">' +
        '<div id="rita-font-label" style="' +
          "font-size:.65rem;font-weight:600;color:#888;font-family:'Source Sans 3',sans-serif;" +
          'margin-bottom:.4rem;text-transform:uppercase;letter-spacing:.08em;' +
        '">Kiểu chữ (Font Family)</div>' +
        '<div id="rita-font-choices" style="display:flex;flex-direction:column;gap:.28rem;"></div>' +
      '</div>' +

      '<div>' +
        '<div style="' +
          "font-size:.65rem;font-weight:600;color:#888;font-family:'Source Sans 3',sans-serif;" +
          'margin-bottom:.4rem;text-transform:uppercase;letter-spacing:.08em;' +
        '">Cỡ chữ (Font Size)</div>' +
        '<div id="rita-size-choices" style="display:flex;gap:.3rem;"></div>' +
      '</div>' +

      '<div style="margin-top:.7rem;padding-top:.5rem;border-top:1px solid rgba(201,168,76,.2);">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;gap:.5rem;">' +
          '<div style="font-size:.65rem;font-weight:600;color:#888;font-family:\'Source Sans 3\',sans-serif;text-transform:uppercase;letter-spacing:.08em;">Song ngữ (Bilingual)</div>' +
          '<label id="rita-bilingual-toggle" style="position:relative;display:inline-block;width:36px;height:20px;cursor:pointer;">' +
            '<input type="checkbox" id="rita-bilingual-chk" style="opacity:0;width:0;height:0;" ' + (loadSettings().bilingualOff ? '' : 'checked') + '>' +
            '<span style="position:absolute;inset:0;background:#ccc;border-radius:20px;transition:.3s;" id="rita-bilingual-slider"></span>' +
          '</label>' +
        '</div>' +
      '</div>' +
      '<div style="margin-top:.55rem;padding-top:.5rem;border-top:1px solid rgba(201,168,76,.2);' +
        "font-size:.62rem;color:#aaa;font-style:italic;text-align:center;font-family:'Source Sans 3',sans-serif;" +
      '">Lưu tự động trong trình duyệt</div>';

    document.body.appendChild(panel);

    // ── Font choices ───────────────────────────────────────────────────────────
    var fontDiv = panel.querySelector('#rita-font-choices');
    FONT_OPTIONS.forEach(function (f) {
      var row = document.createElement('button');
      row.dataset.fid = f.id;
      var active = f.id === curFont;
      row.style.cssText =
        'display:flex;align-items:center;gap:.55rem;padding:.35rem .6rem;' +
        'border-radius:5px;cursor:pointer;text-align:left;width:100%;' +
        'border:1px solid ' + (active ? 'var(--gold)' : 'rgba(201,168,76,.25)') + ';' +
        'background:' + (active ? 'rgba(201,168,76,.12)' : 'transparent') + ';' +
        'transition:all .15s;';
      row.innerHTML =
        '<span style="font-family:' + f.css + ';font-size:.95rem;min-width:22px;' +
          'color:' + (document.documentElement.getAttribute('data-theme') === 'dark' ? '#e8d5a3' : '#2c2c2c') + ';' +
        '">Aa</span>' +
        '<span style="font-family:\'Source Sans 3\',sans-serif;font-size:.78rem;' +
          'color:' + (document.documentElement.getAttribute('data-theme') === 'dark' ? '#dde4f0' : '#444') + ';' +
        '">' + f.label + '</span>';
      row.addEventListener('click', function () {
        var ns = loadSettings(); ns.fontId = f.id; saveSettings(ns); applySettings(ns);
        fontDiv.querySelectorAll('button').forEach(function (b) {
          var isActive = b.dataset.fid === f.id;
          b.style.border = 'border:1px solid ' + (isActive ? 'var(--gold)' : 'rgba(201,168,76,.25)');
          b.style.borderColor = isActive ? 'var(--gold)' : 'rgba(201,168,76,.25)';
          b.style.background = isActive ? 'rgba(201,168,76,.12)' : 'transparent';
        });
      });
      fontDiv.appendChild(row);
    });

    // ── Size choices ───────────────────────────────────────────────────────────
    var sizeDiv = panel.querySelector('#rita-size-choices');
    SIZE_OPTIONS.forEach(function (z) {
      var b2 = document.createElement('button');
      b2.dataset.sid = z.id;
      var active = z.id === curSize;
      b2.style.cssText =
        'flex:1;padding:.3rem .1rem;border-radius:5px;cursor:pointer;text-align:center;' +
        "font-family:'Source Sans 3',sans-serif;font-size:.78rem;font-weight:600;" +
        'border:1px solid ' + (active ? 'var(--gold)' : 'rgba(201,168,76,.25)') + ';' +
        'background:' + (active ? 'rgba(201,168,76,.12)' : 'transparent') + ';' +
        'color:' + (active ? 'var(--gold)' : '#888') + ';' +
        'transition:all .15s;';
      b2.textContent = z.label;
      b2.addEventListener('click', function () {
        var ns = loadSettings(); ns.sizeId = z.id; saveSettings(ns); applySettings(ns);
        sizeDiv.querySelectorAll('button').forEach(function (b) {
          var isActive = b.dataset.sid === z.id;
          b.style.borderColor = isActive ? 'var(--gold)' : 'rgba(201,168,76,.25)';
          b.style.background = isActive ? 'rgba(201,168,76,.12)' : 'transparent';
          b.style.color = isActive ? 'var(--gold)' : '#888';
        });
      });
      sizeDiv.appendChild(b2);
    });

    // ── Bilingual toggle ───────────────────────────────────────────────────────
    var chk = panel.querySelector('#rita-bilingual-chk');
    var slider = panel.querySelector('#rita-bilingual-slider');
    if (chk && slider) {
      // Set slider colour based on current state
      slider.style.background = chk.checked ? 'var(--gold)' : '#ccc';
      chk.addEventListener('change', function () {
        slider.style.background = chk.checked ? 'var(--gold)' : '#ccc';
        var ns = loadSettings();
        ns.bilingualOff = !chk.checked;
        saveSettings(ns);
        // Show/hide all .blt-en spans
        var spans = document.querySelectorAll('.blt-en');
        spans.forEach(function (sp) { sp.style.display = chk.checked ? '' : 'none'; });
      });
      // Apply initial state if bilingual is off
      if (loadSettings().bilingualOff) {
        document.querySelectorAll('.blt-en').forEach(function (sp) { sp.style.display = 'none'; });
      }
    }

    // ── Toggle visibility ──────────────────────────────────────────────────────
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var visible = panel.style.display !== 'none';
      panel.style.display = visible ? 'none' : 'block';
    });

    document.addEventListener('click', function (e) {
      if (panel.style.display !== 'none' && !panel.contains(e.target) && e.target !== btn) {
        panel.style.display = 'none';
      }
    });

    // Keep panel colours in sync with dark-mode toggle
    new MutationObserver(function () {
      panel.style.background = panelBg();
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }

  // ─── INIT ─────────────────────────────────────────────────────────────────────
  function init() {
    // Apply font settings immediately (before render)
    var saved = loadSettings();
    if (saved.fontId || saved.sizeId) applySettings(saved);

    // Annotation + panel after page fully loads (after highlight restore)
    function ready() {
      runAnnotation();
      buildFontPanel();
    }

    if (document.readyState === 'complete') {
      ready();
    } else {
      window.addEventListener('load', ready);
    }
  }

  init();
})();
