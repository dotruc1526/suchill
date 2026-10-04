import { Card } from '../../../components/ui'
import { theme } from '../../../theme/tokens'
import { draftLessons } from '../../../services/reference1954/draftLessons'
import type { DraftView } from '../../../services/reference1954/catalog'

export default function PreviewDraftLesson({ view }: { view: DraftView }) {
  const lesson = draftLessons[view]
  return <div className="space-y-4" data-testid="preview1954-draft-lesson">
    <p className="text-sm" style={{ color: theme.colors.textMuted }}>Bản nháp từ đề cương chương 1954 · Nội dung đang chờ review · Không tính XP.</p>
    <Card className="space-y-3"><h2 className="font-bold">Bạn sẽ tìm hiểu gì?</h2><p className="text-sm leading-7">{lesson.objective}</p></Card>
    <Card className="space-y-3"><h2 className="font-bold">Nội dung bài học</h2><ol className="space-y-3">{lesson.points.map((point, index) => <li key={point} className="text-sm leading-7">{index + 1}. {point}</li>)}</ol></Card>
    <Card className="space-y-3"><h2 className="font-bold">Thử kể lại bằng lời của bạn</h2><p className="text-sm leading-7">{lesson.reflection}</p></Card>
    <p className="text-sm" style={{ color: theme.colors.textMuted }}>Video, Visual Novel và quiz của tập này chưa được hoàn thiện. Hiện bạn có thể đọc bản nháp để góp ý trước.</p>
  </div>
}
