import type { LearningServices, Result, StoryCheckpointContext } from '../../../services/next/contracts'
import type { DeliveredSceneChoice as SceneChoice, DeliveredStoryVersion as StoryVersion } from '../../../services/next/storyDelivery'
import type { KnowledgeCheckChoice } from '../../../types/v2/content'

export type VisualNovelContext = Omit<StoryCheckpointContext, 'operationId'>
export type ChoiceFeedback = {
  choiceId: string
  outcome: 'correct' | 'incorrect' | 'neutral'
  message: string
}
export type VisualNovelSession = {
  story: StoryVersion
  currentSceneId: string
  confirmedSceneId: string
  visitedSceneIds: string[]
  lockedChoiceIds: string[]
  replay: boolean
  revision?: number
  feedback?: ChoiceFeedback
  pendingSceneId?: string
}

export const getCurrentScene = (session: VisualNovelSession) =>
  session.story.scenes.find(scene => scene.id === session.currentSceneId)

export const visualNovelContextKey = (context: VisualNovelContext) =>
  `${context.lessonId}:${context.blockId}:${context.storyVersionId}`

export const isVisualNovelRenderCurrent = (
  loadedContextKey: string,
  loadedServices: LearningServices,
  currentContextKey: string,
  currentServices: LearningServices,
) => loadedContextKey === currentContextKey && loadedServices === currentServices

export type VisualNovelActionToken = { contextKey: string; generation: number }

export class VisualNovelActionGate {
  private activeContextKey: string
  private generation = 0

  constructor(contextKey: string) {
    this.activeContextKey = contextKey
  }

  activate(contextKey: string) {
    if (contextKey === this.activeContextKey) return
    this.activeContextKey = contextKey
    this.generation += 1
  }

  begin(contextKey: string): VisualNovelActionToken {
    this.generation += 1
    return { contextKey, generation: this.generation }
  }

  invalidate() {
    this.generation += 1
  }

  isCurrent(token: VisualNovelActionToken) {
    return token.contextKey === this.activeContextKey && token.generation === this.generation
  }
}

const sceneExists = (story: StoryVersion, sceneId: string) => story.scenes.some(scene => scene.id === sceneId)
const success = (session: VisualNovelSession): Result<VisualNovelSession> => ({ ok: true, value: session })

export async function loadVisualNovel(
  services: LearningServices,
  context: VisualNovelContext,
): Promise<Result<VisualNovelSession>> {
  const storyResult = await services.stories.getVersion(context.storyVersionId)
  if (!storyResult.ok) return storyResult
  const progressResult = await services.progress.getEpisodeProgress(context.storyVersionId)
  if (!progressResult.ok) return progressResult
  let progress = progressResult.value
  if (!progress && services.progress.recordChoiceWithFeedback) {
    const initialized = await services.progress.saveEpisodeCheckpoint({...context,
      currentSceneId:storyResult.value.startSceneId, visitedSceneIds:[], expectedRevision:0, operationId:crypto.randomUUID()})
    if (!initialized.ok) {
      if (initialized.error !== 'conflict') return initialized
      const current = await services.progress.getEpisodeProgress(context.storyVersionId)
      if (!current.ok || !current.value) return initialized
      progress = current.value
    } else progress = initialized.value
  }
  const currentSceneId = progress?.currentSceneId ?? storyResult.value.startSceneId
  if (!sceneExists(storyResult.value, currentSceneId)) return { ok: false, error: 'validation' }
  return success({
    story: storyResult.value,
    currentSceneId,
    confirmedSceneId: currentSceneId,
    visitedSceneIds: progress?.visitedSceneIds ?? [],
    lockedChoiceIds: progress?.lockedChoiceIds ?? [],
    replay: false, revision: progress?.revision,
  })
}

export async function advanceVisualNovel(
  services: LearningServices,
  context: VisualNovelContext,
  session: VisualNovelSession,
  operationId: string,
): Promise<Result<VisualNovelSession>> {
  const scene = getCurrentScene(session)
  if (!scene || scene.kind === 'choice' || scene.kind === 'end') return { ok: false, error: 'validation' }
  const nextSceneId = scene.nextSceneId
  if (!sceneExists(session.story, nextSceneId)) return { ok: false, error: 'validation' }
  if (session.replay) return success({ ...session, currentSceneId: nextSceneId, feedback: undefined, pendingSceneId: undefined })

  const saved = await services.progress.saveEpisodeCheckpoint({
    ...context, operationId, currentSceneId: nextSceneId, expectedRevision:session.revision,
    visitedSceneIds: [...session.visitedSceneIds, scene.id],
  })
  if (!saved.ok) return saved
  return success({
    ...session,
    currentSceneId: saved.value.currentSceneId,
    confirmedSceneId: saved.value.currentSceneId,
    visitedSceneIds: saved.value.visitedSceneIds,
    lockedChoiceIds: saved.value.lockedChoiceIds, revision:saved.value.revision,
  })
}

