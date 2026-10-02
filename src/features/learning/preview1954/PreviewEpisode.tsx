import { getReferenceLearningServices } from '../../../services/reference1954/browserPreview'
import { previewContext } from '../../../services/reference1954/localPreview'
import { VideoLessonPlayer } from '../video/VideoLessonPlayer'
import { theme } from '../../../theme/tokens'

export default function PreviewEpisode() {
  return <div className="space-y-3">
    <p className="text-sm" style={{ color: theme.colors.textSecondary }}>Video tải khoảng 19 MB trước khi phát. Tiến độ xem được lưu trên máy này.</p>
    <a href="/reference-media/transcript.vi.txt" target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center font-bold underline" style={{ color: theme.colors.primary }}>Mở bản chép lời</a>
    <VideoLessonPlayer services={getReferenceLearningServices()} context={previewContext} />
    <p className="text-sm" style={{ color: theme.colors.textSecondary }}>Video có phụ đề trong hình. Bạn có thể tắt phụ đề bổ sung nếu thấy chữ trùng nhau.</p>
  </div>
}
