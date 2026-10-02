# Bàn giao hiện hành sau PR #21

> Status: HISTORICAL HANDOFF — các trạng thái task trong tài liệu này đã được verdict ngày 2026-09-28 thay thế; xem task board/card hiện hành.
> PR #21 đã merge tại cd89038; main khi bắt đầu lượt này: 165b9ac (đã có PR #22).
> Task thực hiện: [CONTENT-014](./CONTENT-014.md).

## Quyền và người phụ trách

Thọ đã giao Trúc toàn bộ phần sửa còn lại theo xác nhận của Trúc ngày 2026-09-27. Trúc là executor và phụ trách review historical/learning/media; không còn chờ Thọ cấp lại quyền. Codex chuẩn bị nội dung/evidence; không ký xác nhận nghe/xem hoặc quyền giọng thay Trúc. Vinh phụ trách technical QA theo lane.
Branch: `codex/mt68-complete-handoff`; mở PR mới vào main vì PR #21 đã merge.

## Đã xử lý

- Pilot đủ năm scene, 110s; narration JSON và VTT dùng cùng chữ; bỏ thơ/hiệu lệnh/lịch/giờ/nắp hầm chưa đủ nguồn.
- Bài 2 có bảy scene, hai nhánh hội tụ, knowledge check/feedback, debrief và end; overview yêu cầu đủ năm node.
- MAP-MT68 mới trên main bị lặp lỗi “đánh sập cổng/chiếm toàn bộ” đã sửa; bỏ tọa độ giả, đồng bộ source/claim/ID và fallback.
- Curriculum/production notes dùng đúng format VN, service boundary và authoring-only; Member 4 là Dương.
- Media 04 có evidence PD-USGov nhưng chưa duyệt phạm vi dùng; media 08 là CC BY 2.0 của David Wilson, không phải Public Domain. Ứng viên khác không dùng trong phương án bắt buộc.
- Visual kế hoạch dùng chữ/sơ đồ nhóm tự tạo; không nhạc/SFX, clip CBS hoặc audio reference chưa đủ quyền.

## Verification và file bàn giao

Chạy `node docs/content/validate-mt68-authoring.mjs` để kiểm tra scene/branch/coverage, reference ID, quiz và narration/VTT. Evidence kết quả cuối trong card CONTENT-014.
Các file thay đổi nằm trong claim CONTENT-014. Không đổi runtime/DB, không environment/migration. Không chạy app build/typecheck vì chỉ đổi authoring docs/data và trình kiểm tra riêng; không xác nhận DTO/seed production.

## Việc Trúc còn cần hoàn tất bằng bằng chứng thực tế

1. Đọc bản narration/story mới và ghi historical/learning sign-off trên phiên bản cụ thể.
2. Cung cấp/thu narration có quyền; chưa có file thu mới hay consent để kiểm tra. Đo cue thực tế, chỉnh caption theo audio.
3. Xuất MP4/poster/source export/manifest/hash và QA mobile/accessibility khi dependency cho phép.
4. Nếu chọn ảnh optional, xác nhận caption/alt/crop/attribution và phạm vi license. Không cần ảnh này cho phương án chữ.
5. Trạng thái cũ CONTENT-002/008 và DOC-012 còn ghi nhận chưa nhất quán về acceptance; quyền sửa lần này không tự xác nhận các approval quá khứ.

CONTENT-004 và CONTENT-007 lần lượt giữ `REVIEW` và `BLOCKED`. Historical verdict ngày 2026-09-28 chỉ hoàn tất phạm vi sử liệu/ngôn ngữ; không thay technical QA, media hoặc task-level handoff khi artifact pilot vẫn ghi `NEEDS_HISTORICAL_REVIEW`. CONTENT-014 vẫn REVIEW; CONTENT-006 vẫn IN PROGRESS/REFERENCE_ONLY; M2 kỹ thuật OPEN, M3–M7 LOCKED.
