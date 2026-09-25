import type { Chapter, UserStats, Achievement } from '../types'

export const chapters: Chapter[] = [
  {
    id: 1,
    year: '1954',
    title: 'ĐIỂM NGOẶT',
    subtitle: 'Chiến thắng Điện Biên Phủ & Hiệp định Genève',
    description: 'Năm 1954 đánh dấu bước ngoặt lịch sử: Chiến thắng Điện Biên Phủ vang dội năm châu và Ký kết Hiệp định Genève.',
    progress: 0.8,
    status: 'current',
    unsplashId: '1470290378698-92266f76aebc',
    lessons: [
      {
        id: 1,
        title: 'BỐI CẢNH',
        duration: 7,
        status: 'completed',
        story: [
          {
            emotion: 'excited',
            text: 'Chào bạn! Mình là Chill — người bạn đồng hành trên hành trình khám phá lịch sử Việt Nam! Hôm nay, chúng ta sẽ tìm hiểu về năm 1954 — một trong những năm hào hùng nhất của dân tộc!',
          },
          {
            emotion: 'thinking',
            text: 'Năm 1954, Việt Nam đang ở giai đoạn cuối của cuộc kháng chiến chống thực dân Pháp kéo dài 9 năm. Cả dân tộc đang chờ đợi một thay đổi lịch sử vĩ đại...',
            highlight: '9 năm kháng chiến chống Pháp',
          },
          {
            emotion: 'determined',
            text: 'Dưới sự lãnh đạo của Đảng và Chủ tịch Hồ Chí Minh, quân dân Việt Nam đã kiên cường chiến đấu. Và rồi, khoảnh khắc lịch sử đã đến!',
            fact: { label: 'Tổng chỉ huy', value: 'Đại tướng Võ Nguyên Giáp' },
          },
          {
            emotion: 'surprised',
            text: 'Bạn có biết không? Chiến dịch Điện Biên Phủ kéo dài đúng 56 ngày đêm — từ 13/3 đến 7/5/1954. Đây là trận chiến quyết định số phận của cuộc chiến tranh!',
            highlight: '56 ngày đêm khoét núi ngủ hầm',
          },
          {
            emotion: 'happy',
            text: 'Chiến thắng Điện Biên Phủ ngày 7/5/1954 đã buộc Pháp ngồi vào bàn đàm phán. Hiệp định Genève được ký ngày 21/7/1954 — kết thúc chiến tranh, lập lại hòa bình!',
            highlight: '7/5/1954 — Toàn thắng Điện Biên',
          },
        ],
        keyPoints: [
          'Chiến dịch Điện Biên Phủ: 13/3 – 7/5/1954 (56 ngày đêm)',
          'Đại tướng Võ Nguyên Giáp trực tiếp chỉ huy tác chiến',
          'Hiệp định Genève ký kết ngày 21/7/1954',
          'Vĩ tuyến 17 (Sông Bến Hải) tạm thời chia đôi 2 miền tập kết',
        ],
      },
      {
        id: 2,
        title: 'HIỆP ĐỊNH GENÈVE 1954',
        duration: 8,
        status: 'current',
        visualNovelId: 'geneva-1954',
        story: [],
        keyPoints: [
          'Phái đoàn VN do Phó Thủ tướng Phạm Văn Đồng dẫn đầu',
          'Lập vĩ tuyến 17 làm ranh giới quân sự tạm thời',
          'Quy định tổng tuyển cử thống nhất sau 2 năm (1956)',
        ],
      },
      {
        id: 3,
        title: 'DIỄN BIẾN ĐIỆN BIÊN PHỦ',
        duration: 10,
        status: 'current',
        story: [
          {
            emotion: 'determined',
            text: 'Chiến dịch chia làm 3 đợt tấn công. Đợt 1 (13-17/3): Ta tiêu diệt các cứ điểm phía Bắc, sân bay Mường Thanh bị uy hiếp.',
            fact: { label: 'Đợt 1', value: '13–17/3/1954' },
          },
          {
            emotion: 'thinking',
            text: 'Đợt 2 (30/3-30/4): Ta siết chặt vòng vây, chiếm các đồi phòng ngự phía Đông. Quân Pháp rơi vào thế bị động hoàn toàn!',
            fact: { label: 'Đợt 2', value: '30/3–30/4/1954' },
          },
          {
            emotion: 'excited',
            text: 'Đợt 3 (1-7/5): Tổng tấn công! Ngày 7/5/1954, lá cờ "Quyết chiến Quyết thắng" tung bay trên nóc hầm De Castries. Chiến thắng hoàn toàn!',
            highlight: '7/5/1954 — Lá cờ chiến thắng tung bay!',
          },
        ],
        keyPoints: [
          'Đợt 1 (13-17/3): Tiêu diệt cứ điểm phía Bắc',
          'Đợt 2 (30/3-30/4): Siết chặt vòng vây phía Đông',
          'Đợt 3 (1-7/5): Tổng tấn công, toàn thắng',
          'De Castries đầu hàng lúc 17h30 ngày 7/5',
        ],
      },
    ],
    quiz: [
      {
        question: 'Chiến dịch Điện Biên Phủ bắt đầu vào ngày nào?',
        options: ['7/5/1954', '13/3/1954', '21/7/1954', '2/9/1954'],
        correct: 1,
        explanation: 'Chiến dịch Điện Biên Phủ bắt đầu ngày 13/3/1954 và kết thúc thắng lợi ngày 7/5/1954 — kéo dài 56 ngày đêm.',
      },
      {
        question: 'Ai là Tổng chỉ huy chiến dịch Điện Biên Phủ?',
        options: ['Nguyễn Chí Thanh', 'Trường Chinh', 'Võ Nguyên Giáp', 'Lê Duẩn'],
        correct: 2,
        explanation: 'Đại tướng Võ Nguyên Giáp là Tổng Tư lệnh chiến dịch Điện Biên Phủ, người đưa ra quyết định chuyển từ "Đánh nhanh thắng nhanh" sang "Đánh chắc tiến chắc".',
      },
      {
        question: 'Hiệp định Genève được ký kết vào ngày nào?',
        options: ['7/5/1954', '13/3/1954', '2/9/1945', '21/7/1954'],
        correct: 3,
        explanation: 'Hiệp định Genève được ký vào ngày 21/7/1954, chính thức chấm dứt chiến tranh, lập lại hòa bình ở Đông Dương.',
      },
      {
        question: 'Chiến dịch Điện Biên Phủ kéo dài bao nhiêu ngày đêm?',
        options: ['45 ngày', '56 ngày', '60 ngày', '72 ngày'],
        correct: 1,
        explanation: 'Chiến dịch kéo dài đúng 56 ngày đêm lịch sử, từ 13/3 đến 7/5/1954.',
      },
    ],
  },
  {
    id: 2,
    year: '1965',
    title: 'MỘT GIAI ĐOẠN MỚI',
    subtitle: 'Mỹ trực tiếp can thiệp',
    description: 'Mỹ đưa quân chiến đấu vào miền Nam, mở đầu chiến lược Chiến tranh cục bộ khốc liệt.',
    progress: 0.4,
    status: 'current',
    unsplashId: '1489824904134-2fa5c3c45570',
    lessons: [
      {
        id: 1,
        title: 'BỐI CẢNH',
        duration: 8,
        status: 'completed',
        story: [
          {
            emotion: 'thinking',
            text: 'Sau Hiệp định Genève 1954, Mỹ dần can thiệp sâu vào miền Nam Việt Nam. Đến năm 1965, Mỹ đổ quân trực tiếp vào chiến trường.',
          },
        ],
        keyPoints: ['Mỹ can thiệp trực tiếp vào miền Nam', 'Quân dân ta phát động phong trào chống Mỹ'],
      },
    ],
    quiz: [],
  },
  {
    id: 3,
    year: '1968',
    title: 'TẾT MẬU THÂN',
    subtitle: 'Cuộc Tổng tấn công bất ngờ',
    description: 'Đêm giao thừa Tết Mậu Thân 1968, quân giải phóng đồng loạt tấn công các đô thị miền Nam.',
    progress: 0,
    status: 'locked',
    unsplashId: '1567593810-b80c8d34c4b4',
    lessons: [],
    quiz: [],
  },
  {
    id: 4,
    year: '1972',
    title: 'ĐIỆN BIÊN PHỦ TRÊN KHÔNG',
    subtitle: '12 ngày đêm lịch sử',
    description: 'Trận đụng đầu lịch sử 12 ngày đêm với pháo đài bay B-52 trên bầu trời Hà Nội năm 1972.',
    progress: 0,
    status: 'locked',
    unsplashId: '1470290378698-92266f76aebc',
    lessons: [],
    quiz: [],
  },
  {
    id: 5,
    year: '1975',
    title: 'ĐẠI THẮNG MÙA XUÂN',
    subtitle: 'Thống nhất đất nước',
    description: 'Chiến dịch Hồ Chí Minh lịch sử — ngày 30/4/1975, đất nước hoàn toàn thống nhất.',
    progress: 0,
    status: 'locked',
    unsplashId: '1583417319070-4a69db38a482',
    lessons: [],
    quiz: [],
  },
]

