# CONTENT-018 — Soạn bài học đọc tiêu chuẩn Bài 3 Chapter 1972 ("12 Ngày đêm rực lửa")

> Status: REVIEW\
> Last updated: 2026-10-01

## Assignment

- Phase / milestone: Content Track (Phase 2 Expansion)
- Workstream: Product + Content / Standard Reading authoring
- Accountable owner: Thọ (Member 1 — Content Lead)
- Executor type: Human (Thọ) + Codex hỗ trợ
- Executor name: Thọ (Member 1)
- Reviewer: Trúc (Member 2 — Historical Reviewer), Product Owner (PO nghiệm thu)
- Branch: `content/tho-chapter-1972-package` (PR #65)
- Started: 2026-09-28
- Depends on: CONTENT-017 (`DONE` - PR #54), CONTENT-016 (`DONE`), CONTENT-015 (`DONE`), CONTENT-013 (`DONE`)

## Scope

- In scope:
  - Soạn thảo tài liệu bài học đọc tiêu chuẩn (Standard Reading Lesson): `docs/content/LESSON-03-1972-STANDARD.md`.
  - Đạt mục tiêu học tập `CLO-4`: Phân tích được ý nghĩa chiến lược của việc đánh bại cuộc tập kích B-52, bảo vệ Thủ đô và buộc Mỹ phải ký kết Hiệp định Paris 1973.
  - Khắc họa các mốc sự kiện đỉnh điểm:
    - Đêm 20/12/1972: Đêm chiến đấu then chốt, quân và dân miền Bắc đánh trả quyết liệt, bẻ gãy đòn phủ đầu của Không quân Mỹ.
    - Đêm 26/12/1972: Đợt tập kích hủy diệt lớn nhất của B-52 vào khu dân cư Khâm Thiên; quân dân Hà Nội - Hải Phòng giáng trả đòn quyết định, bắn rơi 8 chiếc B-52 trong một đêm (riêng Hà Nội diệt 5 chiếc).
    - Ngày 30/12/1972 & 27/01/1973: Tuyên bố ngừng ném bom từ vĩ tuyến 20 trở ra và tiến tới ký kết Hiệp định Paris.
  - Phân tách 3 tầng nội dung theo chuẩn Phase 3 Spec:
    - `verified_fact`: Mốc thời gian, số lượng phi vụ, thiệt hại thực tế, đơn vị tham chiến, trích dẫn tài liệu chính thống.
    - `educational_explanation`: Phân tích chiến lược, nghệ thuật phòng không nhân dân, tác động ngoại giao.
    - `reading_reflection`: 2 câu hỏi suy ngẫm đọc hiểu thuần túy, không gán điểm cảm xúc.
  - Định danh và ánh xạ rõ ràng Claim IDs (`CLM-1972-RD-001..005`) với các nguồn chính thống có locator (`SRC-LB2-01`, `SRC-LB2-02`, `SRC-LB2-03`, `SRC-LB2-05`).
  - Đối chiếu số liệu tổn thất khách quan giữa tài liệu Việt Nam và tài liệu USAF (Air Force History).
  - Khóa media boundary và text-first fallback.
  - Tạo script kiểm thử tự động tính toàn vẹn: `docs/content/validate-1972-lesson03.mjs`.
- Out of scope: Không lập trình runtime, không sửa đổi database schema, không vi phạm milestone gates.
- Files claimed:
  - `docs/tasks/active/CONTENT-018.md`
  - `docs/content/LESSON-03-1972-STANDARD.md`
  - `docs/content/validate-1972-lesson03.mjs`
  - `docs/project/TASK-BOARD.md`

## Acceptance criteria

- [x] Bài học `LESSON-03-1972-STANDARD.md` có đầy đủ cấu trúc: Metadata, Mục tiêu, 3 phần diễn biến chính, Diễn giải giáo dục, Câu hỏi đọc hiểu, Nguồn & Media guardrails.
- [x] 100% dữ kiện lịch sử gắn Claim ID và liên kết nguồn truy vết rõ ràng.
- [x] Số liệu tổn thất máy bay B-52 được trình bày khách quan, nêu rõ số liệu Việt Nam công bố (34 B-52 trong 12 ngày đêm) và số liệu USAF thừa nhận (15-16 B-52 bị bắn rơi) theo chuẩn đối chiếu học thuật.
- [x] Có ít nhất 2 câu hỏi suy ngẫm đọc hiểu sư phạm giúp người học liên hệ bối cảnh đàm phán ngoại giao.
- [x] Text-first fallback hoàn chỉnh, không phụ thuộc vào hình ảnh ngoài chưa có bản quyền.
- [x] Script kiểm thử `validate-1972-lesson03.mjs` chạy PASS 100%.
- [ ] Trúc (Historical Reviewer) thẩm định sử liệu và ngôn ngữ.
- [ ] Product Owner nghiệm thu phê duyệt.

## Verification

- Commands/checks: `node docs/content/validate-1972-lesson03.mjs`, `git diff --check`, `node scripts/member5/check-client-env.mjs`.
- Expected result: Bản bài đọc tiêu chuẩn Bài 3 hoàn chỉnh, dữ liệu kiểm chứng minh bạch, sẵn sàng cho Trúc và Product Owner thẩm định.

## Progress checkpoints

| Date/time | Executor | Completed | Evidence | Next action | Blocker |
|---|---|---|---|---|---|
| 2026-09-28 | Thọ (Member 1) | Khởi tạo task card CONTENT-018 và xác lập phạm vi soạn thảo Bài 3 Chapter 1972 | Card CONTENT-018; branch `content/tho-lesson-03-1972-reading` | Viết bài học đọc tiêu chuẩn và script validator | Không |
| 2026-09-28 | Thọ (Member 1) | Hoàn thành bài học đọc tiêu chuẩn Bài 3 `LESSON-03-1972-STANDARD.md` và script kiểm thử tự động `validate-1972-lesson03.mjs` PASS 100%; chuyển REVIEW | `docs/content/LESSON-03-1972-STANDARD.md`, `validate-1972-lesson03.mjs` | Bàn giao cho Trúc thẩm định sử liệu và Product Owner nghiệm thu | Không |
| 2026-10-01 | Thọ (Member 1) | Đồng bộ main sạch 0 conflict vào PR #65; xác minh 0-link-lỗi DOC-013; validator PASS 100% | `docs/content/LESSON-03-1972-STANDARD.md`, `validate-1972-lesson03.mjs` | Chờ Trúc và Product Owner duyệt PR #65 | Không |

## Handoff

- Changed files: `docs/tasks/active/CONTENT-018.md`, `docs/content/LESSON-03-1972-STANDARD.md`, `docs/content/validate-1972-lesson03.mjs`, `docs/project/TASK-BOARD.md`.
- Test/build result: `validate-1972-lesson03.mjs` PASS 100%, `validate-1972-authoring.mjs` PASS 100%, `check-client-env.mjs` PASS (0 secrets).
- Environment/migration impact: docs/content-only, không ảnh hưởng runtime.
- Next owner/action: Trúc (Historical Reviewer) thẩm định sử liệu và văn phong; Product Owner nghiệm thu.
