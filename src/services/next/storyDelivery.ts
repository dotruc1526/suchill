import type { ChoiceScene, KnowledgeCheckChoice, NarrativeChoice, StoryVersion, VisualNovelScene } from '../../types/v2/content.ts'
import type { EpisodeProgress } from '../../types/v2/progress.ts'

/** Delivery contracts omit authored answer keys; trusted choice submission returns feedback. */
export type DeliveredSceneChoice = NarrativeChoice | Omit<KnowledgeCheckChoice, 'isCorrect' | 'explanation'>
export type DeliveredChoiceScene = Omit<ChoiceScene, 'choices'> & { choices: DeliveredSceneChoice[] }
export type DeliveredScene = Exclude<VisualNovelScene, ChoiceScene> | DeliveredChoiceScene
export type DeliveredStoryVersion = Omit<StoryVersion, 'scenes'> & { scenes: DeliveredScene[] }
export type StoryChoiceFeedback = { choiceId: string; outcome: 'correct' | 'incorrect' | 'neutral'; message: string }
export type StoryChoiceReceipt = EpisodeProgress & { choiceFeedback: StoryChoiceFeedback }

export function deliverStory(story: StoryVersion): DeliveredStoryVersion {
  return { ...structuredClone(story), scenes: story.scenes.map(scene => scene.kind !== 'choice'
    ? structuredClone(scene)
    : { ...structuredClone(scene), choices: scene.choices.map(choice => {
      if (choice.kind !== 'knowledge_check') return structuredClone(choice)
      const { isCorrect: _answer, explanation: _explanation, ...delivered } = choice
      return delivered
    }) }) }
}
