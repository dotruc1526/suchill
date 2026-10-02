# Phase 7 — Progress, Completion, XP, Streak & Analytics

> Status: APPROVED — duyệt ngày 2026-09-22\
> Last updated: 2026-09-22\
> Depends on: Phase 5 and Phase 6 APPROVED

## 1. Mục tiêu

Chốt authoritative rules cho progress, completion, XP, streak, achievements baseline và analytics. Mọi reward phải chống cộng lặp, đồng bộ theo tài khoản và không phụ thuộc việc frontend tự khai báo kết quả.

## 2. Nguyên tắc

- Progress là monotonic khi có thể: completed không tự lùi về in-progress.
- Completion và reward là hai kết quả liên quan nhưng tách biệt.
- Backend là nguồn sự thật cho scored result, XP, streak và reward ledger.
- Retry phục vụ học tập, không phải cách farm XP.
- Không phạt XP vì trả lời sai.
- Analytics không phải nguồn sự thật cho progress/reward.
- Analytics failure không được chặn lesson completion.
- Mọi hoạt động dùng stable content/version ID từ Phase 5.

## 3. Progress hierarchy

```text
Block progress
→ Lesson progress
→ Chapter progress

Scene checkpoint
→ Episode progress
→ Visual Novel block completion
```

Status chung:

```ts
type ProgressStatus = "not_started" | "in_progress" | "completed"
```

Chapter percentage là read model được tính từ required lesson/block, không phải con số client tùy ý ghi.

## 4. Completion policies

### 4.1 Text/standard block

- Block required hoàn thành khi người dùng đi qua nội dung và thực hiện action hoàn thành rõ ràng.
- Không dùng chỉ số scroll đơn thuần làm bằng chứng duy nhất nếu nội dung có knowledge check bắt buộc.

### 4.2 Visual Novel block

Required khi:

- Reachable `end`/debrief scene đã tới.
- Required knowledge checks đã có attempt hợp lệ.
- Story version khớp version user bắt đầu.

Visited scene/choice lưu phục vụ resume và review; không yêu cầu người dùng xem mọi branch để hoàn thành.

### 4.3 Video block

Policy:

- `optional`: không chặn lesson.
- `reach_end`: phù hợp video rất ngắn; phải phát tới gần cuối.
- `watch_threshold`: mặc định 90% unique watched duration.

Watched ranges được hợp nhất server-side hoặc trusted service; tua đến cuối không tương đương xem 90%.

Accessibility/media-failure route:

- Mở transcript/fallback đã duyệt.
- Hoàn thành recap hoặc knowledge check bắt buộc gắn với video.
- Backend ghi completion reason `accessible_fallback` hoặc `media_fallback`, không coi là gian lận.

### 4.4 Quiz block

- Practice: trả lời toàn bộ required questions; không có pass gate.
- Scored chapter/final quiz: mặc định pass threshold 70%, content có thể override trong phạm vi được duyệt.
- Retry được phép; best score/mastery có thể tăng nhưng first-completion reward không lặp.

### 4.5 Lesson và chapter

- Lesson completed khi mọi required block đạt completion policy.
- Chapter completed khi mọi required lesson và final assessment bắt buộc đạt điều kiện.
- Optional extension/video không chặn completion nhưng vẫn ghi engagement riêng.

## 5. XP policy MVP

| Activity | Base XP | Rule |
|---|---:|---|
| Standard/video lesson first completion | 10 | Một lần theo lesson/version |
| Visual Novel episode first completion | 20 | Một lần theo story version |
| Chapter/final quiz first pass | 20 | Một lần theo assessment version |
| Quiz score >= 80% bonus | 5 | Một lần theo assessment version |
| Valid daily review | 5 | Tối đa một lần/account day |

Rules:

