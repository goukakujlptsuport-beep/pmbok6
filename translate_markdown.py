#!/usr/bin/env python3
"""
Translate a Markdown document while preserving structure.

Preserved as-is:
- HTML blocks, including <div>, <img>, <table>, etc.
- fenced code blocks
- inline code
- markdown links/images

This script is intentionally model-agnostic:
- It can print translation-ready chunks with a prompt.
- You can wire the `translate_text()` function to any LLM/API you control.

Usage:
  python3 translate_markdown.py input.md output.md
  python3 translate_markdown.py input.md --emit-prompts
"""

from __future__ import annotations

import argparse
import base64
import json
import os
import re
import urllib.error
import urllib.request
from dataclasses import dataclass
from pathlib import Path
from typing import List, Tuple


HTML_BLOCK_RE = re.compile(
    r"""
    (?P<html>
        <(?P<tag>div|table|figure|img|p|span|section|article|aside|blockquote|ul|ol|li|tr|td|th|thead|tbody|tfoot|caption)[\s>]
        .*?
        </(?P=tag)>
        |
        <img\b[^>]*\/?>
    )
    """,
    re.IGNORECASE | re.DOTALL | re.VERBOSE,
)

INLINE_CODE_RE = re.compile(r"`[^`]+`")
MD_LINK_RE = re.compile(r"\[[^\]]+\]\([^)]+\)")
HTML_ENTITY_RE = re.compile(r"&[a-zA-Z0-9#]+;")


DEFAULT_GLOSSARY = {
    "stakeholder": "bên liên quan (stakeholder)",
    "scope": "phạm vi (scope)",
    "deliverable": "sản phẩm bàn giao (deliverable)",
    "baseline": "đường cơ sở (baseline)",
    "work breakdown structure": "cấu trúc phân rã công việc (Work Breakdown Structure, WBS)",
    "wbs": "WBS (Work Breakdown Structure)",
    "resource breakdown structure": "cấu trúc phân rã nguồn lực (Resource Breakdown Structure, RBS)",
    "rbs": "RBS (Resource Breakdown Structure)",
    "change control": "kiểm soát thay đổi (change control)",
    "risk register": "sổ đăng ký rủi ro (risk register)",
    "lessons learned": "bài học kinh nghiệm (lessons learned)",
    "milestone": "mốc (milestone)",
    "assumption": "giả định (assumption)",
    "constraint": "ràng buộc (constraint)",
}


@dataclass
class Block:
    kind: str
    text: str


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def write_text(path: Path, content: str) -> None:
    path.write_text(content, encoding="utf-8")


def split_blocks(markdown: str) -> List[Block]:
    """
    Split a Markdown document into alternating blocks:
    - preserved HTML / fenced code / inline-safe text
    - translatable prose

    The heuristic is intentionally conservative: when uncertain, preserve.
    """
    blocks: List[Block] = []
    i = 0
    n = len(markdown)

    while i < n:
        if markdown.startswith("```", i):
            end = markdown.find("```", i + 3)
            if end == -1:
                blocks.append(Block("code", markdown[i:]))
                break
            end += 3
            blocks.append(Block("code", markdown[i:end]))
            i = end
            continue

        html_match = HTML_BLOCK_RE.match(markdown, i)
        if html_match:
            blocks.append(Block("html", html_match.group(0)))
            i = html_match.end()
            continue

        next_special = n
        for pat in ("```", "<div", "<table", "<img", "<figure", "<section", "<article", "<blockquote"):
            pos = markdown.find(pat, i + 1)
            if pos != -1:
                next_special = min(next_special, pos)

        chunk = markdown[i:next_special]
        if chunk:
            blocks.append(Block("text", chunk))
        i = next_special

    return blocks


def apply_glossary(text: str, glossary: dict[str, str]) -> str:
    """
    Replace glossary terms case-insensitively, preferring longer terms first.
    Keeps the original term shape when safe by using the glossary's normalized form.
    """
    ordered = sorted(glossary.items(), key=lambda kv: len(kv[0]), reverse=True)

    def repl_factory(src: str, dst: str):
        pattern = re.compile(rf"\b{re.escape(src)}\b", re.IGNORECASE)

        def repl(match: re.Match[str]) -> str:
            return dst

        return pattern, repl

    out = text
    for src, dst in ordered:
        pattern, repl = repl_factory(src, dst)
        out = pattern.sub(repl, out)
    return out


def preserve_inline_markup(text: str) -> Tuple[str, List[str]]:
    """
    Temporarily protect inline code, links, and HTML entities so a translator
    doesn't mangle them.
    """
    protected: List[str] = []

    def stash(match: re.Match[str]) -> str:
        protected.append(match.group(0))
        return f"@@P{len(protected) - 1}@@"

    text = INLINE_CODE_RE.sub(stash, text)
    text = MD_LINK_RE.sub(stash, text)
    text = HTML_ENTITY_RE.sub(stash, text)
    return text, protected


def restore_inline_markup(text: str, protected: List[str]) -> str:
    for idx, original in enumerate(protected):
        text = text.replace(f"@@P{idx}@@", original)
    return text


