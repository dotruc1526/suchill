# Phase 9 — Implementation Roadmap

> Status: APPROVED — product owner, 2026-09-23\
> Last updated: 2026-09-23
> Depends on: Phase 0–8 APPROVED

## 1. Mục tiêu

Chuyển approved specs thành execution plan có milestone, dependency, owner boundary, file ownership, quality gate và release sequence. Implementation chỉ bắt đầu sau khi Phase 9 được product owner duyệt.

## 2. Delivery principles

- PWA là target đầu tiên; Capacitor không nằm trong implementation authorization hiện tại.
- Codex là integration/end-to-end implementation owner theo quyết định product owner; thành viên nhóm có thể nhận workstream/task riêng.
- Mỗi task nhỏ, có acceptance criteria và evidence.
- Mock-first ở frontend, service abstraction trước Supabase integration.
- Migration roll-forward, RLS default-deny, secret server-only.
- Content canonical được review riêng; technical demo không tự trở thành production content.
- Không merge khi typecheck/build/required tests fail.
- Preserve user changes; không sửa ngoài file scope của task.
- Mỗi task từ `READY` trở đi có detailed task card; tiến độ dùng acceptance checkpoint, không dùng phần trăm cảm tính.
- Product owner làm rõ ngày 2026-09-23: MVP có ít nhất một video do Member 2 biên tập theo kịch bản/nguồn của Member 1 và được Member 4 tích hợp vào bài học canonical. Việc này được theo dõi ở `CONTENT-007`, tách khỏi player `FE-006` và video reference `CONTENT-006`.
- Product owner làm rõ ngày 2026-09-23: curriculum của Sử Chill giới hạn ở giai đoạn kháng chiến chống Mỹ tại Việt Nam và có nhiều chapter/lesson. MVP đầu tiên gồm một chapter mẫu với nhiều lesson đa định dạng; pilot episode/video nằm trong chapter đó, không đại diện cho toàn bộ curriculum. Member 1 lập curriculum map ở `CONTENT-008` trước khi chốt screenplay từng lesson.

## 3. Current baseline

- React 19 + Vite 8 + Tailwind CSS 4 + TypeScript.
- Runtime chủ yếu dùng `src/features/*` nhưng còn duplicate `src/screens/*` và prototype episode stack.
- `App.tsx` đang giữ routing/view state trực tiếp.
- Shared UI primitives đã có nhưng chưa phủ toàn app.
- Service files tồn tại nhưng runtime còn dùng mock/direct imports.
- Visual Novel demo tuyến tính, chưa có version/branch/resume persistence.
- Chưa cài Supabase client, PWA hoặc test framework.
- `.env.local` có client configuration và privileged credential cần rotate; file ignored nhưng privileged key không được dùng lại cho production.
- Docs/specs Phase 0–9 đã approved; source/database chưa implement theo spec.

## 4. Team workstreams

| Lane | Trách nhiệm | File area mặc định |
|---|---|---|
| `CONTENT` — Thọ (Member 1) | Pilot, screenplay, source/media review | `content/` hoặc approved seed input, `docs/features/` |
| `DESIGN` — Trúc (Member 2) | Figma, tokens spec, states, sản xuất video theo kịch bản và bàn giao media | Figma + approved asset/video handoff; không tự sửa logic |
| `FE-FOUNDATION` — Hưng (Member 3) | Shell, routing, tokens, primitives, PWA | `src/App.tsx`, `src/theme/`, `src/components/ui/`, platform config |
| `FE-LEARNING` — Dương (Member 4) | Home/lesson/VN/video/quiz/profile feature UI | `src/features/` |
| `BE-QA` — Vinh (Member 5) | Types/services/Supabase/RLS/progress/reward/tests | `src/types/`, `src/services/`, `supabase/`, `tests/` |

Codex/integration owner xử lý cross-lane contract, review diff, merge order và end-to-end verification. Tên thành viên đã được Product owner gán ngày 2026-09-23; từng task vẫn phải claim executor/file trước khi bắt đầu.

Nguồn phân công chuẩn là [TEAM-OWNERSHIP.md](../../project/TEAM-OWNERSHIP.md). Bảng tổng nằm tại [TASK-BOARD.md](../../project/TASK-BOARD.md); progress/evidence chi tiết nằm trong [docs/tasks](../../tasks/README.md).

