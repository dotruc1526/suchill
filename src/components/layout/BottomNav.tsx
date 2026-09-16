import type { Tab } from '../../types'

const NAV_TABS: { key: Tab; icon: string; label: string }[] = [
  { key: 'home', icon: '🏠', label: 'HỌC' },
  { key: 'practice', icon: '🧠', label: 'LUYỆN TẬP' },
  { key: 'dautri', icon: '⚔️', label: 'ĐẤU TRÍ' },
  { key: 'ai', icon: '🤖', label: 'AI' },
  { key: 'profile', icon: '👤', label: 'HỒ SƠ' },
]

export function BottomNav({ tab, onTab }: { tab: Tab; onTab: (t: Tab) => void }) {
  return (
    <div
      className="shrink-0 flex items-end justify-around px-2 pb-2 pt-1"
      style={{
        borderTop: '1.5px solid rgba(61,26,0,0.15)',
        background: '#EDD9B8',
        minHeight: 60,
      }}
    >
      {NAV_TABS.map(t => (
        <button
          key={t.key}
          onClick={() => onTab(t.key)}
          className="flex flex-col items-center gap-0.5 px-3 py-1 transition-all"
          style={{ minWidth: 48 }}
        >
          <span className="text-lg leading-none">{t.icon}</span>
          <span
            className="font-sans font-bold leading-none"
            style={{
              fontSize: 9,
              color: tab === t.key ? '#8B1A1A' : '#A0622A',
            }}
          >
            {t.label}
          </span>
          {tab === t.key && (
            <div
              className="font-hand"
              style={{ color: '#8B1A1A', fontSize: 10, lineHeight: 1, marginTop: -2 }}
            >
              ~~~
            </div>
          )}
        </button>
      ))}
    </div>
  )
}

