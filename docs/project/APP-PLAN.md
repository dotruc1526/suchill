# Sử Chill — Master App Build Plan

> Status: DRAFT\
> Last updated: 2026-09-23\
> Purpose: Kế hoạch cấp project cho frontend, backend, content và QA

## Delivery mode đã chốt

Project đã hoàn tất giai đoạn **spec-first implementation freeze** khi Phase 9 được duyệt ngày 2026-09-23. Milestone 0 hiện được mở; các milestone sau theo dependency và gate:

- Hoàn thành và duyệt Phase 0–9 trước khi bắt đầu implementation Visual Novel mới.
- Sau khi Phase 9 được duyệt, Codex nhận triển khai end-to-end frontend, backend, database migration, integration và verification theo roadmap đã chốt.
- Trong thời gian làm specs trước phê duyệt Phase 9, nhóm không sửa production source, không tạo database schema và không cài package cho Visual Novel.
- Ngoại lệ chỉ áp dụng khi product owner yêu cầu rõ một hotfix, security fix hoặc task độc lập cụ thể.
- Mọi thay đổi implementation sau Phase 9 vẫn được chia thành các milestone/PR nhỏ; không thực hiện thành một thay đổi khổng lồ.

## 1. Mục tiêu sản phẩm

Sử Chill là ứng dụng mobile-first giúp người trẻ học lịch sử giai đoạn kháng chiến chống Mỹ ở Việt Nam qua nhiều chapter và lesson:

- Hành trình chapter/lesson.
- Micro-learning 5–10 phút.
- Visual Novel có kiểm soát độ chính xác lịch sử.
- Quiz và personalized review.
- XP, streak và achievement.
- AI history assistant dựa trên nguồn đã kiểm chứng.
- AI Battle ở trạng thái thử nghiệm: người học đấu trí với AI qua question bank đã review.

MVP cần tạo được một learning loop hoàn chỉnh:

```text
Đăng nhập hoặc dùng local profile
→ Chọn chapter
→ Học lesson/Visual Novel
→ Làm knowledge check hoặc quiz
→ Lưu completion và XP một lần
→ Tiếp tục lesson hoặc review
```

## 2. Phạm vi MVP đề xuất

### Có trong MVP

- Một chapter mẫu thuộc phạm vi kháng chiến chống Mỹ ở Việt Nam, gồm nhiều lesson đa định dạng; đây là bước phát hành đầu, không phải toàn bộ curriculum dài hạn. Số lượng và chủ đề lesson do Member 1 chốt trong curriculum map sau khi chọn pilot.
- Home learning journey.
- Chapter và lesson navigation.
- Một Visual Novel engine dùng chung.
- Ít nhất một video được Member 2 biên tập theo kịch bản/nguồn đã duyệt và đặt trong bài học canonical của MVP; có phụ đề, transcript, poster và fallback khi media lỗi. Vị trí và hình thức video trong bài do kịch bản quyết định.
- Ít nhất một pilot episode canonical trong chapter mẫu do product owner chọn và đã qua content review; không mặc định dùng demo Genève hiện tại.
- Lesson thường và quiz.
- Resume progress.
- User profile cơ bản.
- Streak theo tài khoản và đồng bộ giữa các thiết bị.
- XP và completion chống cộng lặp.
- Supabase cho content published và user progress.
- Historical source/media attribution.
- Mobile accessibility baseline.

### Chưa cần trong MVP

- AI tự sinh story ở runtime hoặc tự động publish story chưa được con người duyệt.
- Story editor/CMS hoàn chỉnh.
- Branching phức tạp nhiều kết thúc.
- Social leaderboard.
- Real-time multiplayer.
- Offline-first đầy đủ.
- Recommendation model nâng cao.
- AI Battle chưa là điều kiện release MVP; được phát triển song song và chỉ tích hợp sau review contract/bảo mật.

### Hướng phát hành ứng dụng

- Giữ React/Vite làm codebase chung.
- Hướng đã duyệt: Web beta → PWA → kiểm thử ổn định.
- Android/iOS bằng Capacitor là hướng giai đoạn sau và phải được product owner duyệt riêng sau khi PWA ổn định.
- Firebase Hosting phục vụ web/PWA; Supabase tiếp tục là backend.
- Chi tiết tại [APP-DEPLOYMENT-PLAN.md](../platform/APP-DEPLOYMENT-PLAN.md).

