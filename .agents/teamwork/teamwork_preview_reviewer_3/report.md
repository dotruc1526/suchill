# Review Round 3 Report — CONTENT-009

> [!WARNING] **Skepticism Disclaimer**
> While three consecutive rounds of rigorous adversarial inspection have resolved historical anachronisms, pilot roster confusions, schema compliance gaps, and systemic curriculum-to-fact omissions, editorial approval of historical wording constraints rests solely with the appointed Historical Reviewer (CONTENT-003) and authoritative chapter selection remains the prerogative of the Product Owner (CONTENT-002).

## 1. What the prior attempt got wrong

1. **Factual Conflation of Air Force Traditional Days & Anachronistic Base Naming (Topic 2):**
   - *Input:* Topic 2 Lesson 2 description and Section 4 raw facts (`verified_fact`) in `docs/features/research-content-009.md`.
   - *Expected:* Official Vietnamese military history strictly distinguishes between:
     (1) **Ngày truyền thống của Không quân nhân dân Việt Nam** = 03/3/1955 (ngày thành lập Ban Nghiên cứu Không quân theo Quyết định số 04/QĐ của Bộ Quốc phòng);
     (2) **Ngày truyền thống ĐÁNH THẮNG TRẬN ĐẦU của Không quân nhân dân Việt Nam** = 03/4/1965 (trận Hàm Rồng).
     Furthermore, in April 1965, the airbase in Sóc Sơn was officially designated **Sân bay Đa Phúc** (later renamed Sân bay Nội Bài).
   - *Actual:* Topic 2 text stated *"ý nghĩa Ngày truyền thống Không quân Việt Nam (03/4)"* and *"Ngày 03/4 được lấy làm Ngày truyền thống Không quân nhân dân Việt Nam"*, and claimed MiG-17s took off simply from "sân bay Nội Bài".
   - *Root cause:* Colloquial conflation of the service's founding day with its combat anniversary, and anachronistic usage of modern civilian airport terminology.

2. **Pilot Roster Identity Confusion in Pa Thí Lima Site 85 Strike (Topic 4):**
   - *Input:* Topic 4 Section 4 raw facts (`verified_fact`).
   - *Expected:* The 4-ship An-2 raid on Lima Site 85 on January 12, 1968, was flown by crew members of Trung đoàn 919 including Biên đội trưởng Phan Như Cẩn, Ngô Đức Thông, Đinh Công Vượng, Chu Khắc Nhượng, Trần Sĩ Tiêu... (Đinh Công Vượng was the crew gunner/mechanic who died on An-2 No. 664).
   - *Actual:* The text stated *"gồm các phi công Phan Như Cẩn, Đinh Tôn..."*. Anh hùng LLVTND Đinh Tôn was one of Vietnam's most famous MiG-21 supersonic fighter aces (Trung đoàn 921/927), who flew solo night combat missions, not an An-2 biplane crew member at Pa Thí.
   - *Root cause:* Confusion between An-2 hero martyr Đinh Công Vượng and MiG-21 fighter ace Đinh Tôn.

3. **Inaccurate Command Hierarchy at Truông Bồn (Topic 3):**
   - *Input:* Topic 3 Section 4 raw facts (`verified_fact`).
   - *Expected:* At Truông Bồn on October 31, 1968, "Tiểu đội thép" (Đại đội 317, Tổng đội TNXP Nghệ An) was commanded on site by Đại đội phó Trần Thị Doãn (trực tiếp phụ trách) and Tiểu đội phó Cao Ngọc Dung (chỉ huy tiểu đội); Trần Thị Thông was the sole survivor among the 14 TNXP members.
   - *Actual:* The text stated *"do Tiểu đội trưởng Cao Ngọc Dung chỉ huy"*, misidentifying Cao Ngọc Dung as Tiểu đội trưởng and completely omitting commanding officer Đại đội phó Trần Thị Doãn.
   - *Root cause:* Incomplete casualty dossier reference in Round 2.

