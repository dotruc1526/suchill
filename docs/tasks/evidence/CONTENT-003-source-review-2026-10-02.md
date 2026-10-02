# CONTENT-003 — source/claim review, 2026-10-02

- Owner: Trúc. Executor: Codex hỗ trợ theo yêu cầu triển khai. Reviewer: Trúc historical/media; Vinh technical QA; PO production gate.
- Base: main `c7a5ad5`; branch `codex/truc-content003-source-review`.
- Verdict của lượt hỗ trợ: **READY FOR REVIEW**, 7/7 claim có locator đọc được hỗ trợ wording giới hạn. Đây không phải human approval, quyền ảnh/audio hay quyết định production.
- Phạm vi registry: bảy source IDs, bảy claim IDs Mậu Thân; narration/scene/quiz text và status không đổi. Source 02 là bibliographic candidate chưa đọc được; source 07 bổ sung evidence đọc được cho claim 01.

## 1. Finding và remediation

| Finding | Kết quả |
|---|---|
| Registry có hai bảng SRC-MT68-01..06 với cùng ID nhưng publisher/nội dung khác; claim 02/03 cũng tái gán nghĩa | Loại section MT68 trùng cũ; giữ nghĩa canonical của IDs đang được artifacts tham chiếu. Truy vết bản trước ở main `c7a5ad5` |
| Link bảo tàng/sách cho năm mục tiêu không kiểm tra đọc được | Đã thử link bảo tàng (không truy cập được) và QĐND 763483 (redirect loop, kể cả /amp); không dùng search snippet làm evidence cuối. Thêm SRC-MT68-07 từ bài Nhân Dân đọc đầy đủ, không giả nhận đã đọc sách/institutional Tier 2 |
| Card CONTENT-003 còn nói CONTENT-002 acceptance trống | Card DONE hiện có bốn checkbox tick đủ; blocker ô reviewer cũ đã superseded. Không viết lại approval CONTENT-002 |
| Quyền ảnh và quyền dùng nội dung lịch sử bị lẫn | Chỉ dùng nguồn để kiểm chứng/paraphrase. Media catalog giữ 6 BLOCKED / 2 NEEDS_MEDIA_REVIEW, tất cả optional và bị loại khỏi mandatory route |
| Gate/handoff còn M2 OPEN hoặc M4 LOCKED | Current gate M0–M3 DONE / M4 OPEN / M5–M7 LOCKED; production có gate riêng |
| Hồ sơ yêu cầu file cuối trước production | Phân biệt quyền/source plan trước khi mở task với audio/MP4/poster/sync/hash cuối là đầu ra CONTENT-007 |

## 2. Source access và claim matrix

Các đoạn được đọc bằng web tool ngày 2026-10-02. Không sao chép bài nguồn; dùng paraphrase, locators, URLs. Không chứng nhận dữ liệu ngoài phạm vi wording trong bảng.

