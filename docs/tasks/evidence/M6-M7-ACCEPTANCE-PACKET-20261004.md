# M6/M7 — Gói nghiệm thu hiện hành

Ngày: 2026-10-04, Asia/Saigon. Software base: PR125, main f5b6734; bốn GitHub checks SUCCESS. Đây là đầu vào nghiệm thu, không phải biên bản đã duyệt.

## Nội dung cần duyệt

| Đầu ra | Bản hiện hành | Người nhận / tiêu chí |
|---|---|---|
| Bảy bài học | [Kịch bản đầy đủ](../../content/chapter1954/COMPLETE-CANDIDATE.md), candidateLessons.ts + companionCandidates.ts | Thọ điều phối reviewer lịch sử và reviewer học tập; kiểm tra chronology, diễn giải dễ hiểu, đáp án/explanation và reflection không chấm đúng/sai. |
| Nguồn/42 luận điểm | [Worksheet](../../content/chapter1954/HISTORICAL-REVIEW-WORKSHEET.md), SOURCE/CLAIM-REGISTER.json | Reviewer chuyên môn ghi ACCEPT/NEEDS_REVISION/REJECT, tên/ngày/lý do và phiên bản cho từng luận điểm; AI không ký thay. |
| Bốn điểm cần đối chiếu thêm | [Supplement](../../content/chapter1954/SOURCE-GAP-SUPPLEMENT.md) | Hậu cần; 55/56 ngày; diễn biến Hồng Cúm; quan hệ quân sự/ngoại giao. Bản học thử dùng cách diễn đạt hẹp hơn nhưng không tự tạo verdict cho register. |
| Video tập1 đã sửa | [Package v2](../../content/candidate1954-v2/README.md), manifest.json | Trúc/media + reviewer lịch sử nghe/xem toàn bộ95s, nhất là nối cảnh83.45s và cue26–28, đối chiếu phụ đề/transcript.12technicalchecks và full decode PASS. |
| VN tập6 | PreviewLessonSix, lessonSixStory + validated6scene import graph | Phân biệt văn kiện20/21-7, giới tuyến tạm thời, kế hoạch tổng tuyển cử và thực tế triển khai; thư/gia đình là tình huống hư cấu minh họa. Không coi kết thúc VN là reward thực. |
| Gói nhập | [Domain candidate](../../content/chapter1954/CANONICAL-IMPORT-CANDIDATE.json), [công cụ thử nhập](../../../scripts/content/chapter1954/dry-run.mjs) | UUID/foreignkeys/private answers/rollback đã kiểm tra với toàn bộ30migration:3tests PASS. Vinh review evidence và immutable publication; chỉ áp dụng remote sau nghiệm thu. |

PO đã miễn hồ sơ giấy phép theo PO-MEDIA-EXCEPTION-20261004; không yêu cầu lại giấy tờ. Cần giữ provenance thực và kiểm tra trải nghiệm/ngữ nghĩa.

## Thiết bị và khả năng tiếp cận

QA cần ghi thiết bị/OS/browser, build và kết quả thực tế cho desktop icon launch; screen-reader; Android/iOS browser/install; hai bản cập nhật PWA; offline/private cache; video/resume; âm thanh/reduced motion; hiệu năng. Đã có Android cơ bản trên bản cũ và automated browser bằng chứng cho bản hiện hành. Những ô chưa đo được giữ chưa nghiệm thu.

## Điều kiện phát hành

M7-04 sign-off → M7-05 trusted import → M7-06 full candidate QA với M6 đạt → M7-07 canonical HTTPS preview → M7-08 người dùng thật → M7-09 quyết định PO và rollback. Firebase đang được người dùng tạm hoãn do thiếu quyền project của nhóm; không tạo project mới hoặc coi bước Hosting là DONE.

Biên bản reviewer phải chỉ rõ kết quả, version/hash, findings đã xử lý và ai nhận bước tiếp theo. Chưa có chữ ký/quan sát thì không đóng milestone bằng kết quả CI hoặc mở đủ nút bài học.
