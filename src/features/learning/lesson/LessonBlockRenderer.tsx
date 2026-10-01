import type { ComponentType } from 'react'
import { Card } from '../../../components/ui'
import { theme } from '../../../theme/tokens'
import type { DocumentSection, LessonBlock } from '../../../types/v2/content'
import type { ResolvedDocumentBlock, ResolvedLessonBlock } from './lessonRendererModel'

type VisualNovelBlock = Extract<LessonBlock, { kind: 'visual_novel' }>
type VideoBlock = Extract<LessonBlock, { kind: 'video' }>
type QuizBlock = Extract<LessonBlock, { kind: 'quiz' }>
export type LessonBlockSlots = {
  visualNovel: ComponentType<{ block: VisualNovelBlock }>
  video: ComponentType<{ block: VideoBlock }>
  quiz: ComponentType<{ block: QuizBlock }>
}

const labels = { visual_novel: 'Visual Novel', video: 'Video', quiz: 'Câu hỏi' } as const
function DeferredBlock({ kind }: { kind: keyof typeof labels }) {
  return <p role="status" style={{ color: theme.colors.textSecondary }}>{labels[kind]} sẽ được mở ở bước tiếp theo.</p>
}
const defaultSlots: LessonBlockSlots = {
  visualNovel: ({ block }) => <DeferredBlock kind={block.kind} />,
  video: ({ block }) => <DeferredBlock kind={block.kind} />,
  quiz: ({ block }) => <DeferredBlock kind={block.kind} />,
}

function DocumentSectionView({ section }: { section: DocumentSection }) {
  if (section.kind === 'heading') {
    return section.level === 2
      ? <h2 className="font-bold text-xl">{section.text}</h2>
      : <h3 className="font-bold text-lg">{section.text}</h3>
  }
  if (section.kind === 'key_points') {
    return <ul className="list-disc space-y-2 pl-5">{section.items.map(item => <li key={item}>{item}</li>)}</ul>
  }
  return <p className="leading-7">{section.text}</p>
}

function DocumentBlockView({ block }: { block: ResolvedDocumentBlock }) {
  const content = <div className="space-y-3">{block.document.sections.map(section => (
    <DocumentSectionView key={section.id} section={section} />
  ))}</div>
  if (block.kind === 'recap') {
    return <aside aria-label={`Tóm tắt: ${block.document.title}`}>{content}</aside>
  }
  return <article aria-label={block.document.title}>{content}</article>
}

export function LessonBlockRenderer({
  block,
  slots = defaultSlots,
}: { block: ResolvedLessonBlock; slots?: LessonBlockSlots }) {
  let content
  switch (block.kind) {
    case 'text':
    case 'recap': content = <DocumentBlockView block={block} />; break
    case 'visual_novel': content = <slots.visualNovel block={block} />; break
    case 'video': content = <slots.video block={block} />; break
    case 'quiz': content = <slots.quiz block={block} />; break
  }
  return <Card data-testid="lesson-block" data-block-id={block.id} data-block-kind={block.kind}>{content}</Card>
}
