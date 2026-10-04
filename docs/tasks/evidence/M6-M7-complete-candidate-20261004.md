# Seven-lesson delivery candidate — 2026-10-04

## Concrete deliverables

All seven internal episodes contain substantial learning material: 21 sections, 20 source-bound knowledge checks with explanations, recap and reflection. Episodes 1/6 use the same companion UI; episode 6 retains its integrated visual novel. Selection is neutral until grading; incorrect answers provide explanations and keyboard-accessible retry. Internal exercises never grant XP or mutate accounts.

The new candidate1954-v2 video replaces the final spoken narration, captions and illustration. Original package hashes remain unchanged. New video: 1080×1920, 24 fps, H264/AAC, 94.979667 seconds, 15,724,204 bytes. Episode 1 can switch between original and corrected versions, with separate hash-scoped local progress and matching inline transcripts. Candidate review status is in_review, not published.

CANONICAL-IMPORT-CANDIDATE.json is a concrete domain preparation containing seven lessons, fourteen documents, twenty questions, separate internal answer keys, seven objectives and a six-scene story graph. Existing domain validators accept the relationships. No trusted database import has occurred; UUID mapping, media binding and historical acceptance remain explicit dependencies. publicationAllowed=false.

## Verification and independent review

- Source/import/all-seven browser integration: 5 PASS, 0 FAIL. Browser exercises explanations, retries, keyboard, mobile/landscape, 200% text, original state preservation and actual corrected video metadata/caption/transcript.
- Independent technical reviewer: SOFTWARE APPROVE for bounded internal use; import 2 PASS and original/custom video transport accepted. See M6-technical-rereview-20261004.md.
- Corrected media: 12 technical package checks PASS; independent full FFmpeg decode exit 0; original/new hash and narration verifier PASS.
- First full local Quality run passed typecheck/build and 281 unit tests, then failed at Chrome Page.navigate timeout. Component retry also encountered Chrome timeout/owned-profile lock and offline lazy-module timeout. These failures are retained, not reported as a full local PASS. GitHub exact-head CI will be required before merging.

PR125 initial GitHub runs passed full Quality and all 40 boundary tests, then correctly rejected altered caption bytes: Windows CRLF was normalized by Git. A package-local .gitattributes now preserves byte-locked metadata/VTT/transcript; both local verifier and Git-index caption/transcript hash check PASS. Hash assertions remain unchanged. Local final typecheck/build and scan832files/0unsafe PASS; local database62PASS/3native-onlyskips, PWA2PASS, server24PASS, PvP UI4PASS. Broad local boundary38PASS/2Chrome timeouts and component36PASS/2timeouts are retained. Exact amended-head CI remains required.

Internal Hosting packaging now permits only correctly paired hashed candidate video/caption/transcript names. Wrong extension, missing hash and private asset are rejected. Existing secret/symlink and original-package checks stay active. Hosting tests5PASS; independent read-only review SOFTWARE APPROVE. No Auth, backend or PWA video-cache expansion.

## Acceptance remaining

PO license-documentation exception is APPROVED and applies; no renewed paperwork request. Specialist historical acceptance of exact authoring/media, human listening, physical-device/accessibility/update observations and final release acceptance remain separate. Desktop app control was stopped by the user with Escape; installation/icon or screen-reader acceptance is not claimed. M6/M7 remain OPEN. The candidate completes reversible authoring/software/media/import preparation and is reviewable now; it does not fabricate milestone closure or canonical publication.
