# Sử Chill — Canonical Architecture

> Status: TARGET ARCHITECTURE — Phase 5–9 approved; Milestone 0 open
> Last updated: 2026-09-23

Tài liệu này mô tả các ranh giới kỹ thuật mà frontend, backend và AI phải giữ. Schema chi tiết không lặp lại ở đây; nguồn chuẩn là các phase đã duyệt.

## 1. Bức tranh tổng thể

```text
React UI
  ↓
Feature hooks / controllers
  ↓
Domain service interfaces
  ├── mock adapters (phát triển và test)
  └── Supabase adapters (production)
          ↓
     Supabase client với publishable key
          ↓
     Postgres + RLS + Storage

Trusted completion/reward operations
  ↓
Server/Edge Function với secret chỉ ở server
```

UI không biết bảng database và không gọi Supabase/fetch trực tiếp. Adapter đổi từ mock sang Supabase nhưng contract mà UI dùng không đổi.

## 2. Cấu trúc source mục tiêu

```text
src/
├── app/                    # route/app state/composition nếu cần
├── theme/tokens.ts         # color, type, spacing, radius, shadow, motion
├── components/
│   ├── ui/                 # Button, Card, ChoiceOption, Progress...
│   └── layout/             # TopBar, BottomNav, mobile shell
├── features/
│   ├── home/
│   ├── learning/
│   ├── quiz/
│   ├── practice/
│   ├── ai-assistant/
│   ├── profile/
│   └── visual-novel/
├── services/
│   ├── contracts/          # domain-facing interfaces
│   ├── mock/               # fixtures/adapters
│   └── supabase/           # client-safe adapters/mappers
├── types/index.ts          # domain contracts
├── data/                   # temporary fixture input only
└── App.tsx                 # lightweight composition/router

supabase/
├── migrations/             # ordered, roll-forward migrations
├── functions/              # trusted server operations if required
└── tests/                  # RLS/database verification

tests/                      # unit/component/e2e/contract tests
```

`src/features/*` là canonical runtime. `src/screens/*` và prototype stack hiện có là legacy cho đến khi Milestone 0 cô lập an toàn; không xây tính năng mới trên đó.

## 3. Ranh giới dữ liệu

Ba lớp phải tách biệt:

1. **Domain model**: khái niệm app hiểu như `Lesson`, `StoryVersion`, `Scene`, `Progress`.
2. **Persistence model**: row/database/storage metadata.
3. **View model**: trạng thái trình bày riêng của màn hình.

Mapper trong service adapter chuyển persistence model thành domain model. Component không import generated database types.

### Content và user progress

- Phạm vi nội dung canonical là giai đoạn kháng chiến chống Mỹ ở Việt Nam. Curriculum dài hạn có nhiều chapter/lesson; MVP đầu tiên là một chapter mẫu với nhiều lesson đa định dạng. Product owner chọn chapter/pilot; demo Genève không mặc nhiên là nội dung phát hành.

- Authored content: chapter, lesson, ordered lesson block, story/version, scene, choice, question, source và media.
- User-owned state: profile/settings, lesson progress, story checkpoint, video position, attempts, completion, reward ledger và streak day.
- Không đặt `progress` vào row chapter hoặc `status` vào row lesson dùng chung.
- Content published là version bất biến; sửa nội dung tạo version mới để checkpoint cũ vẫn giải được.
- ID bền vững, không dùng vị trí mảng làm identity.

Chi tiết contract: [Phase 5](docs/specs/phases/05-domain-type-contract.md), [Phase 6](docs/specs/phases/06-database-service-spec.md), [Phase 7](docs/specs/phases/07-progress-reward-analytics-spec.md).

## 4. Service boundaries

Tối thiểu có các contract:

- `chapter/lesson service`: catalog, lesson detail và ordered blocks.
- `visual novel service`: story version, scene graph, validation và checkpoint payload.
- `media service`: published asset, caption/transcript/source/fallback metadata.
- `quiz service`: question delivery, attempts và explanation.
- `progress service`: start/resume/checkpoint/completion.
- `user service`: profile, settings, XP/streak/achievement read model.

