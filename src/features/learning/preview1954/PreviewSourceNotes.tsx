import { Card } from '../../../components/ui'
import { theme } from '../../../theme/tokens'
import { referenceSources } from '../../../services/reference1954/sourceNotes'

export function PreviewSourceNotes({ corrected = false }: { corrected?: boolean }) {
  return <Card className="space-y-2" data-testid="preview1954-source-notes">
    <p className="text-sm" style={{ color: theme.colors.textSecondary }}>Hình ảnh và SỬu là minh họa, không phải tư liệu hoặc lời chứng lịch sử.</p>
    <div data-testid="preview1954-context-note" className="space-y-2">
      <h2 className="text-base font-bold">Lưu ý bối cảnh</h2>
      {corrected
        ? <p className="text-sm">Tập này giới thiệu chiến cục Đông Xuân 1953–1954. Bản v2 đã sửa lời dẫn và cảnh kết thành “điểm quyết chiến chiến lược của hai bên”, phù hợp với phạm vi cuộc đối đầu Đông Xuân 1953–1954. Bản sửa đang chờ nghiệm thu nội dung và lượt nghe cuối.</p>
        : <p className="text-sm">Tập này giới thiệu chiến cục Đông Xuân 1953–1954. Cụm “tâm điểm của cả cuộc chiến” ở cuối video diễn đạt quá rộng. Cách diễn đạt phù hợp với phạm vi tập này là “điểm quyết chiến chiến lược của hai bên” trong cuộc đối đầu Đông Xuân 1953–1954.</p>}
    </div>
    <details>
      <summary className="min-h-11 cursor-pointer py-3 font-bold">Nguồn tham khảo</summary>
      <ul className="space-y-3 text-sm" aria-label="Nguồn tham khảo Tập 1">
        {referenceSources.map(source => <li key={source.id}>
          <a className="inline-flex min-h-11 items-center font-bold underline" style={{ color: theme.colors.primary }} href={source.url} target="_blank" rel="noreferrer">{source.title}</a>
          <p style={{ color: theme.colors.textSecondary }}>{source.publisher}</p>
        </li>)}
      </ul>
    </details>
  </Card>
}
