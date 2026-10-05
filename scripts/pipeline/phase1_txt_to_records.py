#!/usr/bin/env python3
"""
Phase 1: Raw Data (TXT) -> Structured Book Records
Sử Chill - Kaggle 10000 Vietnamese Books Pipeline

Converts raw extracted TXT files into structured JSONL records
without modifying any raw data or altering production databases.
"""

import os
import sys
import json
import html
import unicodedata
import argparse
from collections import Counter, defaultdict

# Ensure UTF-8 output on all platforms
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

RAW_EXTRACTED_DIR = 'data/raw/extracted/output'
PROCESSED_DIR = 'data/processed'

def clean_text(text: str) -> str:
    """Unescape HTML entities, normalize to NFC Unicode, strip whitespace."""
    if not text:
        return ''
    # Unescape potentially nested HTML entities
    unescaped = html.unescape(html.unescape(text.strip()))
    return unicodedata.normalize('NFC', unescaped).strip()

def normalize_compare(text: str) -> str:
    """Normalize text for comparison, removing spaces and common punctuation."""
    t = clean_text(text).lower()
    for ch in [':', '_', '-', '.', ',', '!', '?', '"', "'", '“', '”', ' ', '/', '&', ';', '(', ')']:
        t = t.replace(ch, '')
    return t

def parse_book_file(filename: str, file_path: str):
    """
    Extract author and title from file content with filename fallback.
    Priority:
      Line 1 = author
      Line 2 = title
    """
    # 1. Parse baseline from filename
    base = filename[:-4] if filename.endswith('.txt') else filename
    fn_parts = base.split(' - ')
    if len(fn_parts) >= 2:
        fn_title = clean_text(' - '.join(fn_parts[:-1]))
        fn_author = clean_text(fn_parts[-1])
    else:
        fn_title = clean_text(base)
        fn_author = None

    # 2. Read first non-empty lines from file content
    content_lines = []
    encoding_used = 'utf-8'
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            for line in f:
                cl = clean_text(line)
                if cl:
                    content_lines.append(cl)
                if len(content_lines) >= 5:
                    break
    except UnicodeDecodeError:
        try:
            with open(file_path, 'r', encoding='utf-16') as f:
                for line in f:
                    cl = clean_text(line)
                    if cl:
                        content_lines.append(cl)
                    if len(content_lines) >= 5:
                        break
            encoding_used = 'utf-16'
        except Exception:
            encoding_used = 'error'

    l1 = content_lines[0] if len(content_lines) > 0 else ''
    l2 = content_lines[1] if len(content_lines) > 1 else ''
    l3 = content_lines[2] if len(content_lines) > 2 else ''

    fn_title_norm = normalize_compare(fn_title)
    fn_author_norm = normalize_compare(fn_author) if fn_author else ''
    l1_norm = normalize_compare(l1)
    l2_norm = normalize_compare(l2)
    l3_norm = normalize_compare(l3)

    final_title = None
    final_author = None
    needs_review = False
    review_reason = None

    # Pattern 1: Standard (Line 1 = Author, Line 2 = Title)
    if (l1_norm and fn_author_norm and (l1_norm in fn_author_norm or fn_author_norm in l1_norm)) and \
       (l2_norm and fn_title_norm and (l2_norm in fn_title_norm or fn_title_norm in l2_norm)):
        final_author = l1
        final_title = l2
    # Pattern 2: Shifted Header (Line 1 = Header/Title - Author, Line 2 = Author, Line 3 = Title)
    elif (l2_norm and fn_author_norm and (l2_norm in fn_author_norm or fn_author_norm in l2_norm)) and \
         (l3_norm and fn_title_norm and (l3_norm in fn_title_norm or fn_title_norm in l3_norm)):
        final_author = l2
        final_title = l3
    # Pattern 3: Reversed (Line 1 = Title, Line 2 = Author)
    elif (l1_norm and fn_title_norm and (l1_norm in fn_title_norm or fn_title_norm in l1_norm)) and \
         (l2_norm and fn_author_norm and (l2_norm in fn_author_norm or fn_author_norm in l2_norm)):
        final_title = l1
        final_author = l2
    # Fallback / Deviations
    else:
        # Check if line 1 and line 2 look like plausible author/title
        if l1 and l2 and len(l1) <= 80 and len(l2) <= 150:
            final_author = l1
            final_title = l2
            needs_review = True
            review_reason = 'content_filename_partial_mismatch'
        else:
            # Fallback to filename if content structure deviates heavily
            final_title = fn_title
            final_author = fn_author
            needs_review = True
            review_reason = 'content_lines_unstructured_fallback_to_filename'

    # Content size in bytes
    try:
        content_size_bytes = os.path.getsize(file_path)
    except Exception:
        content_size_bytes = 0

    return {
        'title': final_title,
        'author': final_author,
        'encoding': encoding_used,
        'content_size_bytes': content_size_bytes,
        'needs_review': needs_review,
        'review_reason': review_reason
    }

