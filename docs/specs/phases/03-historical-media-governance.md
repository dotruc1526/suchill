# Phase 3 — Historical Accuracy & Media Governance

> Status: APPROVED\
> Last updated: 2026-09-22\
> Depends on: Phase 2 — APPROVED\
> Scope: Historical accuracy, media provenance and editorial review

> Product owner nên đọc [Duyệt nhanh Phase 3](../approval-briefs/03-historical-media-brief.md) trước. Full spec này dành cho content, historical reviewer, media reviewer, QA và engineering.

## 1. Mục tiêu

Thiết lập quy trình để mọi fact, quote, hình ảnh, video và fictional perspective trong Sử Chill được phân loại, kiểm chứng, gắn nguồn và review trước khi publish.

## 2. Phạm vi

Bao gồm:

- Historical content policy.
- Source priority và verification workflow.
- Primary/secondary source handling.
- Image/video source, license và attribution.
- Fiction labeling.
- Uncertain/conflicting facts.
- Political/historical sensitivity.
- Editorial review process.
- Source metadata model.
- Media metadata model.
- Review checklist, red flags và release blockers.

Ngoài phạm vi:

- Xác minh toàn bộ nội dung Genève hoặc các chapter cụ thể.
- Database migration/RLS implementation.
- AI retrieval pipeline.
- Legal opinion về license ngoài việc yêu cầu ghi nhận trạng thái sử dụng.

## 3. Phân tích code hiện tại

### 3.1 Current content/media risks

Story demo hiện tại:

- Hotlink ảnh Wikimedia bằng URL.
- Chưa lưu author, source page, license hoặc caption metadata.
- Chưa phân loại fact/explanation/fiction trong schema.
- Dùng nhân vật hư cấu nhưng chưa có label trong data.
- Có claims lịch sử chưa qua review workflow.

### 3.2 Governance gap

Không có hiện tại:

- Source registry.
- Review status.
- Reviewer identity/date.
- Version approval gate.
- Media license status.
- Conflict/uncertainty note.
- Release-blocking checklist.

### 3.3 Reference video candidate

`episode-portrait-final.mp4` là một video dọc 9:16, khoảng 93 giây, đang nằm ngoài repository và được đánh dấu `REFERENCE_ONLY`.

Video có thể đi theo một trong ba hướng sau sau khi được cải thiện:

1. **Video-led lesson:** video là nội dung chính, đi kèm caption, transcript, knowledge check và source card.
2. **Visual Novel artifact:** một đoạn video ngắn hỗ trợ scene; choice/scene vẫn là cấu trúc chính.
3. **External extension/teaser:** xem ngoài learning flow, dùng để giới thiệu chapter hoặc bối cảnh.

Chưa chọn hướng cuối cùng ở Phase 3. Dù chọn hướng nào, video vẫn phải qua source/claim/media review; phong cách đồ họa đẹp không thay thế historical verification.

## 4. Đề xuất thiết kế

### 4.1 Content truth policy

Mọi content published phải thuộc một hoặc nhiều lớp:

| Class | Định nghĩa | Quy tắc |
|---|---|---|
| `verified_fact` | Claim có source/reviewer xác nhận | Không được sửa nghĩa khi paraphrase |
| `educational_explanation` | Cách diễn giải giúp hiểu claim | Không giả thành quote hoặc source nguyên văn |
| `fictional_narrative` | Nhân vật/tình huống được tạo để dẫn chuyện | Label rõ, không dùng làm bằng chứng |
| `composite_perspective` | Nhân vật hư cấu ghép từ hoàn cảnh | Label rõ, không gọi là lời chứng thật |
| `uncertain_or_contested` | Claim còn thiếu đồng thuận hoặc source xung đột | Không publish như fact chắc chắn; cần reviewer wording |

Một đoạn có nhiều class phải tách thành các block có boundary rõ. Không dùng một nhãn chung cho cả scene nếu scene trộn fact và fiction.

### 4.2 Source priority

#### Tier 1 — Primary/archival

- Biên bản, công văn, bản đồ, ảnh gốc, nhật ký, hồi ký bản gốc được xác thực.
- Tài liệu từ kho lưu trữ, thư viện, bảo tàng hoặc cơ quan có trách nhiệm lưu giữ.

#### Tier 2 — Scholarly/curated secondary

- Sách chuyên khảo, bài nghiên cứu, tuyển tập học thuật.
- Nội dung do đại học, bảo tàng hoặc cơ quan văn hóa uy tín biên tập.

#### Tier 3 — Edited educational/journalistic

- Nội dung giáo dục/báo chí có biên tập viên, ngày xuất bản và source rõ.

#### Tier 4 — Discovery-only