## 3. Target architecture

```text
React UI
  ↓
Feature hooks/controllers
  ↓
Service layer
  ├── Chapter service
  ├── Visual Novel service
  ├── Progress service
  ├── Quiz service
  └── User service
  ↓
Supabase client using publishable/anon key
  ↓
Postgres + Row Level Security
  ├── Published learning content
  ├── User-owned progress
  ├── Attempts and rewards
  └── Source/media metadata

Server-only operations
  ↓
Trusted backend/Edge Function using service-role secret
```

Nguyên tắc bắt buộc:

- React component không gọi Supabase trực tiếp.
- Browser không được truy cập service-role key.
- RLS là lớp bảo vệ chính cho dữ liệu user.
- Domain types không phụ thuộc trực tiếp vào database row shape.
- Static mock có thể tồn tại như fallback trong giai đoạn migration.

## 4. Frontend plan

### 4.1 App foundation

- Làm TypeScript typecheck sạch.
- Chọn `src/features` làm kiến trúc canonical.
- Cô lập hoặc loại legacy `src/screens` khỏi runtime/compilation.
- Hợp nhất `layout/navigation`, route types và mascot emotion types.
- Chuyển styling runtime sang `theme/tokens.ts`.
- Bắt đầu sử dụng thực sự các UI primitives.
- Giảm trách nhiệm của `App.tsx` bằng router/app-state layer phù hợp.

### 4.2 Visual Novel frontend

- Story entry screen.
- Player state machine.
- Scene renderer theo scene type.
- Choice components theo narrative/reflection/branching/knowledge-check.
- Correct/incorrect feedback.
- Retry behavior.
- Debrief và completion screen.
- Resume checkpoint.
- Loading/error/offline/media fallback.
- Fiction/source labels.
- Keyboard và screen-reader behavior.

### 4.2A Video lesson frontend

- Video player dùng cho lesson có video là nội dung chính.
- Poster, caption, source và duration hiển thị trước khi phát.
- Phụ đề tiếng Việt và transcript bắt buộc.
- Tua, pause, resume và lưu vị trí xem.
- Fallback bằng transcript/ảnh khi video không tải được.
- Knowledge check hoặc recap sau các đoạn quan trọng.
- Không dùng autoplay có âm thanh.

### 4.3 Learning and quiz frontend

- Chapter/lesson status lấy từ progress service.
- Conditional mini quiz dựa trên learning-objective coverage.
- Chapter final quiz.
- Result và explanation.
- Next recommended action.

### 4.4 Profile and motivation frontend

- XP, streak và achievements từ backend/local profile.
- Hiển thị current streak, longest streak và trạng thái đã hoàn thành mục tiêu hôm nay hay chưa.
- Streak chỉ đổi sau khi backend xác nhận qualifying learning activity.
- Reward UI chỉ hiển thị khi backend xác nhận reward mới.
- Journey progress.
- Practice recommendations ở mức rule-based cho MVP.

### 4.5 UI/UX polish và phản hồi tương tác

- Giao diện phải có visual hierarchy rõ, giàu cảm xúc nhưng vẫn tuân thủ phong cách giấy cổ/vintage của Sử Chill.
- Card, ảnh, nút và khối chữ nhật dùng hệ thống bán kính bo góc nhất quán từ design tokens; không đặt radius tùy ý ở từng màn hình.
- Có micro-interaction cho nhấn nút, chọn đáp án, chuyển scene, mở card, nhận XP và hoàn thành lesson.
- Hiệu ứng phải ngắn, mượt và có mục đích; không dùng animation dày đặc làm chậm việc học.
- Có âm thanh chạm/confirm/correct/incorrect/completion phù hợp ngữ cảnh, âm lượng nhẹ và không tự phát trước tương tác đầu tiên của người dùng.
- Người dùng có thể tắt UI sound; cài đặt được ghi nhớ theo tài khoản hoặc thiết bị.
- Tôn trọng `prefers-reduced-motion`; feedback đúng/sai không chỉ dựa vào màu hoặc âm thanh.
- Thiết kế Figma phải cung cấp state tối thiểu: default, pressed, selected, correct, incorrect, disabled, loading và focus.
- Component, hook, domain function và service phải có ranh giới rõ; logic dùng chung không copy-paste giữa các feature.
- Mọi database/HTTP access đi qua `src/services/`; React component không gọi trực tiếp.
- Tải lười screen/media, nén asset và chỉ preload scene/video cần thiết để PWA chạy tốt trên điện thoại yếu.
- Tiêu chuẩn chi tiết tại [UI-UX-ENGINEERING-GUIDE.md](../engineering/UI-UX-ENGINEERING-GUIDE.md).