### Cách chạy roadmap với năm người

Milestone M0–M7 là thứ tự **cổng nghiệm thu**, không phải lịch tuần tự cho từng người. Các task có dependency đã đạt và không cùng claim hotspot có thể chạy song song **trong milestone đang mở**. Executor ghi evidence theo gate, reviewer/QA kiểm tra, rồi Product owner duyệt rõ ràng và ghi ngày/evidence trên task board; chỉ lúc đó milestone kế tiếp mới mở. Task riêng lẻ `DONE` không thay cho duyệt milestone. Có thể thảo luận hoặc phác thảo ý tưởng milestone sau, nhưng không claim hay triển khai task của milestone đang khóa. Bảng việc cụ thể và handoff của từng thành viên nằm ở [TEAM-OWNERSHIP.md](../../project/TEAM-OWNERSHIP.md#11-việc-cụ-thể-và-đầu-ra-của-từng-thành-viên).

Content pilot là track chạy sớm theo CONTENT-002..005, CONTENT-007 và CONTENT-008: chọn chapter, lập bản đồ nhiều lesson, tìm nguồn, viết screenplay và sản xuất video có thể diễn ra trước M7, sau khi dependency content của từng task đạt. M7 là điểm tích hợp, review cuối và phát hành, không phải lúc mới bắt đầu chọn pilot. Demo Genève chỉ dùng làm fixture kỹ thuật; không seed/publish như canonical content.

## 5. Conflict prevention

### Hotspot files

Chỉ một owner được sửa trong một batch:

- `package.json` và lockfile.
- `src/App.tsx`.
- `src/types/index.ts`.
- `src/theme/tokens.ts`.
- Generated database types.
- Supabase migration ordering/config.
- Global CSS và PWA config.

### Rules

- Branch/task name chứa task ID, mặc định prefix `codex/` cho Codex work.
- Task board khai báo owner, files, dependency, started và next action trước khi sửa.
- Không đổi shared contract trong feature PR mà không cập nhật owner/consumers.
- Migrations đã dùng không sửa lại; tạo migration tiếp theo.
- Package install gom vào foundation-owned change để tránh lockfile conflict.
- Feature dùng service interface/mock; không tự gọi Supabase.
- Content seed chỉ nhận asset/claim đã qua review status phù hợp.
- Handoff ghi rõ changed files, test evidence, migration/env impact và known issues.
- Người thực hiện chuyển task sang `REVIEW`; reviewer chịu trách nhiệm xác nhận `DONE`.

## 5.1 Context readiness gate — cổng trước khi sửa code

Trước task implementation đầu tiên, mỗi executor phải đọc theo thứ tự:

1. `AGENTS.md`.
2. `docs/README.md`.
3. `docs/project/TASK-BOARD.md`.
4. `ARCHITECTURE.md`.
5. Task card và specs/feature docs được card liên kết.

Gate đạt khi:

- Task có owner, executor, reviewer, dependency và acceptance checklist.
- Files claimed không xung đột task đang chạy.
- Shared-contract consumers và merge order đã rõ nếu task đổi contract.
- Không dùng chat cũ hoặc code demo làm nguồn yêu cầu duy nhất.
- Các rule canonical/non-canonical, PWA/Capacitor, AI Battle và secret boundary được hiểu đúng.

## 6. Milestone 0 — Repository and security baseline

**Goal:** codebase type-safe, canonical path rõ, test/build foundation sẵn sàng.

| Task | Owner lane | Depends | Output / acceptance |
|---|---|---|---|
| M0-00 Claim task/context check | Integration + assigned owners | Phase 9 | Task cards, owners/reviewers, file claims và đọc context hoàn tất |
| M0-01 Re-run baseline | Integration | M0-00 | Ghi type/build/runtime issues hiện tại |
| M0-02 Fix TypeScript errors | FE-FOUNDATION | M0-01 | `tsc --noEmit` pass |
| M0-03 Isolate legacy/prototype | FE-FOUNDATION | M0-01 | Runtime/compile dùng canonical `src/features`; prototype preserved or archived safely |
| M0-04 Lightweight app shell plan/implementation | FE-FOUNDATION | M0-02 | `App.tsx` <150 lines where practical; typed route/state boundary |
| M0-05 Test foundation | BE-QA | M0-02 | Unit/component/E2E skeleton and scripts |
| M0-06 Env/security boundary | BE-QA + Product owner | M0-01 | Vite-safe client env names; example file; plan rotate privileged key trước M4; bundle secret check |
| M0-07 CI/local quality commands | BE-QA | M0-05 | typecheck/build/test commands documented |

Gate M0:

- Typecheck and production build pass.
- No source regression in current demo flows.
- Canonical/legacy boundary documented.
- No privileged key in client source/build.

## 7. Milestone 1 — Design system and app shell

**Goal:** Figma handoff becomes reusable, accessible UI foundation.

| Task | Owner lane | Depends | Output / acceptance |
|---|---|---|---|
| M1-01 Token contract | DESIGN + FE-FOUNDATION | M0 | Color/spacing/radius/shadow/type/motion tokens |
| M1-02 UI primitives | FE-FOUNDATION | M1-01 | Button/Card/ChoiceOption/IconButton/Progress/Badge |
| M1-03 Shared states | FE-FOUNDATION | M1-02 | Loading/Error/Empty/Offline/Modal patterns |
| M1-04 Layout/navigation | FE-FOUNDATION | M0-04, M1-02 | TopBar/BottomNav deduplicated; mobile safe-area |
| M1-05 Interaction feedback | FE-FOUNDATION | M1-01 | Motion tokens, reduced motion, sound service, mute |
| M1-06 Component QA showcase | DESIGN + BE-QA | M1-02..05 | States and long Vietnamese content review |

Gate M1:

- No arbitrary off-theme colors/radii in new UI.
- Keyboard/focus/state behavior verified.
- UI primitives reusable without business logic.

## 8. Milestone 2 — Domain, validators and service abstraction

**Goal:** implement Phase 5 contract without binding UI to Supabase rows.

| Task | Owner lane | Depends | Output / acceptance |
|---|---|---|---|
| M2-01 Domain types v2 | BE-QA | M0 | Chapter/Lesson/Block/StoryVersion/Scene/Choice/Media/Progress types |
| M2-02 Story/content validators | BE-QA | M2-01 | Broken ID/transition/source/status detected |
| M2-03 Service interfaces | BE-QA | M2-01 | Chapter/Lesson/VN/Media/Progress/Quiz/User contracts |
| M2-04 Mock adapters | FE-LEARNING + BE-QA | M2-03 | Features run without Supabase |
| M2-05 Legacy data mapper | BE-QA | M2-01 | Current demo maps explicitly or remains isolated fixture |
| M2-06 Contract tests | BE-QA | M2-02..04 | Mock/domain fixtures pass |

Gate M2:

- No array index used as persistent identity.
- Narrative/reflection choice cannot carry correctness in type contract.
- UI consumes service/domain interfaces, not database rows.

## 9. Milestone 3 — Learning frontend on mock services

**Goal:** complete product flow before backend integration.

| Task | Owner lane | Depends | Output / acceptance |
|---|---|---|---|
| M3-01 Home/chapter/lesson journey | FE-LEARNING | M1, M2 | Status and navigation from mock progress |
| M3-02 Standard/mixed lesson renderer | FE-LEARNING | M2 | Ordered typed blocks |
| M3-03 Visual Novel player v2 | FE-LEARNING | M1, M2 | Branching, feedback, back/review/restart, debrief |
| M3-04 Video lesson player | FE-LEARNING | M1, M2 | Poster, captions, transcript, resume, fallback |
| M3-05 Quiz flow | FE-LEARNING | M1, M2 | Practice/scored feedback contract |
| M3-06 Completion/profile UI | FE-LEARNING | M3-01..05 | Pending/confirmed reward, XP/streak presentation |
| M3-07 Feature interaction tests | BE-QA | M3-01..06 | Phase 4 flows pass on mock services |

Gate M3:

- Entire MVP learning loop works with mock adapters.
- Loading/error/offline/empty states present.
- Accessibility and mobile interaction smoke pass.

## 10. Milestone 4 — Supabase foundation and integration

**Goal:** secure, versioned backend replacing mock adapters without UI rewrite.

| Task | Owner lane | Depends | Output / acceptance |
|---|---|---|---|
| M4-01 Supabase local/project config | BE-QA | M0-06, Phase 6 | Safe environment separation |
| M4-02 Content migrations | BE-QA | M2 | Content/VN/source/media/question tables |
| M4-03 User progress migrations | BE-QA | M2, Phase 7 | Profiles/settings/progress/attempts |
| M4-04 Grants/RLS | BE-QA | M4-02,03 | Default deny; owner/public policies |
| M4-05 Storage buckets/policies | BE-QA | M4-02 | Published/draft/user asset boundaries |
| M4-06 Supabase service adapters | BE-QA | M2-03, M4-02..05 | Same domain interface as mock adapters |
| M4-07 Auth/profile integration | FE-FOUNDATION + BE-QA | M4-03,04,06 | Session/profile/settings flow |
| M4-08 RLS/integration tests | BE-QA | M4-04..07 | anon/A/B/trusted matrix pass |

Gate M4:

- Privileged key đã từng được chia sẻ được rotate trước production integration; không dùng lại key cũ.
- Client uses publishable key only.
- User A cannot access user B.
- Draft/answer key/reward fields not public.
- Core learning flow works against Supabase adapter.

## 11. Milestone 5 — Progress, rewards and analytics

**Goal:** authoritative account-bound learning record.

| Task | Owner lane | Depends | Output / acceptance |
|---|---|---|---|
| M5-01 Checkpoint/resume | BE-QA + FE-LEARNING | M4 | Cross-device lesson/VN/video resume |
| M5-02 Completion trusted operation | BE-QA | M4, Phase 7 | Required block policies verified |
| M5-03 Reward ledger/XP | BE-QA | M5-02 | Unique idempotency; no duplicate XP |
| M5-04 Streak | BE-QA | M5-02 | Account timezone, one day record, longest/current |
| M5-05 Quiz attempts/mastery | BE-QA + FE-LEARNING | M5-02 | Retry/best score without farming XP |
| M5-06 Minimal analytics | BE-QA | M5-01..05 | Privacy-reviewed event catalog; best-effort |
| M5-07 Offline pending sync | FE-FOUNDATION + BE-QA | M5-01..06 | Operation dedupe, pending/confirmed UI |

Gate M5:

- Reload/retry/race/multiple devices cannot duplicate reward.
- Streak rules match Phase 7.
- Analytics failure does not block learning.

## 12. Milestone 6 — PWA, performance and polish

**Goal:** free installable mobile-first MVP.

| Task | Owner lane | Depends | Output / acceptance |
|---|---|---|---|
| M6-01 PWA manifest/icons | FE-FOUNDATION + DESIGN | M1, M3 | Install metadata and branded assets |
| M6-02 Service worker/update/offline page | FE-FOUNDATION | M3, M5 | Safe caching/update and custom offline UX |
| M6-03 Lazy loading/assets | FE-FOUNDATION + FE-LEARNING | M3 | Route/media/scene loading optimized |
| M6-04 Video mobile rendition | DESIGN/video (Member 2) + FE-LEARNING (Member 4) | M3-04, CONTENT-007 | Video đã review có bản mobile, poster, caption, transcript và fallback; player tích hợp được |
| M6-05 UI polish | DESIGN + FE lanes | M1, M3 | Motion/sound/radius/states reviewed |
| M6-06 Accessibility audit/fixes | BE-QA + DESIGN + FE lanes | M3, M6-05 | WCAG baseline evidence |
| M6-07 Device/browser PWA test | BE-QA | M6-01..06 | Android/iOS/desktop matrix |

Gate M6:

- PWA install/launch/update/offline fallback works.
- No blank screen on deep link/offline.
- Mobile performance and accessibility gates pass.

## 13. Milestone 7 — Canonical pilot and release candidate

**Goal:** replace technical demo as release proof with approved learning content.

Content track can begin research earlier but integration waits for contracts/gates.

| Task | Owner lane | Depends | Output / acceptance |
|---|---|---|---|
| M7-01 Select pilot chapter | Product + CONTENT | Phase 3 | Chọn chapter mẫu trong phạm vi kháng chiến chống Mỹ; scope/objectives/perspective approved; có thể hoàn tất sớm |
| M7-02 Research/source register | CONTENT | M7-01 | Claims and sources reviewed |
| M7-03 Chapter curriculum, screenplay/media package | CONTENT (Member 1) + DESIGN/video (Member 2) | M7-02, CONTENT-008, CONTENT-007, Phase 2 | Chapter mẫu có nhiều lesson đa định dạng, scene-by-scene version + ít nhất một video lesson đã biên tập, media/captions/transcript |
| M7-04 Historical/learning/media sign-off | CONTENT reviewers | M7-03 | Phase 3/8 checklists pass, gồm video MVP |
| M7-05 Seed/import canonical version | BE-QA | M4, M7-04 | Published immutable content version |
| M7-06 Full regression/security/content QA | All lanes | M5, M6, M7-05 | Zero Blocker/Critical |
| M7-07 Firebase Hosting preview | FE-FOUNDATION + BE-QA | M7-06 | Preview URL, production-like env |
| M7-08 Internal user testing/fixes | Product + QA + All | M7-07 | Findings triaged and blockers fixed |
| M7-09 PWA release | Product + Integration | M7-08 | Release report, rollback plan, public URL |

Gate M7 gồm một chapter mẫu trong phạm vi kháng chiến chống Mỹ với nhiều lesson đa định dạng và ít nhất một video đã duyệt theo kịch bản, chạy trong bài học với phụ đề, transcript, resume và fallback. Media package thiếu hoặc chưa qua historical/source/license review không đạt gate, dù video player kỹ thuật đã chạy.

## 14. Parallel/blocked tracks

### AI Battle

- `BATTLE-001` remains external/in progress.
- Requires repo/branch, rules, data contract, API key boundary and demo handoff.
- `BATTLE-002` integration occurs only after core contracts/security review.
- No authoritative XP/streak until integration approval.

### Capacitor

- Explicitly blocked until PWA stable and separately approved.
- No Android/iOS project/package setup under this roadmap.

### Reference video

- `episode-portrait-final.mp4` stays external `REFERENCE_ONLY`.
- Can become video lesson, VN media artifact or extension only after source/media/accessibility/performance gate.

## 15. Definition of Ready

A task may start when:

- Dependency tasks are DONE/approved.
- Owner and file scope are declared.
- Acceptance criteria/test plan exist.
- Required Figma/content/API contract is available.
- Environment/access needed is available without sharing secret in chat/source.
- No active owner conflict on hotspot files.
- Detailed task card tồn tại và executor đã xác nhận context read order.

## 16. Definition of Done

- Acceptance criteria met.
- Typecheck/build/relevant tests pass.
- No new Blocker/Critical/security/history issue.
- Reuse/tokens/service rules followed.
- Accessibility/loading/error/offline states covered where relevant.
- Docs/task board/handoff updated.
- Detailed task card có checkpoint/evidence; reviewer xác nhận trước khi chuyển `DONE`.
- Evidence recorded.
- Review completed by required lane(s).

## 17. Release sequence

```text
Local development
→ automated checks
→ Firebase preview
→ internal mobile/PWA testing
→ canonical content + security sign-off
→ production PWA
→ monitor errors/usage
→ later reconsider Capacitor
```

## 18. Product owner decisions/actions during execution

- Assign member names to lanes/tasks.
- Approve Figma/design-system checkpoints.
- Select/approve canonical pilot before M7 integration.
- Rotate/authorize privileged Supabase key replacement before M4.
- Provide AI Battle handoff if/when integration should begin.
- Approve release candidate after Phase 8 evidence.

## 19. Phase 9 approval effect

Approving Phase 9 authorizes implementation of Milestone 0 under the approved architecture and task board. It does not authorize:

- Capacitor/store publishing.
- Unreviewed production content.
- Exposing or reusing compromised privileged secrets.
- AI Battle reward integration without review.
- Destructive production database operations.

## 20. Acceptance criteria

- Every Phase 0–8 decision maps to an implementation/test/content task.
- Dependency order supports frontend/backend parallel work without contract drift.
- Five team lanes and hotspot ownership rules are explicit.
- PWA release target and Capacitor boundary are explicit.
- Security/content/accessibility gates block unsafe release.
- Product owner knows what approval starts and what remains separately gated.

## Kết luận

Roadmap triển khai theo nền móng → design system → domain/services → learning UI → Supabase → rewards → PWA → canonical pilot/release. Phase 9 approval ends the spec-first implementation freeze and starts Milestone 0 only.
