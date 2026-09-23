# Visual Novel Feature

Visual Novel là một loại nội dung học trong Sử Chill, có kịch bản được biên soạn trước theo scene. AI chỉ hỗ trợ brainstorm/cải thiện bản nháp; không tự sinh hoặc tự publish story lúc người học đang chơi.

## Phạm vi feature

- Story/version/scene/choice.
- Narrative, reflection, branching và knowledge-check choice.
- Nhân vật, bối cảnh, lời thoại, media và debrief.
- Start/resume/retry/back/completion.
- Fact, fiction, source và media attribution.
- Có thể nằm trong lesson kết hợp text, video và quiz.

## Quyết định quan trọng

- `src/features/visual-novel` là engine chính khi triển khai.
- Story Genève/vĩ tuyến 17 hiện tại chỉ là technical demo, không canonical và không phải chuẩn nội dung để mở rộng trực tiếp.
- Nội dung phải được biên kịch, historical review và publish theo version.
- Narrative/reflection choice không bị gắn đúng/sai.
- Progress tham chiếu scene ID ổn định và đúng story version.

## Specs liên quan

- [Phase 2 — Content & Story Authoring](../../specs/phases/02-content-story-authoring-model.md)
- [Phase 3 — Historical & Media Governance](../../specs/phases/03-historical-media-governance.md)
- [Phase 4 — UX & Player State](../../specs/phases/04-player-state-spec.md)
- [Phase 5 — Domain & Types](../../specs/phases/05-domain-type-contract.md)
- [Phase 6 — Database & Services](../../specs/phases/06-database-service-spec.md)

Phase index chung của toàn app nằm tại [docs/specs](../../specs/README.md).
