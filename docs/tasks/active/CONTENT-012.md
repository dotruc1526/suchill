# CONTENT-012 — Ngân hàng câu hỏi

> Status: REVIEW
> Last updated: 2026-10-02

## Assignment

- Owner: Thọ (Member 1).
- Executor: Trúc (Member 2), Codex hỗ trợ sửa PR #21 theo quyền Thọ cấp.
- Reviewer: Trúc (historical/learning/media theo quyền Thọ giao); Vinh (technical QA); sign-off bản mới còn chờ.
- Started: 2026-09-27 (lượt sửa); bản nháp trước do Thọ thực hiện.
- Branch revision hiện hành: PR #21 đã merge; verdict 2026-10-02 của Trúc nằm trên nhánh PR #99 `codex/tho-content017-closeout`, merged `ddd73d4`.
- Depends on: CONTENT-008 (DONE trên nhánh PR); sửa bản nháp trong content track, không mở M1.
- Files claimed: `docs/content/QUIZ-MT68.json`; card này. Registry/catalog/board do cùng executor Trúc đồng bộ theo [handoff PR21](./PR21-HANDOFF.md).
- Next action: technical authoring QA/handoff accepted by Hưng/Trúc; remaining media/production acceptance before any release. Keep draft/authoring-only, no seed/integrate.
- Blocker: media rights/assets and production approval remain pending. Không phát hành, tích hợp hoặc seed.

## Acceptance

- [x] Năm câu có objective/source hợp lệ; không dùng đáp án lịch pháp thiếu căn cứ; chưa seed production. (Trúc verdict 2026-10-02 cho reviewed hash `4013b399…667eb`; quiz vẫn `draft` + `authoringOnly`, chưa seed.)
- [x] Reviewer xác nhận nội dung/learning objective. (Trúc APPROVED historical/learning scope 2026-10-02; verdict riêng cho quiz, không suy từ CONTENT-010.)
- [ ] Media có quyền, caption/alt/fallback và nguồn item cụ thể trước phát hành.
- [x] Technical QA và handoff được xác nhận trong authoring scope: Hưng ACCEPTED QA at c7a84d6; Trúc handoff at e3987fb; PR99 merged ddd73d4. Media/production remain separate.

## Checkpoint

- 2026-09-27: nhận sửa PR #21 từ `4fa6cd0`; chuẩn hóa ACTIVE, hoàn tất bản sửa tài liệu và chuyển REVIEW. Không ghi sign-off thay reviewer.
- Evidence, kết quả kiểm tra và phần thiếu: [PR21-HANDOFF.md](./PR21-HANDOFF.md).

## Checkpoint — 2026-10-02

- `QUIZ-MT68.json` vẫn `draft` / `NEEDS_HISTORICAL_REVIEW` tại SHA-256 `4013b39954779b0b43640372b668c329662ca30386aff52c2c4cd8a664e667eb`.
- Historical report ngày 2026-09-28 không liệt kê CONTENT-012 trong phạm vi verdict; technical QA của Vinh chỉ kiểm tra schema/ID/objectives/answer explanations, không phải historical/learning acceptance.
- Next: Trúc/historical reviewer review và ghi verdict riêng đúng hash; tới lúc đó giữ trạng thái pending và chưa tích hợp quiz.

- Checkpoint bổ sung 2026-09-27: Trúc được giao toàn bộ revision; [CONTENT-014](./CONTENT-014.md) chứa bản authoring và kiểm tra mới. Không ký sign-off thay người review.

## Technical QA checkpoint — Vinh, 2026-10-01

- Technical structure/reference checks **ACCEPTED** trên snapshot `30d0a4f` trong [CONTENT-014 QA report](../evidence/CONTENT-014-technical-qa.md); giới hạn/checked inputs có SHA-256 trong report.
- Overall handoff vẫn **CHANGES REQUESTED** P2: Trúc cần đồng bộ review record với artifact pending flags và ghi đúng revision được historical reviewer duyệt. Quiz approval không được suy từ approval của các lesson.
- Task giữ REVIEW; technical approval không thay historical/media/PO production acceptance. Combined technical+handoff/media checklist chưa đánh dấu hoàn tất.

## Historical recheck — Vinh, 2026-10-02 (base 2abd202, before PR99 verdict)

