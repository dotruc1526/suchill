# Phase 6 — Database & Service Layer Specification

> Status: APPROVED — duyệt ngày 2026-09-22\
> Last updated: 2026-09-22\
> Depends on: Phase 3 and Phase 5 APPROVED

## 1. Mục tiêu

Ánh xạ domain contract Phase 5 sang Supabase Postgres/Auth/Storage và định nghĩa service boundary để React không phụ thuộc database row shape. Spec này chưa phải migration; tên cột cuối cùng được kiểm chứng khi implementation bắt đầu.

## 2. Kiến trúc

```text
React feature/component
  ↓
Hook/controller
  ↓
src/services domain API
  ├── Supabase client với user JWT + RLS
  └── Trusted operation qua RPC/Edge Function
        ↓
Postgres/Auth/Storage
```

Ba vùng dữ liệu:

1. Published learning content: client đọc, không client-write.
2. User-owned data: chỉ chủ tài khoản đọc/ghi trong giới hạn policy.
3. Privileged data/operation: chỉ trusted backend, editorial workflow hoặc migration.

## 3. Environment và key boundary

### Client-safe

Vite frontend dự kiến dùng:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
```

Các biến bắt đầu bằng `NEXT_PUBLIC_` không phù hợp convention của Vite hiện tại và sẽ được migration ở implementation.

### Server-only

- Supabase secret/service-role key.
- Gemini/AI provider key.
- Editorial automation secret.
- Signing/webhook secrets.

Secret/service-role bypass RLS và tuyệt đối không nằm trong `VITE_*`, frontend bundle, Git hoặc tài liệu. Khóa đặc quyền đã từng được chia sẻ phải rotate trước khi integration production; không tái sử dụng giá trị cũ.

## 4. Schema groups

Mọi primary key ứng dụng dùng `uuid` ở database và biểu diễn `string` trong TypeScript. Mọi bảng mutable có `created_at`, `updated_at`; published/versioned tables có audit fields phù hợp.

### 4.1 Identity

| Table | Vai trò | Ghi chú |
|---|---|---|
| `profiles` | Hồ sơ app của user | PK/FK `id` tham chiếu `auth.users(id)`; không mirror secret auth fields |
| `user_settings` | Sound, motion, locale, timezone | Một dòng mỗi user; RLS owner-only |

Profile được tạo bằng transaction/trigger an toàn khi signup. Role quản trị/editor không được cho phép user tự sửa qua profile update.

### 4.2 Learning content

| Table | Quan hệ chính |
|---|---|
| `learning_objectives` | Objective dùng chung |
| `chapters` | Chapter metadata/status |
| `chapter_objectives` | Chapter ↔ objective |
| `lessons` | N:1 chapter |
| `lesson_objectives` | Lesson ↔ objective |
| `lesson_prerequisites` | Lesson ↔ prerequisite lesson |
| `lesson_blocks` | N:1 lesson, ordered, typed |

`lesson_blocks` giữ field chung (`kind`, `order_index`, `required`) và reference phù hợp (`story_version_id`, `media_asset_id`, `question_set_id`, `document_id`). Constraint bảo đảm reference đúng với `kind`; không lưu toàn lesson thành một JSON blob.

### 4.3 Visual Novel

| Table | Quan hệ chính |
|---|---|
| `visual_novel_stories` | Story identity |
| `story_versions` | N:1 story; version/status/start scene |
| `scenes` | N:1 story version; typed payload |
| `scene_choices` | N:1 choice scene; next scene/feedback |
| `scene_sources` | Scene ↔ historical source |
| `scene_claims` | Scene ↔ historical claim |

`scenes` dùng relational columns cho identity, kind và transition; JSONB chỉ được dùng cho payload thay đổi theo scene type như character layers/layout. Không nhét toàn bộ story graph vào một JSONB không kiểm chứng.

Published `story_versions` immutable. Trigger/permission chặn update/delete tùy ý; chỉnh sửa tạo version mới.

### 4.4 Historical source and media

| Table | Vai trò |
|---|---|
| `historical_sources` | Citation/source metadata |
| `historical_claims` | Fact/interpretation/fiction/composite/uncertain |
| `claim_sources` | Claim ↔ source |
| `media_assets` | Ảnh/video/audio/illustration metadata |
| `media_sources` | Media ↔ source/license/attribution |
| `caption_tracks` | Caption language/storage reference |
| `transcripts` | Transcript/document reference |

Chỉ media `approved/published` được gắn vào published content.

### 4.5 Question bank

| Table | Vai trò |
|---|---|
| `question_sets` | Nhóm câu hỏi/mode/objective |
| `questions` | Prompt/explanation/difficulty/status |
| `question_options` | Option và answer-key metadata |
| `question_set_items` | Set ↔ question + order |
| `question_sources` | Question ↔ source |

Với scored quiz/AI Battle, correct answer không nằm trong public client query. Submit chạy qua trusted operation và trả kết quả tối thiểu cần cho feedback.

### 4.6 User learning data

| Table | Ownership |
|---|---|
| `user_lesson_progress` | `(user_id, lesson_id)` unique |
| `user_episode_progress` | `(user_id, story_version_id)` unique |
| `user_video_progress` | `(user_id, lesson_id, block_id)` unique |
| `user_choice_selections` | User + story version + scene/choice |
| `learning_attempts` | User-owned attempt log |

Progress reference content ID/version ổn định. Không lưu array index. Critical completion/reward fields không cho client tùy ý update.

Reward ledger, streak day và analytics tables được khóa ở Phase 7 nhưng phải giữ FK tới user/activity/attempt.

## 5. RLS và grants matrix

Mọi table/view trong exposed schema:

- Revoke quyền không cần thiết trước.
- Enable RLS.
- Grant operation tối thiểu cho `anon`/`authenticated`.
- Tạo policy riêng cho select/insert/update/delete.
- View public phải dùng security behavior an toàn; không vô tình bypass RLS.

| Data | anon | authenticated | trusted backend/editor |
|---|---|---|---|
| Published content/source/media metadata | SELECT | SELECT | Manage theo workflow |
| Draft/review content | Không | Không mặc định | Review/publish |
| Own profile/settings | Không hoặc public subset | SELECT/UPDATE own safe fields | Support/admin giới hạn |
| Own progress/selection | Không | SELECT own; checkpoint operation | Validate/repair |
| Other users' progress | Không | Không | Chỉ operation được audit |
| Answer key | Không | Không trực tiếp | Chấm điểm |
| Reward/streak authoritative fields | Không | Read own summary | Transaction-only write |

Owner policy sử dụng authenticated identity (`auth.uid()`) so với `user_id`. Client không được truyền một `user_id` khác rồi dựa vào UI để bảo vệ.

## 6. Storage policy

Đề xuất bucket:

| Bucket | Access | Nội dung |
|---|---|---|
| `published-media` | Public read hoặc CDN-safe | Chỉ asset đã duyệt, không dữ liệu cá nhân |
| `draft-media` | Private | Asset chờ review; signed/authenticated access |
| `user-avatars` | Theo policy | Avatar đã validate, quota/type giới hạn |

- Upload/move/delete qua Storage API, không sửa `storage` schema trực tiếp.
- Bucket giới hạn MIME type và kích thước.
- Video source lớn không mặc định phục vụ trực tiếp nếu vượt free-tier/performance budget; cần mobile rendition/poster/caption/fallback.
- Promotion draft → published là trusted editorial operation.

## 7. Service contracts

### Read services

```ts
chapterService.listPublished()
chapterService.getById(chapterId)
lessonService.getById(lessonId)
visualNovelService.getVersion(storyVersionId)
mediaService.getResolvedAsset(mediaAssetId)
progressService.getLessonProgress(lessonId)
progressService.getResumePoint(lessonId)
profileService.getCurrentProfile()
```

### User write services

```ts
progressService.saveCheckpoint(input)
progressService.saveVideoPosition(input)
progressService.recordChoice(input)
settingsService.updatePreferences(input)
```

Input không nhận `userId` tùy ý từ UI; service lấy identity từ authenticated session.

### Trusted operations

```ts
completionService.completeActivity(input)
quizService.submitScoredAttempt(input)
rewardService.claimCompletion(input)
contentAdminService.publishVersion(input)
aiBattleService.submitRound(input)
```

Các operation cần transaction, answer key, reward hoặc secret chạy qua Postgres function/RPC hoặc Edge Function được xác thực. Phase 7 chốt idempotency và reward transaction.

## 8. DTO và mapping

- Database row chỉ dùng bên trong service adapter.
- Mapper đổi `snake_case` row thành domain model/type rõ ràng.
- UI không import generated database row type trực tiếp.
- Summary query không tải scenes/media payload.
- Detail query chỉ lấy lesson/story version được mở.
- Error được chuẩn hóa thành `not_found`, `unauthorized`, `offline`, `validation`, `conflict`, `server_error`.

## 9. Transaction và concurrency

- Checkpoint dùng upsert với unique constraint và monotonic `updated_at`/revision.
- Multi-device conflict không cho checkpoint cũ ghi đè completion mới.
- Choice locked theo Phase 4; thay đổi chỉ qua restart operation rõ ràng.
- Completion, reward và streak phải cùng transaction hoặc idempotent trusted workflow ở Phase 7.
- Published version không thay đổi dưới progress đang tồn tại.

## 10. Migration và environments

Implementation sau Phase 9 phải có:

- Versioned SQL migrations trong `supabase/migrations/`.
- Seed chỉ gồm content demo/approved không nhét production secret.
- Development và production config tách biệt.
- `.env.example` chỉ chứa tên biến, không chứa giá trị thật.
- RLS/grant tests chạy trên mỗi migration.
- Roll-forward migration; không reset/destructive migration trên production.

## 11. Index/constraint baseline

- Unique slug trong scope phù hợp.
- Unique `(story_id, version_number)`.
- Unique `(story_version_id, scene_id)` identity và valid transition target.
- Unique order trong lesson/story/question set khi cần.
- Index mọi FK thường query và cột dùng trong RLS (`user_id`).
- Check non-negative duration/progress và valid enum/status.
- FK delete behavior explicit; không cascade user/content lịch sử một cách vô tình.

## 12. Account deletion và privacy

- Người dùng có luồng yêu cầu xóa tài khoản.
- Personal profile/progress/settings được xóa hoặc anonymize theo policy đã công bố.
- Aggregate analytics không giữ dữ liệu nhận diện không cần thiết.
- Không lưu email hoặc auth secret lặp lại trong app tables.
- Admin repair/export/delete operation phải được audit.

## 13. Security gates

- Rotate khóa đặc quyền đã từng được chia sẻ trước integration.
- Quét bundle đảm bảo không có secret/service-role/Gemini key.
- RLS test: user A không đọc/ghi user B.
- Anon không đọc draft/answer key/user data.
- Authenticated user không tự publish, tự chấm đúng hoặc tự cộng XP.
- Storage draft không public; published bucket chỉ chứa approved assets.
- Edge Function xác thực user/secret theo operation, không tin `userId` từ body.

## 14. Rủi ro

- Quá nhiều bảng: dùng migration/module theo domain, view/DTO cho read model.
- RLS sai: default deny, explicit grants, automated cross-user tests.
- Video vượt free quota: rendition nhỏ, CDN/hosting strategy và usage monitoring.
- Service-role lộ: rotate, server-only secrets, bundle scan.
- Free-tier project ngủ/giới hạn: chấp nhận ở MVP và theo dõi trước public launch.

## 15. Quyết định cần duyệt

1. Supabase Auth/Postgres/Storage tiếp tục là backend.
2. Schema chia identity, content, VN, source/media, assessment và user progress.
3. RLS/grants theo default-deny và owner-only cho user data.
4. Published content client-readable; draft/publish không client-write.
5. Trusted operation xử lý scored answers, completion/reward và editorial publish.
6. React chỉ gọi domain service trong `src/services/`.
7. Client dùng publishable key; privileged key rotate và server-only.

## 16. Acceptance criteria

- Mọi entity Phase 5 có vị trí lưu và quan hệ rõ.
- Có access matrix cho anon/authenticated/trusted roles.
- Frontend có service operations đủ cho Phase 4 flow.
- Không có secret hoặc answer key trong public client contract.
- Resume/multi-device/versioning có constraint và conflict direction.
- Phase 7 có nền tảng để chốt XP/streak/analytics/idempotency.

## 17. Những điều chưa làm

- Chưa tạo migration/table/bucket/function thật.
- Chưa cài hoặc gọi Supabase SDK.
- Chưa rotate key trong tài khoản Supabase.
- Chưa tạo development/production project.
- Chưa chốt reward/streak/analytics schema chi tiết.

## Kết luận

Thiết kế dùng Supabase theo nguyên tắc least privilege, service abstraction và immutable published content. Sau khi Phase 6 được duyệt, Phase 7 sẽ chốt completion, XP, streak, reward ledger, analytics và chống cộng lặp.
