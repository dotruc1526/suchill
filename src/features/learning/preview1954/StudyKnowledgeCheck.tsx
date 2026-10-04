import { useEffect, useRef, useState } from 'react'
import { Button, Card } from '../../../components/ui'
import { theme } from '../../../theme/tokens'
import type { StudyCheck } from '../../../services/reference1954/candidateTypes'

export function StudyKnowledgeCheck({ check, number }: { check: StudyCheck; number: number }) {
  const [selected, setSelected] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)
  const feedback = useRef<HTMLDivElement>(null)
  const options = useRef<HTMLDivElement>(null)
  const retryRequested = useRef(false)
  const correct = selected === check.answerId
  const colors = correct ? theme.colors.correct : theme.colors.incorrect
  useEffect(() => {
    if (revealed) feedback.current?.focus()
    else if (retryRequested.current) { options.current?.querySelector('button')?.focus(); retryRequested.current = false }
  }, [revealed])
  function retry() { retryRequested.current = true; setRevealed(false); setSelected(null) }
  return <Card className="space-y-3" data-testid="study-check">
    <h3 id={check.id} className="font-bold">Câu {number}: {check.prompt}</h3>
    <div ref={options} role="group" aria-labelledby={check.id} className="space-y-2">{check.choices.map(choice => <button
      key={choice.id} type="button" aria-pressed={selected === choice.id} disabled={revealed}
      onClick={() => setSelected(choice.id)} className="min-h-12 w-full rounded-xl border p-3 text-left text-sm leading-6 break-words"
      style={{ borderColor: selected === choice.id ? theme.colors.primary : theme.colors.borderMedium,
        background: selected === choice.id ? theme.colors.selected.bg : theme.colors.cardBg, color: theme.colors.textPrimary }}>
      {choice.text}
    </button>)}</div>
    {!revealed && <Button type="button" disabled={!selected} className="w-full" onClick={() => setRevealed(true)}>KIỂM TRA CÂU TRẢ LỜI</Button>}
    {revealed && <div ref={feedback} tabIndex={-1} role="status" className="space-y-3 rounded-xl border p-3 outline-none"
      style={{ background: colors.bg, borderColor: colors.border, color: colors.text }}>
      <p className="font-bold">{correct ? '✓ Đúng rồi!' : 'Cùng đọc lại và thử nhé'}</p>
      <p className="text-sm leading-7">{check.explanation}</p>
      {!correct && <Button type="button" variant="outline" className="w-full" onClick={retry}>THỬ LẠI</Button>}
    </div>}
  </Card>
}
