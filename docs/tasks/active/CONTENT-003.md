# CONTENT-003 — Historical source and media review pilot

> Status: REVIEW\
> Review Verdict: **PENDING_REVIEWER_CONFIRMATION** cho registry revision 2026-10-02\
> Date: 2026-10-02\
> Reviewer: Trúc historical/media; Vinh technical QA\
> Reference Report: [source review 2026-10-02](../evidence/CONTENT-003-source-review-2026-10-02.md). Báo cáo cũ bên dưới chỉ để truy vết.

## Assignment hiện hành — 2026-10-02

- Owner: Trúc (Member 2).
- Executor: Codex hỗ trợ Trúc theo yêu cầu triển khai ngày 2026-10-02.
- Reviewer: Trúc historical/media; Vinh technical QA; Product Owner quyết định production gate.
- Status: REVIEW; Started: 2026-10-02 (đã claim IN PROGRESS trước khi sửa).
- Branch: `codex/truc-content003-source-review`; base main `c7a5ad5`.
- Depends on: CONTENT-002 và DOC-004 DONE trên board; acceptance CONTENT-002 đã tick đủ. Handoff cũ còn ghi ô trống sẽ được ghi rõ là superseded.
- Files claimed: `docs/content/HISTORICAL-SOURCES.md`, `MEDIA-REVIEW-MT68.md`, `PRODUCTION-NOTES.md`; card này, `docs/tasks/evidence/CONTENT-003-source-review-2026-10-02.md`, `docs/tasks/active/README.md`, các row CONTENT-003/007 và checkpoint trong `docs/project/TASK-BOARD.md`.
- Next action: Trúc xác nhận registry hash/Tier 3 và chọn audio route có quyền; Vinh recheck metadata/diff; PO quyết định production handoff sau acceptance.
- Out of scope: runtime, chapter 1972, MP4/thu âm production, duyệt quyền ảnh optional, tự mở CONTENT-007 hoặc milestone.

## Acceptance và handoff hiện hành — 2026-10-02

- [x] Source IDs/claim IDs Mậu Thân có một nghĩa duy nhất, locator/tier/perspective và giới hạn wording rõ.
- [x] 7/7 claim có nguồn đọc được hỗ trợ; SRC-MT68-02 chưa đọc trực tiếp được ghi candidate, SRC-MT68-07 bổ sung evidence cho danh sách mục tiêu.
- [x] Phương án bắt buộc chữ/sơ đồ nguyên bản; 6 BLOCKED/2 NEEDS_MEDIA_REVIEW loại khỏi mandatory route; không cấp quyền ảnh/clip optional.
- [x] Checklist quyền audio, consent và ranh giới preproduction/production outputs đã ghi rõ.
- [ ] Trúc xác nhận registry revision/Tier 3 và audio rights route; không ghi chữ ký thay reviewer.
- [ ] Vinh technical QA/reviewer nghiệm thu task; PO production decision riêng.

Verification: authoring validator PASS (5 node, 7 scene, 6 đường đi, 5 quiz, 9 cue 110s); 7 source rows/7 claim rows unique; chapter 1972 byte-identical; 10 authoring/catalog inputs unchanged; local Markdown links PASS; `git diff --check` PASS. Không chạy app build/typecheck vì docs-only, không runtime/env/migration/dependency impact.

Changed files: registry, MEDIA-REVIEW-MT68, PRODUCTION-NOTES, card/evidence CONTENT-003, task board và active index. Known issues: book scan/source 02 chưa truy cập; Tier 3 mới chờ reviewer; audio chưa chọn/thu/consent; map còn pending, sourceIds production revision cần owner/reviewer; chưa có asset final. Không yêu cầu phải có MP4 cuối trước khi mở task dựng MP4. M4 OPEN / M5–M7 LOCKED; CONTENT-007 BLOCKED cho tới dependency/PO decision và claim riêng.

## Lượt review và sửa regression — 2026-09-28 (snapshot cũ)

Các dependency/next action cũ bên dưới được assignment/acceptance 2026-10-02 thay thế; CONTENT-002 hiện DONE với bốn checkbox reviewer đạt. Không dùng ô trống trong handoff cũ làm blocker mới.