## 5. Backend plan

### 5.1 Supabase foundation

- Dùng Supabase Postgres, Auth và Storage.
- Tạo migration files có version.
- Tạo typed Supabase client ở service layer.
- Chuẩn hóa Vite-safe environment variables.
- Giữ service role trong server/Edge Function environment.
- Thiết lập development và production project/config riêng khi cần.

### 5.2 Content domain

Nhóm dữ liệu dự kiến:

- Chapters và lessons.
- Lesson format: standard, visual novel, video hoặc quiz.
- Visual Novel stories, versions và scenes.
- Video assets, captions, transcripts và cue points.
- Choices và scene transitions.
- Learning objectives.
- Historical sources.
- Media assets và attribution.
- Publishing/review status.

Tên bảng và field chính xác chỉ được khóa ở Phase 5–6.

### 5.3 User domain

Nhóm dữ liệu dự kiến:

- User profile.
- Lesson/episode progress.
- Resume checkpoint.
- Choice và knowledge-check attempts.
- Quiz attempts.
- Reward ledger.
- Achievements.
- Streak activity.

Streak là dữ liệu của tài khoản, không phải dữ liệu của riêng thiết bị. Backend phải bảo đảm một ngày chỉ được tính một lần dù user hoàn thành nhiều activity hoặc dùng nhiều thiết bị.

### 5.4 Security and RLS

- Published content: client được đọc.
- Draft content: chỉ editor/admin được đọc.
- User progress: user chỉ đọc/ghi row của chính mình.
- Reward ledger: không cho client tự ý cộng XP tùy ý.
- Streak: client gửi completion event nhưng server quyết định activity có hợp lệ và ngày nào được tính.
- Service-role operation: chỉ chạy trong trusted server environment.
- Media private/public được phân loại rõ.

### 5.5 Backend service contracts

Frontend dự kiến chỉ gọi các operation cấp domain:

- `getChapters()`
- `getLesson(id)`
- `getPublishedStory(id)`
- `getEpisodeCheckpoint(userId, episodeId)`
- `saveEpisodeCheckpoint(...)`
- `recordChoiceAttempt(...)`
- `completeEpisode(...)`
- `submitQuiz(...)`
- `getUserProgress()`
- `getStreakStatus()`

Tên và payload cuối cùng được chốt ở Phase 5–7.

## 6. Content and historical workflow

```text
Nhóm xác định learning objective và historical scope
→ Biên kịch lên outline và scene beats
→ AI hỗ trợ brainstorm/cải thiện câu chữ nếu cần
→ Biên kịch lựa chọn, chỉnh sửa và chịu trách nhiệm bản draft
→ Learning review
→ Historical fact/source review
→ Media/license review
→ Technical schema validation
→ Preview QA
→ Con người phê duyệt và publish version
→ Không sửa trực tiếp version đã publish
```

AI trong workflow này là công cụ hỗ trợ biên kịch, không phải nguồn sự thật lịch sử và không có quyền publish. Mọi output của AI luôn ở trạng thái draft cho đến khi được con người kiểm tra.

Mỗi episode cần:

- Learning objectives.
- Scenario/perspective brief phù hợp với time, place, conditions và historical question.
- Fact/explanation/fiction classification.
- Source metadata.
- Media attribution.
- Writer/reviewer status.
- Version và publish status.
- Content QA checklist.

Mỗi video lesson cần thêm:

