# Chuẩn bị Firebase Hosting preview

Project/site suchill-preview và temporary channel m6-android-1954 đã được triển khai, technical Hosting review đạt. Các yêu cầu bên dưới áp dụng cho preview và promotion tiếp theo. Hosting là frontend; Supabase tiếp tục quản lý Auth/database/Storage.

## Đầu vào thực cần có

- Firebase project ID, site ID và người có quyền Hosting. Dùng phiên đăng nhập được phép; không gửi token/API key vào chat/repo.
- Backend môi trường preview/phát hành được chọn; client chỉ URL và publishable key, trusted secret ở backend.
- Origin HTTPS dự kiến cho Auth redirect allowlist/confirmation/recovery; không dùng wildcard rộng để chữa lỗi.
- Privacy owner/contact, dữ liệu thu thập, retention/xóa/export và analytics decision thực. Chưa có quyết định thì giữ draft, không invent số ngày/email/contact.
- Build/commit, media manifest/review và canonical version đã nghiệm thu. Preview chưa tự mở M7/release gate.

## Công việc configuration sau claim

Root giữ hotspot PWA config nếu thêm firebase.json/.firebaserc. Dùng build dist, SPA fallback cho navigation, trả nguyên static files đúng MIME. index.html/manifest/sw.js cần revalidation; hashed assets có cache dài vì URL đổi theo hash. Không cache Auth/private/signed API. Kiểm tra CSP và origin backend thực trước khi áp dụng, tránh chặn video/caption/worker/Auth callback.

Không cài global CLI hay tạo project/billing bằng suy đoán. Sau khi có quyền và configuration reviewed: deploy preview channel của site chính xác theo CLI/documentation Firebase hiện hành, ghi URL/release ID/build.

## Kiểm tra URL preview

- HTTPS, Home/deep-link/reload, manifest/icons/sw.js và content types.
- Sign-in/sign-out, recovery callback đúng origin, progress A không đọc/ghi B.
- Một video thật: poster/caption/transcript/source/credit, dừng/resume và fallback.
- Install/update/offline, private cache exclusion và old-tab assets.
- Privacy/terms/contact phù hợp dữ liệu thực; không publish placeholder.
- Chạy [device matrix](./DEVICE-MATRIX.md) và [internal test](./INTERNAL-TEST.md); ghi issue và review lại.
- Review [rollback](./ROLLBACK.md) trước promotion production. Preview PASS không phải public release approval.

Không lưu URL callback chứa token hoặc credential vào evidence. [Gate](./READINESS.md) phân biệt technical preview, supplied evidence và PO release decision.

## Verified internal preview — 2026-10-03 (supersedes setup status above)

Project/site suchill-preview is provisioned; official CLI authentication completed. Temporary channel m6-android-1954: https://suchill-preview--m6-android-1954-p8pbahbd.web.app/ ; [1954 reference](https://suchill-preview--m6-android-1954-p8pbahbd.web.app/reference), expires2026-10-10 03:08 Asia/Bangkok. Existing Spark plan, no live channel or billing/backend/Auth-domain change. [Exact evidence and limitations](../../engineering/m6-pwa/HOSTING-PREVIEW-20261003.md). Raw Firebase media Range is unsupported here; the preview uses a size/hash-verified page-memory copy for native resume. Android/manual/independent acceptance remains pending. Authentication recovery origin allowlist is not modified or accepted by this preview.

Auth follow-up: account-access previously accepted only local origins. The server setting ACCOUNT_ACCESS_ORIGINS now preserves four local defaults plus the exact temporary preview origin. Backend CORS environment changed; Auth redirect allowlist/email recovery remains separate and unchanged. Live QA login/read and rejected arbitrary origins PASS; user Android username login and basic install/video/offline retest confirmed PASS. Remove the temporary CORS entry upon channel retirement.

Checkpoint mới 2026-10-03: Hosting bounded independent review APPROVE; người dùng xác nhận Android cơ bản đạt. Diễn tập [isolated rollback](./ROLLBACK.md) PASS. Root hoàn tất bản sửa Back/ARIA và nguồn minh họa rồi cập nhật cùng URL. Giữ Supabase Auth recovery allowlist/email callback và manual/full-device/media acceptance riêng; M7 LOCKED.
