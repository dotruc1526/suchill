/**
 * Sử Chill Design System Tokens
 * Quy định tập trung màu sắc, font chữ, khoảng cách, bo góc và hiệu ứng toàn dự án.
 * Mọi feature hoặc component mới PHẢI tuân thủ các tokens này.
 */

export const theme = {
  colors: {
    // Backgrounds
    pageBg: '#C8A882',           // Nền ngoài bao bọc
    appBg: '#F5E6D0',            // Nền ứng dụng chính (Giấy Parchment)
    cardBg: '#FBF4E8',           // Nền thẻ giấy kem (Cream Paper)
    activeBg: '#EDD9B8',         // Nền khi được chọn
    navBg: '#EDD9B8',            // Nền thanh điều hướng đáy
    overlay: 'rgba(0,0,0,0.5)',  // Nền phủ modal

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
    selected: {
      bg: '#F5E6D0',             // Selected trung tính cho narrative/reflection
      border: '#8B1A1A',
      text: '#3D1A00',
      ring: 'rgba(139,26,26,0.18)',
    },

    // Borders & Lines
    borderLight: 'rgba(61,26,0,0.12)',
    borderMedium: 'rgba(61,26,0,0.2)',
    borderDark: 'rgba(61,26,0,0.35)',
    surfaceMuted: 'rgba(61,26,0,0.08)',
    progressTrack: 'rgba(61,26,0,0.1)',
    primarySoft: 'rgba(139,26,26,0.12)',
    primaryBorder: 'rgba(139,26,26,0.25)',
    secondarySoft: 'rgba(30,45,90,0.12)',
    secondaryBorder: 'rgba(30,45,90,0.25)',
    accentSoft: 'rgba(196,52,26,0.12)',
    accentBorder: 'rgba(196,52,26,0.25)',
  },

  fonts: {
    serif: 'font-serif',         // Inter alias for legacy heading classes
    hand: 'font-hand',           // Inter alias for legacy note classes
    sans: 'font-sans',           // Inter (Nội dung bài học, nút bấm)
  },

  radius: {
    none: '0px',
    sm: '6px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    base: '16px',
    lg: '20px',
    xl: '24px',
    xxl: '32px',
  },

  shadows: {
    card: '1px 2px 0 rgba(61,26,0,0.08)',
    cardHover: '2px 4px 0 rgba(61,26,0,0.12)',
    selected: '0 0 0 2px rgba(139,26,26,0.18)',
    stamp: '0 2px 4px rgba(139,26,26,0.25)',
    modal: '0 10px 25px -5px rgba(61,26,0,0.2)',
  },

  motion: {
    durationFast: '150ms',
    durationNormal: '250ms',
    durationSlow: '400ms',
    easeDefault: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },

  layout: {
    touchTarget: 44,
  },
} as const

export type Theme = typeof theme
