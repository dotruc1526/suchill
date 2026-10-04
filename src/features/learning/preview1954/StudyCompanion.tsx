import { Card } from '../../../components/ui'
import type { CandidateLesson } from '../../../services/reference1954/candidateTypes'
import { StudySections } from './StudySections'
import { StudyKnowledgeCheck } from './StudyKnowledgeCheck'

export function StudyCompanion({ lesson }: { lesson: CandidateLesson }) {
  return <section className="space-y-4" aria-label="Nội dung và kiểm tra bài học">
    <StudySections sections={lesson.sections} />
    <h2 className="text-lg font-bold">Thử kiểm tra điều bạn vừa học</h2>
    {lesson.checks.map((check, index) => <StudyKnowledgeCheck key={check.id} check={check} number={index + 1} />)}
    <Card className="space-y-3"><h2 className="font-bold">Điều cần nhớ</h2><p className="text-sm leading-7">{lesson.takeaway}</p>
      <h3 className="font-bold">Thử kể lại bằng lời của bạn</h3><p className="text-sm leading-7">{lesson.reflection}</p></Card>
    <p className="text-sm">Bản nội dung đang chờ nghiệm thu. Câu hỏi ở đây giúp tự kiểm tra, không tính XP.</p>
  </section>
}
