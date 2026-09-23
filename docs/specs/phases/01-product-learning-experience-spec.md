# Phase 1 — Product & Learning Experience Spec

> Status: APPROVED\
> Last updated: 2026-09-22\
> Depends on: Phase 0 — APPROVED\
> Scope: Product and learning specification only

> Product owner nên đọc [Duyệt nhanh Phase 1](../approval-briefs/01-product-learning-brief.md) trước. Full spec này dành cho team cần chi tiết.

> **Product scope clarification — 2026-09-23:** Sử Chill tập trung dạy giai đoạn kháng chiến chống Mỹ ở Việt Nam qua nhiều chapter và lesson đa định dạng. MVP đầu tiên là một chapter mẫu gồm nhiều lesson; Visual Novel/pilot episode chỉ là một phần của chapter. Những ví dụ Genève/Điện Biên Phủ trong bản Phase 1 này được giữ để minh họa cấu trúc học, không phải curriculum canonical hoặc lựa chọn pilot.

## 1. Mục tiêu

Xác định Visual Novel tồn tại để làm gì trong Sử Chill, người học cần đạt được gì, một episode vận hành theo learning loop nào và điều kiện nào chứng minh trải nghiệm có giá trị học tập.

Tài liệu này là cầu nối giữa product concept và các phase về content model, UX state, type contract, database và analytics. Nó không phải implementation plan.

## 2. Phạm vi

Phase này bao gồm:

- Product vision và product goals.
- Target learners.
- Learning goals và learning principles.
- Episode length, pacing và learning loop.
- Vai trò của storytelling, choice, knowledge check, quiz, XP và reward.
- Khi nào dùng Visual Novel thay lesson thường.
- Definition of episode completion.
- Episode journey và learner state journey.
- Functional và non-functional requirements.
- Success metrics và acceptance criteria.

Ngoài phạm vi:

- Story authoring schema chi tiết.
- Chính sách kiểm chứng lịch sử và nguồn media.
- Player state machine chi tiết.
- TypeScript/domain contract.
- Supabase schema, RLS hoặc service implementation.
- Công thức XP cuối cùng và analytics payload.

## 3. Phân tích code hiện tại

### 3.1 Product concept hiện có

PRD ban đầu định vị Sử Chill là ứng dụng học lịch sử Việt Nam cho người trẻ; phạm vi nội dung hiện hành đã được làm rõ ở đầu tài liệu này. PRD kết hợp:

```text
Micro-learning
+ storytelling
+ gamification
+ AI history assistant
+ personalized review
```

Core loop toàn sản phẩm hiện được mô tả là:

```text
Discover Chapter
→ Learn 5–10 minutes
→ Understand context
→ Take a short quiz
→ Earn XP
→ Unlock progress
→ Receive achievement
→ Review weaknesses
→ Return
```

Visual Novel hiện mới đảm nhiệm một phần của vòng lặp: storytelling, choice, immediate feedback và lesson completion.

### 3.2 Trải nghiệm hiện tại

Story Genève có năm scene, trong đó:

- Hai scene dùng narrative choice.
- Hai scene dùng knowledge check bắt buộc trả lời đúng.
- Một scene kết thúc.
- Completion cộng 10 XP và chuyển sang lesson-complete screen.

Điểm tốt:

- Nội dung được chia nhỏ.
- Có bối cảnh, nhân vật, ảnh và lựa chọn.
- Feedback sai giải thích ngay.
- Người học phải sửa hiểu lầm trước khi tiếp tục.

Khoảng trống:

- Không công bố learning objectives.
- Narrative và assessment chưa được định nghĩa thành hai vai trò rõ ràng.
- Không có debrief tổng hợp theo objective.
- Không resume.
- Completion và XP có thể lặp.
- Quiz chapter và knowledge check trong episode chưa có quy tắc coverage chung.
- Chưa đo được người học hiểu gì sau episode.

### 3.3 Mâu thuẫn cần giải quyết

PRD yêu cầu mini quiz 2–4 câu sau mỗi lesson, trong khi Visual Novel đã có embedded knowledge checks. Nếu luôn chạy cả hai, người học có thể gặp câu hỏi lặp, kéo dài session và làm giảm nhịp kể chuyện.

