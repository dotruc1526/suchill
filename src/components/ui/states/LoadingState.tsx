import { theme } from '../../../theme/tokens'

type LoadingStateProps = {
  message?: string
}

export function LoadingState({ message = 'Đang tải dữ liệu lịch sử...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[200px]">
      <div
        className="w-10 h-10 border-3 border-t-transparent rounded-full animate-spin mb-3"
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
