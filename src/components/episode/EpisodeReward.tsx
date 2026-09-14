import { episodeQuestions } from '../../models/episode'
import { PrimaryButton } from './EpisodeChrome'

export default function EpisodeReward({ score, onBack }: { score: number; onBack: () => void }) {
  const perfect = score === episodeQuestions.length
  return (
    <div className="pt-8 animate-bubble-in">
      <div className="rounded-xl p-5 text-center" style={{ background: '#FFF9EC', border: '1px solid rgba(48,40,32,0.16)', boxShadow: '2px 4px 0 rgba(48,40,32,0.1)' }}>
        <div className="font-hand text-sm" style={{ color: '#69705C' }}>TẬP 01 HOÀN THÀNH</div>
        <div className="font-serif font-bold text-2xl leading-tight mt-1" style={{ color: '#302820' }}>BỐI CẢNH TRƯỚC ĐIỆN BIÊN PHỦ</div>
        <div className="inline-block mt-5 px-4 py-2 rotate-[-4deg] font-serif font-bold text-lg" style={{ color: '#A84D3F', border: '3px double #A84D3F' }}>ĐÃ KHÁM PHÁ</div>
        <div className="grid grid-cols-3 gap-2 mt-6">
          <div><div className="font-serif font-bold text-xl" style={{ color: '#35495B' }}>+50</div><div className="font-hand text-xs" style={{ color: '#69705C' }}>XP</div></div>
          <div><div className="font-serif font-bold text-xl" style={{ color: '#35495B' }}>{score}/3</div><div className="font-hand text-xs" style={{ color: '#69705C' }}>câu đúng</div></div>
          <div><div className="font-serif font-bold text-xl" style={{ color: '#35495B' }}>4:18</div><div className="font-hand text-xs" style={{ color: '#69705C' }}>phút</div></div>
        </div>
        {perfect && <div className="mt-4 font-sans text-xs font-bold tracking-wider" style={{ color: '#A84D3F' }}>PERFECT · KHÔNG CÓ CÂU TRẢ LỜI SAI</div>}
      </div>
      <div className="mt-5 font-hand text-sm" style={{ color: '#69705C' }}>TẬP TIẾP THEO</div>
      <div className="mt-2 rounded-xl p-4 overflow-hidden relative" style={{ background: '#35495B', color: '#FFF9EC' }}>
        <div className="absolute -right-4 -top-8 text-8xl opacity-10">?</div>
        <div className="relative font-hand text-xs" style={{ color: '#E9C879' }}>TẬP 02</div>
        <div className="relative font-serif font-bold text-lg">VÌ SAO LÀ ĐIỆN BIÊN PHỦ?</div>
        <div className="relative font-sans text-xs leading-relaxed mt-1" style={{ color: 'rgba(255,249,236,0.82)' }}>Một thung lũng giữa núi rừng Tây Bắc lại trở thành nơi Pháp tin rằng họ có thể giành lợi thế quyết định. Vì sao?</div>
      </div>
      <PrimaryButton onClick={onBack}>XEM TẬP 02 →</PrimaryButton>
      <button onClick={onBack} className="w-full py-4 font-sans text-xs" style={{ color: '#35495B' }}>VỀ CHƯƠNG 1954</button>
    </div>
  )
}

// ─── Lesson Complete Screen ───────────────────────────────────────────────────