Đề xuất của Phase 1: embedded knowledge checks được phép thay mini quiz sau lesson khi chúng đã kiểm tra đủ learning objectives. Chapter final quiz vẫn độc lập vì phục vụ cumulative retrieval.

## 4. Đề xuất thiết kế

### 4.1 Product vision

> Sử Chill Visual Novel biến một bước ngoặt lịch sử thành hành trình học 6–10 phút, nơi người học quan sát bối cảnh, đưa ra lựa chọn, sửa hiểu lầm và tự diễn giải ý nghĩa lịch sử mà không nhầm lẫn giữa sự kiện đã kiểm chứng với góc nhìn hư cấu.

Visual Novel không thay thế sách giáo khoa, bài học thường hoặc nguồn tư liệu. Nó là lớp trải nghiệm giúp người học hình thành bối cảnh và động lực trước khi ghi nhớ, kiểm tra và ôn tập.

Sử Chill là hệ thống học đa định dạng. Một chapter có thể phối hợp lesson thường, Visual Novel, video-led lesson và quiz; định dạng được chọn theo learning objective thay vì áp dụng đồng loạt.

### 4.2 Product goals

1. Giúp người học hiểu quan hệ bối cảnh → diễn biến → kết quả → ý nghĩa, thay vì chỉ nhớ ngày tháng.
2. Tạo cảm giác hiện diện và tò mò mà không bịa sự kiện lịch sử.
3. Biến hiểu lầm thành cơ hội học qua immediate corrective feedback.
4. Duy trì session ngắn, rõ mục tiêu và phù hợp mobile.
5. Kết nối episode với chapter progress, quiz, XP và review loop.
6. Xây dựng niềm tin bằng cách phân biệt fact, explanation và fiction.

### 4.3 Non-goals

- Không tạo alternate history hoặc cho người học “thay đổi lịch sử”.
- Không chấm đúng/sai cho lựa chọn cảm xúc, đạo đức hoặc góc nhìn cá nhân.
- Không dùng Visual Novel để tuyên truyền hoặc ép một kết luận chính trị đơn giản hóa.
- Không sinh story lịch sử tự động bằng AI ở runtime và không tự động publish nội dung AI chưa được con người duyệt.
- Không thay thế quy trình biên tập và kiểm chứng nguồn.
- Không biến mọi lesson thành Visual Novel.

AI vẫn có thể được dùng ngoài trải nghiệm người học như một **authoring assistant**: hỗ trợ brainstorm, sắp xếp scene, cải thiện dialogue hoặc đề xuất cách diễn đạt. Biên kịch phải lựa chọn và chỉnh sửa output; historical reviewer phải kiểm chứng fact/source; chỉ bản được con người duyệt mới được publish.

### 4.3.1 Content production model đã chốt

Visual Novel sử dụng authored content, không phải generated-on-demand content:

```text
Learning objective + historical scope
→ Human-authored outline
→ Scene-by-scene screenplay
→ Optional AI suggestions/improvements
→ Human editorial revision
→ Learning and historical review
→ QA preview
→ Human-approved published version
```

Mỗi scene phải tồn tại trong một screenplay/version trước khi người học mở episode. Player chỉ tải và render story đã publish; player không gọi AI để tạo tiếp scene hoặc thay đổi sự kiện lịch sử.

### 4.4 Target learners

#### Primary

- Người Việt Nam từ 15–25 tuổi.
- Học sinh THPT, sinh viên và người trẻ quan tâm lịch sử.
- Sử dụng điện thoại là chính.
- Có mức kiến thức nền không đồng đều.
- Muốn hiểu nhanh, rõ, có cảm xúc nhưng không muốn đọc văn bản dài.

#### Learner needs

- Biết mình sắp học gì và mất bao lâu.
- Có bối cảnh trước khi gặp chi tiết.
- Được giải thích ngay khi hiểu sai.
- Không bị phán xét ở reflection choice.
- Thấy tiến độ và bước tiếp theo rõ ràng.
- Tin rằng fact và media đã được kiểm chứng.

#### Tone constraints

