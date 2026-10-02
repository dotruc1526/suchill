import { theme } from '../../../theme/tokens'
import { Button } from '../Button'

type ErrorStateProps = {
  title?: string
  message?: string
  onRetry?: () => void
}

export function ErrorState({
  title = 'Có lỗi xảy ra',
  message = 'Không thể tải được nội dung bài học. Vui lòng thử lại.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center min-h-[220px]">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-3"
        style={{
          background: theme.colors.incorrect.bg,
          color: theme.colors.incorrect.text,
          border: `1.5px solid ${theme.colors.incorrect.border}`,
        }}
      >
        !
      </div>
      <h4 className="font-serif font-bold text-base mb-1" style={{ color: theme.colors.textPrimary }}>
        {title}
      </h4>
      <p className="font-sans text-xs mb-4 max-w-xs" style={{ color: theme.colors.textSecondary }}>
        {message}
      </p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Thử lại
        </Button>
      )}
    </div>
  )
}
