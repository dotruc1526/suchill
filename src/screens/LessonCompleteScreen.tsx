import Mascot from '../Mascot'
import type { Lesson } from '../data'

export default function LessonCompleteScreen({
  lesson, onQuiz, onHome,
}: {
  lesson: Lesson
  onQuiz: () => void
  onHome: () => void
}) {
  return (
    <div
      className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6"
      style={{ background: '#F5E6D0' }}
    >
      <div className="animate-stamp-in">
        <Mascot emotion="excited" size={140} animate />
      </div>
      <div className="font-serif font-bold text-2xl mt-4 text-center" style={{ color: '#3D1A00' }}>
        BÀI HỌC HOÀN THÀNH!
      </div>
      <div
        className="font-hand text-lg mt-1"
        style={{ color: '#3A5A2A' }}
      >
        +10 XP ⭐
      </div>
      <div className="font-sans text-sm text-center mt-2 leading-relaxed" style={{ color: '#7A4020' }}>
        "{lesson.title}" — bạn đã hiểu rõ hơn về lịch sử!
      </div>

      <div className="w-full mt-8 space-y-3">
        <button
          onClick={onQuiz}
          className="w-full py-3.5 rounded-sm font-sans font-bold text-sm"
          style={{ background: '#8B1A1A', color: '#F5E6D0', letterSpacing: '0.1em' }}
        >
          LÀM QUIZ NGAY ›
        </button>
        <button
          onClick={onHome}
          className="w-full py-3 rounded-sm font-sans text-sm"
          style={{
            background: 'transparent',
            color: '#7A4020',
            border: '1.5px solid rgba(61,26,0,0.2)',
          }}
        >
          Quay lại chương
        </button>
      </div>
    </div>
  )
}

// ─── Quiz Screen ──────────────────────────────────────────────────────────────