export const userStats: UserStats = {
  name: 'Người Khám Phá',
  streak: 7,
  xp: 240,
  achievements: 3,
  totalLessons: 12,
  totalQuestions: 48,
  accuracy: 0.87,
}

export const weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
export const weekDone = [true, true, true, true, true, true, false]

export const achievements: Achievement[] = [
  { id: 1, icon: '🏅', title: 'NGƯỜI KHÁM PHÁ', desc: 'Hoàn thành chương đầu tiên', earned: true },
  { id: 2, icon: '🔥', title: 'NGƯỜI BỀN BỈ', desc: '7 ngày streak liên tiếp', earned: true },
  { id: 3, icon: '📚', title: 'NGƯỜI HIỂU CHUYỆN', desc: 'Hoàn thành 10 bài học', earned: true },
  { id: 4, icon: '🧠', title: 'BỘ NÃO LỊCH SỬ', desc: 'Đạt 100% trong một chương', earned: false },
  { id: 5, icon: '🗺️', title: 'NHÀ THÁM HIỂM', desc: 'Hoàn thành 5 chương', earned: false },
  { id: 6, icon: '🏆', title: 'SỬ GIA TRẺ', desc: 'Hoàn thành hành trình', earned: false },
]

export const aiSuggestions = [
  'Vì sao năm 1954 quan trọng?',
  'Giải thích về Hiệp định Genève 1954.',
  'Ai là Đại tướng Võ Nguyên Giáp?',
  'Ý nghĩa vĩ tuyến 17 là gì?',
]

export const initialAIConversation = [
  {
    role: 'ai' as const,
    text: 'Xin chào! Mình là Chill — người dẫn chuyện lịch sử của bạn. Bạn đang tò mò điều gì về lịch sử Việt Nam? 📜',
  },
]

