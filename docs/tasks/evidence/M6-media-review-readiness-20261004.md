# M6/M7 media lane — verified inventory and concrete remediation

Date: 2026-10-04. Task: [M6-M7-FIVE-ROLE-DELIVERY-20261004](../active/M6-M7-FIVE-ROLE-DELIVERY-20261004.md). Executor: delegated Codex design/video lane. Scope: read-only audit of source media and implementation; this evidence file only. No human identity, historical verdict, legal permission, new production asset, publication or physical-device result is asserted.

## Evidence inspected

- `AGENTS.md`, documentation index, task board, architecture; M6-04 and CONTENT-006 task cards.
- Phase 3 media metadata/review rules; Phase 8 §7 media QA.
- `docs/content/preview1954-v1/manifest.json`, narration, captions, transcript, README and SOURCE-NOTES.
- `src/assets/vn-preview/PROVENANCE.md`, illustration bytes, `NovelBackdrop`, `PreviewNovel`, `NovelStage`, technical Genève script.
- Existing `scripts/content/build-mt68-video.py`, `mt68_video_art.py`, media validator and reference transport tests.

## Current media verdict by component

| Component | Verified present | Exact remaining issue / disposition |
|---|---|---|
| 1954 episode 1 MP4 | 19,289,629 bytes; original SHA256 `2b7def3cd371275f73f062707b9cd212bca663b4b8e66eeb980272b5c092f0ec`; manifest says 1080×1920, 24fps, 93.389s | Unchanged internal reference. Cue 27 wording remains baked into audio/image and captions. Page clarification does not revise that media. |
| Caption/transcript/poster | Hash, locked words, cue parsing and poster checks passed in fresh audit | Exact original words are preserved intentionally, including the flagged cue. Human sync evidence is the earlier Trúc 2026-09-27 reference listen-through; no new listen-through is invented. |
| Original narration | Reported `vi-VN-NamMinhNeural` via Edge TTS | `audioIdentityVerified: false`; original generation/account/license chain remains unverified. Do not infer Azure Speech permissions apply to the Edge interface or to this file. |
| Original music/SFX | CONTENT-006 records missing permissions/manifest | Cannot separate ownership or source from a mixed MP4 track. Re-encoding, muting one passage, or adding credit does not prove permission. |
| Original illustrations/mascot | Supplier statements recorded by CONTENT-006 | Original illustration prompts/session exports are missing. New generation provenance cannot retroactively document old embedded assets. |
| New VN hall | `geneva-hall-v1.png`, 2,274,947 bytes; SHA256 `46db5ba72fd291326b02c932fa27e1d8c41736a111ca3c17e8c89fc4ecc2d688` matches PROVENANCE | New built-in image_gen output with full prompt, date and no external reference. Explicit fictional illustration, not archival evidence. Final asset review remains distinct. |
| VN lesson 6 illustrations | `PreviewNovel` strips original remote image URLs; `NovelBackdrop` renders local hall or existing vector map | No remote Wikimedia photos are loaded by this preview path. Hall/people/table/dawn reuse one image, some crop/brightness changes; not a completed scene-art set or character sprite pack. |
| UI interaction sounds | `soundService.ts` synthesizes oscillator tones locally with mute | These are separate from the video soundtrack. Existing generated UI tones do not require retrieving external sample files; source/code authorship remains ordinary project provenance. |

## Fresh technical checks

1. Initial `node scripts/release/validate-media-package.mjs docs/content/preview1954-v1 docs/content/preview1954-v1/locked-narration.json`: eleven checks passed; `actual_video` failed because ffprobe was absent from PATH. **Resolved in this lane:** portable FFmpeg acquired and SHA256 verified; the same command with process-local `FFPROBE_PATH` passed **all 12 checks, zero errors**. Actual measurement: 1080×1920, 24fps, 93.389 seconds, H.264/AAC. Rights/history/device warnings remain.
2. `node --test scripts/content/reference-preview/video-source.test.mjs`: **2 PASS, 0 FAIL**. Actual original bytes were read; sharing/revocation and refusal of truncated, oversized, altered/unavailable responses passed.
3. `Get-FileHash` of the new VN hall exactly matches its recorded SHA256.
4. Source inspection confirms lazy local illustration import and fictional label/alt in `NovelBackdrop`; no new browser or real-device visual result claimed by this lane.
5. Portable FFmpeg full decode: `ffmpeg -hide_banner -v error -xerror -i docs/content/preview1954-v1/pilot-mobile.mp4 -f null NUL`: **exit 0**, no decode errors; video/audio were read without a new media output. This is decoder integrity evidence, not a new human caption/listening acceptance.

### Portable tool provenance and reproduction

