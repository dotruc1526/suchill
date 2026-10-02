# PO Acceptance — CONTENT-018 trước, rồi CONTENT-019 (PR #65)

> Product Owner: Dương (kiêm Member 4; quyết định này đóng vai PO, tách khỏi consumer review Member 4)\
> Date: 2026-10-02\
> PR: #65 (`content/tho-chapter-1972-package` → `main`)\
> Reviewed content head: `b65dd2d5a97746ac137d1348d063e35f70ccdc6a`\
> Record head: `008b2f887a3dfa2911c18d169ff4f8470122f4a2` (= `b65dd2d` + 1 file evidence của Trúc, 0 delta content)\
> Thứ tự: CONTENT-018 ACCEPTED trước, rồi CONTENT-019 ACCEPTED (đúng dependency trên card)

## 1. Verdict

- **CONTENT-018 (Bài 3 Standard Reading): PO ACCEPTED.** Toàn bộ acceptance checklist đạt, có Trúc TEXT APPROVED hash-bound + consumer APPROVED.
- **CONTENT-019 (Quiz JSON): PO ACCEPTED** (sau CONTENT-018). Quiz không đổi byte, CLO phủ đủ, Trúc xác nhận tại review `3fbf5ea` + mục 3 evidence của Trúc.

Cả hai task giữ `REVIEW` cho tới khi merge; `DONE` + chuyển card sang `done/` chỉ sau khi PR merge theo bước 4.

## 2. Căn cứ PO đã tự kiểm (không ký mù)

- Trúc TEXT APPROVED ngày 2026-10-02 ([evidence](./CONTENT-018-truc-historical-rereview-2026-10-02.md)): 2 finding P1 (Bạch Mai tách ngày 22/12 khỏi Khâm Thiên 26/12 + nguồn Nhân Dân; Tòa Đại sứ wording khuôn viên ≠ tòa nhà) đã sửa. PO đối chiếu lại 6/6 worktree SHA-256 khớp tuyệt đối với evidence (lưu ý quy ước: hash tính trên worktree bytes CRLF; blob hash khác do line-ending — người verify sau dùng worktree hoặc quy đổi).
- Quiz `QUIZ-1972.json` không đổi byte `3fbf5ea..b65dd2d` (PO chạy `git diff --quiet`, exit 0); PO đọc trực tiếp JSON: 5 câu × 4 options, correctOptionId/explanation/sourceIds đầy đủ, phủ CLO-1..4.
- PO đọc toàn bộ `LESSON-03-1972-STANDARD.md`: đủ metadata/mục tiêu/3 phần diễn biến/bảng đối chiếu VN–USAF (34 vs 15–16 B-52)/diễn giải sư phạm/2 câu hỏi suy ngẫm/claim list CLM-1972-RD-001..005/text-first fallback (`NO_ASSET_SELECTED`).
- Dương (Member 4) consumer re-review: APPROVED trên GitHub tại `b65dd2d`; delta lên `008b2f8` chỉ là 1 file evidence nên approval còn nguyên giá trị.
- 3 validators 1972 PASS, `git diff --check` sạch, client scan 383 files/0 unsafe, GitHub Quality 2/2 SUCCESS tại `b65dd2d`. PR diff docs-only, không runtime/migration/env impact.

## 3. Đính chính 1 tiền đề trong consumer review (không đổi verdict)

Consumer review của Dương viết "LESSON-03 không chứa markdown table" — SAI: bài có 1 bảng đối chiếu số liệu (§4). Nguyên nhân: grep neo `^...$` trượt do CRLF. Verdict consumer vẫn đứng vì handoff đã bao phủ tường minh: bảng đối chiếu + câu hỏi reflection được biểu diễn bằng `paragraph`/`key_points` hiện có; section kind chuyên biệt cho bảng/reflection cần contract/task duyệt riêng (guide §3.3, package §3.3). Đính chính này cũng được đăng comment trên PR.

## 4. Quyết định PO đi kèm

a) File mới `CHUAN-HOA-NOI-DUNG-GIAO-DUC-MAUTHAN1968.md`: giữ trong PR ở trạng thái **DRAFT**, thuộc review path riêng của CONTENT-004; các nhãn `[FACT]` trong file chưa được review — LOẠI khỏi phạm vi nghiệm thu 018/019, không coi là nội dung đã duyệt/sản xuất.
b) Nhãn `CLM-1972-RD-003` trong registry còn `NEEDS_HISTORICAL_REVIEW` (lesson/package ghi `verified_fact`): Thọ đồng bộ nhãn sau verdict, CHỈ đổi dòng trạng thái + ghi hash mới vào card theo tiền lệ CONTENT-012; đổi thêm nội dung khác thì re-review. Đây là follow-up đã được verdict của Trúc cho phép, không chặn PO acceptance.
c) Merge vẫn **BLOCKED** theo bước 4: còn chờ Hưng re-review kiến trúc trên cùng head + các review chuyển sang Approved + PO sign-off này (đã có tại file này). Mọi dismiss review cũ/admin merge (nếu cần) tuân tiền lệ FE-011 và cần PO duyệt riêng tại thời điểm merge — không phê duyệt trước tại đây.

## 5. Giới hạn quyết định

- Không phê duyệt media/production; không mở CONTENT-007; không quyết định gate milestone (M3 vẫn OPEN).
- Không thay verdict sử liệu của Trúc ngoài phạm vi hash-bound của cô; không thay architecture review của Hưng.
- Nội dung authoring KHÔNG được đưa vào runtime, seed hay publish bởi quyết định này; integration cần adapter task + gate riêng.
- Verdict gắn với head ghi trên: mọi sửa đổi content artifact sau head này cần re-confirm PO.
