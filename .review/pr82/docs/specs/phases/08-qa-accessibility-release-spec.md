# Phase 8 — QA, Accessibility, Content Review & Release Gates

> Status: APPROVED — duyệt ngày 2026-09-22\
> Last updated: 2026-09-22\
> Depends on: Phase 3–7 APPROVED

## 1. Mục tiêu

Định nghĩa quality strategy, test matrix, accessibility baseline, historical/media gates, security validation và release criteria. Phase 8 không viết test implementation; nó chốt những gì bắt buộc phải được kiểm chứng ở Phase 9 và trong quá trình build.

## 2. Quality principles

- Test theo rủi ro: security, progress, reward và historical accuracy ưu tiên cao nhất.
- Automated test bảo vệ logic lặp lại; manual test bảo vệ trải nghiệm, nội dung và thiết bị thật.
- `DONE` cần evidence, không chỉ lời xác nhận.
- QA bắt đầu từ contract/content draft, không chờ cuối implementation.
- Accessibility và historical accuracy là release requirements.
- Production secret/data không dùng trong test fixture.
- Test không phụ thuộc story Genève demo như canonical content.

## 3. Severity model

| Severity | Định nghĩa | Ví dụ | Release rule |
|---|---|---|---|
| `BLOCKER` | Security/data/history failure có thể gây thiệt hại nghiêm trọng | Lộ secret; cross-user access; mất progress; fact chính sai nghiêm trọng | Cấm release |
| `CRITICAL` | Core flow không dùng được hoặc không có fallback | Không login; không complete lesson; reward cộng lặp; required media inaccessible | Cấm release |
| `MAJOR` | Feature quan trọng lỗi nhưng có workaround giới hạn | Một browser/device phổ biến lỗi; resume sai một edge case | Chỉ release với written exception, owner, deadline |
| `MINOR` | Không chặn mục tiêu học và không gây hiểu sai | Spacing/copy polish nhỏ | Có thể backlog |

Regression của issue đã sửa giữ severity ban đầu cho đến khi root cause/test coverage được xác nhận.

## 4. Test layers

### 4.1 Static quality

- TypeScript typecheck.
- Lint/format rules khi được chốt ở Phase 9.
- Dependency/security scan.
- Secret scan trên source, build output và history phù hợp.
- Content/schema validation trước build.

### 4.2 Unit tests

Ưu tiên pure domain functions:

- Scene graph validation.
- Completion policies.
- Watched-range merge/90% calculation.
- Quiz score/pass/bonus.
- XP idempotency key.
- Streak date/timezone transitions.
- Progress conflict resolution.
- DTO/row mapper.

### 4.3 Component tests

- Button/Card/ChoiceOption state variants.
- Keyboard/focus behavior.
- Correct/incorrect text+icon+color feedback.
- Loading/error/empty/offline states.
- Sound mute and reduced-motion behavior.
- Long Vietnamese text, large text and missing media.

### 4.4 Integration tests

- Feature hook/controller ↔ service adapter.
- Auth session ↔ owner progress.
- Player ↔ checkpoint/resume.
- Video ↔ completion/fallback.
- Quiz ↔ trusted submit/reward.
- PWA update ↔ pending progress sync.

### 4.5 Database/RLS tests

Minimum personas:

- `anon`.
- Authenticated user A.
- Authenticated user B.
- Trusted backend/editor role.

Assertions:

- A cannot select/update/delete B data.
- Anon cannot access user data, drafts or answer keys.
- User cannot publish, edit reward ledger or authoritative streak.
- Published content readable as intended.
- Draft media remains private.
- Grants and RLS both follow least privilege.
- Retry/replay/multi-device race creates one reward.

### 4.6 End-to-end tests

Core paths:

1. Sign up/sign in/sign out/session restore.
2. Start lesson → mixed blocks → complete → XP/streak.
3. Start VN → choice → retry check → exit → resume → debrief.
4. Video success and transcript/media-failure fallback.
5. Quiz fail/retry/pass and one-time reward.
6. Offline pending checkpoint → reconnect → deduped sync.
7. Account settings: mute/reduced motion/timezone.
8. PWA install/update/offline page.
9. Account deletion/request flow before public release.

## 5. Visual Novel validation

Automated/content validator must detect:

- Duplicate IDs.
- Missing start/end scene.
- Broken `nextSceneId`/choice target.
- Required scene unreachable.
- Accidental infinite loop without exit policy.
- Narrative/reflection choice containing `isCorrect`.
- Missing required feedback/source.
- Published story referencing draft media/source.
- Story version mutation after publish.

Manual UX review:

- Pacing/readability.
- Choice intent clear without misleading moral correctness.
- Back/review/restart behavior matches Phase 4.
- Character/background/media transitions do not hide text or focus.

## 6. Historical and content QA

Release checklist per canonical episode/lesson:

- Learning objectives match content and assessment.
- Claim register complete for material facts.
- Source tier/citation/reviewer present.
- Fact, interpretation, fiction, composite and uncertain labels correct.
- Dates, names, geography, maps, uniforms, flags, dialogue context reviewed.
- Fiction does not contradict known chronology/context.
- Sensitive war/death/trauma portrayal reviewed for age/audience.
- Media license/attribution/source recorded.
- Vietnamese language, spelling, tone and terminology reviewed.
- Demo/prototype content cannot silently become canonical.

Required sign-off roles:

- Content writer/editor.
- Historical reviewer.
- Learning reviewer.
- Media/licensing reviewer where relevant.

One person may hold multiple roles for MVP, but each responsibility and evidence remains explicit.

