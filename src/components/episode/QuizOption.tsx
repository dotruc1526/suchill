
export default function QuizOption({ index, option, selected, correct, onClick }: { index: number; option: string; selected: number | null; correct: number; onClick: () => void }) {
  const revealed = selected !== null
  const isCorrect = index === correct
  const isSelected = index === selected
  const background = revealed && isCorrect ? '#E8EEE3' : revealed && isSelected ? '#F3DEDA' : '#FFF9EC'
  const border = revealed && isCorrect ? '#69705C' : revealed && isSelected ? '#A84D3F' : 'rgba(48,40,32,0.16)'

  return (
    <button onClick={onClick} className="w-full text-left min-h-14 rounded-lg px-4 py-3" style={{ background, border: `1.5px solid ${border}` }}>
      <div className="flex items-center gap-3">
        <span className="w-7 h-7 rounded-full flex items-center justify-center font-sans font-bold text-xs shrink-0" style={{ background: '#E6D5B9', color: '#35495B' }}>{String.fromCharCode(65 + index)}</span>
        <span className="font-sans text-sm leading-snug" style={{ color: '#302820' }}>{option}</span>
        {revealed && isCorrect && <span className="ml-auto" style={{ color: '#69705C' }}>✓</span>}
      </div>
    </button>
  )
}