- Trẻ trung nhưng không trẻ con.
- Dễ hiểu nhưng không hời hợt.
- Có cảm xúc nhưng không kịch hóa quá mức.
- Tin cậy nhưng không giống giáo trình khô cứng.
- Trung tính, tôn trọng và tránh giọng tuyên truyền.

### 4.5 Learning goals

Sau một episode, người học nên có thể:

1. **Recall:** Nhận diện 2–4 fact hoặc khái niệm trọng tâm.
2. **Understand:** Giải thích ngắn gọn bối cảnh và ý nghĩa của sự kiện bằng lời của mình.
3. **Connect:** Liên kết ít nhất một nguyên nhân với một kết quả hoặc hệ quả.
4. **Distinguish:** Phân biệt fact lịch sử, giải thích giáo dục và tình huống/nhân vật hư cấu.
5. **Correct:** Nhận ra và sửa một hiểu lầm phổ biến thông qua feedback.
6. **Continue:** Biết bước học tiếp theo là quiz, lesson kế tiếp hay review.

Mỗi episode chỉ nên có 1–3 learning objectives chính. Nhiều hơn sẽ làm session mất trọng tâm.

### 4.6 Learning principles

1. **Context before recall:** Cho người học hiểu tình huống trước khi yêu cầu nhớ chi tiết.
2. **One cognitive task at a time:** Mỗi scene chỉ nên có một nhiệm vụ chính.
3. **Active retrieval:** Knowledge check yêu cầu nhớ hoặc suy luận, không chỉ bấm tiếp.
4. **Immediate explanation:** Mọi câu trả lời sai phải nhận feedback cụ thể và có cơ hội sửa.
5. **Agency without false history:** Choice tạo sự tham gia nhưng không được thay đổi fact đã xảy ra.
6. **Reflection without scoring:** Lựa chọn quan điểm/cảm xúc không có đáp án đúng tuyệt đối.
7. **Visible classification:** Fiction và historical fact phải được phân biệt rõ.
8. **Short-session integrity:** Episode phải hoàn chỉnh trong một phiên ngắn nhưng vẫn resume được.
9. **Reward learning, not tapping:** Reward gắn với completion có ý nghĩa, không gắn với số lần bấm.
10. **Debrief closes the loop:** Episode phải kết thúc bằng recap liên kết với learning objectives.

### 4.7 Episode length và pacing

Mặc định đề xuất:

- 6–10 phút; hard limit 12 phút.
- 4–7 scene.
- 1 opening/hook scene.
- 2–4 context/narrative scene.
- 1–3 embedded knowledge checks.
- 0–2 narrative hoặc reflection choices.
- 1 debrief/summary scene.
- Khoảng 600–1.000 từ tiếng Việt, không tính source metadata.

Nếu nội dung vượt hard limit, phải tách thành nhiều lesson/episode thay vì thêm scroll dài.

### 4.8 Core learning loop

```text
Orient
→ Enter historical context
→ Observe evidence or narration
→ Make a choice
→ Receive consequence/explanation
→ Retrieve knowledge
→ Correct misunderstanding if needed
→ Debrief against learning objectives
→ Complete once
→ Continue to quiz, next lesson or review
```

### 4.9 Episode journey map

| Stage | Learner goal | Experience | Required output | Exit condition |
|---|---|---|---|---|
| 1. Entry | Biết mình sắp học gì | Title, duration, objective, historical/fiction labels | Episode start | Người học chọn bắt đầu/resume |
| 2. Hook | Muốn biết chuyện gì xảy ra | Một câu hỏi, mâu thuẫn hoặc artifact | Attention | Người học tiếp tục |
| 3. Context | Hiểu thời gian, nơi chốn, chủ thể | Short narration, map, photo, caption | Mental model | Bối cảnh tối thiểu đã trình bày |
| 4. Participation | Chủ động xử lý thông tin | Narrative/branching/reflection choice | Choice | Feedback hoặc scene kế tiếp |
| 5. Knowledge check | Tự kiểm tra hiểu biết | Một câu hỏi gắn objective | Attempt | Trả lời đúng sau tối đa nhiều lần thử |
| 6. Correction | Sửa hiểu lầm | Giải thích vì sao đúng/sai | Updated understanding | Người học xác nhận tiếp tục |
| 7. Debrief | Kết nối các ý chính | Recap, key points, fiction reminder, source entry | Episode understanding | Required objectives được recap |
| 8. Completion | Nhận tiến độ hợp lệ | One-time completion và reward feedback | Completion record | Record được xác nhận/idempotent |
| 9. Next action | Biết học gì tiếp | Quiz, next lesson hoặc review CTA | Continued journey | Người học chọn bước tiếp theo hoặc thoát |