## 7. Media QA

For each required video/audio/image:

- File loads on target network/device.
- Poster/fallback exists.
- Captions are synchronized and include meaningful non-speech audio.
- Transcript matches final media version.
- Important visual-only information has text description or equivalent learning content.
- No autoplay with sound.
- Pause/seek/volume/caption controls keyboard and touch accessible.
- Mobile rendition size/bitrate respects performance budget.
- Orientation/aspect ratio works without cropped essential content.
- Source/license/attribution is visible or reachable.

The current `episode-portrait-final.mp4` stays `REFERENCE_ONLY` until this gate passes.

## 8. Accessibility baseline

Target: WCAG 2.2 AA for applicable web/PWA experience.

### Perceivable

- Text contrast and UI component contrast meet AA.
- Zoom/reflow and large text do not lose content/actions.
- Images have meaningful alt text or are correctly decorative.
- Audio/video have required captions/alternatives; transcript is product baseline.
- Information is not conveyed only by color, sound, shape or position.

### Operable

- All core actions keyboard accessible.
- Visible focus and focus not hidden behind sticky UI/modal.
- Logical tab/order and focus restoration.
- Touch targets designed generously; target 44×44 CSS px where practical and never below applicable WCAG minimum without documented exception.
- No keyboard trap.
- Motion can be reduced; no flashing/unsafe animation.
- Time limits are avoidable/extendable unless essential.

### Understandable

- Consistent navigation and component behavior.
- Error text explains problem and recovery.
- Correct/incorrect feedback includes text/icon, not color alone.
- Vietnamese language metadata and labels are correct.

### Robust

- Semantic HTML first.
- Accessible names/roles/states exposed.
- Screen-reader announcements for feedback, progress and modal changes.
- Automated accessibility scan plus manual keyboard/screen-reader test.

## 9. UI/UX and responsive QA

- Theme tokens only; no arbitrary off-theme color/radius.
- Default/pressed/selected/correct/incorrect/disabled/loading/focus states.
- Safe-area and bottom navigation on mobile.
- Long title/dialogue/source citation wrapping.
- Portrait and landscape media behavior where supported.
- Animation and UI sound do not delay interaction.
- Mute persisted; sound failure harmless.
- Low-end phone test for scene transition, scroll and media playback.

## 10. PWA matrix

Required coverage for MVP:

- Android Chrome: browser and installed PWA.
- iOS Safari: browser and added-to-home-screen behavior.
- Desktop Chrome/Edge baseline.
- Latest supported major and one prior where feasible; exact versions recorded at release.

PWA checks:

- HTTPS, manifest, icons, name/start URL/display.
- Install guidance dismissible and non-disruptive.
- App launches from icon.
- Custom offline page/fallback.
- Service worker update does not strand user on stale schema/bundle.
- Cache excludes secrets/private responses and respects content version.
- Pending sync state visible.
- Deep link/reload does not produce blank page.

## 11. Performance baseline

Phase 9 will set numeric budgets after measuring baseline. Mandatory behaviors now:

- Route/feature lazy loading.
- Images sized/compressed with placeholders.
- No eager download of required video.
- Current/next scene asset prefetch only where beneficial.
- No obvious long task/jank in core mobile flow.
- Loading/error/offline feedback appears promptly.
- Production build analyzed for secret and oversized asset regression.

## 12. Security/privacy QA

- Rotate previously shared privileged Supabase key before integration/release.
- Client bundle contains only publishable client configuration.
- Auth/session expiration and sign-out clear sensitive cached state.
- RLS/grants tested after every migration.
- Input validation for service/RPC/Edge Function.
- No answer key in scored public DTO.
- Analytics excludes PII/free text/secrets and honors applicable consent/opt-out decision.
- Account deletion/export behavior tested before public release.

## 13. Evidence and test report

Each release candidate records:

- Commit/build/version.
- Environment and database migration version.
- Automated test results.
- Device/browser matrix.
- Accessibility checks and known exceptions.
- Historical/content/media sign-offs.
- Security/RLS results.
- Open issues by severity/owner.
- Product/QA/technical approval.

Evidence can be CI output, test report, screenshots/video, review checklist and signed content metadata.

## 14. Release gates

Release requires:

- Zero open Blocker/Critical.
- Major issues only with written product+technical exception, owner and due date.
- Typecheck/build/test suite pass.
- Cross-user RLS and secret scan pass.
- Core E2E paths pass.
- Canonical content historical/media gate pass.
- Accessibility baseline pass or documented non-critical exception.
- PWA install/offline/update checks pass.
- Rollback/recovery plan documented.

## 15. Acceptance criteria

- Test ownership and evidence are explicit.
- Every critical Phase 1–7 rule has at least one planned verification layer.
- Content/history/media and software tests converge into one release gate.
- Accessibility covers keyboard, screen reader, motion, sound, media and mobile touch.
- PWA has browser/installed/offline/update coverage.
- No production release can be approved by a single unchecked “works on my machine” claim.

## 16. Những điều chưa làm

- Chưa tạo test files/CI workflow.
- Chưa chạy device/browser/accessibility audit.
- Chưa chọn canonical pilot episode.
- Chưa set numeric performance bundle/media budgets.
- Chưa tạo release candidate.

## Kết luận

Phase 8 tạo quality contract chung cho code, content, history, media, security, accessibility và PWA. Khi được duyệt, Phase 9 sẽ chuyển toàn bộ Phase 0–8 thành implementation roadmap, sprint, owner, dependency và release sequence.