- Wikipedia, blog, diễn đàn, mạng xã hội và AI output.
- Chỉ dùng để tìm keyword/source candidate, không dùng làm source cuối cho claim critical.

Historical reviewer có thể chấp nhận Tier 3 cho explanation phổ thông khi Tier 1/2 không cần thiết, nhưng phải ghi reasoning.

### 4.3 Verification workflow

```text
Writer tạo claim/scene
→ Writer ghi source candidate và uncertainty
→ Learning reviewer kiểm tra objective/wording
→ Historical reviewer kiểm tra fact/date/actor/causality
→ Media reviewer kiểm tra provenance/license/caption
→ Writer sửa theo review
→ Technical validator kiểm tra metadata/link/label
→ Editor approve version
→ Publish immutable version
```

Không publish khi:

- Claim critical chưa có reviewer status.
- Direct quote chưa có source.
- Media license/use status chưa rõ.
- Fiction dễ bị hiểu nhầm là fact.
- Reviewer ghi `REJECTED` hoặc `NEEDS_REVISION`.

### 4.4 Source metadata model

Conceptual fields (chưa phải TypeScript schema):

```text
HistoricalSource
├── id
├── title
├── author_or_institution
├── source_type: primary | scholarly | curated_educational | discovery
├── publication_or_creation_date?
├── archive_or_publisher
├── canonical_url_or_catalog_id
├── language
├── relevant_locator: page/section/timestamp?
├── supports_claims[]
├── reliability_note
├── access_date
├── review_status
├── reviewer
└── review_note
```

`canonical_url_or_catalog_id` phải trỏ tới nguồn gốc hoặc catalog ổn định, không chỉ tới image CDN.

### 4.4A Video improvement checklist

Trước khi đưa `episode-portrait-final.mp4` vào sản phẩm, team cần:

- Xác định video đang dạy objective nào.
- Kiểm tra toàn bộ narration, mốc thời gian, bản đồ, label và causal claim.
- Viết caption/transcript riêng, không chỉ dựa vào chữ đã render trong video.
- Tạo poster và mobile-compressed version.
- Ghi source/attribution cho ảnh, map, audio và reference.
- Xác định video là lesson chính, scene artifact hay external extension.
- Tạo fallback khi video không tải được.
- Chạy accessibility/mobile QA.
- Đặt version và review status trước publish.

### 4.5 Claim metadata

Mỗi historical claim nên có:

```text
Claim
├── id
├── text_or_reference
├── truth_class
├── historical_scope: time/place/actor/event
├── source_ids[]
├── confidence: confirmed | qualified | disputed
├── wording_constraint
├── review_status
├── reviewer
└── note
```

Một scene có thể reference nhiều claims; writer không copy source text vào UI nếu không cần.

### 4.6 Media metadata model

```text
MediaAsset
├── id
├── media_type: photo | video | map | document | illustration | audio
├── title/caption
├── creator_or_rightsholder
├── creation_date?
├── depicted_date/place?
├── source_page_or_catalog_id
├── asset_url/storage_key
├── license_or_permission_status
├── attribution_text
├── alt_text
├── transcript_or_caption_ref?
├── fictional_label?
├── fallback_asset_or_text
├── review_status
└── reviewer
```

### 4.7 Fiction labeling rules

Label trước khi người học dựa vào nội dung:

- `MINH HỌA HƯ CẤU`: illustration/situation created for teaching.
- `NHÂN VẬT HƯ CẤU`: named character not historically verified.
- `NHÂN VẬT COMPOSITE`: composite perspective, not a single testimony.
- `DIỄN GIẢI GIÁO DỤC`: explanation, not direct historical quote.
- `FACT ĐÃ ĐƯỢC KIỂM CHỨNG`: claim with review/source status.

Không dùng các từ “thật”, “lời chứng”, “nhật ký” hoặc quote formatting cho fictional content nếu không có căn cứ.

### 4.8 Conflicting/uncertain facts

Khi source mâu thuẫn:

1. Ghi lại các nguồn và điểm mâu thuẫn.
2. Xác định mâu thuẫn là về date, number, actor, causality hay terminology.
3. Historical reviewer quyết định một trong các cách:
   - Dùng claim có qualification.
   - Trình bày hai cách ghi nhận có attribution.
   - Loại claim khỏi episode.
   - Đánh dấu `uncertain_or_contested`.
4. Không để writer tự “làm tròn” thành một fact chắc chắn.

### 4.9 Political/historical sensitivity

Review đặc biệt với:

- Chiến tranh, thương vong, tù binh, di dời và đời sống dân sự.
- Nhân vật/nhóm đang được tranh luận.
- Biên giới, chủ quyền, ethnic/religious identity.
- Quote dễ bị cắt khỏi bối cảnh.
- Nội dung có thể gây quy chụp cho cộng đồng hiện tại.

