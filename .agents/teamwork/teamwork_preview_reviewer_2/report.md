# Review Round 2 Report — CONTENT-009 (Adversarial Review)

## 1. Executive Summary
teamwork_preview_reviewer_2 executed an adversarial review against the prior attempt for task **CONTENT-009** (Research candidate topics and sources for the Air War in the Resistance War against America). By actively probing edge cases, cross-referencing military history, auditing bibliographic catalogs, and validating Phase 3 Governance schemas, several non-trivial defects, a phantom fix, and task tracking desynchronizations were identified and resolved.

## 2. Defects Identified & Resolved

### Issue 1: Phantom Fix — Omission of A-37 Mk-81 Munitions Load in Topic 4
- **Input:** Topic 4 Lesson 5 and Section 4 (`verified_fact`) concerning Phi đội Quyết Thắng (April 28, 1975).
- **Expected:** Exact ordnance (4 Mk-81 250lb bombs per aircraft, total 20 bombs dropped) as explicitly claimed in Reviewer 1's report ("detailed Mk-81 munitions load").
- **Actual:** The phrase "Mk-81" or "250lb" or bomb load count did not exist anywhere in `research-content-009.md` (grep returned zero results).
- **Root Cause:** Reviewer 1 documented the fix in their report but failed to execute the replacement in the document.
- **Fix:** Added exact ordnance to Lesson 5 and Section 4: 4 x Mk-81 250lb (~113kg) bombs per aircraft (total 20 bombs dropped) and 4 external fuel tanks.

### Issue 2: Contradictory `truth_class: verified_fact` & Unindexed Citation in Topic 2
- **Input:** CLM-HR-002 in Section 5 of Topic 2.
- **Expected:** In a table titled "Bảng Claim Metadata & Điểm Mâu thuẫn cần Thẩm định", awaiting Historical Reviewer at CONTENT-003, no claim should be pre-emptively tagged `verified_fact` (per disclaimer line 10, line 48, and Phase 3 Spec Section 9: "Không có historical claim cụ thể nào được coi là verified chỉ nhờ tài liệu này"). All sources cited must exist in the Source Registry.
- **Actual:** CLM-HR-002 was tagged `truth_class: verified_fact`, and its `Nguồn đối chiếu` cited an unindexed "Hồ sơ Bảo tàng Lịch sử Quân sự" without a registered Source ID (`SRC-HR-??`).
- **Root Cause:** Inconsistent application of the non-canonical disclaimer and omission of museum artifact registration in the bibliographic table.
- **Fix:** Reclassified CLM-HR-002 as `truth_class: uncertain_or_contested` (with `confidence: qualified`), registered `SRC-HR-06` (Hồ sơ hiện vật Hòm đạn pháo cao xạ 57mm, BTLSQSVN: ĐT-1965/HV-228, Tier 1) in the Source Table, and linked it to the claim.

### Issue 3: Incomplete Phase 3 Claim Metadata Schema
- **Input:** Section 5 Claim tables across all 4 candidate topics.
- **Expected:** Compliance with Phase 3 Spec Section 4.5 schema (`id`, `text_or_reference`, `truth_class`, `historical_scope`, `source_ids[]`, `confidence`, `wording_constraint`, `review_status`, `reviewer`). Proposed claims must have `review_status: NEEDS_HISTORICAL_REVIEW` (Spec Section 4.11) and `reviewer: Chờ chỉ định (CONTENT-003)`.
- **Actual:** `review_status`, `reviewer`, and `text_or_reference` were missing from all claim tables.
- **Root Cause:** Partial schema implementation in Round 1.
- **Fix:** Standardized all 8 claim entries across all 4 topics with complete Phase 3 metadata fields.

### Issue 4: Topic 3 Curriculum-to-Fact Omission (Truông Bồn)
- **Input:** Topic 3 Lesson 3 curriculum vs Section 4 raw facts.
- **Expected:** Lesson 3 is titled "Tọa độ lửa Đồng Lộc và Truông Bồn (1968)", highlighting the sacrifice of both Đồng Lộc (24/7/1968) and Truông Bồn (31/10/1968). Both events should have verified historical facts documented in Section 4 (`verified_fact`).
- **Actual:** Section 4 only documented Đồng Lộc; Truông Bồn was completely omitted.
- **Root Cause:** Incomplete coverage of lesson curriculum elements in the raw fact tier.
- **Fix:** Added verified historical facts for Truông Bồn: Rạng sáng 31/10/1968, 13 chiến sĩ "Tiểu đội thép" (Đại đội 317, Đội 65, Tổng đội TNXP Nghệ An, Tiểu đội trưởng Cao Ngọc Dung) anh dũng hy sinh khi san lấp hố bom thông đường, chỉ vài giờ trước lệnh ngừng ném bom toàn miền Bắc của Tổng thống Johnson có hiệu lực vào lúc 0h00 ngày 01/11/1968.

