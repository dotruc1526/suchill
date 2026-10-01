import type { DomainLearningDocument, DomainDocumentSection } from '../../src/types/index.ts'
import type { LearningDocument, DocumentSection } from '../../src/types/v2/index.ts'

const sections: DomainDocumentSection[] = [
  { id: 'p1', kind: 'paragraph', text: 'Nội dung' },
  { id: 'h1', kind: 'heading', text: 'Tiêu đề', level: 2 },
  { id: 'k1', kind: 'key_points', items: ['Ý chính'] },
]
const document: DomainLearningDocument = {
  id: 'doc', title: 'Bài đọc', locale: 'vi-VN', sections, sourceIds: [], status: 'published',
}
const canonical: LearningDocument = document
const section: DocumentSection = sections[0]
// @ts-expect-error locale is mandatory on the public document contract
const missingLocale: DomainLearningDocument = { id: 'doc', title: '', sections, sourceIds: [], status: 'draft' }
// @ts-expect-error sections require stable IDs
const missingId: DomainDocumentSection = { kind: 'paragraph', text: 'Text' }
// @ts-expect-error paragraph sections require text rather than list items
const wrongShape: DomainDocumentSection = { id: 'p', kind: 'paragraph', items: ['Text'] }
// @ts-expect-error legacy fixed arrays do not satisfy the structured document contract
const legacy: DomainLearningDocument = { id: 'doc', title: '', locale: 'vi-VN', paragraphs: [], keyPoints: [], sourceIds: [], status: 'draft' }
void [canonical, section, missingLocale, missingId, wrongShape, legacy]