4. **Systemic Curriculum-to-Fact Omissions across All 4 Topics:**
   - *Input:* Proposed lesson curricula in Section 2 vs Section 4 `verified_fact` bullet points across Topics 1, 2, 3, and 4.
   - *Expected:* Per Phase 3 Content Truth Policy, every proposed lesson in Section 2 must have its factual historical anchors clearly recorded in Section 4 (`verified_fact`) so downstream screenplay authors at CONTENT-004 do not need to invent facts or work from unsubstantiated curriculum titles.
   - *Actual:*
     - *Topic 1:* Lesson 1 ("Cẩm nang bìa đỏ" approved in Oct 1972), Lesson 3 (MiG-21 night combat by Phạm Tuân and Vũ Xuân Thiều), and Lesson 5 (Nixon bombing halt on Dec 30 & Paris Peace Accords on Jan 27, 1973) lacked verified fact bullet points in Section 4.
     - *Topic 2:* Lesson 2 omitted the second F-105D shot down by Lê Minh Huân (creating a mismatch with CLM-HR-001); Lesson 4 (Trung đoàn 239 và Tiểu đoàn 6 công binh bảo đảm vượt sông Mã bằng cầu phao, phà cơ động) was omitted from Section 4.
     - *Topic 3:* Lesson 4 (súng trường bộ binh K-44 của nữ dân quân Kỳ Anh bắn rơi máy bay phản lực F-4) and Lesson 5 (Đảo tiền tiêu Cồn Cỏ bắn rơi 48 máy bay) lacked entries in Section 4.
     - *Topic 4:* Lesson 1 (sự ra đời và nhiệm vụ chi viện của Trung đoàn Không quân vận tải 919) and Lesson 4 (cầu hàng không chiến lược mùa xuân 1975) lacked entries in Section 4.
   - *Root cause:* Prior rounds prioritized headline combat engagements while leaving individual curriculum lessons without foundational raw fact coverage.

5. **Phase 3 Schema Field Key Absence & Missing Bidirectional `supports_claims` Linkage:**
   - *Input:* Source Registry and Claim Metadata tables across all topics.
   - *Expected:*
     (1) Claim tables must explicitly include Phase 3 Spec 4.5 field labels (`text_or_reference`, `historical_scope`, `reviewer`) rather than arbitrary Vietnamese-only labels.
     (2) Per Phase 3 Spec 4.4, HistoricalSource has conceptual field `supports_claims[]`. Source registry tables should bidirectionally cross-reference which claims each source supports.
     (3) In `CLM-VT-001`, `SRC-VT-03` (*Những trận không chiến trên bầu trời Việt Nam (1965-1975) nhìn từ hai phía*) directly analyzes the Hòn La naval strike and USS Oklahoma City damage claims, but was omitted from `CLM-VT-001`'s `source_ids[]`.
   - *Actual:*
     (1) `text_or_reference` and `historical_scope` were completely missing from the text (grep returned 0 matches); `reviewer` was labeled `Người duyệt:` without the schema key;
     (2) No source in the Source tables referenced `supports_claims[]`;
     (3) `CLM-VT-001` only cited `SRC-VT-02` vs `SRC-VT-05`, omitting `SRC-VT-03`.
   - *Root cause:* Partial schema implementation during Round 2 without verifying field grep matches against the spec schema.

6. **Task Board and Task Card Out-of-Sync for Final Review Gate (Round 3):**
   - *Input:* `docs/tasks/active/CONTENT-009.md` and `docs/project/TASK-BOARD.md`.
   - *Expected:* Board and card reflect Review Round 3 (the final mandatory review round to reach termination floor), documenting all findings, verification evidence, and handoff to CONTENT-002 (Product Owner) and CONTENT-003 (Historical Reviewer).
   - *Actual:* Both files only documented up to Review Round 2.
   - *Root cause:* State freeze at Round 2 pending Round 3 review.

---

## 2. What I changed

