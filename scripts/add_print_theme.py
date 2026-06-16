#!/usr/bin/env python3
"""
Add print button + dark/light theme to all chapter HTML files.
- PMBOK: adds dark theme CSS, FOUC-prevention script, #sidebar-header position CSS
- RITA:  no HTML changes (all injected via highlight-system.js)
- Both:  @media print CSS added via highlight-system.js (no HTML changes needed)
"""
import os, re, glob

# ── CSS blocks to insert into PMBOK files ────────────────────────────────────

PMBOK_EXTRA_CSS = """
/* ── DARK THEME ──────────────────────────────────────────── */
html[data-theme=dark]{--cream:#0f1520;--text:#dde4f0;--text-light:#8899bb;--gold:#c9a84c}
html[data-theme=dark] body{background:#0f1520}
html[data-theme=dark] #main{background:#0f1520}
html[data-theme=dark] h2{color:#e8d5a3}
html[data-theme=dark] h3{color:#e8d5a3;border-bottom-color:#c9a84c}
html[data-theme=dark] h4,html[data-theme=dark] h5{color:#b8ccee}
html[data-theme=dark] p,html[data-theme=dark] li{color:#dde4f0}
html[data-theme=dark] strong{color:#e8d5a3}
html[data-theme=dark] .term-en{color:#7a8faa}
html[data-theme=dark] a{color:#b8ccee}
html[data-theme=dark] table{background:#131c2b}
html[data-theme=dark] th{background:#1a2744;color:#e8d5a3;border-color:#253048}
html[data-theme=dark] td{border-color:#253048;color:#dde4f0}
html[data-theme=dark] tr:nth-child(even) td{background:#1a2436}
html[data-theme=dark] .chapter-hero{background:linear-gradient(135deg,#0a1228 0%,#142040 100%)}
html[data-theme=dark] .figure-caption{color:#8899bb}
html[data-theme=dark] blockquote{background:#1a2436;border-left-color:#c9a84c;color:#b0c0d8}
html[data-theme=dark] code{background:#1a2436;color:#b8ccee}

/* ── SIDEBAR HEADER (for absolute-positioned buttons) ── */
#sidebar-header{position:relative}

/* ── THEME BUTTON ── */
#theme-btn{position:absolute;top:.65rem;right:.7rem;background:rgba(255,255,255,.08);border:1px solid rgba(201,168,76,.35);color:var(--gold);width:28px;height:28px;border-radius:5px;font-size:.9rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s;flex-shrink:0}
#theme-btn:hover{background:rgba(201,168,76,.2)}
"""

# FOUC-prevention script (reads theme before first paint)
PMBOK_FOUC_SCRIPT = '<script>(function(){var t=localStorage.getItem(\'pmp_theme\');if(t)document.documentElement.setAttribute(\'data-theme\',t);})()</script>\n'

SCRIPT_TAG = '<script src="../../lib/highlight-system.js"></script>'

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PMBOK_GLOB = os.path.join(ROOT, 'books', 'pmbok6', '*.html')
RITA_GLOB  = os.path.join(ROOT, 'books', 'PMPExamPrep', 'rita_chap*.html')

def patch_pmbok(path):
    with open(path, 'r', encoding='utf-8') as f:
        src = f.read()

    # Skip if already patched
    if 'data-theme=dark' in src:
        print(f'  SKIP (already patched): {os.path.basename(path)}')
        return False

    # 1. Insert dark theme + button CSS before </style>
    if '</style>' not in src:
        print(f'  SKIP (no </style>): {os.path.basename(path)}')
        return False
    src = src.replace('</style>', PMBOK_EXTRA_CSS + '</style>', 1)

    # 2. Insert FOUC script between </head> and <body>
    src = src.replace('</head>\n<body>', '</head>\n' + PMBOK_FOUC_SCRIPT + '<body>', 1)
    if PMBOK_FOUC_SCRIPT not in src:
        # Fallback: try without newline variants
        src = src.replace('</head><body>', '</head>\n' + PMBOK_FOUC_SCRIPT + '<body>', 1)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(src)
    print(f'  OK: {os.path.basename(path)}')
    return True

pmbok_files = sorted(glob.glob(PMBOK_GLOB))
rita_files  = sorted(glob.glob(RITA_GLOB))

print(f'Processing {len(pmbok_files)} PMBOK files...')
pmbok_changed = sum(patch_pmbok(p) for p in pmbok_files)

print(f'\nDone. PMBOK patched: {pmbok_changed}/{len(pmbok_files)}')
print(f'RITA files ({len(rita_files)}): no HTML changes needed (print+theme handled via highlight-system.js)')
