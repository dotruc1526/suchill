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

Snapshot hash sau lượt sửa ban đầu tại `773b6e6`, đối chiếu base `c7a5ad5`; không phải hash hiện hành sau hợp nhất main. Registry hiện hành cần reviewer xác nhận theo hash mới tại mục 6; không mượn sign-off artifact khác.

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
- Trúc đã chọn ElevenLabs, Hoa - Smooth, Gentle and Poetic (người Việt Nam theo mô tả Trúc), Eleven v4, Vietnamese ngày 2026-10-02. [Media plan](../../content/MEDIA-REVIEW-MT68.md) ghi cấu hình; voice ID/link profile, gói tài khoản, evidence quyền sử dụng và file/hash vẫn pending.
- Không nhạc/SFX; không Edge TTS/clip CONTENT-006, không thơ có quyền chưa rõ. Nếu chọn giọng người đọc, phải có người đọc xác nhận script/hash, quyền ghi âm/hậu kỳ/phát hành web/PWA và cách credit; không mặc định voice cloning.
- Preproduction: Trúc xác nhận registry và plan rights/audio, Vinh QA metadata, PO quyết định handoff; CONTENT-007 chỉ được claim sau dependency hợp lệ.
- Production outputs: source design/font/license, audio/MP4/poster/manifest/hash, đo timing/caption sync và device/player QA. Không yêu cầu có MP4 trước khi mở việc tạo MP4.

## 5. Handoff và acceptance pending

- Implemented: registry Mậu Thân thống nhất IDs; locator evidence 7/7 claims; sách chưa đọc được ghi candidate rõ; current gates; quyền/media/audio workflow rõ; không đổi artifact authoring hoặc section 1972.
- Trúc cần xác nhận Tier 3/claim-source scope và evidence quyền audio cho cấu hình đã chọn trên revision này. Quyền được giao làm task không phải chữ ký acceptance cho kết quả chưa xem.
- Vinh recheck structural metadata/diff; PO quyết định production riêng. CONTENT-003 chỉ chuyển REVIEW sau phần triển khai; không tự chuyển DONE hoặc CONTENT-007 READY.
- Changed files: HISTORICAL-SOURCES.md, MEDIA-REVIEW-MT68.md, PRODUCTION-NOTES.md; CONTENT-003 card, board CONTENT-003/checkpoint, active index, evidence này.
- Environment/migration/dependency/runtime impact: none.
- App typecheck/build không chạy vì docs/source review; checks liên quan được ghi sau khi thực hiện. Audio/files/playback và human verdict chưa được kiểm chứng tự động.

## 6. Verification thực hiện

- `node docs/content/validate-mt68-authoring.mjs`: PASS, 5 map nodes, 7 scenes, 6 complete paths, 5 quiz questions, 9 narration/VTT cues, 110s.
- Independent integrity audit: PASS 7 unique MT68 source rows + 7 unique claim rows; section 1972 byte-identical với base; 10 authoring/catalog inputs byte-identical.
- Local Markdown links trong các file review: PASS; `git diff --check`: PASS.
- Không kiểm chứng recorded audio timing, actual media files, rights signatures, reviewer verdict hoặc runtime bằng các checks này.

## 6. Cập nhật branch sau main và lựa chọn voice

- Hợp nhất main `818e24d`; giải quyết xung đột registry bằng cách giữ phần reconciliation Mậu Thân, giữ nguyên section 1972 của main hiện hành. Không sửa authored narration/story/quiz/map. Evidence không thay human verdict.
- Đồng bộ cấu hình voice Trúc đã chọn trong media plan, production notes, card, board và index. Quyền sử dụng/file audio vẫn pending.
- Kiểm tra diff whitespace đạt; không chạy lại test/build ứng dụng cho thay đổi tài liệu.
- Registry SHA-256 hiện hành sau hợp nhất main: `369205fcbd713a74acaa0149e6c21d2c3734260d4265e7b8f87edd5868e3bba5`. Hash cũ ở mục 3 chỉ là snapshot lượt sửa ban đầu.

