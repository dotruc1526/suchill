
export default function HistoricalImage() {
  return (
    <div className="relative mt-6 px-2 pb-2 rotate-[-2deg]">
      <div className="absolute z-10 left-1/2 -translate-x-1/2 -top-2 w-24 h-5 rotate-[2deg]" style={{ background: 'rgba(210,186,139,0.78)' }} />
      <div className="relative h-48 overflow-hidden rounded-sm" style={{ background: '#35495B', border: '8px solid #FFF9EC', boxShadow: '2px 4px 0 rgba(48,40,32,0.14)' }}>
        <div className="absolute inset-0 opacity-25" style={{ backgroundImage: 'linear-gradient(30deg, transparent 48%, #F4E8D2 49%, transparent 51%), linear-gradient(-45deg, transparent 48%, #F4E8D2 49%, transparent 51%)', backgroundSize: '42px 34px' }} />
        <div className="absolute left-9 top-7 w-28 h-28 rounded-full border-[16px]" style={{ borderColor: '#C79A59' }} />
        <div className="absolute right-8 bottom-7 w-28 h-2 rotate-[-18deg]" style={{ background: '#A84D3F' }} />
        <div className="absolute left-5 bottom-5 font-serif text-xl" style={{ color: '#FFF9EC' }}>Đông Dương<br />1953–1954</div>
        <div className="absolute right-3 top-3 font-hand text-xs px-2 py-1" style={{ color: '#35495B', background: '#F4E8D2' }}>MINH HỌA BỐI CẢNH</div>
      </div>
      <div className="font-hand text-sm mt-3 text-right rotate-[2deg]" style={{ color: '#A84D3F' }}>“Điều gì đã dẫn tới trận chiến này?”</div>
    </div>
  )
}

