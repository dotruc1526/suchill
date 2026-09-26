import Mascot, { type MascotEmotion } from '../Mascot'

export default function QuizResultScreen({
  score, total, onHome, onRetry,
}: {
  score: number; total: number; onHome: () => void; onRetry: () => void
}) {
  const pct = score / total
  const emotion: MascotEmotion = pct >= 0.8 ? 'excited' : pct >= 0.5 ? 'happy' : 'worried'
  const label = pct >= 0.8 ? 'RẤT TỐT! 🎉' : pct >= 0.5 ? 'KHÁ TỐT!' : 'CỐ THÊM NHÉ!'

  return (
    <div
      className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6"
      style={{ background: '#F5E6D0' }}
    >
      <Mascot emotion={emotion} size={130} animate className="animate-stamp-in" />

      <div
        className="mt-5 font-sans font-bold text-5xl"
        style={{ color: '#3D1A00', fontFamily: 'var(--font-serif)' }}
      >
        {score}<span className="text-2xl opacity-50">/{total}</span>
      </div>
      <div className="font-serif font-bold text-xl mt-1" style={{ color: '#8B1A1A' }}>{label}</div>

      <div className="font-sans text-xs mt-1" style={{ color: '#A0622A' }}>
        +{score * 10} XP ⭐
      </div>

      {pct < 1 && (
        <div
          className="paper-card rounded-lg p-3 mt-5 w-full flex items-start gap-3"
        >
          <Mascot emotion="idea" size={52} />
          <div>
            <div className="font-hand text-sm font-bold" style={{ color: '#8B1A1A' }}>Sử Chill nhận xét</div>
            <div className="font-sans text-xs mt-0.5 leading-relaxed" style={{ color: '#5A3010' }}>
              {pct >= 0.8
                ? 'Bạn nắm rất tốt kiến thức về giai đoạn lịch sử này! Tiếp tục phát huy nhé!'
                : pct >= 0.5
                ? 'Bạn nhớ khá tốt, nhưng hãy ôn thêm phần diễn biến để hiểu sâu hơn.'
                : 'Đừng nản nhé! Hãy ôn lại bài học và thử lại. Mình tin bạn làm được!'}
            </div>
          </div>
        </div>
      )}

      <div className="w-full mt-6 space-y-3">
        <button
          onClick={onHome}
          className="w-full py-3.5 rounded-sm font-sans font-bold text-sm"
          style={{ background: '#8B1A1A', color: '#F5E6D0', letterSpacing: '0.1em' }}
        >
          TIẾP TỤC HÀNH TRÌNH ›
        </button>
        <button
          onClick={onRetry}
          className="w-full py-3 rounded-sm font-sans text-sm"
          style={{ border: '1.5px solid rgba(61,26,0,0.2)', color: '#7A4020' }}
        >
          Làm lại quiz
        </button>
      </div>
    </div>
  )
}

// ─── AI Screen ────────────────────────────────────────────────────────────────
