#!/usr/bin/env python3
"""
Translate Chapter 2 (02_environment.md) to Vietnamese HTML.
Uses gemma3:4b for translation.
References Chapter 1 HTML structure.
"""

import json
import time
import urllib.request
import re
from datetime import datetime

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "gemma3:4b"
MD_FILE = "/Users/ts-trongtung.nguyen/Workspace/pmp/files/02_environment.md"
CH1_HTML = "/Users/ts-trongtung.nguyen/Workspace/pmp/chapters/01_instruction_with_images.html"
OUTPUT_FILE = "/Users/ts-trongtung.nguyen/Workspace/pmp/chapters/02_environment_vi.html"

def gemma_translate(text: str, is_heading: bool = False) -> str:
    """Translate text using gemma3:4b."""
    text = text.strip()
    if not text or len(text) < 2:
        return text
    if re.match(r'^[\d\s\.\-\(\)\/\:\,]+$', text):
        return text

    if is_heading:
        prompt = f"""Dịch tiêu đề này sang tiếng Việt. Giữ lại thuật ngữ tiếng Anh gốc trong <span class="term-en">...</span>.
Ví dụ: Quản lý Dự án (<span class="term-en">Project Management</span>)

Tiêu đề tiếng Anh: {text}
Kết quả tiếng Việt:"""
    else:
        prompt = f"""Dịch toàn bộ đoạn văn này sang tiếng Việt. Dịch 100%, không tóm tắt.
Giữ lại thuật ngữ chuyên ngành tiếng Anh gốc trong <span class="term-en">...</span>.

Đoạn tiếng Anh: {text}
Kết quả tiếng Việt:"""

    payload = json.dumps({
        "model": MODEL,
        "prompt": prompt,
        "stream": False,
        "options": {"temperature": 0.3, "num_predict": 1000},
    }).encode()

    for attempt in range(3):
        try:
            req = urllib.request.Request(
                OLLAMA_URL, data=payload,
                headers={"Content-Type": "application/json"}, method="POST"
            )
            with urllib.request.urlopen(req, timeout=60) as resp:
                result = json.loads(resp.read()).get("response", text).strip()
                return result or text
        except Exception as e:
            if attempt < 2:
                print(f"    [retry {attempt+1}]", flush=True)
                time.sleep(1)
            else:
                return text


def extract_css_from_ch1(ch1_file: str) -> str:
    """Extract <style> block from Chapter 1 HTML."""
    with open(ch1_file, 'r', encoding='utf-8') as f:
        content = f.read()

    match = re.search(r'<style>(.*?)</style>', content, re.DOTALL)
    return match.group(1) if match else ""


def generate_anchor_id(text: str, level: int) -> str:
    """Generate anchor ID from heading."""
    clean = re.sub(r'<[^>]+>', '', text).lower()
    clean = re.sub(r'[^a-z0-9\s]', '', clean)
    parts = clean.split()[:3]
    return f"s2-{'-'.join(parts)}"


def parse_markdown_blocks(md_content: str) -> list:
    """Parse markdown into blocks."""
    blocks = []
    lines = md_content.split('\n')
    i = 0

    while i < len(lines):
        line = lines[i]

        # Headings
        if line.startswith('##'):
            level = len(line) - len(line.lstrip('#'))
            text = line.lstrip('# ').strip()
            blocks.append({'type': f'h{level}', 'text': text})
            i += 1

        # List items
        elif line.startswith(('☑', '◆', '■', '* ', '- ')):
            list_type = 'check' if line.startswith('☑') else 'dash' if line.startswith(('■', '-')) else 'default'
            text = line.lstrip('☑◆■* -').strip()
            blocks.append({'type': 'li', 'list_type': list_type, 'text': text})
            i += 1

        # Empty lines
        elif not line.strip():
            i += 1

        # Paragraphs
        else:
            para = []
            while i < len(lines) and lines[i].strip() and not lines[i].startswith(('#', '☑', '◆', '■', '* ', '- ')):
                para.append(lines[i])
                i += 1

            if para:
                blocks.append({'type': 'p', 'text': ' '.join(para)})

    return blocks


def translate_blocks(blocks: list) -> list:
    """Translate all blocks."""
    translated = []
    count = 0

    for block in blocks:
        if block['type'].startswith('h'):
            level = int(block['type'][1])
            count += 1
            print(f"  [{count}] <h{level}> {block['text'][:60]}...", flush=True)
            block['text_vi'] = gemma_translate(block['text'], is_heading=True)

        elif block['type'] == 'p':
            count += 1
            print(f"  [{count}] <p> {block['text'][:60]}...", flush=True)
            block['text_vi'] = gemma_translate(block['text'], is_heading=False)

        elif block['type'] == 'li':
            count += 1
            print(f"  [{count}] <li> {block['text'][:60]}...", flush=True)
            block['text_vi'] = gemma_translate(block['text'], is_heading=False)

        translated.append(block)

    return translated