### 4.10 Learner state journey

| State | Câu hỏi trong đầu người học | Thiết kế cần đáp ứng |
|---|---|---|
| Curious | “Chuyện gì đã xảy ra?” | Hook ngắn và có ý nghĩa |
| Oriented | “Tôi đang ở đâu trong lịch sử?” | Mốc thời gian, địa điểm, chủ thể |
| Immersed | “Điều này ảnh hưởng đến con người thế nào?” | Narrative có giới hạn và được gắn nhãn |
| Deliberating | “Tôi sẽ chọn gì?” | Choice rõ hậu quả học tập, không đánh lừa |
| Challenged | “Tôi có hiểu đúng không?” | Knowledge check gắn objective |
| Correcting | “Vì sao tôi sai?” | Feedback giải thích, không chỉ báo màu đỏ |
| Integrating | “Điều quan trọng cần nhớ là gì?” | Debrief ngắn, liên kết nguyên nhân–kết quả |
| Rewarded | “Tiến độ của tôi được ghi nhận chưa?” | Completion/reward rõ và chỉ một lần |
| Directed | “Tiếp theo tôi nên làm gì?” | Một primary CTA phù hợp |

### 4.11 Vai trò của từng mechanic

| Mechanic | Vai trò học tập | Không được dùng để |
|---|---|---|
| Storytelling | Tạo bối cảnh, trình tự và ý nghĩa con người | Bịa fact hoặc che nguồn |
| Narrative choice | Tăng agency và khám phá nhiều cách diễn giải | Chấm điểm kiến thức |
| Reflection choice | Khuyến khích tự suy nghĩ và đồng cảm | Gắn nhãn đúng/sai đạo đức |
| Branching choice | Thay đổi thứ tự khám phá hoặc góc nhìn | Thay đổi kết quả lịch sử thật |
| Knowledge check | Retrieval practice và phát hiện hiểu lầm | Phạt người học hoặc tạo bẫy |
| Feedback | Sửa mô hình hiểu biết ngay lập tức | Chỉ hiển thị “đúng/sai” |
| Mini quiz | Kiểm tra coverage sau lesson khi embedded checks chưa đủ | Lặp nguyên câu vừa hỏi |
| Chapter quiz | Cumulative retrieval sau nhiều lesson | Thay thế learning experience |
| XP | Động lực phụ và tín hiệu tiến độ | Trở thành mục tiêu học chính |
| Reward | Ghi nhận milestone có ý nghĩa | Trao lặp khi replay |
| Account streak | Tạo động lực quay lại học mỗi ngày | Thưởng cho việc chỉ mở app hoặc gây áp lực/phạt quá mức |

### 4.12 Khi nào dùng Visual Novel

Nên dùng khi nội dung có ít nhất hai trong các đặc điểm:

- Có bước ngoặt hoặc chuỗi nguyên nhân–hệ quả rõ.
- Có nhiều góc nhìn cần đặt cạnh nhau.
- Có artifact, bản đồ, ảnh hoặc nguồn sơ cấp hỗ trợ kể chuyện.
- Có hiểu lầm phổ biến cần người học tự phát hiện.
- Có khía cạnh đời sống con người giúp tạo bối cảnh.
- Có thể chia thành scene ngắn với objective rõ.

Không nên dùng khi:

- Nội dung chủ yếu là định nghĩa hoặc danh sách fact ngắn.
- Không có đủ nguồn để tái dựng bối cảnh an toàn.
- Sự kiện nhạy cảm dễ bị game hóa hoặc đơn giản hóa sai.
- Lesson cần phân tích văn bản dài hoặc so sánh nguồn chuyên sâu.
- Storytelling không tạo thêm learning value so với lesson thường.

