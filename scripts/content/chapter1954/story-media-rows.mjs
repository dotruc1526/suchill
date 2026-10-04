export function addStoryMediaRows(candidate, manifest, collector, references) {
  const { id, add } = collector, { source, claim, objective } = references
  const story = candidate.story, storyId = id('public.visual_novel_stories', story.storyId)
  const versionId = id('public.story_versions', story.id)
  const traceability = new Map()
  for (const item of candidate.sceneTraceability ?? []) {
    if (traceability.has(item.sceneId) || !story.scenes.some(scene => scene.id === item.sceneId)) throw new Error('Unknown or duplicate scene traceability')
    if (!['fictional_narrative','mixed_fiction_and_claims','educational_explanation'].includes(item.boundary) ||
      typeof item.claimsRequired !== 'boolean' || item.reviewStatus !== 'needs_historical_review') throw new Error('Invalid scene review boundary')
    traceability.set(item.sceneId, item)
  }
  for (const scene of story.scenes) {
    const item = traceability.get(scene.id)
    if (!item) throw new Error(`Missing scene traceability ${scene.id}`)
    const same = (left, right) => JSON.stringify([...left].sort()) === JSON.stringify([...right].sort())
    if (!same(scene.claimIds, item.claimIds) || !same(scene.sourceIds, item.sourceIds)) throw new Error('Scene traceability disagrees with authored references')
    if (scene.claimIds.length && !item.claimsRequired) throw new Error('Bound claims must retain factual review')
    if (item.claimsRequired && !scene.claimIds.length) throw new Error(`Missing factual claim ${scene.id}`)
    if (item.boundary === 'mixed_fiction_and_claims' && !item.claimsRequired) throw new Error('Mixed scene must retain factual review')
    if (item.boundary === 'fictional_narrative' && (item.claimsRequired || scene.claimIds.length || scene.sourceIds.length)) throw new Error('Fiction cannot be presented as sourced fact')
  }
  add('public.visual_novel_stories', { id: storyId, slug: 'candidate-1954-geneva-v2', title: 'Genève 1954 — bản nháp', summary: 'Authoring candidate; not published' })
  add('public.story_versions', { id: versionId, story_id: storyId, version_number: story.versionNumber,
    eligibility_version: story.id, status: 'in_review', start_scene_id: id('public.scenes', story.startSceneId), created_at: story.createdAt })
  story.scenes.forEach((scene, order) => {
    const sceneId = id('public.scenes', scene.id)
    const payload = scene.kind === 'choice' ? { prompt: scene.prompt, policy: scene.policy }
      : scene.kind === 'debrief' || scene.kind === 'end' ? { summary: scene.summary } : { text: scene.text }
    add('public.scenes', { id: sceneId, story_version_id: versionId, order_index: order, kind: scene.kind, title: scene.title ?? null,
      next_scene_id: scene.nextSceneId ? id('public.scenes', scene.nextSceneId) : null, payload,
      required_check: scene.kind === 'choice' && scene.choices.some(choice => choice.kind === 'knowledge_check') })
    for (const value of scene.sourceIds) add('public.scene_sources', { scene_id: sceneId, source_id: source(value) })
    for (const value of scene.claimIds) add('public.scene_claims', { scene_id: sceneId, claim_id: claim(value) })
    scene.choices?.forEach((choice, position) => {
      const choiceId = id('public.scene_choices', choice.id)
      add('public.scene_choices', { id: choiceId, scene_id: sceneId, order_index: position, kind: choice.kind, label: choice.label,
        response: choice.kind === 'knowledge_check' ? null : choice.response ?? null,
        next_scene_id: choice.nextSceneId ? id('public.scenes', choice.nextSceneId) : null })
      if (choice.kind === 'knowledge_check') add('private.scene_answer_keys', { choice_id: choiceId, is_correct: choice.isCorrect, explanation: choice.explanation })
    })
  })
  for (const value of story.learningObjectiveIds) add('public.story_objectives', { story_version_id: versionId, objective_id: objective(value) })
  for (const value of story.sourceIds) add('public.story_sources', { story_version_id: versionId, source_id: source(value) })
  const mediaDomainId = 'candidate.1954.video.corrected.v2'
  const posterId = id('public.media_assets', `${mediaDomainId}.poster`)
  const videoId = id('public.media_assets', mediaDomainId)
  const storage = file => `draft-media/chapter1954/candidate-v2/${file}`
  add('public.media_assets', { id: posterId, kind: 'image', title: 'Trước cơn bão — poster v2', storage_ref: storage('poster.png'),
    alt_text: 'Khung hình video Trước cơn bão.', attribution: manifest.mediaUseDecision, license: 'PO_INTERNAL_CANDIDATE', review_status: 'in_review' })
  add('public.media_assets', { id: videoId, kind: 'video', title: manifest.title, storage_ref: storage('pilot-mobile.mp4'),
    poster_media_id: posterId, duration_seconds: manifest.video.durationSeconds, aspect_ratio: '9:16',
    attribution: manifest.mediaUseDecision, license: 'PO_INTERNAL_CANDIDATE', review_status: 'in_review' })
  add('public.caption_tracks', { id: id('public.caption_tracks', `${mediaDomainId}.captions.vi`), media_asset_id: videoId,
    locale: 'vi-VN', label: 'Phụ đề tiếng Việt', storage_ref: storage('captions.vi.vtt') })
  add('public.transcripts', { id: id('public.transcripts', `${mediaDomainId}.transcript.vi`), media_asset_id: videoId,
    locale: 'vi-VN', label: 'Bản chép lời', storage_ref: storage('transcript.vi.txt'), document_id: null })
  for (const value of manifest.sourceIds) add('public.media_sources', { media_asset_id: videoId, source_id: source(value) })
  return [
    { kind: 'scene_historical_review', scenes: [...traceability.values()].filter(item => item.claimsRequired) },
    { kind: 'fictional_narrative_review', scenes: [...traceability.values()].filter(item => item.boundary === 'fictional_narrative') },
    { kind: 'scene_pedagogical_review', scenes: [...traceability.values()].filter(item => !item.claimsRequired && item.boundary !== 'fictional_narrative') },
    { kind: 'media_storage_upload', refs: ['pilot-mobile.mp4','poster.png','captions.vi.vtt','transcript.vi.txt'].map(storage) },
    { kind: 'historical_learning_media_acceptance' },
  ]
}
