import type { LessonBlock } from '../../../types/v2/content'
import type { VideoPlayerContext } from '../video'
import type { VisualNovelContext } from '../../visual-novel/v2'

type VisualNovelBlock = Extract<LessonBlock, { kind: 'visual_novel' }>
type VideoBlock = Extract<LessonBlock, { kind: 'video' }>

export const visualNovelPlayerContext = (
  lessonId: string,
  block: VisualNovelBlock,
): VisualNovelContext => ({ lessonId, blockId: block.id, storyVersionId: block.storyVersionId })

export const videoPlayerContext = (
  lessonId: string,
  block: VideoBlock,
): VideoPlayerContext => ({ lessonId, blockId: block.id, mediaAssetId: block.mediaAssetId })