No existing ffprobe was found in scoped runtime/cache and conventional tool directories. The [official FFmpeg download page](https://ffmpeg.org/download.html) links [Gyan Windows builds](https://www.gyan.dev/ffmpeg/builds/). Downloaded portable release essentials ZIP from `https://www.gyan.dev/ffmpeg/builds/packages/ffmpeg-9.0.2-essentials_build.zip`; 114,768,076 bytes. ZIP SHA256 `60f467265b1e312373dbcd92200c2618a74850f98d3d078e94296bb3fa2047ba` matched the publisher checksum before extraction/execution. Binary reports `ffprobe version 9.0.2-essentials_build-www.gyan.dev`.

Temporary directory: `C:/Users/Compuerte/AppData/Local/Temp/suchill-media-audit-20261004/ffmpeg-9.0.2-essentials_build/bin/`. No installer, system PATH edit, registry change or repository binary added. `FFPROBE_PATH` was set only for the validator process. An earlier interrupted download left a partial ZIP in this same temporary directory; it was never extracted or executed. Integration may reuse the verified portable binary locally; CI should use its own trusted ffprobe provisioning.

## Concrete clean replacement package (new version, not edits to reference)

The shortest media route that removes inherited unknown audio/music/illustration components is a **separate 1954 owned-art package**, while preserving `preview1954-v1` byte-for-byte for reference. Do not reconstruct this by using original MP4 frames: they retain the inherited illustration/provenance issue.

1. First finish historical/learning review of narration. Candidate cue 27 wording already recorded by CONTENT-006: “Nhưng tại sao một thung lũng ở Tây Bắc lại trở thành điểm quyết chiến chiến lược của hai bên?” The reviewed version must replace narration, captions, transcript and any burned text together. A page notice alone cannot satisfy this step.
2. Create stable `narration.1954.intro.v2` cue IDs in a new draft package with source claim IDs, review status and reviewer fields. Do not overwrite `locked-narration.json` of v1.
3. Use original project-authored vector diagrams, typography and maps with documented factual map labels; avoid original mascot and archival/generated pictures whose chain is incomplete. Record source code, font file/hash, exact font license evidence and authorship of each visual. A quiet typography/diagram package is a rights-remediation candidate, not a promise of attractive VN art.
4. Prefer new human narration with explicit recorded permission covering the actual intended app use, identity and original recording hashes. Alternatively use a provider account/export with concrete applicable output rights and voice consent/provenance. Do not select or buy a TTS plan from assumptions. No API/payment/account action is performed here.
5. Use **no music or ambient SFX** in this first replacement export. This eliminates the unknown soundtrack components rather than attempting to authenticate an inseparable mix. If meaningful non-speech sound is later added, its provenance and captions need their own review.
6. Export master plus a separately measured mobile rendition; poster from the new version; exact Vietnamese VTT and transcript; accessible visual description, fallback and attribution. No fixed mobile budget is declared accepted without actual device/network evidence.
7. Lock output hashes and manifest, run media validator with ffprobe, decode the entire file, inspect poster/caption raster and listen through every cue. Keep the new package `in_review` until reviewer acceptance. Never copy “audioHumanAcceptance” or a generation identity from an older project.
8. After media and historical acceptance, M6-04 can claim the accepted rendition and M7-03/04 can proceed on actual current-1954 dependencies. Canonical import/publication remains a separate downstream task.

## Existing renderer reuse: precise changes needed

`build-mt68-video.py` already provides useful mechanical pieces: audio-file preflight, actual duration check, no speech truncation, mono AAC, H.264, `+faststart`, master/mobile export, exact transcript/VTT and hashing. It must **not be run unchanged** for the current topic:

- Narration input is hardcoded to `PILOT-NARRATION.json` (1968).
- `mt68_video_art.py` embeds 1968 scene titles, dates, Saigon targets and “Giọng Hoa · ElevenLabs” attribution.
- The output manifest hardcodes 1968 media identity, source IDs, ElevenLabs voice/model/plan and a prior user acceptance sentence.
- Cue timing is a fixed slot; reject overlong recordings or review timing, do not squeeze speech for children merely to reuse old timing.
- Adapt under a new task/file claim to parameterized reviewed narration/art/provider metadata, new immutable output folder and honest pending status. None of those production edits are authorized by this report's file claim.

## Visual Novel art delivery brief

Current user feedback is aesthetic rejection, so the illustration presence or passing UI tests must not be reported as visual acceptance. The reviewable next art set needs five scene-specific compositions: fictional corridor, geographically reviewed vector map, letter close-up with no invented quote, document/desk detail, lakeside dawn. Use fictional character sprites only after character design and expressive poses are reviewed; distinguish them from historical portraits. Keep prompt/model/tool/date/source-image disclosure, hashes, fictional labels and alt for each generated asset. Use scene-specific lazy assets and measure mobile size; do not claim actual 1954 location reconstruction from the prompt.

Story-level requirements remain: reviewed scene graph/claims, no invented historical direct quotation, stable version/scene/choice IDs, reflection choices without correctness, meaningful visual descriptions, and reduced motion. The current technical demo uses illustrative dialogue and the legacy scene types; it is not the final canonical authored story.

## Handoff

**Superseding PO decision:** [PO-MEDIA-EXCEPTION-20261004](../active/PO-MEDIA-EXCEPTION-20261004.md) is APPROVED by the user/PO. Missing license documentation is waived as a project gate and is no longer a blocker for authorized project media use. Earlier rights-blocker findings in this audit are historical observations, not current instructions to stop work or ask again. Preserve measured facts/provenance; remaining caption/narration corrections and historical/device acceptance still need their own evidence.

### Subsequent user authorization and provider terms

The user states there are no rights records and authorizes use of the current resources, asserting ElevenLabs voice is permitted for students. Record this as user authorization for project work/internal demonstration, not independently established third-party licensing. Official [ElevenLabs billing documentation](https://elevenlabs.io/docs/overview/administration/billing) permits free-plan output for non-commercial use with attribution; paid-plan generation includes commercial rights. [Publication guidance](https://help.elevenlabs.io/hc/en-us/articles/13313564601361-Can-I-publish-the-content-I-generate-on-the-platform) specifies attribution for free-plan publication. These terms do not establish unrelated music/SFX rights or identify the generation plan/provider of this exact MP4. Keep the current package internal; verify the actual narration provenance before assigning provider credit to its immutable manifest. Student status alone is not the evidence recorded by those provider terms.

Files changed: this report only. Temporary verified portable tool download and process-local environment override only; no persistent environment, migration, source media, runtime publication or account impact. No build needed for this docs-only audit. Parent integration may cite actual package12PASS and full decode exit0; claim any renderer/media production separately once prerequisites are valid. Delegation of the five work roles supplies execution capacity; it cannot supply a missing authorized replacement narration, license evidence, historical verdict or physical-device observation.