### 4.12A Khi nào dùng Video hoặc lesson thường

**Dùng video-led lesson khi:**

- Hình ảnh chuyển động, diễn biến theo thời gian, bản đồ động hoặc tư liệu nghe nhìn giúp hiểu tốt hơn văn bản tĩnh.
- Có video tư liệu hợp lệ hoặc video được nhóm sản xuất theo kịch bản đã duyệt.
- Learning objective cần quan sát trình tự, không gian hoặc thay đổi theo thời gian.

**Dùng lesson thường khi:**

- Nội dung cần giải thích ngắn, đọc nhanh và tra cứu lại dễ dàng.
- Trọng tâm là khái niệm, timeline, bảng so sánh hoặc source excerpt.
- Video hoặc nhập vai không tạo thêm learning value.

**Có thể dùng video trong một scene Visual Novel khi:**

- Video chỉ là artifact/media hỗ trợ scene.
- Storytelling và choice vẫn là cấu trúc chính của lesson.

Nếu video là trải nghiệm chính, nó phải là video-led lesson riêng thay vì nhét toàn bộ video vào Visual Novel Player.

### 4.12B Ví dụ chapter đa định dạng

```text
CHƯƠNG 1954
├── Bài 1 — Bối cảnh: Video-led lesson
├── Bài 2 — Hiệp định Genève: Visual Novel
├── Bài 3 — Diễn biến Điện Biên Phủ: Standard lesson + timeline
├── Bài 4 — Ý nghĩa: Standard lesson hoặc guided source reading
└── Thử thách chương: Chapter quiz
```

Các lesson dùng chung progress, learning objectives và reward rules dù renderer khác nhau.

### 4.13 Khi nào cần quiz riêng sau episode

Embedded knowledge checks được coi là mini quiz nếu:

- Có 2–4 câu/check độc lập.
- Bao phủ tất cả learning objectives bắt buộc.
- Không cung cấp đáp án trước khi người học retrieval.
- Có explanation cho đúng và sai.
- Kết quả attempt có thể được ghi nhận.

Quiz riêng vẫn cần khi:

- Episode chỉ có narrative/reflection choices.
- Embedded checks không bao phủ đủ objectives.
- Cần đánh giá retention sau debrief, không chỉ immediate recall.
- Lesson là prerequisite để mở nội dung tiếp theo.

Chapter final quiz luôn tách riêng vì kiểm tra nhiều lesson và khả năng nhớ tích lũy.

### 4.14 Definition of episode completion

Episode được coi là hoàn thành khi:

1. Người học đã đi đến debrief scene cuối.
2. Mọi knowledge check bắt buộc đã có đáp án đúng, kể cả sau retry.
3. Completion record được ghi thành công hoặc xếp hàng đồng bộ an toàn.
4. Reward được áp dụng theo idempotency key của user + episode + version.

Không yêu cầu:

- Narrative/reflection choice phải giống một đáp án chuẩn.
- First-attempt accuracy đạt ngưỡng cụ thể.
- Người học phải nhận XP lần nữa khi replay.

Replay được phép để học lại nhưng không tạo completion reward trùng.

### 4.15 Functional requirements