- Đã kiểm tra trên `origin/main` `2abd202`: chưa có verdict historical/learning riêng cho quiz tại SHA-256 `4013b39954779b0b43640372b668c329662ca30386aff52c2c4cd8a664e667eb` (card, board, historical report 2026-09-28 và main tại base đều xác nhận còn pending; verdict của Trúc đã ghi trong PR #99 mở).
- `QUIZ-MT68.json` byte-identical với snapshot đã QA, giữ `NEEDS_HISTORICAL_REVIEW` đúng; validator PASS.
- Vinh technical QA quiz vẫn chờ Trúc/historical reviewer ghi verdict riêng đúng hash. Không seed/integrate. Task giữ REVIEW.

## Objective pre-review — Codex hỗ trợ Thọ, 2026-10-02

Chuẩn bị cho verdict của Trúc/historical reviewer; đây là rà soát learning-design, **không phải historical/learning verdict** và không tick acceptance nào.

- Quiz bytes không đổi từ `a9fd169` (2026-09-27): SHA-256 LF-normalized `4013b399…667eb` khớp card; working tree sạch; `validate-mt68-authoring.mjs` PASS (5 câu, source/claim IDs và local links hợp lệ).
- Mapping câu hỏi → CLO trong `CURRICULUM-MAP.md`: q-01→CLO-1 (địa bàn đô thị, explanation tránh khẳng định đồng loạt); q-02→CLO-2 (list-membership mục tiêu); q-03→CLO-3 (hầm 287/70 vai trò hậu cần, explanation loại trừ vai trò chỉ huy); q-04/q-05→CLO-4 (phân biệt bước ngoại giao, tránh đơn nhân).
- Source IDs tồn tại trong registry `HISTORICAL-SOURCES.md`: q-01/q-05→SRC-MT68-01, q-02→SRC-MT68-02, q-03→SRC-MT68-05, q-04→SRC-MT68-06 (+SRC-MT68-01 cho q-05).
- Cross-check q-02: đáp án D "Đài Phát thanh Sài Gòn" khớp node 3/5 `MAP-MT68.json` (`mt68-node-radio`, CLM-MT68-01, SRC-MT68-02); câu hỏi chỉ hỏi list-membership, đúng giới hạn "danh sách không chứng minh chiếm giữ" của CLM-MT68-01.
- Mỗi câu có đúng một đáp án, explanation gắn misconception cụ thể; không phát hiện đáp án thiếu căn cứ ở mức objective.
- Next không đổi: Trúc/historical reviewer ghi verdict riêng đúng hash quiz; Vinh technical QA sau đó. Không seed/integrate.

## Historical/learning verdict — Trúc (Member 2), 2026-10-02

Verdict riêng cho quiz, không suy từ CONTENT-010 hay bất kỳ lesson nào.

- Artifact: `docs/content/QUIZ-MT68.json`, revision SHA-256 (LF-normalized) `4013b39954779b0b43640372b668c329662ca30386aff52c2c4cd8a664e667eb`.
- Verdict: **APPROVED** cho phạm vi historical accuracy + learning design (nội dung sử liệu, thuật ngữ và CLO).
- Đối chiếu từng câu:
  - q-01 → CLO-1: đáp án "Nhiều đô thị miền Nam" khớp FACT-001 (đợt 1 Mậu Thân 1968 tại nhiều đô thị), explanation chặn khẳng định đồng loạt, đúng giới hạn CLM-MT68-07; nguồn SRC-MT68-01.
  - q-02 → CLO-2: chỉ hỏi list-membership ("có trong danh sách"), đáp án Đài Phát thanh Sài Gòn khớp node 3/5 `MAP-MT68.json` và FACT-003 (5 mục tiêu, NXB QĐND tr. 142–186); không khẳng định chiếm giữ, đúng giới hạn CLM-MT68-01; nguồn SRC-MT68-02.
  - q-03 → CLO-3: vai trò hầm Trần Văn Lai là "nơi cất giấu và nhận vũ khí" khớp FACT-002 và Bài 3; explanation loại trừ vai trò chỉ huy toàn chiến trường; không nêu tên đường nên tránh lỗi niên đại Trần Quý Cáp/Võ Văn Tần; nguồn SRC-MT68-05.
  - q-04 → CLO-4: mốc 13/5/1968 là phiên họp toàn thể đầu tiên VNDCCH–Mỹ tại Paris, khớp FACT-007 và Document 230; explanation phân biệt với ký Hiệp định Paris, đúng giới hạn CLM-MT68-06; nguồn SRC-MT68-06.
  - q-05 → CLO-4: đáp án B diễn giải tác động dư luận/chính sách và phân biệt bước ngoại giao, khớp Bài 4 và CLM-MT68-05; các phương án sai là đúng các misconception cần tránh (kết thúc ngay, đơn nhân, đàm phán = ký); nguồn SRC-MT68-01/06.
- Kiểm tra chung: mỗi câu một đáp án đúng; explanation gắn misconception; không có thuật ngữ cấm ("Việt Cộng", "Chiến tranh Việt Nam"); không dùng thơ chúc Tết, múi giờ GMT, chi tiết vi mô hay nhầm Chèm/Cổ Loa làm đáp án; source IDs tồn tại trong registry.
- Giới hạn verdict: chỉ historical/learning scope. Không thay technical QA của Vinh, media review, hay production/seed approval. Quiz giữ `status: draft` và `authoringOnly: true`.
- Đồng bộ trạng thái: `reviewStatus` `NEEDS_HISTORICAL_REVIEW` → `APPROVED_BY_HISTORICAL_REVIEWER`; reviewed SHA-256 `4013b399…667eb`, current SHA-256 `44b9eed6fc1c94cbf8b4b662eaeb2580ad55b08994286bba2b86cf1891103912`. `validate-mt68-authoring.mjs` PASS sau đồng bộ.
- Next: Vinh technical QA; task giữ REVIEW cho đến khi technical QA + media/handoff đạt. Không seed/integrate.

## Technical QA after separate quiz verdict — Vinh, 2026-10-02

- Trúc recorded historical/learning APPROVED in PR99 (`fbaf3b3`) for reviewed hash `4013b399…667eb`; current status-only hash `44b9eed6…3912`. PR99 is now merged `ddd73d4`; its main quiz bytes match the tested snapshot. Earlier pending entries describe their historical base.
- Vinh **ACCEPTED technical authoring scope** on exact PR99 `7d94d94`: hashes/status-only delta, 5 questions/20 options, stable IDs, answer/source/objective references, nonempty wording/explanations PASS; 5 malformed-input probes rejected; pristine validator PASS after restoration.
- [Evidence and limits](../evidence/CONTENT-012-technical-qa-2026-10-02.md). Technical QA/handoff is accepted by Hưng/Trúc and integrated here; remaining media checklist stays open; no runtime or production acceptance inferred.
