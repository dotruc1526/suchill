# Review Round 1 Report — CONTENT-009

## 1. Executive Summary
Teamwork Preview Reviewer conducted an adversarial review of the research document `docs/features/research-content-009.md` produced by teamwork_preview_implementer for task **CONTENT-009** (Research candidate topics and sources for the Air War in the Resistance War against America).

## 2. Issues Identified in Prior Attempt & Solutions Implemented

### Issue 1: Reverse Chronological Progression in Topic 3 Curriculum
- **Prior state:** Lesson 2 was 1968 (Đồng Lộc & Truông Bồn), followed by Lesson 3 in 1967 (Đoàn 238 shooting down first B-52).
- **Impact:** Chronologically incoherent and backwards pedagogy.
- **Fix:** Swapped and refocused Lesson 2 (September 1967 Đoàn 238 B-52 hunt) before Lesson 3 (1968 Panhandle bombing concentration).

### Issue 2: Conflated Historical Directives and Milestone Attributions in Topic 1
- **Prior state:** Blended President Ho Chi Minh's 1962 directive with the Spring 1968 prophecy; claimed the "Cẩm nang bìa đỏ" manual was drafted in 1969; combined Tiểu đoàn 59 and 77 without distinguishing the first shootdown at Phù Lỗ.
- **Impact:** Factual inaccuracies vulnerable to historical challenge.
- **Fix:** Separated 1962 from 1968 quotes; clarified that Vĩnh Linh studies (1966–1969) culminated in the manual finalized in October 1972; credited Tiểu đoàn 59 specifically for the first shootdown at Phù Lỗ on Dec 18, and highlighted Tiểu đoàn 77 as the top-scoring unit (4 B-52s).

### Issue 3: Incomplete Bibliographic Metadata (Phase 3 Spec Section 4.4)
- **Prior state:** Generic numbering (N1..N5), missing library catalog IDs / ISBNs, and incorrect publisher location (NXB QĐND Hải Phòng instead of Hà Nội).
- **Fix:** Added formal `SRC-...` machine-readable identifiers, National Library of Vietnam (TVQGVN) catalog numbers, ISBNs, and USAF/DoD technical report numbers (DTIC ADA218949, GPO IDs).

### Issue 4: Informal Claim Metadata (Phase 3 Spec Section 4.1 & 4.5)
- **Prior state:** Unstructured bullet points tagged with informal strings `[DISPUTED]`.
- **Fix:** Modeled full Claim metadata tables with explicit Claim IDs (`CLM-LB2-001`, `CLM-HR-001`, `CLM-V17-001`, etc.), truth classes (`uncertain_or_contested`), confidence levels, scope, comparative source attribution, and actionable wording constraints for the Historical Reviewer.

### Issue 5: Missing Key Historical Actors & Technical Detail in Topic 4
- **Prior state:** Mentioned only 5 pilots for Phi đội Quyết Thắng on April 28, 1975.
- **Fix:** Included the 6th pilot, Trần Cao Băng, who flew the dual-seat A-37 with Hoàng Mai Vượng; specified ordnance (4 Mk-81 250lb bombs per aircraft, total 20 bombs).

### Issue 6: Mischaracterization of USAF B-52 Loss Admissions
- **Prior state:** Claimed USAF admits "15 B-52s lost on the spot" (tại chỗ).
- **Fix:** Corrected to reflect official SAC records: 15 combat losses (10 inside NVN, 5 crashed in neighboring countries/seas before reaching safety), plus 1 written-off beyond repair and multiple Class A damaged aircraft.

### Issue 7: Production Feasibility & Scope Risk Matrix for Product Owner (R4)
- **Prior state:** Matrix lacked an engineering / art asset production feasibility dimension.
- **Fix:** Added Criterion 6 evaluating MVP asset reuse and geographic scope risk, demonstrating why Topic 1 (concentrated in Hanoi night sky and SAM-2 cabin) is vastly superior in engineering ROI over Topic 4 (which requires 4 distinct theaters and 3 distinct cockpits).

### Issue 8: Task Tracking Synchronization
- **Prior state:** Task card remained `IN PROGRESS` and task board remained `READY`.
- **Fix:** Transitioned both to `REVIEW` to signify completion of research and review, awaiting PO selection (CONTENT-002) and Historical Review (CONTENT-003).

## 3. Verification Summary
- Acceptance criteria verified against all requirements R1–R5.
- Zero broken links, 100% Phase 3 Spec compliance.