## 8. Kết luận đề nghị để Trúc xác nhận — theo yêu cầu xử lý review

Ngày đối chiếu: 2026-10-02; PR #111 head trước lượt này `cd9f998`; registry không sửa, SHA-256 `369205fcbd713a74acaa0149e6c21d2c3734260d4265e7b8f87edd5868e3bba5`.

**Source verdict đề nghị: ACCEPT trong phạm vi dưới đây; human confirmation PENDING.** Yêu cầu “xử lý” là yêu cầu làm review, chưa là chữ ký chấp nhận kết luận cụ thể này.

- SRC-MT68-07 / CLM-MT68-01: đọc lại bài Nhân Dân 28/01/2008, đoạn bắt đầu “...Ngay từ ngày” xác nhận đủ năm mục tiêu. Chấp nhận đề nghị Tier 3 chỉ cho danh sách; không mở rộng sang giờ, ngày, số liệu hoặc việc chiếm giữ. Reasoning: bài báo có nhà xuất bản/ngày/locator, phạm vi hẹp; không nâng thành nguồn archival hay xác nhận sách SRC-MT68-02.
- SRC-MT68-05 / CLM-MT68-04: VOH 22/08/2023, các đoạn về Trần Văn Lai mua nhà/đào hầm và Đội 5 tập trung nhận vũ khí, đối chiếu Nhân Dân 14/02/2013 phần đội Biệt động 5 tại hầm Năm Lai. Chấp nhận đề nghị Tier 3 cho giải thích hậu cần phổ thông, không dùng ảnh hiện trạng làm ảnh năm 1968, không thêm thông số vũ khí/vật liệu/niên biểu chưa review.
- Giữ SRC-MT68-02 candidate; nguồn retired/perspective/chronology qualification giữ nguyên. Không thay sourceIds hoặc suy thành verdict cho map, quiz, screenplay hay package khác.
- Hai bài báo hỗ trợ fact không cấp quyền dùng ảnh/audio. Mandatory visual vẫn chữ/sơ đồ nguyên bản, không nhạc/SFX/optional media.

**Audio verdict: PENDING_ACCOUNT_AND_VOICE_EVIDENCE.** Cấu hình Trúc đã chọn được giữ; không suy rights approval từ tên provider.

