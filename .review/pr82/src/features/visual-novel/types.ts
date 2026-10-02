import type { MascotEmotion } from '../../Mascot'

export type SceneChoice = {
  label: string
  response: string
  correct?: boolean
  note?: string
}

export type SceneBackdrop = 'hall' | 'map' | 'people' | 'table' | 'dawn'

export type VisualNovelScene = {
  id: string
  title: string
  text: string
  emotion: MascotEmotion
  backdrop: SceneBackdrop
  image?: string
  choices?: SceneChoice[]
}

export type VisualNovelStory = {
  id: string
  title: string
  scenes: VisualNovelScene[]
}
