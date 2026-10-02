import { geneva1954Story } from './geneva-1954'

const stories = { [geneva1954Story.id]: geneva1954Story }

export function getVisualNovel(id: string) {
  return stories[id as keyof typeof stories]
}
