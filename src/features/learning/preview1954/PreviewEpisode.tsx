import { PreviewSourceNotes } from './PreviewSourceNotes'
import { getReferenceLearningServices } from '../../../services/reference1954/browserPreview'
import { previewContext } from '../../../services/reference1954/localPreview'
import { VideoLessonPlayer } from '../video/VideoLessonPlayer'
import { theme } from '../../../theme/tokens'
import { PreviewTranscript } from './PreviewTranscript'

export default function PreviewEpisode() {
  return <div className="space-y-3">
    <p className="text-sm" style={{ color: theme.colors.textSecondary }}>Video tải khoảng 19 MB trước khi phát. Tiến độ xem được lưu trên máy này.</p>
    <PreviewSourceNotes />
    <VideoLessonPlayer services={getReferenceLearningServices()} context={previewContext}
      transcriptContent={false}
      attributionContent={<details className="border-t pt-2 text-sm" style={{ color: theme.colors.textSecondary }}>
        <summary className="min-h-11 cursor-pointer py-3 font-medium">Thông tin video</summary>
        <p className="pb-2 leading-relaxed">Bản tham khảo nội bộ do Trúc bàn giao; quyền phát hành chưa được nghiệm thu.</p>
      </details>} />
    <PreviewTranscript />
    <p className="text-sm" style={{ color: theme.colors.textSecondary }}>Video có phụ đề trong hình. Bạn có thể tắt phụ đề bổ sung nếu thấy chữ trùng nhau.</p>
  </div>
}
