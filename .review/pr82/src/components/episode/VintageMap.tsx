
export default function VintageMap({ selection, onSelect }: { selection: 'northwest' | 'other' | null; onSelect: (selection: 'northwest' | 'other') => void }) {
  return (
    <div className="relative h-72 mt-5 rounded-xl overflow-hidden" style={{ background: '#E9D5AD', border: '1.5px solid rgba(53,73,91,0.26)' }}>
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(#69705C 0.8px, transparent 0.8px)', backgroundSize: '10px 10px' }} />
      <div className="absolute left-1/2 top-8 -translate-x-1/2 w-24 h-52 rounded-[55%_45%_52%_48%] rotate-[9deg]" style={{ background: '#D8C393', border: '2px solid #69705C' }} />
      <button onClick={() => onSelect('northwest')} className="absolute left-[28%] top-[22%] w-24 h-16 rounded-lg font-sans text-xs font-bold" style={{ background: selection === 'northwest' ? '#A84D3F' : '#FFF9EC', color: selection === 'northwest' ? '#FFF9EC' : '#35495B', border: '1.5px solid #A84D3F' }}>TÂY BẮC</button>
      <button onClick={() => onSelect('other')} className="absolute right-[14%] top-[48%] w-24 h-14 rounded-lg font-sans text-xs font-bold" style={{ background: selection === 'other' ? '#C79A59' : '#FFF9EC', color: '#35495B', border: '1.5px solid rgba(53,73,91,0.35)' }}>MIỀN TRUNG</button>
      <button onClick={() => onSelect('other')} className="absolute left-[20%] bottom-[10%] w-24 h-14 rounded-lg font-sans text-xs font-bold" style={{ background: selection === 'other' ? '#C79A59' : '#FFF9EC', color: '#35495B', border: '1.5px solid rgba(53,73,91,0.35)' }}>ĐỒNG BẰNG</button>
      {selection === 'northwest' && <div className="absolute left-[42%] top-[16%] text-3xl animate-bounce">📍</div>}
      <div className="absolute bottom-3 right-4 font-hand text-xs" style={{ color: '#69705C' }}>Bản đồ minh họa</div>
    </div>
  )
}

