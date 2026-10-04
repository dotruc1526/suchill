import { Card } from '../../../components/ui'
import { theme } from '../../../theme/tokens'
import { draftLessons } from '../../../services/reference1954/draftLessons'
import type { DraftView } from '../../../services/reference1954/catalog'
import { candidateLessons } from '../../../services/reference1954/candidateLessons'
import { StudySections } from './StudySections'
import { StudyKnowledgeCheck } from './StudyKnowledgeCheck'

export default function PreviewDraftLesson({ view }: { view: DraftView }) {
  const lesson = draftLessons[view]
  const candidate = candidateLessons[view]
  return <div className="space-y-4" data-testid="preview1954-draft-lesson">
    <p className="text-sm" style={{ color: theme.colors.textMuted }}>Bản nháp từ đề cương chương 1954 · Nội dung đang chờ review · Không tính XP.</p>
    <Card className="space-y-3"><h2 className="font-bold">Bạn sẽ tìm hiểu gì?</h2><p className="text-sm leading-7">{candidate.objective}</p></Card>
    <details className="rounded-xl border p-3" style={{ borderColor: theme.colors.borderMedium }}><summary className="min-h-11 cursor-pointer py-2 font-bold">Tóm tắt ba ý chính</summary><ol className="space-y-3">{lesson.points.map((point, index) => <li key={point} className="text-sm leading-7">{index + 1}. {point}</li>)}</ol></details>
    <StudySections sections={candidate.sections} />
    <h2 className="text-lg font-bold">Thử kiểm tra điều bạn vừa học</h2>
    <p className="text-sm">Chọn một câu trả lời rồi kiểm tra. Nếu chưa đúng, bạn có thể đọc giải thích và thử lại.</p>
    <div className="space-y-4">{candidate.checks.map((check, index) => <StudyKnowledgeCheck key={check.id} check={check} number={index + 1} />)}</div>
    <Card className="space-y-3"><h2 className="font-bold">Điều cần nhớ</h2><p className="text-sm leading-7">{candidate.takeaway}</p></Card>
    <Card className="space-y-3"><h2 className="font-bold">Thử kể lại bằng lời của bạn</h2><p className="text-sm leading-7">{candidate.reflection}</p><p className="text-sm" style={{ color: theme.colors.textMuted }}>Câu hỏi suy ngẫm không có đáp án đúng hoặc sai. Bạn có thể tự kể lại, không cần gửi thông tin cá nhân.</p></Card>
    <p className="text-sm" style={{ color: theme.colors.textMuted }}>Nội dung đọc và câu hỏi là bản nháp để góp ý; chưa ghi hoàn thành hoặc tính XP. Video và Visual Novel của tập này chưa được hoàn thiện.</p>
  </div>
}