def translate_text(text: str, glossary: dict[str, str], prompt_mode: bool = False) -> str:
    """
    Placeholder translation hook.

    Replace this function with an API call to your preferred LLM.
    For now it preserves formatting and applies glossary substitutions only.
    """
    if not text.strip():
        return text

    protected_text, protected = preserve_inline_markup(text)
    protected_text = apply_glossary(protected_text, glossary)

    if prompt_mode:
        return build_prompt(protected_text, glossary)

    # No automatic translation engine is bundled here.
    # This fallback intentionally keeps the source text with glossary expansion.
    restored = restore_inline_markup(protected_text, protected)
    return restored


def translate_text_openai(
    text: str,
    glossary: dict[str, str],
    model: str,
    api_key: str,
    base_url: str = "https://api.openai.com/v1/responses",
) -> str:
    protected_text, protected = preserve_inline_markup(text)
    prompt = build_prompt(protected_text, glossary)
    payload = {
        "model": model,
        "input": prompt,
        "temperature": 0.2,
    }
    body = json.dumps(payload).encode("utf-8")
    request = urllib.request.Request(
        base_url,
        data=body,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=600) as response:
            raw = response.read().decode("utf-8")
    except urllib.error.HTTPError as exc:
        details = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"OpenAI request failed: {exc.code} {exc.reason}\n{details}") from exc

    data = json.loads(raw)
    output_text = extract_responses_text(data)
    if not output_text.strip():
        raise RuntimeError("OpenAI response did not contain translated text.")
    return restore_inline_markup(output_text, protected)


def extract_responses_text(payload: dict) -> str:
    parts: List[str] = []
    for item in payload.get("output", []):
        for content in item.get("content", []):
            if content.get("type") in {"output_text", "text"}:
                text = content.get("text", "")
                if text:
                    parts.append(text)
    if parts:
        return "".join(parts)
    return payload.get("output_text", "") or ""


def build_prompt(text: str, glossary: dict[str, str]) -> str:
    glossary_lines = "\n".join(f"- {k} => {v}" for k, v in glossary.items())
    return f"""You are a professional Vietnamese translator for technical/PMBOK-style Markdown.

Rules:
1. Translate only the natural-language content into Vietnamese.
2. Preserve Markdown structure exactly.
3. Keep HTML blocks, <img>, <table>, <div>, code fences, inline code, links, and all attributes unchanged.
4. Do not alter image URLs, table structure, tag nesting, or numbering like Figure 1-4, Table 2-1.
5. Use bilingual terminology on first mention: Vietnamese (English).
6. For repeated terminology, keep the Vietnamese term, but do not remove standard English acronyms when useful.
7. If the text is already a caption or label, translate only the descriptive words.
8. Output only the translated Markdown, no commentary.

Glossary:
{glossary_lines}

Input:
```markdown
{text}
```
"""


def process_markdown(markdown: str, glossary: dict[str, str], emit_prompts: bool = False) -> str:
    blocks = split_blocks(markdown)
    out: List[str] = []
    for block in blocks:
        if block.kind in {"html", "code"}:
            out.append(block.text)
        else:
            out.append(translate_text(block.text, glossary, prompt_mode=emit_prompts))
    return "".join(out)


def process_markdown_openai(markdown: str, glossary: dict[str, str], model: str, api_key: str) -> str:
    blocks = split_blocks(markdown)
    out: List[str] = []
    for block in blocks:
        if block.kind in {"html", "code"}:
            out.append(block.text)
        else:
            out.append(translate_text_openai(block.text, glossary, model=model, api_key=api_key))
    return "".join(out)


def load_glossary(path: Path | None) -> dict[str, str]:
    if path is None:
        return dict(DEFAULT_GLOSSARY)
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise ValueError("Glossary file must be a JSON object.")
    return {str(k): str(v) for k, v in data.items()}


def main() -> int:
    parser = argparse.ArgumentParser(description="Translate Markdown while preserving HTML/table/image structure.")
    parser.add_argument("input", type=Path, help="Input Markdown file")
    parser.add_argument("output", nargs="?", type=Path, help="Output Markdown file")
    parser.add_argument("--glossary", type=Path, help="Optional JSON glossary file")
    parser.add_argument("--provider", choices=["openai", "prompt"], default="openai", help="Translation backend")
    parser.add_argument("--model", default=os.environ.get("OPENAI_TRANSLATION_MODEL", "gpt-4.1-mini"), help="Model name for OpenAI provider")
    parser.add_argument("--emit-prompts", action="store_true", help="Emit translation prompts instead of translating")
    args = parser.parse_args()

    glossary = load_glossary(args.glossary)
    source = read_text(args.input)
    if args.emit_prompts:
        result = process_markdown(source, glossary, emit_prompts=True)
    elif args.provider == "openai":
        api_key = os.environ.get("OPENAI_API_KEY", "").strip()
        if not api_key:
            raise RuntimeError("OPENAI_API_KEY is not set. Use --provider prompt or set the API key.")
        result = process_markdown_openai(source, glossary, model=args.model, api_key=api_key)
    else:
        result = process_markdown(source, glossary, emit_prompts=False)

    if args.output:
        write_text(args.output, result)
    else:
        print(result)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
