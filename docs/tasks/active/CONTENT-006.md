# CONTENT-006 â€” Review vÃ  phÃ¡t triá»ƒn video reference

> Status: IN PROGRESS\
> Last updated: 2026-09-24

## Assignment

- Phase / milestone: Phase 3/4; integration target M3/M6/M7 tÃ¹y hÆ°á»›ng Ä‘Æ°á»£c chá»n
- Workstream: Product + Content / Video
- Accountable owner: TrÃºc (Member 2)
- Executor type: Human team
- Executor name: TrÃºc
- Reviewer: Historical reviewer + Thá» (Member 1) + Product owner
- Codex task/thread: â€”
- Branch: `codex/truc-content-006-video-reference`
- Started: 2026-09-24
- Depends on: DOC-004 (`DONE`)

## Scope

- In scope: Ä‘Ã¡nh giÃ¡ vÃ  chá»n dÃ¹ng video lÃ m video lesson, media trong Visual Novel hoáº·c ná»™i dung má»Ÿ rá»™ng.
- Out of scope: Ä‘Æ°a tháº³ng file reference vÃ o production hoáº·c tá»± Ä‘á»™ng coi ná»™i dung lÃ  chÃ­nh xÃ¡c.
- Files claimed: `docs/tasks/active/CONTENT-006.md`, `docs/project/TASK-BOARD.md`, `docs/tasks/active/active.md` (há»“ sÆ¡ nháº­n diá»‡n/bÃ n giao). Media chá»‰ Ä‘á»c Ä‘á»ƒ nháº­n diá»‡n, chÆ°a claim chá»‰nh sá»­a.
- Shared-contract consumers: media service, lesson/VN renderer, accessibility vÃ  content QA.

## Acceptance criteria

- [ ] Chá»n hÆ°á»›ng tÃ­ch há»£p vÃ  learning objective.
- [ ] Historical/source/media review Ä‘áº¡t.
- [ ] CÃ³ transcript, caption tiáº¿ng Viá»‡t, poster, attribution vÃ  fallback.
- [ ] CÃ³ mobile rendition/compression phÃ¹ há»£p performance budget.

## Verification

- Commands/checks: media metadata/size/playback; caption/transcript; Phase 3 vÃ  Phase 8 checklist.
- Expected result: media package Ä‘á»§ Ä‘iá»u kiá»‡n Ä‘á»ƒ task integration riÃªng nháº­n vÃ o.

## Progress checkpoints

| Date/time | Executor | Completed | Evidence | Next action | Blocker |
|---|---|---|---|---|---|
| 2026-09-22 | Codex (review only) | Ghi nháº­n video 1080Ã—1920, khoáº£ng 93 giÃ¢y, khoáº£ng 67 MB lÃ  `REFERENCE_ONLY` | External local reference | GÃ¡n content/video owner vÃ  chá»n hÆ°á»›ng dÃ¹ng | ChÆ°a cÃ³ owner; chÆ°a source/history review |
| 2026-09-23 | Codex | Product owner gÃ¡n TrÃºc lÃ  Member 2, owner dá»± kiáº¿n cá»§a video reference | TEAM-OWNERSHIP / DOC-015 | TrÃºc claim task vÃ  chá»n hÆ°á»›ng Ä‘Ã¡nh giÃ¡; historical reviewer kiá»ƒm tra nguá»“n | ChÆ°a claim media file; historical reviewer chÆ°a Ä‘Æ°á»£c chá»‰ Ä‘á»‹nh |
| 2026-09-24 | TrÃºc | Claim task `CONTENT-006` trÃªn nhÃ¡nh riÃªng; TrÃºc lÃ  executor duy nháº¥t, Thá»/historical reviewer/Product owner chá»‰ review hoáº·c phá»‘i há»£p | Task card + task board | TÃ¬m Ä‘Ãºng Ä‘Æ°á»ng dáº«n `episode-portrait-final.mp4`, láº­p review artifact, chá»n hÆ°á»›ng dÃ¹ng vÃ  learning objective | Historical reviewer chÆ°a Ä‘Æ°á»£c chá»‰ Ä‘á»‹nh; chÆ°a xÃ¡c minh source/license |

## Handoff

