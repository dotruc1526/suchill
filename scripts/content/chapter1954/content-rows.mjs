export function addContentRows(candidate, sourceRegister, claimRegister, collector) {
  const { id, add } = collector
  const knownSources = new Set(sourceRegister.sources.map(source => source.id))
  const source = value => {
    if (!knownSources.has(value)) throw new Error(`Unknown source: ${value}`)
    return id('public.historical_sources', value)
  }
  const objectives = new Set(candidate.objectives.map(item => item.id))
  const objective = value => {
    if (!objectives.has(value)) throw new Error(`Unknown objective: ${value}`)
    return id('public.learning_objectives', value)
  }
  for (const item of candidate.objectives) add('public.learning_objectives', { id: objective(item.id), title: item.text, status: 'in_review' })
  for (const item of sourceRegister.sources) add('public.historical_sources', {
    id: source(item.id), title: item.title, author_or_institution: item.author ?? item.publisher,
    published_year: /^\d{4}-/.test(item.publishedDate ?? '') ? Number(item.publishedDate.slice(0,4)) : null,
    url: item.url, citation_text: item.citationText ?? `${item.publisher}; ${item.title}; ${item.url}; accessed ${item.accessedDate}`,
    tier: item.sourceType === 'primary' ? 'primary' : 'institutional', status: 'in_review',
  })
  const knownClaims = new Set(claimRegister.claims.map(item => item.id))
  const claim = value => {
    if (!knownClaims.has(value)) throw new Error(`Unknown claim: ${value}`)
    return id('public.historical_claims', value)
  }
  for (const item of claimRegister.claims) {
    add('public.historical_claims', { id: claim(item.id), statement: item.statementVi, kind: 'uncertain', review_status: 'in_review',
      reviewer_note: `Pending historical classification; proposed=${item.proposedTruthClass}; ${item.notesVi ?? ''}` })
    for (const value of item.sourceIds) add('public.claim_sources', { claim_id: claim(item.id), source_id: source(value) })
  }
  for (const document of candidate.documents) {
    const documentId = id('public.learning_documents', document.id)
    add('public.learning_documents', { id: documentId, title: document.title, locale: document.locale, status: 'in_review' })
    document.sections.forEach((section, order) => {
      const { id: _id, kind, ...payload } = section
      add('public.document_sections', { id: id('public.document_sections', `${document.id}:${section.id}`), document_id: documentId,
        order_index: order, kind, payload })
    })
    for (const value of document.sourceIds) add('public.document_sources', { document_id: documentId, source_id: source(value) })
  }
  const questionIds = new Set(candidate.questions.map(item => item.id))
  const question = value => {
    if (!questionIds.has(value)) throw new Error(`Unknown question: ${value}`)
    return id('public.questions', value)
  }
  for (const item of candidate.questions) {
    add('public.questions', { id: question(item.id), prompt: item.prompt, difficulty: item.difficulty, status: 'in_review' })
    for (const value of item.sourceIds) add('public.question_sources', { question_id: question(item.id), source_id: source(value) })
    item.optionIds.forEach((optionId, order) => {
      const option = candidate.options.find(value => value.id === optionId && value.questionId === item.id)
      if (!option) throw new Error(`Missing option: ${optionId}`)
      add('public.question_options', { id: id('public.question_options', optionId), question_id: question(item.id), order_index: order, label: option.text })
    })
    const key = candidate.privateAnswerKeys.find(value => value.questionId === item.id)
    if (!key || !item.optionIds.includes(key.correctOptionId)) throw new Error(`Invalid private answer: ${item.id}`)
    add('private.question_answer_keys', { question_id: question(item.id), correct_option_ids: [id('public.question_options', key.correctOptionId)], explanation: item.explanation })
  }
  for (const set of candidate.questionSets) {
    const setId = id('public.question_sets', set.id)
    add('public.question_sets', { id: setId, title: set.title, mode: set.mode, status: 'in_review', daily_review_enabled: false })
    set.questionIds.forEach((value, order) => add('public.question_set_items', { question_set_id: setId, question_id: question(value), order_index: order }))
    for (const value of set.learningObjectiveIds) add('public.question_set_objectives', { question_set_id: setId, objective_id: objective(value) })
  }
  const chapter = candidate.chapter, chapterId = id('public.chapters', chapter.id)
  add('public.chapters', { id: chapterId, slug: chapter.slug, title: chapter.title, summary: chapter.summary,
    historical_period_label: chapter.historicalPeriodLabel, estimated_minutes: chapter.estimatedMinutes, status: 'in_review' })
  for (const value of chapter.learningObjectiveIds) add('public.chapter_objectives', { chapter_id: chapterId, objective_id: objective(value) })
  candidate.lessons.forEach(lesson => {
    const order = chapter.lessonRefs.find(value => value.id === lesson.id)?.order
    if (!Number.isInteger(order) || lesson.chapterId !== chapter.id) throw new Error('Invalid chapter lesson reference')
    const lessonId = id('public.lessons', lesson.id)
    add('public.lessons', { id: lessonId, chapter_id: chapterId, order_index: order, slug: lesson.slug, title: lesson.title,
      summary: lesson.summary, format: lesson.format, eligibility_version: lesson.contentVersionId,
      estimated_minutes: lesson.estimatedMinutes, status: 'in_review' })
    for (const value of lesson.learningObjectiveIds) add('public.lesson_objectives', { lesson_id: lessonId, objective_id: objective(value) })
    for (const value of lesson.prerequisites) add('public.lesson_prerequisites', { lesson_id: lessonId, prerequisite_lesson_id: id('public.lessons', value) })
    for (const block of lesson.blocks) {
      const row = { id: id('public.lesson_blocks', block.id), lesson_id: lessonId, order_index: block.order, required: block.required, kind: block.kind }
      for (const [key, table, column] of [['documentId','learning_documents','document_id'], ['storyVersionId','story_versions','story_version_id'],
        ['mediaAssetId','media_assets','media_asset_id'], ['questionSetId','question_sets','question_set_id']]) {
        if (block[key]) row[column] = id(`public.${table}`, block[key])
      }
      if (block.completionPolicy) row.completion_policy = block.completionPolicy
      if (block.assessmentMode) row.assessment_mode = block.assessmentMode
      add('public.lesson_blocks', row)
    }
  })
  return { source, claim, objective }
}
