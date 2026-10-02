# Phase 0 — Repository & Context Audit

> Status: APPROVED\
> Last updated: 2026-09-16\
> Scope: Research and documentation only

> Muốn đọc bản ngắn, xem [Duyệt nhanh Phase 0](../approval-briefs/00-repository-audit-brief.md).

## 1. Mục tiêu

Xác định kiến trúc đang chạy thực tế, luồng học, Visual Novel contract, data flow, code legacy và technical debt trước khi thiết kế hệ thống dài hạn.

## 2. Phạm vi

Đã audit App shell, feature screens, Visual Novel player/story/types, static data, service layer, shared UI, legacy episode prototype, TypeScript typecheck, production build và trạng thái sẵn sàng cho Supabase.

Không xác minh lịch sử bằng nguồn bên ngoài, không thiết kế schema mới, không viết implementation và không thay đổi database.

## 3. Phân tích code hiện tại

### 3.1 Repository overview

| Hạng mục | Hiện trạng |
|---|---|
| Framework | React 19, Vite 8, TypeScript 5.7 |
| Styling | Tailwind CSS 4 và inline styles |
| Routing | State nội bộ trong `App.tsx` |
| Data | Mock data tĩnh |
| Database | Chưa tích hợp |
| Supabase SDK | Chưa cài |
| Testing | Chưa có test runner/script |
| TypeScript | Strict mode; typecheck hiện thất bại |
| Production build | Thành công khi chạy ngoài sandbox |

### 3.2 Current architecture map

```text
main.tsx
└── App.tsx
    ├── TopBar + BottomNav
    ├── Home / Practice / AI / Profile
    └── Overlay views
        ├── Chapter
        ├── Lesson hoặc VisualNovelPlayer
        ├── Lesson Complete
        ├── Quiz
        └── Quiz Result
```

`App.tsx` đang quản lý tab, overlay view, XP, navigation, tra cứu lesson và lựa chọn lesson thường hay Visual Novel. File có 161 dòng, vượt guideline dưới 150 dòng.

### 3.3 Current user flow

```text
Home
→ Chapter
→ Lesson
→ lesson.visualNovelId?
   ├── Không → LessonScreen
   └── Có    → VisualNovelPlayer
→ Lesson Complete
→ Chapter Quiz
→ Quiz Result
→ Home hoặc Retry
```

Chapter progress và lesson status là dữ liệu tĩnh. Completion không cập nhật lại hai giá trị này.

### 3.4 Current Visual Novel flow

```text
Lesson.visualNovelId
→ getVisualNovel(id)
→ story registry
→ VisualNovelPlayer
→ local sceneIndex + feedback
→ onComplete
→ App cộng 10 XP
→ LessonCompleteScreen
```

Player hiện hỗ trợ scene tuyến tính, backdrop/ảnh, narration, narrative choice, knowledge check, feedback, retry khi sai và progress bar.

Player chưa hỗ trợ branching, resume, explicit choice type, reflection type, loading/error/offline/empty state, versioning, source attribution, historical/fiction classification, reward contract hoặc chống cộng XP lặp.

Scene không có `choices` luôn được coi là scene cuối. Vì vậy schema hiện tại không hỗ trợ narration-only scene nằm giữa episode.

### 3.5 Current story contract

```text
VisualNovelStory
├── id
├── title
└── scenes[]
    ├── id
    ├── title
    ├── text
    ├── emotion
    ├── backdrop
    ├── image?
    └── choices?
        ├── label
        ├── response
        ├── correct?
        └── note?
```

Việc có hoặc không có `correct` đang được dùng ngầm để phân biệt knowledge check và narrative choice. Contract này chưa đủ rõ cho branching, reflection, analytics hoặc schema validation.

### 3.6 Historical content observations

Nhân vật “Minh, thư ký trẻ của đoàn Việt Nam” có vẻ là nhân vật hư cấu nhưng chưa có nhãn `MINH HỌA HƯ CẤU`.

Các nội dung về thời điểm đêm 20/7/1954, vĩ tuyến 17, tổng tuyển cử và cách diễn đạt kết quả Hiệp định Genève đều cần `[NEEDS HISTORICAL VERIFICATION]`.

Ảnh Wikimedia hiện chỉ có URL, chưa có tác giả, license, source page, caption, ngày chụp, trạng thái xác minh hoặc fallback.

### 3.7 Current data flow

Kiến trúc tài liệu yêu cầu:

