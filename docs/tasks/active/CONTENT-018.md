# CONTENT-018 — Soạn bài học đọc tiêu chuẩn Bài 3 Chapter 1972 ("12 Ngày đêm rực lửa")

> Status: REVIEW\
> Last updated: 2026-10-02

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
  - `docs/content/CHAPTER-1972-PACKAGE.md`
  - `docs/content/CHUAN-HOA-NOI-DUNG-GIAO-DUC-1972.md`
  - `docs/content/HISTORICAL-SOURCES.md`
  - `docs/content/PILOT-SCREENPLAY.md`
  - `docs/content/M3-INTEGRATION-GUIDE.md`
  - `docs/content/validate-1972-lesson03.mjs`
  - `docs/project/TASK-BOARD.md`

## Acceptance criteria

- [x] Bài học `LESSON-03-1972-STANDARD.md` có đầy đủ cấu trúc: Metadata, Mục tiêu, 3 phần diễn biến chính, Diễn giải giáo dục, Câu hỏi đọc hiểu, Nguồn & Media guardrails.
- [x] 100% dữ kiện lịch sử gắn Claim ID và liên kết nguồn truy vết rõ ràng.
- [x] Số liệu tổn thất máy bay B-52 được trình bày khách quan, nêu rõ số liệu Việt Nam công bố (34 B-52 trong 12 ngày đêm) và số liệu USAF thừa nhận (15-16 B-52 bị bắn rơi) theo chuẩn đối chiếu học thuật.
- [x] Có ít nhất 2 câu hỏi suy ngẫm đọc hiểu sư phạm giúp người học liên hệ bối cảnh đàm phán ngoại giao.
- [x] Text-first fallback hoàn chỉnh, không phụ thuộc vào hình ảnh ngoài chưa có bản quyền.
- [x] Script kiểm thử `validate-1972-lesson03.mjs` chạy PASS 100%.
- [x] Trúc (Historical Reviewer) thẩm định sử liệu và ngôn ngữ. — TEXT APPROVED 2026-10-02, hash-bound head `b65dd2d`: [evidence](../evidence/CONTENT-018-truc-historical-rereview-2026-10-02.md) (GitHub Approve click pending; scoped Bạch Mai + Tòa Đại sứ, không gồm media/production).
- [x] Product Owner nghiệm thu phê duyệt. — PO ACCEPTED 2026-10-02 tại head `008b2f8` (content `b65dd2d` + evidence Trúc), TRƯỚC CONTENT-019: [PO evidence](../evidence/CONTENT-018-019-po-acceptance-2026-10-02.md).

## Verification

- Commands/checks: `node docs/content/validate-1972-lesson03.mjs`, `git diff --check`, `node scripts/member5/check-client-env.mjs`.
- Expected result: Bản bài đọc tiêu chuẩn Bài 3 hoàn chỉnh, dữ liệu kiểm chứng minh bạch, sẵn sàng cho Trúc và Product Owner thẩm định.

## Progress checkpoints

