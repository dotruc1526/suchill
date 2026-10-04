# Tiếp tục theo milestone — 2026-10-04

M0–M5 CLOSED. M6 OPEN và M7 OPEN song song theo M7-GATE-OPEN-001; không tự đóng M6. Việc mở7tập theo yêu cầu người dùng là mở xem bản nháp, không nghiệm thu bài học hay thay trạng thái milestone. Các bản AI/VN/đề cương local chưa thành canonical content.

Quyết định PO mới nhất2026-10-04: [ngoại lệ media](../tasks/active/PO-MEDIA-EXCEPTION-20261004.md) bỏ yêu cầu hồ sơ giấy phép làm điều kiện chặn công việc; PO chịu trách nhiệm sử dụng. Các dòng cũ nhắc quyền media phải được đọc cùng ngoại lệ này. Việc sửa lời dẫn/caption đúng phiên bản và nghiệm thu lịch sử/thiết bị vẫn cần thực hiện.

| Thứ tự | Card / đầu ra | Còn phải làm | Điều kiện và người nhận |
|---|---|---|---|
| 1 | M6-01, M6-06 — PWA/install/accessibility | Đối chiếu bản hiện hành, khắc phục lỗi nếu có; bổ sung nghiệm thu install/launch, screen-reader/browser zoom thực tế | Codex có thể làm software regression; QA/tester cung cấp nghiệm thu thực tế. Không thay bằng mô phỏng |
| 2 | M7-02 + SOURCE-GAPS-002 — nguồn1954 | Chốt42claim và4source-gap candidates; giải quyết cue27/strategic framing và final historical verdict | Content/historical reviewer do Thọ điều phối; AI chuẩn bị evidence, không ký thay |
| 3 | M6-04 + CONTENT-006 — media | Bản mobile/caption/transcript/poster/fallback có review nội dung và quyền audio/music/SFX | Trúc/media reviewer; video hiện chỉ reference nội bộ. Card BLOCKED không tự nhận triển khai |
| 4 | M7-03 — curriculum/screenplay/media | Bộ bài học đa định dạng có objective/check/debrief, screenplay scene-by-scene, assets theo cảnh và media package | Chỉ claim sau nguồn1954/authoring dependency được accepted. Đề cương và demo Genève không thay screenplay chính thức |
| 5 | M7-04 — historical/learning/media | Review đúng version/hash và sửa findings | Reviewer chuyên môn; không dùng CI làm acceptance nội dung |
| 6 | M7-05 — canonical import | Import version bất biến, completion/reward theo trusted backend | Sau M7-04 và backend prerequisites; không chuyển preview draft thành published bằng cờ available |
| 7 | M6-07, M7-06..09 | Device matrix → full regression/security/content → canonical Hosting preview → internal test → PWA release | Theo dependency từng card; PO nghiệm thu và release/rollback riêng |

M7 đang mở cho việc đủ dependency. M7-03..09 chưa đủ điều kiện chỉ vì đã có task source preparation DONE. Chưa có kết luận final historical/media trong worksheet; thiếu screen-reader/iOS/desktop install/update/performance evidence. Không gộp tất cả thành “xong” bằng việc mở nút.

Các thay đổi local2026-10-04 cần review tích hợp phần mềm: AI dễ đọc, prompt cho người trẻ, các route bản nháp, bài mẫu6 và art minh họa. Giữ nhãn draft/noXP và đề cương gốc; không rollback yêu cầu mở xem7tập của người dùng. Những thay đổi này là candidate UX, không phải nghiệm thu M7-03/M7-04.

Việc triển khai ngay được phép: software regression thuộc M6-06 với M6-05 DONE; cập nhật findings theo bản hiện hành và sửa lỗi có file claim nếu xuất hiện. Sau đó tiếp tục xử lý evidence của gate nguồn/media, không sản xuất thêm câu chuyện canonical khi dependency chưa đạt.

Kết quả2026-10-04: đã chạy isolated production E2E11/11PASS sau sửa bài kiểm tra loading AI bị lỗi vì còn dùng nội dung cũ. M6-06 vẫn REVIEW vì kết quả phần mềm không thay nghiệm thu screen-reader/device thực tế. M7-02 vẫn chờ final historical/media verdict.
