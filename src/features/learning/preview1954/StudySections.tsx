import { Card } from '../../../components/ui'
import type { StudySection } from '../../../services/reference1954/candidateTypes'

export function StudySections({ sections }: { sections: StudySection[] }) {
  return <div className="space-y-4" data-testid="study-sections">{sections.map((section, index) => <Card key={section.id} className="space-y-3">
    <h2 className="text-lg font-bold">{index + 1}. {section.title}</h2>
    {section.paragraphs.map(paragraph => <p key={`${section.id}.${paragraph}`} className="text-sm leading-7 break-words">{paragraph}</p>)}
  </Card>)}</div>
}
