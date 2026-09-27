/** Phase 5 domain types. Kept separate from numeric-ID demo types until integration. */
export type EntityId = string
export type ISODateTime = string
export type PublishStatus = 'draft' | 'in_review' | 'approved' | 'published' | 'archived'
export type OrderedRef = { id: EntityId; order: number }

export type Chapter = {
  id: EntityId
  slug: string
  title: string
  subtitle?: string
  summary: string
  historicalPeriodLabel: string
  coverMediaId?: EntityId
  learningObjectiveIds: EntityId[]
  lessonRefs: OrderedRef[]
  estimatedMinutes: number
  status: PublishStatus
}

export type BaseBlock = { id: EntityId; order: number; required: boolean }
export type LessonBlock =
  | (BaseBlock & { kind: 'text' | 'recap'; documentId: EntityId })
  | (BaseBlock & { kind: 'visual_novel'; storyVersionId: EntityId })
  | (BaseBlock & {
      kind: 'video'
      mediaAssetId: EntityId
      completionPolicy: 'optional' | 'reach_end' | 'watch_threshold'
      knowledgeCheckSetId?: EntityId
    })
  | (BaseBlock & {
      kind: 'quiz'
      questionSetId: EntityId
      assessmentMode: 'practice' | 'scored'
    })

export type Lesson = {
  id: EntityId
  chapterId: EntityId
  slug: string
  title: string
  summary: string
  format: 'standard' | 'visual_novel' | 'video' | 'quiz' | 'mixed'
  estimatedMinutes: number
  learningObjectiveIds: EntityId[]
  prerequisites: EntityId[]
  blocks: LessonBlock[]
  status: PublishStatus
}

export type NarrativeChoice = {
  id: EntityId
  kind: 'narrative' | 'reflection' | 'branching'
  label: string
  response?: string
  nextSceneId: EntityId
  isCorrect?: never
}
export type KnowledgeCheckChoice = {
  id: EntityId
  kind: 'knowledge_check'
  label: string
  isCorrect: boolean
  explanation: string
  nextSceneId?: EntityId
}
export type SceneChoice = NarrativeChoice | KnowledgeCheckChoice
export type BaseScene = {
  id: EntityId
  title?: string
  backdropMediaId?: EntityId
  sourceIds: EntityId[]
  claimIds: EntityId[]
}
export type VisualNovelScene =
  | (BaseScene & { kind: 'narration'; text: string; nextSceneId: EntityId })
  | (BaseScene & { kind: 'dialogue'; speaker: string; line: string; nextSceneId: EntityId })
  | (BaseScene & {
      kind: 'choice'
      prompt: string
      policy: 'retry_until_correct' | 'continue_after_feedback'
      choices: SceneChoice[]
    })
  | (BaseScene & { kind: 'media'; mediaAssetId: EntityId; caption: string; nextSceneId: EntityId })
  | (BaseScene & { kind: 'debrief'; summary: string; nextSceneId: EntityId })
  | (BaseScene & { kind: 'end'; summary: string; nextSceneId?: never })

export type StoryVersion = {
  id: EntityId
  storyId: EntityId
  versionNumber: number
  status: PublishStatus
  startSceneId: EntityId
  scenes: VisualNovelScene[]
  learningObjectiveIds: EntityId[]
  sourceIds: EntityId[]
  createdAt: ISODateTime
  publishedAt?: ISODateTime
}
export type VisualNovelStory = {
  id: EntityId
  slug: string
  title: string
  summary: string
  latestPublishedVersionId?: EntityId
}

export type HistoricalSource = {
  id: EntityId
  title: string
  authorOrInstitution?: string
  publishedYear?: number
  url?: string
  citationText: string
  tier: 'primary' | 'scholarly' | 'institutional' | 'reference'
}
export type HistoricalClaim = {
  id: EntityId
  statement: string
  kind: 'fact' | 'interpretation' | 'fiction' | 'composite' | 'uncertain'
  sourceIds: EntityId[]
  reviewStatus: PublishStatus
  reviewerNote?: string
}
export type MediaAsset = {
  id: EntityId
  kind: 'image' | 'video' | 'audio' | 'illustration'
  title: string
  storageRef: string
  posterMediaId?: EntityId
  caption?: string
  altText?: string
  transcriptRef?: string
  captionTrackRefs?: string[]
  durationSeconds?: number
  aspectRatio?: string
  sourceIds: EntityId[]
  attribution?: string
  license?: string
  reviewStatus: PublishStatus
}
export type QuestionSet = {
  id: EntityId
  title: string
  questionIds: EntityId[]
  learningObjectiveIds: EntityId[]
  mode: 'practice' | 'scored'
}
export type MultipleChoiceQuestion = {
  id: EntityId
  prompt: string
  optionIds: EntityId[]
  explanation: string
  sourceIds: EntityId[]
  difficulty: 'intro' | 'standard' | 'advanced'
  status: PublishStatus
}
