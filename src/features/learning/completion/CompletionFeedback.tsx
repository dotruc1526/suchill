import { theme } from '../../../theme/tokens'
import type { ServiceErrorCode } from '../../../services/next/backendContracts'

const messages: Record<ServiceErrorCode, string> = {
  validation: 'Chưa đủ điều kiện hoàn thành. Hãy đọc nội dung, kết thúc Visual Novel, xem video hoặc nộp đủ câu trả lời rồi thử lại.',
  unauthorized: 'Đăng nhập ở Hồ sơ để lưu tiến độ theo tài khoản.',
  offline: 'Yêu cầu chưa được xác nhận trên màn hình này. Khi có kết nối, đồng bộ rồi thử xác nhận lại để nhận kết quả; XP và streak chỉ được ghi nhận sau xác nhận của dịch vụ.',
  not_found: 'Nội dung này chưa khả dụng. Hãy quay lại chương và tải lại.',
  conflict: 'Tiến độ hoặc phiên bản đã thay đổi. Hãy tải lại bài học trước khi thử lại.',
  server_error: 'Chưa nhận được xác nhận. Hãy thử lại; yêu cầu cũ được giữ để tránh thưởng trùng.',
}

export function CompletionFeedback({ error }: { error: ServiceErrorCode }) {
  return <p role="alert" className="text-sm leading-relaxed" style={{ color: theme.colors.textSecondary }}>{messages[error]}</p>
}