const feedbackFor = (choice: SceneChoice): ChoiceFeedback => choice.kind === 'knowledge_check'
  ? { choiceId: choice.id, outcome: ('isCorrect' in choice && choice.isCorrect) ? 'correct' : 'incorrect', message: ('explanation' in choice ? choice.explanation as string : 'Chưa có phản hồi từ dịch vụ.') }
  : { choiceId: choice.id, outcome: 'neutral', message: choice.response ?? 'Lựa chọn đã được ghi nhận.' }

export async function chooseVisualNovel(
  services: LearningServices,
  context: VisualNovelContext,
  session: VisualNovelSession,
  choiceId: string,
  operationId: string,
): Promise<Result<VisualNovelSession>> {
  const scene = getCurrentScene(session)
  if (scene?.kind !== 'choice' || session.feedback) return { ok: false, error: 'validation' }
  const choice = scene.choices.find(item => item.id === choiceId)
  if (!choice) return { ok: false, error: 'validation' }

  let revision = session.revision
  let trustedFeedback: ChoiceFeedback | undefined
  let pendingSceneId = choice.nextSceneId ?? scene.id
  let lockedChoiceIds = session.lockedChoiceIds
  let visitedSceneIds = session.visitedSceneIds
  if (services.progress.recordChoiceWithFeedback) {
    const saved = await services.progress.recordChoiceWithFeedback({ ...context, operationId, sceneId: scene.id, choiceId, replay: session.replay, expectedRevision:session.revision })
    if (!saved.ok) return saved
    trustedFeedback = saved.value.choiceFeedback
    if (!session.replay) revision = saved.value.revision
    pendingSceneId = saved.value.currentSceneId
    if (!session.replay) { lockedChoiceIds = saved.value.lockedChoiceIds; visitedSceneIds = saved.value.visitedSceneIds }
  } else if (!session.replay) {
    const saved = await services.progress.recordChoice({ ...context, operationId, sceneId: scene.id, choiceId })
    if (!saved.ok) return saved
    pendingSceneId = saved.value.currentSceneId
    lockedChoiceIds = saved.value.lockedChoiceIds
    visitedSceneIds = saved.value.visitedSceneIds
  } else if (choice.kind === 'knowledge_check' && !('isCorrect' in choice && choice.isCorrect) && scene.policy === 'retry_until_correct') {
    pendingSceneId = scene.id
  }
  if (!sceneExists(session.story, pendingSceneId)) return { ok: false, error: 'validation' }
  return success({
    ...session,
    confirmedSceneId: session.replay ? session.confirmedSceneId : pendingSceneId,
    feedback: trustedFeedback ?? feedbackFor(choice), pendingSceneId, lockedChoiceIds, visitedSceneIds, revision,
  })
}

export function continueChoiceFeedback(session: VisualNovelSession): Result<VisualNovelSession> {
  if (!session.feedback || !session.pendingSceneId) return { ok: false, error: 'validation' }
  const confirmedSceneId = session.replay ? session.confirmedSceneId : session.pendingSceneId
  return success({
    ...session, currentSceneId: session.pendingSceneId, confirmedSceneId,
    feedback: undefined, pendingSceneId: undefined,
  })
}

export const restartVisualNovel = (session: VisualNovelSession): VisualNovelSession => ({
  ...session, currentSceneId: session.story.startSceneId, replay: true, feedback: undefined, pendingSceneId: undefined,
})

export function reviewVisualNovelScene(session: VisualNovelSession, sceneId: string): Result<VisualNovelSession> {
  const reviewable = sceneId === session.story.startSceneId || sceneId === session.confirmedSceneId || session.visitedSceneIds.includes(sceneId)
  return reviewable && sceneExists(session.story, sceneId)
    ? success({ ...session, currentSceneId: sceneId, replay: true, feedback: undefined, pendingSceneId: undefined })
    : { ok: false, error: 'validation' }
}

export const resumeVisualNovel = (session: VisualNovelSession): VisualNovelSession => ({
  ...session, currentSceneId: session.confirmedSceneId, replay: false, feedback: undefined, pendingSceneId: undefined,
})
