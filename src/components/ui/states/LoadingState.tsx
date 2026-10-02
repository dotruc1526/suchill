import { theme } from '../../../theme/tokens'

type LoadingStateProps = {
  message?: string
}

export function LoadingState({ message = 'Đang tải dữ liệu lịch sử...' }: LoadingStateProps) {
  return (
    <div role="status" aria-atomic="true" className="flex flex-col items-center justify-center p-8 text-center min-h-[200px]">
      <div
        aria-hidden="true"
        className="w-10 h-10 border-3 border-t-transparent rounded-full animate-spin motion-reduce:animate-none mb-3"
        style={{
          borderColor: `${theme.colors.primary} transparent ${theme.colors.primary} ${theme.colors.primary}`,
        }}
      />
      <p className="font-hand text-base" style={{ color: theme.colors.textSecondary }}>
        {message}
      </p>
    </div>
  )
}
