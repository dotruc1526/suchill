/** Canonical Phase 5 authored-content domain. Database rows and UI state stay separate. */
export type EntityId = string
export type ISODateTime = string
export type Locale = 'vi-VN'
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
export type TextBlock = BaseBlock & { kind: 'text'; documentId: EntityId }
export type VisualNovelBlock = BaseBlock & { kind: 'visual_novel'; storyVersionId: EntityId }
export type VideoBlock = BaseBlock & {
  kind: 'video'
  mediaAssetId: EntityId
  completionPolicy: 'optional' | 'reach_end' | 'watch_threshold'
  knowledgeCheckSetId?: EntityId
}
export type QuizBlock = BaseBlock & {
  kind: 'quiz'
  questionSetId: EntityId
  assessmentMode: 'practice' | 'scored'
}
export type RecapBlock = BaseBlock & { kind: 'recap'; documentId: EntityId }
export type LessonBlock = TextBlock | VisualNovelBlock | VideoBlock | QuizBlock | RecapBlock

export type LessonFormat = 'standard' | 'visual_novel' | 'video' | 'quiz' | 'mixed'
export type Lesson = {
  contentVersionId?: EntityId
  id: EntityId
  chapterId: EntityId
  slug: string
  title: string
  summary: string
  format: LessonFormat
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
export type NarrationScene = BaseScene & { kind: 'narration'; text: string; nextSceneId: EntityId }
export type DialogueScene = BaseScene & {
  kind: 'dialogue'
  speaker: string
  characterId?: EntityId
  line: string
  emotion?: string
  nextSceneId: EntityId
}
export type ChoiceScene = BaseScene & {
  kind: 'choice'
  prompt: string
  policy: 'retry_until_correct' | 'continue_after_feedback'
  choices: SceneChoice[]
}
export type MediaScene = BaseScene & {
  kind: 'media'
  mediaAssetId: EntityId
  caption: string
  context?: string
  nextSceneId: EntityId
}
export type DebriefScene = BaseScene & {
  kind: 'debrief'
  summary: string
  factClaimIds?: EntityId[]
  fictionClaimIds?: EntityId[]
  nextSceneId: EntityId
}
export type EndScene = BaseScene & { kind: 'end'; summary: string; nextSceneId?: never }
export type VisualNovelScene =
  | NarrationScene
  | DialogueScene
  | ChoiceScene
  | MediaScene
  | DebriefScene
  | EndScene

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
export type ClaimKind = 'fact' | 'interpretation' | 'fiction' | 'composite' | 'uncertain'
export type HistoricalClaim = {
  id: EntityId
  statement: string
  kind: ClaimKind
  sourceIds: EntityId[]
  reviewStatus: PublishStatus
  reviewerNote?: string
}
export type MediaKind = 'image' | 'video' | 'audio' | 'illustration'
export type MediaAsset = {
  id: EntityId
  kind: MediaKind
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

export type { LearningDocument, DocumentSection } from './document.ts'
