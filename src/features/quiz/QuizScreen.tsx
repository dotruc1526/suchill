import { useState } from 'react'
import Mascot, { type MascotEmotion } from '../../Mascot'
import type { Chapter } from '../../types'

export function QuizScreen({
  chapter,
  onBack,
  onDone,
}: {
  chapter: Chapter
  onBack: () => void
  onDone: (score: number, total: number) => void
}) {
  const [qIdx, setQIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [score, setScore] = useState(0)

  const q = chapter.quiz[qIdx]
  const total = chapter.quiz.length
  const isCorrect = selected === q.correct

  const handleSelect = (i: number) => {
    if (revealed) return
    setSelected(i)
    setRevealed(true)
    if (i === q.correct) setScore(s => s + 1)
  }

  const handleNext = () => {
    if (qIdx < total - 1) {
      setQIdx(i => i + 1)
      setSelected(null)
      setRevealed(false)
    } else {
      onDone(score, total)
    }
  }

  const mascotEmotion: MascotEmotion = revealed ? (isCorrect ? 'excited' : 'sorry') : 'thinking'

  return (
    <div
      className="absolute inset-0 z-20 flex flex-col"
      style={{ background: '#F5E6D0' }}
    >
      {/* Top Header */}
      <div className="flex items-center gap-3 px-4 py-3 shrink-0">
        <button onClick={onBack} className="font-sans text-sm font-bold" style={{ color: '#7A4020' }}>✕</button>
        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: '#E8D5BA' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${((qIdx) / total) * 100}%`, background: '#8B1A1A' }}
          />
        </div>
        <div className="font-hand text-xs" style={{ color: '#A0622A' }}>
          CÂU {qIdx + 1} / {total}
        </div>
      </div>

      <div className="flex-1 flex flex-col px-4 overflow-hidden">
        {/* Question */}
        <div
          className="paper-card rounded-lg p-4 mb-4 shrink-0"
          style={{ borderTop: '3px solid #8B1A1A' }}
        >
          <div className="font-hand text-xs mb-1" style={{ color: '#A0622A' }}>
            🧠 CÂU HỎI
          </div>
          <div className="font-serif font-bold text-base leading-snug" style={{ color: '#3D1A00' }}>
            {q.question}
          </div>
        </div>

        {/* Options with Green (Correct) / Red (Incorrect) Highlight */}
        <div className="space-y-2.5 shrink-0">
          {q.options.map((opt, i) => {
            let bg = '#FBF4E8'
            let border = 'rgba(61,26,0,0.2)'
            let textColor = '#3D1A00'

            if (revealed) {
              if (i === q.correct) {
                bg = '#E8F5E2'
                border = '#3A5A2A'
                textColor = '#3A5A2A'
              } else if (i === selected) {
                bg = '#FDE8E4'
                border = '#C4341A'
                textColor = '#C4341A'
              }
            } else if (selected === i) {
              bg = '#EDD9B8'
              border = '#8B1A1A'
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                className="w-full text-left p-3.5 rounded-sm transition-all active:scale-[0.98]"
                style={{
                  background: bg,
                  border: `1.5px solid ${border}`,
                  boxShadow: '1px 2px 0 rgba(61,26,0,0.06)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-7 h-7 rounded-sm flex items-center justify-center font-sans font-bold text-xs shrink-0"
                    style={{
                      background: revealed && i === q.correct ? '#3A5A2A' : revealed && i === selected ? '#C4341A' : '#E8D5BA',
                      color: revealed && (i === q.correct || i === selected) ? 'white' : '#7A4020',
                    }}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                  <span className="font-sans text-sm font-medium" style={{ color: textColor }}>{opt}</span>
                  {revealed && i === q.correct && <span className="ml-auto text-base">✓</span>}
                  {revealed && i === selected && i !== q.correct && <span className="ml-auto text-base">✗</span>}
                </div>
              </button>
            )
          })}
        </div>

        {/* Feedback */}
        {revealed && (
          <div
            className="mt-4 flex items-start gap-3 paper-card rounded-lg p-3 animate-bubble-in shrink-0"
            style={{ borderLeft: `4px solid ${isCorrect ? '#3A5A2A' : '#C4341A'}` }}
          >
            <Mascot emotion={mascotEmotion} size={64} />
            <div className="flex-1">
              <div
                className="font-serif font-bold text-sm"
                style={{ color: isCorrect ? '#3A5A2A' : '#C4341A' }}
              >
                {isCorrect ? '✓ CHÍNH XÁC!' : '✗ CHƯA ĐÚNG'}
              </div>
              {!isCorrect && (
                <div className="font-sans text-xs mt-0.5" style={{ color: '#5A3010' }}>
                  Đáp án đúng: <strong>{q.options[q.correct]}</strong>
                </div>
              )}
              <div className="font-sans text-xs mt-1.5 leading-relaxed" style={{ color: '#5A3010' }}>
                {q.explanation}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Next button */}
      {revealed && (
        <div className="px-4 pb-6 pt-3 shrink-0">
          <button
            onClick={handleNext}
            className="w-full py-3.5 rounded-sm font-sans font-bold text-sm"
            style={{ background: '#8B1A1A', color: '#F5E6D0', letterSpacing: '0.1em' }}
          >
            {qIdx < total - 1 ? 'CÂU TIẾP THEO ›' : 'XEM KẾT QUẢ ›'}
          </button>
        </div>
      )}
    </div>
  )
}

