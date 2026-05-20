#!/usr/bin/env python3

import os
import json
from pathlib import Path
from datetime import datetime
from gtts import gTTS

CHAPTERS_TEXT_DIR = Path("chapters-text")
AUDIO_OUTPUT_DIR = Path("audio")
METADATA_OUTPUT_DIR = Path("audio-metadata")

# Create output directories
AUDIO_OUTPUT_DIR.mkdir(exist_ok=True)
METADATA_OUTPUT_DIR.mkdir(exist_ok=True)

# Get all chapter text files
text_files = sorted(CHAPTERS_TEXT_DIR.glob("*.txt"))
print(f"Found {len(text_files)} chapters to generate audio\n")

generated_count = 0
failed_count = 0
skipped_count = 0

for text_file in text_files:
    chapter_name = text_file.stem
    audio_output = AUDIO_OUTPUT_DIR / f"{chapter_name}.mp3"
    metadata_file = CHAPTERS_TEXT_DIR / f"{chapter_name}.metadata.json"

    # Skip if already generated
    if audio_output.exists():
        print(f"⊘ {chapter_name}: already exists, skipping")
        skipped_count += 1
        continue

    try:
        # Read text
        with open(text_file, 'r', encoding='utf-8') as f:
            text_content = f.read()

        # Skip empty chapters
        if not text_content.strip():
            print(f"⊘ {chapter_name}: empty content, skipping")
            skipped_count += 1
            continue

        print(f"→ {chapter_name}: generating audio... ", end='', flush=True)

        # Generate audio using gTTS (Google Text-to-Speech)
        tts = gTTS(text=text_content, lang='vi', slow=False)
        tts.save(str(audio_output))

        # Get file size
        file_size = audio_output.stat().st_size
        file_size_mb = file_size / (1024 * 1024)

        # Read metadata
        metadata_obj = {}
        if metadata_file.exists():
            with open(metadata_file, 'r', encoding='utf-8') as f:
                metadata_obj = json.load(f)

        # Create timing metadata
        word_count = metadata_obj.get('wordCount', len(text_content.split()))
        estimated_duration_sec = word_count * 0.5  # ~120 words per minute = 0.5 sec/word

        timing_data = {
            "chapter": chapter_name,
            "generated_at": datetime.now().isoformat(),
            "audio_file": f"{chapter_name}.mp3",
            "file_size_bytes": file_size,
            "file_size_mb": round(file_size_mb, 2),
            "estimated_duration_sec": estimated_duration_sec,
            "word_count": word_count,
            "text_file": f"{chapter_name}.txt"
        }

        timing_file = METADATA_OUTPUT_DIR / f"{chapter_name}.json"
        with open(timing_file, 'w', encoding='utf-8') as f:
            json.dump(timing_data, f, indent=2)

        print(f"✓ {file_size_mb:.1f}MB ({estimated_duration_sec:.0f}s)")
        generated_count += 1

    except Exception as e:
        print(f"error: {e}")
        failed_count += 1

print(f"\n{'='*50}")
print(f"Generated: {generated_count}/{len(text_files)}")
if skipped_count > 0:
    print(f"Skipped (empty): {skipped_count}")
if failed_count > 0:
    print(f"Failed: {failed_count}")
print(f"Audio directory: {AUDIO_OUTPUT_DIR}")
print(f"Metadata directory: {METADATA_OUTPUT_DIR}")