- Learning objective và video script/storyboard.
- File hoặc nguồn video có quyền sử dụng.
- Caption, transcript và poster.
- Cue points nếu chèn knowledge check theo đoạn.
- Phương án fallback khi video không tải được.

### Quy tắc AI-assisted authoring

- Được dùng AI để gợi ý premise, scene order, dialogue, choice wording và phương án rút gọn.
- Được dùng AI để phát hiện chỗ khó hiểu, lặp ý hoặc lệch tone.
- Không dùng AI output làm bằng chứng lịch sử hoặc nguồn trích dẫn.
- Không cho AI tự thêm nhân vật/sự kiện có vẻ là thật mà không gắn nhãn và kiểm chứng.
- Không đưa draft AI thẳng vào database published.
- Biên kịch/editor là người chịu trách nhiệm cuối cùng cho từng scene.

## 7. Milestone roadmap

Đây là cách chia milestone của bản kế hoạch ban đầu, được giữ để đọc bối cảnh. [Phase 9 roadmap](../specs/phases/09-implementation-roadmap.md) đã được product owner duyệt ngày 2026-09-23 và dùng thứ tự M0–M7 khác. Khi giao việc, dùng ID, dependency và trạng thái hiện hành ở [task board](./TASK-BOARD.md), không suy ra task từ số milestone trong bảng cũ này.

### M0 — Product and contract foundation

**Mục tiêu:** chốt hệ thống cần hoạt động thế nào trước khi xây database.

- Hoàn tất Phase 0–5.
- Chốt learning loop, authoring model, historical policy, player states và domain types.
- Chọn canonical engine.

**Exit:** frontend/backend/content dùng chung một vocabulary và data contract.

### M1 — Engineering baseline

**Frontend:**

- Typecheck sạch.
- Legacy code được cô lập.
- Tokens/primitives được chuẩn hóa.
- Service boundary được dùng bởi UI.

**Backend:**

- Chưa cần production schema.
- Chuẩn hóa env/security rules và Supabase project strategy.

**Exit:** repo có baseline ổn định để phát triển.

### M2 — Visual Novel engine v2 trên mock data

**Frontend:**

- State machine, scene renderers, choice types, retry, debrief, resume local và error states.

**Content:**

- Chọn một pilot episode sau khi content/historical review hoàn tất.
- Dùng story Genève hiện tại chỉ như fixture kỹ thuật để kiểm tra player, không xem là migration target.
- Pilot mới phải được biên kịch lại theo authoring model, có đủ context, objective, source và fiction labels.

**Backend:**

- Service interfaces và mock adapters.

**Exit:** một pilot episode đã được duyệt chạy hoàn chỉnh trên mock adapter mà chưa phụ thuộc Supabase. Pilot không bắt buộc là story Genève demo hiện tại.

### M3 — Supabase content backend

**Backend:**

- Migration cho content, story versions, sources và media.
- RLS cho published/draft content.
- Chuẩn bị seed/import cho pilot canonical sau khi được chọn và qua historical/content review; demo Genève chỉ là fixture kỹ thuật.
- Storage policy nếu dùng Supabase Storage.

**Frontend:**

- Supabase adapter sau service layer.
- Loading/error/cache behavior.

**Exit:** player tải published story từ Supabase mà UI không biết database implementation.

### M4 — Authentication and progress

**Backend:**

- Auth/profile.
- Progress/checkpoint/attempt/reward tables.
- RLS và idempotent completion operation.

**Frontend:**

- Login/guest strategy.
- Resume across sessions.
- Synced chapter/lesson progress.
- XP/achievement confirmation.

**Exit:** progress tồn tại sau refresh/login và không cộng reward lặp.

### M5 — Quiz, review and motivation loop

- Embedded check coverage.
- Mini quiz/chapter quiz.
- Streak và achievements.
- Rule-based personalized practice.
- Event catalog và analytics privacy controls.

**Exit:** learning loop từ lesson đến review hoạt động end-to-end.

### M6 — Quality and pilot release

- Historical review complete.
- Accessibility/mobile QA.
- Automated type/schema/link tests.
- Performance/media optimization.
- Pilot analytics và learner feedback.
- Release/rollback checklist.

**Exit:** đủ điều kiện thử nghiệm với người học thật.

## 8. Workstream backlog