Đọc [chính sách publish ElevenLabs](https://help.elevenlabs.io/hc/en-us/articles/13313564601361-Can-I-publish-the-content-I-generate-on-the-platform) ngày 2026-10-02: Free không có commercial license; paid plans có commercial license cho eligible content, ngoại trừ Beta Services và vẫn phụ thuộc quyền sở hữu trí tuệ/điều khoản. Output Free không được coi là có quyền thương mại chỉ vì nâng gói sau đó. Chưa biết gói của Trúc hoặc trạng thái dịch vụ thực dùng, nên chưa kết luận quyền cho audio Sử Chill.

Evidence cần bổ sung trước audio rights sign-off: voice ID/link profile Hoa; tên gói/account evidence tại thời điểm generation; model/service có thuộc Beta hay không và điều khoản áp dụng; mục đích/phạm vi web/PWA; ngày generation. File/hash/timing/caption QA là đầu ra production về sau, không dùng việc chưa có MP4 làm blocker để mở task tạo MP4.

Sau human source confirmation và đủ audio plan evidence: Vinh recheck, PO quyết định production handoff riêng. Task REVIEW, CONTENT-007 BLOCKED. Không env/migration/runtime impact; diff whitespace check cho các tài liệu đã sửa.

### Phản hồi Trúc về audio — 2026-10-02

Trúc cung cấp voice ID `5g2DMFQF8xR0KmnuNr4U`, gói **Free**, model **Eleven v4**. Provider/label/language vẫn ElevenLabs / Hoa - Smooth, Gentle and Poetic / Vietnamese. Identity là thông tin user-provided; chưa đối chiếu profile trong tài khoản.

Audio verdict cập nhật: **BLOCKED_FOR_COMMERCIAL_USE**, do Free không có commercial license theo chính sách chính thức nêu trên. Voice ID/gói không còn là thông tin thiếu; không coi phản hồi này là xác nhận quyền thương mại hoặc source verdict. Audio chưa được tạo. Với nhánh phát hành thương mại: chọn gói có quyền phù hợp, tạo audio mới khi gói có hiệu lực, kiểm tra service/model không thuộc Beta và lưu evidence. Với nhánh phi thương mại: phải xác định phạm vi và attribution theo điều khoản, không tự cho phép tích hợp production.

### Xác nhận source scope của Trúc — 2026-10-02

Trúc trả lời câu hỏi review trên chat: **“ACCEPT phạm vi nguồn nêu trên”**. Verdict **ACCEPTED_BY_TRÚC** bound registry SHA-256 `369205fcbd713a74acaa0149e6c21d2c3734260d4265e7b8f87edd5868e3bba5`: SRC-MT68-07 Tier 3 chỉ xác nhận danh sách năm mục tiêu; SRC-MT68-05 Tier 3 đối chiếu SRC-MT68-04 chỉ xác nhận vai trò hậu cần căn hầm; SRC-MT68-02 candidate. Supersede trạng thái source human confirmation pending tại các snapshot trước; không sửa registry, không suy rộng thành media/audio/production acceptance. Audio Free vẫn BLOCKED_FOR_COMMERCIAL_USE; Vinh QA và PO handoff còn riêng.


## 7. Vinh technical recheck — 2026-10-02

Reviewed PR111 head `cd9f998`, base `818e24d`; technical verdict **ACCEPTED (structural metadata/diff only)**. Registry current SHA-256 `369205fcbd713a74acaa0149e6c21d2c3734260d4265e7b8f87edd5868e3bba5` matches mục 6. Seven source rows and seven claim rows have unique IDs. Source 02 remains a candidate, source 07 is supplemental evidence; no published metadata/JSON source IDs were silently replaced.

Independent verification:

- 1972 source/claim tables unchanged against base; eight inputs byte-identical: PILOT-SCREENPLAY.md, PILOT-NARRATION.json, PILOT-CAPTIONS.vtt, LESSON-02-STORY.json, MAP-MT68.json, QUIZ-MT68.json, DETAILED-MEDIA-CATALOG.csv, CURRICULUM-MAP.md.
- Four validators PASS: validate-mt68-authoring.mjs, validate-1972-authoring.mjs, validate-1972-lesson03.mjs, validate-1972-quiz.mjs. These establish structure/reference invariants, not historical/legal approval.
- 203 local Markdown paths resolve in the seven originally changed docs; diff whitespace PASS. Original PR diff is seven docs, no runtime/env/migration changes.
- check-task-docs.mjs does not pass globally: M4-M5-INTEGRATION-001 board/card mismatch also reproduces in main workspace. CONTENT-003 changes do not resolve that separate issue.
- Official [ElevenLabs models documentation](https://elevenlabs.io/docs/overview/models) rechecked: eleven_v4 and Vietnamese are listed. This does not verify the Hoa profile, account entitlement or output rights.

Corrections: separate completed technical QA from pending Trúc historical/media acceptance and PO production decision; replace current CONTENT-003 production-plan gate wording with approved DOC-020/021 (M4/M5 CLOSED, M6 OPEN). Historical gate notes remain snapshots. No historical source or content wording altered. Parent remains REVIEW; CONTENT-007 remains BLOCKED.

Handoff updated after concurrent source record 00c8d92: Trúc source acceptance is recorded for the same registry hash; voice ID and Free plan are recorded. Audio rights suitable for release remain pending with Trúc, as explicitly directed by the user. PO decides production only after acceptance. Audio files/timing/MP4 are future production outputs, not evidence already obtained. Runtime suite skipped because this is documentation-only; no env/migration impact.