- Owner / Executor: Trúc; Codex thực hiện đối chiếu và sửa tài liệu theo yêu cầu.
- Reviewer: Trúc historical/learning/media; Vinh technical QA.
- Status: REVIEW; Started: 2026-09-28; Branch: `codex/content-status-sync`.
- Files claimed: `docs/content/HISTORICAL-SOURCES.md`, `PILOT-SCREENPLAY.md`, `CURRICULUM-MAP.md`; card CONTENT-003/004, task board và `CONTENT-003-004-REVIEW.md` cùng thư mục.
- Scope: review bản authoring, sửa regression của ba tài liệu về bản có source/claim và narration v2; không claim sản xuất CONTENT-007.
- Next action: Trúc bổ sung nguồn đọc được cho CLM-MT68-01, xác nhận historical/learning và nguồn audio; Vinh review kỹ thuật. Xem [báo cáo](./CONTENT-003-004-REVIEW.md).
- Checkpoint: đã sửa regression ba tài liệu, validator PASS; bốn nhóm fact pilot có nguồn hỗ trợ, nhóm năm mục tiêu chưa đọc lại được URL. Verdict vẫn NEEDS_REVISION.
- Blocker: CONTENT-002 còn ô reviewer chưa xác nhận; historical/media sign-off và audio chưa có evidence. Chỉ review/sửa bản nháp hiện hữu.

### Checkpoint cập nhật trạng thái — 2026-10-02

- Historical/language review được ghi nhận riêng cho artifact screenplay/narration trong CONTENT-004 tại revision khớp verdict 2026-09-28 (chi tiết/hash ở [CONTENT-014](./CONTENT-014.md)). Điều này không tự phê duyệt toàn bộ CONTENT-003, source registry, quyền media, audio hay production.
- Task CONTENT-003 vẫn `REVIEW`; các ghi chú cũ rằng chính pilot screenplay còn `NEEDS_HISTORICAL_REVIEW` đã được thay bằng checkpoint hash-bound. Giữ các source/claim chưa có locator và các media/rightsholder pending ở trạng thái tương ứng.
- Gate hiện hành: M3 OPEN / M4 LOCKED; content production có gate riêng. Next: hoàn tất source/media evidence và handoff review trước mọi production.

### Assignment trước lượt review