```text
UI → Service → Static data hoặc Database
```

Runtime thực tế:

```text
UI/App → Static data trực tiếp
UI/App → Story registry trực tiếp
```

Các service chapter, visual novel, user và progress đã tồn tại nhưng chưa được runtime UI sử dụng. XP chỉ nằm trong React state và mất khi refresh.

### 3.8 Shared components và design system

Đã có `Button`, `Card`, `ChoiceOption`, layout components và central theme tokens. Tuy nhiên Quiz và Visual Novel dùng implementation riêng; phần lớn runtime component hardcode màu hex.

`VisualNovelPlayer.tsx` có 314 dòng và learning `LessonScreen.tsx` có 208 dòng, vượt guideline giữ production source dưới khoảng 200 dòng khi thực tế cho phép.

### 3.9 Legacy và duplication

- `src/features/` là kiến trúc đang được App sử dụng.
- `src/screens/` là kiến trúc cũ nhưng vẫn được TypeScript compile.
- `Episode1954Screen`, `components/episode`, `models/episode` và `controllers/episodeController` tạo thành prototype thứ hai, chưa kết nối App.
- Có duplication giữa `components/layout` và `components/navigation`.
- `Tab`/`View`, `MascotEmotion` và theme palette có nhiều nguồn định nghĩa.

### 3.10 Typecheck và build

`pnpm exec tsc --noEmit` thất bại với 18 lỗi, chủ yếu do legacy import type sai, implicit `any` và literal type quá hẹp trong `ChoiceOption`.

Vite production build thành công: 36 modules, JavaScript khoảng 249 KB trước gzip. Hai PNG khoảng 1.6 MB mỗi file.

Kết luận: bundle có thể được tạo nhưng repository chưa có TypeScript-clean baseline.

### 3.11 Mâu thuẫn tài liệu và code

| Quy định | Runtime hiện tại |
|---|---|
| UI gọi qua service layer | UI import mock data trực tiếp |
| Styling dùng tokens | Phần lớn hardcode hex |
| Choice reuse `ChoiceOption` | Quiz/VN dùng implementation riêng |
| App dưới 150 dòng | App có 161 dòng |
| File production dưới khoảng 200 dòng | VN Player 314, Lesson 208 |
| Media đặt tại `src/assets/scenes` | Thư mục chưa tồn tại; story hotlink Wikimedia |
| Hư cấu phải được phân biệt | Nhân vật Minh chưa được gắn nhãn |

## 4. Đề xuất thiết kế

1. Chọn `src/features/visual-novel` làm implementation canonical.
2. Giữ Episode 1954 prototype làm tài liệu tham khảo cho đến khi chốt UX và domain model.
3. Chuẩn hóa domain contract trước khi kết nối Supabase.
4. Phân loại choice rõ ràng thay vì suy luận từ `correct?`.
5. Tách historical fact, educational explanation và fictional narrative bằng metadata.
6. Chuyển runtime qua service layer trước khi thay mock bằng database.
7. Thiết kế completion và XP idempotency trước persistence.

### Assumptions

- Một lesson hiện có tối đa một `visualNovelId`.
- Visual Novel hiện là một loại lesson.
- Authentication chưa tồn tại.
- XP hiện phục vụ demo.
- Story Genève là proof of concept, chưa phải nội dung đã duyệt lịch sử.

## 5. Data/API/UX impact

### UX

- Refresh làm mất XP và scene hiện tại.
- Back thoát ngay, không cảnh báo mất tiến độ.
- Replay có thể nhận lại XP.
- Chưa phân biệt rõ sự kiện thật và tình huống hư cấu.
- Chưa có image fallback hoặc accessibility state announcement.

### Data

- Chưa lưu attempt, scene progress, completion hoặc reward.
- Không có story version, source metadata hoặc idempotency key.
- Chapter progress và lesson status không thay đổi sau completion.

### API/service

- Service mới wrap mock data.
- Chưa có loading/error contract, caching, schema validation hoặc database-to-domain mapping.

### Supabase readiness

- `.env.local` đã tồn tại và bị Git ignore.
- Chưa có Supabase SDK/client/auth/RLS/table/migration.
- Vite mặc định không expose `NEXT_PUBLIC_*` cho client.
- `SUPABASE_SERVICE_ROLE_KEY` không được xuất hiện trong browser bundle.

## 6. Quyết định cần chốt