Service trả về domain result/error có kiểu rõ ràng. Loading/error/offline/empty là trạng thái bắt buộc của consumer. Analytics là best-effort và không được chặn learning flow.

## 5. Lesson và Visual Novel

Lesson hỗ trợ ordered typed blocks: text, image/source, video, visual novel, knowledge check, recap và các block được Phase 5 cho phép. Renderer chọn component theo type thay vì hard-code từng lesson.

Visual Novel là authored scene graph:

- Narrative/reflection/branching choice không mang `isCorrect`.
- Knowledge-check choice mới có correctness và explanation.
- Transition phải tham chiếu ID tồn tại; validator phát hiện broken link/unreachable scene.
- Checkpoint gắn `storyVersionId` và scene/choice ID ổn định.
- Demo Genève hiện tại chỉ là fixture kỹ thuật, không phải mẫu nội dung canonical.

## 6. Supabase và bảo mật

- Client dùng publishable/anon key qua một client boundary trong adapter.
- Privileged/service-role secret chỉ tồn tại ở trusted backend; không có prefix `VITE_`/`NEXT_PUBLIC_` và không vào browser bundle.
- RLS mặc định từ chối, sau đó mở policy nhỏ nhất cho published content và row thuộc user hiện tại.
- Draft, answer key, moderation data và reward authority không public.
- Completion/reward/streak là transaction hoặc trusted operation có idempotency key; reload/retry/race không cộng lặp.
- Migration roll-forward; không chỉnh migration đã được dùng chung.

## 7. PWA, offline và media

- Release target đầu tiên là web/PWA. Capacitor không thuộc scope nếu chưa duyệt riêng.
- Service worker chỉ cache asset/data an toàn; update flow không để app kẹt version cũ.
- Offline có fallback rõ ràng. Pending progress phải phân biệt với backend-confirmed reward và đồng bộ idempotent.
- Video cần poster, captions tiếng Việt, transcript, resume và fallback; không autoplay có âm thanh.
- Member 1 bàn giao kịch bản/nguồn đã review cho Member 2 biên tập video; Member 4 gắn media đã duyệt vào lesson qua media service. Member 5 quản lý metadata/storage policy theo service/backend contract.
- Route/scene/media lazy-load; ảnh/video có rendition phù hợp mobile và performance budget.

## 8. UI architecture

- Figma là thiết kế/handoff; React components là app chạy thật.
- Tokens là nguồn duy nhất cho palette, spacing, radius, shadow, typography và motion.
- UI primitives không chứa business logic; feature components phối hợp primitives và hooks.
- Knowledge feedback dùng correct/incorrect; narrative selection dùng selected trung tính/primary.
- Sound đi qua service/manager dùng chung, có mute; animation tôn trọng reduced motion.

## 9. Experimental boundary

AI Battle tiếp tục ở repo/branch hoặc module độc lập cho đến khi có handoff gồm rules, contract, secret boundary, test và review. Nó không được tự ghi authoritative XP/streak trước khi integration được duyệt.

## 10. Change control

- Mỗi thay đổi bắt đầu từ task card trong `docs/tasks/`.
- AI tìm task từ vai trò trên task board/card và chỉ claim việc đủ dependency trong milestone đang mở hoặc content track độc lập.
- Milestone tiếp theo chỉ mở sau khi gate có evidence, reviewer kiểm tra và Product owner duyệt rõ ràng trên task board; task riêng lẻ `DONE` không thay cho duyệt milestone.
- Contract dùng chung phải nêu consumers và merge order.
- Hotspot chỉ một owner tại một thời điểm.
- Definition of Ready/Done và milestone gates nằm ở [Phase 9](docs/specs/phases/09-implementation-roadmap.md).
- Historical/media/accessibility/release gate nằm ở [Phase 8](docs/specs/phases/08-qa-accessibility-release-spec.md).