- Owner: Trúc (historical/media review theo quyền Thọ giao ngày 2026-09-27).
- Executor: Trúc (sửa hồ sơ PR #21 theo quyền Thọ cấp), Codex hỗ trợ.
- Reviewer: Trúc phụ trách historical/learning/media; Vinh technical QA. Codex không thay sign-off.
- Started: 2026-09-27 (revision); Branch: `codex/mt68-complete-handoff`.
- Depends on: CONTENT-002 (board ghi DONE; card còn ô reviewer chưa xác nhận), DOC-004 (DONE).
- Files claimed: registry/catalog, card này, board và [handoff](./PR21-HANDOFF.md).
- Next action: reviewer kiểm tra Bài 2–4/quiz đã sửa, hoàn tất pilot và quyền từng asset.
- Blocker: bản authoring pilot/scene đã sửa theo CONTENT-014; chờ Trúc xác nhận nội dung và bằng chứng audio/media cuối. Không mở CONTENT-007.
- Acceptance: nguồn/claim truy vết được; fact/fiction và quyền media được xác nhận; verdict có người ký. Hiện chưa đủ.
- Checkpoint: bản sửa bổ sung registry; trạng thái REVIEW không đồng nghĩa verdict APPROVED.
- Lịch sử 2026-09-23: card ban đầu BLOCKED chờ chọn chapter và reviewer; hợp nhất card trùng từ thư mục blocked.
- Kiểm tra/build/env: xem handoff; chỉ tài liệu, không migration.

## Báo cáo cũ — lưu để truy vết, không phải phê duyệt

Các nhận định dưới đây là nội dung review cũ chưa được xác nhận toàn bộ. Đặc biệt đề xuất pháp lý về blur/16+, ưu tiên độc tôn nguồn, quan hệ lịch âm và lời tuyên bố “đã phê duyệt” không phải quyết định APPROVED của nhóm. Bản sửa hiện hành và Phase 3/8 là căn cứ cho bước tiếp theo.

---

## 1. Assignment

- **Phase / milestone:** MVP Content Track; Thẩm định Sử liệu & Kịch bản Pilot
- **Workstream:** Historical & Educational Media Review
- **Target Documents Reviewed:**
  - `docs/content/PILOT-SCREENPLAY.md` (Segment 1: pilot_screenplay)
  - `docs/content/HISTORICAL-SOURCES.md` (Segment 2: sources_and_research)
  - `docs/content/RESEARCH-CANDIDATES.md` (Segment 2: sources_and_research)
  - `docs/content/CURRICULUM-MAP.md` (Segment 3: curriculum_map)
- **Accountable Reviewer:** Historical Reviewer (teamwork_preview_document_1)
- **Review Architecture:** Recursive Self-Aggregation (RSA) Tournament Tree (3 Segment Group Orchestrators [4, 2, 1] + Synthesis RSA Group Orchestrator [4, 1] Root Reducer).

---

## 2. Executive Summary & Review Verdict

### Kết quả thẩm định: **NEEDS_REVISION** (Yêu cầu hiệu chỉnh bắt buộc)

Toàn bộ gói tài liệu thể hiện xuất sắc lập trường tư tưởng chính trị cách mạng Việt Nam, tuân thủ nghiêm ngặt quy chuẩn R3 (*"Kháng chiến chống Mỹ cứu nước"*, *"Đế quốc Mỹ"*, *"Biệt động Sài Gòn — Gia Định"*), loại bỏ triệt để quan điểm phiến diện hoặc thuật ngữ sai lệch của phương Tây. Nội dung tái hiện hào hùng và trung thực các trụ cột lịch sử: Hầm vũ khí 287/70 Trần Quý Cáp, Tiệm phở Bình, Thơ chúc Tết Bác Hồ 1968, 5 mục tiêu thọc sâu nội đô Sài Gòn, thế trận lòng dân và bước ngoặt đàm phán Paris.

Tuy nhiên, hội đồng thẩm định ghi nhận **04 lỗi lịch sử & kỹ thuật cấp độ Nghiêm trọng (Critical)** cùng **15 khuyến nghị Trọng yếu (Major)** cần phải được khắc phục dứt điểm trước khi bàn giao sang khâu sản xuất video (Member 2 — Trúc) và triển khai Frontend/Database (Member 4 — Dương):

---

## 3. Các Lỗi Lịch sử và Kỹ thuật Nghiêm trọng (Critical Deficiencies)

1. **Sai lệch địa giới hành chính và gán sai hướng xuất kích của Biệt động tại Hầm 287/70 (`HISTORICAL-SOURCES.md` Mục 2, dòng 23):**
   - *Thực tế lịch sử:* Căn hầm tại số 287/70 đường Trần Quý Cáp (nay đổi tên thành **đường Võ Văn Tần**, không phải đường Nguyễn Đình Chiểu) do Anh hùng Trần Văn Lai cùng vợ đào ngụy trang là căn cứ xuất phát và cung cấp vũ khí cho **Đội 5 Biệt động tiến công Dinh Độc Lập** (do đồng chí Ba Thanh chỉ huy). Đội 11 (do Ba Đen chỉ huy) đánh Tòa Đại sứ Mỹ xuất phát từ trạm cơ sở khác.
   - *Yêu cầu sửa đổi:* Đính chính dòng 23 `HISTORICAL-SOURCES.md` thành đường Võ Văn Tần và là nơi xuất phát của Đội 5 đánh Dinh Độc Lập; đồng bộ dòng 137 của `CURRICULUM-MAP.md`.

2. **Xung đột danh mục 5 mục tiêu đầu não trọng yếu (`HISTORICAL-SOURCES.md` Mục 2, dòng 18):**
   - *Thực tế lịch sử:* 5 mục tiêu thọc sâu trung tâm nội đô của Biệt động Sài Gòn là: *(1) Tòa Đại sứ Mỹ, (2) Dinh Độc Lập, (3) Đài Phát thanh Sài Gòn, (4) Bộ Tổng Tham mưu, và (5) **Bộ Tư lệnh Hải quân***. Căn cứ Biệt khu Thủ đô là mục tiêu đánh chiếm của các tiểu đoàn bộ binh mũi nhọn (Tiểu đoàn 6 Bình Tân) ở vùng ven Tây Nam, không thuộc 5 mũi cảm tử nội đô của Biệt động.
   - *Yêu cầu sửa đổi:* Thay thế cụm từ "Biệt khu Thủ đô" bằng "Bộ Tư lệnh Hải quân" tại dòng 18 `HISTORICAL-SOURCES.md`.

3. **Quá tải nhịp độ Voiceover gây rủi ro vỡ timeline video 110 giây (`PILOT-SCREENPLAY.md` Scene 03 & 05):**
   - *Hiện trạng:* Scene 05 nhồi 53 từ trong 10 giây (tốc độ >300–318 từ/phút); Scene 03 nhồi 60 từ dẫn trong 16 giây (>225 từ/phút), vượt quá giới hạn phát âm chuẩn (~135–140 từ/phút) của phát thanh viên và Microsoft Azure TTS.
   - *Yêu cầu sửa đổi:* Rút gọn lời thoại Scene 05 xuống còn 23 từ (*"Đòn tập kích làm sụp đổ ảo tưởng của đối phương, buộc Mỹ phải xuống thang và ngồi vào bàn đàm phán Paris!"*), chuyển lời hiệu triệu sang nút bấm UI; phân định rõ 9 giây im lặng của voiceover trong Scene 03 nhường sóng trọn vẹn cho bản ghi âm thơ Bác Hồ.

4. **Sai lệch niên biểu thiên văn lịch pháp & ngôn ngữ học ("31 tháng Giêng năm 1968" trong `PILOT-SCREENPLAY.md`):**
   - *Thực tế:* Tháng Giêng âm lịch chỉ có tối đa 29 hoặc 30 ngày, hoàn toàn không có ngày "31 tháng Giêng".
   - *Yêu cầu sửa đổi:* Sửa toàn bộ kịch bản Voiceover, Transcript và WebVTT thành danh xưng chuẩn: **"ngày 31 tháng 1 năm 1968"** (Dương lịch) hoặc **"rạng sáng Mùng 2 Tết Mậu Thân — ngày 31 tháng 1 năm 1968"**.

---

## 4. Các Vấn đề Trọng yếu Cần Hoàn thiện (Major Recommendations)

1. **Kỷ luật Cổng Chất lượng (Quality Gate):** Hạ trạng thái phê duyệt sớm của `PILOT-SCREENPLAY.md` (`APPROVED / READY_FOR_PRODUCTION`), `HISTORICAL-SOURCES.md` (`Verified`), và `CURRICULUM-MAP.md` (`APPROVED / PUBLISHED`, `status: "published"`) về `IN_REVIEW` cho đến khi hoàn tất bản vá revision.
2. **Hiện vật Nắp hầm 287/70 Trần Quý Cáp (`PILOT-SCREENPLAY.md` Scene 02):** Sửa mô tả 3D "sàn gỗ mở ra" và SFX "ván sàn gỗ kẽo kẹt" thành nền gạch bông xi măng cổ điển và nắp hầm 4 viên gạch bông khung thép gioăng cao su ngầm mở êm ru bằng giác hút chân không.
3. **Mốc thời gian nổ súng Tòa Đại sứ Mỹ (`PILOT-SCREENPLAY.md` Scene 04):** Bộc phá phá thủng tường rào Tòa Đại sứ phát nổ vào khoảng 02h45–02h47 sáng ngày 31/1/1968 (không phải 02h05).
4. **Chuẩn hóa Phụ đề WebVTT (`PILOT-SCREENPLAY.md` Mục 4):** Đồng bộ định dạng timestamp `00:mm:ss.ttt` từ giây 70 trở đi và bổ sung cue phụ đề Call-To-Action điều hướng cuối video.
5. **Tuân thủ Thuật ngữ R3 trong Voiceover (`PILOT-SCREENPLAY.md`):** Bổ sung cụm từ định danh "Kháng chiến chống Mỹ cứu nước" và "Đế quốc Mỹ" vào văn bản lời thoại phát thanh viên.
6. **Chiến lược Bản quyền Media Quốc tế 4 Tầng (`HISTORICAL-SOURCES.md` & `RESEARCH-CANDIDATES.md`):** Bác bỏ ngộ nhận Educational Fair-Use đối với việc tải và lưu trữ video thương mại AP Archive / British Pathé. Chuyển sang khai thác tư liệu Public Domain (NARA, LOC), hợp tác bản quyền VTV/TTXVN, nhúng Deep-Linking qua YouTube IFrame API và ứng dụng Motion Graphics.
7. **Gắn nhãn Góc nhìn & Bộ lọc Nhạy cảm:** Gán metadata `perspective: western_archive` cho tư liệu nước ngoài; áp dụng bộ lọc mờ (Blur 15px) kèm cảnh báo `[16+ Sensitive Historic Photo]` cho ảnh chiến trường theo Luật Trẻ em 2016.
8. **Đính chính Cơ quan Quản lý Bảo tàng Biệt động Sài Gòn:** Bảo tàng Biệt động Sài Gòn — Gia Định là bảo tàng ngoài công lập do Sở Văn hóa và Thể thao TP.HCM cấp phép hoạt động (Cục Di sản văn hóa quản lý hồ sơ di tích quốc gia).
9. **Số liệu Thương vong (Casualty Figures):** Thiết lập nguyên tắc độc tôn số liệu Sách giáo khoa Lịch sử và Viện Lịch sử Quân sự Việt Nam làm chuẩn mực (Canonical Standard); bóc trần bản chất ngụy tạo của chỉ số "Body Count" của MACV; hướng trọng tâm sư phạm vào bước ngoặt chính trị tối cao tại Hội nghị Paris.
10. **Pre-instruction Grounding cho Câu hỏi Khảo thí số 4 (`CURRICULUM-MAP.md`):** Bổ sung chỉ dẫn sư phạm trong Lesson 1 Recap hoặc Lesson 2 về cơ chế điểm Sóc lịch âm vượt ranh giới nửa đêm giữa múi giờ GMT+7 và GMT+8 làm hai miền đón Tết lệch nhau 24 giờ.
11. **Chuẩn hóa Technical Schema IDs (`CURRICULUM-MAP.md` Mục 3.5):** Bổ sung mã `id: "q-mt68-01"` đến `"q-mt68-05"`, `options`, `correctOptionId`, và `sourceIds` cho ngân hàng câu hỏi Quiz.

---

## 5. Action Items & Next Steps

| Thành viên / Bộ phận | Nhiệm vụ Hiệu chỉnh (Action Item) | Trạng thái |
|---|---|---|
| **Thọ (Member 1 — Content Lead)** | Hiệu chỉnh 4 lỗi Critical và các điểm Major trong `PILOT-SCREENPLAY.md`, `HISTORICAL-SOURCES.md`, `RESEARCH-CANDIDATES.md`, `CURRICULUM-MAP.md`. | PENDING_REVISION |
| **Trúc (Member 2 — Media Lead)** | Cập nhật kịch bản dựng video, timing voiceover 110s, nắp hầm gạch bông, và WebVTT cue. Giữ task `CONTENT-007` ở trạng thái BLOCKED cho đến khi Member 1 hoàn tất bản vá. | BLOCKED |
| **Dương (Member 4 — Frontend Lead)** | Tích hợp Schema IDs chuẩn cho Quiz và Video-led Player component theo khế ước dữ liệu đã hiệu chỉnh. | BLOCKED_BY_CONTENT_AND_MILESTONE |
| **Vinh (Member 5 — QA Lead)** | Đối soát lại toàn bộ checklist sau khi Member 1 phát hành bản cập nhật. | PENDING_QA |

---
*Báo cáo cũ chưa là sign-off; xem assignment và blocker hiện hành ở đầu card.*