| Claim | Locator đọc được | Verdict hỗ trợ / giới hạn |
|---|---|---|
| CLM-MT68-01 | [Nhân Dân 28/01/2008](https://nhandan.vn/dong-bang-song-cuu-long-trong-cuoc-tong-tien-cong-va-noi-day-xuan-mau-than-1968-post485149.html), đoạn Sài Gòn năm mục tiêu, sau đoạn mở đầu; SRC-MT68-07 | SUPPORTED cho đúng danh sách năm mục tiêu. Đề nghị reviewer chấp nhận Tier 3 với phạm vi list-membership; không chứng minh chiếm giữ. ISBN/scan sách SRC02 chưa verified |
| CLM-MT68-02 | [ADST / Wendt](https://adst.org/2013/07/viet-cong-invade-american-embassy-the-1968-tet-offensive/), Endangered Lives và đoạn Wendt thuật lại Harper phân biệt compound/building | SUPPORTED cho phân biệt khuôn viên/tòa nhà; có phần dẫn báo và góc nhìn người tham dự. Không dùng ngày trong phần dẫn, không mở rộng kết luận về tầng dưới/số giờ |
| CLM-MT68-03 | [Nhân Dân 14/02/2013](https://nhandan.vn/dem-mua-xuan-nam-ay-post382619.html), đội hình đến cổng Dinh, bộc phá; lời Võ Thị Minh Nghĩa | SUPPORTED cho bộc phá không nổ và lời nhân chứng về đội. Không suy ra tỷ lệ thương vong |
| CLM-MT68-04 | [VOH 22/08/2023](https://voh.com.vn/du-lich/can-nha-287-70-dia-chi-do-mang-ten-biet-dong-sai-gon-492233.html), phần xây hầm/Đội 5 nhận vũ khí; đối chiếu Nhân Dân 2013 | SUPPORTED vai trò hậu cần và liên hệ Trần Văn Lai. Đề nghị Tier 3 cho VOH ở phạm vi phổ thông, corroborated bởi bài nhân chứng; ảnh/địa chỉ hiện trạng không phải ảnh/tên đường năm 1968 |
| CLM-MT68-05 | [Office of the Historian](https://history.state.gov/milestones/1961-1968/tet), đoạn cuối về public support, bombing above parallel 20, Johnson 31/3 | SUPPORTED diễn giải theo perspective cơ quan Mỹ. Không đơn nhân, không ngừng toàn bộ ném bom ngay tháng 3 |
| CLM-MT68-06 | [FRUS Document 230](https://history.state.gov/historicaldocuments/frus1964-68v06/d230), đoạn đầu và chú thích điện văn Paris | SUPPORTED ngày phiên họp toàn thể đầu tiên 13/5/1968; phân biệt với ký Hiệp định 1973 |
| CLM-MT68-07 | Office of the Historian, mở đầu và phần first phase | SUPPORTED cuối tháng 1 và nhiều đô thị; giữ giới hạn khác thời điểm. Trang retired được ghi rõ |

## 3. Binding tới artifact hiện hành

Hash bytes tại workspace sau sửa registry; artifact content được đối chiếu không đổi với base `c7a5ad5`. Registry là revision mới và cần reviewer xác nhận đúng hash riêng, không mượn sign-off artifact khác.

| File trong docs/content | SHA-256 |
|---|---|
| `HISTORICAL-SOURCES.md` | `330b25268a63076bbbd5b399fe49364f5212a3fc3c4a1851fd9d5d476aa89d83` |
| `PILOT-SCREENPLAY.md` | `24dac5d3d9f49d436c5562c4adf672a54a2890be4958eb40de88eb9c00500604` |
| `PILOT-NARRATION.json` | `b9e7d17f8503796621e6624785628585477dc9e34633e4224e6b484eefc137ed` |
| `PILOT-CAPTIONS.vtt` | `917854f6d74ec0c8454d4c414595ce360067357767dde4c55cf778fe2f672c6d` |
| `LESSON-02-STORY.json` | `9526a7e2e26a56b9c50ff78292046045b41ba67c913983ea5bec8c8f09aea1f1` |
| `MAP-MT68.json` | `63e74bcff81662f7418d2fc6e8870d3af782068241fbd01386da2eb53e1acd5c` |
| `QUIZ-MT68.json` | `44b9eed6fc1c94cbf8b4b662eaeb2580ad55b08994286bba2b86cf1891103912` |

Nguồn 07 là evidence bổ sung ở registry claim 01. Chưa tự thay sourceIds của các JSON đã được review; source-metadata revision khi chuyển authoring/production cần owner/reviewer xác nhận, technical QA và hash riêng. Map `NEEDS_HISTORICAL_REVIEW` giữ nguyên; việc claim có evidence không tự ký metadata artifact map.

## 4. Media/audio plan và production gate

- Mandatory visual đề nghị: typography + schematic nguyên bản, nhãn educational explanation; không optional image/video. Giữ sáu BLOCKED và hai NEEDS_MEDIA_REVIEW trong catalog, không approve quyền từ URL bài báo.
- Audio route đang chờ lựa chọn của Trúc qua câu hỏi trong chat. Có checklist/consent mẫu ở [MEDIA-REVIEW-MT68](../../content/MEDIA-REVIEW-MT68.md); chưa có lựa chọn, signed permission, tài khoản/provider hoặc bản thu được giả định.
- Không nhạc/SFX; không Edge TTS/clip CONTENT-006, không thơ có quyền chưa rõ. Nếu chọn giọng người đọc, phải có người đọc xác nhận script/hash, quyền ghi âm/hậu kỳ/phát hành web/PWA và cách credit; không mặc định voice cloning.
- Preproduction: Trúc xác nhận registry và plan rights/audio, Vinh QA metadata, PO quyết định handoff; CONTENT-007 chỉ được claim sau dependency hợp lệ.
- Production outputs: source design/font/license, audio/MP4/poster/manifest/hash, đo timing/caption sync và device/player QA. Không yêu cầu có MP4 trước khi mở việc tạo MP4.

## 5. Handoff và acceptance pending

- Implemented: registry Mậu Thân thống nhất IDs; locator evidence 7/7 claims; sách chưa đọc được ghi candidate rõ; current gates; quyền/media/audio workflow rõ; không đổi artifact authoring hoặc section 1972.
- Trúc cần xác nhận Tier 3/claim-source scope và lựa chọn audio có quyền trên revision này. Quyền được giao làm task không phải chữ ký acceptance cho kết quả chưa xem.
- Vinh recheck structural metadata/diff; PO quyết định production riêng. CONTENT-003 chỉ chuyển REVIEW sau phần triển khai; không tự chuyển DONE hoặc CONTENT-007 READY.
- Changed files: HISTORICAL-SOURCES.md, MEDIA-REVIEW-MT68.md, PRODUCTION-NOTES.md; CONTENT-003 card, board CONTENT-003/checkpoint, active index, evidence này.
- Environment/migration/dependency/runtime impact: none.
- App typecheck/build không chạy vì docs/source review; checks liên quan được ghi sau khi thực hiện. Audio/files/playback và human verdict chưa được kiểm chứng tự động.

## 6. Verification thực hiện

- `node docs/content/validate-mt68-authoring.mjs`: PASS, 5 map nodes, 7 scenes, 6 complete paths, 5 quiz questions, 9 narration/VTT cues, 110s.
- Independent integrity audit: PASS 7 unique MT68 source rows + 7 unique claim rows; section 1972 byte-identical với base; 10 authoring/catalog inputs byte-identical.
- Local Markdown links trong các file review: PASS; `git diff --check`: PASS.
- Không kiểm chứng recorded audio timing, actual media files, rights signatures, reviewer verdict hoặc runtime bằng các checks này.