| ID | Requirement |
|---|---|
| FR-01 | Người học có thể bắt đầu Visual Novel từ một lesson hợp lệ. |
| FR-02 | Entry screen hiển thị title, duration, learning objectives và content labels. |
| FR-03 | Player hỗ trợ narration, media, narrative, reflection, branching và knowledge-check choice theo contract rõ ràng. |
| FR-04 | Fact, educational explanation và fictional narrative có thể được phân loại và hiển thị khác nhau. |
| FR-05 | Knowledge check cung cấp feedback đúng/sai và explanation ngay sau attempt. |
| FR-06 | Câu sai cho phép retry mà không làm mất tiến độ scene trước. |
| FR-07 | Player lưu checkpoint đủ để resume episode. |
| FR-08 | Exit giữa episode không tự đánh dấu completion. |
| FR-09 | Debrief tóm tắt learning objectives và key takeaways. |
| FR-10 | Completion và reward là idempotent. |
| FR-11 | Replay không trao reward completion lần hai. |
| FR-12 | Episode kết thúc với đúng một primary next action và tối đa một secondary action. |
| FR-13 | Embedded knowledge-check coverage quyết định có cần mini quiz riêng hay không. |
| FR-14 | Chapter quiz vẫn hoạt động độc lập với episode completion. |
| FR-15 | Chapter hỗ trợ nhiều lesson format mà không cần tạo flow navigation riêng cho từng format. |
| FR-16 | Video-led lesson hỗ trợ caption, transcript, resume position và media fallback. |
| FR-17 | Video completion không được xác định chỉ bằng việc người học mở player; cần đạt điều kiện học tập được chốt ở Phase 4 và Phase 7. |
| FR-18 | Streak thuộc về tài khoản và được đồng bộ giữa các thiết bị. |
| FR-19 | Một calendar day chỉ làm streak tăng tối đa một lần, dù có nhiều completion event. |
| FR-20 | Mở app, mở lesson hoặc phát video nhưng chưa hoàn thành qualifying activity không làm tăng streak. |
| FR-21 | UI hiển thị current streak, longest streak và trạng thái mục tiêu học trong ngày. |

### 4.16 Non-functional requirements

| ID | Requirement |
|---|---|
| NFR-01 Accuracy | 100% historical claims trong content published phải có trạng thái review và source metadata ở domain layer. |
| NFR-02 Trust | 100% fictional character/situation phải có label hiển thị phù hợp. |
| NFR-03 Accessibility | Không truyền đạt đúng/sai chỉ bằng màu; control có accessible name, focus và state rõ. |
| NFR-04 Mobile | Tối ưu trước cho viewport 390 × 844 và thao tác một tay. |
| NFR-05 Readability | Scene tránh wall of text; body copy dùng font sans dễ đọc. |
| NFR-06 Performance | Nội dung đầu tiên cần xuất hiện nhanh trên kết nối mobile thông thường; media không chặn toàn bộ player. |
| NFR-07 Resilience | Mất mạng hoặc lỗi media không được làm mất progress đã lưu cục bộ. |
| NFR-08 Privacy | Chỉ thu thập choice/analytics phục vụ mục tiêu học tập đã công bố. |
| NFR-09 Maintainability | UI không phụ thuộc trực tiếp vào database; story phải qua service/domain boundary. |
| NFR-10 Compatibility | Story hiện tại phải có migration path, không yêu cầu rewrite không kiểm soát. |
| NFR-11 Video accessibility | Video có phụ đề, transcript, control bàn phím và không autoplay có âm thanh. |
| NFR-12 Video performance | Video có poster/fallback và không chặn toàn bộ lesson khi mạng yếu. |
| NFR-13 Streak consistency | Streak calculation phải idempotent và dùng quy tắc timezone nhất quán do backend kiểm soát. |

### 4.17 Success metrics

Các target dưới đây là đề xuất ban đầu; cần baseline thật trước khi khóa KPI.

#### Learning effectiveness

- Objective coverage: 100% knowledge checks map tới learning objective.
- First-attempt accuracy nên nằm trong khoảng 60–85%; thấp hơn báo nội dung khó/không rõ, cao hơn có thể quá dễ.
- Tỷ lệ sửa đúng sau feedback: mục tiêu đề xuất ≥ 80%.
- Delayed recall sau 7 ngày: cần thiết kế phép đo ở Phase 7. `[OPEN QUESTION]`

#### Experience

- Episode completion rate: target đề xuất ≥ 70% số episode đã bắt đầu.
- Median completion time: 6–10 phút.
- Exit trước scene thứ hai: target đề xuất < 15%.
- Resume success: ≥ 95% session có checkpoint hợp lệ tiếp tục đúng scene.

#### Trust and content quality

- 0 critical historical error trong content published.
- 100% fact published có review status.
- 100% fictional content có label.
- 100% media published có source và attribution metadata.

#### Product continuation

