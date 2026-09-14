import brandLogo from '../../imports/su-chill-logo-transparent.png'

export default function TopBar({ xp, streak, achievements }: { xp: number; streak: number; achievements: number }) {
  return (
    <div
      className="relative flex items-center justify-between px-4 py-2 shrink-0"
      style={{ borderBottom: '1.5px solid rgba(61,26,0,0.12)' }}
    >
      <div className="flex items-center gap-1.5">
        <span className="text-base">🔥</span>
        <div>
          <div className="font-serif font-bold text-sm leading-none" style={{ color: '#C4341A' }}>{streak}</div>
          <div className="font-hand text-[10px] leading-none" style={{ color: '#7A4020' }}>NGÀY</div>
        </div>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5" aria-label="Sử Chill">
        <img
          src={brandLogo}
          alt="Logo Sử Chill"
          className="w-10 h-9 object-contain shrink-0"
        />
        <span
          className="font-serif font-bold text-base whitespace-nowrap"
          style={{ color: '#3D1A00', letterSpacing: '0.03em' }}
        >
          Sử chill
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <span className="text-sm">⭐</span>
          <span className="font-sans font-bold text-xs" style={{ color: '#7A4020' }}>{xp}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-sm">🏆</span>
          <span className="font-sans font-bold text-xs" style={{ color: '#7A4020' }}>{achievements}</span>
        </div>
      </div>
    </div>
  )
}

// ─── Bottom Nav ───────────────────────────────────────────────────────────────
