# CONTENT-014 — Vinh recheck review-state reconciliation, 2026-10-02

- Reviewer: Vinh (Member 5), Codex hỗ trợ.
- Base: `origin/main` `2abd202` (đã chứa PR85 merge `ed234e9`, gồm reconciliation `3210776`).
- Phạm vi: kiểm tra lại bằng bytes rằng review-state reconciliation chỉ đổi đúng
  trường trạng thái của đúng revision đã duyệt; quiz/map giữ pending đúng;
  `draft`/`authoringOnly` giữ nguyên; validator vẫn PASS.
- Phương pháp (tái hiện được, không phụ thuộc CRLF của working tree):
  `git cat-file -p <rev>:<path>` lấy blob bytes rồi SHA-256; so với hash trong
  card; `git diff --unified=0 30d0a4f HEAD` kiểm tra phạm vi diff;
  `node docs/content/validate-mt68-authoring.mjs` kiểm tra authoring.
- Ghi nhận minh bạch: commit reconciliation `3210776` do Vinh/Codex thực hiện
  thao tác máy theo phạm vi Trúc xác nhận (task board log 2026-10-02; DOC-017
  ghi Trúc confirmed card states). Recheck này là kiểm tra bytes có thể tái hiện
  bởi bất kỳ ai, không thay quyết định historical scope của Trúc. Hưng recheck
  độc lập vẫn còn theo next action của card.

## Verdict

- Review-state reconciliation: **ACCEPTED** cho phạm vi CONTENT-004/010/011.
- P2 trong [technical QA 2026-10-01](./CONTENT-014-technical-qa.md) được
  **RESOLVED** ở chiều đồng bộ review record/artifact flags.
- Quiz CONTENT-012 và map giữ `NEEDS_HISTORICAL_REVIEW` là **đúng**:
  historical report 2026-09-28 chỉ liệt kê CONTENT-004/010/011/015 (+CONTENT-017
  qua PR #54), không liệt kê CONTENT-012.
- Không thay media/audio/handoff/production acceptance. Task giữ REVIEW;
  CONTENT-007 giữ BLOCKED. Gate: M3 OPEN / M4 LOCKED.

## Hash check (blob bytes)

| File | Reviewed (`30d0a4f`) khớp card | Current (`HEAD`) khớp card | Verdict commit `02c1128` byte-identical với reviewed |
|---|---|---|---|
| `PILOT-SCREENPLAY.md` | PASS `80470eff…052be` | PASS `24dac5d3…50604` | yes |
| `PILOT-NARRATION.json` | PASS `138f0fd1…97387` | PASS `b9e7d17f…137ed` | yes |
| `PILOT-CAPTIONS.vtt` | PASS `917854f6…672c6d` | PASS (unchanged) | yes |
| `LESSON-02-INTERACTIVE.md` | PASS `707c737c…3d7dc3` | PASS `51f70a1c…a26cf4` | yes |
| `LESSON-02-STORY.json` | PASS `952c0481…ffebb` | PASS `9526a7e2…ea1f1` | yes |
| `MAP-MT68.json` | PASS `63e74bcf…1acd5c` | PASS (unchanged) | n/a (pending) |
| `QUIZ-MT68.json` | PASS `4013b399…667eb` | PASS (unchanged) | n/a (pending) |
| `DETAILED-MEDIA-CATALOG.csv` | PASS `b1eb9ccb…91fdbf` | PASS (unchanged) | n/a |

(Full hashes trong card CONTENT-014 và [technical QA 2026-10-01](./CONTENT-014-technical-qa.md).)

## Diff scope (`30d0a4f` → `HEAD`)

- 4 file approved: mỗi file đúng 2 dòng đổi (1 xóa + 1 thêm), tất cả chứa
  `NEEDS_HISTORICAL_REVIEW` → `APPROVED_BY_HISTORICAL_REVIEWER`; không dòng
  nội dung nào khác đổi.
- `PILOT-CAPTIONS.vtt`, `MAP-MT68.json`, `QUIZ-MT68.json`,
  `DETAILED-MEDIA-CATALOG.csv`: byte-identical, không đổi.

## Flags hiện hành

- `QUIZ-MT68.json`, `MAP-MT68.json`: giữ `NEEDS_HISTORICAL_REVIEW`.
- `PILOT-NARRATION.json`, `LESSON-02-STORY.json` (+ 2 file Markdown):
  `APPROVED_BY_HISTORICAL_REVIEWER` ở chiều historical/language.
- `status: draft` và `authoringOnly: true` giữ nguyên ở 2 file JSON.
- Media catalog: 8 rows, 6 BLOCKED / 2 NEEDS_MEDIA_REVIEW (không đổi).

## Validator

- `node docs/content/validate-mt68-authoring.mjs`: PASS (5 map nodes, 7 scenes,
  6 complete paths, 5 quiz questions, 9 identical narration/VTT cues 110s,
  source/claim IDs và local links hợp lệ).
- `git diff --check`: sạch.

## Handoff

- Changed files trong recheck này: evidence này, card CONTENT-014,
  checkpoint CONTENT-004/010/011/012, active index, board rows + update log.
  Không sửa authored content, runtime, migration, env hay dependency.
- Next: Hưng recheck độc lập; Trúc media/handoff sign-off cho CONTENT-004/010/011;
  Trúc/historical reviewer verdict riêng cho quiz CONTENT-012 rồi Vinh QA.
