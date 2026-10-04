# Chapter 1954 — isolated trusted-import preparation

Run from the project root with the installed project dependencies:

```powershell
node scripts/content/chapter1954/dry-run.mjs
node --test scripts/content/chapter1954/import.test.mjs
```

The CLI accepts no database URL, credentials, publishing option or remote target. It creates in-memory PGlite through the existing test harness with `seed: false` and explicit `memory://`; a native PostgreSQL environment variable cannot select a remote database. Current migrations are applied unchanged. All normalized rows are inserted into one transaction, deferred foreign keys are checked, and an intentional exception rolls the transaction back. CLI output contains counts/provenance/pending bindings, not answer values. It exits successfully only after the isolated dry-run completes.

## Inputs and identities

- `docs/content/chapter1954/CANONICAL-IMPORT-CANDIDATE.json`: seven lessons, fourteen documents, twenty questions, objectives and six-scene VN graph.
- `docs/content/chapter1954/SOURCE-REGISTER.json` and `CLAIM-REGISTER.json`: chapter research sources and forty-two unaccepted claims.
- `docs/content/candidate1954-v2/manifest.json`: corrected video metadata and legacy source identities.
- `media-source-metadata.mjs`: import-only metadata/provenance for three legacy video sources, bound to the existing SOURCE-NOTES and M7 source-review evidence. The Navarre alias is checked against the exact chapter source URL. Original registers/manifests are preserved.

`candidateUuid(table, domainId)` uses a fixed RFC4122 UUIDv5 namespace. Table-qualified authored IDs determine identity; array position determines ordering only. Question/scene answers become rows exclusively in `private.question_answer_keys` and `private.scene_answer_keys`, while public rows contain choices/prompts without correctness. All entities with review/status columns remain `in_review`; unresolved claim classifications remain `uncertain` with their proposed classification recorded as a pending note.

## Actual schema evidence and boundaries

The test imports the complete normalized graph into the current migrated PostgreSQL engine, checks draft invisibility to anon/authenticated roles and denial of private-key access, then verifies complete rollback and repeatability. Broken foreign keys, published-state tampering, unknown tables and incomplete normalized candidates are rejected without partial rows. Preparation inserts into an empty isolated schema; it does not overwrite existing canonical rows or claim a production upsert/version-publication policy.

The plan retains pending scene-specific claim review, historical/learning/media acceptance and actual Storage upload. `draft-media/chapter1954/candidate-v2/...` references are proposed private storage destinations; no media upload or storage-object creation occurs. Source citation provenance does not grant historical approval. Domain answer material in a normalized review artifact remains operator-only; it is not a browser bundle or deployment artifact.

Files here do not change migrations, user progress, rewards, original content/media, Firebase or a remote database. After specialist acceptance, a separately reviewed trusted deployment/import transaction must handle actual storage, accepted immutable versions and release gates.
