import { theme } from "../../../theme/tokens";
import { Card } from "../../../components/ui/Card";
import type { GameState } from "../../../types/dauTri";

export function BattleQuestion({ state, onAnswer }: { state: GameState; onAnswer: (index: number) => void }) {
  const current = state.currentQuestion;
  if (!current) return null;
  const revealed = state.phase === "question_end";
  return <div className="space-y-3">
    <Card className="!py-2 flex items-center justify-between text-xs"><span>⭐ EXP trong trận: <strong>{state.myExpEarned}</strong></span><span>🔥 Chuỗi đúng: <strong>×{state.myCombo}</strong></span></Card>
    <Card className="!p-3 space-y-2">
      <div className="flex justify-between text-xs font-bold"><span>⏳ KHẮC THỜI GIAN</span><span role="timer" aria-label="Thời gian còn lại" style={{ color: state.timeLeft <= 5 ? theme.colors.incorrect.text : theme.colors.textPrimary }}>{state.timeLeft} giây</span></div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: theme.colors.progressTrack }}><div className="h-full" style={{ width: `${Math.max(0, Math.min(100, state.timeLeft / current.timeLimit * 100))}%`, background: state.timeLeft <= 5 ? theme.colors.incorrect.border : theme.colors.correct.border }} /></div>
    </Card>
    <Card className="text-center space-y-3"><p className="text-xs font-bold" style={{ color: theme.colors.textSecondary }}>CÂU HỎI {current.questionNum}/{current.totalQuestions} • {current.question.eraYear}</p><h2 className="font-bold text-base">{current.question.question}</h2><p className="text-xs" style={{ color: theme.colors.textMuted }}>{current.question.era}</p></Card>
    <div className="space-y-2" role="group" aria-label="Các lựa chọn trả lời">
      {current.question.options.map((option, index) => {
        const selected = state.selectedAnswer === index;
        const correct = revealed && state.answerResult?.correctIndex === index;
        const incorrect = revealed && selected && !correct;
        const feedback = correct ? theme.colors.correct : incorrect ? theme.colors.incorrect : null;
        return <button key={option.label} type="button" aria-pressed={selected}
          disabled={!state.connected || revealed || state.selectedAnswer !== null || state.timeLeft <= 0}
          onClick={() => onAnswer(index)} className="w-full min-h-11 p-3 rounded-xl text-left text-sm"
          style={{ background: feedback?.bg || (selected ? theme.colors.correct.bg : theme.colors.cardBg), color: feedback?.text || (selected ? theme.colors.correct.text : theme.colors.textPrimary), border: `1.5px solid ${feedback?.border || (selected ? theme.colors.correct.border : theme.colors.borderMedium)}` }}>
          <strong>{option.label}.</strong> {option.text} {correct ? "— Đúng ✓" : incorrect ? "— Sai ✗" : selected ? "— Đã khóa" : ""}
        </button>;
      })}
    </div>
    <p role="status" className="text-sm">{revealed ? (state.answerResult?.correct ? "Bạn trả lời đúng." : "Bạn trả lời sai hoặc hết giờ.") : state.selectedAnswer !== null ? "Đã khóa đáp án. Chờ đối thủ hoặc hết giờ." : "Chọn một đáp án để khóa câu trả lời."}</p>
    {revealed && state.answerResult?.explanation && <Card><p className="text-sm">{state.answerResult.explanation}</p></Card>}
  </div>;
}
