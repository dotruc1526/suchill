# CONTENT-015 — Soạn kịch bản chi tiết Scene-by-Scene Bài 1 Chapter 1972 ("Tối hậu thư từ bầu trời")

> Status: REVIEW\
> Last updated: 2026-09-28

## Assignment

- Phase / milestone: Content Track (Phase 2 Expansion)
- Workstream: Product + Content
- Accountable owner: Thọ (Member 1)
- Executor type: Human (Thọ) + Codex hỗ trợ
- Executor name: Thọ (Member 1)
- Reviewer: Historical Reviewer / Product Owner
- Branch: `content/tho-screenplay-1972`
- Started: 2026-09-28
- Depends on: CONTENT-013 (`DONE`), CONTENT-009 (`DONE`)

## Scope

- In scope: Soạn kịch bản chi tiết (Screenplay scene-by-scene) cho Bài 1 "Tối hậu thư từ bầu trời" thuộc Chapter 1972 (Chiến dịch 12 ngày đêm Điện Biên Phủ trên không); chuẩn tỷ lệ 9:16 dọc (1080x1920), thời lượng chuẩn 110 giây (5 phân cảnh), đầy đủ visual cues, voiceover, SFX/BGM, WebVTT subtitle template, phân loại sự thật lịch sử (`verified_fact`, `educational_explanation`), và trích dẫn nguồn lịch sử chính thống (Quân chủng PK-KQ, Viện Lịch sử Quân sự Việt Nam).
- Out of scope: Dựng video MP4 (việc của Member 2/Trúc), lập trình player (việc của Member 4/Dương).
- Files claimed: `docs/tasks/active/CONTENT-015.md`, `docs/content/SCREENPLAY-1972.md`, `docs/content/CAPTIONS-1972.vtt`, `docs/project/TASK-BOARD.md`.
- Shared-contract consumers: Member 2 (Video production), Member 4 (Frontend learning), Historical Reviewer.

## Acceptance criteria

- [x] Kịch bản chia làm 5 phân cảnh (Scene 01 đến Scene 05) với tổng thời lượng chuẩn 110 giây.
- [x] Tuân thủ tỷ lệ khung hình 9:16 dọc (1080x1920) tối ưu cho thiết bị di động.
- [x] Tách bạch rõ ràng Visual Cues, Voiceover (lời dẫn), SFX, BGM, và nhãn phân loại sự thật lịch sử (`verified_fact`).
- [x] Cung cấp bảng tra cứu nguồn lịch sử chính thống với tác giả, cơ quan xuất bản và locator cụ thể (Cẩm nang Bìa đỏ, Lịch sử Bộ đội Tên lửa PK).
- [x] Có đầy đủ bản ghi lời thoại (Full Transcript) và tệp phụ đề WebVTT đồng bộ thời gian.

## Verification

- Commands/checks: Kiểm tra thời gian WebVTT liên tục không đứt đoạn (00:00 - 01:50); kiểm tra thuật ngữ chuẩn mực lịch sử Việt Nam; kiểm tra cú pháp Markdown.
- Expected result: Kịch bản hoàn chỉnh, sẵn sàng bàn giao cho khâu sản xuất video và duyệt nội dung.

## Progress checkpoints

| Date/time | Executor | Completed | Evidence | Next action | Blocker |
|---|---|---|---|---|---|
| 2026-09-28 | Thọ (Member 1) | Khởi tạo task card và xác lập phạm vi kịch bản 1972 | Card CONTENT-015 | Viết SCREENPLAY-1972.md và CAPTIONS-1972.vtt | Không |
| 2026-09-28 | Thọ (Member 1) | Hoàn thành kịch bản 5 phân cảnh chuẩn 110s, WebVTT subtitle template và bảng tra cứu nguồn chính thống | `docs/content/SCREENPLAY-1972.md`, `docs/content/CAPTIONS-1972.vtt` | Chuyển task sang REVIEW để bàn giao cho Historical Reviewer & Video Production | Không |

## Handoff

- Changed files: `docs/tasks/active/CONTENT-015.md`, `docs/content/SCREENPLAY-1972.md`, `docs/content/CAPTIONS-1972.vtt`, `docs/project/TASK-BOARD.md`.
- Test/build result: Docs-only, không ảnh hưởng runtime; WebVTT cú pháp chuẩn RFC.
- Environment/migration impact: Không có.
- Known issues/risks: Chờ review nguồn và phân cảnh từ Historical Reviewer.
- Next owner/action: Trúc (Member 2) nhận kịch bản chuẩn bị tài nguyên video khi có phê duyệt.
