# Phase 2 — Content & Story Authoring Model

> Status: APPROVED\
> Last updated: 2026-09-21\
> Depends on: Phase 1 — APPROVED\
> Scope: Content semantics and authoring workflow only

> Product owner nên đọc [Duyệt nhanh Phase 2](../approval-briefs/02-content-authoring-brief.md) trước. Full spec này dành cho content, learning, historical review và engineering.

## 1. Mục tiêu

Chuẩn hóa cách một ý tưởng lịch sử được chuyển thành screenplay gồm các scene có mục đích học tập rõ ràng, để writer, reviewer, frontend và backend dùng cùng một vocabulary.

Phase này xác định content semantics và writing contract, chưa khóa TypeScript fields hoặc database schema.

## 2. Phạm vi

Bao gồm:

- Quan hệ Chapter, Lesson, Story, Episode và Scene.
- Narration, historical context, character và media cue.
- Narrative, reflection, branching và knowledge-check choices.
- Response, feedback, summary và reward cue.
- Story/scene templates.
- Choice, dialogue và pacing rules.
- AI-assisted authoring workflow.
- Ví dụ outline Genève 1954.
- Content-writer checklist.

Ngoài phạm vi:

- Xác minh fact/source cụ thể.
- Media licensing policy chi tiết.
- Player state machine.
- TypeScript/JSON schema chính xác.
- Database tables và publishing backend.
- XP amount hoặc analytics payload.

## 3. Phân tích code hiện tại

### 3.1 Schema đang có

Current story chỉ có:

```text
Story: id, title, scenes
Scene: id, title, text, emotion, backdrop, image?, choices?
Choice: label, response, correct?, note?
```

Schema này đủ cho demo tuyến tính nhưng chưa thể biểu đạt rõ:

- Learning objective.
- Scene purpose/type.
- Fact/explanation/fiction classification.
- Historical và fictional characters.
- Choice type.
- Branch destination.
- Required/optional content.
- Summary/debrief.
- Sources và media attribution.
- Episode version/review status.

### 3.2 Nội dung Genève hiện tại — technical demo, không canonical

Story hiện có narrative choices và knowledge checks, nhưng player suy luận loại choice từ việc có `correct` hay không. Nhân vật “Minh” và tình huống lá thư mang tính hư cấu nhưng chưa có metadata/nhãn. Historical claims và ảnh mới có text/URL, chưa có source contract.

Đây là demo rút gọn để kiểm tra player, không phải bản tóm tắt đầy đủ về vĩ tuyến 17 hoặc Hiệp định Genève. Không được dùng nó làm chuẩn độ sâu bối cảnh, content benchmark hoặc migration target. Nếu cần pilot Genève, content team phải nghiên cứu và biên kịch lại; cũng có thể chọn một sự kiện khác phù hợp hơn.

### 3.3 Authoring risk hiện tại

Writer phải hiểu code để thêm story. Không có screenplay template, objective mapping, branch validation, content classification hoặc review checklist. Điều này làm tăng nguy cơ:

- Scene hấp dẫn nhưng không phục vụ mục tiêu học.
- Hư cấu bị hiểu là fact.
- Choice bị gắn đúng/sai không phù hợp.
- Branch bị đứt hoặc không quay lại.
- Câu thoại lịch sử bị tưởng là trích dẫn thật.

## 4. Đề xuất thiết kế

### 4.1 Content hierarchy

```text
Chapter
└── Lesson
    ├── Standard lesson
    ├── Video-led lesson
    ├── Visual Novel lesson → Episode
    └── Quiz

Story
└── Một hoặc nhiều Episode trong cùng narrative arc (future-ready)

Episode
└── Ordered/linked Scenes
```

Định nghĩa:

- **Chapter:** một giai đoạn hoặc milestone trong learning journey.
- **Lesson:** đơn vị học xuất hiện trên chapter path; có một format chính.
- **Story:** identity/narrative collection có thể gom nhiều episode trong tương lai.
- **Episode:** session Visual Novel 6–10 phút; đơn vị resume, completion và reward.
- **Scene:** đơn vị trình bày/tương tác nhỏ nhất có mục đích rõ.

MVP dùng mapping một Visual Novel lesson → một episode. Story có thể tạm thời chứa một episode nhưng khái niệm được giữ để hỗ trợ narrative arc tương lai.

