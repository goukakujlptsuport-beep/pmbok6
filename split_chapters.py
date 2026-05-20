#!/usr/bin/env python3
import re
import os

input_file = "/Users/ts-trongtung.nguyen/Downloads/Document .md"
output_dir = "/Users/ts-trongtung.nguyen/Downloads/Chapters"

os.makedirs(output_dir, exist_ok=True)

with open(input_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Split by main chapter headings (^# but not ##)
chapters = re.split(r'^(# )', content, flags=re.MULTILINE)

# Reconstruct chapters (split creates alternating markers and content)
parsed_chapters = []
for i in range(1, len(chapters), 2):
    if i + 1 < len(chapters):
        chapter_text = chapters[i] + chapters[i + 1]
        parsed_chapters.append(chapter_text)

# Extract titles and create files
for idx, chapter_text in enumerate(parsed_chapters, 1):
    # Get chapter title from first line
    first_line = chapter_text.split('\n')[0]
    title = first_line.replace('# ', '').strip()

    # Sanitize title for filename
    safe_title = re.sub(r'[^\w\s-]', '', title)
    safe_title = re.sub(r'\s+', '_', safe_title)[:50]

    filename = f"{idx:02d}_{safe_title}.md"
    filepath = os.path.join(output_dir, filename)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(chapter_text)

    print(f"✓ Created: {filename}")
    print(f"  Title: {title}")
    print(f"  Lines: {len(chapter_text.splitlines())}")
    print()

print(f"\n✓ Tất cả {len(parsed_chapters)} chương đã được chia thành các file riêng!")
print(f"Output directory: {output_dir}")
