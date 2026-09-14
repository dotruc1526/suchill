import InteractionChoice from './InteractionChoice'
import VintageMap from './VintageMap'

export default function EpisodeInteraction({ index, correct, onAnswer }: { index: number; correct: boolean | null; onAnswer: (correct: boolean) => void }) {
  const interactionTitles = [
    'HÃY TÌM ĐIỆN BIÊN PHỦ',
    'GHÉP ĐÚNG Ý NGHĨA',
    'CHỌN ĐÚNG BỐI CẢNH',
  ]

  return (
    <>
      <div className="font-hand text-sm" style={{ color: '#A84D3F' }}>TƯƠNG TÁC {index + 1}/3</div>
      <div className="font-serif font-bold text-2xl mt-1" style={{ color: '#302820' }}>{interactionTitles[index]}</div>

      {index === 0 && (
        <>
          <div className="font-sans text-sm leading-relaxed mt-2" style={{ color: '#5B5044' }}>Dựa vào những gì vừa xem, hãy chọn khu vực Điện Biên Phủ trên bản đồ Việt Nam.</div>
          <VintageMap selection={correct ? 'northwest' : null} onSelect={selection => onAnswer(selection === 'northwest')} />
        </>
      )}

      {index === 1 && (
        <div className="mt-5 space-y-3">
          <div className="rounded-lg p-4" style={{ background: '#FFF9EC', border: '1px solid rgba(48,40,32,0.14)' }}>
            <div className="font-hand text-xs" style={{ color: '#69705C' }}>KHÁI NIỆM</div>
            <div className="font-serif font-bold text-lg mt-1" style={{ color: '#35495B' }}>Tây Bắc</div>
          </div>
          <div className="font-sans text-xs" style={{ color: '#69705C' }}>Chạm vào ý nghĩa phù hợp:</div>
          <InteractionChoice onClick={() => onAnswer(true)}>Vị trí chiến lược quan trọng</InteractionChoice>
          <InteractionChoice onClick={() => onAnswer(false)}>Nơi tổ chức hội nghị quốc tế</InteractionChoice>
          <InteractionChoice onClick={() => onAnswer(false)}>Khu vực đồng bằng ven biển</InteractionChoice>
        </div>
      )}

      {index === 2 && (
        <div className="mt-5 space-y-3">
          <div className="font-sans text-sm leading-relaxed" style={{ color: '#5B5044' }}>Vì sao Pháp xây dựng Điện Biên Phủ thành một tập đoàn cứ điểm mạnh?</div>
          <InteractionChoice onClick={() => onAnswer(false)}>Để xây dựng một thành phố mới</InteractionChoice>
          <InteractionChoice onClick={() => onAnswer(true)}>Để kiểm soát khu vực và tạo lợi thế quân sự</InteractionChoice>
          <InteractionChoice onClick={() => onAnswer(false)}>Để mở rộng hoạt động thương mại</InteractionChoice>
        </div>
      )}
    </>
  )
}