### 4.2 Episode content model

Một episode screenplay cần:

- Working title và published title.
- Chapter/lesson placement.
- One-sentence learning promise.
- Estimated duration.
- 1–3 learning objectives.
- Historical scope: thời gian, địa điểm, sự kiện, giới hạn.
- Common misconception cần sửa.
- Narrative premise.
- Fiction disclosure.
- Character list và character classification.
- Scene outline.
- Assessment/objective coverage map.
- Media plan.
- Debrief/key takeaways.
- Next-action intent.
- Source/review placeholders.
- Version notes.

### 4.2A Scenario và perspective model

Episode không có một motif bắt buộc. Writer chọn scenario dựa trên historical question và loại bằng chứng phù hợp.

Các perspective pattern có thể dùng:

| Pattern | Khi phù hợp | Điều kiện an toàn |
|---|---|---|
| Frontline participant | Chiến dịch/quân sự cần hiểu điều kiện và quyết định tại hiện trường | Không bịa mệnh lệnh, quân số, vị trí hoặc kết quả; fictional role phải được gắn nhãn |
| Civilian witness | Cần giải thích tác động đời sống và cảm nhận con người | Không giả thành lời chứng có thật; dùng composite/fiction label và tránh melodrama |
| Medic/humanitarian role | Cần thể hiện hậu quả, cứu chữa, hậu cần hoặc lựa chọn ưu tiên | Không biến tình huống hư cấu thành case lịch sử thật; kiểm tra điều kiện y tế/thời chiến |
| Messenger/recorder | Sự kiện có tài liệu, bản đồ, điện tín, biên bản hoặc timeline | Vai chỉ truyền/ghi nhận thông tin; không được tự quyết định thay nhân vật lịch sử |
| Delegate/translator/observer | Hội nghị, đàm phán, thay đổi chính sách | Direct quote và hành động của người thật cần source; vai hư cấu phải nói rõ |
| Documentary observer | Khi nguồn tư liệu là trọng tâm và không nên nhập vai sâu | Người học phân tích evidence; narration không thêm claim ngoài source |

Scenario brief bắt buộc ghi:

- Historical question.
- Time/place and real-world conditions.
- Perspective role và lý do role tồn tại.
- Fact boundary: điều gì được khẳng định.
- Fiction boundary: điều gì được dựng để dẫn chuyện.
- Forbidden invention: điều gì không được tự bịa.
- Allowed learner agency.
- Source requirements.

Không chọn vai chỉ vì kịch tính. Nếu bối cảnh không đủ nguồn để đặt người học vào vai, dùng observer/narrator hoặc format video/lesson thường.

### 4.3 Scene roles

| Scene role | Mục đích | Có thể có choice? | Ghi chú |
|---|---|---|---|
| Entry | Nêu title, duration, objectives, labels | Không bắt buộc | Không tính là exposition dài |
| Hook | Tạo câu hỏi hoặc mâu thuẫn cần khám phá | Narrative | Không bịa nguy cơ giả |
| Context | Thiết lập time/place/actors | Narrative/branching | Claims cần source |
| Dialogue | Trình bày góc nhìn qua nhân vật | Narrative/reflection | Quote rules bắt buộc |
| Evidence | Cho xem map/photo/document/video excerpt | Narrative/knowledge | Media metadata bắt buộc |
| Decision | Yêu cầu chọn góc nhìn hoặc đường khám phá | Narrative/reflection/branching | Không ép đúng/sai |
| Knowledge check | Retrieval hoặc misconception correction | Knowledge | Map tới objective |
| Synthesis | Kết nối nhiều fact/quan hệ | Knowledge/reflection | Không tạo trick question |
| Debrief | Recap objectives, labels và sources | Không bắt buộc | Bắt buộc trong episode |

Một scene có một primary role. Secondary presentation details không được làm mờ nhiệm vụ chính.

### 4.4 Content classification

Mọi đoạn nội dung có ý nghĩa lịch sử phải thuộc một nhóm:

1. **Verified historical fact:** claim cần source và review.
2. **Educational explanation:** cách diễn giải để người học hiểu; phải phù hợp nguồn nhưng không giả thành quote/fact nguyên văn.
3. **Fictional narrative:** nhân vật, lời thoại hoặc tình huống do biên kịch tạo; phải có label.
4. **Uncertain/contested claim:** chưa đủ đồng thuận hoặc nguồn xung đột; đánh dấu để xử lý ở Phase 3.