- Sai/ retry không trừ XP.
- Revisit/replay không cộng base XP lần nữa.
- Content version minor correction không tự tạo reward mới; reward scope dùng stable reward eligibility version.
- Admin adjustment phải tạo ledger entry có reason/audit, không sửa tổng XP trực tiếp.
- AI Battle reward disabled cho đến khi BATTLE-002 review xong; prototype không ghi authoritative ledger.

## 6. Reward ledger và idempotency

Ledger là append-only source of truth:

```ts
type RewardLedgerEntry = {
  id: EntityId
  userId: EntityId
  rewardType: "lesson" | "episode" | "quiz" | "quiz_bonus" | "daily_review" | "achievement" | "adjustment"
  activityId: EntityId
  eligibilityVersion: string
  xpDelta: number
  idempotencyKey: string
  occurredAt: ISODateTime
  reason?: string
}
```

Unique `idempotency_key` ví dụ:

```text
userId:rewardType:activityId:eligibilityVersion
```

Trusted completion transaction:

1. Authenticate user.
2. Validate activity completion from authoritative records.
3. Insert completion if absent.
4. Insert reward ledger with unique idempotency key.
5. Update/read derived XP summary.
6. Apply qualifying streak day.
7. Return same outcome if request is replayed.

## 7. Streak policy

Stored concepts:

- `account_timezone` — IANA timezone, mặc định từ thiết bị khi onboarding nhưng thuộc account.
- `current_streak`.
- `longest_streak`.
- `last_qualified_local_date`.
- `streak_days` — unique `(user_id, local_date)` record.

Qualifying activities:

- First completion of required lesson.
- Visual Novel episode completion.
- Required quiz completion/pass theo policy.
- Daily review completion đạt minimum activity contract.

Not qualifying:

- App open/login.
- Start rồi thoát.
- Xem vài giây video.
- Replay một activity đã hoàn thành mà không có daily review contract.
- AI Battle prototype.

Algorithm:

```text
Nếu local_date đã có streak_day → không tăng lần hai
Nếu last_date = hôm qua → current + 1
Nếu chưa có streak → 1
Nếu gap > 1 ngày → reset về 1
longest = max(longest, current)
```

Timezone change:

- Backend tính local date.
- Thay timezone được audit và không tạo thêm reward/streak day đã tồn tại.
- Áp dụng timezone mới cho activity tương lai; không rewrite lịch sử.
- Có cooldown/rule chống đổi liên tục, chốt chi tiết khi implement service.

MVP không có streak freeze. Có thể thêm sau bằng ledger riêng, không sửa lịch sử streak tùy ý.

## 8. Attempts và mastery

- Mỗi knowledge-check/quiz submission tạo attempt ID client-generated hoặc server-generated ổn định.
- Duplicate submission ID trả cùng kết quả.
- Store selected option IDs, score/result, activity version, timestamps và retry index cần thiết.
- Narrative/reflection choice không dùng accuracy metric.
- Mastery/accuracy tách khỏi XP; người học có thể cải thiện bằng retry mà không farm reward.

## 9. Offline và multi-device

- Client tạo operation ID cho pending checkpoint/attempt.
- Offline queue chỉ chứa operation tối thiểu, không secret/answer key.
- Khi sync, server dedupe bằng operation/idempotency ID.
- Completion/reward chỉ hiển thị confirmed sau server response; UI có thể báo `pending sync`.
- Checkpoint cũ không ghi đè completed/newer revision.
- Server timestamp và revision giải quyết conflict; device clock không quyết định reward day.

## 10. Analytics event catalog

Core events:

