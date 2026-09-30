import { Card } from '../../../components/ui'
import { theme } from '../../../theme/tokens'
import type { JourneyChapter as ChapterModel } from './journeyModel'

const statusLabel = { not_started: 'Chưa bắt đầu', in_progress: 'Đang học', completed: 'Đã hoàn thành' } as const

export function JourneyChapter({ chapter, onBack, onLesson }: { chapter: ChapterModel; onBack: () => void; onLesson: (id: string) => void }) {
  return (
    <section className="space-y-4 px-4 py-4" aria-labelledby="chapter-heading">
      <button className="min-h-11 font-sans text-sm font-bold focus-visible:outline-2" style={{ color: theme.colors.textSecondary }} onClick={onBack}>‹ VỀ HÀNH TRÌNH</button>
      <div>
        <p className="font-sans text-xs font-bold" style={{ color: theme.colors.textMuted }}>{chapter.historicalPeriodLabel}</p>
        <h1 id="chapter-heading" className="font-serif text-2xl font-bold" style={{ color: theme.colors.textPrimary }}>{chapter.title}</h1>
        <p className="mt-1 font-sans text-sm" style={{ color: theme.colors.textSecondary }}>{chapter.summary}</p>
      </div>
      <ol className="space-y-3" aria-label="Danh sách bài học">
        {chapter.lessons.map((lesson, index) => (
          <li key={lesson.id}>
            <Card>
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-sans text-xs font-bold" style={{ background: theme.colors.activeBg, color: theme.colors.textPrimary }}>{index + 1}</span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-serif font-bold" style={{ color: theme.colors.textPrimary }}>{lesson.title}</h2>
                  <p className="mt-1 font-sans text-xs" style={{ color: theme.colors.textSecondary }}>{lesson.summary}</p>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className="font-sans text-xs" style={{ color: theme.colors.textMuted }}>{statusLabel[lesson.progressStatus]} · {lesson.estimatedMinutes} phút</span>
                    <button className="min-h-11 rounded-sm px-3 font-sans text-xs font-bold focus-visible:outline-2 focus-visible:outline-offset-2" style={{ background: theme.colors.primary, color: theme.colors.primaryText }} onClick={() => onLesson(lesson.id)}>MỞ BÀI</button>
                  </div>
                </div>
              </div>
            </Card>
          </li>
        ))}
      </ol>
    </section>
  )
}
