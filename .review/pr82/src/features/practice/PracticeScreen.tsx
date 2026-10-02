import Mascot from '../../Mascot'

export function PracticeScreen() {
  const periods = [
    { year: '1954', items: ['Bối cảnh', 'Diễn biến', 'Ý nghĩa'], progress: [0.9, 0.6, 0.4] },
    { year: '1965', items: ['Bối cảnh', 'Nguyên nhân', 'Kết quả'], progress: [0.7, 0.4, 0.0] },
  ]

  return (
    <div className="px-4 pb-4">
      <div className="pt-4 pb-3">
        <div className="font-serif font-bold text-xl" style={{ color: '#3D1A00' }}>LUYỆN TẬP</div>
        <div className="font-sans text-xs mt-0.5" style={{ color: '#7A4020' }}>Ôn lại những gì bạn đã học</div>
      </div>

      {/* Smart review */}
      <div
        className="paper-card rounded-lg p-4 mb-4"
        style={{ borderLeft: '4px solid #1E2D5A' }}
      >
        <div className="flex items-start gap-3">
          <Mascot emotion="idea" size={64} />
          <div className="flex-1">
            <div className="font-serif font-bold text-sm" style={{ color: '#1E2D5A' }}>ÔN TẬP THÔNG MINH</div>
            <div className="font-sans text-xs mt-1 leading-relaxed" style={{ color: '#5A3010' }}>
              Bạn đang gặp khó khăn ở phần <strong>DIỄN BIẾN</strong> và <strong>Ý NGHĨA</strong>.
            </div>
            <button
              className="mt-2 px-3 py-1.5 font-sans font-bold text-xs rounded-sm transition-transform active:scale-95"
              style={{ background: '#1E2D5A', color: '#F5E6D0' }}
            >
              ÔN NGAY (3 phút) ›
            </button>
          </div>
        </div>
      </div>

      {/* Period selector */}
      <div className="font-hand text-sm mb-3" style={{ color: '#A0622A' }}>Chọn giai đoạn để luyện tập:</div>

      {periods.map(p => (
        <div key={p.year} className="paper-card rounded-lg p-4 mb-3">
          <div className="font-serif font-bold text-2xl mb-3" style={{ color: '#8B1A1A' }}>{p.year}</div>
          <div className="space-y-2.5">
            {p.items.map((item, i) => (
              <div key={item}>
                <div className="flex justify-between mb-1">
                  <div className="font-sans text-xs" style={{ color: '#3D1A00' }}>{item}</div>
                  <div className="font-hand text-xs" style={{ color: '#A0622A' }}>
                    {Math.round(p.progress[i] * 100)}%
                  </div>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#E8D5BA' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${p.progress[i] * 100}%`,
                      background: p.progress[i] > 0.7 ? '#3A5A2A' : p.progress[i] > 0.4 ? '#8B1A1A' : '#C4341A',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <button
            className="mt-3 w-full py-2 font-sans font-bold text-xs rounded-sm transition-transform active:scale-95"
            style={{ background: '#8B1A1A', color: '#F5E6D0', letterSpacing: '0.08em' }}
          >
            LUYỆN TẬP ›
          </button>
        </div>
      ))}
    </div>
  )
}

