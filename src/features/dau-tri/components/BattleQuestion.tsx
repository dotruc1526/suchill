import { theme } from "../../../theme/tokens";
import { Card } from "../../../components/ui/Card";
import type { GameState } from "../../../types/dauTri";

export function BattleQuestion({ state, onAnswer }: { state: GameState; onAnswer: (index: number) => void }) {
  const current = state.currentQuestion;
  if (!current) return null;
  const revealed = state.phase === "question_end";
  return <div className="space-y-3">
    <div className="flex justify-between text-sm" aria-live="polite">
      <span>Câu {current.questionNum}/{current.totalQuestions}</span>
      <span role="timer" aria-label="Thời gian còn lại">{state.timeLeft} giây</span>
    </div>
    <Card><h2 className="font-bold text-base">{current.question.question}</h2></Card>
    <div className="space-y-2" role="group" aria-label="Các lựa chọn trả lời">
      {current.question.options.map((option, index) => {
        const selected = state.selectedAnswer === index;
        const correct = revealed && state.answerResult?.correctIndex === index;
        const incorrect = revealed && selected && !correct;
        const feedback = correct ? theme.colors.correct : incorrect ? theme.colors.incorrect : null;
        return <button key={option.label} type="button" aria-pressed={selected}
          disabled={!state.connected || revealed || state.selectedAnswer !== null || state.timeLeft <= 0}
          onClick={() => onAnswer(index)} className="w-full min-h-11 p-3 rounded text-left text-sm"
          style={{ background: feedback?.bg || (selected ? theme.colors.correct.bg : theme.colors.cardBg), color: feedback?.text || (selected ? theme.colors.correct.text : theme.colors.textPrimary), border: `1.5px solid ${feedback?.border || (selected ? theme.colors.correct.border : theme.colors.borderMedium)}` }}>
          <strong>{option.label}.</strong> {option.text} {correct ? "— Đúng ✓" : incorrect ? "— Sai ✗" : selected ? "— Đã khóa" : ""}
        </button>;
      })}
    </div>
    <p role="status" className="text-sm">{revealed ? (state.answerResult?.correct ? "Bạn trả lời đúng." : "Bạn trả lời sai hoặc hết giờ.") : state.selectedAnswer !== null ? "Đã khóa đáp án. Chờ đối thủ hoặc hết giờ." : "Chọn một đáp án. Điểm và thời hạn do máy chủ quyết định."}</p>
    {revealed && state.answerResult?.explanation && <Card><p className="text-sm">{state.answerResult.explanation}</p></Card>}
  </div>;
}