Rules:

- Không game hóa nỗi đau hoặc dùng “đáp án đạo đức duy nhất”.
- Không biến fictional character thành nhân chứng đại diện cho cả cộng đồng.
- Không dùng reward để khuyến khích lựa chọn chính trị/đạo đức.
- Dùng language precise, contextual và có source.

### 4.10 Editorial review roles

| Role | Trách nhiệm | Có quyền reject |
|---|---|---|
| Writer | Draft, scene/choice, source candidate | Không tự approve final |
| Learning reviewer | Objective, pacing, cognitive load, feedback | Có thể trả về sửa learning |
| Historical reviewer | Fact, chronology, actor, quote, sensitivity | Có thể block publish |
| Media reviewer | Provenance, caption, attribution, license, alt text | Có thể block asset/scene |
| Technical QA | Schema, links, labels, transitions, fallback | Có thể block release |
| Editor/Product owner | Cân scope, approve version | Approve/reject publish |

Một người có thể giữ nhiều role trong nhóm nhỏ, nhưng historical review không nên tự động coi AI output là approval.

### 4.11 Review status

```text
DRAFT
→ NEEDS_LEARNING_REVIEW
→ NEEDS_HISTORICAL_REVIEW
→ NEEDS_MEDIA_REVIEW
→ NEEDS_TECHNICAL_QA
→ APPROVED
→ PUBLISHED
```

Các trạng thái reject/needs revision quay về writer với note bắt buộc. Version `PUBLISHED` không sửa trực tiếp; tạo revision mới.

### 4.12 Approved/rejected scene examples

#### Có thể approve sau review

```text
[NHÂN VẬT HƯ CẤU]
Một người ghi chép hư cấu quan sát bản đồ trong phòng họp.
Fact về thời gian, địa điểm và nội dung bản đồ có source.
Choice hỏi người học nên kiểm tra tài liệu nào trước.
Historical outcome không thay đổi.
```

#### Reject hoặc viết lại

```text
“Đại tướng X nói đúng câu này lúc 10 giờ sáng...”
```

nhưng không có source quote; hoặc dùng người lính hư cấu để quyết định kết quả một trận đánh có thật.

### 4.13 Red flags

- AI-generated claim không có source.
- Một URL ảnh nhưng không có source page/license.
- Caption suy luận nhân vật/ngày tháng mà ảnh không chứng minh.
- Fiction label chỉ xuất hiện sau khi người học đã chọn.
- Direct quote không có page/timestamp/catalog locator.
- “Theo lịch sử” nhưng không có source id.
- Composite witness được viết như hồi ký thật.
- Choice cho người học “thay đổi” historical outcome.
- Exact numbers/dates dùng để làm quiz nhưng chưa review.
- Scene nhạy cảm dùng nhạc/hình gây lãng mạn hóa thương vong.

### 4.14 Review checklist

#### Historical

- [ ] Time/place/actor/event đúng phạm vi.
- [ ] Claim critical có source phù hợp.
- [ ] Chronology không tự mâu thuẫn.
- [ ] Quote/paraphrase được phân biệt.
- [ ] Uncertainty/conflict được ghi rõ.
- [ ] Fiction/composite role được label.
- [ ] Choice không thay đổi outcome.

#### Media

- [ ] Source page/catalog ổn định.
- [ ] Creator/rightsholder ghi rõ nếu biết.
- [ ] License/permission status rõ.
- [ ] Caption không vượt quá bằng chứng ảnh.
- [ ] Alt text và fallback có.
- [ ] Video có caption/transcript.

#### Learning/editorial

- [ ] Scene phục vụ objective.
- [ ] Tone tôn trọng và không sensationalize.
- [ ] Explanation không giả thành fact/source.
- [ ] Feedback không thêm claim chưa review.

#### Technical

- [ ] Status/reviewer/version đầy đủ.
- [ ] Không broken source/media link.
- [ ] Fiction label render đúng.
- [ ] Reject note đã xử lý.

## 5. Data/API/UX impact

### UX

- Labels phải xuất hiện trước khi người học dựa vào perspective.
- Source/attribution dễ tìm nhưng không phá nhịp học.
- Uncertainty cần được diễn đạt rõ, không dùng màu sắc thay cho ý nghĩa.

### Data

- Source/claim/media review metadata trở thành domain data.
- Publish cần version immutable.
- Scene có thể reference nhiều source và media.
- Fiction boundary cần lưu cùng content block/character.

### API/service