| Quyết định | Lý do | UX impact | Data impact | Code impact | Rủi ro |
|---|---|---|---|---|---|
| Chọn canonical engine | Tránh hai engine song song | Flow nhất quán | Một story model | Có đường migration rõ | Mất ý tưởng prototype nếu xóa sớm |
| Visual Novel là lesson subtype hay entity độc lập | Ảnh hưởng navigation | Quyết định start/resume | Quan hệ chapter–lesson–episode | Ảnh hưởng types và DB | Migration lớn nếu chốt muộn |
| Completion được tính khi nào | Hiện chỉ cần đến scene cuối | Ảnh hưởng cảm giác hoàn thành | Progress và XP | State machine/service | Có thể farm XP |
| Có lưu narrative choice không | Cần cho reflection/analytics | Có thể cá nhân hóa | Choice attempt schema | Player/analytics | Thu thập dữ liệu không cần thiết |
| Quy tắc gắn nhãn hư cấu | Tránh hiểu nhầm lịch sử | Tăng độ tin cậy | Content metadata | UI badge/caption | Người học hiểu nhân vật là thật |

## 7. Rủi ro

### Cao

- Service role key bị dùng trong frontend.
- XP/completion bị cộng lặp.
- Nội dung hư cấu bị hiểu là sự kiện thật.
- Typecheck lỗi nhưng build vẫn được phát hành.
- Hai episode architecture tiếp tục phát triển song song.

### Trung bình

- Story schema không hỗ trợ branching/resume.
- Remote image biến mất hoặc thiếu attribution.
- Không có validation cho broken scene links.

### Tích lũy

- File lớn, logic UI và domain trộn nhau.
- Types/config bị định nghĩa trùng.
- Legacy code vẫn nằm trong TypeScript compilation.
- Asset bundle lớn cho mobile.

## 8. Open questions

1. `[OPEN QUESTION]` Episode 1954 prototype nên được giữ, hợp nhất hay loại bỏ?
2. `[OPEN QUESTION]` Một lesson có thể chứa nhiều episode không?
3. `[OPEN QUESTION]` Điều kiện chính xác để hoàn thành episode là gì?
4. `[OPEN QUESTION]` Narrative/reflection choices có cần lưu không?
5. `[OPEN QUESTION]` User có bắt buộc đăng nhập để lưu progress không?
6. `[OPEN QUESTION]` XP được trao theo episode, scene hay knowledge check?
7. `[OPEN QUESTION]` Ai duyệt lịch sử và nguồn tư liệu trước publish?
8. `[OPEN QUESTION]` Có yêu cầu offline hoặc prefetch media không?
9. `[OPEN QUESTION]` Story sẽ được author bằng TypeScript, JSON, Supabase CMS hay công cụ riêng?

## 9. Acceptance criteria

- [x] Xác định entry point và runtime architecture.
- [x] Mô tả user flow và Visual Novel flow.
- [x] Audit schema, service/data flow và code legacy.
- [x] Chạy TypeScript typecheck và production build.
- [x] Ghi nhận mâu thuẫn tài liệu–code.
- [x] Đánh dấu nội dung cần kiểm chứng lịch sử.
- [x] Không sửa implementation hoặc database.

## 10. Deliverables của phase

- Repository overview và architecture map.
- User flow, Visual Novel flow và data flow.
- Story contract audit.
- Legacy/duplication inventory.
- Typecheck/build baseline.
- Technical debt, risks, assumptions và open questions.

## 11. Những điều chưa làm

- Chưa viết Product Vision hoặc learning goals.
- Chưa thiết kế authoring model.
- Chưa xác minh nội dung Genève.
- Chưa thiết kế player state machine.
- Chưa thiết kế domain contract hoặc database schema.
- Chưa định nghĩa XP/analytics/QA roadmap.
- Chưa sửa technical debt.

## Kết luận

- Chắc chắn: `src/features` là runtime hiện tại; Visual Novel tuyến tính; service chưa nằm trên runtime path; progress không persistent; typecheck đang lỗi nhưng Vite build được.
- Đề xuất: dùng feature Visual Novel làm canonical, giữ episode prototype để tham khảo và chuẩn hóa domain model trước Supabase.
- Cần quyết định: canonical engine, quan hệ lesson–episode, completion rule, XP rule, lưu narrative choice và quy trình duyệt lịch sử.
- Có thể sang Phase 1 sau khi Phase 0 được duyệt.
