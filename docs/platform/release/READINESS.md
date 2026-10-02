# M6–M7: video 1954 có sẵn và chuẩn bị phát hành

Phạm vi: [M6-M7-TRIAL-001](../../tasks/active/M6-M7-TRIAL-001.md), [MVP-1954-001](../../tasks/active/MVP-1954-001.md). Người dùng đã đổi MVP sang 1954; không yêu cầu tạo thêm video/audio. Quyết định chủ đề không tự nghiệm thu lịch sử, media, thiết bị hoặc release. M6 đang mở; PO ghi gate M7 riêng.

| Phần | Có thể dùng lại | Cần kiểm chứng thật |
|---|---|---|
| Video 1954 | MP4 gốc v3 nguyên byte, 93.389s, 1080×1920, H.264/AAC, 24fps; sidecars và locked narration trong preview1954-v1 | CONTENT-006 vẫn chỉ được duyệt REFERENCE_ONLY; wording cue27, nguồn/ảnh/audio/nhạc/SFX và final acceptance chưa đủ để publish |
| Nội dung MVP | Quyết định 1954 mới; clip dẫn nhập có sẵn | Curriculum nhiều lesson, mục tiêu/phạm vi, fact/fiction/source và historical/learning review của bản 1954 |
| Phần mềm | M4/M5 đã đóng; M6-02/03/05 DONE; Hosting/catalog bounded review đạt sau sửa Back | M6-01 desktop icon launch, M6-06 manual accessibility và M6-07 matrix còn thiếu |
| Canonical | Schema/version/RLS và player | Import version bất biến sau approval; không đổi fixture thành nội dung lịch sử |
| Preview | Firebase suchill-preview / m6-android-1954 đã triển khai; technical review APPROVE | Bản sửa cuối cần HTTPS smoke; preview không phải release canonical |
| Release | Người dùng xác nhận các bước Android cơ bản đạt; isolated Hosting rollback PASS | Privacy/contact/retention thực, review nội dung/quyền, manual/device còn lại và PO acceptance |

Mậu Thân/1972 giữ nguyên dữ liệu authoring đã duyệt nhưng không còn là đầu vào bắt buộc của MVP1954. Không áp dụng approval ElevenLabs Free của Mậu Thân cho audio Edge TTS của clip1954. Giữ nguyên clip theo yêu cầu; review final có thể tiếp tục chặn publication khi finding chưa giải quyết.

## Kiểm chứng package tại máy

Từ repository root:

```sh
node scripts/release/validate-media-package.mjs docs/content/preview1954-v1 docs/content/preview1954-v1/locked-narration.json
node --test scripts/release/release-validation.test.mjs
```

Validator yêu cầu narration cụ thể, không tự chọn Mậu Thân. Nó kiểm tra byte hash, rendition metadata thực bằng ffprobe, poster PNG RGB/RGBA8 không interlace với CRC/chunk/IDAT giải nén toàn raster, lời caption/transcript và mốc VTT trong thời lượng video. Encoding PNG khác bị từ chối rõ. Exit0 chỉ là technical preview PASS; MP4 decode/playback và nghe timing thực là checks riêng.

Technical PASS không chứng minh bản narration đã được duyệt lịch sử, giọng đọc/quyền sử dụng, độ chú ý, approval, thiết bị hoặc publication. Package reference-only luôn hiện warning. Missing files/hash/timing lỗi trả exit1. Có thể đặt FFPROBE_PATH cho bản ffprobe đã cài.

## Evidence đủ để review

JSON do người thực hiện cung cấp gồm build.commit (40ký tự SHA), build.version, mediaManifestSha256 và checks. Mỗi check có status passed, reviewer, evidence (đường dẫn/URL), date YYYY-MM-DD, commit và mediaManifestSha256 đúng revision. Không điền passed cho việc chưa quan sát.

Các check: m6_software_review, physical_android, physical_ios, manual_accessibility, historical_learning_review, media_rights_review, canonical_import, quality_security, privacy_contact_retention, firebase_preview, internal_user_testing, rollback, product_owner_release.

```sh
node scripts/release/check-release-readiness.mjs /absolute/path/evidence.json /absolute/path/package/manifest.json
```

Manifest release phải có reviewStatus approved và publicationScope canonical; manifest reference-only/in_review không thể vượt checker dù evidence ghi passed. Công cụ chỉ kiểm tra khai báo/binding được cung cấp, không xác thực danh tính reviewer, tự chạy thiết bị hay deploy. Exit0 là supplied evidence complete, không phải RELEASED. PO/QA đọc evidence và quyết định riêng.

Nguồn gate: [Phase9](../../specs/phases/09-implementation-roadmap.md), [Phase8](../../specs/phases/08-qa-accessibility-release-spec.md). Các mục thiết bị, preview và rollback có biểu mẫu ngắn bên cạnh.

Checkpoint 2026-10-03: người dùng yêu cầu báo cáo ngắn, không hỏi thêm thông tin thiết bị. Giữ đúng kết quả đã quan sát; không tạo hồ sơ dài hoặc ghi PASS cho manual/iOS/chấp thuận chưa có. M6 OPEN; M7 LOCKED.