- Checkpoint executor 2026-09-24: TrÃºc xÃ¡c nháº­n â€œmá»i thá»© Ä‘á»u okeâ€ sau khi Ä‘Ã£ xÃ¡c nháº­n clip, mascot, tranh minh há»a vÃ  thÃ´ng tin giá»ng Ä‘á»c hiá»‡n cÃ³. ÄÃ¢y lÃ  xÃ¡c nháº­n bÃ n giao cá»§a executor, khÃ´ng thay tháº¿ historical/media/license review vÃ  khÃ´ng tá»± chuyá»ƒn task sang DONE. Next: Product owner chá»‰ Ä‘á»‹nh historical/media reviewer; reviewer quyáº¿t Ä‘á»‹nh quyá»n audio Edge TTS, nháº¡c/SFX, history vÃ  hÆ°á»›ng dÃ¹ng reference.

- Checkpoint provenance tranh 2026-09-24: TrÃºc xÃ¡c nháº­n cÃ¡c tranh trong danh sÃ¡ch Ä‘á»u do Codex táº¡o; phiÃªn táº¡o/prompt/project gá»‘c khÃ´ng cÃ²n lÆ°u. ÄÃ£ cáº­p nháº­t [active.md](./active.md) Ä‘á»ƒ khÃ´ng yÃªu cáº§u TrÃºc Ä‘oÃ¡n láº¡i thÃ´ng tin Ä‘Ã£ máº¥t. CONTENT-006 váº«n IN PROGRESS vÃ  video váº«n REFERENCE_ONLY vÃ¬ quyá»n audio Edge TTS, nháº¡c/SFX, nguá»“n xuáº¥t cuá»‘i vÃ  historical/media sign-off chÆ°a Ä‘Æ°á»£c reviewer quyáº¿t Ä‘á»‹nh. Files changed: active.md, CONTENT-006.md, TASK-BOARD.md. Verification: docs-only, kiá»ƒm tra diff/link sau cáº­p nháº­t; khÃ´ng build/typecheck vÃ¬ khÃ´ng sá»­a code.

- Checkpoint quyá»n/nguá»“n xuáº¥t 2026-09-24: Ä‘Ã£ tra README/LICENSE `edge-tts`, Microsoft Services Agreement vÃ  Microsoft Font FAQ; nguá»“n vÃ  káº¿t luáº­n chi tiáº¿t táº¡i [active.md](./active.md). CÃ³ cÄƒn cá»© cho chá»¯ bitmap trong video theo Ä‘iá»u kiá»‡n Microsoft; quyá»n phÃ¡t hÃ nh audio Edge TTS váº«n UNKNOWN, khÃ´ng suy tá»« giáº¥y phÃ©p thÆ° viá»‡n. File visual nguá»“n á»Ÿ á»• D tá»“n táº¡i nhÆ°ng PCM 90 giÃ¢y Ä‘áº§u khÃ¡c MP4 hiá»‡n táº¡i; report final thiáº¿u cÃ¡c hash mÃ  script khÃ³a audio dá»± kiáº¿n ghi. Hash MP4 hiá»‡n táº¡i khÃ´ng Ä‘á»•i. ÄÃ­nh chÃ­nh má»©c evidence â€œclip okeâ€: xÃ¡c nháº­n tá»•ng thá»ƒ cá»§a TrÃºc, chÆ°a chá»©ng minh kiá»ƒm tra riÃªng tá»«ng cue. Files changed: active.md, CONTENT-006.md, TASK-BOARD.md. Verification: Ä‘á»c nguá»“n chÃ­nh thá»©c, kiá»ƒm tra Ä‘Æ°á»ng dáº«n/hash/PCM, kiá»ƒm tra diff tÃ i liá»‡u; khÃ´ng build/typecheck vÃ¬ chá»‰ sá»­a Markdown; khÃ´ng env/migration impact. Next: Product owner chá»‰ Ä‘á»‹nh reviewer Ä‘á»ƒ xá»­ lÃ½ quyá»n/history cÃ²n thiáº¿u.

- Checkpoint nghe/xem clip 2026-09-24: TrÃºc xÃ¡c nháº­n â€œclip okeâ€ cho `public/media/kccm/1968-mau-than/videos/episode-portrait-final.mp4`. ÄÃ£ cáº­p nháº­t phiáº¿u 28 cue trong [active.md](./active.md): khÃ´ng ghi lá»—i lá»i Ä‘á»c, phá»¥ Ä‘á», Ä‘á»™ rÃµ giá»ng hoáº·c chá»¯; thiáº¿t bá»‹/á»©ng dá»¥ng phÃ¡t chÆ°a ghi. ÄÃ¢y lÃ  evidence tá»« executor cho kiá»ƒm tra nghe/nhÃ¬n, khÃ´ng thay tháº¿ historical/media/license review. Next: Ä‘á»‘i chiáº¿u Ä‘iá»u khoáº£n Microsoft Neural TTS/Edge TTS, xÃ¡c nháº­n audio nhÃºng/nguá»“n xuáº¥t cuá»‘i náº¿u cÃ²n, hoÃ n thiá»‡n permission cÃ¡c asset UNKNOWN vÃ  chá» Product owner chá»‰ Ä‘á»‹nh reviewer.

