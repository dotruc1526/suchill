import type { MascotEmotion } from './Mascot'

export type StoryStep = {
  emotion: MascotEmotion
  text: string
  highlight?: string
  fact?: { label: string; value: string }
}

export type QuizQuestion = {
  question: string
  options: string[]
  correct: number
  explanation: string
}

export type Lesson = {
  id: number
  title: string
  duration: number
  status: 'completed' | 'current' | 'locked'
  story: StoryStep[]
  keyPoints: string[]
}

export type Chapter = {
  id: number
  year: string
  title: string
  subtitle: string
  description: string
  progress: number
  status: 'completed' | 'current' | 'locked'
  lessons: Lesson[]
  quiz: QuizQuestion[]
  unsplashId?: string
}

export const chapters: Chapter[] = [
  {
    id: 1,
    year: '1954',
    title: 'ĐIỂM NGOẶT',
    subtitle: 'Chiến thắng Điện Biên Phủ',
    description: 'Năm 1954 đánh dấu bước ngoặt lịch sử: Chiến thắng Điện Biên Phủ và Hiệp định Genève.',
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
            highlight: '9 năm kháng chiến',
          },
          {
            emotion: 'determined',
            text: 'Dưới sự lãnh đạo của Đảng và Chủ tịch Hồ Chí Minh, quân dân Việt Nam đã kiên cường chiến đấu. Và rồi, khoảnh khắc lịch sử đã đến!',
            fact: { label: 'Tổng chỉ huy', value: 'Đại tướng Võ Nguyên Giáp' },
          },
          {
            emotion: 'surprised',
            text: 'Bạn có biết không? Chiến dịch Điện Biên Phủ kéo dài đúng 56 ngày đêm — từ 13/3 đến 7/5/1954. Đây là trận chiến quyết định số phận của cuộc chiến tranh!',
            highlight: '56 ngày đêm',
          },
          {
            emotion: 'happy',
            text: 'Chiến thắng Điện Biên Phủ ngày 7/5/1954 đã buộc Pháp ngồi vào bàn đàm phán. Hiệp định Genève được ký ngày 21/7/1954 — kết thúc chiến tranh, lập lại hòa bình!',
            highlight: '7/5/1954',
          },
        ],
        keyPoints: [
          'Chiến dịch Điện Biên Phủ: 13/3 – 7/5/1954 (56 ngày đêm)',
          'Đại tướng Võ Nguyên Giáp chỉ huy',
          'Hiệp định Genève ký ngày 21/7/1954',
          'Vĩ tuyến 17 tạm thời chia đôi đất nước',
        ],
      },
      {
        id: 2,
        title: 'NGUYÊN NHÂN',
        duration: 6,
        status: 'completed',
        story: [
          {
            emotion: 'thinking',
            text: 'Vì sao Pháp xây dựng tập đoàn cứ điểm ở Điện Biên Phủ? Họ cho rằng đây là "pháo đài bất khả xâm phạm" — bẫy để tiêu diệt quân chủ lực Việt Nam.',
          },
          {
            emotion: 'surprised',
            text: 'Nhưng họ đã nhầm! Quân dân Việt Nam đã kéo pháo vào trận địa bằng sức người qua những đèo núi hiểm trở — một kỳ tích mà người Pháp không thể ngờ tới!',
            highlight: 'Kéo pháo bằng sức người',
          },
        ],
        keyPoints: [
          'Pháp xây tập đoàn cứ điểm để nhử quân ta',
          'Việt Nam chuyển sang đánh công kiên',
          'Pháo hạng nặng được kéo vào trận địa bằng sức người',
        ],
      },
      {
        id: 3,
        title: 'DIỄN BIẾN',
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
            highlight: '7/5/1954 — Chiến thắng!',
          },
        ],
        keyPoints: [
          'Đợt 1 (13-17/3): Tiêu diệt cứ điểm phía Bắc',
          'Đợt 2 (30/3-30/4): Siết chặt vòng vây phía Đông',
          'Đợt 3 (1-7/5): Tổng tấn công, toàn thắng',
          'De Castries đầu hàng lúc 17h30 ngày 7/5',
        ],
      },
      {
        id: 4,
        title: 'KẾT QUẢ',
        duration: 5,
        status: 'locked',
        story: [],
        keyPoints: [],
      },
      {
        id: 5,
        title: 'Ý NGHĨA',
        duration: 6,
        status: 'locked',
        story: [],
        keyPoints: [],
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
        question: 'Ai là tổng chỉ huy chiến dịch Điện Biên Phủ?',
        options: ['Nguyễn Chí Thanh', 'Trường Chinh', 'Võ Nguyên Giáp', 'Lê Duẩn'],
        correct: 2,
        explanation: 'Đại tướng Võ Nguyên Giáp là Tổng Tư lệnh chiến dịch Điện Biên Phủ, người chỉ đạo toàn bộ kế hoạch tác chiến.',
      },
      {
        question: 'Hiệp định Genève được ký kết vào ngày nào?',
        options: ['7/5/1954', '13/3/1954', '2/9/1945', '21/7/1954'],
        correct: 3,
        explanation: 'Hiệp định Genève ký ngày 21/7/1954 quy định đình chỉ chiến sự và chia đôi Việt Nam tại vĩ tuyến 17.',
      },
      {
        question: 'Chiến dịch Điện Biên Phủ kéo dài bao nhiêu ngày?',
        options: ['45 ngày', '56 ngày', '60 ngày', '72 ngày'],
        correct: 1,
        explanation: 'Chiến dịch kéo dài đúng 56 ngày đêm, từ 13/3 đến 7/5/1954.',
      },
    ],
  },
  {
    id: 2,
    year: '1965',
    title: 'MỘT GIAI ĐOẠN MỚI',
    subtitle: 'Mỹ trực tiếp can thiệp',
    description: 'Mỹ đưa quân chiến đấu vào miền Nam, mở đầu giai đoạn chiến tranh khốc liệt hơn.',
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
            text: 'Sau Hiệp định Genève 1954, Mỹ bắt đầu can thiệp ngày càng sâu vào miền Nam Việt Nam, thay thế vai trò của Pháp.',
          },
        ],
        keyPoints: ['Mỹ thay Pháp can thiệp vào miền Nam', 'Chính quyền Ngô Đình Diệm được dựng lên'],
      },
      {
        id: 2,
        title: 'NGUYÊN NHÂN',
        duration: 7,
        status: 'current',
        story: [],
        keyPoints: [],
      },
      {
        id: 3, title: 'DIỄN BIẾN', duration: 10, status: 'locked', story: [], keyPoints: [],
      },
    ],
    quiz: [],
  },
  {
    id: 3,
    year: '1968',
    title: 'TẾT MẬU THÂN',
    subtitle: 'Cuộc Tổng tấn công bất ngờ',
    description: 'Đêm giao thừa Tết Mậu Thân, quân giải phóng đồng loạt tấn công hàng chục thành phố.',
    progress: 0,
    status: 'locked',
    unsplashId: '1567593810-b80c8d34c4b4',
    lessons: [],
    quiz: [],
  },
  {
    id: 4,
    year: '1972',
    title: 'CHIẾN DỊCH NĂM 1972',
    subtitle: 'Trận Điện Biên Phủ trên không',
    description: 'Trận B-52 trên bầu trời Hà Nội — Việt Nam bắn rơi 81 máy bay Mỹ trong 12 ngày đêm.',
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

export const userStats = {
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

export const achievements = [
  { id: 1, icon: '🏅', title: 'NGƯỜI KHÁM PHÁ', desc: 'Hoàn thành chương đầu tiên', earned: true },
  { id: 2, icon: '🔥', title: 'NGƯỜI BỀN BỈ', desc: '7 ngày streak liên tiếp', earned: true },
  { id: 3, icon: '📚', title: 'NGƯỜI HIỂU CHUYỆN', desc: 'Hoàn thành 10 bài học', earned: true },
  { id: 4, icon: '🧠', title: 'BỘ NÃO LỊCH SỬ', desc: 'Đạt 100% trong một chương', earned: false },
  { id: 5, icon: '🗺️', title: 'NHÀ THÁM HIỂM', desc: 'Hoàn thành 5 chương', earned: false },
  { id: 6, icon: '🏆', title: 'SỬ GIA TRẺ', desc: 'Hoàn thành hành trình', earned: false },
]

export const aiSuggestions = [
  'Vì sao năm 1954 quan trọng?',
  'Giải thích đơn giản hơn về Điện Biên Phủ.',
  'Điều gì xảy ra sau năm 1954?',
  'Ai là Đại tướng Võ Nguyên Giáp?',
]

export type AIMessage = { role: 'user' | 'ai'; text: string }

export const initialAIConversation: AIMessage[] = [
  {
    role: 'ai',
    text: 'Xin chào! Mình là Chill — người dẫn chuyện lịch sử của bạn. Bạn đang tò mò điều gì về lịch sử Việt Nam? 📜',
  },
]
