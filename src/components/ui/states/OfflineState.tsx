import { theme } from '../../../theme/tokens'

type OfflineStateProps = {
  message?: string
}

export function OfflineState({ message = 'Bạn đang ngoại tuyến. Các bài học đã tải sẵn vẫn có thể học bình thường.' }: OfflineStateProps) {
  return (
    <div
      className="w-full px-3 py-2 flex items-center justify-between text-xs font-medium"
      style={{
        background: '#EDD9B8',
        color: theme.colors.textSecondary,
        borderBottom: `1px solid ${theme.colors.borderLight}`,
      }}
    >
      <div className="flex items-center gap-1.5">
        <span>📡</span>
        <span>{message}</span>
      </div>
    </div>
  )
}
