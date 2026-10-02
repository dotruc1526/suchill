# CONTENT-014 — Vinh technical QA, 2026-10-01

- Reviewer: Vinh, Codex hỗ trợ; authoring snapshot `main` `30d0a4f`.
- Technical structure verdict: **ACCEPTED** cho graph/reference/timing authoring và handoff ranh giới dữ liệu dưới đây.
- Overall production/task handoff: **CHANGES REQUESTED** cho đồng bộ review state (P2); không nghiệm thu historical fact/media/legal/production thay Trúc/PO. Task giữ REVIEW.

## Checklist and evidence

| Check | Result |
|---|---|
| Authoring validator | PASS: 5 map nodes, 7 scenes, 6 terminating paths covering required nodes/scenes, 5 quiz questions, 9 identical narration/VTT cues, 110s |
| Validator sensitivity | Independent temp copy: broken scene target, mismatched caption and unknown quiz objective each FAIL at expected assertion; original authoring files unchanged |
| Story IDs/choices | Unique IDs; narrative/branching no correctness; knowledge choice has answer/explanation; paths converge to debrief/end |
| Map | Non-geographic authoring with no fabricated coordinates or unapproved mediaRef dependency |
| Quiz | Option labels and explanations present; answer IDs/known objective IDs checked; authoring answer key must not be shipped as scored public DTO |
| Lesson 3/4 | Local Markdown links PASS; no runtime/DTO mapper certified |
| Media CSV | 8 rows parsed: 6 BLOCKED, 2 NEEDS_MEDIA_REVIEW; optional candidates excluded from mandatory text/schematic route |
| Accessibility draft | Transcript and cue text agree; fallback described. Final audio/caption sync, actual files/device/player QA NOT VERIFIED |

## P2 — Review record and artifact flags disagree

Affected CONTENT-014 handoff, CONTENT-004/010/011 and artifact metadata:
- `PILOT-SCREENPLAY.md`, `PILOT-NARRATION.json`, `LESSON-02-INTERACTIVE.md`, `LESSON-02-STORY.json`, `QUIZ-MT68.json` still say NEEDS_HISTORICAL_REVIEW.
- The 2026-09-28 historical report/card accepts the historical/language scope of CONTENT-004/010/011. That report does not explicitly accept CONTENT-012 quiz, so its pending flag must not be upgraded by inference.
- Card/production notes also retain old M2 OPEN/M3 LOCKED descriptions; current project board says M2 DONE/M3 OPEN, while content production remains separately blocked.

Next owner Trúc: record which exact artifact revisions/hashes the historical verdict covers, synchronize only that review dimension, keep draft/authoringOnly and media/production pending flags, and explicitly decide quiz review. PO then checks content production dependency. Vinh technical structure acceptance alone cannot satisfy the combined media/handoff checklist or unblock CONTENT-007.

## Revision identity

SHA-256 of checked inputs (before any owner remediation):

| File | SHA-256 |
|---|---|
| `PILOT-SCREENPLAY.md` | `80470eff0a489149a3324dc1b0d0846062d2712c0da9cbadd1655f97f80452be` |
| `PILOT-NARRATION.json` | `138f0fd12f594931f5f735b02d1f4cbf6cc2be90b7f82fcedab9ca4fe89e7387` |
| `PILOT-CAPTIONS.vtt` | `917854f6d74ec0c8454d4c414595ce360067357767dde4c55cf778fe2f672c6d` |
| `LESSON-02-STORY.json` | `952c04810ff1652eebd7b076ecbb9065b2fed76c9f97bf36b2309c5130dffebb` |
| `MAP-MT68.json` | `63e74bcff81662f7418d2fc6e8870d3af782068241fbd01386da2eb53e1acd5c` |
| `QUIZ-MT68.json` | `4013b39954779b0b43640372b668c329662ca30386aff52c2c4cd8a664e667eb` |
| `DETAILED-MEDIA-CATALOG.csv` | `b1eb9ccb0693f6477315100a539751ea2627999adc1f3f5bc41782524591fdbf` |
| `validate-mt68-authoring.mjs` | `1673418b384a5c852c1904d3edbf8881520dd5bb2c69fe1cf75d17558735592e` |

## Handoff

- Changed files in review: evidence and technical review checkpoints/card/board/index; no authored content, runtime, migration, env or dependency changed by CONTENT-014 review.
- Validator command: `node docs/content/validate-mt68-authoring.mjs`. Full application quality in this branch applies to QA-001 validator changes, not proof of canonical content playback.
- Next: Trúc resolves review-state finding; media/rightsholder/recording/export acceptance and PO production decision remain required. CONTENT-004/010/011/012/014 stay REVIEW; CONTENT-007 BLOCKED.
