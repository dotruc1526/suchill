import type { ComponentType, Ref } from 'react'
import { Button, Card } from '../../../components/ui'
import { theme } from '../../../theme/tokens'
import type { MediaScene } from '../../../types/v2/content'
import type { DeliveredSceneChoice, DeliveredScene } from '../../../services/next/storyDelivery'
import type { ChoiceFeedback } from './visualNovelModel'

export type VisualNovelMediaSlot = ComponentType<{ scene: MediaScene }>
type Props = {
  scene: DeliveredScene
  feedback?: ChoiceFeedback
  busy: boolean
  mediaSlot?: VisualNovelMediaSlot
  onChoice: (choiceId: string) => void
  onContinue: () => void
  onComplete: () => void
  sceneRef?: Ref<HTMLDivElement>
  feedbackRef?: Ref<HTMLDivElement>
}

function choiceDescription(choice: DeliveredSceneChoice) {
  if (choice.kind === 'knowledge_check') return 'Câu hỏi kiến thức'
  if (choice.kind === 'reflection') return 'Lựa chọn suy ngẫm, không có đúng sai'
  return 'Lựa chọn câu chuyện, không có đúng sai'
}

export function VisualNovelSceneView({
  scene, feedback, busy, mediaSlot: Media, onChoice, onContinue, onComplete, sceneRef, feedbackRef,
}: Props) {
  return <div ref={sceneRef} tabIndex={-1} aria-label={scene.title ?? 'Nội dung Visual Novel hiện tại'}>
    <Card data-testid="vn-scene" data-scene-id={scene.id} className="space-y-4">
    {scene.title && <h2 id="vn-scene-heading" tabIndex={-1} className="font-bold text-xl" style={{ color: theme.colors.textPrimary }}>{scene.title}</h2>}
    {scene.kind === 'narration' && <p className="leading-7">{scene.text}</p>}
    {scene.kind === 'dialogue' && <blockquote><strong>{scene.speaker}</strong><p className="leading-7">{scene.line}</p></blockquote>}
    {scene.kind === 'media' && <>{Media ? <Media scene={scene} /> : <div role="img" aria-label={scene.caption} className="p-4" style={{ background: theme.colors.surfaceMuted }}><p>{scene.caption}</p>{scene.context && <p>{scene.context}</p>}</div>}</>}
    {scene.kind === 'debrief' && <section aria-label="Tổng kết"><p className="leading-7">{scene.summary}</p><p style={{ color: theme.colors.textSecondary }}>Phân biệt dữ kiện và yếu tố hư cấu trước khi tiếp tục.</p></section>}
    {scene.kind === 'end' && <><p className="leading-7">{scene.summary}</p><Button onClick={onComplete}>HOÀN TẤT PHẦN TRÌNH BÀY</Button></>}
    {scene.kind === 'choice' && <fieldset disabled={busy || Boolean(feedback)} className="space-y-3">
      <legend className="font-bold">{scene.prompt}</legend>
      {scene.choices.map(choice => <Button key={choice.id} variant="secondary" className="w-full text-left" aria-describedby={`choice-help-${choice.id}`} onClick={() => onChoice(choice.id)}>
        {choice.label}<span id={`choice-help-${choice.id}`} className="sr-only">{choiceDescription(choice)}</span>
      </Button>)}
    </fieldset>}
    {feedback && <div ref={feedbackRef} tabIndex={-1} role="status" className="rounded-md p-3" style={{
      background: feedback.outcome === 'correct' ? theme.colors.correct.bg : feedback.outcome === 'incorrect' ? theme.colors.incorrect.bg : theme.colors.selected.bg,
      color: feedback.outcome === 'correct' ? theme.colors.correct.text : feedback.outcome === 'incorrect' ? theme.colors.incorrect.text : theme.colors.selected.text,
    }}><strong>{feedback.outcome === 'correct' ? '✓ Chính xác' : feedback.outcome === 'incorrect' ? '✗ Chưa chính xác' : 'Lựa chọn đã ghi nhận'}</strong><p>{feedback.message}</p><Button onClick={onContinue}>TIẾP TỤC</Button></div>}
    {!feedback && scene.kind !== 'choice' && scene.kind !== 'end' && <Button disabled={busy} onClick={onContinue}>TIẾP TỤC</Button>}
    </Card>
  </div>
}