Không trộn hai nhóm trong cùng câu nếu người học không thể nhận biết ranh giới.

### 4.5 Historical context

Context brief cho episode cần ghi:

- Time range.
- Geographic scope.
- Verified participants/organizations.
- Previous events người học cần biết.
- Event outcome không được phép thay đổi qua choice.
- Sensitive terminology.
- Claims cần `[NEEDS HISTORICAL VERIFICATION]`.

Context không phải đoạn mở đầu dài. Writer chỉ đưa vào scene phần đủ để đạt learning objective.

### 4.5A Context-fit rules

- Người lính chỉ xuất hiện khi episode có câu hỏi về điều kiện, nhiệm vụ hoặc trải nghiệm quân sự phù hợp với lực lượng và thời điểm.
- Người dân/người chứng kiến chỉ được dùng để minh họa đời sống hoặc tác động; không gán cho họ lời chứng có thật nếu không có nguồn.
- Người ghi chép/phiên dịch/trợ lý phù hợp khi nội dung xoay quanh tài liệu, biên bản, truyền tin hoặc diễn giải.
- Nhân vật lịch sử thật không được biến thành avatar để người học tự ý quyết định thay họ.
- Choice của learner chỉ ảnh hưởng góc nhìn, thứ tự khám phá, mức độ chú ý hoặc phản hồi; historical outcome giữ nguyên.
- Nếu scenario có thể khiến người học hiểu nhầm là hồi ký/tư liệu thật, fiction label phải xuất hiện trước khi nhập vai.

### 4.6 Character model

| Character type | Quy tắc |
|---|---|
| Historical person | Identity và hành động cần source; direct quote cần nguồn nguyên văn đáng tin cậy |
| Fictional named character | Luôn có label; không được thay thế/chiếm hành động của nhân vật lịch sử thật |
| Fictional composite | Phải ghi rõ là composite; tránh tạo cảm giác đây là lời chứng thật |
| Narrator/Mascot | Giải thích và dẫn nhịp; không được tự trở thành nguồn lịch sử |
| Learner-as-observer | Cho phép khám phá nhưng không được thay đổi outcome thật |

Không đặt người học vào vai một nhân vật lịch sử thật nếu choice có thể bóp méo động cơ/hành động của người đó.

### 4.7 Narration rules

- Mỗi block truyền một ý chính.
- Ưu tiên câu chủ động, tiếng Việt rõ và hiện đại.
- Giải thích thuật ngữ khi xuất hiện lần đầu.
- Không dùng giọng toàn tri để khẳng định claim còn tranh luận.
- Không dùng cảm xúc thay thế bằng chứng.
- Không kể trước đáp án của knowledge check ngay trong scene liền trước, trừ khi mục tiêu là recognition.
- Không dùng wall of text; chia narration theo visual beat.

### 4.8 Choice taxonomy

#### Narrative choice

- Không có correctness.
- Thay đổi response, thứ tự khám phá hoặc sắc thái.
- Không khóa completion dựa trên preference.
- Response phải ghi nhận đúng lựa chọn, không giả vờ lựa chọn có ảnh hưởng lớn nếu thực tế không có.

#### Reflection choice

- Không có correctness hoặc score.
- Khuyến khích learner giải thích, chú ý hoặc đồng cảm.
- Không suy luận chính trị, đạo đức hoặc năng lực từ lựa chọn.
- Có thể không lưu server-side; quyết định ở Phase 7.

#### Branching choice

- Có destination rõ.
- Branch thay đổi đường khám phá, không thay đổi historical outcome.
- MVP dùng shallow branching: quay lại main path trong 1–2 scene.
- Mọi nhánh bắt buộc cuối cùng vẫn cover required learning objectives.

#### Knowledge check

- Có đáp án đúng rõ ràng dựa trên content/source.
- Map tới một learning objective.
- Sai phải có explanation cụ thể; không chỉ “chưa đúng”.
- Retry không phạt XP.
- Không dùng mẹo ngôn ngữ hoặc option vô lý chỉ để đủ số lượng.
- MVP ưu tiên một đáp án đúng; multi-select chỉ dùng khi objective thực sự cần.