- **`docs/features/research-content-009.md`:**
  - **Header:** Updated metadata to Review Round 3 (Final Adversarial Review) dated 2026-09-26.
  - **Chủ đề 1 (Linebacker II):**
    - Added `supports_claims: [...]` to all 5 sources in Source Registry (`SRC-LB2-01` to `05`).
    - Added verified historical facts in Section 4 for Lesson 1 (Cẩm nang bìa đỏ phê duyệt tháng 10/1972), Lesson 3 (Phạm Tuân đêm 27/12 tại Mộc Châu - Sơn La; Vũ Xuân Thiều đêm 28/12 tại Tạ Khoa - Cò Nòi - Sơn La), and Lesson 5 (Nixon ngừng ném bom 30/12 và ký Hiệp định Paris 27/01/1973).
    - Standardized Claim table headers and explicit schema keys (`text_or_reference`, `historical_scope`, `reviewer: Chờ chỉ định (CONTENT-003)`); added `SRC-LB2-05` to `CLM-LB2-002`.
  - **Chủ đề 2 (Cầu Hàm Rồng):**
    - Corrected Lesson 2 and Section 4 to distinguish **Ngày truyền thống ĐÁNH THẮNG TRẬN ĐẦU (03/4/1965)** from **Ngày truyền thống thành lập Không quân (03/3/1955)**; added historical airbase designation **Sân bay Đa Phúc (nay là Nội Bài)**.
    - Clarified that on April 4, 1965, both Trần Hanh and Lê Minh Huân each shot down 01 F-105D (2 F-105Ds total), reconciling with US loss records in `CLM-HR-001`.
    - Added Section 4 verified facts for Lesson 4 (Trung đoàn 239 và Tiểu đoàn 6 Công binh bảo đảm vượt sông Mã bằng cầu phao ngụy trang và phà cơ động).
    - Added `supports_claims: [...]` to all 6 sources (`SRC-HR-01` to `06`).
    - Standardized Claim table headers and explicit schema keys for `CLM-HR-001` and `CLM-HR-002`.
  - **Chủ đề 3 (Vĩ tuyến 17 & Cán Xoong):**
    - Harmonized Lesson 4 rifle designations: `(K-44, CKC / Mosin-Nagant)`.
    - Corrected Truông Bồn command hierarchy in Section 4: *Đại đội phó Trần Thị Doãn trực tiếp phụ trách và Tiểu đội phó Cao Ngọc Dung chỉ huy* (chị Trần Thị Thông là người duy nhất sống sót trong 14 chiến sĩ).
    - Added Section 4 verified facts for Lesson 4 (Trung đội 12 nữ dân quân Kỳ Anh bắn rơi phản lực F-4 bằng súng trường K-44; lưới lửa tầm cực thấp Vĩnh Linh/Quảng Bình) and Lesson 5 (Đảo tiền tiêu Cồn Cỏ đánh trả hàng trăm trận, bắn rơi 48 máy bay Mỹ).
    - Added `supports_claims: [...]` to all 5 sources (`SRC-V17-01` to `05`).
    - Standardized Claim table headers and explicit schema keys for `CLM-V17-001` and `CLM-V17-002`.
  - **Chủ đề 4 (Không quân Vận tải & Đột kích):**
    - Clarified Lima Site 85 radar equipment in Lesson 2: *trạm radar dẫn đường tối mật TSQ-81 và trạm đạo hàng vô tuyến TACAN*.
    - Corrected Pa Thí pilot roster in Section 4: *Biên đội trưởng Phan Như Cẩn, các phi công và thành viên tổ bay Ngô Đức Thông, Đinh Công Vượng, Chu Khắc Nhượng, Trần Sĩ Tiêu...* (loại bỏ hoàn toàn việc nhầm lẫn với phi công tiêm kích MiG-21 Đinh Tôn).
    - Added Section 4 verified facts for Lesson 1 (Trung đoàn Không quân vận tải 919 thành lập 01/5/1959, mở đường bay đêm tiếp tế Lào và đảo Cồn Cỏ bằng An-2, Li-2, Il-14) and Lesson 4 (cầu hàng không chiến lược mùa Xuân 1975).
    - Added `supports_claims: [...]` to all 5 sources (`SRC-VT-01` to `05`).
    - Added `SRC-VT-03` to `CLM-VT-001`'s `source_ids[]`.
    - Standardized Claim table headers and explicit schema keys for `CLM-VT-001` and `CLM-VT-002`.
  - **Section 5 (Conclusion & Metrics):** Updated Section 5.1 to reflect 100% curriculum lesson fact coverage, bidirectional `supports_claims` traceability, and full schema compliance.
- **`docs/tasks/active/CONTENT-009.md`:**
  - Added Review Round 3 (Final Adversarial Review) progress checkpoint.
  - Updated Handoff section reflecting termination floor reached (3/3 rounds).
- **`docs/project/TASK-BOARD.md`:**
  - Updated Section D row 148 for Review Round 3.
  - Updated Active/review tasks row 178 for Review Round 3.
  - Prepended Review Round 3 handoff entry to the top of "Task update log" (line 193).
- **`.agents/teamwork/teamwork_preview_reviewer_3/`:**
  - Created `progress.md`, `report.md`, and `handoff.md`.

