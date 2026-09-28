import type { Tab } from '../../types'
import { theme } from '../../theme/tokens'

const NAV_TABS: { key: Tab; icon: string; label: string }[] = [
  { key: 'home', icon: '🏠', label: 'HỌC' },
  { key: 'practice', icon: '🧠', label: 'LUYỆN TẬP' },
  { key: 'ai', icon: '🤖', label: 'AI' },
  { key: 'profile', icon: '👤', label: 'HỒ SƠ' },
]

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
      {NAV_TABS.map(({ key, icon, label }) => (
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
          <span aria-hidden="true" className="text-lg leading-none">{icon}</span>
          <span className="font-sans text-[9px] font-bold leading-none">{label}</span>
        </button>
      ))}
    </nav>
  )
}