### 4.9 Response và feedback rules

| Loại | Response cần làm gì |
|---|---|
| Narrative | Xác nhận lựa chọn và mở thông tin/góc nhìn tương ứng |
| Reflection | Tôn trọng lựa chọn, gợi câu hỏi suy nghĩ tiếp; không phán xét |
| Branching | Giải thích transition đủ để người học không mất phương hướng |
| Knowledge correct | Xác nhận, nhắc lại principle và vì sao đúng |
| Knowledge incorrect | Chỉ ra misconception, giải thích vì sao sai và mời retry |

Feedback không được giới thiệu fact mới quan trọng mà không có source/review.

### 4.10 Dialogue rules

- Direct quote của historical person phải có source chính xác.
- Paraphrase không dùng dấu ngoặc kép và phải được nhận diện như diễn giải.
- Fictional dialogue được phép nhưng character/situation phải có label.
- Một lượt thoại tối đa 1–3 câu ngắn trong đa số scene.
- Không viết historical person bằng slang hiện đại gây sai tone.
- Tránh monologue giảng bài; chuyển phần giải thích dài sang narrator/evidence card.
- Không gán suy nghĩ nội tâm cho nhân vật lịch sử nếu không có nguồn.

### 4.11 Media cues

Writer mô tả media intent, không tự chọn ảnh bất kỳ để trang trí:

- Media type: photo, map, document, illustration, audio hoặc short video.
- Learning purpose.
- Desired subject/time/place.
- Caption intent.
- Fiction label nếu là illustration hư cấu.
- Source/license placeholder.
- Alt-text intent.
- Fallback content.

Video dùng làm artifact trong scene phải ngắn và hỗ trợ scene. Nếu video là trải nghiệm học chính, chuyển thành video-led lesson.

### 4.12 Summary/debrief

Debrief bắt buộc gồm:

- 2–4 key takeaways.
- Mapping về learning objectives.
- Một câu sửa misconception chính.
- Nhắc phần nào là fictional narrative nếu có.
- Lối mở tới source list.
- Next action: quiz, lesson hoặc review.

Debrief không thêm một chủ đề mới chưa được dạy trong episode.

### 4.13 Reward cue

Screenplay chỉ định milestone/reward intent, không tự quyết định số XP cuối cùng. Reward cue ghi:

- Completion milestone.
- Có phải first completion hay replay.
- Suggested feedback copy.
- Achievement candidate nếu có.

Exact XP và idempotency thuộc Phase 7.

### 4.14 Story template

```markdown
# Episode title

## Placement
- Chapter:
- Lesson:
- Story/arc:

## Learning promise

## Duration

## Learning objectives
1.
2.

## Historical scope
- Time:
- Place:
- Participants:
- Fixed outcome:
- Needs verification:

## Misconception to address

## Narrative premise

## Fiction disclosure

## Characters
- Name / type / role / source requirement

## Scene outline
1. Scene ID — role — objective — choice type — next

## Objective coverage
- Objective → scene/check

## Media plan

## Debrief takeaways

## Next action

## Sources/review placeholders

## Version notes
```

### 4.15 Scene template

```markdown
## Scene: ID — Title

- Primary role:
- Learning objective:
- Required or optional:
- Content classification:
- Time/place:
- Characters:
- Media cue:
- Narration:
- Dialogue:
- Choice type:
- Choices and responses:
- Correct answer/explanation (knowledge only):
- Next/default scene:
- Branch destinations:
- Source placeholders:
- Fiction/uncertainty label:
- Writer notes:
```

Phase 5 sẽ chuyển semantics này thành TypeScript/JSON contract; writer template không phải database schema.

### 4.16 Pacing rules

- Episode: 4–7 core scenes, 6–10 phút, tối đa 12 phút.
- Scene: thường 20–90 giây.
- Choice scene: 2–4 options.
- Không quá hai exposition-only scenes liên tiếp.
- Knowledge check xuất hiện sau khi đã có đủ context nhưng không ngay sau câu chứa nguyên đáp án nếu muốn kiểm tra retrieval.
- Branch phụ quay lại main path trong tối đa 1–2 scene ở MVP.
- Chuyển visual beat sau khoảng 80–150 từ hoặc sớm hơn nếu có interaction.
- Nếu có hơn ba objectives hoặc cần hơn bảy core scenes, cân nhắc tách episode.

