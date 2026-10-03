import { useState } from 'react'
import { Card } from '../../components/ui'
import { createPracticeDemoServices, practiceDemoSetId } from '../../services/next/practiceDemo'
import { theme } from '../../theme/tokens'
import { QuizFlow } from '../quiz/v2'

export function PracticeScreen() {
  const [services] = useState(createPracticeDemoServices)
  return <section className="space-y-4 p-4" style={{ color: theme.colors.textPrimary }} aria-label="Luyện tập demo">
    <h1 className="font-serif text-xl font-bold">LUYỆN TẬP</h1>
    <Card className="space-y-2">
      <strong>Bài luyện tập demo · 3 câu hỏi</strong>
      <p className="text-sm">Chọn một đáp án cho mỗi câu, rồi nộp bài để xem giải thích. Bạn có thể làm lại tùy thích.</p>
      <p className="text-sm" style={{ color: theme.colors.textSecondary }}>Demo đọc hiểu tư liệu, không cộng XP, streak hay mở khóa bài học.</p>
    </Card>
    <QuizFlow services={services} questionSetId={practiceDemoSetId} />
  </section>
}