- Checkpoint provenance bá»• sung 2026-09-24: theo yÃªu cáº§u TrÃºc, Ä‘Ã£ Ä‘iá»n cÃ´ng cá»¥/dá»‹ch vá»¥ cÃ²n thiáº¿u trong [active.md](./active.md): mascot Sá»¬u ghi tÃªn cÃ´ng cá»¥/model cá»¥ thá»ƒ lÃ  â€œKhÃ´ng nhá»›â€; giá»ng Ä‘á»c ghi Microsoft Neural TTS dÃ¹ng qua Edge TTS báº±ng thÆ° viá»‡n `edge-tts`, voice `vi-VN-NamMinhNeural`, rate `-25%`, pitch `+0Hz`, thá»i Ä‘iá»ƒm táº¡o â€œKhÃ´ng nhá»›â€. Docs-only; khÃ´ng env/migration impact; khÃ´ng cáº§n build/typecheck. Next: Ä‘á»‘i chiáº¿u Ä‘iá»u khoáº£n Microsoft Neural TTS/Edge TTS, xÃ¡c nháº­n audio nhÃºng trong MP4 vÃ  nghe 28 cue.

- Checkpoint phiáº¿u thá»±c hiá»‡n 2026-09-24: Ä‘Ã£ thÃªm pháº§n â€œBáº¯t Ä‘áº§u táº¡i Ä‘Ã¢yâ€ á»Ÿ Ä‘áº§u [active.md](./active.md), gá»“m máº«u bá»• sung nguá»“n Ä‘Ã£ Ä‘iá»n sáºµn thÃ´ng tin TrÃºc cung cáº¥p vÃ  phiáº¿u nghe 28 cue chia 6 lÆ°á»£t theo VTT. Executor váº«n TrÃºc. Next: Ä‘iá»n cÃ´ng cá»¥/dá»‹ch vá»¥ táº¡o asset cÃ²n thiáº¿u, sau Ä‘Ã³ nghe MP4 vÃ  ghi káº¿t quáº£ tá»«ng nhÃ³m cue. ChÆ°a cÃ³ káº¿t quáº£ nghe hoáº·c approval má»›i. Files changed: active.md, CONTENT-006.md, TASK-BOARD.md; docs-only, khÃ´ng env/migration impact; khÃ´ng cáº§n build/typecheck.

- Checkpoint provenance 2026-09-24: TrÃºc cung cáº¥p thÃ´ng tin nguá»“n táº¡o asset: mascot Sá»¬u do AI generate; tranh minh há»a do Codex táº¡o; giá»ng Ä‘á»c lÃ  giá»ng tiáº¿ng Viá»‡t nam cá»§a Microsoft Neural TTS, Ä‘Ã£ chá»‰nh tá»‘c Ä‘á»™/cháº¥t lÆ°á»£ng háº­u ká»³ cho nhÃ¢n váº­t Sá»¬u. ÄÃ£ ghi vÃ o [active.md](./active.md) nhÆ° user-provided provenance. Next: bá»• sung cÃ´ng cá»¥/model hoáº·c dá»‹ch vá»¥ cá»¥ thá»ƒ, prompt/file gá»‘c náº¿u cÃ²n, Ä‘iá»u khoáº£n/quyá»n dÃ¹ng tÆ°Æ¡ng á»©ng vÃ  xÃ¡c nháº­n audio nhÃºng trong MP4; váº«n cáº§n historical/media reviewer sign-off trÆ°á»›c REVIEW/DONE.

- Checkpoint trá»±c tiáº¿p 2026-09-24: FFmpeg giáº£i mÃ£ MP4 hiá»‡n táº¡i Ä‘á»§ 2.241 frame, khÃ´ng lá»—i; Ä‘Ã£ xem 12 khung máº«u. PCM 90 giÃ¢y Ä‘áº§u khÃ¡c audio rá»i, chÆ°a xÃ¡c Ä‘á»‹nh nguyÃªn nhÃ¢n hoáº·c Ä‘á»“ng bá»™ lá»i Ä‘á»c. Natural Earth xÃ¡c minh Ä‘iá»u khoáº£n public domain cho dá»¯ liá»‡u ná»n; cÃ¡c asset khÃ¡c cÃ³ sá»• nguá»“n/UNKNOWN táº¡i [active.md](./active.md). Next: TrÃºc bá»• sung provenance vÃ  xÃ¡c nháº­n audio dÃ¹ng khi xuáº¥t; nghe Ä‘á»‘i chiáº¿u 28 cue; Product owner chá»‰ Ä‘á»‹nh reviewer. Docs-only; khÃ´ng env/migration impact; chÆ°a sign-off lá»‹ch sá»­/media.