def run_phase1(limit: int = None, output_prefix: str = ''):
    """Run Phase 1 processing."""
    if not os.path.isdir(RAW_EXTRACTED_DIR):
        print(f"Error: Thư mục dữ liệu {RAW_EXTRACTED_DIR} không tồn tại.")
        sys.exit(1)

    os.makedirs(PROCESSED_DIR, exist_ok=True)

    # Deterministic alphabetical sorting guarantees stable book_ids
    all_filenames = sorted(os.listdir(RAW_EXTRACTED_DIR))
    total_files = len(all_filenames)

    selected_filenames = all_filenames[:limit] if limit else all_filenames
    print(f"Bắt đầu xử lý Phase 1: {len(selected_filenames)} / {total_files} files...")

    records = []
    missing_title = 0
    missing_author = 0
    needs_review_count = 0

    # Tracking for duplicate detection
    filenames_seen = Counter()
    titles_seen = defaultdict(list)
    title_author_seen = defaultdict(list)

    for idx, fname in enumerate(selected_filenames, start=1):
        book_id = f"book_{idx:06d}"
        fpath = os.path.join(RAW_EXTRACTED_DIR, fname)
        rel_content_path = f"data/raw/extracted/output/{fname}"

        parsed = parse_book_file(fname, fpath)

        title = parsed['title']
        author = parsed['author']
        needs_rev = parsed['needs_review']

        if not title:
            missing_title += 1
        if not author:
            missing_author += 1
        if needs_rev:
            needs_review_count += 1

        record = {
            "book_id": book_id,
            "source_file": f"output/{fname}",
            "title": title,
            "author": author,
            "content_path": rel_content_path,
            "content_size_bytes": parsed['content_size_bytes'],
            "language": "vi",
            "metadata": {
                "publisher": None,
                "publication_year": None,
                "isbn": None,
                "category": None,
                "description": None
            },
            "verification": {
                "status": "PENDING",
                "sources": [],
                "claims": []
            },
            "needs_review": needs_rev
        }
        if parsed['review_reason']:
            record['review_reason'] = parsed['review_reason']

        records.append(record)

        # Track duplicates
        filenames_seen[fname] += 1
        if title:
            titles_seen[clean_text(title).lower()].append(book_id)
        if title and author:
            ta_key = f"{clean_text(title).lower()} ### {clean_text(author).lower()}"
            title_author_seen[ta_key].append(book_id)

    # 1. Output JSONL
    jsonl_filename = f"{output_prefix}books.jsonl" if output_prefix else "books.jsonl"
    jsonl_path = os.path.join(PROCESSED_DIR, jsonl_filename)
    with open(jsonl_path, 'w', encoding='utf-8') as f:
        for r in records:
            f.write(json.dumps(r, ensure_ascii=False) + '\n')

    # 2. Duplicate Report
    dup_filenames = {k: v for k, v in filenames_seen.items() if v > 1}
    dup_titles = {k: v for k, v in titles_seen.items() if len(v) > 1}
    dup_title_author = {k: v for k, v in title_author_seen.items() if len(v) > 1}

    dup_report = {
        "duplicate_filenames_count": len(dup_filenames),
        "duplicate_filenames": dup_filenames,
        "duplicate_titles_count": len(dup_titles),
        "duplicate_titles": {k: len(v) for k, v in dup_titles.items()},
        "duplicate_title_author_count": len(dup_title_author),
        "duplicate_title_author": {k: len(v) for k, v in dup_title_author.items()}
    }

    dup_filename = f"{output_prefix}duplicate_report.json" if output_prefix else "duplicate_report.json"
    dup_path = os.path.join(PROCESSED_DIR, dup_filename)
    with open(dup_path, 'w', encoding='utf-8') as f:
        json.dump(dup_report, f, ensure_ascii=False, indent=2)

    # 3. Summary JSON
    summary = {
        "total_books": len(records),
        "valid_books": len(records) - (missing_title + missing_author),
        "missing_title": missing_title,
        "missing_author": missing_author,
        "duplicate_titles": len(dup_titles),
        "duplicate_title_author": len(dup_title_author),
        "needs_review": needs_review_count
    }

    summary_filename = f"{output_prefix}summary.json" if output_prefix else "summary.json"
    summary_path = os.path.join(PROCESSED_DIR, summary_filename)
    with open(summary_path, 'w', encoding='utf-8') as f:
        json.dump(summary, f, ensure_ascii=False, indent=2)

    print(f"Đã hoàn thành xuất file tại {PROCESSED_DIR}:")
    print(f" - {jsonl_path}")
    print(f" - {dup_path}")
    print(f" - {summary_path}")
    print("\nSummary:")
    print(json.dumps(summary, ensure_ascii=False, indent=2))

    return records, summary, dup_report

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Phase 1: TXT to Structured Records")
    parser.add_argument('--limit', type=int, default=None, help="Giới hạn số file xử lý (để test)")
    parser.add_argument('--prefix', type=str, default='', help="Tiền tố file output")
    args = parser.parse_args()

    run_phase1(limit=args.limit, output_prefix=args.prefix)
