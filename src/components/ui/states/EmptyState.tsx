import { theme } from '../../../theme/tokens'

type EmptyStateProps = {
  title?: string
  message?: string
  action?: React.ReactNode
}

export function EmptyState({
  title = 'Chưa có nội dung',
  message = 'Chưa có bài học hoặc tiến độ nào được ghi nhận tại đây.',
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center min-h-[200px]">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-xl mb-3"
        style={{
          background: 'rgba(61, 26, 0, 0.08)',
          color: theme.colors.textMuted,
        }}
      >
        📜
      </div>
      <h4 className="font-serif font-bold text-base mb-1" style={{ color: theme.colors.textPrimary }}>
        {title}
      </h4>
      <p className="font-sans text-xs mb-3 max-w-xs" style={{ color: theme.colors.textSecondary }}>
        {message}
      </p>
      {action && <div className="mt-1">{action}</div>}
    </div>
  )
}
