import Mascot from '../../Mascot'
import { chapters, achievements, userStats } from '../../data'

export function ProfileScreen({ xp }: { xp: number }) {
  return (
    <div className="px-4 pb-6">
      {/* Header */}
      <div
        className="rounded-b-2xl -mx-4 px-6 pt-4 pb-6 mb-4"
        style={{ background: '#8B1A1A' }}
      >
        <div className="font-serif font-bold text-base mb-3" style={{ color: 'rgba(245,230,208,0.8)' }}>
          CUỐN SỔ HÀNH TRÌNH
        </div>
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div
            className="w-20 h-20 rounded-sm overflow-hidden flex items-center justify-center shrink-0"
            style={{ border: '3px solid rgba(245,230,208,0.5)', background: '#6B1010' }}
          >
            <Mascot emotion="happy" size={72} />
          </div>
          <div>
            <div className="font-serif font-bold text-lg" style={{ color: '#FBF4E8' }}>
              {userStats.name}
            </div>
            <div className="flex gap-3 mt-1">
              <div className="text-center">
                <div className="font-serif font-bold text-lg leading-none" style={{ color: '#FBF4E8' }}>🔥 {userStats.streak}</div>
                <div className="font-hand text-xs" style={{ color: 'rgba(245,230,208,0.7)' }}>ngày</div>
              </div>
              <div className="text-center">
                <div className="font-serif font-bold text-lg leading-none" style={{ color: '#FBF4E8' }}>⭐ {xp}</div>
                <div className="font-hand text-xs" style={{ color: 'rgba(245,230,208,0.7)' }}>XP</div>
              </div>
              <div className="text-center">
                <div className="font-serif font-bold text-lg leading-none" style={{ color: '#FBF4E8' }}>🏆 {userStats.achievements}</div>
                <div className="font-hand text-xs" style={{ color: 'rgba(245,230,208,0.7)' }}>danh hiệu</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Journey progress */}
      <div className="mb-4">
        <div className="font-serif font-bold text-sm mb-3" style={{ color: '#3D1A00' }}>HÀNH TRÌNH</div>
        <div className="space-y-2">
          {chapters.map(ch => (
            <div key={ch.id} className="paper-card rounded-lg px-3 py-2 flex items-center gap-3">
              <div
                className="w-14 font-serif font-bold text-sm"
                style={{ color: ch.status === 'locked' ? '#A0622A' : '#8B1A1A' }}
              >
                {ch.year}
              </div>
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: '#E8D5BA' }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: ch.status === 'locked' ? '0%' : `${ch.progress * 100}%`,
                    background: ch.progress >= 1 ? '#3A5A2A' : '#8B1A1A',
                  }}
                />
              </div>
              <div className="font-hand text-xs w-8 text-right" style={{ color: '#A0622A' }}>
                {ch.status === 'locked' ? '🔒' : ch.progress >= 1 ? '✓' : `${Math.round(ch.progress * 100)}%`}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="mb-4">
        <div className="font-serif font-bold text-sm mb-3" style={{ color: '#3D1A00' }}>DANH HIỆU</div>
        <div className="grid grid-cols-3 gap-2">
          {achievements.map(a => (
            <div
              key={a.id}
              className="paper-stamp rounded-lg p-2 flex flex-col items-center text-center"
              style={{
                background: a.earned ? '#FBF4E8' : '#E8D5BA',
                opacity: a.earned ? 1 : 0.5,
              }}
            >
              <div className="text-2xl">{a.icon}</div>
              <div className="font-hand text-[9px] leading-tight mt-1" style={{ color: '#3D1A00' }}>
                {a.title}
              </div>
              {a.earned && (
                <div
                  className="font-hand text-[8px] mt-0.5"
                  style={{ color: '#3A5A2A' }}
                >
                  Đã đạt
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div>
        <div className="font-serif font-bold text-sm mb-3" style={{ color: '#3D1A00' }}>THỐNG KÊ</div>
        <div className="paper-card rounded-lg p-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="font-serif font-bold text-2xl" style={{ color: '#8B1A1A' }}>
              {userStats.totalLessons}
            </div>
            <div className="font-hand text-xs" style={{ color: '#A0622A' }}>bài học</div>
          </div>
          <div>
            <div className="font-serif font-bold text-2xl" style={{ color: '#8B1A1A' }}>
              {userStats.totalQuestions}
            </div>
            <div className="font-hand text-xs" style={{ color: '#A0622A' }}>câu hỏi</div>
          </div>
          <div>
            <div className="font-serif font-bold text-2xl" style={{ color: '#8B1A1A' }}>
              {Math.round(userStats.accuracy * 100)}%
            </div>
            <div className="font-hand text-xs" style={{ color: '#A0622A' }}>chính xác</div>
          </div>
        </div>
      </div>
    </div>
  )
}

