import type { Chapter } from '../types'

export default function ChapterScreen({
  chapter, onBack, onLesson, onQuiz,
}: {
  chapter: Chapter
  onBack: () => void
  onLesson: (idx: number) => void
  onQuiz: () => void
}) {
  return (
    <div
      className="absolute inset-0 z-20 flex flex-col overflow-hidden"
      style={{ background: '#F5E6D0' }}
    >
      {/* Header */}
      <div
        className="px-4 pt-4 pb-6 shrink-0"
        style={{ background: '#8B1A1A' }}
      >
        <button
          onClick={onBack}
          className="font-sans text-xs mb-4 flex items-center gap-1"
          style={{ color: 'rgba(245,230,208,0.8)' }}
        >
          ‹ QUAY LẠI
        </button>
        <div className="font-hand text-sm" style={{ color: 'rgba(245,230,208,0.7)' }}>
          CHƯƠNG {String(chapter.id).padStart(2, '0')}
        </div>
        <div className="font-serif font-bold text-4xl" style={{ color: '#FBF4E8' }}>{chapter.year}</div>
        <div className="font-serif italic text-lg" style={{ color: 'rgba(251,244,232,0.85)' }}>
          "{chapter.title}"
        </div>
        <div className="font-sans text-xs mt-2 leading-relaxed" style={{ color: 'rgba(245,230,208,0.8)' }}>
          {chapter.description}
        </div>
        {/* Progress bar */}
        {chapter.progress > 0 && (
          <div className="mt-3">
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.2)' }}>
              <div
                className="h-full rounded-full"
                style={{ width: `${chapter.progress * 100}%`, background: '#F5E6D0' }}
              />
            </div>
            <div className="font-hand text-xs mt-1" style={{ color: 'rgba(245,230,208,0.7)' }}>
              {Math.round(chapter.progress * 100)}% hoàn thành
            </div>
          </div>
        )}
      </div>

      {/* Lessons */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="font-serif font-semibold text-sm mb-4" style={{ color: '#3D1A00' }}>
          LỘ TRÌNH HỌC TẬP
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-4 top-4 bottom-4 w-px"
            style={{ background: 'rgba(61,26,0,0.15)' }}
          />

          <div className="space-y-3">
            {chapter.lessons.map((lesson, idx) => {
              const isLocked = lesson.status === 'locked'
              const isCurrent = lesson.status === 'current'
              const isDone = lesson.status === 'completed'

              return (
                <div key={lesson.id} className="flex items-start gap-4">
                  {/* Node */}
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 font-sans font-bold text-xs border-2"
                    style={{
                      background: isDone ? '#3A5A2A' : isCurrent ? '#8B1A1A' : '#E8D5BA',
                      color: isDone ? '#fff' : isCurrent ? '#fff' : '#A0622A',
                      borderColor: isDone ? '#3A5A2A' : isCurrent ? '#8B1A1A' : '#D4B896',
                    }}
                  >
                    {isDone ? '✓' : isLocked ? '🔒' : String(idx + 1).padStart(2, '0')}
                  </div>

                  {/* Card */}
                  <button
                    onClick={isLocked ? undefined : () => onLesson(idx)}
                    disabled={isLocked}
                    className="flex-1 paper-card rounded-lg p-3 text-left transition-transform active:scale-[0.98]"
                    style={{ opacity: isLocked ? 0.5 : 1 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-sans font-bold text-xs" style={{ color: '#3D1A00' }}>
                          {lesson.title}
                        </div>
                        <div className="font-hand text-xs mt-0.5" style={{ color: '#A0622A' }}>
                          ⏱ {lesson.duration} phút
                        </div>
                      </div>
                      {isCurrent && (
                        <div
                          className="font-hand text-xs px-2 py-0.5 rounded-sm"
                          style={{ background: '#8B1A1A', color: '#F5E6D0' }}
                        >
                          Đang học
                        </div>
                      )}
                    </div>
                  </button>
                </div>
              )
            })}

            {/* Quiz node */}
            <div className="flex items-start gap-4">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 font-sans font-bold text-base border-2"
                style={{
                  background: chapter.progress >= 1 ? '#8B1A1A' : '#E8D5BA',
                  color: chapter.progress >= 1 ? '#fff' : '#A0622A',
                  borderColor: chapter.progress >= 1 ? '#8B1A1A' : '#D4B896',
                }}
              >
                {chapter.quiz.length > 0 ? '🧠' : '🔒'}
              </div>
              <button
                onClick={chapter.quiz.length > 0 ? onQuiz : undefined}
                disabled={chapter.quiz.length === 0}
                className="flex-1 paper-card rounded-lg p-3 text-left"
                style={{ opacity: chapter.quiz.length === 0 ? 0.4 : 1 }}
              >
                <div className="font-sans font-bold text-xs" style={{ color: '#3D1A00' }}>
                  THỬ THÁCH CHƯƠNG
                </div>
                <div className="font-hand text-xs mt-0.5" style={{ color: '#A0622A' }}>
                  {chapter.quiz.length} câu hỏi · ⏱ 5 phút
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Lesson Screen ────────────────────────────────────────────────────────────
