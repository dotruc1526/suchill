import { Card, Progress } from '../../../components/ui'
import { FlameIcon } from '../../../components/icons/NavIcon'
import type { HomeActivitySummary } from '../../../services/next/m3HomeActivity'
import { theme } from '../../../theme/tokens'

export function HomeStreakCard({ activity }: { activity: HomeActivitySummary }) {
  return (
    <Card data-testid="home-streak-card" accentColor={theme.colors.accentRed} className="!p-3">
      <div className="flex items-center gap-3">
        <FlameIcon size={32} aria-hidden="true" className="shrink-0" style={{ color: theme.colors.accentRed }} />
        <div className="min-w-0 flex-1">
          <h2 className="font-sans text-[15px] font-bold" style={{ color: theme.colors.accentRed }}>{activity.streakDays} NGÀY LIÊN TIẾP</h2>
          <p className="mt-0.5 font-sans text-xs leading-relaxed" style={{ color: theme.colors.textSecondary }}>Bạn đã khám phá lịch sử {activity.streakDays} ngày liên tiếp!</p>
        </div>
      </div>
      <ul className="mt-3 flex justify-center gap-1.5" aria-label="Hoạt động trong tuần">
        {activity.week.map(day => (
          <li key={day.id} aria-label={`${day.label}: ${day.completed ? 'đã học' : 'chưa học'}`} className="flex h-6 w-6 items-center justify-center font-sans text-xs font-bold" style={{ borderRadius: theme.radius.sm, background: day.completed ? theme.colors.primary : theme.colors.activeBg, color: day.completed ? theme.colors.primaryText : theme.colors.textSecondary }}>
            <span aria-hidden="true">{day.completed ? '✓' : day.label}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}

export function HomeGoalCard({ activity }: { activity: HomeActivitySummary }) {
  const remaining = Math.max(0, activity.goalMinutes - activity.studiedMinutes)
  return (
    <Card data-testid="home-goal-card" className="!p-3">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-1 font-sans text-sm">
        <h2 className="font-semibold" style={{ color: theme.colors.textPrimary }}>MỤC TIÊU HÔM NAY</h2>
        <span style={{ color: theme.colors.textSecondary }}>{activity.studiedMinutes} / {activity.goalMinutes} phút</span>
      </div>
      <Progress aria-label="Tiến độ mục tiêu hôm nay" value={activity.goalMinutes > 0 ? activity.studiedMinutes / activity.goalMinutes * 100 : 0} />
      <p className="mt-1.5 font-sans text-xs" style={{ color: theme.colors.textSecondary }}>{remaining > 0 ? `Còn ${remaining} phút nữa để hoàn thành!` : 'Bạn đã hoàn thành mục tiêu hôm nay!'}</p>
    </Card>
  )
}