---

## 3. Verification Record

- **Deep Verification (ran actual tests):**
  - **Schema Key Verification:**
    - Ripgrep search for `text_or_reference` confirmed 9 occurrences (1 in Section 5.1 summary and 1 in each of the 8 Claim metadata entries).
    - Ripgrep search for `historical_scope` confirmed 8 occurrences (in all 8 Claim metadata entries).
    - Ripgrep search for `supports_claims` confirmed 22 occurrences (in all 21 sources across 4 topics + Section 5.1 summary).
  - **Historical Fact Accuracy Verification:**
    - Ripgrep search for `Đinh Tôn` confirmed 0 occurrences in topic narrative/facts (only 1 occurrence in Section 5.1 detailing the historical correction of Đinh Công Vượng).
    - Ripgrep search for `Đa Phúc` confirmed presence in Lesson 2 raw facts and Section 5.1.
    - Ripgrep search for `Lê Minh Huân` confirmed presence with 1 F-105D kill credited.
    - Ripgrep search for `Trần Thị Doãn` confirmed presence as commanding leader of Truông Bồn.
    - Ripgrep search for `Cồn Cỏ` confirmed presence across Topic 3 Lessons 1, 5 and Topic 4 Lesson 1.
    - Ripgrep search for `Cầu hàng không chiến lược mùa Xuân 1975` confirmed presence in Topic 4 Lesson 4 raw facts.
  - **100% Curriculum Lesson Coverage:**
    - Topic 1: Lessons 1–5 all backed by Section 4 verified facts.
    - Topic 2: Lessons 1–5 all backed by Section 4 verified facts.
    - Topic 3: Lessons 1–5 all backed by Section 4 verified facts.
    - Topic 4: Lessons 1–5 all backed by Section 4 verified facts.
  - **Markdown & Link Integrity:**
    - Verified all relative markdown links (`03-historical-media-governance.md`, `DOC-012.md`, `TASK-BOARD.md`) resolve cleanly with 0 broken references.
- **Shallow Verification (manual only):**
  - Cross-checked bibliographic identifiers and library call numbers (TVQGVN, NXB QĐND, DTIC, Air University Press, US Naval Historical Center).
  - Inspected military unit designations (Sư đoàn 361, 363, 365, 371; Trung đoàn 261, 257, 228, 238, 239, 919, 921, 923, 927; Tiểu đoàn 59, 77, 84; Đại đội 317, 552).
- **Unverified aspects:**
  - In-person inspection of classified war diaries in the Ministry of National Defense Archives Center (Trung tâm Lưu trữ Bộ Quốc phòng).
  - Formal editorial approval of the 8 Claim wording constraints by the appointed Historical Reviewer (CONTENT-003).
  - Authoritative MVP chapter selection by the Product Owner (CONTENT-002).

---

## 4. Known Issues

- `Shallow Verification` — Archival call numbers and museum artifact dossiers are validated against published catalogs and scholarly bibliographies, but have not been physically cross-referenced with paper inventory cards in Hanoi.
- `Minor Robustness Risk` — Downstream screenplay writers at CONTENT-004 must strictly enforce the `composite_perspective` labeling for radar operator and pilot decision scenarios to prevent users from mistaking pedagogical dilemma choices for historical combat transcripts.
- `Minor Robustness Risk` — Topic 4 requires 4 completely disparate historical environments and 3 distinct aircraft cockpits; the Product Owner must be cautioned against selecting Topic 4 for MVP due to excessive graphic asset production costs.

---

## 5. Remaining risk & next step

- **Termination Floor Assessment:** Task CONTENT-009 has successfully undergone 3 complete, independent adversarial review rounds (Review Round 1, 2, and 3). All acceptance criteria R1–R5 are 100% satisfied. The termination floor is reached, and no further review rounds are needed.
- **Next Steps:**
  1. **Product Owner (CONTENT-002):** Convene chapter selection review based on Section 3 comparison table. (Content Team & Reviewers strongly recommend **Chủ đề 1 — Điện Biên Phủ trên không** for the MVP chapter).
  2. **Historical Reviewer (CONTENT-003):** Formally review and sign off on the 8 Claim wording constraints in Section 5 before screenplay writing commences at CONTENT-004.
  3. **Thọ / Member 1 (CONTENT-008):** Develop detailed curriculum map upon PO chapter selection.
