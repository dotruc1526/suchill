import type { Chapter } from '../../../types'

const NODE_POSITIONS = [
  { left: '24%', top: 58, labelSide: 'right' },
  { left: '72%', top: 138, labelSide: 'left' },
  { left: '29%', top: 224, labelSide: 'right' },
  { left: '69%', top: 310, labelSide: 'left' },
  { left: '43%', top: 396, labelSide: 'right' },
] as const

export function JourneyMap({ chapters, onChapter }: { chapters: Chapter[]; onChapter: (id: number) => void }) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      style={{
        height: 470,
        background: 'linear-gradient(180deg, #F5E6C8 0%, #D9B47B 47%, #8B2421 100%)',
        border: '2px solid rgba(78,27,16,0.35)',
        boxShadow: 'inset 0 0 0 3px rgba(255,248,224,0.36)',
      }}
    >
      <div className="absolute -top-8 -left-10 w-40 h-24 rounded-[50%]" style={{ background: '#6A2A1E' }} />
      <div className="absolute -top-3 -right-8 w-36 h-20 rounded-[50%]" style={{ background: '#7C3324' }} />
      <div className="absolute bottom-0 -left-8 w-52 h-20 rounded-[50%]" style={{ background: '#67251D' }} />
      <div className="absolute bottom-2 -right-12 w-44 h-24 rounded-[50%]" style={{ background: '#772D22' }} />

      <div className="absolute top-5 left-5 text-2xl">🏯</div>
      <div className="absolute top-9 right-6 text-xl">✦</div>
      <div className="absolute top-[185px] right-4 text-lg">⚔</div>
      <div className="absolute top-[270px] left-5 text-lg">✦</div>
      <div className="absolute bottom-10 right-8 text-xl">⚜</div>

      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 360 470" fill="none" aria-hidden="true">
        <path
          d="M88 58 C92 88 275 95 260 138 C245 180 106 177 105 224 C104 267 262 265 248 310 C234 352 165 356 155 396"
          stroke="#F9EBD0"
          strokeWidth="15"
          strokeLinecap="round"
        />
        <path
          d="M88 58 C92 88 275 95 260 138 C245 180 106 177 105 224 C104 267 262 265 248 310 C234 352 165 356 155 396"
          stroke="#B8782E"
          strokeWidth="5"
          strokeDasharray="7 7"
          strokeLinecap="round"
        />
      </svg>

      {chapters.slice(0, NODE_POSITIONS.length).map((chapter, index) => {
        const position = NODE_POSITIONS[index]
        const isLocked = chapter.status === 'locked'
        const isCurrent = chapter.status === 'current'
        const nodeColor = isLocked ? '#8B6347' : isCurrent ? '#B52B25' : '#264B5B'

        return (
          <div
            key={chapter.id}
            className="absolute -translate-x-1/2"
            style={{ left: position.left, top: position.top }}
          >
            <button
              onClick={isLocked ? undefined : () => onChapter(chapter.id)}
              disabled={isLocked}
              aria-label={`Chương ${chapter.id}: ${chapter.year}`}
              className="relative z-10 w-[62px] h-[62px] rounded-full flex flex-col items-center justify-center transition-transform active:scale-95 disabled:cursor-not-allowed"
              style={{
                background: nodeColor,
                color: '#FFF4D8',
                border: '4px solid #F9EBD0',
                boxShadow: `0 4px 0 ${isLocked ? '#5D3C2A' : isCurrent ? '#731A17' : '#183441'}, 0 7px 12px rgba(53,20,10,0.3)`,
              }}
            >
              <span className="font-serif font-black text-sm leading-none">{chapter.year}</span>
              {isLocked ? (
                <span className="text-xs mt-0.5">🔒</span>
              ) : isCurrent ? (
                <span className="font-sans font-bold text-[8px] mt-0.5">ĐANG HỌC</span>
              ) : (
                <span className="text-xs mt-0.5">✓</span>
              )}
            </button>
            <div
              className="absolute top-1/2 -translate-y-1/2 w-24"
              style={{
                left: position.labelSide === 'right' ? 72 : undefined,
                right: position.labelSide === 'left' ? 72 : undefined,
                textAlign: position.labelSide === 'right' ? 'left' : 'right',
              }}
            >
              <div className="font-serif font-bold text-[11px] leading-tight" style={{ color: '#3D1A00' }}>
                {chapter.title}
              </div>
              <div className="font-hand text-[11px] leading-tight" style={{ color: '#6D2A1D' }}>
                Chương {String(chapter.id).padStart(2, '0')}
              </div>
            </div>
          </div>
        )
      })}

      <div
        className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full font-hand text-sm whitespace-nowrap"
        style={{ background: '#F7E1B2', color: '#6E251B', border: '1px solid rgba(93,38,22,0.28)' }}
      >
        Hành trình khám phá lịch sử
      </div>
    </div>
  )
}

