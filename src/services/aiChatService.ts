import { resolveGameServerUrl } from './gameServerConfig'
import { requestHistoryReply } from './aiChatRequest'

export const FALLBACK_KNOWLEDGE_BASE: Record<string, string> = {
  '1954':
    'Năm 1954 là bước ngoặt khi Chiến thắng Điện Biên Phủ (7/5/1954) buộc Pháp ký Hiệp định Genève, chấm dứt chiến tranh và tạm thời chia đôi Việt Nam tại vĩ tuyến 17.',
  'điện biên phủ':
    'Chiến dịch Điện Biên Phủ (13/3–7/5/1954) do Đại tướng Võ Nguyên Giáp chỉ huy. Sau 56 ngày đêm chiến đấu kiên cường, ta tiêu diệt hoàn toàn tập đoàn cứ điểm của Pháp — chiến thắng lừng lẫy năm châu!',
  'võ nguyên giáp':
    'Đại tướng Võ Nguyên Giáp (1911–2013) là Tổng Tư lệnh Quân đội Nhân dân Việt Nam, thiên tài quân sự thế kỷ XX nổi tiếng với chiến lược chiến tranh nhân dân.',
  'genève':
    'Hiệp định Genève ký ngày 21/7/1954 quy định: đình chỉ chiến sự, lập vĩ tuyến 17 làm ranh giới quân sự tạm thời tại sông Bến Hải và quy định tổng tuyển cử thống nhất vào năm 1956.',
  '1972':
    'Năm 1972 nổi bật với trận "Điện Biên Phủ trên không" 12 ngày đêm cuối tháng 12, đập tan cuộc tập kích B-52 của Mỹ, buộc Mỹ ký Hiệp định Paris 1973.',
  'mậu thân':
    'Cuộc Tổng tiến công và nổi dậy Xuân Mậu Thân 1968 là đòn bất ngờ giáng vào các đô thị miền Nam, làm phá sản chiến lược "Chiến tranh cục bộ" của Mỹ.',
}

export async function askHistoryAssistant(question: string): Promise<string> {
  const trimmed = question.trim()
  if (!trimmed) return 'Bạn muốn hỏi SỬu điều gì về lịch sử Việt Nam nào? 🐮'

  try {
    const serverUrl = resolveGameServerUrl(import.meta.env.VITE_GAME_SERVER_URL, window.location)
    const reply = await requestHistoryReply(serverUrl, trimmed)
    if (reply) return reply
  } catch {
    // Backend offline / network fallback
  }

  // Graceful offline fallback
  const lower = trimmed.toLowerCase()
  const matchedKey = Object.keys(FALLBACK_KNOWLEDGE_BASE).find(k => lower.includes(k))
  if (matchedKey) {
    return FALLBACK_KNOWLEDGE_BASE[matchedKey]
  }

  return 'SỬu đang tạm gián đoạn kết nối. Bạn thử lại sau nhé! Bạn cũng có thể hỏi về: Điện Biên Phủ, 1954, Hiệp định Genève, Mậu Thân 1968, 1972... 🐮📚'
}
