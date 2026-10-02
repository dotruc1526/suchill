# Phase 5 — Domain Model & Type Contract

> Status: APPROVED — duyệt ngày 2026-09-22\
> Last updated: 2026-09-22\
> Depends on: Phase 4 APPROVED

## 1. Mục tiêu

Chốt domain contract dùng chung cho content, frontend, backend và QA trước khi thiết kế Supabase schema. Contract này thay thế mô hình demo đang dựa vào numeric index, inline arrays và `correct?` mơ hồ.

## 2. Nguyên tắc

- Entity ID là string ổn định; không dùng array index làm identity hoặc checkpoint.
- Authored content tách khỏi user-owned progress.
- Published version là immutable; chỉnh sửa tạo version mới.
- Union có discriminator rõ (`kind`, `format`, `status`) để TypeScript kiểm tra đầy đủ.
- Narrative/reflection choice không mang trường đúng/sai.
- Database row, domain entity và UI view model không mặc định là cùng một shape.
- React component nhận domain/view model; data access đi qua service.
- URL media, attribution và transcript được quản lý qua MediaAsset thay vì rải trong component.

## 3. Phân tích model hiện tại

Model hiện tại có các giới hạn:

- `Chapter.id` và `Lesson.id` là number, gắn chặt với mock data.
- `Lesson.status` và `Chapter.progress` trộn authored content với user progress.
- `StoryStep`, `VisualNovelScene` và `SceneChoice` thiếu version, transition, source và accessibility metadata.
- `SceneChoice.correct?` khiến mọi loại choice có thể vô tình bị xem là đúng/sai.
- `SceneBackdrop` hard-code năm giá trị của demo Genève.
- `VisualNovelStory.scenes` không có start scene hoặc graph validation.

Các type hiện tại tiếp tục là legacy/demo cho đến implementation roadmap; Phase 5 chưa sửa source.

## 4. Learning content model

### 4.1 Shared primitives

```ts
type EntityId = string
type ISODateTime = string
type Locale = "vi-VN"
type PublishStatus = "draft" | "in_review" | "approved" | "published" | "archived"

type OrderedRef = {
  id: EntityId
  order: number
}
```

ID có thể được database triển khai bằng UUID ở Phase 6 nhưng domain không phụ thuộc cách tạo ID.

### 4.2 Chapter

```ts
type Chapter = {
  id: EntityId
  slug: string
  title: string
  subtitle?: string
  summary: string
  historicalPeriodLabel: string
  coverMediaId?: EntityId
  learningObjectiveIds: EntityId[]
  lessonRefs: OrderedRef[]
  estimatedMinutes: number
  status: PublishStatus
}
```

Không chứa `progress` hoặc trạng thái `current/locked`; đó là view model tính từ progress và prerequisite.

### 4.3 Lesson và block

```ts
type LessonFormat = "standard" | "visual_novel" | "video" | "quiz" | "mixed"

type Lesson = {
  id: EntityId
  chapterId: EntityId
  slug: string
  title: string
  summary: string
  format: LessonFormat
  estimatedMinutes: number
  learningObjectiveIds: EntityId[]
  prerequisites: EntityId[]
  blocks: LessonBlock[]
  status: PublishStatus
}

type LessonBlock =
  | TextBlock
  | VisualNovelBlock
  | VideoBlock
  | QuizBlock
  | RecapBlock
```

Mọi block có `id`, `order`, `required` và discriminator `kind`.

```ts
type BaseBlock = {
  id: EntityId
  order: number
  required: boolean
}

type TextBlock = BaseBlock & {
  kind: "text"
  documentId: EntityId
}

type VisualNovelBlock = BaseBlock & {
  kind: "visual_novel"
  storyVersionId: EntityId
}

type VideoBlock = BaseBlock & {
  kind: "video"
  mediaAssetId: EntityId
  completionPolicy: "optional" | "reach_end" | "watch_threshold"
  knowledgeCheckSetId?: EntityId
}

type QuizBlock = BaseBlock & {
  kind: "quiz"
  questionSetId: EntityId
  assessmentMode: "practice" | "scored"
}

type RecapBlock = BaseBlock & {
  kind: "recap"
  documentId: EntityId
}
```

Giá trị threshold chính xác và rule chống gian lận thuộc Phase 7.

## 5. Visual Novel model

### 5.1 Story và version

