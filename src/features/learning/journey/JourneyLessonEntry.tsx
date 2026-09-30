import { Button, Card } from '../../../components/ui'
import { theme } from '../../../theme/tokens'
import type { JourneyLesson } from './journeyModel'

export function JourneyLessonEntry({ lesson, onBack }: { lesson: JourneyLesson; onBack: () => void }) {
  return (
    <section className="space-y-4 px-4 py-4" aria-labelledby="lesson-entry-heading">
      <button className="min-h-11 font-sans text-sm font-bold focus-visible:outline-2" style={{ color: theme.colors.textSecondary }} onClick={onBack}>‹ VỀ CHƯƠNG</button>
      <Card accentColor={theme.colors.primary} accentPosition="top">
        <p className="font-sans text-xs font-bold uppercase" style={{ color: theme.colors.textMuted }}>{lesson.format} · {lesson.estimatedMinutes} phút</p>
        <h1 id="lesson-entry-heading" className="mt-1 font-serif text-2xl font-bold" style={{ color: theme.colors.textPrimary }}>{lesson.title}</h1>
        <p className="mt-2 font-sans text-sm" style={{ color: theme.colors.textSecondary }}>{lesson.summary}</p>
        <p className="mt-4 rounded-md p-3 font-sans text-xs" style={{ background: theme.colors.activeBg, color: theme.colors.textSecondary }}>Điểm tiếp tục đã được lưu bằng mock progress service. Nội dung block chi tiết sẽ được triển khai trong M3-02.</p>
        <Button className="mt-4" size="lg" disabled aria-describedby="renderer-note">BẮT ĐẦU NỘI DUNG</Button>
        <p id="renderer-note" className="mt-2 text-center font-sans text-xs" style={{ color: theme.colors.textMuted }}>Renderer đang được chuẩn bị ở task tiếp theo.</p>
      </Card>
    </section>
  )
}
