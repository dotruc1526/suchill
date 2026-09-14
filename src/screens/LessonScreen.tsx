import { useState } from 'react'
import Mascot from '../Mascot'
import type { Chapter } from '../data'
import Episode1954Screen from './Episode1954Screen'

export default function LessonScreen({
  chapter, lessonIdx, onBack, onComplete,
}: {
  chapter: Chapter
  lessonIdx: number
  onBack: () => void
  onComplete: () => void
}) {
  const lesson = chapter.lessons[lessonIdx]

  const [step, setStep] = useState(0)
  const totalSteps = lesson.story.length + 1 // story steps + key points
  const isStory = step < lesson.story.length
  const isKeyPoints = step === lesson.story.length

  const storyStep = isStory ? lesson.story[step] : null
  const [key, setKey] = useState(0)

  if (chapter.id === 1 && lessonIdx === 0) {
    return <Episode1954Screen onBack={onBack} />
  }

  const advance = () => {
    if (step < totalSteps - 1) {
      setStep(s => s + 1)
      setKey(k => k + 1)
    } else {
      onComplete()
    }
  }

  const progress = step / (totalSteps - 1)

  // If no story data, go to complete
  if (lesson.story.length === 0) {
    return (
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center" style={{ background: '#F5E6D0' }}>
        <Mascot emotion="sorry" size={120} />
        <div className="font-hand text-lg mt-4" style={{ color: '#7A4020' }}>Bài học đang được cập nhật...</div>
        <button onClick={onBack} className="mt-6 px-6 py-2 rounded-sm font-sans font-bold text-sm" style={{ background: '#8B1A1A', color: '#F5E6D0' }}>
          QUAY LẠI
        </button>
      </div>
    )
  }

  return (
    <div
      className="absolute inset-0 z-20 flex flex-col"
      style={{ background: '#F5E6D0' }}
    >
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-3 shrink-0">
        <button onClick={onBack} className="font-sans text-sm font-bold" style={{ color: '#7A4020' }}>✕</button>
        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: '#E8D5BA' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress * 100}%`, background: '#8B1A1A' }}
          />
        </div>
        <div className="font-hand text-xs" style={{ color: '#A0622A' }}>
          {step + 1} / {totalSteps}
        </div>
      </div>

      {/* Chapter label */}
      <div className="px-4 shrink-0">
        <div className="font-serif font-bold text-xs tracking-widest" style={{ color: '#8B1A1A' }}>
          {chapter.year} · {lesson.title}
        </div>
      </div>

      {/* Story content area */}
      {isStory && storyStep && (
        <div key={key} className="flex-1 flex flex-col px-4 pt-3 overflow-hidden animate-bubble-in">
          {/* Highlight / fact card */}
          {(storyStep.highlight || storyStep.fact) && (
            <div
              className="paper-card rounded-lg p-3 mb-3 shrink-0"
              style={{ borderLeft: '4px solid #8B1A1A' }}
            >
              {storyStep.highlight && (
                <div>
                  <div className="font-hand text-xs" style={{ color: '#A0622A' }}>📌 SỰ KIỆN QUAN TRỌNG</div>
                  <div className="font-serif font-bold text-base mt-1" style={{ color: '#8B1A1A' }}>
                    {storyStep.highlight}
                  </div>
                </div>
              )}
              {storyStep.fact && (
                <div className="flex justify-between items-center">
                  <div className="font-hand text-xs" style={{ color: '#A0622A' }}>{storyStep.fact.label}</div>
                  <div className="font-serif font-bold text-sm" style={{ color: '#3D1A00' }}>{storyStep.fact.value}</div>
                </div>
              )}
            </div>
          )}

          {/* Historical image placeholder */}
          <div
            className="rounded-lg flex-1 min-h-0 flex items-center justify-center relative overflow-hidden mb-3"
            style={{ background: '#D4B896', maxHeight: 180 }}
          >
            <img
              src={`https://images.unsplash.com/photo-${chapter.unsplashId}?w=600&h=300&fit=crop&auto=format`}
              alt="Hình ảnh lịch sử"
              className="w-full h-full object-cover"
              style={{ filter: 'sepia(0.35) contrast(0.9) brightness(0.95)' }}
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to bottom, transparent 50%, rgba(61,26,0,0.3))' }}
            />
            <div
              className="absolute bottom-2 right-2 font-hand text-xs px-2 py-0.5 rounded-sm"
              style={{ background: 'rgba(61,26,0,0.6)', color: '#F5E6D0' }}
            >
              HÌNH ẢNH MINH HỌA
            </div>
          </div>

          {/* Mascot dialogue */}
          <div className="flex items-end gap-3 shrink-0">
            <Mascot emotion={storyStep.emotion} size={88} animate />
            <div
              className="flex-1 rounded-2xl rounded-bl-none p-4"
              style={{
                background: '#FBF4E8',
                border: '1.5px solid rgba(61,26,0,0.2)',
                boxShadow: '2px 3px 0 rgba(61,26,0,0.07)',
              }}
            >
              {/* Mascot name tag */}
              <div className="font-hand text-xs mb-1.5" style={{ color: '#8B1A1A', fontWeight: 700 }}>
                Sử Chill
              </div>
              <p className="font-sans text-sm leading-relaxed" style={{ color: '#3D1A00' }}>
                {storyStep.text}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Key points */}
      {isKeyPoints && (
        <div key="keypoints" className="flex-1 flex flex-col px-4 pt-3 overflow-hidden animate-bubble-in">
          <div
            className="paper-card rounded-lg p-4 mb-3"
            style={{ borderTop: '3px solid #3A5A2A' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">📋</span>
              <div className="font-serif font-bold text-base" style={{ color: '#3D1A00' }}>ĐIỀU CẦN NHỚ</div>
            </div>
            <div className="space-y-2">
              {lesson.keyPoints.map((pt, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="font-serif font-bold text-sm shrink-0" style={{ color: '#3A5A2A' }}>✓</span>
                  <span className="font-sans text-sm leading-relaxed" style={{ color: '#3D1A00' }}>{pt}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-end gap-3 flex-1 items-start pt-2">
            <Mascot emotion="happy" size={88} animate />
            <div
              className="flex-1 rounded-2xl rounded-bl-none p-4"
              style={{ background: '#FBF4E8', border: '1.5px solid rgba(61,26,0,0.2)' }}
            >
              <div className="font-hand text-xs mb-1.5" style={{ color: '#8B1A1A', fontWeight: 700 }}>Sử Chill</div>
              <p className="font-sans text-sm leading-relaxed" style={{ color: '#3D1A00' }}>
                Bạn đã hoàn thành bài học! Hãy nhớ những điểm quan trọng này nhé. Bây giờ mình sẽ kiểm tra xem bạn nhớ được bao nhiêu! 🎉
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation button */}
      <div className="px-4 pb-6 pt-3 shrink-0">
        <button
          onClick={advance}
          className="w-full py-3.5 font-sans font-bold text-sm rounded-sm transition-transform active:scale-[0.97]"
          style={{
            background: '#8B1A1A',
            color: '#F5E6D0',
            letterSpacing: '0.1em',
          }}
        >
          {isKeyPoints ? 'LÀM QUIZ ›' : 'TIẾP THEO ›'}
        </button>
        {!isKeyPoints && (
          <button
            onClick={onBack}
            className="w-full pt-2 font-sans text-xs text-center"
            style={{ color: '#A0622A' }}
          >
            ‹ Quay lại
          </button>
        )}
      </div>
    </div>
  )
}

