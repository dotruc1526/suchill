import Mascot from '../../Mascot'
import { chapters, userStats, weekDays, weekDone } from '../../data'
import { JourneyMap } from './components/JourneyMap'

export function HomeScreen({
  onChapter,
  onLesson,
}: {
  onChapter: (id: number) => void
  onLesson: (cid: number, idx: number) => void
}) {
  const currentChapter =
    chapters.find(c => c.status === 'current' && c.lessons.some(l => l.status === 'current')) ??
    chapters.find(c => c.status === 'current')!
  const currentLesson = currentChapter?.lessons.find(l => l.status === 'current')
  const currentLessonIdx = currentChapter?.lessons.findIndex(l => l.status === 'current') ?? 0

  return (
    <div className="pb-4 px-4 space-y-4">
      {/* Greeting */}
      <div className="pt-4">
        <div className="font-hand text-2xl" style={{ color: '#3D1A00' }}>XIN CHÀO 👋</div>
        <div className="font-sans text-sm mt-0.5" style={{ color: '#7A4020' }}>
          Hôm nay bạn muốn khám phá điều gì?
        </div>
      </div>

      {/* Streak card */}
      <div
        className="paper-card rounded-lg p-3 flex items-center gap-3"
        style={{ borderLeft: '4px solid #C4341A' }}
      >
        <span className="text-3xl">🔥</span>
        <div>
          <div className="font-serif font-bold text-base" style={{ color: '#C4341A' }}>
            {userStats.streak} NGÀY LIÊN TIẾP
          </div>
          <div className="font-sans text-xs" style={{ color: '#7A4020' }}>
            Bạn đã khám phá lịch sử {userStats.streak} ngày liên tiếp!
          </div>
        </div>
        <div className="ml-auto flex gap-1">
          {weekDays.map((d, i) => (
            <div key={d} className="flex flex-col items-center">
              <div
                className="w-6 h-6 rounded-sm flex items-center justify-center text-xs"
                style={{
                  background: weekDone[i] ? '#8B1A1A' : '#E8D5BA',
                  color: weekDone[i] ? '#F5E6D0' : '#A0622A',
                  fontSize: weekDone[i] ? 10 : 8,
                  fontWeight: 600,
                }}
              >
                {weekDone[i] ? '✓' : d[0]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Continue card */}
      {currentChapter && currentLesson && (
        <div
          className="paper-card rounded-lg p-4"
          style={{ borderTop: '3px solid #8B1A1A' }}
        >
          <div className="font-hand text-xs mb-1" style={{ color: '#A0622A' }}>
            → TIẾP TỤC HÀNH TRÌNH
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <div className="font-serif font-bold text-base" style={{ color: '#3D1A00' }}>
                {currentLesson.title}
              </div>
              <div className="font-sans text-xs mt-0.5" style={{ color: '#7A4020' }}>
                Chương {currentChapter.id} · {currentChapter.year} · ⏱ {currentLesson.duration} phút
              </div>
              <button
                onClick={() => onLesson(currentChapter.id, currentLessonIdx)}
                className="mt-3 px-5 py-2 font-sans font-bold text-sm rounded-sm transition-transform active:scale-95"
                style={{ background: '#8B1A1A', color: '#F5E6D0', letterSpacing: '0.05em' }}
              >
                TIẾP TỤC HỌC ›
              </button>
            </div>
            <Mascot emotion="excited" size={72} animate />
          </div>
        </div>
      )}

      {/* Daily goal */}
      <div className="paper-card rounded-lg p-3">
        <div className="flex justify-between items-center mb-2">
          <div className="font-serif font-semibold text-sm" style={{ color: '#3D1A00' }}>MỤC TIÊU HÔM NAY</div>
          <div className="font-hand text-sm" style={{ color: '#A0622A' }}>6 / 10 phút</div>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: '#E8D5BA' }}>
          <div className="h-full rounded-full transition-all" style={{ width: '60%', background: '#8B1A1A' }} />
        </div>
        <div className="font-hand text-xs mt-1" style={{ color: '#A0622A' }}>Còn 4 phút nữa để hoàn thành!</div>
      </div>

      {/* Chapter journey */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="font-serif font-bold text-base" style={{ color: '#3D1A00' }}>HÀNH TRÌNH LỊCH SỬ</div>
          <div className="flex-1 h-px" style={{ background: 'rgba(61,26,0,0.15)' }} />
        </div>

        <JourneyMap chapters={chapters} onChapter={onChapter} />
      </div>
    </div>
  )
}

