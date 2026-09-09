import mascotSpriteUrl from '@/imports/image-1.png'

export type MascotEmotion =
  | 'happy' | 'excited' | 'thinking' | 'sad' | 'correct' | 'wrong'
  | 'determined' | 'surprised' | 'loving' | 'idea' | 'sleepy' | 'sorry'
  | 'laughing' | 'shy' | 'crying' | 'angry' | 'worried'

// Sprite sheet: 4 cols × 3 rows
// (col, row) → emotion
// Row 0: Ngạc nhiên, Cười lớn, Ngại ngùng, Yêu thương
// Row 1: Buồn bã,    Khóc nhè,  Giận dỗi,  Lo lắng
// Row 2: Buồn ngủ,  Quyết tâm, Nảy ý tưởng, Xin lỗi
const EMOTION_POSITIONS: Record<MascotEmotion, string> = {
  surprised:  '0% 0%',
  laughing:   '33.33% 0%',
  shy:        '66.67% 0%',
  loving:     '100% 0%',
  sad:        '0% 50%',
  crying:     '33.33% 50%',
  angry:      '66.67% 50%',
  worried:    '100% 50%',
  sleepy:     '0% 100%',
  determined: '33.33% 100%',
  idea:       '66.67% 100%',
  sorry:      '100% 100%',
  // Aliases
  happy:      '33.33% 0%',
  excited:    '33.33% 0%',
  thinking:   '66.67% 100%',
  correct:    '33.33% 0%',
  wrong:      '100% 100%',
}

type Props = {
  emotion?: MascotEmotion
  size?: number
  className?: string
  animate?: boolean
}

export default function Mascot({ emotion = 'happy', size = 100, className = '', animate = false }: Props) {
  return (
    <div
      className={`inline-block shrink-0 ${animate ? 'animate-mascot-idle' : ''} ${className}`}
      style={{
        width: size,
        height: size,
        backgroundImage: `url(${mascotSpriteUrl})`,
        backgroundSize: '400% 300%',
        backgroundPosition: EMOTION_POSITIONS[emotion] ?? '33.33% 0%',
        backgroundRepeat: 'no-repeat',
        transition: 'background-position 0.3s ease',
        imageRendering: 'auto',
      }}
      aria-label={`Sử Chill mascot — ${emotion}`}
    />
  )
}
