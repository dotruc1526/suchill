import { BookOpen, Brain, MessageCircle, UserRound } from 'lucide-react'
import type { Tab } from '../../types'
import { theme } from '../../theme/tokens'

const NAV_TABS = [
  { key: 'home', icon: BookOpen, label: 'HỌC' },
  { key: 'practice', icon: Brain, label: 'LUYỆN TẬP' },
  { key: 'ai', icon: MessageCircle, label: 'AI' },
  { key: 'profile', icon: UserRound, label: 'HỒ SƠ' },
] as const

export function BottomNav({ tab, onTab }: { tab: Tab; onTab: (t: Tab) => void }) {
  return (
    <nav aria-label="Thanh điều hướng chính" className="grid grid-cols-4 shrink-0"
      style={{
        borderTop: `1px solid ${theme.colors.borderLight}`,
        background: theme.colors.navBg,
        padding: theme.spacing.sm,
        gap: theme.spacing.xs,
        paddingBottom: `max(${theme.spacing.base}, env(safe-area-inset-bottom))`,
        paddingLeft: `max(${theme.spacing.sm}, env(safe-area-inset-left))`,
        paddingRight: `max(${theme.spacing.sm}, env(safe-area-inset-right))`,
      }}
    >
      {NAV_TABS.map(({ key, icon: Icon, label }) => (
        <button
          key={key}
          type="button"
          onClick={() => onTab(key)}
          aria-current={tab === key ? 'page' : undefined}
          className="flex min-w-0 flex-col items-center justify-center gap-1 px-1 py-1 transition-colors"
          style={{
            minHeight: theme.layout.touchTarget,
            borderRadius: theme.radius.sm,
            color: tab === key ? theme.colors.primary : theme.colors.textMuted,
          }}
        >
          <Icon size={20} aria-hidden="true" />
          <span className="font-sans text-[9px] font-bold leading-none">{label}</span>
        </button>
      ))}
    </nav>
  )
}

