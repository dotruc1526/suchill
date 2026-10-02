# Completed task cards

Đặt task card đã được reviewer xác nhận `DONE` tại đây. Không xóa checkpoint/evidence cũ.

## Delegated all-task review — 2026-10-02

Accepted by Codex specialists and root cross-review under explicit user delegation; [evidence/remaining prerequisites](../../engineering/review-all/EVIDENCE.md). No new named human approval or milestone closure is inferred.

- [M3-06](./M3-06.md), [M3-07](./M3-07.md), [M3-UX-02](./M3-UX-02.md) — completion/profile, learning QA and Home visual/service journey.
- [M4-02](./M4-02.md), [M4-03](./M4-03.md), [M4-04](./M4-04.md) — versioned content/account schema and actual native SQL/RLS matrix.
- [M5-01](./M5-01.md), [M5-02](./M5-02.md), [M5-03](./M5-03.md), [M5-04](./M5-04.md), [M5-05](./M5-05.md), [M5-06](./M5-06.md), [M5-07](./M5-07.md) — trusted progress/completion/rewards/streak/assessment/privacy/offline.
- [CONTENT-014](./CONTENT-014.md), [CONTENT-017](./CONTENT-017.md) — draft authoring acceptance; media/runtime publication remains separate.
- [DOC-017](./DOC-017.md) — current task/content documentation sync; historical Git-object limitation recorded.
- [QA-REVIEW-ALL-001](./QA-REVIEW-ALL-001.md) — audit complete; 16 accepted cards and 11 documented external prerequisites.

- [M3-INTEGRATION-01](./M3-INTEGRATION-01.md) — Journey/renderer/player slots; PR #79 merged `a55b924`, Hưng/Vinh approved và 2/2 Quality PASS.

- [M3-UX-01](./M3-UX-01.md) — UI/UX handoff; PR #77 merged, Hưng/Vinh approved và Dương/PO nghiệm thu tại `23cf354`.
- [M3-01](./M3-01.md) — Learning journey; PR #72 merged, Vinh approved và Hưng không còn finding tại `71cbad2`.
- [M3-02](./M3-02.md) — Lesson renderer; PR #73 merged, Vinh approved và Hưng không còn finding tại `6117578`.
- [M3-03](./M3-03.md) — Visual Novel v2; PR #74 merged `fc00d65`, Hưng approved `7fabea3`, Vinh approved progress/QA.
- [M3-04](./M3-04.md) — Video player; PR #75 merged, Hưng/Vinh approved `0636c89`.
- [M3-05](./M3-05.md) — Quiz flow; PR #76 merged, Hưng/Vinh approved `fc7a830`.

- [DOC-018](./DOC-018.md) — Product Owner Dương audit Gate M2 đạt; đóng M2 và mở M3 ngày 2026-10-01.
- [QA-006](./QA-006.md) — E2E Chrome cleanup/target discovery được bounded; cả hai Quality checks PR #71 pass.
- [M2-01](./M2-01.md) — Domain types v2; Hưng ACCEPTED 2026-09-30 trên main `7175bda`; gate M2 do PO quyết riêng.
- [M2-02](./M2-02.md) — Validators; Hưng ACCEPTED 2026-09-30; fail-closed publication lookup đạt.
- [M2-03](./M2-03.md) — Service contracts; Hưng ACCEPTED 2026-09-30; document/practice/per-question contracts đạt.
- [M2-04](./M2-04.md) — Mock adapters; Hưng ACCEPTED 2026-09-30; published reads, session isolation và quiz boundaries pass.
- [M2-05](./M2-05.md) — Legacy mapper; Hưng ACCEPTED 2026-09-30; Dương consumer boundary đạt, demo giữ fixture-only.
- [M2-06](./M2-06.md) — Contract tests; Hưng ACCEPTED 2026-09-30; 47 unit + 9 component + E2E pass trên GitHub Quality `7175bda`.
- [CONTENT-016](./CONTENT-016.md) — Thọ và Trúc đã approve flagship Visual Novel authoring brief; narration/StoryVersion/media tiếp tục chịu gate riêng.
- [DOC-010](./DOC-010.md) — Phase 9 và context hardening; product owner duyệt ngày 2026-09-23.
- [DOC-016](./DOC-016.md) — Product owner duyệt đóng M0 và mở M1 ngày 2026-09-28.
- [M1-01](./M1-01.md) — token contract/design handoff đã được triển khai trong FE-003 và QA xác nhận sau PR #33.
- [M1-04](./M1-04.md) — layout/navigation safe-area và BottomNav touch target đã được Vinh QA xác nhận trong PR #40.
- [M1-05](./M1-05.md) — motion/reduced-motion/sound/mute foundation đã được review trong PR #33; không bao gồm feature polish.
- [M1-06](./M1-06.md) — component QA showcase/accessibility evidence đạt; chờ Product owner quyết định gate M1.
- [FE-003](./FE-003.md) — tokens/UI primitives/shared states đạt review UI/UX và QA; PR #33 merged, quality pass.
- [BEQA-LOCAL-001](./BEQA-LOCAL-001.md) — Vinh chấp nhận bản chuẩn bị Backend + QA local ngày 2026-09-26; không thay thế nghiệm thu các task M0 chính thức.
- [M0-00](./M0-00.md) — Product owner duyệt phân task qua ảnh chat; Vinh chuyển xác nhận nhóm ngày 2026-09-26, không thay thế gate M0.
- [M0-01](./M0-01.md) — baseline typecheck/build/smoke-test đạt; Vinh xác nhận nhóm đã chấp nhận kết quả ngày 2026-09-26, không thay thế gate M0.
- [M0-02](./M0-02.md) — typecheck/build đạt trên HEAD có PR #12/#13; Vinh chuyển xác nhận Hưng ngày 2026-09-27.
- [M0-03](./M0-03.md) — cô lập 10 screens legacy, boundary/quality/UI smoke đạt.
- [M0-04](./M0-04.md) — App 95 dòng, typed router, quality và navigation smoke đạt.
- [M0-05](./M0-05.md) — unit/component/E2E smoke đạt; không thêm dependency runtime; PR #24 đã merge, bổ sung fix reproducibility Node 24 ngày 2026-09-28.
- [M0-07](./M0-07.md) — `npm run quality` contract local/CI đạt; PR #24 đã merge và CI xanh; Node 24/26 support được ghi trong package/README.
- [M0-06](./M0-06.md) — env/secret guard và scan đạt; Hưng và Product owner xác nhận qua lời Vinh ngày 2026-09-27; rotation thật trước M4.

## Hosted technical acceptance — 2026-10-02

- [M4-01](./M4-01.md) — DONE after fresh hosted verification and independent technical review; formal milestone/content/release gates remain separate.
- [M4-05](./M4-05.md) — DONE after fresh hosted verification and independent technical review; formal milestone/content/release gates remain separate.
- [M4-06](./M4-06.md) — DONE after fresh hosted verification and independent technical review; formal milestone/content/release gates remain separate.
- [M4-07](./M4-07.md) — DONE after fresh hosted verification and independent technical review; formal milestone/content/release gates remain separate.
- [M4-08](./M4-08.md) — DONE after fresh hosted verification and independent technical review; formal milestone/content/release gates remain separate.
- [M3-M5-DELIVERY](./M3-M5-DELIVERY.md) — DONE after fresh hosted verification and independent technical review; formal milestone/content/release gates remain separate.
- [SUPABASE-HOSTED-001](./SUPABASE-HOSTED-001.md) — DONE after fresh hosted verification and independent technical review; formal milestone/content/release gates remain separate.
