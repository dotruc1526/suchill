import { Card, Progress } from '../../../components/ui'
import { HandIcon } from '../../../components/icons/NavIcon'
import Mascot from '../../../Mascot'
import { theme } from '../../../theme/tokens'
import type { HomeActivitySummary } from '../../../services/next/m3HomeActivity'
import { getHomeContinuation, type JourneyChapter } from './journeyModel'
import { HomeGoalCard, HomeStreakCard } from './HomeActivityCards'
import type { Ref } from 'react'

export function JourneyHome({ chapters, activity, greeting = 'XIN CHÀO', headingRef, chapterButtonRef, onChapter, onLesson }: {
  chapters: JourneyChapter[]
  activity?: HomeActivitySummary
  greeting?: string
  headingRef: Ref<HTMLHeadingElement>
  chapterButtonRef: (id: string, element: HTMLButtonElement | null) => void
  onChapter: (id: string) => void
  onLesson?: (chapterId: string, lessonId: string) => void
}) {
  const continuation = getHomeContinuation(chapters)
  const resuming = continuation?.lesson.progressStatus === 'in_progress'
  return (
    <section data-testid="learning-journey" className="space-y-4 px-4 py-4" aria-labelledby="journey-heading">
      <div>
        <h1 ref={headingRef} tabIndex={-1} data-testid="journey-title" id="journey-heading" className="flex items-center gap-2 font-sans text-2xl font-normal outline-none" style={{ color: theme.colors.textPrimary }}><span data-testid="journey-greeting" className="min-w-0 break-words" style={{ overflowWrap: 'anywhere' }}>{greeting}</span><HandIcon size={24} aria-hidden="true" className="shrink-0" /></h1>
        <p className="mt-1 font-sans text-sm" style={{ color: theme.colors.textSecondary }}>Hôm nay bạn muốn khám phá điều gì?</p>
      </div>
      {activity && <HomeStreakCard activity={activity} />}
      {continuation && (
        <Card data-testid="home-continue-card" accentColor={theme.colors.primary} accentPosition="top">
          <p className="mb-2 font-sans text-xs" style={{ color: theme.colors.textSecondary }}>→ {resuming ? 'TIẾP TỤC HÀNH TRÌNH' : 'BẮT ĐẦU HÀNH TRÌNH'}</p>
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <h2 className="font-sans text-base font-bold leading-snug" style={{ color: theme.colors.textPrimary }}>{continuation.lesson.title}</h2>
              <p className="mt-1 font-sans text-xs leading-relaxed" style={{ color: theme.colors.textSecondary }}>Chương {String(chapters.indexOf(continuation.chapter) + 1).padStart(2, '0')} · {continuation.chapter.historicalPeriodLabel} · {continuation.lesson.estimatedMinutes} phút</p>
              <button data-testid="journey-continue-lesson" className="mt-3 min-h-11 rounded-sm px-4 py-2 font-sans text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-2" style={{ background: theme.colors.primary, color: theme.colors.primaryText }} onClick={() => onLesson ? onLesson(continuation.chapter.id, continuation.lesson.id) : onChapter(continuation.chapter.id)}>{resuming ? 'TIẾP TỤC HỌC' : 'BẮT ĐẦU HỌC'} ›</button>
            </div>
            <div aria-hidden="true"><Mascot emotion="excited" size={72} /></div>
          </div>
        </Card>
      )}
      {activity && activity.goalMinutes > 0 && <HomeGoalCard activity={activity} />}
      <div className="flex items-center gap-2">
        <h2 className="font-sans text-base font-bold" style={{ color: theme.colors.textPrimary }}>HÀNH TRÌNH LỊCH SỬ</h2>
        <div className="h-px flex-1" style={{ background: theme.colors.borderMedium }} />
      </div>
      <div className="space-y-3">
        {chapters.map((chapter, index) => {
          const progress = chapter.lessons.length ? chapter.completedCount / chapter.lessons.length * 100 : 0
          const started = chapter.lessons.some(lesson => lesson.progressStatus !== 'not_started')
          return (
            <div key={chapter.id} data-testid="journey-chapter-card">
              <button ref={element => chapterButtonRef(chapter.id, element)} data-testid={`journey-open-chapter-${chapter.id}`} className="paper-card min-h-11 w-full overflow-hidden rounded-lg text-left focus-visible:outline-2 focus-visible:outline-offset-2" onClick={() => onChapter(chapter.id)} aria-label={`Mở chương ${chapter.title}`}>
                <div className="flex items-center justify-between gap-3 px-4 py-3" style={{ background: theme.colors.primary, color: theme.colors.primaryText }}>
                  <div className="shrink-0 font-sans"><p className="text-xs">CHƯƠNG {String(index + 1).padStart(2, '0')}</p><p className="text-lg font-bold">{chapter.historicalPeriodLabel}</p></div>
                  <div className="min-w-0 text-right font-sans"><h3 className="text-sm font-bold leading-snug">{chapter.title}</h3><p className="mt-1 text-xs">{progress === 100 ? '✓ ĐÃ HOÀN THÀNH' : started ? '→ ĐANG HỌC' : '→ KHÁM PHÁ'}</p></div>
                </div>
                <div className="space-y-2 px-4 py-3">
                  {chapter.subtitle && <p className="font-sans text-xs leading-relaxed" style={{ color: theme.colors.textSecondary }}>{chapter.subtitle}</p>}
                  <div className="flex justify-between gap-2 font-sans text-xs" style={{ color: theme.colors.textMuted }}><span>Tiến độ · {chapter.completedCount}/{chapter.lessons.length} bài</span><span className="font-bold" style={{ color: theme.colors.primary }}>{Math.round(progress)}%</span></div>
                  <Progress aria-label={`Tiến độ ${chapter.title}`} value={progress} height={6} />
                </div>
              </button>
            </div>
          )
        })}
      </div>
    </section>
  )
}
