# M3-06 — Completion/profile preparation

> Status: APPROVED preparation — agreement D1–D7 ghi trong card ngày 2026-10-02; adapter contract đã triển khai trên PR88, chưa merge
> Date: 2026-10-02; runtime contract `68580ed`; PR88 MERGED, PR92 handoff complete, M3-06 READY.

## Inputs and gaps tại thời điểm preparation 2026-10-01

- [Phase 7](../../specs/phases/07-progress-reward-analytics-spec.md) là nguồn completion/reward/streak policy; [roadmap](../../specs/phases/09-implementation-roadmap.md) cho phép M3-06 trên mock sau M3-01..05.
- `ProgressService` hiện có checkpoint/resume; không có trusted completion operation. `UserService` có current profile nhưng chưa có XP/streak/achievement read model.
- `saveCheckpoint` không phải completion/reward authority; không dùng nó để tự set completed hoặc cộng XP trong React.
- FE-008 còn phụ thuộc backend; M3-06 chỉ xây consumer UI trên mock contract đã review.

## Contract proposal — approved with agreement D1–D7

Thiết kế sau đã được review; agreement D1–D7 trong [task card](../done/M3-06.md) chốt các quyết định. Vinh vẫn phải claim files và triển khai/test trước UI consumer:

- `completion.completeLesson({ lessonId, operationId })`: service kiểm tra authored version và required block progress/attempts đã lưu; trả completion receipt với lesson/version identity, confirmed completion time và reward receipt. Caller không gửi XP, streak, passed hay eligibility flag.
- `completion.getLessonCompletion(lessonId)`: phục hồi receipt confirmed khi remount/reload; phân biệt chưa complete và lỗi đọc.
- `users.getAccountSummary()`: trả user identity, confirmed total XP, current/longest streak, timezone, lesson count và achievements có stable IDs. Empty/unauthorized không giả định là tài khoản có 0 XP.
- Cần định nghĩa receipt phân biệt reward granted/already granted/no reward; completion thành công không đồng nghĩa mỗi lần có XP mới.
- Adapter lấy user từ session, reject missing/foreign IDs; key dedupe gắn account + activity + eligibility version. Operation ID chống retry; reward eligibility key chống replay với operation ID mới.
- M3 mock store injectable để mô phỏng recreate adapter/reload; không tuyên bố cross-device/backend persistence. Timezone/date fixtures deterministic.
- Nếu chưa đủ block evidence: trả kết quả typed rõ ràng (review việc mở rộng error union hoặc typed completion outcome); không ép `server_error` cho mọi policy failure.
- Text/recap explicit completion, VN end/required attempts, video threshold/fallback và scored quiz phải có evidence adapter kiểm tra. Không nhận completedBlockIds tự khai báo làm bằng chứng duy nhất cho reward.
- Account summary lỗi sau completion: giữ receipt confirmed, báo summary chưa tải được và cho retry read; không submit completion lại chỉ để refresh profile.

## UI states

| State | Display | Action |
|---|---|---|
| Ready/ineligible | Điều kiện cần hoàn tất; không hứa XP | Tiếp tục bài |
| Submitting | Đang xác nhận hoàn thành | Chặn double submit |
| Offline/pending | Chưa xác nhận; XP/streak confirmed giữ nguyên | Retry cùng operation/payload |
| Confirmed | Receipt hoàn thành, reward delta service xác nhận | Xem profile/quay lại journey |
| Already rewarded | Bài đã hoàn thành; không cộng thưởng lần nữa | Xem profile |
| Read error | Số liệu chưa tải được; không hiển thị 0 như kết quả | Retry read |
| Empty/unauthorized | Chưa có dữ liệu account | Message phù hợp mock session |

Loading/error announcements dùng status/alert phù hợp; heading/focus sau navigation, targets 44px và reduced motion theo foundation. Không optimistic cộng total XP.

## File ownership and merge order

1. Vinh/Hưng review proposal; ghi agreement trong card trước đổi shared contract. Owner Vinh claim contracts/mock/test files; Dương là consumer reviewer.
2. Contract/mock adapter/tests merge trước UI consumer. Mỗi interface mở rộng phải cập nhật mọi mock/fixture consumer và typecheck.
3. Dương claim module completion/profile riêng. Không chạm Home files đang claim bởi #81/#82; không mở rộng #83 E2E trước QA handoff.
4. Sau #81/#82 merge, cập nhật integration branch trên main mới và claim App/journey thay đổi riêng nếu cần, với Hưng review composition.
5. M3-07 chạy full mixed lesson loop sau M3-06; reviewer xác nhận rồi PO quyết Gate M3.

## Verification matrix

| Layer | Assertions |
|---|---|
| Adapter | Required evidence missing rejects; valid evidence completes; retry/race/replay grants once; user isolation; timezone/day deterministic |
| Controller | Offline retains operation ID; pending does not alter confirmed totals; stale account requests ignored; summary read retry does not resubmit completion |
| Component | Pending/confirmed/already rewarded copy; error/empty states; text/icon feedback; keyboard/status semantics |
| Browser | Mixed blocks → completion → profile → return; duplicate click/reload; retry; stable checkpoint; 375/430px and Vietnamese long names |
| Quality | Typecheck/build/client-secret scan and required tests; no migration/env changes in M3 mock |

## Review decisions needed

- Vinh: receipt/account-summary schema, evidence authority, reward eligibility identity, persistence limits và error semantics.
- Hưng: service placement và feature/composition boundaries.
- Dương: completion → profile navigation và copy pending/confirmed. Implementation acceptance chỉ đánh dấu sau tests, không từ preparation này.

## Consumer controller preparation — 2026-10-02

- [Controller/test preparation](./M3-06-controller-plan.md) uses unchanged contract runtime 68580ed; PR88 merged and PR92 handoff complete. Earlier gap notes are historical.
- Plan đã ghi thành tài liệu; implementation/tests chưa chạy, không runtime claim hoặc acceptance UI.


## Current post-PR92 handoff — 2026-10-02

- PR88 merged `a339af6`; PR92 merged main `c29e4a7`, closes [adapter card](../done/M3-COMPLETION-01.md) DONE and confirms Vinh handoff. Runtime unchanged from `68580ed`; reviewed final PR88 head `e6a3940`, CI 2/2 PASS.
- [M3-06 card](../done/M3-06.md) READY; Dương must record runtime branch/controller/UI/tests file claim before READY → IN PROGRESS. No additional Vinh closure is pending. PR90 docs does not block the UI claim.
- 18 UI scenarios remain planned; M3-07 BACKLOG until M3-06 acceptance. M3 OPEN/M4 LOCKED.
