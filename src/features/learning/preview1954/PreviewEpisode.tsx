import { PreviewSourceNotes } from './PreviewSourceNotes'
import { getReferenceLearningServices } from '../../../services/reference1954/browserPreview'
import { previewContext } from '../../../services/reference1954/localPreview'
import { VideoLessonPlayer } from '../video/VideoLessonPlayer'
import { theme } from '../../../theme/tokens'
import { PreviewTranscript } from './PreviewTranscript'
import { StudyCompanion } from './StudyCompanion'
import { lessonOneCandidate } from '../../../services/reference1954/candidateLessons'
import { useState } from 'react'
import { Button } from '../../../components/ui'
import { correctedTranscript, getCorrectedLearningServices } from '../../../services/reference1954/correctedPreview'

export default function PreviewEpisode() {
  const [corrected, setCorrected] = useState(false)
  return <div className="space-y-3">
    <Button variant="outline" onClick={() => setCorrected(value => !value)} className="w-full">{corrected ? 'ĐỐI CHIẾU VIDEO GỐC' : 'XEM BẢN VIDEO ĐÃ SỬA LỜI DẪN'}</Button>
    <p className="text-sm" style={{ color: theme.colors.textSecondary }}>Video tải khoảng {corrected ? '16' : '19'} MB trước khi phát. Tiến độ xem được lưu trên máy này.</p>
    <PreviewSourceNotes corrected={corrected} />
    <VideoLessonPlayer key={corrected ? 'corrected-v2' : 'original-v1'} services={corrected ? getCorrectedLearningServices() : getReferenceLearningServices()} context={previewContext}
      transcriptContent={false}
      attributionContent={<details className="border-t pt-2 text-sm" style={{ color: theme.colors.textSecondary }}>
        <summary className="min-h-11 cursor-pointer py-3 font-medium">Thông tin video</summary>
        <p className="pb-2 leading-relaxed">{corrected ? 'Bản sửa lời dẫn và đoạn kết v2 đang chờ nghiệm thu.' : 'Bản tham khảo gốc do Trúc bàn giao.'} Media sử dụng theo quyết định PO.</p>
      </details>} />
    {corrected ? <details className="rounded-xl border p-3"><summary className="min-h-11 cursor-pointer py-2 font-bold">Đọc bản chép lời</summary><p className="whitespace-pre-wrap text-sm leading-7">{correctedTranscript}</p></details> : <PreviewTranscript />}
    <p className="text-sm" style={{ color: theme.colors.textSecondary }}>Video có phụ đề trong hình. Bạn có thể tắt phụ đề bổ sung nếu thấy chữ trùng nhau.</p>
    <StudyCompanion lesson={lessonOneCandidate} />
  </div>
}
