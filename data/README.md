# Sử Chill — Hướng Dẫn & Đặc Tả Dữ Liệu Sách (Book Dataset)

Thư mục này chứa dữ liệu sách tiếng Việt đã qua xử lý chuẩn hóa và kiểm chứng, phục vụ cho ứng dụng học lịch sử **Sử Chill**, tính năng tra cứu tư liệu, và làm ngữ liệu tri thức (RAG/AI).

---

## 1. Cấu Trúc Thư Mục Dữ Liệu

```text
data/
├── README.md                          # Tài liệu hướng dẫn sử dụng cho dev (file này)
├── processed/                         # Dữ liệu 10.415 sách đã cấu trúc (Phase 1)
│   ├── books.jsonl                    # 10.415 bản ghi sách (JSON Lines, ~5.2 MB)
│   ├── summary.json                   # Thống kê tổng hợp số lượng & độ hợp lệ
│   └── duplicate_report.json          # Báo cáo các tựa sách trùng lặp
└── verified/
    └── pilot/                         # Dữ liệu kiểm chứng nguồn 10 sách mẫu (Phase 2)
        ├── pilot_books.jsonl          # 10 sách pilot có metadata đã xác minh
        ├── sources.jsonl              # 16 nguồn tư liệu thực tế (URL, Level 1-5, evidence)
        ├── claims.jsonl               # 42 claims kiểm chứng liên kết source ↔ evidence
        ├── research_report.json       # Báo cáo kết quả nghiên cứu nguồn
        └── phase2_audit_report.json   # Báo cáo kiểm định chất lượng trích dẫn
```

*Lưu ý: Dữ liệu thô 1.7GB (`data/raw/`) được tự động chặn bởi `.gitignore` để giữ repo luôn gọn nhẹ.*

---

## 2. Đặc Tả Schema Dữ Liệu

### A. Bản ghi sách chuẩn (`data/processed/books.jsonl`)
Mỗi dòng là một đối tượng JSON độc lập:
```json
{
  "book_id": "book_000170",
  "source_file": "output/Ba người khác - Tô Hoài.txt",
  "title": "Ba người khác",
  "author": "Tô Hoài",
  "content_path": "data/raw/extracted/output/Ba người khác - Tô Hoài.txt",
  "content_size_bytes": 482064,
  "language": "vi",
  "metadata": {
    "publisher": null,
    "publication_year": null,
    "isbn": null,
    "category": null,
    "description": null
  },
  "verification": {
    "status": "PENDING",
    "sources": [],
    "claims": []
  },
  "needs_review": false
}
```

### B. Bản ghi sách đã xác minh (`data/verified/pilot/pilot_books.jsonl`)
Chứa metadata đầy đủ đã được thẩm định qua nguồn web chính thống:
```json
{
  "book_id": "book_004315",
  "title": "Lịch Sử Khẩn Hoang Miền Nam",
  "author": "Sơn Nam",
  "language": "vi",
  "metadata": {
    "publisher": "Nhà xuất bản Trẻ",
    "publication_year": 2018,
    "isbn": "978-604-1-12854-5",
    "category": "Biên khảo / Lịch sử - Địa chí Nam Bộ",
    "description": "Biên khảo tái hiện công cuộc khai phá và định cư của cư dân Việt trên vùng đất Nam Bộ suốt ba thế kỷ."
  },
  "verification": {
    "status": "VERIFIED",
    "confidence": "HIGH",
    "sources": ["src_nxbtre_khanhoang", "src_tuoitre_sonnam"]
  }
}
```

### C. Nguồn tư liệu (`data/verified/pilot/sources.jsonl`)
```json
{
  "source_id": "src_nxbtre_khanhoang",
  "title": "Lịch sử khẩn hoang miền Nam - Biên khảo",
  "url": "https://www.nxbtre.com.vn/sach/lich-su-khan-hoang-mien-nam-bien-khao-44610.html",
  "domain": "nxbtre.com.vn",
  "source_type": "Website chính thức Nhà xuất bản Trẻ",
  "authority_level": 5,
  "evidence": "LỊCH SỬ KHẨN HOANG MIỀN NAM: biên khảo. Tác giả: Sơn Nam. ISBN: 978-604-1-12854-5. In lần thứ 7 năm 2018.",
  "accessed_at": "2026-10-05T06:26:41Z"
}
```

---

## 3. Hướng Dẫn Sử Dụng Cho Lập Trình Viên

### Đọc dữ liệu trong Node.js / TypeScript (Backend hoặc Script)
```typescript
import fs from 'node:fs';
import readline from 'node:readline';

async function loadBooks() {
  const fileStream = fs.createReadStream('data/processed/books.jsonl', { encoding: 'utf-8' });
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  const books = [];
  for await (const line of rl) {
    if (line.trim()) {
      books.push(JSON.parse(line));
    }
  }
  return books;
}

// Ví dụ: Tìm sách theo tác giả hoặc tựa
const allBooks = await loadBooks();
const historyBooks = allBooks.filter(b => b.author?.includes('Võ Nguyên Giáp') || b.title?.includes('Điện Biên'));
console.log(`Tìm thấy ${historyBooks.length} cuốn sách liên quan!`);
```

### Đọc dữ liệu trong Python (Xử lý dữ liệu / AI)
```python
import json

def load_verified_books():
    with open('data/verified/pilot/pilot_books.jsonl', 'r', encoding='utf-8') as f:
        return [json.loads(line) for line in f]

books = load_verified_books()
for b in books:
    print(f"[{b['book_id']}] {b['title']} - {b['author']} (NXB: {b['metadata']['publisher']})")
```

---

## 4. Các Script Pipeline

Các script thực thi nằm trong thư mục `scripts/pipeline/`:
- **`scripts/pipeline/phase1_txt_to_records.py`**:
  - Chuyển đổi toàn bộ 10.415 file TXT thô thành `data/processed/books.jsonl`.
  - Hỗ trợ cờ `--limit 10` để test thử nghiệm.
- **`scripts/pipeline/phase2_pilot_verification.py`**:
  - Tạo cấu trúc kiểm chứng Pilot 10 sách (claims, sources, evidence, audit report).
