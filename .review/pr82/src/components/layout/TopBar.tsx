import brandLogo from '../../imports/su-chill-logo-transparent.png'
import { FlameIcon, StarIcon, TrophyIcon } from '../icons/NavIcon'
import { theme } from '../../theme/tokens'

export function TopBar({ xp, streak, achievements }: { xp: number; streak: number; achievements: number }) {
  return (
    <header
      role="banner"
      className="ui-wrap shrink-0"
      style={{
        borderBottom: `1px solid ${theme.colors.borderLight}`,
        padding: theme.spacing.base,
        paddingTop: `max(${theme.spacing.base}, env(safe-area-inset-top))`,
        paddingLeft: `max(${theme.spacing.base}, env(safe-area-inset-left))`,
        paddingRight: `max(${theme.spacing.base}, env(safe-area-inset-right))`,
      }}
    >
      <div className="flex items-center justify-between" style={{ gap: theme.spacing.sm }}>
        <div className="flex items-center min-w-0" style={{ gap: theme.spacing.sm }}>
          <img src={brandLogo} alt="Logo Sử Chill" className="w-10 h-10 object-contain shrink-0" />
          <span className="font-sans font-bold" style={{ color: theme.colors.textPrimary, fontSize: '1.125rem' }}>
            Sử Chill
          </span>
        </div>
        <span className="sr-only">Thanh trạng thái học tập</span>
      </div>
      <div
        className="grid grid-cols-3 text-xs font-semibold leading-tight"
        style={{ gap: theme.spacing.sm, marginTop: theme.spacing.sm, color: theme.colors.textSecondary }}
      >
        <span className="flex min-w-0 items-center gap-1" aria-label={`${streak} ngày liên tiếp`}>
          <FlameIcon size={16} aria-hidden="true" className="shrink-0" />
          <span className="min-w-0">{streak} ngày</span>
        </span>
        <span className="flex min-w-0 items-center gap-1" aria-label={`${xp} XP`}>
          <StarIcon size={16} aria-hidden="true" className="shrink-0" />
          <span className="min-w-0">{xp} XP</span>
        </span>
        <span className="flex min-w-0 items-center gap-1" aria-label={`${achievements} huy hiệu`}>
          <TrophyIcon size={16} aria-hidden="true" className="shrink-0" />
          <span className="min-w-0">{achievements} huy hiệu</span>
        </span>
      </div>
    </header>
  )
}