### 4.17 AI-assisted authoring workflow

```text
Human brief: objective + scope + sources ban đầu
→ AI brainstorm tùy chọn
→ Writer chọn outline
→ Writer tạo screenplay theo template
→ AI critique/rút gọn tùy chọn
→ Writer chỉnh sửa và phân loại content
→ Learning review
→ Historical/media review ở Phase 3 workflow
→ Technical validation
→ Human approval
→ Publish version
```

AI output luôn là draft. Writer phải kiểm tra mọi suggestion, không dùng AI làm source và không cho phép AI tự publish.

### 4.18 Ví dụ Episode Genève 1954

> Đây là authoring example độc lập, không phải bản lịch sử đã duyệt và không đại diện target episode. Các claims cần `[NEEDS HISTORICAL VERIFICATION]`. Lá thư, Minh và vĩ tuyến 17 chỉ là phương án minh họa; pilot tương lai có thể viết lại hoàn toàn hoặc chọn scenario/sự kiện khác.

**Learning promise:** Người học hiểu bối cảnh của hội nghị, tính chất tạm thời của giới tuyến quân sự và sự khác biệt giữa fact với tình huống dẫn chuyện hư cấu.

**Fiction premise:** “Minh” là thư ký trẻ hư cấu dùng để dẫn người học quan sát tài liệu. Không đại diện một người có thật.

| Scene | Role | Content | Choice | Objective |
|---|---|---|---|---|
| entry | Entry | Title, duration, objectives, fiction label | Không | Orientation |
| arrival | Hook/context | Hành lang hội nghị qua góc nhìn Minh | Narrative | Context |
| evidence | Evidence/branch | Chọn xem bản đồ hoặc biên bản trước | Branching | Context |
| map-17 | Knowledge check | Tính chất giới tuyến quân sự `[NEEDS HISTORICAL VERIFICATION]` | Knowledge | Objective 2 |
| letter | Reflection | Tác động tới đời sống qua tình huống hư cấu | Reflection | Human context |
| synthesis | Synthesis check | Ý nghĩa thỏa thuận `[NEEDS HISTORICAL VERIFICATION]` | Knowledge | Objectives 1–2 |
| debrief | Debrief | Key points, fiction reminder, sources, next action | Không | All |

Current story chỉ được giữ như fixture để kiểm tra khả năng render/feedback của player. Nếu được chọn làm pilot, nó phải được biên kịch và review lại từ đầu; Phase 2 không coi story hiện tại là nền nội dung để mở rộng.

### 4.19 Scenario adaptation examples

Các ví dụ dưới đây chỉ là hướng chọn perspective, không phải nội dung đã được duyệt:

| Loại sự kiện | Có thể bắt đầu bằng | Tránh |
|---|---|---|
| Chiến dịch Điện Biên Phủ | Người lính/hậu cần/người cứu thương/observer đọc bản đồ | Cho learner tự thay đổi kết quả chiến dịch |
| Hội nghị Genève | Người ghi biên bản/phiên dịch/trợ lý đoàn/observer tài liệu | Gán direct quote hoặc quyết định thật cho nhân vật hư cấu |
| Đời sống thời chiến | Dân thường/composite witness/nhân viên y tế | Dùng một lá thư giả như bằng chứng lịch sử |
| Sự kiện có phim/ảnh tư liệu | Documentary observer/phóng viên hư cấu có label | Dùng hình ảnh không rõ nguồn như fact |

Mỗi lựa chọn phải quay lại scenario brief và content review; writer không được lấy bảng này làm shortcut để bịa chi tiết.

### 4.20 Content-writer checklist

#### Learning

- [ ] Episode có 1–3 objectives rõ.
- [ ] Mỗi required objective được cover bởi scene/check.
- [ ] Debrief quay lại objectives.
- [ ] Misconception chính có feedback sửa sai.

#### Scenario fit

- [ ] Historical question được viết trước khi chọn role.
- [ ] Role tồn tại hợp lý trong time/place/conditions.
- [ ] Fiction/composite/observer label hiển thị đúng lúc.
- [ ] Learner agency không thay đổi historical outcome.
- [ ] Scenario không dùng motif lá thư/người lính/người chứng kiến chỉ vì thói quen.