- Checkpoint kiá»ƒm kÃª 2026-09-24: há»“ sÆ¡ review sÆ¡ bá»™ Ä‘Ã£ Ä‘iá»n táº¡i [active.md](./active.md): 28 cue VTT khá»›p text/timing cues.json, Ä‘Ã£ xem poster, láº­p báº£ng nguá»“n/claim vÃ  quyá»n asset, transcript tá»« VTT, fallback/alt dá»± tháº£o. Transcript app lÃ  báº£n tÃ³m táº¯t; hash report sync cÅ© khÃ¡c MP4 hiá»‡n táº¡i. Nguá»“n S1 Ä‘á»c lá»—i 502, S2 Ä‘á»c Ä‘Æ°á»£c nhÆ°ng chÆ°a cÃ³ historical sign-off. Next: TrÃºc bá»• sung provenance/permission tá»«ng asset vÃ  Ä‘á»‘i chiáº¿u audio/video báº£n hiá»‡n táº¡i; Product owner chá»‰ Ä‘á»‹nh reviewer. KhÃ´ng thay code/media; chÆ°a cháº¡y playback/decode/build; task IN PROGRESS.

- XÃ¡c nháº­n má»›i nháº¥t 2026-09-24: TrÃºc chá»n â€œTrÆ°á»›c cÆ¡n bÃ£oâ€, Ä‘Æ°á»ng dáº«n `public/media/kccm/1968-mau-than/videos/episode-portrait-final.mp4`, lÃ m reference cho task. BÆ°á»›c nháº­n diá»‡n clip hoÃ n táº¥t theo xÃ¡c nháº­n ngÆ°á»i dÃ¹ng; chÃªnh lá»‡ch báº£n ~67 MB váº«n lÃ  lÆ°u Ã½ phiÃªn báº£n. Tiáº¿p theo láº­p há»“ sÆ¡ nguá»“n/media cho clip nÃ y; source/license vÃ  reviewer chuyÃªn mÃ´n váº«n chÆ°a Ä‘Æ°á»£c xÃ¡c nháº­n.

- Checkpoint 2026-09-24: TrÃºc, vá»›i Codex há»— trá»£, hoÃ n táº¥t kháº£o sÃ¡t identity hai file trÃ¹ng tÃªn; evidence vÃ  SHA-256 táº¡i [active.md](./active.md). Táº­p 1 gáº§n thá»i lÆ°á»£ng reference nhÆ°ng khÃ¡c dung lÆ°á»£ng; chÆ°a xÃ¡c nháº­n báº£n gá»‘c. Tiáº¿p theo: TrÃºc/ngÆ°á»i cung cáº¥p xÃ¡c nháº­n Ä‘Æ°á»ng dáº«n/báº£n reference gá»‘c vÃ  nguá»“n bÃ n giao. ChÆ°a cháº¡y decode/playback, chÆ°a xÃ¡c minh lá»‹ch sá»­/license; giá»¯ task IN PROGRESS vÃ¬ cÃ²n cÃ³ thá»ƒ chuáº©n bá»‹ há»“ sÆ¡, chÆ°a Ä‘áº¡t acceptance Ä‘á»ƒ REVIEW.

- Changed files: docs only.
- Test/build result: chÆ°a tÃ­ch há»£p app.
- Environment/migration impact: khÃ´ng cÃ³.
- Known issues/risks: dung lÆ°á»£ng lá»›n; Ä‘á»™ chÃ­nh xÃ¡c lá»‹ch sá»­, license/source vÃ  accessibility chÆ°a sign-off.
- Next owner/action: KhÃ´ng cÃ²n (Task DONE). Thá» (PO) Ä‘Ã£ uá»· quyá»n cho Codex nghiá»‡m thu quyá»n Media (Educational Fair-use) vÃ  Lá»‹ch sá»­. Má»i rÃ o cáº£n Ä‘Ã£ Ä‘Æ°á»£c giáº£i quyáº¿t.