| ID | Workstream | Task | Dependency | Owner gợi ý |
|---|---|---|---|---|
| DOC-01 | Product | Duyệt Product & Learning spec | Phase 0 | Product/Learning |
| DOC-02 | Content | Chốt authoring model | DOC-01 | Content lead |
| DOC-03 | History | Chốt verification/media policy | DOC-02 | Historical reviewer |
| DOC-04 | UX | Chốt player state machine | DOC-01 | Product + Frontend |
| DOC-05 | Domain | Chốt shared types/schema | DOC-02, DOC-04 | Frontend + Backend |
| FE-01 | Foundation | Fix TypeScript baseline | Không | Frontend |
| FE-02 | Architecture | Cô lập legacy và dùng service layer | FE-01 | Frontend |
| FE-03 | Design system | Tokens và primitives | FE-01 | Frontend/Design |
| FE-04 | VN engine | Player v2 trên mock adapter | DOC-04, DOC-05 | Frontend |
| CONTENT-01 | Episode | Chọn và biên kịch pilot canonical đã qua review; không mặc định dùng demo Genève | DOC-02, DOC-03, DOC-05 | Content |
| BE-01 | Supabase | Database/RLS spec | DOC-05 | Backend |
| BE-02 | Content data | Migrations, policies, seed | BE-01 | Backend |
| BE-03 | Progress | Checkpoint/completion/reward | DOC-04, BE-01 | Backend |
| FE-05 | Integration | Supabase service adapters | BE-02, FE-04 | Frontend |
| QA-01 | Quality | Test matrix và release gates | DOC-03, DOC-04, DOC-05 | QA |

Đây là backlog cấp epic/task group của bản kế hoạch ban đầu; ID ở đây không phải ID task hiện hành. Xem [task board](./TASK-BOARD.md) và task card để biết ID, owner, dependency, trạng thái và evidence đang áp dụng.

## 9. Team ownership gợi ý

Một người có thể giữ nhiều vai trò nếu nhóm nhỏ.

| Vai trò | Trách nhiệm chính |
|---|---|
| Product owner | Scope, priority và acceptance criteria |
| Learning designer | Objectives, learning loop và assessment quality |
| Content writer | Story, narration, choices và debrief |
| Historical reviewer | Fact, source, wording và political sensitivity |
| Frontend engineer | React UI, player state và service consumption |
| Backend engineer | Supabase schema, RLS, service operations và migrations |
| Designer | Mobile UX và scrapbook design system |
| QA | Functional, accessibility, content và regression testing |

## 10. Definition of Ready trước khi code một feature

Một feature chỉ sẵn sàng để code khi có:

- User goal rõ.
- Acceptance criteria.
- UX states gồm loading/error/empty nếu liên quan.
- Data contract đã được frontend/backend đồng ý.
- Security/RLS rule nếu có user data.
- Content/source đã được duyệt nếu hiển thị lịch sử.
- Test approach.

## 11. Việc nhóm nên làm ngay

1. Phase 9 đã được duyệt; đọc [approval brief](../specs/approval-briefs/09-implementation-roadmap-brief.md) và roadmap chi tiết để bắt đầu Milestone 0.
2. Tên năm thành viên đã có ở [team ownership](./TEAM-OWNERSHIP.md); cần chỉ định historical reviewer và claim từng task.
3. Tạo/claim task card M0-00, xác nhận dependency, reviewer và file ownership; sau đó chạy baseline M0-01.
4. Chọn pilot canonical và làm content review theo task card; không đưa demo Genève vào production như nội dung chính thức.

## 12. Điều kiện hoàn thành toàn bộ MVP

- Người học hoàn thành end-to-end loop trên mobile.
- Story published có source và fiction labels đầy đủ.
- Progress/resume hoạt động sau refresh và đăng nhập lại.
- XP/reward không bị cộng lặp.
- Streak đồng bộ theo tài khoản, không tăng lặp trong cùng ngày và không tăng chỉ vì mở app.
- Client chỉ dùng publishable/anon key và RLS bảo vệ dữ liệu.
- Typecheck, schema validation và release-blocking tests đều pass.
- Không còn critical historical hoặc accessibility issue.