def build_html(blocks: list, css: str) -> str:
    """Build HTML from blocks."""
    content_html = []
    list_open = None

    for block in blocks:
        if block['type'].startswith('h'):
            # Close any open list
            if list_open:
                content_html.append(f'</ul>')
                list_open = None

            level = int(block['type'][1])
            anchor_id = generate_anchor_id(block['text'], level)
            text_vi = block.get('text_vi', block['text'])

            # Bilingual: Vietnamese (English)
            content_html.append(f'<h{level} id="{anchor_id}">{text_vi} <span class="term-en">({block["text"]})</span></h{level}>')

        elif block['type'] == 'p':
            if list_open:
                content_html.append(f'</ul>')
                list_open = None

            text_vi = block.get('text_vi', block['text'])
            content_html.append(f'<p>{text_vi}</p>')

        elif block['type'] == 'li':
            new_type = block.get('list_type', 'default')
            class_attr = f' class="pmbok {new_type}"' if new_type != 'default' else ' class="pmbok"'

            if list_open != new_type:
                if list_open:
                    content_html.append('</ul>')
                list_open = new_type
                content_html.append(f'<ul{class_attr}>')

            text_vi = block.get('text_vi', block['text'])
            content_html.append(f'<li>{text_vi}</li>')

    if list_open:
        content_html.append('</ul>')

    content = '\n  '.join(content_html)

    html = f"""<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Chương 2 – MÔI TRƯỜNG | PMBOK® Guide Lần 6</title>
<link href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;1,400&family=Source+Sans+3:wght@300;400;600;700&family=Source+Code+Pro:wght@400;600&display=swap" rel="stylesheet">
<style>
{css}
</style>
</head>
<body>

<aside id="sidebar">
  <div id="sidebar-header">
    <div class="book-label">PMBOK® Guide</div>
    <h2>Hướng Dẫn Quản Lý Dự Án</h2>
    <div class="edition">Lần xuất bản thứ 6 · Tiếng Việt</div>
  </div>
  <nav>
    <div class="section-group">
      <div class="group-label">Chương 2 · Environment</div>
      <a href="#s2-overview">2.1 Tổng Quan</a>
      <a href="#s2-enterprise-environmental">2.2 Yếu Tố Môi Trường</a>
      <a href="#s2-organizational-process">2.3 Tài Sản Quy Trình</a>
      <a href="#s2-organizational-systems">2.4 Hệ Thống Tổ Chức</a>
    </div>
  </nav>
</aside>

<main id="main">
  <div class="chapter-hero" data-chnum="2">
    <div class="ch-label">Chương 2</div>
    <h1>MÔI TRƯỜNG THỰC HIỆN DỰ ÁN</h1>
    <div class="ch-en">The Environment in Which Projects Operate</div>
  </div>

  {content}

</main>
</body>
</html>"""

    return html


def main():
    print(f"\n{'='*60}", flush=True)
    print(f"Translating Chapter 2 with {MODEL}", flush=True)
    print(f"Start: {datetime.now().strftime('%H:%M:%S')}", flush=True)
    print(f"{'='*60}\n", flush=True)

    t_start = time.time()

    # Extract CSS from Chapter 1
    print("Extracting CSS from Chapter 1...", flush=True)
    css = extract_css_from_ch1(CH1_HTML)

    # Read markdown
    print("Reading markdown...", flush=True)
    with open(MD_FILE, 'r', encoding='utf-8') as f:
        md_content = f.read()

    # Parse blocks
    print("Parsing blocks...", flush=True)
    blocks = parse_markdown_blocks(md_content)
    print(f"Found {len(blocks)} blocks\n", flush=True)

    # Translate
    print("Translating with gemma3:4b...", flush=True)
    blocks = translate_blocks(blocks)

    # Build HTML
    print("\nBuilding HTML...", flush=True)
    html = build_html(blocks, css)

    # Save
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(html)

    elapsed = time.time() - t_start

    print(f"\n{'='*60}", flush=True)
    print(f"✓ Saved: {OUTPUT_FILE}", flush=True)
    print(f"Size: {len(html)//1024} KB", flush=True)
    print(f"Time: {elapsed:.0f}s ({elapsed/60:.1f} min)", flush=True)
    print(f"End: {datetime.now().strftime('%H:%M:%S')}", flush=True)
    print(f"{'='*60}", flush=True)


if __name__ == "__main__":
    main()