#### Structure

- [ ] Mỗi scene có một primary role.
- [ ] Scene/choice đều có transition rõ.
- [ ] Branch quay lại main path và không bỏ required content.
- [ ] Episode nằm trong pacing budget.

#### Choice

- [ ] Choice type được ghi rõ.
- [ ] Narrative/reflection không có correctness.
- [ ] Knowledge check có answer + explanation + retry copy.
- [ ] Không có option mang tính xúc phạm, phán xét hoặc quá vô lý.

#### Historical integrity

- [ ] Fact, explanation, fiction và uncertain claim được phân loại.
- [ ] Historical quote có source placeholder.
- [ ] Fictional character/situation có label.
- [ ] Choice không thay đổi historical outcome.
- [ ] Claims chưa kiểm chứng được đánh dấu.

#### Media và accessibility

- [ ] Media có learning purpose, caption, alt-text intent và fallback.
- [ ] Không dùng ảnh chỉ để trang trí nếu có nguy cơ gây hiểu nhầm.
- [ ] Video artifact không thay thế video-led lesson.

#### Editorial

- [ ] Câu ngắn, tiếng Việt tự nhiên.
- [ ] Không có wall of text hoặc lecture monologue.
- [ ] AI-assisted text đã được writer tự kiểm tra/chỉnh sửa.
- [ ] Draft sẵn sàng chuyển sang Phase 3 review workflow.

## 5. Data/API/UX impact

### UX impact

- UI sau này cần renderer khác nhau cho scene role và choice type.
- Content label phải xuất hiện đúng lúc nhưng không làm gián đoạn câu chuyện.
- Branching cần orientation rõ và progress không thể chỉ dựa trên array index.
- Debrief trở thành scene bắt buộc.

### Data impact

Phase 5 cần biểu diễn:

- Hierarchy story/episode/scene.
- Objective mapping.
- Scene role và content classification.
- Character type.
- Choice type và destination.
- Required/optional flag.
- Source/media placeholders.
- Scenario/perspective role và fiction boundary.
- Debrief và reward cue.
- Version/review status.

### API/service impact

- Service phải tải một published episode graph, không chỉ array scene đơn giản.
- Validation phải phát hiện missing destination, unreachable scene, branch không quay lại và objective thiếu coverage.
- Publishing phải ngăn content chưa review đi vào client.

Không API hoặc schema nào được triển khai trong Phase 2.

## 6. Quyết định cần chốt

| Quyết định | Lý do | UX impact | Data impact | Code impact | Rủi ro |
|---|---|---|---|---|---|
| Chapter → Lesson → Episode → Scene | Vocabulary chung | Navigation rõ | Hierarchy ổn định | Types/services cùng mô hình | Story/episode có thể gây nhầm nếu không giải thích |
| MVP một VN lesson = một episode | Giảm complexity | Session/completion rõ | Quan hệ đơn giản | Router/service dễ hơn | Sau này cần mở rộng story nhiều episode |
| Episode là completion/reward unit | Khớp micro-learning | Resume dễ hiểu | Progress key theo episode/version | Completion service rõ | Episode quá dài sẽ làm progress thô |
| Bốn choice types riêng | Không suy luận từ `correct?` | Feedback đúng ngữ cảnh | Discriminated choice model | Renderer/state rõ | Tăng authoring fields |
| Shallow branching 1–2 scene | Kiểm soát scope và coverage | Có agency nhưng không lạc | Graph vẫn đơn giản | Validation khả thi | Có thể tạo cảm giác nhánh chưa sâu |
| Content classification bắt buộc | Bảo vệ trust | Người học phân biệt thật/hư cấu | Metadata mới | Label rendering | Writer có thể phân loại không nhất quán |
| Quote historical phải có source | Tránh tạo lời nói giả | Tăng độ tin cậy | Source link | Review validation | Thiếu source khiến content bị chặn |
| Template chung cho writer | Handoff nhất quán | Chất lượng episode ổn định | Dễ map schema | Tooling dễ xây | Template quá cứng có thể hạn chế sáng tạo |
| Scenario-driven authoring | Nội dung phù hợp từng bối cảnh | Vai diễn/choice tự nhiên hơn | Scenario brief và role metadata | Renderer có thể tái sử dụng | Writer chọn vai kịch tính nhưng sai context |