| Event | Trigger | Thuộc tính tối thiểu |
|---|---|---|
| `lesson_started` | Lần mở bắt đầu | lesson_id, version |
| `lesson_resumed` | Resume checkpoint | lesson_id, block_id |
| `block_completed` | Block đạt policy | lesson_id, block_id, kind |
| `episode_started` | Start VN version | story_version_id |
| `scene_viewed` | Scene hiện diện có ý nghĩa | story_version_id, scene_id, kind |
| `choice_selected` | Choice locked | scene_id, choice_id, choice_kind |
| `knowledge_check_submitted` | Attempt | activity_id, attempt_index, result |
| `video_started` | Play có tương tác | media_id, block_id |
| `video_completed` | Completion policy đạt | media_id, method |
| `media_error` | Media load/play failure | media_id, error_category |
| `fallback_used` | Transcript/poster fallback | block_id, fallback_type |
| `lesson_completed` | Trusted completion | lesson_id, completion_method |
| `reward_granted` | Ledger insert | reward_type, xp_delta |
| `streak_qualified` | First activity/day | local_date, current_streak |

Không đưa email, secret, raw access token, full free-text input hoặc toàn bộ dialogue vào analytics payload.

## 11. Product metrics

- Lesson start → completion rate.
- Median time to complete theo format.
- Resume success rate.
- Video fallback/error rate.
- Knowledge-check retry distribution.
- VN drop-off theo scene, không đánh giá đạo đức người dùng từ narrative choice.
- D1/D7 learning return (khi privacy consent/policy phù hợp).
- Streak qualification rate và repeat completion không thưởng.

Analytics aggregates không thay thế historical/content review và không được dùng để ép lựa chọn kể chuyện thành đúng/sai.

## 12. Privacy và retention

- Thu thập tối thiểu cho mục tiêu học tập/sản phẩm.
- Pseudonymous user ID cho analytics khi có thể.
- Tách authoritative learning record khỏi optional product analytics.
- Có policy retention/xóa account trước public release.
- Analytics opt-out không làm mất core progress; luật consent chi tiết xác nhận ở Phase 8/release.

## 13. Service operations

```ts
progressService.saveCheckpoint(input)
progressService.getResumePoint(lessonId)
completionService.completeActivity(input)
quizService.submitAttempt(input)
rewardService.getSummary()
streakService.getStatus()
analyticsService.track(event)
```

`completeActivity`/`submitScoredAttempt` là trusted operations; analytics track là best-effort và không quyết định reward.

## 14. Acceptance criteria

- Mỗi lesson/block type có completion policy rõ.
- XP table và one-time scope rõ.
- Unique idempotency ngăn reload/retry/multi-device cộng trùng.
- Streak account-bound, server-date, tối đa một lần/ngày.
- Offline operation sync không nhân đôi reward/attempt.
- Analytics event có purpose, minimal payload và không chặn learning.
- AI Battle prototype không thể tự cộng XP.

## 15. Rủi ro

- Người học tua video: unique watched ranges + fallback learning check.
- Timezone gaming: server calculation, unique local date, audited/cooldown change.
- Reward race condition: unique key + transaction.
- Analytics quá nhiều: core catalog, sampling/retention ở implementation.
- Gamification lấn át học tập: không trừ XP khi sai, mastery tách reward.

## 16. Quyết định cần duyệt

1. Completion policies theo loại block/lesson.
2. XP table MVP và no-penalty retry.
3. One-time reward ledger với idempotency.
4. Account streak một lần/ngày, không streak freeze ở MVP.
5. Video threshold 90% hoặc accessible fallback + required recap/check.
6. Final quiz default pass 70%, >=80% nhận bonus một lần.
7. Minimal privacy-aware analytics catalog.
8. AI Battle không trao XP thật trước integration review.

## 17. Những điều chưa làm

- Chưa tạo reward/streak/analytics migrations.
- Chưa implement transaction/RPC/Edge Function.
- Chưa cài analytics SDK.
- Chưa tạo achievement catalog chi tiết.
- Chưa thiết kế leaderboard, streak freeze hoặc monetization.

## Kết luận

Phase 7 đề xuất progress/reward đáng tin cậy, không cộng lặp, không phạt sai và giữ streak theo tài khoản. Sau khi duyệt, Phase 8 sẽ chốt test matrix, accessibility, historical/content QA và release blockers.
