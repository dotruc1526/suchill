import type { Chapter, Lesson, LearningDocument, MultipleChoiceQuestion, QuestionSet, StoryVersion, VisualNovelScene } from '../../types/v2/content'
import type { CandidateLesson } from './candidateTypes'
import { previewChapter } from './catalog'
import { lessonSixStory } from './lessonSixStory'
import { validateStoryVersion } from '../next/storyValidation'

// Preparation only: every authored entity remains in_review; no DB or publication operation.
const storyId = 'candidate.1954.geneva.story.v2'
function textId(text: string) {
  let hash = 2166136261
  for (const character of text) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619)
  return (hash >>> 0).toString(16)
}
function unique(values: string[], label: string) {
  if (new Set(values).size !== values.length) throw new Error(`Duplicate ${label}`)
}
export function buildCandidateImport(studies: CandidateLesson[], knownSources: ReadonlySet<string>) {
  unique(studies.map(study => study.id), 'lesson IDs')
  const ordered = previewChapter.episodes.map(episode => {
    const study = studies.find(item => item.id === `${episode.id}.candidate`)
    if (!study) throw new Error(`Missing lesson ${episode.id}`)
    return { episode, study }
  })
  if (studies.length !== ordered.length) throw new Error('Unexpected extra lesson')
  const sourcesFor = (study: CandidateLesson) => [...new Set([
    ...study.sections.flatMap(section => section.sourceIds), ...study.checks.flatMap(check => check.sourceIds),
  ])]
  const documents: LearningDocument[] = []
  const questionSets: QuestionSet[] = []
  const questions: MultipleChoiceQuestion[] = []
  const options: { id: string; questionId: string; text: string }[] = []
  const privateAnswerKeys: { questionId: string; correctOptionId: string }[] = []
  const lessons: Lesson[] = ordered.map(({ episode, study }, order) => {
    if (!study.sections.length || !study.checks.length) throw new Error(`Incomplete lesson ${study.id}`)
    unique(study.sections.map(section => section.id), 'section IDs')
    unique(study.checks.map(check => check.id), 'check IDs')
    if ([...study.sections, ...study.checks].some(block => !block.sourceIds.length)) throw new Error(`Missing source binding ${study.id}`)
    const sourceIds = sourcesFor(study)
    if (!sourceIds.length || sourceIds.some(id => !knownSources.has(id))) throw new Error(`Unknown source in ${study.id}`)
    const readingId = `${study.id}.reading.${study.version}`
    const recapId = `${study.id}.recap.${study.version}`
    documents.push({ id: readingId, title: episode.title, locale: 'vi-VN', status: 'in_review', sourceIds,
      sections: study.sections.flatMap(section => [
        { id: section.id, kind: 'heading' as const, text: section.title, level: 2 as const },
        ...section.paragraphs.map(text => ({ id: `${section.id}.p.${textId(text)}`, kind: 'paragraph' as const, text })),
      ]) })
    unique(documents.at(-1)!.sections.map(section => section.id), 'document section IDs')
    documents.push({ id: recapId, title: 'Nhìn lại bài học', locale: 'vi-VN', status: 'in_review', sourceIds,
      sections: [{ id: `${recapId}.takeaway`, kind: 'paragraph', text: study.takeaway },
        { id: `${recapId}.reflection`, kind: 'paragraph', text: study.reflection }] })
    const setId = `${study.id}.practice.${study.version}`
    questionSets.push({ id: setId, title: `Kiểm tra: ${episode.title}`, questionIds: study.checks.map(check => check.id),
      learningObjectiveIds: [`${study.id}.objective`], mode: 'practice' })
    for (const check of study.checks) {
      unique(check.choices.map(choice => choice.id), 'choice IDs')
      if (check.choices.length < 2 || !check.choices.some(choice => choice.id === check.answerId)) throw new Error(`Invalid answer ${check.id}`)
      const optionId = (id: string) => `${check.id}.${id}`
      questions.push({ id: check.id, prompt: check.prompt, optionIds: check.choices.map(choice => optionId(choice.id)),
        explanation: check.explanation, sourceIds: check.sourceIds, difficulty: 'intro', status: 'in_review' })
      options.push(...check.choices.map(choice => ({ id: optionId(choice.id), questionId: check.id, text: choice.text })))
      privateAnswerKeys.push({ questionId: check.id, correctOptionId: optionId(check.answerId) })
    }
    const blocks: Lesson['blocks'] = [{ id: `${study.id}.read`, order: 0, required: true, kind: 'text', documentId: readingId }]
    if (order === 0) blocks.push({ id: `${study.id}.video`, order: blocks.length, required: false, kind: 'video',
      mediaAssetId: 'candidate.1954.video.corrected.v2', completionPolicy: 'optional' })
    if (order === 5) blocks.push({ id: `${study.id}.story`, order: blocks.length, required: true, kind: 'visual_novel', storyVersionId: storyId })
    blocks.push({ id: `${study.id}.check`, order: blocks.length, required: true, kind: 'quiz', questionSetId: setId, assessmentMode: 'practice' })
    blocks.push({ id: `${study.id}.recap`, order: blocks.length, required: true, kind: 'recap', documentId: recapId })
    return { id: study.id, contentVersionId: `${study.id}.${study.version}`, chapterId: 'candidate.chapter1954.v1',
      slug: `1954-${episode.id.slice(-2)}`, title: episode.title, summary: study.objective,
      format: order === 0 || order === 5 ? 'mixed' : 'standard', estimatedMinutes: 6,
      learningObjectiveIds: [`${study.id}.objective`], prerequisites: [], blocks, status: 'in_review' }
  })
  unique(questions.map(question => question.id), 'question IDs')
  unique(options.map(option => option.id), 'option IDs')
  const chapter: Chapter = { id: 'candidate.chapter1954.v1', slug: 'nam-1954', title: 'Năm 1954',
    summary: 'Từ Điện Biên Phủ đến các thỏa thuận Genève và chặng đường tiếp theo.', historicalPeriodLabel: '1953–1954',
    learningObjectiveIds: lessons.flatMap(lesson => lesson.learningObjectiveIds), estimatedMinutes: 42,
    lessonRefs: lessons.map((lesson, order) => ({ id: lesson.id, order })), status: 'in_review' }
  const sceneId = (id: string) => `${storyId}.${id}`
  const sourceIds = sourcesFor(ordered[5].study)
  const scenes: VisualNovelScene[] = lessonSixStory.scenes.map((scene, index) => {
    const base = { id: sceneId(scene.id), title: scene.title, sourceIds, claimIds: [] }
    const nextSceneId = index < lessonSixStory.scenes.length - 1 ? sceneId(lessonSixStory.scenes[index + 1].id) : `${storyId}.end`
    if (!scene.choices) return { ...base, kind: 'debrief', summary: scene.text, nextSceneId }
    return { ...base, kind: 'choice', prompt: scene.text,
      policy: scene.choices.some(choice => choice.correct !== undefined) ? 'retry_until_correct' : 'continue_after_feedback',
      choices: scene.choices.map(choice => choice.correct === undefined
        ? { id: `${base.id}.${textId(choice.label)}`, kind: 'reflection' as const, label: choice.label, response: choice.response, nextSceneId }
        : { id: `${base.id}.${textId(choice.label)}`, kind: 'knowledge_check' as const, label: choice.label,
          isCorrect: choice.correct, explanation: choice.note ?? choice.response, ...(choice.correct ? { nextSceneId } : {}) }) }
  })
  scenes.push({ id: `${storyId}.end`, kind: 'end', summary: ordered[5].study.takeaway, sourceIds, claimIds: [] })
  const story: StoryVersion = { id: storyId, storyId: 'candidate.1954.geneva', versionNumber: 2, status: 'in_review',
    startSceneId: scenes[0].id, scenes, learningObjectiveIds: lessons[5].learningObjectiveIds, sourceIds, createdAt: '2026-10-04T00:00:00Z' }
  if (validateStoryVersion(story, { sourceIds: knownSources }).length) throw new Error('Invalid candidate story graph')
  const objectives = ordered.map(({ study }) => ({ id: `${study.id}.objective`, text: study.objective }))
  return { chapter, lessons, documents, questionSets, questions, options, privateAnswerKeys, story, objectives,
    publicationAllowed: false as const,
    pendingBindings: ['Reviewed media asset candidate.1954.video.corrected.v2', 'Historical/learning acceptance',
      'Domain IDs mapped to database UUIDs in trusted import transaction'] }
}