| Date/time | Executor | Completed | Evidence | Next action | Blocker |
|---|---|---|---|---|---|
| 2026-09-28 | Thọ (Member 1) | Khởi tạo task card CONTENT-018 và xác lập phạm vi soạn thảo Bài 3 Chapter 1972 | Card CONTENT-018; branch `content/tho-lesson-03-1972-reading` | Viết bài học đọc tiêu chuẩn và script validator | Không |
| 2026-09-28 | Thọ (Member 1) | Hoàn thành bài học đọc tiêu chuẩn Bài 3 `LESSON-03-1972-STANDARD.md` và script kiểm thử tự động `validate-1972-lesson03.mjs` PASS 100%; chuyển REVIEW | `docs/content/LESSON-03-1972-STANDARD.md`, `validate-1972-lesson03.mjs` | Bàn giao cho Trúc thẩm định sử liệu và Product Owner nghiệm thu | Không |
| 2026-10-01 | Thọ (Member 1) | Đồng bộ main sạch 0 conflict vào PR #65; xác minh 0-link-lỗi DOC-013; validator PASS 100% | `docs/content/LESSON-03-1972-STANDARD.md`, `validate-1972-lesson03.mjs` | Chờ Trúc và Product Owner duyệt PR #65 | Không |
| 2026-10-02 | Thọ (Member 1) | Sửa mốc Bạch Mai tách khỏi Khâm Thiên: rạng sáng 22/12/1972, 28 người thiệt mạng gồm 27 nhân viên y tế và 1 bệnh nhân; thêm nguồn Báo Nhân Dân `SRC-1972-WEB-09`; bỏ claim quá mức về Tòa Đại sứ; handoff M3 khớp contract hiện có | 3 validators nội dung PASS; `git diff --check` PASS; claim và source registry được đồng bộ | Trúc thẩm định lại sử liệu trên head PR mới; CONTENT-018/019 vẫn REVIEW | Human sign-off chưa có |
| 2026-10-02 | Thọ (Member 1) + Codex | Merge main `5c795b2` (PR #103) vào PR #65 (`9a3117d`); gỡ conflict board (giữ hàng main + hàng 018/019) và CONTENT-017 (lấy bản main); đối chiếu 4 finding P1/P2 của Trúc/Dương đã sửa từ head `22cb164`; chạy lại 4 validators PASS | Merge commit; 1972-authoring/lesson03/quiz + MT68 validators PASS; `git diff --check` PASS | Trúc re-review historical (Bạch Mai, Tòa Đại sứ), Dương re-review consumer (handoff M3); CONTENT-018/019 giữ REVIEW | Chờ human sign-off; sau merge PR cần re-sync hash CONTENT-004/014 do pilot files đổi bytes |
| 2026-10-02 | Thọ (Member 1) + Codex | Lấy PR #65 tới head `8e027319e3871314c289cb93cfc7f0dabc2c8eac`; kiểm tra hai GitHub Quality checks đều SUCCESS; lập hash snapshot chưa-review cho các artifact bị đổi để reviewer bind verdict đúng revision | `PILOT-SCREENPLAY.md` SHA-256 `6d1bf23a68bf1ad629a53ef1fed7f46360476ca769d8ea527ffb8c07610e9d56`; `HISTORICAL-SOURCES.md` SHA-256 `f8606d62998965a6994b061e14abca9b9a4b7f39e06c95ed97057210402f10b2`; prior screenplay hash trong CONTENT-014 không còn khớp | Trúc re-review historical/hash-bound artifacts; Dương re-review consumer findings; yêu cầu GitHub reviewer chưa gửi được do connector 403/UI unavailable | Chờ reviewer; mọi hash trên là snapshot hiện tại, CHƯA phải approval |
| 2026-10-02 | Dương (Product Owner) | Nghiệm thu CONTENT-018 (TRƯỚC 019): Trúc TEXT APPROVED hash-bound, PO đối chiếu 6/6 worktree SHA-256 khớp; consumer APPROVED; checklist + lesson + validators/CI đạt | [PO evidence](../evidence/CONTENT-018-019-po-acceptance-2026-10-02.md) | CONTENT-019 nghiệm thu tiếp theo; chờ Hưng re-review + merge | Hưng architecture re-review pending; merge BLOCKED bước 4 |

## Handoff

- Changed files: `docs/tasks/active/CONTENT-018.md`, `docs/content/LESSON-03-1972-STANDARD.md`, `docs/content/CHAPTER-1972-PACKAGE.md`, `docs/content/CHUAN-HOA-NOI-DUNG-GIAO-DUC-1972.md`, `docs/content/HISTORICAL-SOURCES.md`, `docs/content/validate-1972-lesson03.mjs`, `docs/project/TASK-BOARD.md`.
- Test/build result (2026-10-02): `node docs/content/validate-1972-authoring.mjs`, `node docs/content/validate-1972-lesson03.mjs`, `node docs/content/validate-1972-quiz.mjs`, và `git diff --check` đều PASS. Validator Lesson 3 chỉ xác nhận cấu trúc, event/date strings, claim/source IDs; không thẩm định fact. Chưa chạy app build/typecheck vì thay đổi chỉ nằm trong tài liệu và validator.
- Environment/migration impact: docs/content-only, không ảnh hưởng runtime.
- Next owner/action: Hưng re-review kiến trúc; Trúc/Hưng cập nhật GitHub review lên Approved; Thọ đồng bộ nhãn CLM-1972-RD-003 (status-line-only, ghi hash mới); PO đã ACCEPTED — merge khi đủ bước 4.