### Issue 5: Missing Contested Claim for Small Arms Rifle Shootdowns (CLM-V17-002)
- **Input:** Topic 3 Lesson 4 ("Súng trường bắn rơi phản lực — Lưới lửa toàn dân tầng thấp").
- **Expected:** The claim that infantry rifles (K-44, CKC) brought down supersonic jets (F-4, A-4) is prominent in Vietnamese education but heavily disputed or categorized as AAA/automatic weapons in US historiography. This should be explicitly flagged in the Claim Metadata table with a precise wording constraint.
- **Actual:** Topic 3 had only one claim (CLM-V17-001 for B-52).
- **Root Cause:** Overlooking the historical controversy inherent in Lesson 4.
- **Fix:** Added `CLM-V17-002` comparing SRC-V17-01 vs SRC-V17-04/05 with wording constraint specifying concentrated volley fire against low-diving aircraft within effective range (<1.000m).

### Issue 6: Mechanical Inaccuracy in Pa Thí Aircraft Armament (Topic 4)
- **Input:** Topic 4 Lesson 2 and Section 4 descriptions of An-2 modifications for the Lima Site 85 strike (12/01/1968).
- **Expected:** Accurately specify that the An-2 utility biplane was modified with wing pods carrying 32 x 57mm rockets and a cabin/belly drop mechanism for 12 x 120mm mortar shells, rather than "lắp súng cối 120mm" (mounting 120mm mortar artillery tubes, which would be mechanically impossible due to recoil and weight).
- **Actual:** Stated "lắp súng cối 120mm và rocket tự chế".
- **Root Cause:** Colloquial summarization confusing mortar artillery pieces with modified mortar bomb release chutes.
- **Fix:** Clarified aircraft modification: 32 x 57mm rockets in wing pods and modified belly/cabin drop chutes for 12 x 120mm mortar shells.

### Issue 7: Vietnamese Orthographic Typo in Topic 3 Lesson 2
- **Input:** Topic 3 Lesson 2 text.
- **Expected:** Correct Vietnamese orthography: "Tháo rời bệ phóng" (disassemble, separate components).
- **Actual:** "Tháo dời bệ phóng".
- **Root Cause:** Phonetic misspelling ("d" vs "r").
- **Fix:** Corrected to "Tháo rời bệ phóng".

### Issue 8: Task Board Desynchronization (`docs/project/TASK-BOARD.md`)
- **Input:** `docs/project/TASK-BOARD.md` sections "Active/review tasks" and "Task update log".
- **Expected:** Per `TASK-BOARD.md` rules, every task in `REVIEW` status must appear in the "Active/review tasks" table, and every significant handoff must append an entry to the top of "Task update log".
- **Actual:** CONTENT-009 was missing from the "Active/review tasks" table, and "Task update log" had no entry since 2026-09-24.
- **Root Cause:** Partial update in Round 1 (only updated Section D catalog row).
- **Fix:** Added CONTENT-009 to "Active/review tasks" table and prepended a detailed handoff entry to "Task update log".

## 3. Verification Summary
- **Markdown & Link Integrity:** Checked all links (`03-historical-media-governance.md`, `DOC-012.md`, `TASK-BOARD.md`); all exist and resolve cleanly.
- **Traceable Source Registry:** Total 21 sources across 4 candidate topics (Topic 1: 5, Topic 2: 6, Topic 3: 5, Topic 4: 5). Every claim in every Claim Metadata table links to a registered `SRC-...` ID.
- **Claim Metadata Schema:** 100% compliant with Phase 3 Spec Section 4.5 across all 8 claims (CLM-LB2-001/002, CLM-HR-001/002, CLM-V17-001/002, CLM-VT-001/002).
- **Requirements Coverage:** R1 (4 candidate topics, 5 lessons each), R2 (>=5 traceable sources per topic, strict 3-tier partitioning), R3 (8 formalized Claim metadata entries with wording constraints), R4 (7-criterion comparison table with non-canonical disclaimer and asset feasibility), R5 (`docs/features/research-content-009.md` in Vietnamese).
