import { useEffect, useRef } from 'react'
import { Button, Card } from '../../../components/ui'
import { theme } from '../../../theme/tokens'
import type { QuizFlowSession, QuizReceipt } from './quizFlowModel'

type Props = {
  session: QuizFlowSession
  receipt?: QuizReceipt
  submitting: boolean
  submissionError?: string
  answersLocked: boolean
  onToggle: (questionId: string, optionId: string) => void
  onSubmit: () => void
  onEditAfterError: () => void
  onRetryPractice: () => void
}

export function QuizFlowView({ session, receipt, submitting, submissionError, answersLocked, onToggle, onSubmit, onEditAfterError, onRetryPractice }: Props) {
  const feedback = new Map(receipt?.feedback.map(item => [item.questionId, item]) ?? [])
  const complete = session.delivery.questions.every(question => (session.answers[question.id]?.length ?? 0) > 0)
  const resultRef = useRef<HTMLElement>(null)
  useEffect(() => { if (receipt) resultRef.current?.focus() }, [receipt])
  return <section aria-labelledby="quiz-heading" className="space-y-4" data-testid="quiz-flow-v2">
    <h1 id="quiz-heading" className="font-bold text-2xl" style={{ color: theme.colors.textPrimary }}>{session.delivery.set.title}</h1>
    <p>{session.delivery.set.mode === 'practice' ? 'Luyện tập — có thể làm lại sau khi xem giải thích.' : 'Bài kiểm tra tính điểm — kết quả do hệ thống chấm.'}</p>
    {session.delivery.questions.map((question, questionIndex) => {
      const result = feedback.get(question.id)
      return <Card key={question.id} data-question-id={question.id} className="space-y-3">
        <fieldset disabled={answersLocked || submitting || Boolean(receipt)}>
          <legend className="font-bold">Câu {questionIndex + 1}: {question.prompt}</legend>
          <div className="mt-2 space-y-2">{question.options.map(option => {
            const inputId = `quiz-${question.id}-${option.id}`
            return <label key={option.id} htmlFor={inputId} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-sm p-2" style={{ border: `1px solid ${theme.colors.borderMedium}` }}>
              <input id={inputId} type="checkbox" name={question.id} checked={session.answers[question.id]?.includes(option.id) ?? false} onChange={() => onToggle(question.id, option.id)} />
              <span>{option.label}</span>
            </label>
          })}</div>
        </fieldset>
        {result && <div role="status" className="rounded-md p-3" style={{
          background: result.outcome === 'correct' ? theme.colors.correct.bg : theme.colors.incorrect.bg,
          color: result.outcome === 'correct' ? theme.colors.correct.text : theme.colors.incorrect.text,
        }}><strong>{result.outcome === 'correct' ? '✓ Chính xác' : '✗ Chưa chính xác'}</strong><p>{result.explanation}</p></div>}
      </Card>
    })}
    {submissionError && <div role="alert" className="space-y-2"><p>{submissionError}</p><p>Câu trả lời đang được khóa để thử gửi lại an toàn.</p><Button variant="outline" onClick={onEditAfterError}>SỬA CÂU TRẢ LỜI</Button></div>}
    {receipt && <section ref={resultRef} tabIndex={-1} aria-labelledby="quiz-result-heading">
      <h2 id="quiz-result-heading" className="font-bold text-xl">{receipt.mode === 'scored' ? `Kết quả: ${receipt.score}/${receipt.total}` : 'Kết quả luyện tập'}</h2>
      {receipt.mode === 'scored' && <p>{receipt.passed ? '✓ Đạt' : '✗ Chưa đạt'}</p>}
    </section>}
    {!receipt && <Button disabled={!complete || submitting} onClick={onSubmit}>{submitting ? 'ĐANG GỬI...' : submissionError ? 'THỬ GỬI LẠI' : 'NỘP BÀI'}</Button>}
    {receipt?.mode === 'practice' && <Button onClick={onRetryPractice}>LÀM LẠI BÀI LUYỆN TẬP</Button>}
  </section>
}
