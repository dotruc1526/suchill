# PR106 — Merge readiness, 2026-10-02

## Decision and scope

Technical candidate is READY FOR REVIEW. User requested preparation so PR106 can be merged. This continuation removes the Draft review barrier after verifying the remaining core username UI path; it does not infer a GitHub/human approval, close M4 or open M5.

Baseline main:c7a5ad5968b95b8d3dc41cab1dfd4dfd48830f88. Reviewed runtime head:5640f29966df5a37c3f289b885d5b668ed4d17b5. This follow-up changes evidence/docs only; source, migrations, dependencies and original tests are unchanged. [PR106](https://github.com/dotruc1526/suchill/pull/106).

| Điều kiện | Bằng chứng / kết quả |
|---|---|
| Main M3 được ưu tiên | Baseline không đổi; conflict được xử lý theo main; các assertion M3 gốc giữ nguyên |
| Review code | Independent Codex technical re-review APPROVED; không có blocker actionable; [review](./REVIEW.md) |
| Quality |314 PASS; hai native-only skip được native PostgreSQL kiểm chứng; runtime CI2/2 SUCCESS trên5640f29 |
| Supabase |029 đã được user cho phép và áp dụng; owner isolation/trusted completion/idempotency native6/6 và hosted5/5 PASS |
| Giao diện learning | Login/mobile375/430/text/reload/fallback/motion/queue recovery PASS |
| Username Auth thật | Đăng ký không email/confirmation, xác nhận lại mật khẩu, Home tức thì, reload, cùng UUID/0XP, signout, sai/đúng mật khẩu, đổi mật khẩu của tài khoản QA và login lại PASS; [log](./username-browser.txt) |
| Dữ liệu user | Tài khoản được giữ không reset/đổi password/progress; account QA mới được xóa đúng UUID sau khi đối chiếu email và username metadata |
| GitHub | Không có CHANGES_REQUESTED hoặc comment chưa xử lý tại lúc kiểm tra; mergeability clean; ruleset yêu cầu PR và không bắt buộc số approval tối thiểu |

Branch-protection endpoint yêu cầu authentication; ruleset inspection và mergeability không được xem là quyền bypass. Không sửa ruleset/protection, tự tạo review APPROVED hoặc dùng admin override. Ready for review chỉ thay đổi trạng thái Draft của chính PR106.

## Gate vẫn cần nghiệm thu riêng

- M4 vẫn OPEN, cards REVIEW cho QA/PO main acceptance. M5 cards BLOCKED; code đã có được giữ như phần chuẩn bị theo authorization nhánh riêng, không nhận task milestone đang khóa.
- Email recovery optional chưa có verified sender/RESEND_API_KEY/ACCOUNT_ACCESS_MAIL_FROM và callback allowlist đầy đủ. Delivery/reset thật chưa được nghiệm thu; service fail closed với thông báo rõ, basic username access hoạt động. AUTH-USERNAME-001 còn REVIEW. Không gửi thư hoặc tự nhập API key giả trong lần kiểm chứng này.
- Historical-key revocation, canonical content/media, physical-device/PWA và production release giữ gate hiện có. Passing technical fixtures không duyệt publish lịch sử/media.

Merge code và đóng milestone là hai quyết định khác nhau. Roadmap Gate M4/M5 và AGENTS yêu cầu evidence/reviewer/PO trước khi mở milestone kế tiếp; không có việc tự mở M5/M6 trong thao tác chuyển PR Ready. Các giới hạn trên phải được người review PR đọc trước khi merge.

## Thứ tự sau khi PR được duyệt merge

1. Merge đúng head đã review khi CI hiện tại đạt; giữ source branch để đối chiếu.
2. Review/verify một lần nữa trên main sau merge: M3 learning regression, configured Supabase/Auth và quyền/reward; sửa rồi review lại nếu có finding. Không chạy lại migration đã áp dụng như một thay đổi mới.
3. QA/PO nghiệm thu và đóng M4 trên task board; chỉ mở M5 khi PO xác nhận gate.
4. Review/accept riêng M5 khi đã mở; M6/M7 chỉ bắt đầu theo gate của từng milestone.

Không thực hiện main merge trong bước chuẩn bị này. Kết quả cuối của thao tác Ready/CI được ghi ở local output/main-first-integration/STATUS.md và github-pr106-ready.json.
