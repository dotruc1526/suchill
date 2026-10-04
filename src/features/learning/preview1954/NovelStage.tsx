import { useEffect, useRef, useState } from 'react'
import Mascot from '../../../Mascot'
import { Button } from '../../../components/ui'
import { theme } from '../../../theme/tokens'
import type { SceneChoice, VisualNovelStory } from '../../visual-novel/types'
import { NovelBackdrop } from './NovelBackdrop'
import './previewNovel.css'

export function NovelStage({ story, onBack, onComplete }: {
  story: VisualNovelStory; onBack: () => void; onComplete: () => void
}) {
  const [index, setIndex] = useState(0)
  const [feedback, setFeedback] = useState<SceneChoice | null>(null)
  const scene = story.scenes[index]
  const title = useRef<HTMLHeadingElement>(null)
  const response = useRef<HTMLDivElement>(null)
  const colors = theme.colors
  const feedbackColors = feedback?.correct === false ? colors.incorrect : feedback?.correct === true ? colors.correct : colors.selected
  useEffect(() => { title.current?.focus() }, [index])
  useEffect(() => { if (feedback) response.current?.focus() }, [feedback])
  function advance() {
    if (feedback?.correct === false) { setFeedback(null); title.current?.focus(); return }
    setFeedback(null)
    setIndex(value => Math.min(value + 1, story.scenes.length - 1))
  }
  return <section data-testid="preview1954-novel-stage" aria-label="Game Visual Novel demo" className="overflow-hidden rounded-2xl border" style={{ borderColor: colors.borderMedium, background: colors.cardBg }}>
    <div className="flex items-center justify-between gap-3 p-3">
      <button type="button" className="min-h-11 px-2 text-sm font-bold" onClick={onBack}>‹ Về bài học</button>
      <span className="text-xs font-bold" aria-label={`Cảnh ${index + 1} trên ${story.scenes.length}`}>CẢNH {index + 1} / {story.scenes.length}</span>
    </div>
    <div className="flex gap-1 px-4 pb-3" aria-hidden="true">{story.scenes.map((item, position) => <span key={item.id} className="h-1 flex-1 rounded-full" style={{ background: position <= index ? colors.primary : colors.borderLight }} />)}</div>
    <div key={scene.id} className="vn-preview-scene">
      <div className="relative">
        <NovelBackdrop type={scene.backdrop} />
        <div className="absolute bottom-8 right-3 h-24 w-24 overflow-hidden rounded-full border-2" style={{ borderColor: colors.primary, background: colors.cardBg }} aria-hidden="true">
          <div className="absolute -left-4 top-0"><Mascot decorative emotion={scene.emotion} size={128} /></div>
        </div>
      </div>
      <div className="relative mx-3 -mt-6 rounded-xl border p-4" style={{ background: colors.cardBg, borderColor: colors.primaryBorder }}>
        <p className="mb-2 text-xs font-bold tracking-wide" style={{ color: colors.primary }}>SỬU · NGƯỜI DẪN CHUYỆN</p>
        <h3 ref={title} tabIndex={-1} className="mb-3 text-base font-bold outline-none">{scene.title}</h3>
        <p className="text-sm leading-7">{scene.text}</p>
      </div>
      <div className="space-y-3 p-4">
        {scene.choices && <>
          <p className="text-xs" style={{ color: colors.textMuted }}>{scene.choices.some(choice => choice.correct !== undefined) ? 'Câu hỏi kiến thức · Bạn có thể đọc giải thích và thử lại.' : 'Bạn chọn lời đáp nào? Không có đáp án đúng hoặc sai.'}</p>
          <div className="space-y-2" aria-label="Lựa chọn lời đáp">{scene.choices.map((choice, choiceIndex) => <button
            key={choice.label} type="button" disabled={feedback !== null} aria-pressed={feedback === choice}
            onClick={() => setFeedback(choice)} className="flex min-h-12 w-full items-start gap-3 rounded-xl border p-3 text-left text-sm leading-6 disabled:opacity-80"
            style={{ borderColor: feedback === choice ? colors.primary : colors.borderMedium, background: feedback === choice ? colors.selected.bg : colors.cardBg }}>
            <span className="font-bold" style={{ color: colors.primary }}>{choiceIndex + 1}.</span><span>{choice.label}</span>
          </button>)}</div>
        </>}
        {feedback && <div ref={response} tabIndex={-1} role="status" className="space-y-3 rounded-xl border p-4 outline-none" style={{ background: feedbackColors.bg, borderColor: feedbackColors.border }}>
          <p className="text-sm font-bold" style={{ color: feedbackColors.text }}>{feedback.correct === undefined ? 'Lời đáp của bạn' : feedback.correct ? 'Đúng rồi!' : 'Cùng xem lại nhé'} · {feedback.response}</p>
          {feedback.note && <p className="text-sm leading-6">{feedback.note}</p>}
          <Button className="w-full" onClick={advance}>{feedback.correct === false ? 'THỬ CHỌN LẠI' : 'TIẾP TỤC ›'}</Button>
        </div>}
        {!scene.choices && <Button className="w-full" onClick={onComplete}>ĐẾN PHẦN NHÌN LẠI BÀI HỌC ›</Button>}
      </div>
    </div>
  </section>
}