- Tỷ lệ chọn next learning action sau completion: target đề xuất ≥ 50%.
- Return-to-learn trong 7 ngày cần baseline trước khi đặt target.
- XP/reward duplicate rate: 0.
- Duplicate streak-day rate: 0.

## 5. Data/API/UX impact

### UX impact

- Episode cần entry, debrief và next-action rõ ràng thay vì chỉ danh sách scene.
- Player phải thể hiện loại choice và content label mà không làm giao diện nặng.
- Retry được xem là học tập, không phải thất bại.
- Resume trở thành yêu cầu cốt lõi cho mobile session.
- Mini quiz có thể được bỏ qua có điều kiện để tránh lặp.

### Data impact

Phase sau cần biểu diễn:

- Learning objectives và mapping tới scene/check.
- Content classification.
- Choice type.
- Required/optional scene/check.
- Episode version.
- Checkpoint và completion state.
- First attempt, retry và final outcome.
- Reward idempotency.
- Account streak status, qualifying activity day và longest streak.

### API/service impact

Service layer sau này cần cung cấp:

- Load episode published version.
- Load/resume checkpoint.
- Save choice/check attempt.
- Complete episode idempotently.
- Trả về next recommended action.
- Phân biệt recoverable network error và invalid story data.

Không có API nào được triển khai trong Phase 1.

## 6. Quyết định cần chốt

| Quyết định đề xuất | Lý do | UX impact | Data impact | Code impact | Rủi ro |
|---|---|---|---|---|---|
| Episode mặc định 6–10 phút, tối đa 12 | Khớp micro-learning PRD | Session dễ hoàn thành | Cần duration estimate | Cần pacing validation | Nội dung phức tạp có thể bị cắt quá mức |
| 1–3 learning objectives mỗi episode | Giữ trọng tâm | Debrief rõ | Objective mapping | Schema và validation mới | Writer có thể gom objective quá rộng |
| Embedded checks thay mini quiz khi đủ coverage | Tránh câu hỏi lặp | Nhịp kể tự nhiên hơn | Cần coverage metadata | Routing quiz có điều kiện | Coverage đánh giá sai có thể làm thiếu kiểm tra |
| Completion tại debrief + required checks | Completion có ý nghĩa | Không chỉ bấm đến cuối | Check status và completion record | State machine/idempotency | Check bắt buộc quá nhiều gây friction |
| Reward completion chỉ một lần | Chống farm XP | Replay vẫn tự do | Idempotency key | Progress/reward service | Offline sync phải xử lý conflict |
| Reflection/narrative choice không chấm điểm | Không phán xét quan điểm | Tăng an toàn tâm lý | Không có correctness field | Choice rendering riêng | Người học có thể không hiểu mục đích nếu feedback yếu |
| Resume là requirement bắt buộc | Mobile dễ bị gián đoạn | Không mất công học | Checkpoint | Persistence và hydration | Tăng complexity offline/sync |
| Streak thuộc tài khoản và chỉ tăng bằng qualifying activity | Phản ánh việc học thật, đồng bộ nhiều thiết bị | Tạo động lực quay lại | Daily activity + timezone | Server-side streak calculation | Timezone/offline sync cần quy tắc rõ |

## 7. Rủi ro

### Learning risks

- Story hấp dẫn nhưng learning objective mờ.
- Knowledge check chỉ kiểm tra fact vụn, không kiểm tra hiểu bối cảnh.
- Retry biến thành đoán mò nếu feedback tiết lộ đáp án quá sớm.
- Quá nhiều choice làm tăng cognitive load.
- Quiz lặp lại nguyên văn làm người học chán.

### Product risks

- XP lấn át động lực học.
- Episode dài hơn cam kết 10 phút làm giảm completion.
- Mọi lesson bị ép thành Visual Novel dù không phù hợp.
- Success metric bị tối ưu theo completion mà bỏ qua accuracy/trust.

### Historical trust risks

- Fictional perspective bị hiểu thành nhân vật thật.
- Choice tạo cảm giác người học có thể thay đổi kết quả lịch sử.
- Cảm xúc hóa quá mức làm đơn giản hóa sự kiện nhạy cảm.

### Technical dependency risks

