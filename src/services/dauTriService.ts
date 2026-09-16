import { supabase, isSupabaseConfigured } from '../lib/supabase'

export interface PvPQuestion {
  id: number
  era: string
  eraYear: string
  question: string
  hint: string
  options: { label: string; text: string; subtext: string }[]
  correctIndex: number
  explanation: string
}

// 10 câu hỏi Kháng chiến chống Mỹ dự phòng (Offline Fallback)
const FALLBACK_PVP_QUESTIONS: PvPQuestion[] = [
  {
    id: 1,
    era: "Kháng chiến chống Mỹ",
    eraYear: "1960",
    question: "Phong trào Đồng khởi (1959 - 1960) nổ ra tiêu biểu và giành thắng lợi vang dội nhất tại tỉnh nào ở miền Nam?",
    hint: "Vùng đất xứ dừa với Đội quân tóc dài huyền thoại của nữ tướng Nguyễn Thị Định.",
    options: [
      { label: "A", text: "Bến Tre", subtext: "Ba xã Định Thủy, Phước Hiệp, Bình Khánh" },
      { label: "B", text: "Tây Ninh", subtext: "Căn cứ Trung ương Cục miền Nam" },
      { label: "C", text: "Quảng Nam", subtext: "Chiến trường Khu 5 ác liệt" },
      { label: "D", text: "Bình Định", subtext: "Vùng đồng bằng duyên hải Trung Bộ" }
    ],
    correctIndex: 0,
    explanation: "Ngày 17/01/1960, dưới sự lãnh đạo của bà Nguyễn Thị Định, phong trào Đồng Khởi bùng nổ tại Mỏ Cày (Bến Tre) rồi nhanh chóng lan khắp miền Nam."
  },
  {
    id: 2,
    era: "Kháng chiến chống Mỹ",
    eraYear: "1963",
    question: "Chiến thắng Ấp Bắc (02/01/1963) tại Tiền Giang đã đánh bại bước đầu hai chiến thuật tác chiến nào của Mỹ?",
    hint: "Chiến thuật đổ quân bằng trực thăng và xe bọc thép M113 tối tân thời bấy giờ.",
    options: [
      { label: "A", text: "Tìm diệt và Bình định", subtext: "Chiến lược Chiến tranh cục bộ" },
      { label: "B", text: "Trực thăng vận và Thiết xa vận", subtext: "Chiến lược Chiến tranh đặc biệt" },
      { label: "C", text: "Tràn ngập lãnh thổ", subtext: "Giai đoạn sau Hiệp định Paris" },
      { label: "D", text: "Bao vây và Khóa biên", subtext: "Kế hoạch lập phòng tuyến quân sự" }
    ],
    correctIndex: 1,
    explanation: "Chiến thắng Ấp Bắc mở ra phong trào 'Thi đua Ấp Bắc, giết giặc lập công', chứng minh ta hoàn toàn có thể đánh bại chiến thuật 'Trực thăng vận' và 'Thiết xa vận'."
  },
  {
    id: 3,
    era: "Kháng chiến chống Mỹ",
    eraYear: "1965",
    question: "Chiến thắng Vạn Tường (Quảng Ngãi, 8/1965) được mệnh danh là bước ngoặt gì trong cuộc đụng đầu trực tiếp với quân viễn chinh Mỹ?",
    hint: "Trận đánh được coi như 'Điện Biên Phủ' chống quân viễn chinh Mỹ trên chiến trường miền Nam.",
    options: [
      { label: "A", text: "Chiến thắng mở đầu chống Chiến tranh cục bộ", subtext: "Đánh bại cuộc hành quân Ánh sáng sao của Thủy quân lục chiến Mỹ" },
      { label: "B", text: "Trận đánh mở đường vận tải biển bí mật", subtext: "Đoàn tàu Không số cập bến an toàn" },
      { label: "C", text: "Cuộc tập kích đường không đầu tiên vào cơ quan chỉ huy Mỹ", subtext: "Đặc công đánh sân bay quân sự" },
      { label: "D", text: "Trận giải phóng hoàn toàn vùng duyên hải miền Trung", subtext: "Phá vỡ hệ thống ấp chiến lược" }
    ],
    correctIndex: 0,
    explanation: "Trận Vạn Tường chứng minh quân dân ta có khả năng đánh bại quân viễn chinh Mỹ về mặt quân sự, dấy lên phong trào 'Tìm Mỹ mà đánh, lùng ngụy mà diệt'."
  },
  {
    id: 4,
    era: "Kháng chiến chống Mỹ",
    eraYear: "1959",
    question: "Tuyến chi viện chiến lược Trường Sơn (Đường Hồ Chí Minh) lịch sử được thành lập vào ngày tháng năm nào?",
    hint: "Trùng đúng vào ngày kỷ niệm sinh nhật Bác Hồ kính yêu.",
    options: [
      { label: "A", text: "19/05/1959", subtext: "Đoàn 559 được thành lập soi đường mở tuyến" },
      { label: "B", text: "02/09/1960", subtext: "Đại hội đại biểu toàn quốc lần thứ III" },
      { label: "C", text: "22/12/1959", subtext: "Ngày thành lập Quân đội Nhân dân" },
      { label: "D", text: "30/04/1961", subtext: "Hợp nhất các lực lượng vũ trang giải phóng" }
    ],
    correctIndex: 0,
    explanation: "Ngày 19/05/1959, Tổng Quân ủy Trung ương quyết định thành lập 'Đoàn công tác quân sự đặc biệt' (Đoàn 559) để xẻ dọc Trường Sơn chi viện sức người, sức của cho miền Nam."
  },
  {
    id: 5,
    era: "Kháng chiến chống Mỹ",
    eraYear: "1968",
    question: "Cuộc Tổng tiến công và nổi dậy Tết Mậu Thân 1968 đã buộc Tổng thống Mỹ Lyndon Johnson phải tuyên bố điều gì?",
    hint: "Buộc Mỹ phải xuống thang chiến tranh, ngừng ném bom miền Bắc và chấp nhận đàm phán.",
    options: [
      { label: "A", text: "Rút toàn bộ quân đội ngay trong năm 1968", subtext: "Chấm dứt hoàn toàn sự can thiệp quân sự" },
      { label: "B", text: "Ngừng ném bom miền Bắc và ngồi vào đàm phán Paris", subtext: "Thừa nhận sự phá sản của Chiến tranh cục bộ" },
      { label: "C", text: "Ký ngay hiệp định đình chiến vô điều kiện", subtext: "Bàn giao quyền kiểm soát cho chính quyền Sài Gòn" },
      { label: "D", text: "Mở rộng cuộc chiến tranh xâm lược sang toàn Đông Dương", subtext: "Đưa thêm 20 vạn lính viễn chinh sang" }
    ],
    correctIndex: 1,
    explanation: "Đòn bất ngờ Tết Mậu Thân 1968 làm lung lay tận gốc ý chí xâm lược của Mỹ, buộc Tổng thống Johnson tuyên bố ngừng ném bom miền Bắc từ vĩ tuyến 20 trở ra và cử đại diện đàm phán ở Paris."
  },
  {
    id: 6,
    era: "Kháng chiến chống Mỹ",
    eraYear: "1972",
    question: "Chiến dịch 12 ngày đêm cuối năm 1972 bắn rơi 34 pháo đài bay B-52 của Mỹ trên bầu trời Hà Nội - Hải Phòng được ngợi ca là gì?",
    hint: "Một chiến thắng mang tên địa danh lịch sử lừng lẫy năm châu nhưng diễn ra trên không trung.",
    options: [
      { label: "A", text: "Chiến dịch Sấm Rền", subtext: "Tên chiến dịch không kích của không quân Mỹ" },
      { label: "B", text: "Trận Điện Biên Phủ trên không", subtext: "Bản hùng ca đập tan chiến dịch Linebacker II" },
      { label: "C", text: "Chiến dịch Ánh Sáng Mùa Đông", subtext: "Kế hoạch tác chiến phối hợp binh chủng" },
      { label: "D", text: "Chiến dịch Đường 9 - Khe Sanh", subtext: "Mặt trận nghi binh chiến lược" }
    ],
    correctIndex: 1,
    explanation: "Chiến dịch 'Điện Biên Phủ trên không' (18/12 - 30/12/1972) đập tan nỗ lực ném bom rải thảm B-52 của Mỹ, buộc Tổng thống Nixon phải ký Hiệp định Paris."
  },
  {
    id: 7,
    era: "Kháng chiến chống Mỹ",
    eraYear: "1973",
    question: "Hiệp định Paris về chấm dứt chiến tranh, lập lại hòa bình ở Việt Nam được chính thức ký kết vào ngày nào?",
    hint: "Hiện thực hóa mục tiêu chiến lược 'Đánh cho Mỹ cút' của Chủ tịch Hồ Chí Minh.",
    options: [
      { label: "A", text: "27/01/1973", subtext: "Tại Trung tâm Hội nghị quốc tế phố Kléber (Paris)" },
      { label: "B", text: "30/04/1973", subtext: "Thời điểm hoàn tất rút quân viễn chinh Mỹ" },
      { label: "C", text: "21/07/1973", subtext: "Kỷ niệm ngày ký Hiệp định Genève 1954" },
      { label: "D", text: "19/12/1972", subtext: "Ngày bắt đầu chiến dịch phòng không Hà Nội" }
    ],
    correctIndex: 0,
    explanation: "Ngày 27/01/1973, Hiệp định Paris được ký kết, buộc Mỹ phải công nhận độc lập, chủ quyền, thống nhất của Việt Nam và rút toàn bộ quân viễn chinh về nước."
  },
  {
    id: 8,
    era: "Kháng chiến chống Mỹ",
    eraYear: "1975",
    question: "Trận đánh then chốt, táo bạo mở màn cho Đại thắng mùa Xuân 1975 trong Chiến dịch Tây Nguyên diễn ra tại thị xã nào?",
    hint: "Thủ phủ cà phê Tây Nguyên, nơi địch bị đòn bất ngờ không kịp trở tay vào ngày 10/03/1975.",
    options: [
      { label: "A", text: "Pleiku", subtext: "Sở chỉ huy Quân đoàn II ngụy quyền" },
      { label: "B", text: "Buôn Ma Thuột", subtext: "Đòn điểm huyệt chiến lược ngày 10/03/1975" },
      { label: "C", text: "Kon Tum", subtext: "Căn cứ tiền tiêu phía bắc Tây Nguyên" },
      { label: "D", text: "Đà Lạt", subtext: "Vùng cao nguyên phía nam Trung Bộ" }
    ],
    correctIndex: 1,
    explanation: "Đòn đánh nghi binh ở Pleiku rồi bất ngờ giáng sấm sét vào Buôn Ma Thuột ngày 10/03/1975 đã phá vỡ thế phòng ngự của địch, châm ngòi cho sự sụp đổ dây chuyền của quân ngụy."
  },
  {
    id: 9,
    era: "Kháng chiến chống Mỹ",
    eraYear: "1975",
    question: "Bức điện mật lịch sử ngày 07/04/1975 của Đại tướng Tổng Tư lệnh Võ Nguyên Giáp có câu khẩu lệnh truyền lửa nào?",
    hint: "Khẩu lệnh hối hả, thôi thúc các cánh quân tiến công thần tốc giải phóng Sài Gòn.",
    options: [
      { label: "A", text: "Không có gì quý hơn độc lập tự do", subtext: "Lời kêu gọi chống Mỹ cứu nước năm 1966" },
      { label: "B", text: "Thần tốc, thần tốc hơn nữa; táo bạo, táo bạo hơn nữa", subtext: "Tranh thủ từng giờ, từng phút xốc tới mặt trận" },
      { label: "C", text: "Nhằm thẳng quân thù mà bắn", subtext: "Lời hô bất tử của Anh hùng Nguyễn Viết Xuân" },
      { label: "D", text: "Quyết tử để Tổ quốc quyết sinh", subtext: "Lời thề cảm tử quân Thủ đô mùa đông 1946" }
    ],
    correctIndex: 1,
    explanation: "'Thần tốc, thần tốc hơn nữa; táo bạo, táo bạo hơn nữa; tranh thủ từng giờ, từng phút xốc tới mặt trận, giải phóng miền Nam. Quyết chiến và toàn thắng!' - Bức điện khẩn lịch sử của Đại tướng Võ Nguyên Giáp."
  },
  {
    id: 10,
    era: "Kháng chiến chống Mỹ",
    eraYear: "1975",
    question: "Chiếc xe tăng mang số hiệu nào của Quân đội nhân dân Việt Nam đã húc đổ cổng chính Dinh Độc Lập trưa ngày 30/04/1975?",
    hint: "Xe tăng T-59 thuộc Lữ đoàn Tăng - Thiết giáp 203 do Trung úy Vũ Đăng Toàn chỉ huy.",
    options: [
      { label: "A", text: "Xe tăng 390", subtext: "Húc tung cánh cổng chính Dinh Độc Lập lúc 11h30" },
      { label: "B", text: "Xe tăng 843", subtext: "Húc cổng phụ, do Trung úy Bùi Quang Thận chỉ huy" },
      { label: "C", text: "Xe tăng 380", subtext: "Chiếc xe tăng tiến vào chi viện đội hình" },
      { label: "D", text: "Xe tăng 985", subtext: "Xe tăng thọc sâu thuộc mũi tiến công hướng đông" }
    ],
    correctIndex: 0,
    explanation: "Đúng 11h30 ngày 30/04/1975, xe tăng 390 đã húc tung cánh cổng chính Dinh Độc Lập, ngay sau đó đại đội trưởng Bùi Quang Thận cắm lá cờ chiến thắng trên nóc Dinh."
  }
]

/**
 * Đấu Trí Service (Supabase Data Abstraction Layer)
 * Lấy 10 câu hỏi Kháng chiến chống Mỹ từ bảng pvp_questions của Supabase.
 */
export const dauTriService = {
  async getPvPQuestions(): Promise<PvPQuestion[]> {
    if (!isSupabaseConfigured()) {
      return FALLBACK_PVP_QUESTIONS
    }

    try {
      const { data, error } = await supabase
        .from('pvp_questions')
        .select('*')
        .order('id', { ascending: true })

      if (error || !data || data.length === 0) {
        return FALLBACK_PVP_QUESTIONS
      }

      return data.map((q: any) => ({
        id: q.id,
        era: q.era,
        eraYear: q.era_year,
        question: q.question,
        hint: q.hint || '',
        options: q.options as { label: string; text: string; subtext: string }[],
        correctIndex: q.correct_index,
        explanation: q.explanation,
      }))
    } catch (err) {
      console.warn('[dauTriService] Lỗi nạp pvp_questions từ Supabase:', err)
      return FALLBACK_PVP_QUESTIONS
    }
  }
}
