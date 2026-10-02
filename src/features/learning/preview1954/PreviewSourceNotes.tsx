import { Card } from '../../../components/ui'
import { theme } from '../../../theme/tokens'
import { referenceSources } from '../../../services/reference1954/sourceNotes'

export function PreviewSourceNotes() {
  return <Card className="space-y-2" data-testid="preview1954-source-notes">
    <p className="text-sm" style={{ color: theme.colors.textSecondary }}>Hình ảnh và SỬu là minh họa, không phải tư liệu hoặc lời chứng lịch sử.</p>
    <details>
      <summary className="min-h-11 cursor-pointer py-3 font-bold">Bối cảnh và nguồn tham khảo</summary>
      <p className="mb-3 text-sm">Tập này dẫn nhập chiến cục Đông Xuân 1953–1954. Cụm “tâm điểm của cả cuộc chiến” ở cuối video là cách dẫn chuyện rộng; phạm vi đang học là cuộc đối đầu Đông Xuân 1953–1954.</p>
      <ul className="space-y-3 text-sm" aria-label="Nguồn tham khảo Tập 1">
        {referenceSources.map(source => <li key={source.id}>
          <a className="inline-flex min-h-11 items-center font-bold underline" style={{ color: theme.colors.primary }} href={source.url} target="_blank" rel="noreferrer">{source.title}</a>
          <p style={{ color: theme.colors.textSecondary }}>{source.publisher}</p>
        </li>)}
      </ul>
    </details>
  </Card>
}