## 7. Rủi ro

- Writer nhầm Story với Episode.
- Content classification quá chi tiết làm authoring nặng.
- Branching tạo nhiều scene nhưng không tăng learning value.
- Fiction label xuất hiện quá muộn.
- Knowledge checks lặp lại đúng câu narration vừa đọc.
- Historical person bị viết lời thoại tưởng tượng như quote thật.
- AI suggestion nghe thuyết phục nhưng sai fact.
- Template bị xem là checklist hình thức thay vì công cụ thiết kế học tập.

## 8. Open questions

1. `[OPEN QUESTION]` Sau MVP, một Story có thực sự cần chứa nhiều Episode hay có thể bỏ khái niệm Story?
2. `[OPEN QUESTION]` Có cho phép một episode có nhiều ending về mặt cảm xúc nhưng cùng historical outcome không?
3. `[OPEN QUESTION]` Narrative/reflection choices có cần lưu để hiện recap cá nhân hóa không?
4. `[OPEN QUESTION]` Ai có quyền phân loại một câu là explanation thay vì fact?
5. `[OPEN QUESTION]` Writer sẽ soạn trong Markdown, form nội bộ hay CMS?
6. `[OPEN QUESTION]` Video artifact trong scene có duration limit bao nhiêu?
7. `[OPEN QUESTION]` Mascot là narrator mặc định hay mỗi story có narrator riêng?
8. `[OPEN QUESTION]` Có cho phép fictional composite character trong chủ đề nhạy cảm không?
9. `[OPEN QUESTION]` Các role pattern nào cần được historical reviewer phê duyệt trước khi writer dùng lại?
10. `[OPEN QUESTION]` Khi nào nên chuyển một scenario từ Visual Novel sang video/lesson thường vì không đủ source hoặc agency an toàn?

## 9. Acceptance criteria

Phase 2 được duyệt khi:

- [ ] Hierarchy Chapter/Lesson/Story/Episode/Scene được hiểu và chấp nhận.
- [ ] Episode là completion/resume/reward unit.
- [ ] Scene roles đủ dùng cho authoring MVP.
- [ ] Bốn choice types có ranh giới rõ.
- [ ] Branching không làm thay đổi historical outcome.
- [ ] Content classification bắt buộc được chấp nhận.
- [ ] Scenario/role được chọn theo historical context, không theo motif cố định.
- [ ] Fictional role và historical evidence có boundary rõ.
- [ ] Character, narration, dialogue và feedback rules được chấp nhận.
- [ ] Story và scene templates đủ để writer tạo draft không cần sửa code.
- [ ] Geneva example minh họa được workflow nhưng không bị coi là verified content.
- [ ] Writer checklist đủ làm đầu vào Phase 3 review.
- [ ] Không có implementation/database change.

## 10. Deliverables của phase

- Content hierarchy và vocabulary.
- Episode/scene content model.
- Scene role catalog.
- Choice taxonomy.
- Character/narration/dialogue/feedback rules.
- Media cues và debrief contract.
- Story template.
- Scene template.
- Pacing rules.
- AI-assisted authoring workflow.
- Geneva authoring example.
- Content-writer checklist.

## 11. Những điều chưa làm

- Chưa xác minh fact hoặc source Genève.
- Chưa viết historical/media governance policy.
- Chưa thiết kế UI/state machine cho scene types.
- Chưa chuyển model thành TypeScript/JSON schema.
- Chưa tạo database tables hoặc Supabase services.
- Chưa khóa XP, streak hoặc analytics behavior.
- Chưa viết automated validation/tests.
- Chưa sửa story code hiện tại.

## Kết luận

- **Những gì đã chắc chắn:** content được biên kịch trước; episode là session học; scene cần objective/purpose; AI chỉ hỗ trợ draft; fact/explanation/fiction phải được phân biệt.
- **Những gì chỉ là đề xuất:** Story là container future-ready, MVP một lesson = một episode, bốn choice types và shallow branching tối đa 1–2 scene.
- **Những gì cần quyết định:** hierarchy, choice taxonomy, branch depth, classification, quote rules và templates.
- **Có thể sang phase tiếp theo hay chưa:** chỉ sau khi Phase 2 được duyệt hoặc các điểm cần điều chỉnh đã được cập nhật.