```ts
type VisualNovelStory = {
  id: EntityId
  slug: string
  title: string
  summary: string
  latestPublishedVersionId?: EntityId
}

type StoryVersion = {
  id: EntityId
  storyId: EntityId
  versionNumber: number
  status: PublishStatus
  startSceneId: EntityId
  scenes: VisualNovelScene[]
  learningObjectiveIds: EntityId[]
  sourceIds: EntityId[]
  createdAt: ISODateTime
  publishedAt?: ISODateTime
}
```

Published version không bị update in-place. Scene reference phải nằm trong cùng version trừ reference được contract cho phép rõ ràng.

### 5.2 Scene union

```ts
type VisualNovelScene =
  | NarrationScene
  | DialogueScene
  | ChoiceScene
  | MediaScene
  | DebriefScene
  | EndScene

type BaseScene = {
  id: EntityId
  title?: string
  backdropMediaId?: EntityId
  sourceIds: EntityId[]
  claimIds: EntityId[]
  nextSceneId?: EntityId
}
```

Scene cụ thể bổ sung:

- `NarrationScene`: `kind: "narration"`, nội dung lời dẫn.
- `DialogueScene`: `kind: "dialogue"`, speaker/character/line/emotion.
- `ChoiceScene`: `kind: "choice"`, prompt và danh sách option.
- `MediaScene`: `kind: "media"`, media asset và caption/context.
- `DebriefScene`: `kind: "debrief"`, tổng kết, fact/fiction/source links.
- `EndScene`: `kind: "end"`, completion summary; không có `nextSceneId`.

Nội dung chữ có thể bắt đầu bằng plain text nhưng contract phải cho phép chuyển sang structured document mà không đổi identity của scene.

### 5.3 Choice union

```ts
type SceneChoice = NarrativeChoice | KnowledgeCheckChoice

type NarrativeChoice = {
  id: EntityId
  kind: "narrative" | "reflection" | "branching"
  label: string
  response?: string
  nextSceneId: EntityId
}

type KnowledgeCheckChoice = {
  id: EntityId
  kind: "knowledge_check"
  label: string
  isCorrect: boolean
  explanation: string
  nextSceneId?: EntityId
}
```

Choice scene phải khai báo interaction policy, ví dụ `retryUntilCorrect` hoặc `continueAfterFeedback`. Knowledge check dùng cho học tập được retry không giới hạn theo Phase 4; scored assessment dùng Question model riêng.

## 6. Historical claim, source và fiction label

```ts
type ClaimKind = "fact" | "interpretation" | "fiction" | "composite" | "uncertain"

type HistoricalClaim = {
  id: EntityId
  statement: string
  kind: ClaimKind
  sourceIds: EntityId[]
  reviewStatus: PublishStatus
  reviewerNote?: string
}

type HistoricalSource = {
  id: EntityId
  title: string
  authorOrInstitution?: string
  publishedYear?: number
  url?: string
  citationText: string
  tier: "primary" | "scholarly" | "institutional" | "reference"
}
```

Phase 6 quyết định table/normalization; Phase 3 tiếp tục là governance source of truth.

## 7. Media model

```ts
type MediaAsset = {
  id: EntityId
  kind: "image" | "video" | "audio" | "illustration"
  title: string
  storageRef: string
  posterMediaId?: EntityId
  caption?: string
  altText?: string
  transcriptRef?: string
  captionTrackRefs?: string[]
  durationSeconds?: number
  aspectRatio?: string
  sourceIds: EntityId[]
  attribution?: string
  license?: string
  reviewStatus: PublishStatus
}
```

`storageRef` được service chuyển thành URL phù hợp; domain không yêu cầu component biết bucket/path policy.

## 8. Question model

```ts
type QuestionSet = {
  id: EntityId
  title: string
  questionIds: EntityId[]
  learningObjectiveIds: EntityId[]
  mode: "practice" | "scored"
}

type MultipleChoiceQuestion = {
  id: EntityId
  prompt: string
  optionIds: EntityId[]
  explanation: string
  sourceIds: EntityId[]
  difficulty: "intro" | "standard" | "advanced"
  status: PublishStatus
}
```

Answer key là server-authoritative với scored quiz/AI Battle. Client DTO không mặc định chứa đáp án đúng. AI Battle vẫn là experimental feature; Phase 5 chỉ bảo đảm question bank có thể dùng chung.

## 9. User progress model