- Resume, idempotency và conditional quiz cần domain model ổn định.
- Story hiện tại không có objective, choice type hoặc version.
- Không có analytics baseline để khóa numerical targets.

## 8. Open questions

1. `[OPEN QUESTION]` Có chấp nhận hard limit 12 phút cho mọi episode không?
2. `[OPEN QUESTION]` Delayed recall sẽ được đo qua Practice, quiz lặp hay một assessment riêng?
3. `[OPEN QUESTION]` Narrative/reflection choices có được lưu server-side hay chỉ trong session?
4. `[OPEN QUESTION]` Người học chưa đăng nhập có được resume qua local storage không?
5. `[OPEN QUESTION]` Ai chịu trách nhiệm phê duyệt learning objectives: content writer, giáo viên hay historical reviewer?
6. `[OPEN QUESTION]` Episode có prerequisite bắt buộc hay người học được mở tự do trong chapter?
7. `[OPEN QUESTION]` Target completion và accuracy có cần tách theo nhóm tuổi/kiến thức nền không?
8. `[OPEN QUESTION]` Có cần pre-check để đo learning gain hay chỉ dùng first-attempt knowledge check?
9. `[OPEN QUESTION]` Qualifying activity cụ thể gồm lesson completion, episode completion, video lesson completion, quiz hay practice set nào?
10. `[OPEN QUESTION]` Streak dùng timezone của profile hay timezone cố định Việt Nam?
11. `[OPEN QUESTION]` MVP có streak freeze/cứu chuỗi không, hay bỏ lỡ một ngày sẽ reset?

## 9. Acceptance criteria

Phase 1 được duyệt khi:

- [ ] Product vision mô tả rõ vai trò của Visual Novel trong Sử Chill.
- [ ] Target learners và tone constraints được chấp nhận.
- [ ] Learning goals và principles được chấp nhận.
- [ ] Episode length và pacing có giới hạn rõ.
- [ ] Learning loop có entry, participation, retrieval, correction, debrief và next action.
- [ ] Vai trò của narrative, reflection, branching và knowledge choices không bị trộn.
- [ ] Quy tắc embedded check so với mini quiz được chốt.
- [ ] Definition of completion và one-time reward được chốt.
- [ ] Functional và non-functional requirements đủ làm đầu vào Phase 2–5.
- [ ] Success metrics được chấp nhận hoặc đánh dấu cần baseline.
- [ ] Không có implementation hoặc database change trong phase này.

## 10. Deliverables của phase

- Product vision và product goals.
- Target learner profile.
- Learning goals và principles.
- Core learning loop.
- Episode journey map.
- Learner state journey.
- Mechanic responsibility matrix.
- Visual Novel suitability rules.
- Quiz decision rules.
- Definition of completion.
- Functional requirements.
- Non-functional requirements.
- Success metric framework.

## 11. Những điều chưa làm

- Chưa chuẩn hóa story/scene/choice authoring model.
- Chưa viết dialogue, pacing hoặc content-writer checklist chi tiết.
- Chưa xác minh historical claims hoặc media.
- Chưa thiết kế player state machine và transition table.
- Chưa thiết kế domain types hoặc JSON schema.
- Chưa thiết kế Supabase tables/RLS/services.
- Chưa khóa XP amount, analytics events hoặc privacy retention.
- Chưa xây QA/test matrix hoặc implementation roadmap.
- Chưa sửa code hiện tại.

## Kết luận

- **Những gì đã chắc chắn:** Visual Novel là lesson subtype trong kiến trúc hiện tại; mục tiêu là contextual understanding trong micro-session, không phải game hóa lịch sử hoặc thay thế bài học chuẩn.
- **Những gì chỉ là đề xuất:** hard limit 12 phút, embedded checks thay mini quiz khi đủ coverage, completion tại debrief, one-time reward và các numerical success targets.
- **Những gì cần quyết định:** episode length, quiz coverage rule, completion rule, reward idempotency, resume requirement và việc lưu narrative/reflection choice.
- **Có thể sang phase tiếp theo hay chưa:** chỉ sau khi Phase 1 được duyệt hoặc các điểm cần điều chỉnh đã được cập nhật.
