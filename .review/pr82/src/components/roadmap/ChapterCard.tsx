import type { Chapter } from '../../types'

export default function ChapterCard({ chapter, onPress }: { chapter: Chapter; onPress: () => void }) {
  const isLocked = chapter.status === 'locked'

  return (
    <button
      onClick={isLocked ? undefined : onPress}
      disabled={isLocked}
      className="w-full text-left paper-card rounded-lg overflow-hidden transition-transform active:scale-[0.98]"
      style={{ opacity: isLocked ? 0.6 : 1 }}
    >
      {/* Header band */}
      <div
        className="px-4 py-2 flex items-center justify-between"
        style={{ background: isLocked ? '#D4B896' : '#8B1A1A' }}
      >
        <div>
          <span
            className="font-hand text-xs"
            style={{ color: isLocked ? '#7A4020' : '#F5E6D0', opacity: 0.8 }}
          >
            CHƯƠNG {String(chapter.id).padStart(2, '0')}
          </span>
          <div
            className="font-serif font-bold text-lg leading-tight"
            style={{ color: isLocked ? '#3D1A00' : '#FBF4E8' }}
          >
            {chapter.year}
          </div>
        </div>
        <div className="text-right">
          <div
            className="font-serif font-bold text-sm"
            style={{ color: isLocked ? '#7A4020' : '#F5E6D0' }}
          >
            "{chapter.title}"
          </div>
          {isLocked && <div className="text-lg mt-0.5">🔒</div>}
          {chapter.status === 'current' && (
            <div
              className="font-hand text-xs"
              style={{ color: '#F5E6D0', opacity: 0.9 }}
            >
              → ĐANG HỌC
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-3">
        <div className="font-sans text-xs leading-relaxed mb-2" style={{ color: '#5A3010' }}>
          {chapter.subtitle}
        </div>
        {chapter.progress > 0 && (
          <div>
            <div className="flex justify-between mb-1">
              <div className="font-hand text-xs" style={{ color: '#A0622A' }}>Tiến độ</div>
              <div className="font-sans font-bold text-xs" style={{ color: '#8B1A1A' }}>
                {Math.round(chapter.progress * 100)}%
              </div>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#E8D5BA' }}>
              <div
                className="h-full rounded-full"
                style={{ width: `${chapter.progress * 100}%`, background: '#8B1A1A' }}
              />
            </div>
          </div>
        )}
      </div>
    </button>
  )
}

// ─── Chapter Screen ───────────────────────────────────────────────────────────