```ts
type ProgressStatus = "not_started" | "in_progress" | "completed"

type LessonProgress = {
  userId: EntityId
  lessonId: EntityId
  status: ProgressStatus
  currentBlockId?: EntityId
  completedBlockIds: EntityId[]
  startedAt?: ISODateTime
  completedAt?: ISODateTime
  updatedAt: ISODateTime
}

type EpisodeProgress = {
  userId: EntityId
  storyVersionId: EntityId
  status: ProgressStatus
  currentSceneId: EntityId
  visitedSceneIds: EntityId[]
  lockedChoiceIds: EntityId[]
  startedAt: ISODateTime
  completedAt?: ISODateTime
  updatedAt: ISODateTime
}

type VideoProgress = {
  userId: EntityId
  lessonId: EntityId
  blockId: EntityId
  positionSeconds: number
  watchedRanges: Array<{ start: number; end: number }>
  completed: boolean
  updatedAt: ISODateTime
}

type LearningAttempt = {
  id: EntityId
  userId: EntityId
  activityType: "knowledge_check" | "quiz" | "ai_battle"
  activityId: EntityId
  selectedOptionIds: EntityId[]
  isCorrect?: boolean
  attemptedAt: ISODateTime
}
```

XP, streak, reward ledger, idempotency key và analytics event được chốt ở Phase 7.

## 10. Validation invariants

- ID không trùng trong cùng namespace/version.
- `startSceneId` và mọi `nextSceneId` phải tồn tại.
- Có ít nhất một reachable `end` scene.
- Không có required block bị thiếu content reference.
- `order` duy nhất trong lesson.
- Knowledge check có đáp án hợp lệ và explanation/source theo policy.
- Narrative/reflection choice không có `isCorrect`.
- Media bắt buộc có accessibility/source metadata theo loại và Phase 3.
- Published content chỉ tham chiếu published/approved dependency.
- Progress chỉ tham chiếu đúng content version mà người dùng đã bắt đầu.

## 11. Service boundaries dự kiến

```ts
chapterService.getChapter(id)
lessonService.getLesson(id)
visualNovelService.getPublishedStoryVersion(id)
progressService.getResumePoint(userId, lessonId)
progressService.saveCheckpoint(input)
mediaService.resolveAsset(id)
quizService.submitAttempt(input)
```

Đây là domain operations, chưa phải chữ ký API/database cuối cùng. Phase 6 chốt DTO, auth boundary, RLS và transaction.

## 12. Rủi ro và cách kiểm soát

- Model quá tổng quát: chỉ giữ loại đã có use case Phase 1–4.
- Story graph hỏng: thêm validator ở Phase 8/implementation.
- Version migration phức tạp: progress khóa vào version đã bắt đầu; policy nâng version thuộc Phase 6–7.
- Payload quá lớn: service có summary/detail DTO; không tải toàn bộ chapter media một lần.
- Trùng logic frontend/backend: domain rule có contract/test fixtures dùng chung khi triển khai.

## 13. Quyết định cần duyệt

1. Chapter → Lesson → ordered Block là learning hierarchy.
2. Story → immutable StoryVersion → Scene là Visual Novel hierarchy.
3. Dùng discriminated union cho block, scene và choice.
4. IDs là string ổn định; không dùng index làm checkpoint.
5. Content, media/source và user progress là domain tách biệt.
6. Scored answer key là server-authoritative; AI Battle dùng chung question bank nhưng chưa vào MVP core.

## 14. Acceptance criteria

- Frontend có thể render mọi flow đã duyệt ở Phase 4 mà không đoán field.
- Backend có đủ entity/relation để bắt đầu Phase 6.
- Writer hiểu được Story/Version/Scene/Choice template.
- Không còn `correct?` mơ hồ cho narrative choice.
- Resume không phụ thuộc array index.
- Contract hỗ trợ mixed lesson, video, source/media metadata và account progress.

## 15. Những điều chưa làm

- Chưa sửa `src/types/index.ts` hoặc `src/features/visual-novel/types.ts`.
- Chưa tạo migration/table/RLS.
- Chưa chốt REST/RPC/Edge Function payload.
- Chưa chốt XP/streak/completion threshold/analytics.
- Chưa code validator hoặc player v2.

## Kết luận

Phase 5 đề xuất một contract có version, ID ổn định và ranh giới rõ giữa authored content, media/source và progress. Khi được duyệt, Phase 6 có thể ánh xạ contract này sang Supabase schema và service/API an toàn.
