/**
  * Sử Chill Design System Tokens
  * Quy định tập trung màu sắc, font chữ và quy chuẩn giao diện toàn dự án.
  * Mọi feature hoặc component mới PHẢI tuân thủ các mảng màu & font chữ này.
  */

export const theme = {
  colors: {
    // Backgrounds
    pageBg: '#C8A882',           // Nền ngoài bao bọc
    appBg: '#F5E6D0',            // Nền ứng dụng chính (Giấy Parchment)
    cardBg: '#FBF4E8',           // Nền thẻ giấy kem (Cream Paper)
    activeBg: '#EDD9B8',         // Nền khi được chọn
    navBg: '#EDD9B8',            // Nền thanh điều hướng đáy

    // Brand & Accents
    primary: '#8B1A1A',          // Đỏ con dấu (Stamp Burgundy)
    primaryText: '#F5E6D0',      // Chữ màu giấy trên nền đỏ
    secondary: '#1E2D5A',        // Xanh navy ôn tập
    accentRed: '#C4341A',        // Đỏ lửa streak

    // Typography Colors
    textPrimary: '#3D1A00',      // Mực nâu đậm (Tiêu đề, nội dung chính)
    textSecondary: '#7A4020',    // Mực nâu vừa (Mô tả phụ)
    textMuted: '#A0622A',        // Nâu đất (Ghi chú nhỏ, thời gian)

    // Feedback State (Bôi xanh / Bôi đỏ)
    correct: {
      bg: '#E8F5E2',             // Xanh lá cây nhạt
      border: '#3A5A2A',         // Viền xanh lá đậm
      text: '#3A5A2A',           // Chữ xanh lá đậm
    },
    incorrect: {
      bg: '#FDE8E4',             // Đỏ nhạt
      border: '#C4341A',         // Viền đỏ tươi
      text: '#C4341A',           // Chữ đỏ tươi
    },

    // Borders & Lines
    borderLight: 'rgba(61,26,0,0.12)',
    borderMedium: 'rgba(61,26,0,0.2)',
    borderDark: 'rgba(61,26,0,0.35)',
  },

  fonts: {
    serif: 'font-serif',         // Playfair Display (Năm, Tiêu đề chương)
    hand: 'font-hand',           // Caveat (Chữ viết tay nhãn, ghi chú)
    sans: 'font-sans',           // Inter (Nội dung bài học, nút bấm)
  },
} as const

