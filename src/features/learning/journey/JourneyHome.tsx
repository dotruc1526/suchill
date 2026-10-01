import { Card } from '../../../components/ui'
import { theme } from '../../../theme/tokens'
import type { JourneyChapter } from './journeyModel'
import type { Ref } from 'react'

export function JourneyHome({ chapters, greeting, headingRef, chapterButtonRef, onChapter }: {
  chapters: JourneyChapter[]
  greeting: string
  headingRef: Ref<HTMLHeadingElement>
  chapterButtonRef: (id: string, element: HTMLButtonElement | null) => void
  onChapter: (id: string) => void
}) {
  return (
    <section data-testid="learning-journey" className="space-y-4 px-4 py-4" aria-labelledby="journey-heading">
      <div>
        <p data-testid="journey-greeting" className="min-w-0 break-words font-sans text-sm font-bold" style={{ color: theme.colors.primary }}>{greeting}</p>
        <h1 ref={headingRef} tabIndex={-1} data-testid="journey-title" id="journey-heading" className="font-serif text-2xl font-bold outline-none" style={{ color: theme.colors.textPrimary }}>HÀNH TRÌNH LỊCH SỬ</h1>
        <p className="mt-1 font-sans text-sm" style={{ color: theme.colors.textSecondary }}>Chọn một chương để bắt đầu hoặc tiếp tục bài học.</p>
      </div>
      {chapters.map(chapter => (
        <Card key={chapter.id} data-testid="journey-chapter-card" accentColor={theme.colors.primary} accentPosition="top">
          <p className="font-sans text-xs font-bold uppercase" style={{ color: theme.colors.textMuted }}>{chapter.historicalPeriodLabel}</p>
          <h2 className="mt-1 font-serif text-lg font-bold" style={{ color: theme.colors.textPrimary }}>{chapter.title}</h2>
          {chapter.subtitle && <p className="font-sans text-xs" style={{ color: theme.colors.textSecondary }}>{chapter.subtitle}</p>}
          <p className="mt-2 font-sans text-sm" style={{ color: theme.colors.textSecondary }}>{chapter.summary}</p>
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="font-sans text-xs" style={{ color: theme.colors.textMuted }}>{chapter.completedCount}/{chapter.lessons.length} bài hoàn thành</span>
            <button ref={element => chapterButtonRef(chapter.id, element)} data-testid={`journey-open-chapter-${chapter.id}`} className="min-h-11 rounded-sm px-4 font-sans text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-2" style={{ background: theme.colors.primary, color: theme.colors.primaryText }} onClick={() => onChapter(chapter.id)} aria-label={`Mở chương ${chapter.title}`}>MỞ CHƯƠNG</button>
          </div>
        </Card>
      ))}
    </section>
  )
}