- Client chỉ nhận published/reviewed content.
- Editor/reviewer workflow không nên cho public client đọc draft.
- Service cần trả source/attribution data theo policy.

Không tạo table hoặc service trong Phase 3.

## 6. Quyết định cần chốt

| Quyết định | Lý do | UX impact | Data impact | Code impact | Rủi ro |
|---|---|---|---|---|---|
| Claim phải có review/source status | Ngăn bịa/sai fact | Tăng trust | Claim/source metadata | Validation/publish gate | Content production chậm hơn |
| Fiction label bắt buộc trước interaction | Không nhầm thật/hư cấu | Người học hiểu đúng framing | Content class/label | Badge/notice component | Label quá nhiều làm nặng UI |
| Direct quote cần locator | Có thể audit | Quote đáng tin hơn | Page/timestamp/catalog | Review validator | Một số nguồn không có locator tốt |
| Media provenance/license bắt buộc | Bảo vệ lịch sử và pháp lý | Caption/source rõ | Media metadata | Asset review/storage | Thiếu asset phù hợp |
| Conflict không tự resolve | Tránh simplification | Có thể trình bày nuance | Conflict notes | Editorial state | Review cần người có chuyên môn |
| Published version immutable | Reproducible learning/progress | Người học không thấy nội dung đổi ngầm | Version/revision | Migration/version resolver | Tốn storage và quy trình |

## 7. Rủi ro

- Review process quá nặng làm content team không ship được.
- Writer dùng nguồn discovery như nguồn cuối.
- Historical reviewer không thống nhất terminology.
- Media license không rõ sau khi đã dùng trong bundle.
- Labels làm người học mất immersion nếu đặt sai thời điểm.
- AI tạo câu chữ nghe thuyết phục nhưng sai chronology.
- Một nguồn tốt cho claim A không tự động chứng minh claim B.

## 8. Open questions

1. `[OPEN QUESTION]` Ai là historical reviewer chính và reviewer backup?
2. `[OPEN QUESTION]` Team chấp nhận tier nguồn thấp nhất nào cho MVP?
3. `[OPEN QUESTION]` Có cần legal review riêng cho media license không?
4. `[OPEN QUESTION]` Source page/catalog có được phép private không?
5. `[OPEN QUESTION]` Cách hiển thị disputed fact trong UI là tooltip, source card hay debrief?
6. `[OPEN QUESTION]` Có cần lưu snapshot của source page/PDF để bảo đảm reproducibility không?
7. `[OPEN QUESTION]` Fiction label dùng tiếng Việt nào thống nhất trên toàn app?
8. `[OPEN QUESTION]` Khi reviewer bất đồng, ai có quyền quyết định cuối?

## 9. Acceptance criteria

Phase 3 được duyệt khi:

- [ ] Source priority và verification workflow được chấp nhận.
- [ ] Fact/explanation/fiction/uncertain classes có ranh giới rõ.
- [ ] Fiction label rules được chấp nhận.
- [ ] Source và media metadata model đủ để chuyển sang Phase 5/6.
- [ ] Quote, image/video, attribution và fallback rules được chấp nhận.
- [ ] Conflicting fact và sensitive content workflow được chấp nhận.
- [ ] Editorial roles/statuses/release gate rõ.
- [ ] Red flags và review checklist có thể dùng cho pilot.
- [ ] Không có historical claim cụ thể nào được coi là verified chỉ nhờ tài liệu này.
- [ ] Không sửa code hoặc tạo database.

## 10. Deliverables của phase

- Historical content policy.
- Source priority và metadata model.
- Claim classification.
- Image/video metadata model.
- Fiction labeling rules.
- Conflict/uncertainty policy.
- Sensitivity guidelines.
- Editorial workflow và review statuses.
- Approved/rejected examples.
- Red flags.
- Review checklist.

## 11. Những điều chưa làm

- Chưa xác minh episode hoặc claim cụ thể.
- Chưa chọn pilot content.
- Chưa tạo source/media database tables.
- Chưa triển khai RLS/publishing workflow.
- Chưa xây asset storage hoặc caption pipeline.
- Chưa thiết kế UI source card/labels.
- Chưa sửa story code demo.

## Kết luận

- **Những gì đã chắc chắn:** mọi scene publish phải phân biệt fact/explanation/fiction, có source/review status và media provenance; AI không phải historical reviewer.
- **Những gì chỉ là đề xuất:** source tiers, review statuses, role separation và immutable published version.
- **Những gì cần quyết định:** historical reviewer, source tier tối thiểu, license/legal workflow, disputed fact display và label vocabulary.
- **Có thể sang phase tiếp theo hay chưa:** chỉ sau khi Phase 3 được duyệt hoặc các điểm cần điều chỉnh đã được cập nhật.
